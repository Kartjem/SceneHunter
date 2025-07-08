import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

const fetch = require('node-fetch');

dotenv.config();

import './config/firebase';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(helmet());
app.use(compression());
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// --- Rate Limiter ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use('/api/', limiter);


// --- API Routes ---
app.get('/health', (_req, res) => res.status(200).json({ status: 'healthy' }));

app.get('/api/status', (_req, res) => res.json({ message: 'SceneHunter Backend API is running' }));

// Helper function for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/api/generate-with-gemini', async (req, res) => {
    const { base64, prompt } = req.body;

    if (!base64 || !prompt) {
        return res.status(400).json({ error: 'Missing image or prompt' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('CRITICAL: GEMINI_API_KEY is not defined in the backend .env file.');
        return res.status(500).json({ error: 'API key is not configured on the server' });
    }

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
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

            // If the API is overloaded, we'll retry
            if (geminiResponse.status === 503) {
                attempt++;
                if (attempt >= maxRetries) {
                    // If we've run out of retries, send the error
                    console.error(`Gemini API overloaded. Final attempt failed.`);
                    return res.status(503).json({ error: 'The model is overloaded. Please try again later.' });
                }
                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff (2s, 4s, 8s)
                console.log(`Gemini API overloaded. Retrying in ${waitTime / 1000}s... (Attempt ${attempt})`);
                await delay(waitTime);
                continue; // Go to the next iteration of the loop
            }

            const responseData = await geminiResponse.json();

            if (!geminiResponse.ok) {
                console.error('Error response from Gemini API:', responseData);
                const errorMessage = responseData?.error?.message || 'An unknown error occurred with the Gemini API.';
                return res.status(geminiResponse.status).json({ error: errorMessage });
            }

            // If successful, send the response and exit the loop
            return res.json(responseData);

        } catch (error: any) {
            console.error('FATAL: An exception occurred in the /api/generate-with-gemini endpoint:', error);
            return res.status(500).json({ error: 'An unexpected internal server error occurred.' });
        }
    }
    // Ensure a response is always returned if the loop exits unexpectedly
    return res.status(500).json({ error: 'Failed to generate content after maximum retries.' });
});


// --- Error Handlers (Must be last) ---
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled Middleware Error:', err);
    res.status(500).json({ error: 'An unhandled server error occurred.' });
});


// --- Server Start ---
app.listen(PORT, () => {
    console.log(`🚀 SceneHunter Backend API running on http://localhost:${PORT}`);
});

export default app;