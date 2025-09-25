import { dateStringIntoDate } from '@/utils/helpers';

import { ApplicantStatus } from '@/generated/prisma';
import { TApplicantDto } from '@/server/common/dto/applicant.dto';
import { TWorkArraySchema } from '@/server/common/dto/work.dto';

export function applicantQueries(group: string) {
  return {
    page: 1,
    size: 100,
    groupCode: group,
  };
}

export const applicantDefaults = (
  countryOfEmployment: string,
  partner: string,
) => {
  return {
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'MALE' as TApplicantDto['gender'],
    dateOfBirth: undefined,
    passportNumber: '',
    passportPhoto: [],
    email: '',
    phoneNumber: '',
    phoneNumberAdditional: '',
    countryOfResidence: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    countryOfEmployment: countryOfEmployment,
    partner: partner,
    nationality: '',
    languages: [],
    preferredJobTitle: '',
    status: 'NEW' as ApplicantStatus,
  };
};

export const applicantWorkMapper = (
  work: TWorkArraySchema['workExperiences'],
) => {
  return work.map((work) => ({
    jobTitle: work.jobTitle,
    company: work.company,
    startDate: dateStringIntoDate(work.startDate as unknown as string),
    endDate: dateStringIntoDate(work.endDate as unknown as string),
    responsibilities: work.responsibilities,
    achievements: work.achievements,
    location: work.location,
  }));
};
