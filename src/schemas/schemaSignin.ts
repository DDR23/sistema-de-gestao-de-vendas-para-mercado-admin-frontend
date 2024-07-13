import * as z from 'zod';

export const schemaSignin = z.object({
  USER_EMAIL: z.string(),
  USER_PASSWORD: z.string()
})