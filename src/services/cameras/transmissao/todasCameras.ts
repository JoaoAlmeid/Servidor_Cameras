import prisma from '../../../lib/prisma';

export async function todasCameras() {
  try {
    const todasCameras = await prisma.camera.findMany({
      select: {
        cameraId: true,
        url: true,
        ativo: true,
        nome: true,
        localizacao: true,
        latitude: true,
        longitude: true,
        criadoEm: true,
        atualizadoEm: true
      },
    });

    if (!todasCameras) throw new Error(`Nenhuma câmera encontrada`);
    
    return todasCameras;
  } catch (error) {
    throw new Error(`Erro ao buscar todas as câmeras: ${error}`);
  }
}