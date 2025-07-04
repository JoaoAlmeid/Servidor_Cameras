import prisma from '../../lib/prisma';

export async function buscarCameraPorId(cameraId: string) {
  try {
    const camera = await prisma.camera.findUnique({
      where: { cameraId }
    });

    if (!camera) {
      throw new Error('Câmera não encontrada.');
    }

    return camera;
  } catch (error) {
    throw new Error(`Erro ao buscar câmera por ID: ${error instanceof Error ? error.message : error}`);
  }
}
