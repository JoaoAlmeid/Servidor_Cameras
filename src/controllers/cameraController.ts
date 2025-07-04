import { Request, Response } from 'express';
import * as CameraService from '../services/cameras';
import jwt from 'jsonwebtoken';
import { criarCameraSchema } from '../services/cameras/camera.schema';
import { AuthenticatedRequest } from '../middlewares/authenticate';
import prisma from '../lib/prisma';

export class CameraController {
  static async criar(req: Request, res: Response): Promise<void> {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ erro: 'Token não fornecido' })
        }

        let payload: any
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET as string)
        } catch (e) {
            res.status(401).json({ erro: 'Token inválido' })
        }

        const criadoPorId = payload.sub
        if (!criadoPorId) {
            res.status(401).json({ erro: 'ID do admin não encontrado no token' })
        }

        const input = criarCameraSchema.parse(req.body)

        const camera = await CameraService.criarCamera(input, criadoPorId);
        res.status(201).json(camera);
    } catch (error) {
        console.error('Erro no criar câmera:', error);
        res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao criar câmera',
        });
    }
  }

  static async atualizar(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const adminId = req.user?.adminId;

    if (!adminId) {
      res.status(401).json({ erro: 'Admin não autenticado' }); 
      return;
    }

    try {
      const dataComId = { ...req.body, cameraId: id };
      const camera = await CameraService.atualizarCamera(dataComId, adminId);
      
      res.status(200).json(camera);
      return;
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao atualizar câmera'
      });
      return;
    }
  }

  static async deletar(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const adminId = req.user?.adminId;

      if (!adminId) {
        return res.status(401).json({ erro: 'Admin não autenticado' })
      }

      const resultado = await CameraService.deletarCamera(id, adminId);
      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao deletar câmera'
      });
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const camera = await CameraService.buscarCameraPorId(id);
      res.status(200).json(camera);
    } catch (error) {
      res.status(404).json({
        erro: error instanceof Error ? error.message : 'Câmera não encontrada'
      });
    }
  }

  static async buscarPorNome(req: Request, res: Response): Promise<void> {
    try {
      const { nome } = req.params;
      const camera = await CameraService.buscarCameraPorNome(nome);
      res.status(200).json(camera);
    } catch (error) {
      res.status(404).json({
        erro: error instanceof Error ? error.message : 'Câmera não encontrada pelo nome'
      });
    }
  }

  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const resultado = await CameraService.listarTodasCameras({ page, limit });
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao listar câmeras'
      });
    }
  }

  static async alterarStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { ativo } = req.body;
    const adminId = req.user?.adminId;

    if (!adminId) {
      res.status(401).json({ erro: 'Admin não autenticado' }); 
      return;
    }

    try {
      const camera = await prisma.camera.update({
        where: { cameraId: id },
        data: { ativo }
      });

      res.status(200).json(camera);
      return;
    } catch (error) {
      res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao alterar status' 
      });
      return;
    }
  }
}
