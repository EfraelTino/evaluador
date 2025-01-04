import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from 'cheerio';

import { geminiPetition } from "@/lib/processgemini"; // Procesamiento con Gemini

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
        .replace(/\s+/g, ' ') // Limpia los espacios extras
        .trim()
        .slice(0, CONFIG.LIMITS.MAX_TEXT_LENGTH); // Limita la longitud del texto
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

// Función para extraer texto usando Cheerio
async function extractTextWithCheerio(url: string): Promise<ExtractionResult> {
    try {
        if (!isValidUrl(url)) {
            throw new Error(`Formato de URL inválido: ${url}`);
        }

        if (isBlacklisted(url)) {
            return { url, text: "Dominio bloqueado", error: "Dominio en lista negra" };
        }

        const { data } = await axios.get(url, { timeout: CONFIG.TIMEOUTS.PAGE_LOAD });
        
        // Usar Cheerio para parsear el HTML
        const $ = cheerio.load(data);

        // Extraer todo el texto visible en el cuerpo de la página
        const text = $('body')
            .text()
            .trim();
        
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
    }
}

// Manejador de la ruta POST
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    const startTime = Date.now();

    let processedResults: string | ProcessedResult = '';

    try {
        const body = await request.json() as RequestBody;
        const urls = Array.isArray(body?.urls) ? body.urls : null;

        if (!urls?.length) {
            return NextResponse.json({
                message: "Error de validación",
                error: "Se requiere un array de URLs"
            }, { status: 400 });
        }

        // Filtrar URLs válidas
        const validUrls = urls
            .filter(isValidUrl)
            .slice(0, CONFIG.LIMITS.MAX_URL_COUNT);

        if (!validUrls.length) {
            throw new Error("No se proporcionaron URLs válidas");
        }

        // Procesar URLs en paralelo usando Cheerio
        const results = await Promise.all(
            validUrls.map(url => extractTextWithCheerio(url))
        );

        // Procesar con Gemini (la lógica de geminiPetition no cambia)
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

    }
}
