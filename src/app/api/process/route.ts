import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { geminiPetition } from "@/lib/processgemini";

// Interfaces y tipos
interface ExtractionResult {
    url: string;
    text: string;
    error: string | null;
}

interface RequestBody {
    urls: string[];
    procesador: number;
}
interface ProcessedResult {
    summary?: string;
    analysis?: string;
    keywords?: string[];
    mainPoints?: string[];
    error?: string;
}
interface ApiResponse {
    message: string;
    results?: ProcessedResult;
    extract?: ExtractionResult[];
    error?: string;
}

// Configuración
const EXTRACTION_TIMEOUT = 3000000; // 30 segundos
const MAX_URL_COUNT = 5000;
const MAX_TEXT_LENGTH = 100000;
const SCROLL_TIMEOUT = 1500000; // 15 segundos para el scroll

// Lista negra de dominios
const DOMAIN_BLACKLIST: Set<string> = new Set([
    "google.com",
    "facebook.com",
    "twitter.com",
    "linkedin.com",
    "youtube.com",
    "instagram.com",
    "wikipedia.org",
    "amazon.com",
    "apple.com",
    "microsoft.com",
    "gov.cl",
    "edu.pe",
]);

// Función para verificar dominios bloqueados
function isBlacklisted(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return Array.from(DOMAIN_BLACKLIST).some(domain =>
            parsedUrl.hostname.endsWith(domain)
        );
    } catch (error) {
        console.warn(`URL inválida: ${url}; `, error);
        return true;
    }
}

// Función de limpieza de texto
function cleanWebText(rawText: string): string {
    return rawText
        .replace(/\t+/g, " ")
        .replace(/\n+/g, "\n")
        .replace(/\s+/g, " ")
        .trim();
}

// Función de scroll con timeout
async function scrollWithTimeout(page: Page): Promise<void> {
    await page.evaluate(async (timeout: number) => {
        return new Promise<void>((resolve) => {
            const startTime = Date.now();
            const scrollStep = 500;

            function scroll() {
                window.scrollBy(0, scrollStep);

                // Verificar si se alcanzó el final o si el tiempo ha expirado
                if (Date.now() - startTime > timeout || window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
                    resolve();
                } else {
                    requestIdleCallback(scroll);
                }
            }

            requestIdleCallback(scroll);
        });
    }, SCROLL_TIMEOUT);
}


// Función para extraer texto visible
function getVisibleText(element: Element): string {
    if (
        element.tagName === "SCRIPT" ||
        element.tagName === "STYLE" ||
        element.tagName === "NOSCRIPT"
    ) {
        return "";
    }

    let visibleText = "";
    for (const child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            visibleText += (child as Text).textContent?.trim() + " ";
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            visibleText += getVisibleText(child as Element);
        }
    }
    return visibleText;
}

async function safeExtractTextFromSite(url: string, browser: Browser): Promise<ExtractionResult> {
    if (isBlacklisted(url)) {
        return {
            url,
            text: "URL no permitida",
            error: "Dominio bloqueado"
        };
    }

    let page: Page | null = null;
    try {
        console.log(`Iniciando extracción para URL: ${url}`);
        page = await browser.newPage();

        // Configurar timeouts para navegación y espera
        await page.setDefaultNavigationTimeout(EXTRACTION_TIMEOUT);
        await page.setDefaultTimeout(EXTRACTION_TIMEOUT);

        // Interceptar y cancelar recursos innecesarios
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(request.resourceType())) {
                request.abort();
            } else {
                request.continue();
            }
        });

        // Navegar a la página y esperar que se cargue completamente
        await page.goto(url, {
            waitUntil: 'networkidle2', // Asegura que la página haya terminado de cargar
            timeout: EXTRACTION_TIMEOUT
        });

        console.log(`Iniciando scroll para URL: ${url}`);
        await scrollWithTimeout(page);
        console.log(`Scroll completado para URL: ${url}`);

        // Verificar si la página contiene texto antes de continuar
        const extractedText = await page.evaluate((maxLength: number) => {
            const text = getVisibleText(document.body);
            return text.slice(0, maxLength);
        }, MAX_TEXT_LENGTH);

        if (!extractedText) {
            throw new Error("No se encontró texto en la página.");
        }

        console.log(`Extracción completada para URL: ${url}`);
        return {
            url,
            text: cleanWebText(extractedText),
            error: null
        };

    } catch (error) {
        console.error(`Error al extraer texto de ${url}:`, error);

        return {
            url,
            text: "",
            error: error instanceof Error ? `Error: ${error.message}` : "Error desconocido"
        };
    } finally {
        if (page) {
            await page.close().catch(() => {});
        }
    }
}


// Procesar URLs secuencialmente
async function processUrlsSequentially(urls: string[], browser: Browser): Promise<ExtractionResult[]> {
    const results: ExtractionResult[] = [];
    for (const url of urls) {
        try {
            const result = await safeExtractTextFromSite(url, browser);
            console.log("Extracción completada de urls:", result);
            results.push(result);
        } catch (error) {
            results.push({
                url,
                text: "",
                error: `Failed to process: ${error instanceof Error ? error.message : "Unknown error"}`
            });
        }
    }
    return results;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    let browser: Browser | null = null;
    try {
        const { urls }: RequestBody = await request.json();
        console.log("URLs recibidas:", urls);

        if (!Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: "Se requiere un array de URLs válidas", message: "Error de validación" },
                { status: 400 }
            );
        }

        const processUrls = urls
            .filter((url): url is string => typeof url === "string" && url.startsWith("http"))
            .slice(0, MAX_URL_COUNT);

        browser = await puppeteer.launch({
            args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: true,
        });
        console.log("Navegador iniciado correctamente");

        const extractionResults = await processUrlsSequentially(processUrls, browser);
        console.log("Extracción completada para todas las URLs");
        console.log("lo que se extrajo: ", extractionResults);

        // Preparar la petición a la API de Gemini con un timeout
        const timeoutPromise = new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error('Tiempo de espera agotado')), 60000) // 60 segundos de timeout
        );

        // Ejecutar la generación de contenido con un timeout
        let results: string = '';
        try {
            const result = await Promise.race([
                geminiPetition(extractionResults),
                timeoutPromise
            ]);
            results = result ?? 'Hubo un problema al procesar la solicitud.'; // Valor predeterminado si es undefined
        } catch (error) {
            console.error("Error durante la generación de contenido:", error);
            results = 'Hubo un problema al procesar la solicitud.';
        }
        

        return NextResponse.json({
            message: "Proceso completado exitosamente",
            results: results || {},  // Asegurarse de que `results` tenga un valor por defecto
            extract: extractionResults,
        });
        
    } catch (error) {
        console.error("Error en el proceso de extracción:", error);
        return NextResponse.json(
            {
                message: "Error en la extracción",
                error: error instanceof Error ? error.message : "Error desconocido"
            },
            { status: 500 }
        );
    } finally {
        if (browser) {
            await browser.close().catch(() => {
                console.log("Error al cerrar el navegador");
            });
        }
    }
}
