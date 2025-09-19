import { BadRequestError, NotFoundError } from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';
import { ISort } from '@/types/data-table';

import { Sidebar } from '../../../../generated/prisma';
import { SidebarRepository } from './sidebar.repository';

class SidebarService {
  constructor(private readonly repository: SidebarRepository) {}

  async getAllSidebar(sort?: ISort) {
    const sidebars = await this.repository.getAllSidebar(sort);

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

  async createSidebar(data: Omit<Sidebar, 'id' | 'createdAt' | 'updatedAt'>) {
    const sidebar = await this.repository.createSidebar(data);

    if (!sidebar) {
      throw new NotFoundError('Sidebar not found');
    }

    return createResponse(sidebar);
  }

  async deleteSidebarById(id: string) {
    const sidebar = await this.repository.deleteSidebarById(id);

    if (!sidebar) {
      throw new NotFoundError('Sidebar not found');
    }

    return createResponse(sidebar);
  }

  async getUserSidebars(userId: string) {
    const sidebars = await this.repository.getUserSidebars(userId);

    if (!sidebars || !Array.isArray(sidebars)) {
      throw new NotFoundError('Sidebars not found');
    }

    const mappedSidebars = sidebars.map((sidebar) => {
      return {
        id: sidebar.sidebarItem.id,
        labelEn: sidebar.sidebarItem.labelEn,
        labelRu: sidebar.sidebarItem.labelRu,
        href: sidebar.sidebarItem.href ? sidebar.sidebarItem.href?.trim() : '',
        icon: sidebar.sidebarItem.icon ? sidebar.sidebarItem.icon?.trim() : '',
        parentId: sidebar.sidebarItem.parentId,
        order: Number(sidebar.sidebarItem.order),
      };
    });

    // Ensure we're returning an array of sidebar items
    return createResponse(mappedSidebars);
  }

  // Update admin sidebars
  async updateAdminSidebars(userId: string, sidebarIds: string[]) {
    const result = await this.repository.updateAdminSidebars(
      userId,
      sidebarIds,
    );

    return createResponse(result);
  }
}

export const sidebarService = new SidebarService(new SidebarRepository());
