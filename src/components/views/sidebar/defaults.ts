import { Sidebar } from '@/generated/prisma';
import { TCreateSidebarDto, TUpdateSidebarDto } from '@/server/common/dto';

export const sidebarDefaultValues = (
  data?: TUpdateSidebarDto | Sidebar | null,
): TCreateSidebarDto => {
  if (!data) {
    return {
      labelEn: '',
      labelRu: '',
      href: '',
      icon: '',
      parentId: '',
      order: 0,
    };
  }

  return {
    labelEn: data.labelEn,
    labelRu: data.labelRu,
    href: data.href,
    icon: data.icon ?? '',
    parentId: data.parentId ?? '',
    order:
      typeof data.order === 'string'
        ? parseInt(data.order, 10)
        : (data.order ?? 0),
  };
};
