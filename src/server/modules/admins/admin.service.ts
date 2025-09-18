import { adminRepository } from './admin.repository';

async function updateSidebars(userId: string, sidebarIds: string[]) {
  return adminRepository.updateSidebars(userId, sidebarIds);
}

export const adminService = {
  updateSidebars,
};
