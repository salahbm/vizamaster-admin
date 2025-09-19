import z from 'zod';

export const codesDto = z.object({
  labelEn: z.string().min(4).max(150),
  labelRu: z.string().min(4).max(150),
  code: z.string().min(4).max(150),
  groupCodeId: z
    .string()
    .refine((value) => value !== '', 'Group Code is required'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TCodesDto = z.infer<typeof codesDto>;
