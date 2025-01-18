import { GoogleGenerativeAI } from '@google/generative-ai';
import { connection } from './bd';

const genAI = new GoogleGenerativeAI("AIzaSyCv7Zoh7iTar00mzf-aHbfhMnfMSMYsE-s");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface PropsGemini {
    text: string; // Puede ser solo texto, o un formato diferente
    title?: string | null;
    url: string;
    error: string | null;
}

interface UpdateText {
    affectedRows:number
}
export async function geminiPetition(data: PropsGemini[], insertedId: number) {


    console.log("data gemini cambiado: ", data[0].title);
    console.log("insert id: ", insertedId);

    const websiteOne = {
        url: data[0]?.url,
        text: data[0]?.text,
        title: data[0]?.title
    }
    const websiteTwo = {
        url: data[1]?.url,
        text: data[1]?.text,
        title: data[1]?.title
    }
try {
    const promptData = `

Actúa como un experto en la estructuración de landing page y funnels de venta, con más de 10 años de experiencia. \n
Analiza la estructura solo estructura a nivel de contenido de mi sitio web: (${websiteOne.text} \n) .
De ahora en adelante llamado: **${websiteOne.title}**. \n

Posteriormente, identifica lo más relevante del contenido en general y extrae la información más importante, luego analiza el contenido de este sitio web: (${websiteTwo.text} \n).De ahora en adelante llamado **${websiteTwo.title}**.\nExtrae la información más importante, una vez hecho ello evalúa la estructura del sitio **${websiteTwo.title}** \n
Si ambos sitios webs pertenecen al mismo rubro continua, sino es así manda el siguiente mensaje **Los sitios web no pertenecen al mismo rubro.**\n
Para que una landing page o funnel de venta sea buena y convierta visitantes a clientes potenciales toma en considera	cian los siguientes puntos:\n 
 1.- Los CTAs tienen que ser claras, acorde al rubro de **${websiteOne.title}** y moderadas ya que un 68,2% de landing page o funnels de venta que tienen más de 5 CTAs  no convierten y sólo 1 CTA convierte más. Recomienda un solo CTA cuando sea necesario  y de acuerdo al criterio  que puedas tener*.\n
 2.- Si **${websiteOne.title}** vende productos puedes tocar el problema que solucionará mi producto de un usuario en específico, para mejorar esto añade CTAs que incentiven a realizar una acción. Sé claro en mostrar ofertas, que tenga un solo propósito, toda la landing page o funnel de venta a un solo propósito.\n3.- Los textos tienen muy claros, atractivos, cortos, descriptivos y directos.\n
4.- Si es necesario, de acuerdo al rubro que tenga: **${websiteOne.title}**, recomienda poner una imagen o vídeo principal considerando la regla de los 5 segundos ya que la sección principal será crucial para que el usuario se quede o se vaya de: **${websiteOne.title}**, te muestro un ejemplo para que evalúes si puedes recomendar una imagen o un vídeo: Si **${websiteOne.title}**, es un restaurant recomienda una imagen de una comida que sea apetitosa, de acuerdo a este contexto avaluarás para cada rubro la recomendación de imagen o video. \n
5.- Muy importante, pero no se recomienda si **${websiteOne.title}** es B2B incluir  sentidos de urgencia.\n
6.- El medio de contacto lo tienes que evaluar si es B2B lo recomendable es un formulario de contacto o sino directamente  a WhatsApp.\n
7.- Evita saturar la estructura con demasiado información irrelevante o múltiples objetivos según *SEMRUSH*, las landing page o funnels de venta con un solo propósito claro, son las más efectivas.\n
8.- Si consideras que la estructura de **${websiteOne.title}** es buena y convierte visitantes en clientes potenciales manda un mensaje de: *La estructura  de tu sitio web es buena*, adicionando algunas recomendaciones si fuera necesario.\n
Teniendo como referencia **${websiteTwo.title}**. La estructura de la  landing page  que vas a estructurar debe generar resultados convirtiendo visitantes a clientes potenciales.\n



`;
{/**9.- Quiero que la estructura  de landing page que muestre esté respaldada por casos de éxitos de empresas y/o empresas que han realizado landing page  y/o funnels de venta.\n  */}

    try {
        console.log("entro a try de gemini");
        console.log("id added: ", insertedId);
        const result = await model.generateContent(promptData);
        console.log("Res: ", result)
        const responseText = await result.response.text(); // Espera correctamente la respuesta
        console.log("respuesta de gemini: ",responseText)
        console.log("insert id al terminar el proceso: ",insertedId)
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