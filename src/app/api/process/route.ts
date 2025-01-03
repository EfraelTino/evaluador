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
    results?: ProcessedResult | string;
    extract?: ExtractionResult[];
    error?: string;
    processingTime?: number;
}

// Configuración
const CONFIG = {
    TIMEOUTS: {
        EXTRACTION: 300000,      // 30 segundos
        SCROLL: 150000,          // 15 segundos
        PAGE_LOAD: 300000,       // 30 segundos
        API: 600000,             // 60 segundos
        BROWSER_LAUNCH: 30000   // 30 segundos
    },
    LIMITS: {
        MAX_URL_COUNT: 50000,
        MAX_TEXT_LENGTH: 10000000
    },
    DOMAIN_BLACKLIST: new Set([
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
        "edu.pe"
    ])
};

// Funciones de utilidad
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function cleanText(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, CONFIG.LIMITS.MAX_TEXT_LENGTH);
}

function isBlacklisted(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return Array.from(CONFIG.DOMAIN_BLACKLIST).some(domain =>
            parsedUrl.hostname.endsWith(domain)
        );
    } catch {
        console.error(`URL inválida: ${url}`);
        return true;
    }
}

// Función principal de extracción
async function safeExtractTextFromSite(url: string, browser: Browser): Promise<ExtractionResult> {
    let page: Page | null = null;
    const extractionTimeout = setTimeout(() => {
        if (page) {
            page.close().catch(console.error);
        }
        throw new Error("Tiempo de extracción excedido");
    }, CONFIG.TIMEOUTS.EXTRACTION);

    try {
        if (!isValidUrl(url)) {
            throw new Error(`Formato de URL inválido: ${url}`);
        }

        if (isBlacklisted(url)) {
            return { url, text: "Dominio bloqueado", error: "Dominio en lista negra" };
        }

        page = await browser.newPage();
        
        // Configurar página
        await page.setDefaultNavigationTimeout(CONFIG.TIMEOUTS.PAGE_LOAD);
        await page.setDefaultTimeout(CONFIG.TIMEOUTS.PAGE_LOAD);
        
        // Bloquear recursos innecesarios
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(request.resourceType())) {
                request.abort();
            } else {
                request.continue();
            }
        });

        // Navegar con timeout
        await Promise.race([
            page.goto(url, { 
                waitUntil: 'networkidle2',
                timeout: CONFIG.TIMEOUTS.PAGE_LOAD 
            }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout de navegación')), CONFIG.TIMEOUTS.PAGE_LOAD)
            )
        ]);

        // Extraer texto con timeout
        const text = await Promise.race([
            page.evaluate(() => document.body.innerText),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout de extracción de texto')), CONFIG.TIMEOUTS.EXTRACTION)
            )
        ]) as string;

        const cleanedText = cleanText(text);

        if (!cleanedText) {
            return { url, text: "", error: "No se encontró contenido de texto" };
        }

        return { url, text: cleanedText, error: null };

    } catch (error) {
        console.error(`Error procesando ${url}:`, error);
        return {
            url,
            text: "",
            error: error instanceof Error ? error.message : "Error desconocido"
        };
    } finally {
        clearTimeout(extractionTimeout);
        if (page) {
            await page.close().catch(console.error);
        }
    }
}

// Manejador de la ruta POST
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    let browser: Browser | null = null;
    const startTime = Date.now();

    try {
        const body = await request.json() as RequestBody;
        const urls = Array.isArray(body?.urls) ? body.urls : null;

        if (!urls?.length) {
            return NextResponse.json({
                message: "Error de validación",
                error: "Se requiere un array de URLs"
            }, { status: 400 });
        }

        // Iniciar navegador con timeout
        browser = await Promise.race([
            puppeteer.launch({
                args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: true,
            }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout al iniciar navegador')), CONFIG.TIMEOUTS.BROWSER_LAUNCH)
            )
        ]) as Browser;

        const validUrls = urls
            .filter(isValidUrl)
            .slice(0, CONFIG.LIMITS.MAX_URL_COUNT);

        if (!validUrls.length) {
            throw new Error("No se proporcionaron URLs válidas");
        }

        // Procesar URLs en paralelo
        const results = await Promise.all(
            validUrls.map(url => safeExtractTextFromSite(url, browser!))
          );
        // Procesar con Gemini con timeout
        let processedResults: string | ProcessedResult = '';
        try {
            processedResults = await Promise.race([
                geminiPetition(results),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout de API Gemini')), CONFIG.TIMEOUTS.API)
                )
            ]) as string;
        } catch (error) {
            console.error("Error en procesamiento Gemini:", error);
            processedResults = "Falló el procesamiento de contenido";
        }

        return NextResponse.json({
            message: "Procesamiento completado",
            results: processedResults,
            extract: results,
            processingTime: Date.now() - startTime
        });

    } catch (error) {
        console.error("Error en el procesamiento:", error);
        return NextResponse.json({
            message: "Falló el procesamiento",
            error: error instanceof Error ? error.message : "Error desconocido",
            processingTime: Date.now() - startTime
        }, { status: 500 });

    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (error) {
                console.error("Error al cerrar el navegador:", error);
            }
        }
    }
}