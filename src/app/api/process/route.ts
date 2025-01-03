import { NextRequest, NextResponse } from "next/server";
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import openAiPeticion from "@/lib/processgpt";
import { geminiPetition } from "@/lib/processgemini";
// Configuración de timeout y límites
const EXTRACTION_TIMEOUT = 120000; // 30 segundos
const MAX_URL_COUNT = 5; // Límite de URLs a procesar
const MAX_TEXT_LENGTH = 100000; // Límite de caracteres por sitio

// Lista negra de dominios mejorada
const DOMAIN_BLACKLIST = new Set([
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
    "gov.cl", // Ejemplo de dominio gubernamental
    "edu.pe", // Ejemplo de dominio educativo
]);

export async function POST(request: NextRequest) {
    try {
        // Parsear las URLs del cuerpo de la solicitud
        const { urls, procesador } = await request.json();
        console.log("urls: ", urls)
        // Validar entrada
        if (!Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: "Se requiere un array de URLs válidas" },
                { status: 400 }
            );
        }

        // Limitar número de URLs
        const processUrls = urls
            .filter(url => typeof url === "string" && url.startsWith("http"))
            .slice(0, MAX_URL_COUNT);

        const browser = await puppeteer.launch({
            args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
        });

        // Función de extracción de texto con mejor manejo de errores
        async function safeExtractTextFromSite(url: string) {
            // Validar URL
            if (isBlacklisted(url)) {
                return {
                    url,
                    text: "URL no permitida",
                    error: "Dominio bloqueado"
                };
            }

            try {
                const page = await browser.newPage();

                // Configurar tiempo de espera
                await page.setDefaultTimeout(EXTRACTION_TIMEOUT);

                // Navegar con manejo de errores
                await page.goto(url, {
                    waitUntil: "networkidle2",
                    timeout: EXTRACTION_TIMEOUT
                });

                // Scroll optimizado
                await page.evaluate(async () => {
                    await new Promise<void>((resolve) => {
                        const scrollHeight = document.body.scrollHeight;
                        let currentHeight = 0;
                        const scrollStep = 500;

                        const scrollInterval = setInterval(() => {
                            window.scrollBy(0, scrollStep);
                            currentHeight += scrollStep;

                            if (currentHeight >= scrollHeight) {
                                clearInterval(scrollInterval);
                                resolve();
                            }
                        }, 100);
                    });
                });

                // Extraer texto con límite de longitud
                const extractedText = await page.evaluate((maxLength) => {
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

                    const text = getVisibleText(document.body);
                    return text.slice(0, maxLength);
                }, MAX_TEXT_LENGTH);

                await page.close();

                return {
                    url,
                    text: cleanWebText(extractedText),
                    error: null
                };

            } catch (error) {
                return {
                    url,
                    text: "",
                    error: error instanceof Error ? error.message : "Error desconocido"
                };
            }
        }

        // Función para verificar dominios bloqueados
        function isBlacklisted(url: string): boolean {
            try {
                // Validar que la URL tiene un esquema correcto
                const parsedUrl = new URL(url);

                // Comparar el hostname con los dominios bloqueados
                return Array.from(DOMAIN_BLACKLIST).some(domain =>
                    parsedUrl.hostname.endsWith(domain)
                );
            } catch (error) {
                console.warn(`URL inválida: ${url}; `, error);
                return true; // Retorna true si la URL no se puede parsear
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

        // Procesar todas las URLs en paralelo
        const extractionResults = await Promise.all(
            processUrls.map(url => safeExtractTextFromSite(url))
        );

        // Cerrar navegador
        await browser.close();
        console.log("se cerro el navegador", typeof extractionResults);
        if (procesador === 0) {
            const data = await openAiPeticion(extractionResults)
            return NextResponse.json({
                message: "Extracción completada",
                results: data,
                extract: extractionResults,
                //results: extractionResults
            });
        } else if (procesador === 1) {
            const data = await geminiPetition(extractionResults)
            return NextResponse.json({
                message: "Extracción completada",
                results: data,
                extract: extractionResults,
                //results: extractionResults
            });
        }


    } catch (error) {
        console.error("Error en extracción web:", error);
        return NextResponse.json(
            {
                message: "Error en extracción",
                error: error instanceof Error ? error.message : "Error desconocido"
            },
            { status: 500 }
        );
    }
}