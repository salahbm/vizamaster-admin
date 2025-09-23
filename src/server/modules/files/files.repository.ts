import { PutObjectCommand } from '@aws-sdk/client-s3';
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

    const finalKey = `${applicantId}/${key}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: finalKey,
      ContentType: contentType,
      Metadata: {
        applicantId,
        fileType,
      },
    });

    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 60 * 15 });

    return { signedUrl };
  }

  async createFileRecord(file: TFileDto) {
    return this.prismaFile.create({
      data: {
        applicantId: file.applicantId,
        fileType: file.fileType,
        fileUrl: file.fileUrl,
        fileName: file.fileName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
      },
    });
  }
}

export const fileRepository = new FilesRepository();

export default FilesRepository;
