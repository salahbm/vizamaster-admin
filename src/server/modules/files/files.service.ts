import { TFileDto } from '@/server/common/dto/files.dto';
import { BadRequestError, handlePrismaError } from '@/server/common/errors';
import { R2_ACCOUNT_ID, R2_BUCKET } from '@/server/common/secrets';
import { createResponse } from '@/server/common/utils';
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

    // Get signed URL and create file record
    const fileRecord = await this.createFileRecord({
      applicantId,
      fileType,
      fileName: key,
      mimeType: contentType,
      fileUrl: `https://${R2_BUCKET}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${applicantId}/${key}`,
    });

    if (!fileRecord) throw new BadRequestError('Failed to create file record');

    // Get signed URL for upload
    const { signedUrl } = await this.fileRepository.getSignedUrlForUpload({
      key,
      contentType,
      applicantId,
      fileType,
    });

    return createResponse({
      signedUrl,
      fileUrl: fileRecord.fileUrl,
    });
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
}

export const filesService = new FilesService();
export default FilesService;
