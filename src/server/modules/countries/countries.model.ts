// import { Country } from '@prisma/client';

// import { CountryDto, CountryWithVacanciesDto } from '@/server/common/dto';

// // Convert Prisma Country model to DTO
// export function toCountryDto(country: Country): CountryDto {
//   return {
//     id: country.id,
//     name: country.name,
//     code: country.code,
//     flag: country.flag,
//     active: country.active,
//     createdAt: country.createdAt,
//     updatedAt: country.updatedAt,
//   };
// }

// // Convert Prisma Country model with vacancy count to DTO
// export function toCountryWithVacanciesDto(
//   country: Country & { _count: { vacancies: number } },
// ): CountryWithVacanciesDto {
//   return {
//     ...toCountryDto(country),
//     vacanciesCount: country._count.vacancies,
//   };
// }
