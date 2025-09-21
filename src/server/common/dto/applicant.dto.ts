import z from 'zod';

import { FileMetadataSchema } from '@/hooks/common/use-file-upload';

export const ApplicantDto = z.object({
  // Personal Information
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().nullable(),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.date().nullable(),
  passportNumber: z.string().min(1),
  passportPhoto: z.array(FileMetadataSchema).nullable(),

  // Contact Information
  email: z.email(),
  phoneNumber: z.string().min(1),
  phoneNumberAdditional: z.string().nullable(),

  // Address Information
  countryOfResidence: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zipCode: z.string().nullable(),

  // Employment & Nationality
  countryOfEmployment: z.string().min(1),
  partner: z.string().min(1),
  nationality: z.string().nullable(),
  languages: z.array(z.string()),
  preferredJobTitle: z.string().nullable(),
});

export type TApplicantDto = z.infer<typeof ApplicantDto>;
