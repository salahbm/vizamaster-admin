import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { SideNavItem } from '@/constants/routes';

import { Sidebar } from '@/generated/prisma';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleFormError(error: unknown) {
  console.error(`ZodError In Form Error`, JSON.stringify(error, null, 2));
  if (error instanceof Error) {
    return toast.error(error.message);
  }
  return toast.error('Please fill in all required fields');
}

export function convertSidebarToNavItems(
  sidebarData?: Sidebar[],
  locale?: string,
): SideNavItem[] {
  // Helper function to build the tree recursively
  function buildNavItem(item: Sidebar, allItems: Sidebar[]): SideNavItem {
    // Find children for this item
    const children = allItems.filter((child) => child.parentId === item.id);
    const label = locale === 'ru' ? item.labelRu : item.labelEn;
    return {
      id: item.id,
      href: item.href,
      label,
      icon: item.icon ?? null,
      // Only include children array if there are children
      ...(children.length > 0 && {
        children: children
          .sort((a, b) => a.order - b.order) // Sort by order
          .map((child) => buildNavItem(child, allItems)),
      }),
    };
  }
  if (!sidebarData) return [];
  // Filter top-level items (no parentId) and sort by order
  return sidebarData
    ?.filter((item) => !item.parentId)
    .sort((a, b) => a.order - b.order)
    .map((item) => buildNavItem(item, sidebarData));
}
