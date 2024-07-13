import * as z from 'zod';

export const schemaSignup = z.object({
  USER_EMAIL: z.string().email('Email inválido').min(1, { message: 'Obrigatório' }),
  USER_NAME: z.string().min(1, { message: 'Obrigatório' }),
  USER_PASSWORD: z.string().min(8, { message: 'A senha deve ter pelo menos 8 digitos' })
})