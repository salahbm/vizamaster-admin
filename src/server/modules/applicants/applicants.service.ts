// import { ApplicantStatus } from '@prisma/client';
// import { ApplicantsRepository } from './applicants.repository';
// import { toApplicantDto, toApplicantWithVacancyDto, toApplicantWithFilesDto } from './applicants.model';
// import { CreateApplicantDto, UpdateApplicantDto, ApplicantDto, ApplicantWithVacancyDto, ApplicantWithFilesDto } from '@/server/common/dto';
// import { PaginationParams, PaginatedResult, FilterParams, SortParams } from '@/server/common/types';
// import { createPaginatedResult, validateFormData } from '@/server/common/utils';
// import { NotFoundError, ValidationError } from '@/server/common/errors';
// import { VacanciesRepository } from '../vacancies/vacancies.repository';

// export class ApplicantsService {
//   private repository: ApplicantsRepository;
//   private vacanciesRepository: VacanciesRepository;

//   constructor() {
//     this.repository = new ApplicantsRepository();
//     this.vacanciesRepository = new VacanciesRepository();
//   }

//   /**
//    * Get all applicants with pagination, filtering, and sorting
//    */
//   async getAllApplicants(
//     pagination?: PaginationParams,
//     filters?: FilterParams,
//     sort?: SortParams
//   ): Promise<PaginatedResult<ApplicantWithVacancyDto>> {
//     const { applicants, total } = await this.repository.findAll(pagination, filters, sort);

//     const { page = 1, limit = 10 } = pagination || {};

//     const data = applicants.map(toApplicantWithVacancyDto);

//     return createPaginatedResult(data, total, { page, limit });
//   }

//   /**
//    * Get applicants by vacancy ID
//    */
//   async getApplicantsByVacancyId(
//     vacancyId: string,
//     pagination?: PaginationParams,
//     filters?: FilterParams,
//     sort?: SortParams
//   ): Promise<PaginatedResult<ApplicantWithVacancyDto>> {
//     // Check if vacancy exists
//     await this.vacanciesRepository.findById(vacancyId);

//     const { applicants, total } = await this.repository.findByVacancyId(vacancyId, pagination, filters, sort);

//     const { page = 1, limit = 10 } = pagination || {};

//     const data = applicants.map(toApplicantWithVacancyDto);

//     return createPaginatedResult(data, total, { page, limit });
//   }

//   /**
//    * Get applicants by country ID
//    */
//   async getApplicantsByCountryId(
//     countryId: string,
//     pagination?: PaginationParams,
//     filters?: FilterParams,
//     sort?: SortParams
//   ): Promise<PaginatedResult<ApplicantWithVacancyDto>> {
//     const { applicants, total } = await this.repository.findByCountryId(countryId, pagination, filters, sort);

//     const { page = 1, limit = 10 } = pagination || {};

//     const data = applicants.map(toApplicantWithVacancyDto);

//     return createPaginatedResult(data, total, { page, limit });
//   }

//   /**
//    * Get an applicant by ID
//    */
//   async getApplicantById(id: string): Promise<ApplicantWithFilesDto> {
//     const applicant = await this.repository.findById(id);
//     return toApplicantWithFilesDto(applicant);
//   }

//   /**
//    * Create a new applicant
//    */
//   async createApplicant(data: CreateApplicantDto): Promise<ApplicantWithVacancyDto> {
//     // Get vacancy to validate form data against schema
//     const vacancy = await this.vacanciesRepository.findById(data.vacancyId);

//     // Validate form data against schema
//     const validation = validateFormData(data.formData, vacancy.formSchema);

//     if (!validation.isValid) {
//       throw new ValidationError('Form data validation failed', validation.errors);
//     }

//     // Create applicant with validated data
//     const applicant = await this.repository.create({
//       ...data,
//       formData: validation.sanitizedData,
//     });

//     return toApplicantWithVacancyDto(applicant);
//   }

//   /**
//    * Update an applicant
//    */
//   async updateApplicant(id: string, data: UpdateApplicantDto): Promise<ApplicantWithVacancyDto> {
//     // Get existing applicant
//     const existingApplicant = await this.repository.findById(id);

//     // If form data is being updated, validate it
//     if (data.formData) {
//       // Get vacancy to validate form data against schema
//       const vacancy = await this.vacanciesRepository.findById(existingApplicant.vacancyId);

//       // Validate form data against schema
//       const validation = validateFormData(data.formData, vacancy.formSchema);

//       if (!validation.isValid) {
//         throw new ValidationError('Form data validation failed', validation.errors);
//       }

//       // Update with validated data
//       data.formData = validation.sanitizedData;
//     }

//     const applicant = await this.repository.update(id, data);
//     return toApplicantWithVacancyDto(applicant);
//   }

//   /**
//    * Update applicant status
//    */
//   async updateApplicantStatus(id: string, status: ApplicantStatus): Promise<ApplicantWithVacancyDto> {
//     const applicant = await this.repository.updateStatus(id, status);
//     return toApplicantWithVacancyDto(applicant);
//   }

//   /**
//    * Delete an applicant
//    */
//   async deleteApplicant(id: string): Promise<ApplicantDto> {
//     const applicant = await this.repository.delete(id);
//     return toApplicantDto(applicant);
//   }
// }
