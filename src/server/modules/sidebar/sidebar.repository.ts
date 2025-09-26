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
    const updateData = { ...data };
    if (updateData.parentId === '') {
      updateData.parentId = null;
    }

    return await this.prisma.sidebar.update({
      where: { id },
      data: updateData,
    });
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
    const createData = { ...data };

    if (createData.parentId === '') {
      createData.parentId = null;
    }

    return await this.prisma.sidebar.create({ data: createData });
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
  async updateAdminSidebars(userId: string, sidebarIds: string[]) {
    return this.prisma.$transaction(async (tx) => {
      // First, verify the user exists
      const userExists = await tx.users.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!userExists) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Verify all sidebar IDs exist if there are any
      if (sidebarIds.length > 0) {
        const existingSidebars = await tx.sidebar.findMany({
          where: { id: { in: sidebarIds } },
          select: { id: true },
        });

        const foundIds = existingSidebars.map((s) => s.id);
        const missingIds = sidebarIds.filter((id) => !foundIds.includes(id));

        if (missingIds.length > 0) {
          throw new Error(`Sidebar items not found: ${missingIds.join(', ')}`);
        }
      }

      // Delete all existing sidebar entries for this user
      const deletedEntries = await tx.sidebarUser.deleteMany({
        where: { userId },
      });

      // If no sidebar IDs are provided, just return the deleted count
      if (sidebarIds.length === 0) {
        return { deleted: deletedEntries.count, created: 0 };
      }

      // Create new entries for the provided sidebar IDs
      const newSidebarEntries = await tx.sidebarUser.createMany({
        data: sidebarIds.map((sidebarId) => ({
          userId,
          sidebarItemId: sidebarId,
        })),
      });

      // Return a more informative result
      return {
        deleted: deletedEntries.count,
        created: newSidebarEntries.count,
        sidebarIds,
      };
    });
  }

  // Delete user sidebar by sidebar id
  async deleteUserSidebarBySidebarId(sidebarId: string) {
    return await this.prisma.sidebarUser.deleteMany({
      where: {
        sidebarItemId: sidebarId,
      },
    });
  }
}
