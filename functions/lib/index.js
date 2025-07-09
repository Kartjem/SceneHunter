"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextjsFunc = void 0;
const functions = __importStar(require("firebase-functions"));
exports.nextjsFunc = functions.https.onRequest(async (req, res) => {
    var _a, _b;
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
            const apiKey = process.env.GEMINI_API_KEY || ((_a = functions.config().gemini) === null || _a === void 0 ? void 0 : _a.api_key);
            if (!apiKey) {
                console.error('CRITICAL: GEMINI_API_KEY is not configured in environment variables.');
                res.status(500).json({ error: 'API key is not configured on the server' });
                return;
            }
            const mimeType = base64.substring(base64.indexOf(":") + 1, base64.indexOf(";"));
            const pureBase64 = base64.split(',')[1];
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
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
                const errorMessage = ((_b = responseData === null || responseData === void 0 ? void 0 : responseData.error) === null || _b === void 0 ? void 0 : _b.message) || 'An unknown error occurred with the Gemini API.';
                res.status(geminiResponse.status).json({ error: errorMessage });
                return;
            }
            res.json(responseData);
            return;
        }
        res.status(404).json({ error: 'Not found' });
    }
    catch (error) {
        console.error('FATAL: An exception occurred in the function:', error);
        res.status(500).json({ error: 'An unexpected internal server error occurred.' });
    }
});
//# sourceMappingURL=index.js.map