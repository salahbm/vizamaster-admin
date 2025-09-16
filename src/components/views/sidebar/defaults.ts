import { Sidebar } from '../../../../generated/prisma';

export const sidebarDefaultValues = (data?: Sidebar) => ({
  labelEn: data?.labelEn || '',
  labelRu: data?.labelRu || '',
  href: data?.href || '',
  icon: data?.icon || '',
  parentId: data?.parentId || '',
  order: data?.order || 0,
});
