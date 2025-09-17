import { FileMetadata } from '@/hooks/common/use-file-upload';

export type FieldValueTypes =
  | string
  | number
  | boolean
  | 'intermediate'
  | Date
  | string[]
  | undefined
  | null
  | { from?: Date | undefined; to?: Date | undefined }
  | FileMetadata[]
  | FileMetadata;

export interface IResponse<T> {
  data: T;
  message: string;
  status: number;
  code: number;
}
