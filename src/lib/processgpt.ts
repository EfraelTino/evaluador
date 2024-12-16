import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configura el cliente de OpenAI
const openai = new OpenAI({
    apiKey: "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", // Carga la clave desde las variables de entorno
});

export default async function openAiPeticion(data) {
    try {
        let prompt = data;
        const websiteOne = {
            url: prompt[0]?.url,
            text: prompt[0]?.text
        }
        const websiteTwo = {
            url: prompt[1]?.url,
            text: prompt[1]?.text
        }

        const paramsend = `\n 
        Este es mi sitio web: ${websiteOne.url}\n 
        El contenido de mi sitio web: ${websiteOne.text} \n 

        Sitio web de mi competencia: ${websiteTwo.url} \n 
        El contenido de mi competencia es: ${websiteTwo.text}\n 
        `

        // Realiza la solicitud a la API de OpenAI
        const systemMessage = `Eres un agente asistente especializado en auditar sitios web a nivel de contenido. Tu tarea es ayudar a los usuarios a mejorar su sitio web a nivel de contenido en sus productos y serivicios, considera que evaluarás el contenido de dos sitios webs diferentes, el primer enlace y texto son mi sitio personal y el segundo es un sitio de mi competencia.
        Tu objetivo es brindar al usuario recomendaciones para mejorar sus sitios webs en temas de coppy, estructura, la información que se muestra y detalles de productos o servicios en general, para captar clientes potenciales o vender sus productos.
        Asegúrate de que el tono sea siempre profesional pero también empático, ya que las recomendaciones de contenido pueden ser sensibles para el usuario y brindar recomendaciones personalizadas para cada usuarios.
        Por último si el sitio web es en inglés, responde en inglés y si es español en español`;


        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Modelo a usar
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: paramsend },
            ],
            //max_tokens: 100, // Número máximo de tokens
            temperature: 0.7, // Ajusta la creatividad
        });

        return  response.choices[0].message.content 
   
    } catch (error) {
        console.error("Error al llamar a OpenAI:", error);
        return NextResponse.json(
            { error: "Error al procesar la solicitud con OpenAI" },
            { status: 500 }
        );
    }
}
