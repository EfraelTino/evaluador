import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from 'cheerio';

import { geminiPetition } from "@/lib/processgemini"; // Procesamiento con Gemini
import { connection } from "@/lib/bd";

// Interfaces y tipos
interface ExtractionResult {
    url: string;
    text: string;
    error: string | null;
}

interface RequestBody {
    urls: string[];
    userid?:string;
    procesador: number;
}

interface ProcessedResult {
    summary?: string;
    analysis?: string;
    keywords?: string[];
    mainPoints?: string[];
    error?: string;
    estado?:boolean;
    text?:string;
}

interface ApiResponse {
    message: string;
    results?: ProcessedResult | string;
    extract?: ExtractionResult[];
    error?: string;
    processingTime?: number;
}
interface InsertUrl{
    insertId: number;
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

    try {
        const body = await request.json() as RequestBody;
        const urls = Array.isArray(body?.urls) ? body.urls : null;
        const userid= body?.userid;

        if (!Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({
                message: "Error de validación",
                error: "Se requiere un array de URLs"
            }, { status: 400 });
        }

        const insertUrls:InsertUrl = await connection.query(
            "INSERT INTO landing_page_analysis (url_1, user_id, ai_used) VALUES (?, ?, ?)",
            [JSON.stringify(urls), userid, 1]
        );

        if (!insertUrls.insertId) {
            throw new Error("No se pudo obtener el ID del registro insertado");
        }

        const insertedId = insertUrls.insertId;
        console.log("El ID del registro insertado es:", insertedId);

        const validUrls = urls.filter(isValidUrl).slice(0, CONFIG.LIMITS.MAX_URL_COUNT);

        if (validUrls.length === 0) {
            throw new Error("No se proporcionaron URLs válidas");
        }

        const results = await Promise.all(validUrls.map(url => extractTextWithCheerio(url)));

        await connection.query("UPDATE landing_page_analysis SET resume = ? WHERE id = ?", [
            JSON.stringify(results),
            insertedId
        ]);

        try {
            const processedResults:ProcessedResult = await Promise.race([
                geminiPetition(results, insertedId),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout de API Gemini')), CONFIG.TIMEOUTS.API)
                )
            ]) as ProcessedResult;

            if (processedResults.estado === true) {
                return NextResponse.json({
                    message: "Procesamiento completado con éxito",
                    results: processedResults.text,
                    extract: results,
                    processingTime: Date.now() - startTime
                });
            } else {
                throw new Error("Gemini no pudo procesar el contenido");
            }
        } catch (error) {
            console.error("Error en procesamiento Gemini:", error);
            throw new Error("Falló el procesamiento en Gemini");
        }
    } catch (error) {
        console.error("Error en el procesamiento:", error);
        return NextResponse.json({
            message: "Falló el procesamiento",
            error: error instanceof Error ? error.message : "Error desconocido",
            processingTime: Date.now() - startTime
        }, { status: 500 });
    }
}

