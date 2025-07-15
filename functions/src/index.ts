import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Инициализируем Firebase Admin только если еще не инициализирован
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Firebase Functions v1 с переменными окружения
export const nextjsFunc = functions.https.onRequest(async (req, res) => {
  try {
    // Включаем CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).send('');
      return;
    }

    // Прокси для Gemini API - обрабатываем любой POST запрос
    if (req.method === 'POST') {
      console.log('Received request path:', req.path);
      console.log('Request body:', req.body);
      
      const { base64, prompt } = req.body;
      
      if (!base64 || !prompt) {
        res.status(400).json({ error: 'Missing image or prompt' });
        return;
      }

      // Используем переменную окружения
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('CRITICAL: GEMINI_API_KEY environment variable is not set.');
        res.status(500).json({ error: 'API key is not configured on the server' });
        return;
      }

      const mimeType = base64.substring(base64.indexOf(":") + 1, base64.indexOf(";"));
      const pureBase64 = base64.split(',')[1];
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
        res.status(geminiResponse.status).json({ error: errorMessage });
        return;
      }

      res.json(responseData);
      return;
    }
    
    res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('FATAL: An exception occurred in the function:', error);
    res.status(500).json({ error: 'An unexpected internal server error occurred.' });
  }
});