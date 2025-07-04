import prisma from '../../lib/prisma';

export async function buscarCameraPorNome(nome: string) {
  try {
    const camera = await prisma.camera.findUnique({
      where: { nome }
    });

    if (!camera) {
      throw new Error('Câmera não encontrada pelo nome.');
    }

    return camera;
  } catch (error) {
    throw new Error(`Erro ao buscar câmera por nome: ${error instanceof Error ? error.message : error}`);
  }
}
