import { Prisma } from '@prisma/client';

import prisma from '@/server/db/prisma';

async function updateSidebars(userId: string, sidebarIds: string[]) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.sidebarUser.deleteMany({
      where: { userId },
    });

    const createdSidebars = await tx.sidebarUser.createMany({
      data: sidebarIds.map((sidebarId) => ({
        userId,
        sidebarItemId: sidebarId,
      })),
    });

    return createdSidebars;
  });
}

export const adminRepository = {
  updateSidebars,
};
