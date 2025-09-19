import { Codes } from '@/generated/prisma';
import {
  BadRequestError,
  NotFoundError,
  handlePrismaError,
} from '@/server/common/errors';
import { createPaginatedResult, createResponse } from '@/server/common/utils';
import { ISort } from '@/types/data-table';

import { CodesRepository } from './codes.repository';

class CodesService {
  constructor(private readonly repository: CodesRepository) {}

  async getAllCodes(
    page: number,
    size: number,
    sort?: ISort,
    search?: string,
    groupCodeId?: string,
  ) {
    try {
      const skip = Math.max(0, (page - 1) * size);
      const take = size;

      const [codes, total] = await Promise.all([
        this.repository.getAllCodes(skip, take, sort, search, groupCodeId),
        this.repository.countCodes(search, groupCodeId),
      ]);

      if (!codes || !Array.isArray(codes)) {
        throw new NotFoundError('Codes not found');
      }

      const mappedCodes = codes.map((code) => ({
        ...code,
        groupCode: code.groupCode.code,
      }));

      const paginatedData = createPaginatedResult(mappedCodes, total, {
        page,
        size,
      });

      // Ensure we're returning an array of group codes
      return createResponse(paginatedData);
    } catch (error) {
      throw handlePrismaError(error, 'Group codes');
    }
  }

  async getCodeById(id: string) {
    try {
      const code = await this.repository.getCodeById(id);

      if (!code) {
        throw new NotFoundError('Code not found');
      }

      return createResponse(code);
    } catch (error) {
      throw handlePrismaError(error, 'Code');
    }
  }

  async updateCodeById(
    id: string,
    data: Omit<Codes, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    try {
      if (!id) {
        throw new BadRequestError('Code id is required');
      }
      const code = await this.repository.updateCodeById(id, data);

      if (!code) {
        throw new NotFoundError('Code not found');
      }

      return createResponse(code);
    } catch (error) {
      throw handlePrismaError(error, 'Code');
    }
  }

  async createCode(data: Omit<Codes, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const code = await this.repository.createCode(data);

      if (!code) {
        throw new NotFoundError('Code not found');
      }

      return createResponse(code);
    } catch (error) {
      throw handlePrismaError(error, 'Code');
    }
  }

  async deleteCodeById(id: string) {
    try {
      const code = await this.repository.deleteCodeById(id);

      if (!code) {
        throw new NotFoundError('Code not found');
      }

      return createResponse(code);
    } catch (error) {
      throw handlePrismaError(error, 'Code');
    }
  }
}

export const codesService = new CodesService(new CodesRepository());
