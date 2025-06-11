import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import './config/firebase';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(compression());

const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(morgan('combined'));

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/status', (_req, res) => {
    res.json({
        message: 'SceneHunter Backend API is running',
        firebase: 'connected',
        googleCloud: 'connected',
        timestamp: new Date().toISOString()
    });
});


app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 SceneHunter Backend API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API status: http://localhost:${PORT}/api/status`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
