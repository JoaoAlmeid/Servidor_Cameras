import { PrismaClient } from '../generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

// Cria instância padrão
const baseClient = new PrismaClient();

// Aplica extensão com Accelerate
const prisma = baseClient.$extends(withAccelerate());

export default prisma;