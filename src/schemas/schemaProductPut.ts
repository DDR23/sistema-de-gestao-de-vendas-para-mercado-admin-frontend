import * as z from 'zod';

export const schemaProductPut = z.object({
  PRODUCT_NAME: z.string().optional(),
  PRODUCT_CATEGORY: z.string().optional(),
  PRODUCT_QUANTITY: z.number().optional(),
  PRODUCT_PRICE: z.number().optional(),
  PRODUCT_DELETED: z.boolean().optional()
})