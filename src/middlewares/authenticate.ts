import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: { adminId: string };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ erro: 'Token não fornecido' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
        req.user = { adminId: decoded.sub };
        return next();
    } catch (err) {
        res.status(401).json({ erro: 'Token inválido' });
        return;
    }
}