import prisma from "../../lib/prisma";
import { AtualizarCamera, atualizarCameraSchema } from "./camera.schema";
import { TransmissaoService } from "./transmissao/streamPause";

export async function atualizarCamera(data: AtualizarCamera, atualizadoPorId: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { adminId: atualizadoPorId },
      select: { email: true }
    });

    if (!admin) {
      throw new Error('Apenas administradores podem atualizar câmeras');
    }

    const input = atualizarCameraSchema.parse(data);

    
    const cameraExistente = await prisma.camera.findUnique({
      where: { cameraId: input.cameraId }
    });
    
    if (!cameraExistente) {
      throw new Error('Câmera não encontrada');
    }
    
    const urlValida = cameraExistente.url.startsWith('rtsp://');
    if (!urlValida) throw new Error('Url Inválida!')

    const cameraAtualizada = await prisma.camera.update({
      where: { cameraId: input.cameraId },
      data: {
        url: input.url ?? cameraExistente.url,
        nome: input.nome ?? cameraExistente.nome,
        localizacao: input.localizacao ?? cameraExistente.localizacao,
        latitude: input.latitude ?? cameraExistente.latitude,
        longitude: input.longitude ?? cameraExistente.longitude,
        ativo: input.ativo ?? cameraExistente.ativo,
      }
    });

    try {
      await TransmissaoService.reiniciar(cameraAtualizada.cameraId);
    } catch (err) {
      console.warn(`⚠️ Erro ao reiniciar transmissão da câmera ${cameraAtualizada.nome}:`, err);
    }

    return cameraAtualizada;
  } catch (error) {
    throw new Error(`Erro ao atualizar câmera: ${error instanceof Error ? error.message : error}`);
  }
}
