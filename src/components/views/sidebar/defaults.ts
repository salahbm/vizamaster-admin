import { Sidebar } from '@/generated/prisma';
import { TUpdateSidebarDto } from '@/server/common/dto';

export const sidebarDefaultValues = (data?: TUpdateSidebarDto | Sidebar) => ({
  id: data?.id || '',
  labelEn: data?.labelEn || '',
  labelRu: data?.labelRu || '',
  href: data?.href || '',
  icon: data?.icon || '',
  parentId: data?.parentId || '',
  order: data?.order || 0,
});
