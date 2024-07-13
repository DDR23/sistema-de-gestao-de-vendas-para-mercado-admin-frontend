import * as z from 'zod';

export const schemaCategoryPost = z.object({
  CATEGORY_NAME: z.string().min(1, { message: 'Obrigatório' })
})