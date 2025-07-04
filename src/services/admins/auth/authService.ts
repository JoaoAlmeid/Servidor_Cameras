import prisma from "../../../lib/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { alterarSenhaSchema, esqueciSenhaSchema, loginSchema } from "./auth.schema";
import { gerarAccessToken, gerarRefreshToken } from "../../../lib/gerarToken";
import { UnauthorizedError } from "../../../err/UnauthorizedError";

export class AuthAdminService {
    constructor(private readonly prismaClient = prisma) {}

    async login(input: unknown) {
        const { email, senha } = loginSchema.parse(input);

        const admin = await this.prismaClient.admin.findUnique({ where: { email } });
        if (!admin) throw new UnauthorizedError('Credenciais Inválidas');

        const senhaCorreta = await bcrypt.compare(senha, admin.senha);
        if (!senhaCorreta) throw new Error('Senha Incorreta');

        const payload = { sub: admin.adminId, email: admin.email, nivel: admin.nivel };
        const token = gerarAccessToken(payload);
        const refreshToken = gerarRefreshToken(payload)

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.prismaClient.admin.update({
            where: { adminId: admin.adminId },
            data: { refreshToken: hashedRefreshToken },
        })

        return { 
            admin: {
                id: admin.adminId,
                email: admin.email,
                nome: admin.nome,
                nivel: admin.nivel
            },
            token, 
            refreshToken
        };
    }

    async logout(_: unknown) {
        return { message: 'Logout realizado com sucesso' };
    }

    verifyToken(token: string) {
        try {
            const segredo_jwt = process.env.JWT_SECRET;
            if (!segredo_jwt) {
                throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.');
            }

            return jwt.verify(token, segredo_jwt);
        } catch {
            throw new Error('Token inválido ou expirado');
        }
    }

    async alterarSenha(input: unknown) {
        const { adminId, senhaAtual, novaSenha } = alterarSenhaSchema.parse(input);
    
        const admin = await this.prismaClient.admin.findUnique({ where: { adminId } });
        if (!admin) throw new Error('Administrador não encontrado');
    
        const senhaCorreta = await bcrypt.compare(senhaAtual, admin.senha);
        if (!senhaCorreta) throw new Error('Senha atual incorreta');
    
        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
    
        await this.prismaClient.admin.update({
          where: { adminId },
          data: { senha: novaSenhaHash },
        });
    
        return { message: 'Senha atualizada com sucesso' };
    }
    
    async esqueciSenha(input: unknown) {
        const { email } = esqueciSenhaSchema.parse(input);
    
        const admin = await this.prismaClient.admin.findUnique({ where: { email } });
        if (!admin) throw new Error('Administrador não encontrado');
    
        // Geração de código simples (substitua por token seguro e e-mail real depois)
        const codigoRecuperacao = Math.floor(100000 + Math.random() * 900000).toString();
    
        // Simulando envio e armazenando token num log (ou tabela futura)
        console.log(`Código de recuperação para ${email}: ${codigoRecuperacao}`);
    
        return {
          message: 'Código de recuperação enviado para o e-mail (simulado)',
          codigo: codigoRecuperacao, // Remova isso em produção
        };
    }

    async refresh(token: string) {
        try {
            const segredo_atualizado = process.env.JWT_REFRESH_SECRET;
            if (!segredo_atualizado) {
                throw new Error('JWT_REFRESH_SECRET não está definido nas variáveis de ambiente.');
            }

            const decoded = jwt.verify(token, segredo_atualizado) as { sub: string };

            const admin = await this.prismaClient.admin.findUnique({
                where: { adminId: decoded.sub },
            });

            if (!admin || admin.refreshToken !== token) {
                throw new Error('Refresh token inválido');
            }

            const payload = {
                sub: admin.adminId,
                email: admin.email,
                nivel: admin.nivel
            };

            const novoAccessToken = gerarAccessToken(payload);
            const novoRefreshToken = gerarRefreshToken(payload);

            // Atualiza o refresh token no banco
            await this.prismaClient.admin.update({
                where: { adminId: admin.adminId },
                data: { refreshToken: novoRefreshToken },
            });

            return { token: novoAccessToken, refreshToken: novoRefreshToken };
        } catch (error) {
            throw new Error('Token de atualização inválido ou expirado');
        }
    }

}