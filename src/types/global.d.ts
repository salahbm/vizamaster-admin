/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileMetadata } from '@/hooks/common/use-file-upload';

export type FieldValueTypes =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | 'intermediate'
  | Date
  | FileMetadata[]
  | FileMetadata
  | { from?: Date | undefined; to?: Date | undefined }
  | undefined
  | null
  | any;

export interface IResponse<T> {
  data: T;
  message: string;
  status: number;
  code: number;
}
