import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { R2_BUCKET } from '@/server/common/secrets';
import S3 from '@/server/db/s3-client';

class FilesRepository {
  constructor() {}

  /**
   * Get a signed URL for direct file upload to S3
   * @param metadata File metadata including applicantId and fileType
   * @returns Signed URL and the final key for the file
   */
  async getSignedUrlForUpload(metadata: {
    key: string;
    contentType: string;
    applicantId: string;
    fileType: string;
  }) {
    // Create a structured key to organize files by applicant and type
    const finalKey = `${metadata.applicantId}/${metadata.fileType}/${metadata.key}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: finalKey,
      ContentType: metadata.contentType,
      Metadata: {
        applicantId: metadata.applicantId,
        fileType: metadata.fileType,
      },
    });

    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 60 * 15 }); // 15 min
    return { signedUrl, key: finalKey };
  }

  /**
   * Delete a file from S3 storage
   */
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
