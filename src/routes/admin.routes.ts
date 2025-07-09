import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { AuthAdminController } from '../controllers/authAdminController';
import { limiter } from '../app';

const AdminRouter = Router();

AdminRouter.post('/criar', limiter, AdminController.criar);
AdminRouter.put('/atualizar', limiter, AdminController.atualizar);
AdminRouter.get('/listar', limiter, AdminController.listar);
AdminRouter.get('/buscar/:id', limiter, AdminController.buscarPorId);
AdminRouter.delete('/deletar/:id', limiter, AdminController.deletar);

// Rotas de Autenticação
AdminRouter.get('/me', limiter, AuthAdminController.me);
AdminRouter.post('/auth/login', limiter, AuthAdminController.login);
AdminRouter.post('/auth/sair', limiter, AuthAdminController.logout);
AdminRouter.put('/auth/alterar-senha', limiter, AuthAdminController.alterarSenha);
AdminRouter.post('/auth/esqueci-senha', limiter, AuthAdminController.esqueciSenha);
AdminRouter.post('/auth/verificar-token', limiter, AuthAdminController.verificarToken);
AdminRouter.post('/auth/atualizar-token', limiter, AuthAdminController.refresh);

export default AdminRouter;