// import { Applicant, Vacancy, Country, File } from '@prisma/client';
// import { ApplicantDto, ApplicantWithVacancyDto, ApplicantWithFilesDto } from '@/server/common/dto';

// // Convert Prisma Applicant model to DTO
// export function toApplicantDto(applicant: Applicant): ApplicantDto {
//   return {
//     id: applicant.id,
//     vacancyId: applicant.vacancyId,
//     formData: applicant.formData as Record<string, any>,
//     status: applicant.status,
//     email: applicant.email,
//     phone: applicant.phone,
//     firstName: applicant.firstName,
//     lastName: applicant.lastName,
//     createdAt: applicant.createdAt,
//     updatedAt: applicant.updatedAt,
//   };
// }

// // Convert Prisma Applicant model with Vacancy and Country to DTO
// export function toApplicantWithVacancyDto(
//   applicant: Applicant & {
//     vacancy: Vacancy & {
//       country: Country
//     }
//   }
// ): ApplicantWithVacancyDto {
//   return {
//     ...toApplicantDto(applicant),
//     vacancy: {
//       id: applicant.vacancy.id,
//       title: applicant.vacancy.title,
//       countryId: applicant.vacancy.countryId,
//       country: {
//         id: applicant.vacancy.country.id,
//         name: applicant.vacancy.country.name,
//         code: applicant.vacancy.country.code,
//       },
//     },
//   };
// }

// // Convert Prisma Applicant model with Files to DTO
// export function toApplicantWithFilesDto(
//   applicant: Applicant & { files: File[] }
// ): ApplicantWithFilesDto {
//   return {
//     ...toApplicantDto(applicant),
//     files: applicant.files.map(file => ({
//       id: file.id,
//       filename: file.filename,
//       path: file.path,
//       size: file.size,
//       mimeType: file.mimeType,
//       createdAt: file.createdAt,
//     })),
//   };
// }
