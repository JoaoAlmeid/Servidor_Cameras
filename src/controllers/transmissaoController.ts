import { Request, Response } from 'express';
import { InicioTransmissaoService } from '../services/cameras/transmissao/streamInit';
import { TransmissaoService } from '../services/cameras/transmissao/streamPause';

export class TransmissaoController {
  static async iniciarUma(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await InicioTransmissaoService.iniciarUma(id);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao iniciar transmissão'
      });
    }
  }

  static async iniciarTodas(_: Request, res: Response): Promise<void> {
    try {
      const resultado = await InicioTransmissaoService.iniciarTodas();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao iniciar todas transmissões'
      });
    }
  }

  static pararUma(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const resultado = TransmissaoService.pararTransmissao(id);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao parar transmissão'
      });
    }
  }

  static pararTodas(_: Request, res: Response): void {
    try {
      const resultado = TransmissaoService.pararTodas();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao parar todas transmissões'
      });
    }
  }

  static async reiniciar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await TransmissaoService.reiniciar(id);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao reiniciar câmera'
      });
    }
  }
}
