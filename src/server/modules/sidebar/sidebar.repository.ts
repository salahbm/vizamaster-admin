import prisma from '@/server/db/prisma';

export class SidebarRepository {
  private readonly prisma = prisma;

  // Get all sidebars unlinked to user
  getAllSidebar() {
    return this.prisma.sidebar.findMany();
  }
}
