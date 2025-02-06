import { GoogleGenerativeAI } from '@google/generative-ai';
import { connection } from './bd';

const genAI = new GoogleGenerativeAI("AIzaSyD13SqgOVBAL4YYBkn4YjytfOSRRubYKC0");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface PropsGemini {
    text: string; // Puede ser solo texto, o un formato diferente
    title?: string | null;
    url: string;
    lang?: string;
    error: string | null;
}

interface UpdateText {
    affectedRows: number
}
export async function geminiPetition(data: PropsGemini[], insertedId: number, language: string, objetivo: string, descService: string) {


    console.log("data gemini cambiado: ", data);
    console.log("insert id: ", insertedId);
    const websiteOne = {
        url: data[0]?.url,
        text: data[0]?.text,
        title: data[0]?.title,
        lang: data[0]?.lang
    }

    try {
        let promptData = "";
        if (language === 'en') {
            console.log("entro 1");
            promptData = `
            If the content of ${websiteOne.title} is in Spanish, then it responds in Spanish. If it is in English, then it responds in English. \n
            Acts as an expert in structuring landing pages and sales funnels, with more than 10 years of experience. \n
            
            The goal of the landing page is:${objetivo}.\n 

            Analyzes the structure only at the content level of my website: (${websiteOne.text} \n) .
            From now on called: **${websiteOne.title}**. \n
            
            Subsequently, it identifies the most relevant content in general and extracts the most important information, then analyzes the structure only at the content level of this website: (websiteTwo.text \n).
            From now on called **websiteTwo.title**.\n
            
            Extract the most important information, once done evaluate the structure of the site **websiteTwo.title** \n
            If both websites do not belong to the same sector, send the following message **The websites do not belong to the same sector and end the process here.**\n
            If both websites belong to the same sector then, structure the landing page at the content level for ${websiteOne.title} considering the following points so that it is effective and converts visitors into potential clients, you have to give me as an answer the ideal structure with texts, contents that should go on the landing page:\n
            1.- The CTAs have to be clear, according to the sector of **${websiteOne.title}** and moderate since 68.2% of landing pages or sales funnels that have more than 5 CTAs do not convert and only 1 CTA converts more. Recommend a single CTA when necessary and according to your criteria*.\n
            2.- If **${websiteOne.title}** sells products, you can touch on the problem that my product will solve for a specific user. To improve this, add CTAs that encourage taking action. Be clear in showing offers, that have a single purpose, the entire landing page or sales funnel for a single purpose.\n3.- The texts are very clear, attractive, short, descriptive and direct.\n
            4.- If necessary, according to the category you have: **${websiteOne.title}**, it is recommended to put a main image or video considering the 5 second rule since the main section will be crucial for the user to stay or leave: **${websiteOne.title}**, I show you an example so you can evaluate if you can recommend an image or video: If **${websiteOne.title}** is a restaurant, it recommends an image of a meal that is appetizing, according to this context you will evaluate the image or video recommendation for each category. \n
            5.- Very important, but it is not recommended if **${websiteOne.title}** is B2B to include senses of urgency.\n
            6.- You have to evaluate the means of contact if it is B2B, it is recommended to use a contact form or directly to WhatsApp.\n
            7.- Avoid saturating the structure with too much irrelevant information or multiple objectives according to *SEMRUSH*, landing pages or sales funnels with a single clear purpose are the most effective.\n
            8.- If you consider that the structure of **${websiteOne.title}** is good and converts visitors into potential customers, send a message of: *The structure of your website is good*, adding some recommendations if necessary.\n
            Using **websiteTwo.title** as a reference. The structure of the landing page that you are going to structure must generate results by converting visitors into potential customers.\n
            
            You do not hesitate or give half-hearted examples, you answer all my questions concisely. Avoid answering with this (below the fold), (below the fold)
            `;
        } else {
            console.log("entro 2");
            promptData = `
            Actúa como un experto en la estructuración de landing pages y funnels de venta, con más de 10 años de experiencia. \n

            **Información Clave:**\n
            *   **Objetivo de la Landing Page:** ${objetivo}\n
            *   **Producto/Servicio Principal:** ${descService} (Si hay múltiples opciones, prioriza el primero)\n
            *   **Sitio Web de Referencia:**\n
            *   **Nombre:** ${websiteOne.title}\n
            *   **URL:** ${websiteOne.text}\n

            **Tarea:**\n
            Analiza el contenido y la estructura del sitio web de referencia. Luego, crea una estructura detallada para una landing page optimizada que convierta visitantes en clientes potenciales, teniendo en cuenta el objetivo especificado.
            Considera los siguientes puntos para maximizar conversiones. \n
            **Directrices:**\n
            Tienes que darme como respuesta la estructura ideal con textos, contenidos  que debe ir en la landing page :\n 
            1. **CTAs Claras:** Recomienda acorde al rubro de **${websiteOne.title}** y moderadas ya que un 68,2% de landing page o funnel de venta que tienen más de 5 CTAs  no convierten y sólo 1 CTA convierte más. Recomienda un solo CTA cuando sea necesario  y de acuerdo al criterio  que puedas tener*.\n

            2. **Enfoque en Problemas:**  Si **${websiteOne.title}** vende productos, enfatiza un problema que solucionará para el usuario, para mejorar esto añade **CTAs** que incentiven a realizar una acción. Sé claro en mostrar ofertas, que tenga un solo propósito, evita múltiples propósitos.\n

            3. **Textos Atractivos:** Los textos tienen muy claros, atractivos, cortos, descriptivos y directos para cada sección.\n

            4. **Imagen o Video Principal:*** Sugiere una imagen o video de acuerdo según el rubro de ${websiteOne.title}, considerando la regla se los 5 segundos ya que la sección principal será crucial para que el usuario se quede o se vaya de la landing page. Te muestro un ejemplo: Si **${websiteOne.title}**, es un restaurant recomienda la fotografía de una comida apetitosa, de acuerdo a este contexto evaluarás para cada rubro. \n
            5. **Sentidos de urgencia:** Muy importante cuando se quiere mostrar ofertas limitadas o descuentos especiales, Lanzamiento de un producto o servicio nuevo, Acciones con beneficios exclusivos. No recomedable si **${websiteOne.title}** no es B2B, si es B2B lo recomendable es un formulario de contacto.\n
            6. **Medio de contacto: ** Evalúa el contacto más efectivo según **${objetivo}**. Es es B2B, sugiere un formulario de contacto.
            7. **Propósito Único:** Evita sobrecarga de información irrelevante o múltiples objetivos según *SEMRUSH*, las landing page o funnels de venta con un solo propósito claro, son las más efectivas. Entonces  estructura  la landing page con un solo propósito claro.\n
            
            **Formato de Respuesta:**\n
            Para cada sección de la landing page, proporciona lo siguiente:\n

            *   **Título de la Sección (Ej: Encabezado, Beneficios, Testimonios, etc.)**\n
            *   **Objetivo de la Sección:** (¿Qué quieres lograr con esta sección?)\n
            *   **Contenido Sugerido:** (Textos, viñetas, etc.  Sé específico)\n
            *   **Recomendaciones Adicionales:** (Sugerencias sobre imágenes, videos, diseño, etc.)\n
            *   **Justificación:** (¿Por qué esta sección es importante para lograr el objetivo de ${objetivo}?)\n
            
            **Instrucciones Adicionales:**\n

            *   No dudes en tomar decisiones basadas en tu experiencia.\n
            *   Proporciona respuestas concisas y completas.\n
            *   Evita frases como "debajo del fold" o explicaciones vagas.\n
            `;
        }

        {/**9.- Quiero que la estructura  de landing page que muestre esté respaldada por casos de éxitos de empresas y/o empresas que han realizado landing page  y/o funnels de venta.\n  */ }

        try {
            console.log("id added: ", insertedId);
            const result = await model.generateContent(promptData);

            const responseText = await result.response.text();
            console.log("response: ", responseText);
            if (responseText && responseText.trim() !== "") {
                const updateText: UpdateText = await connection.query(
                    "UPDATE landing_page_analysis SET resumen_ai = ? WHERE id = ?",
                    [JSON.stringify(responseText), insertedId]
                );
                console.log("Resultado del UPDATE:", updateText);
                if (updateText.affectedRows >= 1) {
                    return {
                        estado: true,
                        text: responseText
                    };
                } else {
                    return {
                        estado: false,
                        text: 'Error al actualizar datos'
                    };
                }


            } else {
                return {
                    estado: true,
                    text: 'Error, intenta de nuevo.'
                };
            }

        } catch (error) {
            console.log("error en catch  de gemini: ", error)
            return {
                estado: false,
                text: 'Error de API, intenta de nuevo.'
            };
        }

    } catch (error) {
        console.log("error gemini: ", error)
    }
}