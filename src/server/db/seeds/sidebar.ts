import prisma from '@/server/db/prisma';

type TSidebarSeed = {
  href: string;
  labelEn: string;
  labelRu: string;
  icon: string | null;
  children?: TSidebarSeed[];
};

const SIDENAV: TSidebarSeed[] = [
  {
    href: '/dashboard',
    labelEn: 'Dashboard',
    labelRu: 'Панель управления',
    icon: 'LayoutDashboard',
  },
  {
    href: '/applicant/all/all',
    labelEn: 'Applicants',
    labelRu: 'Заявители',
    icon: 'BookUser',
  },
  {
    href: '#',
    labelEn: 'Settings',
    labelRu: 'Настройки',
    icon: 'Settings',
    children: [
      {
        href: '/settings/admins',
        labelEn: 'Admins',
        labelRu: 'Администраторы',
        icon: 'Users',
      },
      {
        href: '/settings/group-codes',
        labelEn: 'Group Codes',
        labelRu: 'Коды группы',
        icon: 'Boxes',
      },
      {
        href: '/settings/codes',
        labelEn: 'Codes',
        labelRu: 'Коды',
        icon: 'GitFork',
      },
      {
        href: '/settings/sidebar',
        labelEn: 'Sidebar',
        labelRu: 'Боковая панель',
        icon: 'Route',
      },
      {
        href: '/settings/preferences',
        labelEn: 'Preferences',
        labelRu: 'Предпочтения',
        icon: 'FileSliders',
      },
    ],
  },
];

async function seedSidebar(items = SIDENAV, parentId?: string) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const created = await prisma.sidebar.create({
      data: {
        labelEn: item.labelEn,
        labelRu: item.labelRu,
        href: item.href,
        icon: item.icon,
        parentId: parentId || null,
        order: i, // keep order by index
      },
    });

    if (item.children?.length) {
      await seedSidebar(item.children, created.id);
    }
  }
}

async function main() {
  await prisma.sidebar.deleteMany();

  await seedSidebar();
  console.info('✅ Sidebar seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
