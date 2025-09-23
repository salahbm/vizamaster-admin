import { TFileDto } from '@/server/common/dto/files.dto';
import { BadRequestError, handlePrismaError } from '@/server/common/errors';
import { R2_ENDPOINT } from '@/server/common/secrets';
import prisma from '@/server/db/prisma';

import FilesRepository, { fileRepository } from './files.repository';

class FilesService {
  private fileRepository: FilesRepository;

  constructor() {
    this.fileRepository = fileRepository;
  }

  /**
   * Get a signed URL for file upload with proper metadata
   */
  async getSignedUrlForUpload({
    key,
    contentType,
    applicantId,
    fileType,
  }: {
    key: string;
    contentType: string;
    applicantId: string;
    fileType: TFileDto['fileType'];
  }) {
    if (!key || !contentType || !applicantId || !fileType) {
      throw new BadRequestError(
        'key, contentType, applicantId, and fileType are required',
      );
    }

    // Get signed URL with metadata
    const { signedUrl, key: finalKey } =
      await this.fileRepository.getSignedUrlForUpload({
        key,
        contentType,
        applicantId,
        fileType,
      });

    const fileRecord = await this.createFileRecord({
      applicantId,
      fileType,
      fileName: key,
      mimeType: contentType,
      fileUrl: `${R2_ENDPOINT}/${finalKey}`,
    });

    if (!fileRecord) throw new BadRequestError('Failed to create file record');

    return {
      signedUrl,
      fileId: fileRecord.id,
      fileUrl: fileRecord.fileUrl,
    };
  }

  /**
   * Create a file record in the database
   */
  async createFileRecord(file: TFileDto) {
    try {
      return prisma.file.create({
        data: {
          applicantId: file.applicantId,
          fileType: file.fileType,
          fileUrl: file.fileUrl,
          fileName: file.fileName,
          fileSize: file.fileSize,
          mimeType: file.mimeType,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Delete a file from storage and database
   */
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

  /**
   * List all files for an applicant
   */
  async listFiles(applicantId: string) {
    try {
      return prisma.file.findMany({
        where: { applicantId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

export const filesService = new FilesService();
export default FilesService;
