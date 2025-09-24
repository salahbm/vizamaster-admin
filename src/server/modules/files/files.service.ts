import { TFileDto } from '@/server/common/dto/files.dto';
import { BadRequestError, handlePrismaError } from '@/server/common/errors';
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
    try {
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

      if (!fileRecord) {
        // if prisma has error to create file record, delete file from R2
        await this.deleteFileFromR2(fileKey);
        throw new BadRequestError('Failed to create file record');
      }

      return createResponse({
        fileKey: fileKey,
        fileId: fileRecord.id,
      });
    } catch (error) {
      throw error;
    }
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
          fileKey: file.fileKey,
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
  async getSignedUrlForDownload(fileKey: string) {
    const result = await this.fileRepository.getSignedUrlForDownload(fileKey);

    return createResponse({
      signedUrl: result.signedUrl,
    });
  }

  /**
   * Delete a file from R2
   */
  async deleteFileFromR2(fileKey: string) {
    await this.fileRepository.deleteFileFromR2(fileKey);
  }
}

export const filesService = new FilesService();
export default FilesService;
