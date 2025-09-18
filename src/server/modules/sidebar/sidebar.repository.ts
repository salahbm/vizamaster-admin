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
}
