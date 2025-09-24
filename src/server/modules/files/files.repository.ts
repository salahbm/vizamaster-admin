import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { PrismaClient } from '@/generated/prisma';
import { TFileDto } from '@/server/common/dto/files.dto';
import { BadRequestError } from '@/server/common/errors';
import { R2_BUCKET } from '@/server/common/secrets';
import prisma from '@/server/db/prisma';
import S3 from '@/server/db/s3-client';

export class FilesRepository {
  private readonly prismaFile: PrismaClient['file'];

  constructor() {
    this.prismaFile = prisma.file;
  }

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

    // Create a structured path: applicantId/fileType/filename
    const finalKey = `${applicantId}/${fileType.toLowerCase()}/${key}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: finalKey,
      ContentType: contentType,
      Metadata: {
        applicantId,
        fileType,
      },
    });

    const signedUrl = await getSignedUrl(S3, command, {
      expiresIn: 60 * 60 * 8,
    }); // 8 hours

    return { signedUrl };
  }

  async uploadToR2({
    buffer,
    fileName,
    contentType,
    applicantId,
    fileType,
  }: {
    buffer: Buffer;
    fileName: string;
    contentType: string;
    applicantId: string;
    fileType: TFileDto['fileType'];
  }) {
    // Create a structured path: applicantId/fileType/filename
    const finalKey = `${applicantId}/${fileType.toLowerCase()}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: finalKey,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        applicantId,
        fileType,
      },
    });

    const result = await S3.send(command);

    if (!result) throw new BadRequestError('Failed to upload file to R2');

    return finalKey;
  }

  async createFileRecord(file: TFileDto) {
    return this.prismaFile.create({
      data: {
        applicantId: file.applicantId,
        fileType: file.fileType,
        fileKey: file.fileKey,
        fileName: file.fileName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
      },
    });
  }

  // PREVIEW AND DOWNLOAD
  async getSignedUrlForDownload(fileKey: string) {
    if (!fileKey) throw new BadRequestError('fileKey is required');

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: fileKey,
      ResponseContentDisposition: 'attachment',
    });

    const signedUrl = await getSignedUrl(S3, command, {
      expiresIn: 60 * 60 * 8,
    }); // 8 hours

    return { signedUrl };
  }

  async deleteFileFromR2(fileKeys: string[]) {
    if (!fileKeys?.length) throw new BadRequestError('fileKeys are required');

    // Delete from R2 in parallel
    const result = await Promise.all(
      fileKeys.map((fileKey) =>
        S3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: fileKey })),
      ),
    );

    if (!result) throw new BadRequestError('Failed to delete file from R2');

    // Delete from DB in one go
    await this.prismaFile.deleteMany({
      where: { fileKey: { in: fileKeys } },
    });

    return true;
  }
}

export const fileRepository = new FilesRepository();

export default FilesRepository;
