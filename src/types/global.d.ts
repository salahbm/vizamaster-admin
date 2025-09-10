export type TFieldValues =
  | string
  | number
  | boolean
  | 'intermediate'
  | Date
  | string[]
  | undefined
  | { from?: Date | undefined; to?: Date | undefined };
