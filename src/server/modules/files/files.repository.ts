import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { TFileDto } from '@/server/common/dto/files.dto';
import { R2_BUCKET } from '@/server/common/secrets';
import S3 from '@/server/db/s3-client';

class FilesRepository {
  async uploadFile(file: TFileDto) {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: file.fileName,
      Body: file.fileUrl, // You may pass Buffer/Stream instead for direct upload
      ContentType: file.mimeType,
    });

    return await S3.send(command);
  }

  async getSignedUrlForUpload(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });
    return await getSignedUrl(S3, command, { expiresIn: 60 * 10 }); // 10 min
  }

  async deleteFileFromStorage(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });
    return await S3.send(command);
  }
}

export const fileRepository = new FilesRepository();
export default FilesRepository;
