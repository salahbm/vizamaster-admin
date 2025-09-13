// import { File } from '@prisma/client';

// import { FileDto, FileWithUrlDto } from '@/server/common/dto';

// // Convert Prisma File model to DTO
// export function toFileDto(file: File): FileDto {
//   return {
//     id: file.id,
//     applicantId: file.applicantId,
//     filename: file.filename,
//     path: file.path,
//     size: file.size,
//     mimeType: file.mimeType,
//     createdAt: file.createdAt,
//     updatedAt: file.updatedAt,
//   };
// }

// // Convert Prisma File model with URL to DTO
// export function toFileWithUrlDto(file: File, url: string): FileWithUrlDto {
//   return {
//     ...toFileDto(file),
//     url,
//   };
// }
