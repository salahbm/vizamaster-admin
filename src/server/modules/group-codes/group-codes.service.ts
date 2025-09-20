import {
  BadRequestError,
  NotFoundError,
  handlePrismaError,
} from '@/server/common/errors';
import { createPaginatedResult, createResponse } from '@/server/common/utils';
import { ISort } from '@/types/data-table';

import { GroupCodes, Sidebar } from '../../../../generated/prisma';
import { GroupCodesRepository } from './group-codes.repository';

class GroupCodesService {
  constructor(private readonly repository: GroupCodesRepository) {}

  async getAllGroupCodes(
    page: number = 1,
    size: number = 50,
    sort?: ISort,
    search: string = '',
    code: string = '',
  ) {
    try {
      const skip = Math.max(0, (page - 1) * size);
      const take = size;

      const [groupCodes, total] = await Promise.all([
        this.repository.getAllGroupCodes(sort, search, skip, take, code),
        this.repository.countGroupCodes(search, code),
      ]);

      if (!groupCodes || !Array.isArray(groupCodes)) {
        throw new NotFoundError('Group codes not found');
      }

      const paginatedData = createPaginatedResult(groupCodes, total, {
        page,
        size,
      });

      // Ensure we're returning an array of group codes
      return createResponse(paginatedData);
    } catch (error) {
      throw handlePrismaError(error, 'Group codes');
    }
  }

  async getGroupCodeById(id: string) {
    try {
      const groupCode = await this.repository.getGroupCodeById(id);

      if (!groupCode) {
        throw new NotFoundError('Group code not found');
      }

      return createResponse(groupCode);
    } catch (error) {
      throw handlePrismaError(error, 'Group code');
    }
  }

  async updateGroupCodeById(id: string, data: Sidebar) {
    try {
      if (!id) {
        throw new BadRequestError('Group code id is required');
      }
      const groupCode = await this.repository.updateGroupCodeById(id, data);

      if (!groupCode) {
        throw new NotFoundError('Group code not found');
      }

      return createResponse(groupCode);
    } catch (error) {
      throw handlePrismaError(error, 'Group code');
    }
  }

  async createGroupCode(
    data: Omit<GroupCodes, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    try {
      const groupCode = await this.repository.createGroupCode(data);

      if (!groupCode) {
        throw new NotFoundError('Group code not found');
      }

      return createResponse(groupCode);
    } catch (error) {
      throw handlePrismaError(error, 'Group code');
    }
  }

  async deleteGroupCodeById(id: string) {
    try {
      const groupCode = await this.repository.deleteGroupCodeById(id);

      if (!groupCode) {
        throw new NotFoundError('Group code not found');
      }

      return createResponse(groupCode);
    } catch (error) {
      throw handlePrismaError(error, 'Group code');
    }
  }
}

export const groupCodesService = new GroupCodesService(
  new GroupCodesRepository(),
);
