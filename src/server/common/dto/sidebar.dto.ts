import z from 'zod';

const sidebarDto = z.object({
  labelEn: z.string().min(4).max(150),
  labelRu: z.string().min(4).max(150),
  href: z.string().min(4).max(150),
  icon: z.string().nullable(),
  parentId: z.string().nullable(),
  parent: z.string().optional(),
  children: z.array(z.string().optional()).optional(),
  order: z.number().or(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  users: z.array(z.string().optional()).optional(),
});

type TSidebarDto = z.infer<typeof sidebarDto>;

const createSidebarDto = sidebarDto.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  users: true,
});

const updateSidebarDto = sidebarDto.extend({
  id: z.string(),
});

type TCreateSidebarDto = z.infer<typeof createSidebarDto>;
type TUpdateSidebarDto = z.infer<typeof updateSidebarDto>;

export {
  createSidebarDto,
  sidebarDto,
  updateSidebarDto,
  type TCreateSidebarDto,
  type TSidebarDto,
  type TUpdateSidebarDto,
};
