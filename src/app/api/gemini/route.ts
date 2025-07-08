import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { base64, prompt } = await request.json();

    if (!base64 || !prompt) {
      return new NextResponse('Missing image or prompt', { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: GEMINI_API_KEY is not configured in environment variables.');
      return new NextResponse('API key is not configured on the server', { status: 500 });
    }

    const mimeType = base64.substring(base64.indexOf(":") + 1, base64.indexOf(";"));
    const pureBase64 = base64.split(',')[1];
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }, { inlineData: { mimeType, data: pureBase64 } }]
        }]
      })
    });

    const responseData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Error from Gemini API:', responseData);
      const errorMessage = responseData?.error?.message || 'An unknown error occurred with the Gemini API.';
      return new NextResponse(errorMessage, { status: geminiResponse.status });
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('FATAL: An exception occurred in the API route:', error);
    return new NextResponse('An unexpected internal server error occurred.', { status: 500 });
  }
}