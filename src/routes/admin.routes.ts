import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { AuthAdminController } from '../controllers/authAdminController';

const AdminRouter = Router();

AdminRouter.post('/criar', AdminController.criar);
AdminRouter.put('/atualizar', AdminController.atualizar);
AdminRouter.get('/listar', AdminController.listar);
AdminRouter.get('/buscar/:id', AdminController.buscarPorId);
AdminRouter.delete('/deletar/:id', AdminController.deletar);

// Rotas de Autenticação
AdminRouter.get('/me', AuthAdminController.me);
AdminRouter.post('/auth/login', AuthAdminController.login);
AdminRouter.post('/auth/sair', AuthAdminController.logout);
AdminRouter.put('/auth/alterar-senha', AuthAdminController.alterarSenha);
AdminRouter.post('/auth/esqueci-senha', AuthAdminController.esqueciSenha);
AdminRouter.post('/auth/verificar-token', AuthAdminController.verificarToken);
AdminRouter.post('/auth/atualizar-token', AuthAdminController.refresh);

export default AdminRouter;