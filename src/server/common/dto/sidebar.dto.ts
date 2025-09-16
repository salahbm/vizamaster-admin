import z from 'zod';

export const createSidebarDto = z.object({
  labelEn: z.string().min(4).max(150),
  labelRu: z.string().min(4).max(150),
  href: z.string().min(4).max(150),
  icon: z.string().optional(),
  parentId: z.string().optional(),
  parent: z.string().optional(),
  children: z.array(z.string().optional()).optional(),
  order: z.coerce.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  users: z.array(z.string().optional()).optional(),
});

export type CreateSidebarDto = z.infer<typeof createSidebarDto>;
