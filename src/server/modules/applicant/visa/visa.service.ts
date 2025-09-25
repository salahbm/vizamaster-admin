import { TVisaDto } from '@/server/common/dto/visa.dto';
import { handlePrismaError } from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';

import { VisaRepository } from './visa.repository';

export class VisaService {
  private readonly visaRepository: VisaRepository;

  constructor() {
    this.visaRepository = new VisaRepository();
  }

  async update(visaData: TVisaDto, applicantId: string) {
    try {
      const res = await this.visaRepository.update(visaData, applicantId);
      return createResponse(res);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findOne(applicantId: string) {
    try {
      const visa = await this.visaRepository.findOne(applicantId);
      return createResponse(visa);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(applicantId: string) {
    try {
      const visa = await this.visaRepository.delete(applicantId);
      return createResponse(visa);
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
