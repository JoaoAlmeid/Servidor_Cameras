import prisma from "../../lib/prisma";

export async function listarAdmins({ page = 1, limit = 10 }) {
    try {
        const skip = (page - 1) * limit;

        const [admins, total] = await Promise.all([
            prisma.admin.findMany({
                skip,
                take: limit,
                orderBy: { criadoEm: 'desc' },
                select: {
                    adminId: true,
                    email: true,
                    nome: true,
                    nivel: true,
                    criadoEm: true,
                    atualizadoEm: true
                }
            }),
            prisma.admin.count(),
        ])

        return {
            data: admins,
            page,
            total,
            totalPages: Math.ceil(total / limit)
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erro ao listar administradores: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao listar administradores');
        }
    }
}