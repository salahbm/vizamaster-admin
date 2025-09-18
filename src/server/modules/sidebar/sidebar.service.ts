import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/server/common/errors';
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
    try {
      const sidebar = await this.repository.createSidebar(data);

      if (!sidebar) {
        throw new NotFoundError('Sidebar not found');
      }

      return createResponse(sidebar);
    } catch (error: unknown) {
      // Handle Prisma's unique constraint error
      type PrismaError = {
        code: string;
        meta?: {
          target?: string[];
        };
      };
      const prismaError = error as PrismaError;
      if (
        prismaError.code === 'P2002' &&
        prismaError.meta?.target?.includes('href')
      ) {
        throw new ConflictError(
          `A sidebar with URL '${data.href}' already exists`,
        );
      }
      throw error;
    }
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

    // Ensure we're returning an array of sidebar items
    return createResponse(sidebars);
  }
}

export const sidebarService = new SidebarService(new SidebarRepository());
