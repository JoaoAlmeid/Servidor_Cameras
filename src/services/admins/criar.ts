import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { NivelAdmin } from "../../generated/prisma";

export async function criarAdmin({
    nome,
    email,
    senha,
    nivel = 'SIMPLES'
}: {
    nome?: string;
    email: string;
    senha: string;
    nivel?: NivelAdmin;
}) {
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 12);

        const novoAdmin = await prisma.admin.create({
            data: {
                nome,
                email,
                senha: senhaCriptografada,
                nivel
            }
        });

        return novoAdmin
    } catch (error) {
        throw new Error(`Erro ao criar admin: ${error instanceof Error ? error.message : String(error)}`);
    }
}