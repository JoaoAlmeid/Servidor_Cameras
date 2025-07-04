import { Request, Response } from 'express';
import * as AdminService from '../services/admins';

export class AdminController {
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const novoAdmin = await AdminService.criarAdmin(req.body);
      res.status(201).json(novoAdmin);
    } catch (error) {
      res.status(400).json({ erro: error instanceof Error ? error.message : 'Erro ao criar admin' });
    }
  }

  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const atualizado = await AdminService.atualizarAdmin(req.body);
      res.status(200).json(atualizado);
    } catch (error) {
      res.status(400).json({ erro: error instanceof Error ? error.message : 'Erro ao atualizar admin' });
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await AdminService.buscarAdminId(req.params.id);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(404).json({ erro: error instanceof Error ? error.message : 'Admin não encontrado' });
    }
  }

  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const deletado = await AdminService.deletarAdmin(req.params.id, req.body.superId);
      res.status(200).json({ message: 'Admin deletado com sucesso', deletado });
    } catch (error) {
      res.status(403).json({ erro: error instanceof Error ? error.message : 'Erro ao deletar admin' });
    }
  }

  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const resultado = await AdminService.listarAdmins({ page, limit });
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({ erro: error instanceof Error ? error.message : 'Erro ao listar admins' });
    }
  }
}