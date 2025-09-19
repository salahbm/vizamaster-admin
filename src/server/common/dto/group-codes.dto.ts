import z from 'zod';

export const groupCodesDto = z.object({
  labelEn: z.string().min(4).max(150),
  labelRu: z.string().min(4).max(150),
  code: z.string().min(4).max(150),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TGroupCodesDto = z.infer<typeof groupCodesDto>;
