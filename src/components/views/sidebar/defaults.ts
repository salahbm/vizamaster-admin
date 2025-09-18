import { Sidebar } from '@/generated/prisma';
import { TCreateSidebarDto, TUpdateSidebarDto } from '@/server/common/dto';

export const sidebarDefaultValues = (
  data?: TUpdateSidebarDto | Sidebar,
): TCreateSidebarDto => ({
  labelEn: data?.labelEn || '',
  labelRu: data?.labelRu || '',
  href: data?.href || '',
  icon: data?.icon || '',
  parentId: data?.parentId || '',
  order: data?.order || 0,
});
