import { Codes } from '@/generated/prisma';

export const codesDefaultValues = (data?: Codes) => ({
  labelEn: data?.labelEn || '',
  labelRu: data?.labelRu || '',
  code: data?.code || '',
  groupCodeId: data?.groupCodeId || '',
});
