import { Applicant } from '@/generated/prisma';
import {
  BadRequestError,
  NotFoundError,
  handlePrismaError,
} from '@/server/common/errors';
import { createPaginatedResult, createResponse } from '@/server/common/utils';
import { ISort } from '@/types/data-table';

import { ApplicantRepository } from './applicant.repository';

class ApplicantService {
  private readonly repository: ApplicantRepository;

  constructor(repository: ApplicantRepository) {
    this.repository = repository;
  }

  async createApplicant(data: Applicant) {
    try {
      const applicant = await this.repository.createApplicant(data);

      if (!applicant) {
        throw new BadRequestError('Applicant cannot be created');
      }

      return createResponse(applicant);
    } catch (error) {
      throw handlePrismaError(error, 'Applicant');
    }
  }

  async getAllApplicants(
    page: number = 1,
    size: number = 50,
    sort?: ISort,
    search?: string,
    country?: string,
    partner?: string,
    isArchived?: boolean,
  ) {
    try {
      const skip = Math.max(0, (page - 1) * size);
      const take = size;

      const [applicants, total] = await Promise.all([
        this.repository.getAllApplicants(
          skip,
          take,
          sort,
          search,
          country,
          partner,
          isArchived,
        ),
        this.repository.countApplicants(search, country, partner, isArchived),
      ]);

      if (!applicants || !Array.isArray(applicants)) {
        throw new NotFoundError('Applicants not found');
      }

      const paginatedData = createPaginatedResult(applicants, total, {
        page,
        size,
      });

      // Ensure we're returning an array of group applicants
      return createResponse(paginatedData);
    } catch (error) {
      throw handlePrismaError(error, 'Applicants');
    }
  }
}

export const applicantService = new ApplicantService(new ApplicantRepository());
