// import { supabase } from '@/lib/supabase';

// import { CreateFileDto } from '@/server/common/dto';
// import { InternalServerError, NotFoundError } from '@/server/common/errors';
// import { prisma } from '@/server/db/prisma';

// export class FilesRepository {
//   private readonly BUCKET_NAME = 'applicant-files';

//   /**
//    * Find all files by applicant ID
//    */
//   async findByApplicantId(applicantId: string) {
//     return prisma.file.findMany({
//       where: { applicantId },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   /**
//    * Find a file by ID
//    */
//   async findById(id: string) {
//     const file = await prisma.file.findUnique({
//       where: { id },
//     });

//     if (!file) {
//       throw new NotFoundError(`File with ID ${id} not found`);
//     }

//     return file;
//   }

//   /**
//    * Create a new file record in the database
//    */
//   async create(data: CreateFileDto) {
//     return prisma.file.create({
//       data,
//     });
//   }

//   /**
//    * Delete a file
//    */
//   async delete(id: string) {
//     try {
//       const file = await this.findById(id);

//       // Delete from Supabase storage
//       await this.deleteFromStorage(file.path);

//       // Delete from database
//       return await prisma.file.delete({
//         where: { id },
//       });
//     } catch (error) {
//       if (error instanceof NotFoundError) {
//         throw error;
//       }
//       throw new InternalServerError(`Failed to delete file: ${error.message}`);
//     }
//   }

//   /**
//    * Upload a file to Supabase storage
//    */
//   async uploadToStorage(
//     file: Buffer,
//     filename: string,
//     mimeType: string,
//     applicantId: string,
//   ) {
//     try {
//       // Create a unique path for the file
//       const path = `${applicantId}/${Date.now()}-${filename}`;

//       // Upload to Supabase storage
//       const { data, error } = await supabase.storage
//         .from(this.BUCKET_NAME)
//         .upload(path, file, {
//           contentType: mimeType,
//           upsert: false,
//         });

//       if (error) {
//         throw new InternalServerError(
//           `Failed to upload file: ${error.message}`,
//         );
//       }

//       return {
//         path: data?.path || path,
//         size: file.length,
//       };
//     } catch (error) {
//       throw new InternalServerError(`Failed to upload file: ${error.message}`);
//     }
//   }

//   /**
//    * Delete a file from Supabase storage
//    */
//   async deleteFromStorage(path: string) {
//     try {
//       const { error } = await supabase.storage
//         .from(this.BUCKET_NAME)
//         .remove([path]);

//       if (error) {
//         throw new InternalServerError(
//           `Failed to delete file from storage: ${error.message}`,
//         );
//       }

//       return true;
//     } catch (error) {
//       throw new InternalServerError(
//         `Failed to delete file from storage: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Generate a signed URL for a file
//    */
//   async getSignedUrl(path: string, expiresIn = 3600) {
//     try {
//       const { data, error } = await supabase.storage
//         .from(this.BUCKET_NAME)
//         .createSignedUrl(path, expiresIn);

//       if (error) {
//         throw new InternalServerError(
//           `Failed to generate signed URL: ${error.message}`,
//         );
//       }

//       return data?.signedUrl;
//     } catch (error) {
//       throw new InternalServerError(
//         `Failed to generate signed URL: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Get a public URL for a file
//    */
//   getPublicUrl(path: string) {
//     const { data } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(path);

//     return data?.publicUrl;
//   }
// }
