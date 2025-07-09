import { Router } from 'express';
import { CameraController } from '../controllers/cameraController';
import { authenticateJWT } from '../middlewares/authenticate';

const CameraRouter = Router();

CameraRouter.post('/criar', CameraController.criar);
CameraRouter.put('/atualizar/:id', authenticateJWT, CameraController.atualizar);
CameraRouter.patch('/status/:id', authenticateJWT, CameraController.alterarStatus);
CameraRouter.delete('/deletar/:id', authenticateJWT, CameraController.deletar);
CameraRouter.get('/buscar/id/:id', CameraController.buscarPorId);
CameraRouter.get('/buscar/nome/:nome', CameraController.buscarPorNome);
CameraRouter.get('/listar', CameraController.listar);

export default CameraRouter;