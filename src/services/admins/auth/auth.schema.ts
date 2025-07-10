import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: 'E-mail inválido!' }),
    senha: z.string()
        .min(8, { message: 'Senha muito curta, a senha deve ter pelo menos 8 caracteres!' })
        .max(16, { message: 'Senha muito grande, 16 caracteres é o limite!' })
});

export const alterarSenhaSchema = z.object({
    adminId: z.string().uuid(),
    senhaAtual: z.string()
      .min(8, { message: 'A senha atual deve ter pelo menos 8 caracteres' }),
    novaSenha: z.string()
      .min(8, { message: 'A nova senha deve ter pelo menos 8 caracteres' })
      .max(16, { message: 'A nova senha pode ter no máximo 16 caracteres' })
}).refine(data => data.senhaAtual !== data.novaSenha, {
    message: 'A nova senha deve ser diferente da senha atual',
    path: ['novaSenha'],
});


export const esqueciSenhaSchema = z.object({
  email: z.string().email(),
});

export const resetarSenhaSchema = z.object({
  token: z.string().min(10),
  novaSenha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})