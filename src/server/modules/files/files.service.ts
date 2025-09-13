// import { CreateFileDto, FileDto, FileWithUrlDto } from '@/server/common/dto';
// import { NotFoundError, ValidationError } from '@/server/common/errors';
// import { FileUploadResult } from '@/server/common/types';

// import { ApplicantsRepository } from '../applicants/applicants.repository';
// import { toFileDto, toFileWithUrlDto } from './files.model';
// import { FilesRepository } from './files.repository';

// export class FilesService {
//   private repository: FilesRepository;
//   private applicantsRepository: ApplicantsRepository;

//   constructor() {
//     this.repository = new FilesRepository();
//     this.applicantsRepository = new ApplicantsRepository();
//   }

//   /**
//    * Get all files for an applicant
//    */
//   async getFilesByApplicantId(applicantId: string): Promise<FileWithUrlDto[]> {
//     // Check if applicant exists
//     await this.applicantsRepository.findById(applicantId);

//     const files = await this.repository.findByApplicantId(applicantId);

//     // Generate URLs for each file
//     const filesWithUrls = await Promise.all(
//       files.map(async (file) => {
//         const url = await this.repository.getSignedUrl(file.path);
//         return toFileWithUrlDto(file, url || '');
//       }),
//     );

//     return filesWithUrls;
//   }

//   /**
//    * Get a file by ID with signed URL
//    */
//   async getFileById(id: string): Promise<FileWithUrlDto> {
//     const file = await this.repository.findById(id);
//     const url = await this.repository.getSignedUrl(file.path);
//     return toFileWithUrlDto(file, url || '');
//   }

//   /**
//    * Upload a file for an applicant
//    */
//   async uploadFile(
//     applicantId: string,
//     file: Buffer,
//     filename: string,
//     mimeType: string,
//   ): Promise<FileUploadResult> {
//     // Check if applicant exists
//     await this.applicantsRepository.findById(applicantId);

//     // Validate file
//     if (!file || file.length === 0) {
//       throw new ValidationError('File is empty');
//     }

//     if (!filename) {
//       throw new ValidationError('Filename is required');
//     }

//     if (!mimeType) {
//       throw new ValidationError('MIME type is required');
//     }

//     // Upload file to storage
//     const { path, size } = await this.repository.uploadToStorage(
//       file,
//       filename,
//       mimeType,
//       applicantId,
//     );

//     // Create file record in database
//     const fileData: CreateFileDto = {
//       applicantId,
//       filename,
//       path,
//       size,
//       mimeType,
//     };

//     const createdFile = await this.repository.create(fileData);

//     // Generate signed URL
//     const url = await this.repository.getSignedUrl(path);

//     return {
//       id: createdFile.id,
//       filename: createdFile.filename,
//       path: createdFile.path,
//       size: createdFile.size,
//       mimeType: createdFile.mimeType,
//       url: url || '',
//     };
//   }

//   /**
//    * Delete a file
//    */
//   async deleteFile(id: string): Promise<FileDto> {
//     const file = await this.repository.delete(id);
//     return toFileDto(file);
//   }

//   /**
//    * Generate a signed URL for a file
//    */
//   async getSignedUrl(id: string, expiresIn = 3600): Promise<string> {
//     const file = await this.repository.findById(id);
//     const url = await this.repository.getSignedUrl(file.path, expiresIn);

//     if (!url) {
//       throw new NotFoundError('Failed to generate signed URL');
//     }

//     return url;
//   }
// }
