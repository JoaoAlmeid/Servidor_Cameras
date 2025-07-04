import prisma from '../../lib/prisma';

export async function listarTodasCameras({ page = 1, limit = 10 }) {
  try {
    const skip = (page - 1) * limit;

    const [cameras, total] = await Promise.all([
        prisma.camera.findMany({
            skip,
            take: limit,
            orderBy: { nome: 'asc' },
            select: {
                cameraId: true,
                url: true,
                ativo: true,
                nome: true,
                localizacao: true,
                latitude: true,
                longitude: true
            }
        }),
        prisma.camera.count(),
    ]);

    return {
        data: cameras,
        page,
        total,
        totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Erro ao listar câmeras: ${error.message}`);
    }
    throw new Error('Erro desconhecido ao listar câmeras');
  }
}
