import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('E-mail inválido'));

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  email: emailSchema,
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .refine((password) => Buffer.byteLength(password, 'utf8') <= 72, {
      message: 'A senha não pode exceder 72 bytes',
    }),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
