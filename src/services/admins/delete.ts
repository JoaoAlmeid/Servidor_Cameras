import prisma from "../../lib/prisma";

export async function deletarAdmin(deletadoId: string, superId: string) {
    try {
        const solicitante = await prisma.admin.findUnique({
            where: { adminId: superId }
        });

        if (!solicitante || solicitante.nivel !== 'SUPER') {
            throw new Error('Apenas SUPER administradores podem excluir outros admins');
        }

        if (superId === deletadoId) {
            throw new Error('Você não pode deletar a si mesmo');
        }

        const deletado = await prisma.admin.delete({
            where: { adminId: deletadoId },
            select: {
                adminId: true,
                email: true
            }
        });

        return deletado;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Erro ao deletar administrador: ${deletadoId}`);
            throw new Error(`Error ao deletar admin (${deletadoId}): ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao deletar administrador')
        }
    }
}