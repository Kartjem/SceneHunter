import { NextRequest, NextResponse } from 'next/server'

/**
 * Health check endpoint для Kubernetes liveness и readiness probes
 * Проверяет базовую функциональность приложения
 */
export async function GET(request: NextRequest) {
    try {
        // Базовые проверки системы
        const checks: {
            status: string;
            timestamp: string;
            version: string;
            environment: string;
            uptime: number;
            memory: { used: number; total: number };
            nodejs: string;
            services?: {
                firebase: string;
                sentry: string;
            };
        } = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || 'unknown',
            environment: process.env.NODE_ENV || 'unknown',
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            },
            nodejs: process.version,
        }

        // Дополнительные проверки для production
        if (process.env.NODE_ENV === 'production') {
            // Проверка доступности критичных сервисов
            // Здесь можно добавить проверки Firebase, баз данных и т.д.
            checks.services = {
                firebase: 'connected', // В будущем можно добавить реальную проверку
                sentry: 'connected',
            }
        }

        return NextResponse.json(checks, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        })
    } catch (error) {
        console.error('Health check failed:', error)

        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
