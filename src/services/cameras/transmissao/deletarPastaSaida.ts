import fs from 'fs';
import path from 'path';
import { caminho_camera } from '../../../config/constantes';

export function deletarPastaSaida(slug: string): void {
  const pasta = path.join(caminho_camera, slug);

  try {
    if (fs.existsSync(pasta)) {
      fs.readdirSync(pasta).forEach((file) => {
        const filePath = path.join(pasta, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });

      fs.rmdirSync(pasta); // Remove a pasta após apagar os arquivos
    }
  } catch (error) {
    console.warn(`⚠️ Erro ao tentar deletar pasta da câmera "${slug}":`, error);
    // Não lança erro para não quebrar o fluxo
  }
}
