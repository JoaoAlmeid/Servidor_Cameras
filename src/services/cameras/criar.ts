import prisma from "../../lib/prisma";
import { NovaCamera, criarCameraSchema } from "./camera.schema";
import { InicioTransmissaoService } from "./transmissao/streamInit";

export async function criarCamera(data: NovaCamera, criadoPorId: string) {
  try {
    const criador = await prisma.admin.findUnique({ 
        where: { adminId: criadoPorId },
        select: { email: true }
    });
    if (!criador) { throw new Error('Apenas administradores podem criar novas câmeras')};

    const input = criarCameraSchema.parse(data);

    const urlValida = data.url.startsWith('rtsp://');
    if (!urlValida) throw new Error('Url Inválida!')

    const jaExiste = await prisma.camera.findFirst({
        where: {
            OR: [{ url: input.url }, { nome: input.nome }]
        }
    });

    if (jaExiste) throw new Error('Já existe uma câmera com esse nome!');
    
    const camera = await prisma.camera.create({
      data: {
        url: input.url,
        nome: input.nome,
        localizacao: input.localizacao,
        latitude: input.latitude,
        longitude: input.longitude
      }
    });

    try {
      await InicioTransmissaoService.iniciarUma(camera.cameraId)
    } catch (err) {
      console.warn(`⚠️ Erro ao iniciar transmissão da câmera ${camera.nome}:`, err);
    }

    return camera;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao criar câmera: ${error.message}`);
    }
    throw new Error('Erro desconhecido ao criar câmera');
  }
}
