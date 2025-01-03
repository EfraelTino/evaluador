import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Use environment variable for API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || 'AIzaSyDjVLahZnm-pELtf7jPx8vfF5OneAUF45Y');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST() {
  const prompt = 'Hola';
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ 
      message: 'An error occurred', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}