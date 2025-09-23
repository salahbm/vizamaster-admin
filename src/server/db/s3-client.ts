import { S3Client } from '@aws-sdk/client-s3';

import {
  R2_ACCESS_KEY_ID,
  R2_ACCOUNT_ID,
  R2_SECRET_ACCESS_KEY,
} from '../common/secrets';

if (!R2_ACCESS_KEY_ID || !R2_ACCOUNT_ID || !R2_SECRET_ACCESS_KEY) {
  throw new Error(
    'R2_ACCESS_KEY_ID, R2_ACCOUNT_ID, R2_SECRET_ACCESS_KEY are required',
  );
}

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export default S3;
