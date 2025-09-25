/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFileDto } from '@/server/common/dto/files.dto';

export type FieldValueTypes =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | 'intermediate'
  | Date
  | TFileDto[]
  | TFileDto
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
