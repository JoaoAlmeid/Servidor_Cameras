import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParse from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middlewares/erroHandler';
import { caminho_camera } from './config/constantes';

import AdminRouter from './routes/admin.routes';
import CameraRouter from './routes/camera.routes';
import TransmissaoRouter from './routes/transmissao.routes';

dotenv.config();

const app = express();

// Segurança HTTP
app.use(helmet());
app.disable('x-powered-by');

// Gzip compressão
app.use(compression())

// Parse de cookies
app.use(cookieParse())

// Logs de requisição (só em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Limitação de requisição (anti-DDOS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por ip
    message: 'Muitas requisições - Tente novamente mais tarde.'
});
app.use(limiter);

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://camera.ccomfm.com.br',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

// Rotas
app.use('/admin', AdminRouter);
app.use('/camera', CameraRouter);
app.use('/transmissao', TransmissaoRouter);

// Streaming de arquivos de viíeo (.m3u8 e .ts)
app.use(
  '/stream',
  express.static(caminho_camera, {
    setHeaders: (res, path) => {
      if (path.endsWith('.m3u8')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (path.endsWith('.ts')) {
        res.setHeader('Cache-Control', 'public, max-age=1');
      }
    },
  }),
);

// Tratamento global de erros
app.use(errorHandler);

export default app;