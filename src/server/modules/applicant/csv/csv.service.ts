import { stringify } from 'csv-stringify/sync';

import { formatDate } from '@/utils/date';

import { NotFoundError, handlePrismaError } from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';

import { ApplicantRepository } from '../user-info/user-info.repository';

// Build column definitions once
const columns = [
  { key: 'userId', header: 'ID' },
  { key: 'firstName', header: 'First Name' },
  { key: 'lastName', header: 'Last Name' },
  { key: 'middleName', header: 'Middle Name' },
  { key: 'gender', header: 'Gender' },
  { key: 'passportNumber', header: 'Passport Number' },
  { key: 'phoneNumber', header: 'Phone Number' },
  { key: 'phoneNumberAdditional', header: 'Phone Number Additional' },
  { key: 'email', header: 'Email' },
  { key: 'countryOfResidence', header: 'Country of Residence' },
  { key: 'addressLine1', header: 'Address Line 1' },
  { key: 'addressLine2', header: 'Address Line 2' },
  { key: 'city', header: 'City' },
  { key: 'state', header: 'State' },
  { key: 'zipCode', header: 'Zip Code' },
  { key: 'nationality', header: 'Nationality' },
  { key: 'dateOfBirth', header: 'Date of Birth' },
  { key: 'preferredJobTitle', header: 'Preferred Job Title' },
  { key: 'countryOfEmployment', header: 'Country of Employment' },
  { key: 'partner', header: 'Partner' },
  { key: 'status', header: 'Status' },
  { key: 'languages', header: 'Languages' },
  { key: 'isArchived', header: 'Is Archived' },
];

export class ApplicantService {
  private applicantRepository: ApplicantRepository;
  constructor() {
    this.applicantRepository = new ApplicantRepository();
  }
  async getApplicantCsv(applicantId: string) {
    try {
      const applicant =
        await this.applicantRepository.getApplicantCsv(applicantId);
      if (!applicant) {
        throw new NotFoundError(`Applicant with ID ${applicantId} not found`);
      }
      // Map to CSV row
      const row = [
        applicant.userId,
        applicant.firstName,
        applicant.lastName,
        applicant.middleName || '',
        applicant.gender,
        applicant.passportNumber,
        applicant.phoneNumber,
        applicant.phoneNumberAdditional || '',
        applicant.email,
        applicant.countryOfResidence,
        applicant.addressLine1,
        applicant.addressLine2 || '',
        applicant.city || '',
        applicant.state || '',
        applicant.zipCode || '',
        applicant.nationality || '',
        formatDate(applicant.dateOfBirth!) || '',
        applicant.preferredJobTitle || '',
        applicant.countryOfEmployment,
        applicant.partner,
        applicant.status,
        applicant.languages.join(', '),
        applicant.isArchived ? 'O' : 'X',
      ];
      // Generate CSV string
      const csv = stringify([row], {
        columns,
        delimiter: ',',
        quoted: true,
      });
      return createResponse(csv);
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
  async getAllApplicantsCsv() {
    try {
      const applicants =
        await this.applicantRepository.findAllApplicantsForXml();

      // Map applicants into objects matching column keys
      const records = applicants.map((a) => ({
        userId: a.userId,
        firstName: a.firstName,
        lastName: a.lastName,
        middleName: a.middleName ?? '',
        gender: a.gender,
        passportNumber: a.passportNumber,
        phoneNumber: a.phoneNumber,
        phoneNumberAdditional: a.phoneNumberAdditional ?? '',
        email: a.email,
        countryOfResidence: a.countryOfResidence,
        addressLine1: a.addressLine1,
        addressLine2: a.addressLine2 ?? '',
        city: a.city ?? '',
        state: a.state ?? '',
        zipCode: a.zipCode ?? '',
        nationality: a.nationality ?? '',
        dateOfBirth: a.dateOfBirth ? formatDate(a.dateOfBirth) : '',
        preferredJobTitle: a.preferredJobTitle ?? '',
        countryOfEmployment: a.countryOfEmployment,
        partner: a.partner,
        status: a.status,
        languages: a.languages.join(', '),
        isArchived: a.isArchived ? 'O' : 'X',
      }));

      const csv = stringify(records, {
        header: true,
        columns,
        quoted: true,
        delimiter: ',',
      });

      return createResponse(csv);
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}
export default ApplicantService;
