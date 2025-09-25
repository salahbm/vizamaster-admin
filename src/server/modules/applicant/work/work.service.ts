import { TWorkArraySchema } from '@/server/common/dto/work.dto';
import { handlePrismaError } from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';

import { WorkRepository } from './work.repository';

export class WorkService {
  private readonly workRepository: WorkRepository;

  constructor() {
    this.workRepository = new WorkRepository();
  }

  async upsertWorkExperiences(
    workExperiences: TWorkArraySchema['workExperiences'],
    applicantId: string,
  ) {
    try {
      const works = await this.workRepository.updateMany(
        workExperiences,
        applicantId,
      );
      return createResponse(works);
    } catch (error) {
      throw handlePrismaError(error, 'Work');
    }
  }

  async deleteWorkExperience(applicantId: string, id: string) {
    return await this.workRepository.deleteOne(applicantId, id);
  }

  async deleteWorkExperiences(applicantId: string) {
    return await this.workRepository.deleteMany(applicantId);
  }
}
