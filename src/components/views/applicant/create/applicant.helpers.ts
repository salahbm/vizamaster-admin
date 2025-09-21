import { TApplicantDto } from '@/server/common/dto/applicant.dto';

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
  };
};
