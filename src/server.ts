import app from './app';
import prisma from './lib/prisma';
import { iniciarCamera } from './services/cameras/transmissao/iniciarCamera';

const port = process.env.PORT || '4010';
const url_backend = process.env.BACKEND_URL || 'http://localhost';

async function iniciarCamerasAtivas() {
  try {
    const camerasAtivas = await prisma.camera.findMany({
      where: { ativo: true }
    })

    for (const camera of camerasAtivas) {
      await iniciarCamera(camera)
    }

    console.log(`🚀 ${camerasAtivas.length} câmeras ativas iniciadas.`)
  } catch (err) {
    console.error('Erro ao iniciar câmeras ativas:', err)
  }
}
/**
 * Inicia o servidor e execulta as inicializações
 */
async function iniciarServidor() {
  try {
    app.listen(Number(port), async () => {
      console.log(`🚀 Servidor rodando em ${url_backend}:${port}`);
      await iniciarCamerasAtivas()
    });
  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor: ', err);
    process.exit(1);
  }
}

iniciarServidor();