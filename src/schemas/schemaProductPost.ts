import * as z from 'zod';

export const schemaProductPost = z.object({
  PRODUCT_NAME: z.string().min(1, { message: 'Obrigatório' }),
  PRODUCT_CATEGORY: z.string().min(1, { message: 'Obrigatório' }),
  PRODUCT_QUANTITY: z.number(),
  PRODUCT_PRICE: z.number()
})