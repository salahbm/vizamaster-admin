import prisma from '@/server/db/prisma';

import { Sidebar } from '../../../../generated/prisma';

export class SidebarRepository {
  private readonly prisma = prisma;

  // Get all sidebars unlinked to user
  async getAllSidebar() {
    return await this.prisma.sidebar.findMany();
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

  // Create Global Sidebar
  // createGlobalSidebar(data: CreateSidebarDto) {
  //   return this.prisma.sidebar.create({ data });
  // }
}
