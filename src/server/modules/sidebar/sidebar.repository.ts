import { buildOrderBy } from '@/server/common/utils';
import prisma from '@/server/db/prisma';
import { ISort } from '@/types/data-table';

import { Sidebar } from '../../../../generated/prisma';

export class SidebarRepository {
  private readonly prisma = prisma;

  // Get all sidebars unlinked to user
  async getAllSidebar(sort?: ISort) {
    const orderBy = buildOrderBy(sort);
    return await this.prisma.sidebar.findMany({ orderBy });
  }

  // Get sidebar by id
  async getSidebarById(id: string) {
    return await this.prisma.sidebar.findUnique({ where: { id } });
  }

  // Update sidebar by id
  async updateSidebarById(id: string, data: Sidebar) {
    return await this.prisma.sidebar.update({ where: { id }, data });
  }

  // Get user sidebars
  getUserSidebars(userId: string) {
    return this.prisma.sidebarUser.findMany({
      where: { userId },
      include: { sidebarItem: true },
    });
  }

  // Create sidebar
  async createSidebar(data: Omit<Sidebar, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.prisma.sidebar.create({ data });
  }

  // Delete sidebar by id
  async deleteSidebarById(id: string) {
    return await this.prisma.$transaction(async (tx) => {
      // First, delete all related entries in the pivot table
      await tx.sidebarUser.deleteMany({
        where: { sidebarItemId: id },
      });

      // Then, delete the sidebar item itself
      return await tx.sidebar.delete({ where: { id } });
    });
  }

  // Update admin sidebars
  updateAdminSidebars(userId: string, sidebarIds: string[]) {
    return this.prisma.$transaction(async (tx) => {
      // First, delete all existing sidebar entries for this user
      await tx.sidebarUser.deleteMany({
        where: { userId },
      });

      // Then, create new entries for the provided sidebar IDs
      const newSidebarEntries = await tx.sidebarUser.createMany({
        data: sidebarIds.map((sidebarId) => ({
          userId,
          sidebarItemId: sidebarId,
        })),
      });

      return newSidebarEntries;
    });
  }
}
