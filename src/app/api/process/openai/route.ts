import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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", // Accede a la variable de entorno
});

export async function POST(request) {
    try {
        const { prompt } = await request.json();

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Eres un asistente útil." },
                { role: "user", content: prompt },
            ],
            max_tokens: 100,
            temperature: 0.7,
        });

        return NextResponse.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.error("Error al llamar a OpenAI:", error);
        return NextResponse.json(
            { error: "Error al procesar la solicitud con OpenAI" },
            { status: 500 }
        );
    }
}
