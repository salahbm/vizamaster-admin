// import { ApplicantStatus } from '@prisma/client';
// import { prisma } from '@/server/db/prisma';
// import { CreateApplicantDto, UpdateApplicantDto } from '@/server/common/dto';
// import { PaginationParams, FilterParams, SortParams } from '@/server/common/types';
// import { buildPaginationParams, buildFilterConditions, buildSortParams } from '@/server/common/utils';
// import { NotFoundError } from '@/server/common/errors';

// export class ApplicantsRepository {
//   /**
//    * Find all applicants with optional pagination, filtering, and sorting
//    */
//   async findAll(
//     pagination?: PaginationParams,
//     filters?: FilterParams,
//     sort?: SortParams
//   ) {
//     const { skip, take } = pagination ? buildPaginationParams(pagination) : { skip: undefined, take: undefined };
//     const where = filters ? buildFilterConditions(filters) : {};
//     const orderBy = sort ? buildSortParams(sort).orderBy : { createdAt: 'desc' };

//     const [applicants, total] = await Promise.all([
//       prisma.applicant.findMany({
//         where,
//         skip,
//         take,
//         orderBy,
//         include: {
//           vacancy: {
//             include: {
//               country: true,
//             },
//           },
//           files: true,
//         },
//       }),
//       prisma.applicant.count({ where }),
//     ]);

//     return { applicants, total };
//   }

//   /**
//    * Find applicants by vacancy ID
//    */
//   async findByVacancyId(
//     vacancyId: string,
//     pagination?: PaginationParams,
//     filters?: FilterParams,
//     sort?: SortParams
//   ) {
//     const { skip, take } = pagination ? buildPaginationParams(pagination) : { skip: undefined, take: undefined };
//     const baseFilters = filters ? buildFilterConditions(filters) : {};
//     const where = { ...baseFilters, vacancyId };
//     const orderBy = sort ? buildSortParams(sort).orderBy : { createdAt: 'desc' };

//     const [applicants, total] = await Promise.all([
//       prisma.applicant.findMany({
//         where,
//         skip,
//         take,
//         orderBy,
//         include: {
//           vacancy: {
//             include: {
//               country: true,
//             },
//           },
//           files: true,
//         },
//       }),
//       prisma.applicant.count({ where }),
//     ]);

//     return { applicants, total };
//   }

//   /**
//    * Find applicants by country ID
//    */
//   async findByCountryId(
//     countryId: string,
//     pagination?: PaginationParams,
//     filters?: FilterParams,
//     sort?: SortParams
//   ) {
//     const { skip, take } = pagination ? buildPaginationParams(pagination) : { skip: undefined, take: undefined };
//     const baseFilters = filters ? buildFilterConditions(filters) : {};
//     const where = {
//       ...baseFilters,
//       vacancy: {
//         countryId,
//       },
//     };
//     const orderBy = sort ? buildSortParams(sort).orderBy : { createdAt: 'desc' };

//     const [applicants, total] = await Promise.all([
//       prisma.applicant.findMany({
//         where,
//         skip,
//         take,
//         orderBy,
//         include: {
//           vacancy: {
//             include: {
//               country: true,
//             },
//           },
//           files: true,
//         },
//       }),
//       prisma.applicant.count({ where }),
//     ]);

//     return { applicants, total };
//   }

//   /**
//    * Find an applicant by ID
//    */
//   async findById(id: string) {
//     const applicant = await prisma.applicant.findUnique({
//       where: { id },
//       include: {
//         vacancy: {
//           include: {
//             country: true,
//           },
//         },
//         files: true,
//       },
//     });

//     if (!applicant) {
//       throw new NotFoundError(`Applicant with ID ${id} not found`);
//     }

//     return applicant;
//   }

//   /**
//    * Create a new applicant
//    */
//   async create(data: CreateApplicantDto) {
//     return prisma.applicant.create({
//       data,
//       include: {
//         vacancy: {
//           include: {
//             country: true,
//           },
//         },
//         files: true,
//       },
//     });
//   }

//   /**
//    * Update an applicant
//    */
//   async update(id: string, data: UpdateApplicantDto) {
//     try {
//       return await prisma.applicant.update({
//         where: { id },
//         data,
//         include: {
//           vacancy: {
//             include: {
//               country: true,
//             },
//           },
//           files: true,
//         },
//       });
//     } catch (error) {
//       throw new NotFoundError(`Applicant with ID ${id} not found`);
//     }
//   }

//   /**
//    * Update applicant status
//    */
//   async updateStatus(id: string, status: ApplicantStatus) {
//     try {
//       return await prisma.applicant.update({
//         where: { id },
//         data: { status },
//         include: {
//           vacancy: {
//             include: {
//               country: true,
//             },
//           },
//           files: true,
//         },
//       });
//     } catch (error) {
//       throw new NotFoundError(`Applicant with ID ${id} not found`);
//     }
//   }

//   /**
//    * Delete an applicant
//    */
//   async delete(id: string) {
//     try {
//       return await prisma.applicant.delete({
//         where: { id },
//       });
//     } catch (error) {
//       throw new NotFoundError(`Applicant with ID ${id} not found`);
//     }
//   }
// }
