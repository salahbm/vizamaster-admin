import { Applicant } from '@/generated/prisma';
import { BadRequestError, handlePrismaError } from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';

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
}

export const applicantService = new ApplicantService(new ApplicantRepository());
