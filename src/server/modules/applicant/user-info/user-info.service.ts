import { Applicant } from '@/generated/prisma';
import {
  BadRequestError,
  NotFoundError,
  handlePrismaError,
} from '@/server/common/errors';
import { createPaginatedResult, createResponse } from '@/server/common/utils';
import { ISort } from '@/types/data-table';

import { ApplicantRepository } from './user-info.repository';

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
    isAlert?: boolean,
    status?: string,
    workplace?: string,
    jobTitle?: string,
    userId?: string,
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
          isAlert,
          status,
          workplace,
          jobTitle,
          userId,
        ),
        this.repository.countApplicants(
          search,
          country,
          partner,
          isArchived,
          isAlert,
          status,
          workplace,
          jobTitle,
          userId,
        ),
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

  // ───────────────── GET APPLICANT BY ID ────────────────── //
  async getApplicantById(id: string) {
    try {
      const applicant = await this.repository.getApplicantById(id);

      if (!applicant) throw new NotFoundError('Applicant not found');

      return createResponse(applicant);
    } catch (error) {
      throw handlePrismaError(error, 'Applicant');
    }
  }

  /* *****************************************************************
   * PUT
   * ***************************************************************** */
  // ───────────────── PUT APPLICANT ────────────────── //
  async updateApplicant(id: string, data: Applicant) {
    try {
      const applicant = await this.repository.updateApplicant(id, data);

      if (!applicant) throw new NotFoundError('Applicant not found');

      return createResponse(applicant);
    } catch (error) {
      throw handlePrismaError(error, 'Applicant');
    }
  }

  /* *****************************************************************
   * DELETE
   * ***************************************************************** */
  // ───────────────── DELETE APPLICANTS ────────────────── //
  async deleteApplicants(ids: string[]) {
    try {
      const applicant = await this.repository.deleteApplicants(ids);

      if (!applicant) throw new NotFoundError('Applicant not found');

      return createResponse(applicant);
    } catch (error) {
      throw handlePrismaError(error, 'Applicant');
    }
  }

  /* *****************************************************************
   * PATCH
   * ***************************************************************** */
  // ───────────────── PATCH APPLICANTS ────────────────── //
  async archiveApplicants(ids: string[]) {
    try {
      const applicant = await this.repository.archiveApplicants(ids);

      if (!applicant) throw new NotFoundError('Applicant not found');

      return createResponse(applicant);
    } catch (error) {
      throw handlePrismaError(error, 'Applicant');
    }
  }
  async unarchiveApplicants(ids: string[]) {
    try {
      const applicant = await this.repository.unarchiveApplicants(ids);

      if (!applicant) throw new NotFoundError('Applicant not found');

      return createResponse(applicant);
    } catch (error) {
      throw handlePrismaError(error, 'Applicant');
    }
  }
}

export const applicantService = new ApplicantService(new ApplicantRepository());
