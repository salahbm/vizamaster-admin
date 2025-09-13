// import { CreateCountryDto, UpdateCountryDto } from '@/server/common/dto';
// import { NotFoundError } from '@/server/common/errors';
// import {
//   FilterParams,
//   PaginationParams,
//   SortParams,
// } from '@/server/common/types';
// import {
//   buildFilterConditions,
//   buildPaginationParams,
//   buildSortParams,
// } from '@/server/common/utils';
// import { prisma } from '@/server/db/prisma';

// export class CountriesRepository {
//   /**
//    * Find all countries with optional pagination, filtering, and sorting
//    */
//   async findAll(
//     pagination?: PaginationParams,
//     filters?: FilterParams,
//     sort?: SortParams,
//   ) {
//     const { skip, take } = pagination
//       ? buildPaginationParams(pagination)
//       : { skip: undefined, take: undefined };
//     const where = filters ? buildFilterConditions(filters) : {};
//     const orderBy = sort ? buildSortParams(sort).orderBy : { name: 'asc' };

//     const [countries, total] = await Promise.all([
//       prisma.country.findMany({
//         where,
//         skip,
//         take,
//         orderBy,
//         include: {
//           _count: {
//             select: {
//               vacancies: true,
//             },
//           },
//         },
//       }),
//       prisma.country.count({ where }),
//     ]);

//     return { countries, total };
//   }

//   /**
//    * Find a country by ID
//    */
//   async findById(id: string) {
//     const country = await prisma.country.findUnique({
//       where: { id },
//       include: {
//         _count: {
//           select: {
//             vacancies: true,
//           },
//         },
//       },
//     });

//     if (!country) {
//       throw new NotFoundError(`Country with ID ${id} not found`);
//     }

//     return country;
//   }

//   /**
//    * Find a country by code
//    */
//   async findByCode(code: string) {
//     const country = await prisma.country.findUnique({
//       where: { code },
//       include: {
//         _count: {
//           select: {
//             vacancies: true,
//           },
//         },
//       },
//     });

//     if (!country) {
//       throw new NotFoundError(`Country with code ${code} not found`);
//     }

//     return country;
//   }

//   /**
//    * Create a new country
//    */
//   async create(data: CreateCountryDto) {
//     return prisma.country.create({
//       data,
//       include: {
//         _count: {
//           select: {
//             vacancies: true,
//           },
//         },
//       },
//     });
//   }

//   /**
//    * Update a country
//    */
//   async update(id: string, data: UpdateCountryDto) {
//     try {
//       return await prisma.country.update({
//         where: { id },
//         data,
//         include: {
//           _count: {
//             select: {
//               vacancies: true,
//             },
//           },
//         },
//       });
//     } catch (error) {
//       throw new NotFoundError(`Country with ID ${id} not found`);
//     }
//   }

//   /**
//    * Delete a country
//    */
//   async delete(id: string) {
//     try {
//       return await prisma.country.delete({
//         where: { id },
//       });
//     } catch (error) {
//       throw new NotFoundError(`Country with ID ${id} not found`);
//     }
//   }
// }
