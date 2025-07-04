import prisma from '../../lib/prisma';
import { buscarIdSchema } from './admin.schema';

export async function buscarAdminId(adminId: unknown) {
    try {
        const id = buscarIdSchema.parse(adminId);
      
        const admin = await prisma.admin.findUnique({
          where: { adminId: id },
          select: {
            adminId: true,
            nome: true,
            email: true,
            nivel: true,
            criadoEm: true,
            atualizadoEm: true,
          },
        });
      
        if (!admin) {
          throw new Error('Administrador não encontrado');
        }
      
        return admin;
    } catch (error) {
        throw new Error(`Erro ao buscar admin com Id (${adminId}): ${error}`)
    }
}
