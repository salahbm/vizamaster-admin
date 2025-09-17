import { SIDENAV } from '@/constants/routes';

import prisma from '@/server/db/prisma';

async function seedSidebar(items = SIDENAV, parentId?: string) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const created = await prisma.sidebar.create({
      data: {
        labelEn: item.label,
        labelRu: item.label, // same for now
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
