import { TFileDto } from '@/server/common/dto/files.dto';
import { BadRequestError, handlePrismaError } from '@/server/common/errors';
import prisma from '@/server/db/prisma';

import FilesRepository, { fileRepository } from './files.repository';

class FilesService {
  private fileRepository: FilesRepository;

  constructor() {
    this.fileRepository = fileRepository;
  }

  async getSignedUrlForUpload(key: string, contentType: string) {
    if (!key || !contentType) {
      throw new BadRequestError('key and contentType are required');
    }
    return this.fileRepository.getSignedUrlForUpload(key, contentType);
  }

  async createFileRecord(file: TFileDto) {
    try {
      return prisma.file.create({ data: file });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteFile(fileId: string) {
    try {
      const file = await prisma.file.findUnique({ where: { id: fileId } });
      if (!file) throw new BadRequestError('File not found');

      // Delete from R2 first
      await this.fileRepository.deleteFileFromStorage(file.fileName);

      // Then delete from DB
      return prisma.file.delete({ where: { id: fileId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async listFiles(applicantId: string) {
    try {
      return prisma.file.findMany({ where: { applicantId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

export const filesService = new FilesService();
export default FilesService;
