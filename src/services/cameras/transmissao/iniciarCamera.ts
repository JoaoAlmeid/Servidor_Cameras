import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath('ffmpeg');
import path from 'path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { criarPastaSaida } from './criarPastaSaida';
import { processos } from '../../../lib/processoCamera';
import { Camera } from '../../../generated/prisma';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export function gerarSlug(camera: Camera): string {
  return (camera.nome || `camera-${camera.cameraId}`)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '')
    .replace(/^-+|-+$/g, '');
}

export async function iniciarCamera(camera: Camera): Promise<void> {
  try {
    const slug = gerarSlug(camera);
    const nomePasta = criarPastaSaida(slug);
    const playlistPath = path.join(nomePasta, 'video.m3u8');

    if (processos[camera.cameraId]) {
      console.log(`🔁 FFmpeg já rodando para câmera ${camera.cameraId}. Ignorando novo start.`);
      return;
    }

    if (!camera.url || !camera.url.startsWith('rtsp')) {
      console.warn(`❌ URL inválida para câmera ${camera.cameraId}: ${camera.url}`);
      return;
    }

    if (!camera.ativo) {
      console.warn(`⏸️ Câmera ${camera.cameraId} está desativada. Ignorando execução do FFmpeg.`);
      return;
    }


    if (camera.url.startsWith('rtsps://')) {
      console.warn(`⚠️ A câmera ${camera.cameraId} usa RTSPS. Verifique se o FFmpeg tem suporte a TLS.`);
    }

    const comando = ffmpeg(camera.url)
      .inputOptions('-rtsp_transport tcp')
      .videoCodec('libx264')
      .audioCodec('aac')
      .addOption('-preset', 'veryfast')
      .outputOptions(['-f hls', '-hls_time 4', '-hls_list_size 5', '-hls_flags delete_segments'])
      .output(playlistPath)
      .on('start', (cmd) => {
        console.log(`🚀 FFmpeg iniciado para câmera ${camera.cameraId}`);
        console.log(`🔧 Comando: ${cmd}`);
      })
      .on('stderr', (stderrLine) => {
        console.log(`⚙️ [Camera ${camera.cameraId}] STDERR: ${stderrLine}`);
      })
      .on('end', () => {
        console.warn(`🛑 FFmpeg para câmera ${camera.cameraId} finalizou.`);
        delete processos[camera.cameraId];
        reiniciar();
      })
      .on('error', (err) => {
        console.error(`❌ Erro na câmera ${camera.cameraId}: ${err.message}`);
        delete processos[camera.cameraId];
        reiniciar();
      });

    function reiniciar() {
      setTimeout(() => {
        console.log(`🔁 Reiniciando câmera ${camera.cameraId}`);
        iniciarCamera(camera);
      }, 2000);
    }

    comando.run();

    processos[camera.cameraId] = {
      comando,
      camera: {
        cameraId: camera.cameraId,
        nome: camera.nome,
        url: camera.url,
        ativo: camera.ativo,
        localizacao: camera.localizacao,
        latitude: camera.latitude,
        longitude: camera.longitude
      },
    };
  } catch (error) {
    throw new Error(`Erro ao iniciar câmera (${camera.cameraId}): ${error}`)
  }
}
