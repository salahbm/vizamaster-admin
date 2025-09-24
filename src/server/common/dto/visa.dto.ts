import { z } from 'zod';

import { VisaStatus } from '@/generated/prisma';

export const VisaDto = z
  .object({
    id: z.string().optional(),
    issued: z.boolean().default(false),
    issueDate: z.date().nullable(),
    departureDate: z.date().nullable(),
    arrived: z.boolean().default(false),
    arrivalDate: z.date().nullable(),
    returnedDate: z.date().nullable(),
    status: z.enum(Object.values(VisaStatus)).default(VisaStatus.NOT_APPLIED),
  })
  .superRefine((data, ctx) => {
    // If visa is issued, require both dates
    if (data.issued) {
      if (!data.issueDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'Issue date is required when visa is issued',
          path: ['issueDate'],
        });
      }
      if (!data.departureDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'Departure date is required when visa is issued',
          path: ['departureDate'],
        });
      }
    }

    // If arrived, require arrivalDate
    if (data.arrived && !data.arrivalDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'Arrival date is required when visa is marked as arrived',
        path: ['arrivalDate'],
      });
    }

    // If status is RETURNED, require returnedDate
    if (data.status === VisaStatus.RETURNED && !data.returnedDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'Returned date is required when visa is returned',
        path: ['returnedDate'],
      });
    }
  });

export type TVisaDto = z.infer<typeof VisaDto>;
