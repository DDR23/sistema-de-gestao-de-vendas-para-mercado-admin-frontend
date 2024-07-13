import * as z from 'zod';

export const schemaCategoryPut = z.object({
  CATEGORY_NAME: z.string().optional(),
  CATEGORY_DELETED: z.boolean().optional()
})