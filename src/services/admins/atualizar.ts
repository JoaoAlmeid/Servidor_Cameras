import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { atualizarSchema } from './admin.schema';

export async function atualizarAdmin(data: unknown) {
    try {
        const { adminId, email, senha, nome } = atualizarSchema.parse(data);
      
        const adminExistente = await prisma.admin.findUnique({
          where: { adminId },
        });
      
        if (!adminExistente) {
          throw new Error('Administrador não encontrado');
        }
      
        const dadosAtualizados: Partial<{ email: string; senha: string; nome: string }> = {};
      
        if (email && email !== adminExistente.email) {
          dadosAtualizados.email = email;
        }
      
        if (senha) {
          dadosAtualizados.senha = await bcrypt.hash(senha, 10);
        }

        if (nome && nome !== adminExistente.nome) {
          dadosAtualizados.nome = nome;
        }
      
        const adminAtualizado = await prisma.admin.update({
          where: { adminId },
          data: dadosAtualizados,
          select: {
            adminId: true,
            email: true,
            nome: true,
            nivel: true,
            criadoEm: true,
            atualizadoEm: true,
          },
        });
      
        return adminAtualizado;
    } catch (error) {
        throw new Error(`Erro ao atualizar admin: ${error}`)
    }
}
