import { Router } from 'express';
import { TransmissaoController } from '../controllers/transmissaoController';

const TransmissaoRouter = Router();

TransmissaoRouter.post('/iniciar/:id', TransmissaoController.iniciarUma);
TransmissaoRouter.post('/iniciar/todas', TransmissaoController.iniciarTodas);
TransmissaoRouter.post('/parar/:id', TransmissaoController.pararUma);
TransmissaoRouter.post('/parar/todas', TransmissaoController.pararTodas);
TransmissaoRouter.post('/reiniciar/:id', TransmissaoController.reiniciar);

export default TransmissaoRouter;