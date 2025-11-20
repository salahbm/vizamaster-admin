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
   * Get a presigned URL for direct browser upload to R2
   * This bypasses Vercel's 4MB body limit
   */
  async getPresignedUploadUrl({
    fileName,
    contentType,
    applicantId,
    fileType,
  }: {
    fileName: string;
    contentType: string;
    applicantId: string;
    fileType: TFileDto['fileType'];
  }) {
    try {
      if (!fileName || !contentType || !applicantId || !fileType) {
        throw new BadRequestError(
          'fileName, contentType, applicantId, and fileType are required',
        );
      }

      // Generate presigned URL for direct upload
      const { signedUrl } = await this.fileRepository.getSignedUrlForUpload({
        key: fileName,
        contentType,
        applicantId,
        fileType,
      });

      // Return the presigned URL and the final fileKey that will be used
      const fileKey = `${applicantId}/${fileType.toLowerCase()}/${fileName}`;

      return createResponse({
        signedUrl,
        fileKey,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create file record after successful direct upload to R2
   */
  async createFileRecordAfterUpload({
    fileName,
    contentType,
    applicantId,
    fileType,
    fileKey,
    fileSize,
  }: {
    fileName: string;
    contentType: string;
    applicantId: string;
    fileType: TFileDto['fileType'];
    fileKey: string;
    fileSize: number;
  }) {
    try {
      const fileRecord = await this.createFileRecord({
        applicantId,
        fileType,
        fileName,
        mimeType: contentType,
        fileKey,
        fileSize,
      });

      return createResponse(fileRecord);
    } catch (error) {
      // If DB record creation fails, clean up the uploaded file
      await this.deleteFileFromR2([fileKey]);
      throw error;
    }
  }

  /**
   * Get a signed URL for file upload with proper metadata
   * @deprecated Use getPresignedUploadUrl + createFileRecordAfterUpload for files > 4MB
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
        await this.deleteFileFromR2([fileKey]);
        throw new BadRequestError('Failed to create file record');
      }

      return createResponse(fileRecord);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a file record in the database
   */
  async createFileRecord(file: Omit<TFileDto, 'id' | 'preview'>) {
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
      throw handlePrismaError(error);
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
  async deleteFileFromR2(fileKeys: string[]) {
    try {
      await this.fileRepository.deleteFileFromR2(fileKeys);
      return createResponse(true);
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

export const filesService = new FilesService();
export default FilesService;
