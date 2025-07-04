import prisma from '../../../lib/prisma';
import { processos } from '../../../lib/processoCamera';
import { iniciarCamera } from './iniciarCamera';

export class TransmissaoService {
  static pararTransmissao(cameraId: string): { message: string } {
    const processo = processos[cameraId];

    if (!processo) {
      return { message: `⚠️ Nenhuma transmissão ativa encontrada para a câmera ${cameraId}.` };
    }

    try {
      processo.comando.kill('SIGKILL');
      delete processos[cameraId];
      return { message: `🛑 Transmissão da câmera ${cameraId} encerrada com sucesso.` };
    } catch (error) {
      throw new Error(`Erro ao encerrar transmissão da câmera ${cameraId}: ${error instanceof Error ? error.message : error}`);
    }
  }

  static pararTodas(): { encerradas: string[]; message: string } {
    const encerradas: string[] = [];

    for (const cameraId in processos) {
        const processo = processos[cameraId];
        if (!processo || !processo.comando) continue;

        try {
            processo.comando.kill('SIGKILL');
            encerradas.push(cameraId);
            delete processos[cameraId];
        } catch (error) {
            console.error(`Erro ao encerrar transmissão da câmera ${cameraId}: ${error}`);
        }
    }

    return {
      encerradas,
      message: `🛑 ${encerradas.length} transmissões encerradas com sucesso.`
    };
  }

  static async reiniciar(cameraId: string): Promise<{ message: string }> {
    try {
      if (!cameraId) throw new Error('ID da câmera é obrigatório.');

      const camera = await prisma.camera.findUnique({
        where: { cameraId }
      });

      if (!camera) throw new Error('Câmera não encontrada.');
      if (!camera.ativo) throw new Error('Câmera está desativada.');

      const processo = processos[camera.cameraId];

      if (processo) {
        console.log(`🛑 Encerrando FFmpeg da câmera ${camera.cameraId}`);
        processo.comando.kill('SIGKILL');
        delete processos[camera.cameraId];

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await iniciarCamera(camera);

      return { message: `Câmera ${camera.nome} reiniciada com sucesso.` };
    } catch (error) {
      throw new Error(`Erro ao reiniciar câmera: ${error instanceof Error ? error.message : error}`);
    }
  }
}
