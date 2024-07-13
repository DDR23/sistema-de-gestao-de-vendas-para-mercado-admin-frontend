import * as z from 'zod';

export const schemaUserPut = z.object({
  USER_NAME: z.string().optional(),
  USER_PASSWORD: z.string().optional(),
  USER_DELETED: z.boolean().optional()
})