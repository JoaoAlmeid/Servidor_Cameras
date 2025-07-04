import { z } from 'zod';

export const atualizarSchema = z.object({
  adminId: z.string().uuid({ message: 'ID inválido' }),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
  nome: z.string().min(2).max(100).optional()
});

export const buscarIdSchema = z
  .string()
  .uuid({ message: 'ID de administrador inválido' })