import { TFileDto } from '@/server/common/dto/files.dto';
import { BadRequestError, handlePrismaError } from '@/server/common/errors';
import { createResponse, removeR2Prefix } from '@/server/common/utils';
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
    fileName,
    contentType,
    applicantId,
    fileType,
    buffer,
  }: {
    fileName: string;
    contentType: string;
    applicantId: string;
    fileType: TFileDto['fileType'];
    buffer: Buffer;
  }) {
    if (!fileName || !contentType || !applicantId || !fileType || !buffer) {
      throw new BadRequestError(
        'fileName, contentType, applicantId, fileType, and buffer are required',
      );
    }

    // Upload directly to R2
    const fileKey = await this.fileRepository.uploadToR2({
      buffer,
      fileName,
      contentType,
      applicantId,
      fileType,
    });

    // Create file record
    const fileRecord = await this.createFileRecord({
      applicantId,
      fileType,
      fileName,
      mimeType: contentType,
      fileKey,
      fileSize: buffer.length,
    });

    if (!fileRecord) throw new BadRequestError('Failed to create file record');

    return createResponse({
      fileKey: removeR2Prefix(fileKey),
      fileId: fileRecord.id,
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
          fileKey: removeR2Prefix(file.fileKey),
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
   * Get a signed URL for file download
   */
  async getSignedUrlForDownload({
    fileKey,
    applicantId,
    fileType,
  }: {
    fileKey: string;
    applicantId: string;
    fileType: TFileDto['fileType'];
  }) {
    const result = await this.fileRepository.getSignedUrlForDownload({
      fileKey,
      applicantId,
      fileType,
    });

    return createResponse({
      signedUrl: result.signedUrl,
    });
  }
}

export const filesService = new FilesService();
export default FilesService;
