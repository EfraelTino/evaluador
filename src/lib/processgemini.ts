import { GoogleGenerativeAI } from '@google/generative-ai';
import { connection } from './bd';

const genAI = new GoogleGenerativeAI("AIzaSyCv7Zoh7iTar00mzf-aHbfhMnfMSMYsE-s");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface PropsGemini {
    url: string;
    text: string;
}

interface UpdateText {
    affectedRows:number
}
export async function geminiPetition(data: PropsGemini[], insertedId: number) {


    console.log("data gemini: ", data);

    const websiteOne = {
        url: data[0]?.url,
        text: data[0]?.text
    }
    const websiteTwo = {
        url: data[1]?.url,
        text: data[1]?.text
    }
try {
    const promptData = `
    Eres un experto diseñando landing page y funnels de venta ya sea para productos o servicios. \n
    Te voy a facilitar dos el contenido de 2 diferentes sitios web, uno es el mío y el otro es de mi competencia. \n
     Este es el contenido extraído de mi sitio web: ${websiteOne.text} \n
    Y este el contenido extraído de mi competencia: ${websiteTwo.text} \n
    Si el contenido de ambos sitios web no pertenece al mismo rubro, deberás mandar un mensaje de: 
    **Los sitios web no pertenecen al mismo rubro.** \n
    Necesito que puedas armar el contenido de una landing page que pueda convertir visitantes en clientes. \n
    Enfócate en el contenido de ambos sitios web y extrae lo mejor de ambos para que mi sitio web pueda generar resultados. \n
    Si vez que la estructura no es tan buena y eficiente para vender un productos o vender un servicio necesito que recomiendes que estructura debe seguir y tener su página web para generar resultados.

    Tu respuesta debe ser en el idioma que tiene mi sitio web.
   
    Recomendable que la estructura de la landing page esté enfoccada a un solo producto o servicio. \n
    Aplica la regla de los 5 segundos que es: \n
    Mediante esta teoría identificaremos si un usuario se pudo quedar con la información fundamental de tu sitio.

El sistema consiste en mostrar el sitio web a diferentes personas que no sepan de tu proyecto durante solo 5 segundos. Luego de eso realiza 3 preguntas:

1.- ¿Qué producto o servicio se está ofreciendo en el sitio?

2.- ¿Qué cualidad pudieron identificar?

3.- Plantea una pregunta abierta acorde a lo que te parezca relevante para tu marca, por ejemplo el precio en el caso de ser un producto, de qué manera se puede iniciar el proceso de compra o a quién piensan que está dirigida la marca.

Recuerda que si tu objetivo es vender o promocionar un producto o servicio, debes comunicar lo más importante de manera precisa, directa y clara.\n
Crea sentidos de urgencia, escasez y confianza en tu landing page: \n
    1.- Usar ofertas urgentes:utilizar ofertas urgentes, como descuentos por tiempo limitado, pruebas gratuitas o bonificaciones. \n 2.- Usa señales de escasez: señales de escasez, como existencias bajas, alta demanda o disponibilidad limitada. Estas señales crean una percepción de valor y exclusividad y hacen que sus visitantes sientan que deben actuar rápido antes de perder la oportunidad. \n
Usa la prueba social: `;

    try {
        console.log("entro a try de gemini");
        const result = await model.generateContent(promptData);
        const responseText = await result.response.text(); // Espera correctamente la respuesta
        console.log("respuesta de gemini: ",responseText)
        if (responseText && responseText.trim() !== "") {
            const updateText:UpdateText = await connection.query(
                "UPDATE landing_page_analysis SET resumen_ai = ? WHERE id = ?",
                [JSON.stringify(responseText), insertedId]
            );
            console.log("id recibido en gemini:", insertedId);
            console.log("Resultado del UPDATE:", updateText);
            if (updateText.affectedRows >= 1) {
                return {
                    estado: true,
                   text:  responseText
                };
            }else{
                return {
                    estado: false,
                   text:  'Error al actualizar datos'
                };
            }
           
           
        } else {
            return {
                estado: true,
               text:  'Error, intenta de nuevo.'
            };
        }
    
    } catch (error) {
        console.log("error en catch  de gemini: ", error)
        return {
            estado: false,
           text:  'Error de API, intenta de nuevo.'
        };
    }
    
} catch (error) {
    console.log("error gemini: ", error)
}
}