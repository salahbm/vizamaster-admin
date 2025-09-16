import { BadRequestError, NotFoundError } from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';

import { Sidebar } from '../../../../generated/prisma';
import { SidebarRepository } from './sidebar.repository';

class SidebarService {
  constructor(private readonly repository: SidebarRepository) {}

  async getAllSidebar() {
    const sidebars = await this.repository.getAllSidebar();

    if (!sidebars || !Array.isArray(sidebars)) {
      throw new NotFoundError('Sidebars not found');
    }

    // Ensure we're returning an array of sidebar items
    return createResponse(sidebars);
  }

  async getSidebarById(id: string) {
    const sidebar = await this.repository.getSidebarById(id);

    if (!sidebar) {
      throw new NotFoundError('Sidebar not found');
    }

    return createResponse(sidebar);
  }

  async updateSidebarById(id: string, data: Sidebar) {
    if (!id) {
      throw new BadRequestError('Sidebar id is required');
    }
    const sidebar = await this.repository.updateSidebarById(id, data);

    if (!sidebar) {
      throw new NotFoundError('Sidebar not found');
    }

    return createResponse(sidebar);
  }
}

export const sidebarService = new SidebarService(new SidebarRepository());
