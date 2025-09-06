'use client';
import { FC, useEffect, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import { useTranslations } from 'next-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SIDENAV, SideNavItem } from '@/constants/routes';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/store/sidebar';

import { DynamicIcon } from './icon';

const isPathActive = (pathname: string | null, href: string) => {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href);
};

const SidebarNav: FC = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { isMinimized } = useSidebar();
  const [expanded, setExpanded] = useState<string[]>([]);

  const { activeParent, activeChild } = useMemo(() => {
    let parent: SideNavItem | undefined;
    let child: SideNavItem | undefined;
    for (const item of SIDENAV) {
      if (isPathActive(pathname, item.href)) parent ??= item;
      if (item.children) {
        for (const c of item.children) {
          if (isPathActive(pathname, c.href)) {
            parent = item;
            child = c;
            break;
          }
        }
      }
      if (child) break;
    }
    return { activeParent: parent, activeChild: child };
  }, [pathname]);

  useEffect(() => {
    if (activeParent?.label && !expanded.includes(activeParent.label)) {
      setExpanded(prev => [...prev, activeParent.label]);
    }
  }, [activeParent?.label]);

  const onAccordionChange = (value: string | string[]) =>
    setExpanded(value ? (Array.isArray(value) ? value : [value]) : []);

  const navItemClasses = (isActive: boolean) =>
    cn(
      'flex items-center gap-2 rounded-md px-4 py-3 text-lg w-full transition-colors',
      isActive
        ? 'bg-primary/15 text-primary font-medium'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    );

  return (
    <nav
      aria-label={t('sidebar.navigation') ?? 'Sidebar'}
      className={cn(
        'flex-1 overflow-y-auto px-2 py-5 truncate transition-all duration-200',
        isMinimized ? 'lg:w-16 w-0' : 'w-64'
      )}
    >
      <div className="space-y-1">
        {SIDENAV.map(item => {
          const hasChildren = !!item.children?.length;
          const isActive = activeParent?.href === item.href;
          const isChildActive = !!activeChild;

          if (hasChildren) {
            return (
              <Accordion
                key={item.href}
                type="multiple"
                value={expanded}
                onValueChange={onAccordionChange}
              >
                <AccordionItem value={item.label} className="border-none">
                  <AccordionTrigger
                    className={cn(
                      navItemClasses(isActive || isChildActive),
                      'justify-between',
                      isMinimized && 'px-2 [&>svg]:hidden justify-center'
                    )}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2">
                      <DynamicIcon
                        name={item.icon}
                        className={cn(
                          'size-6',
                          isActive || isChildActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                        aria-hidden
                      />
                      {!isMinimized && <span>{t(`Sidebar.${item.label}`)}</span>}
                    </div>
                  </AccordionTrigger>
                  {!isMinimized && (
                    <AccordionContent>
                      <div className="space-y-1 pl-6 pt-1">
                        {item.children!.map(child => {
                          const childActive = isPathActive(pathname, child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href as any}
                              className={navItemClasses(childActive)}
                              aria-current={childActive ? 'page' : undefined}
                            >
                              {t(`Sidebar.${child.label}`)}
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              </Accordion>
            );
          }

          const isItemActive = isPathActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(navItemClasses(isItemActive), isMinimized && 'justify-center px-2')}
              aria-current={isItemActive ? 'page' : undefined}
              title={item.label}
            >
              <DynamicIcon
                name={item.icon}
                className={cn('size-5', isItemActive ? 'text-primary' : 'text-muted-foreground')}
              />
              {!isMinimized && <span>{t(`Sidebar.${item.label}`)}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNav;
