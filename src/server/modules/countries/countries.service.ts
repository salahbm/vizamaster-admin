// import { CountriesRepository } from './countries.repository';
// import { toCountryDto, toCountryWithVacanciesDto } from './countries.model';
// import { CreateCountryDto, UpdateCountryDto, CountryDto, CountryWithVacanciesDto } from '@/server/common/dto';
// import { PaginationParams, PaginatedResult, FilterParams, SortParams } from '@/server/common/types';
// import { createPaginatedResult } from '@/server/common/utils';
// import { ConflictError } from '@/server/common/errors';

// export class CountriesService {
//   private repository: CountriesRepository;

//   constructor() {
//     this.repository = new CountriesRepository();
//   }

//   /**
//    * Get all countries with pagination, filtering, and sorting
//    */
//   async getAllCountries(
//     pagination?: PaginationParams,
//     filters?: FilterParams,
//     sort?: SortParams
//   ): Promise<PaginatedResult<CountryWithVacanciesDto>> {
//     const { countries, total } = await this.repository.findAll(pagination, filters, sort);

//     const { page = 1, limit = 10 } = pagination || {};

//     const data = countries.map(toCountryWithVacanciesDto);

//     return createPaginatedResult(data, total, { page, limit });
//   }

//   /**
//    * Get a country by ID
//    */
//   async getCountryById(id: string): Promise<CountryWithVacanciesDto> {
//     const country = await this.repository.findById(id);
//     return toCountryWithVacanciesDto(country);
//   }

//   /**
//    * Get a country by code
//    */
//   async getCountryByCode(code: string): Promise<CountryWithVacanciesDto> {
//     const country = await this.repository.findByCode(code);
//     return toCountryWithVacanciesDto(country);
//   }

//   /**
//    * Create a new country
//    */
//   async createCountry(data: CreateCountryDto): Promise<CountryWithVacanciesDto> {
//     try {
//       // Check if country with same code already exists
//       await this.repository.findByCode(data.code);
//       throw new ConflictError(`Country with code ${data.code} already exists`);
//     } catch (error) {
//       // If country doesn't exist (NotFoundError), proceed with creation
//       if (error.name === 'NotFoundError') {
//         const country = await this.repository.create(data);
//         return toCountryWithVacanciesDto(country);
//       }
//       throw error;
//     }
//   }

//   /**
//    * Update a country
//    */
//   async updateCountry(id: string, data: UpdateCountryDto): Promise<CountryWithVacanciesDto> {
//     // If code is being updated, check if it already exists
//     if (data.code) {
//       try {
//         const existingCountry = await this.repository.findByCode(data.code);
//         if (existingCountry.id !== id) {
//           throw new ConflictError(`Country with code ${data.code} already exists`);
//         }
//       } catch (error) {
//         // If country doesn't exist (NotFoundError), it's safe to update
//         if (error.name !== 'NotFoundError') {
//           throw error;
//         }
//       }
//     }

//     const country = await this.repository.update(id, data);
//     return toCountryWithVacanciesDto(country);
//   }

//   /**
//    * Delete a country
//    */
//   async deleteCountry(id: string): Promise<CountryDto> {
//     const country = await this.repository.delete(id);
//     return toCountryDto(country);
//   }
// }
