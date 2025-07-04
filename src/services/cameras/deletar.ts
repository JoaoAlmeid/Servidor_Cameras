import prisma from "../../lib/prisma";
import { processos } from "../../lib/processoCamera";
import { deletarPastaSaida } from "./transmissao/deletarPastaSaida";
import { gerarSlug } from "./transmissao/iniciarCamera";

export async function deletarCamera(cameraId: string, adminId: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { adminId },
      select: { email: true }
    });
    if (!admin) throw new Error("Apenas administradores podem deletar câmeras.");

    const camera = await prisma.camera.findUnique({ where: { cameraId } });
    if (!camera) throw new Error("Câmera não encontrada.");

    try {
      // 🛑 Finaliza o processo FFmpeg, ignora erros
      if (processos[cameraId]) {
        processos[cameraId].comando.kill('SIGKILL');
        delete processos[cameraId];
      }
    } catch (ffmpegError) {
      console.warn('⚠️ Erro ao matar processo FFmpeg:', ffmpegError)
    }

    // Deletar no banco
    const cameraDeletada = await prisma.camera.delete({
      where: { cameraId }
    });

    try {
      const slug = gerarSlug(camera);
      deletarPastaSaida(slug)
    } catch (fsError) {
      console.warn('⚠️ Erro ao deletar pasta da câmera: ', fsError)
    }

    return {
      message: `Câmera ${camera.nome} deletada com sucesso.`,
      camera: cameraDeletada
    };
  } catch (error) {
    console.error('Erro interno ao deletar câmera:', error);
    throw new Error(
      `Erro ao deletar câmera: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
