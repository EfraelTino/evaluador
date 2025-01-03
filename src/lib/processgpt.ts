import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configura el cliente de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Carga la clave desde las variables de entorno
});


interface PropsGPT{
    url: string;
    text: string;
}
export default async function openAiPeticion(data: PropsGPT[]) {
    try {
        console.log("data gpt: ", data);
        const prompt = data;
        const websiteOne = {
            url: prompt[0]?.url,
            text: prompt[0]?.text
        }
        const websiteTwo = {
            url: prompt[1]?.url,
            text: prompt[1]?.text
        }

        const paramsend = `\n 
        El contenido de mi sitio web: ${websiteOne.text} \n 

        El contenido de mi competencia es: ${websiteTwo.text}\n 
        `

        // Realiza la solicitud a la API de OpenAI
        const systemMessage = ` Hola, no es necesario que respondas el saludo, simula ser un agente experto en auditar sitios web a nivel de contenido. \n Entonces podrías brindar al usuario, la estructura que debe tener su sitio web extrayendo lo mejor de ambos para que su sitio web genere resultados y citar estrategias que pueda implementar con grandes empresas referentes en un rubro para que esta empresa pueda escalar. \n
    Debes de verificar que ambos sitios web pertenezcan al mismo rubro, si no es así deberás mandar un mensaje de: Los sitios web no pertenecen al mismo rubro. \n
    Este es el contenido extraído de mi sitio web: ${websiteOne.text} \n
    Y este el contenido extraído de mi competencia: ${websiteTwo.text} \n

    Si vez que la estructura no es tan buena y eficiente para vender un productos o vender un servicio necesito que recomiendes que estructura debe seguir y tener su página web para generar resultados.

    Adicional sugiere estrategias que deben seguir y aplicar para escalar su negocio.`;


        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Modelo a usar
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: paramsend },
            ],
            //max_tokens: 100, // Número máximo de tokens
            temperature: 0.7, // Ajusta la creatividad
        });

        return response.choices[0].message.content

    } catch (error) {
        console.error("Error al llamar a OpenAI:", error);
        return NextResponse.json(
            { error: "Error al procesar la solicitud con OpenAI" },
            { status: 500 }
        );
    }
}
