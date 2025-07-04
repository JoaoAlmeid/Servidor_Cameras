import { z } from 'zod';

export const criarCameraSchema = z.object({
  url: z.string().url({ message: 'URL inválida' }),
  nome: z.string().min(3, 'Nome muito curto'),
  localizacao: z.string().min(3, 'Localização muito curta'),
  latitude: z.number(),
  longitude: z.number()
});

export const atualizarCameraSchema = z.object({
  cameraId: z.string().cuid(),
  url: z.string().url().optional(),
  nome: z.string().min(3).optional(),
  ativo: z.boolean().optional(),
  localizacao: z.string().min(3).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type AtualizarCamera = z.infer<typeof atualizarCameraSchema>;
export type NovaCamera = z.infer<typeof criarCameraSchema>;