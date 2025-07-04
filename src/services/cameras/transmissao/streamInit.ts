import prisma from '../../../lib/prisma';
import { iniciarCamera } from './iniciarCamera';
import { todasCameras } from './todasCameras';

export class InicioTransmissaoService {
  static async iniciarUma(cameraId: string): Promise<{ message: string }> {
    try {
      const camera = await prisma.camera.findUnique({
        where: { cameraId }
      });

      if (!camera) {
        throw new Error('Câmera não encontrada.');
      }

      if (!camera.ativo) {
        console.info(`📴 Câmera ${camera.cameraId} ignorada: está inativa.`);
        return { message: `Câmera ${camera.nome} está inativa e não foi iniciada.` };
      }

      await iniciarCamera(camera);
      console.log(`✅ Transmissão iniciada para câmera ${camera.nome}`);
      return { message: `Transmissão iniciada para câmera ${camera.nome}` };
    } catch (error) {
      throw new Error(`Erro ao iniciar transmissão da câmera ${cameraId}: ${error instanceof Error ? error.message : error}`);
    }
  }

  static async iniciarTodas(): Promise<{ iniciadas: string[]; message: string }> {
    try {
      const cameras = await todasCameras();
      const iniciadas: string[] = [];

      if (!cameras || cameras.length === 0) {
        console.warn('Nenhuma câmera encontrada no banco de dados.');
        return { iniciadas, message: 'Nenhuma câmera encontrada.' };
      }

      for (const camera of cameras) {
        if (!camera.ativo) {
          console.info(`📴 Câmera ${camera.cameraId} ignorada: está inativa.`);
          continue;
        }

        await iniciarCamera(camera);
        iniciadas.push(camera.nome);
      }

      const message = `✅ ${iniciadas.length} transmissões iniciadas: ${iniciadas.join(', ')}`;
      console.log(message);
      return { iniciadas, message };
    } catch (error) {
      throw new Error(`Erro ao iniciar todas as transmissões: ${error instanceof Error ? error.message : error}`);
    }
  }
}