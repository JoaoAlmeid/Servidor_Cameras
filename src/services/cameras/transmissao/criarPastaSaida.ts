import fs from 'fs';
import path from 'path';
import { caminho_camera } from '../../../config/constantes';

export function criarPastaSaida(nomeCamera: string): string {
    const nomeLimpo = nomeCamera
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

    const nomePasta = path.join(caminho_camera, nomeLimpo);

    try {
        if (!fs.existsSync(nomePasta)) {
            fs.mkdirSync(nomePasta, { recursive: true });
        }

        const arquivos = fs.readdirSync(nomePasta);

        arquivos.forEach((file) => {
            const caminho = path.join(nomePasta, file);
            const stat = fs.statSync(caminho);

            if (stat.isFile()) {
                fs.unlinkSync(caminho);
            }
        });
    } catch (error) {
        throw new Error(`Erro ao criar pasta de saida da câmera (${nomeCamera}): ${error}`)
    }

    return nomePasta;
}