import { FfmpegCommand } from 'fluent-ffmpeg';

interface CameraInfo {
    cameraId: string,
    url: string,
    ativo: boolean,
    nome: string,
    localizacao: string,
    latitude: number,
    longitude: number
}

interface ProcessoCamera {
    comando: FfmpegCommand;
    camera: CameraInfo
}

export const processos: Record<string, ProcessoCamera | undefined> = {};