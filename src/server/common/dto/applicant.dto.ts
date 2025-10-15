import z from 'zod';

export const ApplicantDto = z.object({
  // Personal Information
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().nullable(),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.date().nullable(),
  passportNumber: z.string().min(1),

  // Contact Information
  email: z.email().nullable(),
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
  workplace: z.string().nullable(),
  preferredJobTitle: z.string().nullable(),
  status: z
    .enum([
      'NEW',
      'IN_PROGRESS',
      'CONFIRMED_PROGRAM',
      'HIRED',
      'HOTEL_REJECTED',
      'APPLICANT_REJECTED',
      'FIRED',
    ])
    .default('NEW')
    .optional(),
});

export type TApplicantDto = z.infer<typeof ApplicantDto>;
