import { ApplicantStatus } from '@/generated/prisma';
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
    status: 'NEW' as ApplicantStatus,
  };
};

// export const mapApplicantUserInfoIntoForm = (applicant: Applicant) => {
//   return {
//     firstName: applicant.firstName,
//     lastName: applicant.lastName,
//     middleName: applicant.middleName,
//     gender: applicant.gender,
//     dateOfBirth: applicant.dateOfBirth,
//     passportNumber: applicant.passportNumber,
//     passportPhoto: applicant.passportPhoto,
//     email: applicant.email,
//     phoneNumber: applicant.phoneNumber,
//     phoneNumberAdditional: applicant.phoneNumberAdditional,
//     countryOfResidence: applicant.countryOfResidence,
//     addressLine1: applicant.addressLine1,
//     addressLine2: applicant.addressLine2,
//     city: applicant.city,
//     state: applicant.state,
//     zipCode: applicant.zipCode,
//     countryOfEmployment: applicant.countryOfEmployment,
//     partner: applicant.partner,
//     nationality: applicant.nationality,
//     languages: applicant.languages,
//     preferredJobTitle: applicant.preferredJobTitle,
//   };
// };
