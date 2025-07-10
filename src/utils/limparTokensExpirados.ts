import cron from 'node-cron';
import prisma from '../lib/prisma';

export function iniciarLimpeza() {
    // Executa todos os dias às 3h da manhã
    cron.schedule('0 3 * * *', async () => {
        console.log('🧹 Iniciando limpeza de tokens expirados...');

        try {
            const { count } = await prisma.senhaTokenRecuperacao.deleteMany({
                where: {
                    expiracao: {
                        lt: new Date(),
                    }
                }
            });

            console.log(`✅ ${count} token(s) expirado(s) removido(s) com sucesso.`)
        } catch (err) {
            console.error('❌ Erro ao limpar tokens expirados:', err);
        }
    })
}