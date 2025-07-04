import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
    console.error('🔥 Erro interno: ', err);

    res.status(500).json({
        erro: err instanceof Error ? err.message : 'Erro interno no servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
}