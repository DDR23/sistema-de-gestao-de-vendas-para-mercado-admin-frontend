import * as z from 'zod';

export const schemaTransactionPut = z.object({
  CART_STATUS: z.enum(['active', 'completed', 'canceled']).optional(),
});