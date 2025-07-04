import { Request, Response } from 'express';
import { AuthAdminService } from '../services/admins/auth/authService';
import { gerarCookiesDeAutenticacao } from '../lib/cookies';
import { UnauthorizedError } from '../err/UnauthorizedError';
import { verifyJwt } from '../lib/verifyJwt';
import { buscarAdminId } from '../services/admins';

const authAdminService = new AuthAdminService();

export class AuthAdminController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await authAdminService.login(req.body);

      const cookies = gerarCookiesDeAutenticacao(resultado.token, resultado.refreshToken)
      res.setHeader('Set-Cookie', cookies);

      res.status(200).json({ admin: resultado.admin });
      return;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.status(401).json({ erro: error.message });
      } else {
        res.status(500).json({ erro: 'Erro interno ao realizar login' });
      }
      return;
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      console.log('➡️ Requisição recebida para /admin/me')

      // 1. Verificar cookies recebidos
      console.log('🧪 Cookies recebidos:', req.cookies)

      const token = req.cookies?.token
      if (!token) {
        console.log('❌ Token não fornecido no cookie')
        res.status(401).json({ erro: 'Token não fornecido' })
        return
      }

      // 2. Verificar payload do token
      const payload = verifyJwt(token)
      console.log('🧩 Payload do JWT:', payload)

      if (!payload) {
        console.log('❌ Token inválido ou expirado')
        res.status(401).json({ erro: 'Token inválido ou expirado' })
        return
      }

      // 3. Buscar admin no banco
      const admin = await buscarAdminId(payload.sub)
      console.log('👤 Admin encontrado:', admin)

      if (!admin) {
        console.log('❌ Admin não encontrado no banco')
        res.status(404).json({ erro: 'Admin não encontrado' })
        return
      }

      res.json({ admin })
      return
    } catch (error) {
      console.log('🔥 Erro inesperado:', error)
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao listar administrador',
      })
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      res.status(200).json({ message: 'Logout realizado com sucesso' })
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao fazer logout',
      });
    }
  }

  static async alterarSenha(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await authAdminService.alterarSenha(req.body);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao alterar senha',
      });
    }
  }

  static async esqueciSenha(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await authAdminService.esqueciSenha(req.body);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao solicitar recuperação de senha',
      });
    }
  }

  static async verificarToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) throw new Error('Token não fornecido');

      const decoded = authAdminService.verifyToken(token);
      res.status(200).json({ valido: true, dados: decoded });
    } catch (error) {
      res.status(401).json({
        valido: false,
        erro: error instanceof Error ? error.message : 'Erro na verificação do token',
      });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const resultado = await authAdminService.refresh(refreshToken);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ erro: error instanceof Error ? error.message : 'Erro ao renovar token' });
    }
  }

}
