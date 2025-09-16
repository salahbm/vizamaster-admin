import { NotFoundError } from '@/server/common/errors';

import { SidebarRepository } from './sidebar.repository';

class SidebarService {
  constructor(private readonly repository: SidebarRepository) {}

  getAllSidebar() {
    const sidebars = this.repository.getAllSidebar();

    if (!sidebars) throw new NotFoundError('Sidebars not found');

    return sidebars;
  }
}

export const sidebarService = new SidebarService(new SidebarRepository());
