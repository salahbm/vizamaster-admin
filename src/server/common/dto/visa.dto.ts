import z from 'zod';

import { FileMetadataSchema } from '@/hooks/common/use-file-upload';

export const VisaStatus = z.enum(['STILL_WORKING', 'RETURNED', 'DEPARTED']);

export const VisaDto = z
  .object({
    id: z.string().optional(),
    issued: z.boolean().default(false),
    issueDate: z.date().nullable(),
    departureDate: z.date().nullable(),
    arrived: z.boolean().default(false),
    status: VisaStatus.default('STILL_WORKING'),
    flightDocuments: z.array(FileMetadataSchema).nullable(),
    files: z.array(FileMetadataSchema).nullable(),
  })
  .refine(
    (data) => {
      // If visa is issued, both dates must be present
      if (data.issued) {
        return data.issueDate !== null && data.departureDate !== null;
      }
      return true;
    },
    {
      message: 'Issue date and departure date are required when visa is issued',
      path: ['issueDate', 'departureDate'],
    },
  );

export type TVisaDto = z.infer<typeof VisaDto>;
