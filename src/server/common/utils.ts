// import {
//   FilterParams,
//   PaginatedResult,
//   PaginationParams,
//   SortParams,
// } from './types';

// /**
//  * Builds pagination parameters for database queries
//  */
// export function buildPaginationParams(params: PaginationParams) {
//   const page = Math.max(1, params.page || 1);
//   const limit = Math.max(1, Math.min(100, params.limit || 10));
//   const skip = (page - 1) * limit;

//   return {
//     skip,
//     take: limit,
//     page,
//     limit,
//   };
// }

// /**
//  * Creates a paginated result object
//  */
// export function createPaginatedResult<T>(
//   data: T[],
//   total: number,
//   { page, limit }: { page: number; limit: number },
// ): PaginatedResult<T> {
//   return {
//     data,
//     meta: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// }

// /**
//  * Builds filter conditions for Prisma queries
//  */
// export function buildFilterConditions(filters: FilterParams) {
//   const conditions: Record<string, any> = {};

//   Object.entries(filters).forEach(([key, value]) => {
//     if (value === undefined) return;

//     if (typeof value === 'string') {
//       if (key.endsWith('Id')) {
//         conditions[key] = value;
//       } else {
//         conditions[key] = { contains: value, mode: 'insensitive' };
//       }
//     } else if (Array.isArray(value)) {
//       conditions[key] = { in: value };
//     } else {
//       conditions[key] = value;
//     }
//   });

//   return conditions;
// }

// /**
//  * Builds sort parameters for Prisma queries
//  */
// export function buildSortParams(sort?: SortParams) {
//   if (!sort) return {};

//   return {
//     orderBy: {
//       [sort.field]: sort.direction,
//     },
//   };
// }

// /**
//  * Validates and sanitizes form data against a schema
//  */
// export function validateFormData(formData: any, formSchema: any) {
//   const errors: Record<string, string> = {};
//   const sanitizedData: Record<string, any> = {};

//   formSchema.fields.forEach((field: any) => {
//     const value = formData[field.id];

//     // Check required fields
//     if (
//       field.required &&
//       (value === undefined || value === null || value === '')
//     ) {
//       errors[field.id] = `${field.label} is required`;
//       return;
//     }

//     // Skip validation if field is not required and value is empty
//     if (
//       !field.required &&
//       (value === undefined || value === null || value === '')
//     ) {
//       return;
//     }

//     // Type-specific validation
//     switch (field.type) {
//       case 'email':
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           errors[field.id] = `${field.label} must be a valid email address`;
//         }
//         break;

//       case 'number':
//         const numValue = Number(value);
//         if (isNaN(numValue)) {
//           errors[field.id] = `${field.label} must be a number`;
//         } else if (
//           field.validation?.min !== undefined &&
//           numValue < field.validation.min
//         ) {
//           errors[field.id] =
//             `${field.label} must be at least ${field.validation.min}`;
//         } else if (
//           field.validation?.max !== undefined &&
//           numValue > field.validation.max
//         ) {
//           errors[field.id] =
//             `${field.label} must be at most ${field.validation.max}`;
//         }
//         sanitizedData[field.id] = numValue;
//         return;

//       case 'select':
//         if (
//           field.options &&
//           !field.options.some((opt) => opt.value === value)
//         ) {
//           errors[field.id] =
//             `${field.label} must be one of the available options`;
//         }
//         break;

//       default:
//         if (typeof value === 'string' && field.validation?.pattern) {
//           const regex = new RegExp(field.validation.pattern);
//           if (!regex.test(value)) {
//             errors[field.id] =
//               field.validation.message || `${field.label} is invalid`;
//           }
//         }
//     }

//     sanitizedData[field.id] = value;
//   });

//   return {
//     isValid: Object.keys(errors).length === 0,
//     errors,
//     sanitizedData,
//   };
// }

// /**
//  * Generates a random string (useful for temporary passwords, etc.)
//  */
// export function generateRandomString(length = 10) {
//   const chars =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';

//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }

//   return result;
// }
