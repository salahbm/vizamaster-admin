import { GroupCodes } from '@/generated/prisma';

export const groupCodesDefaultValues = (data?: GroupCodes) => ({
  labelEn: data?.labelEn || '',
  labelRu: data?.labelRu || '',
  code: data?.code || '',
});
