import z from 'zod';

export const WorkDto = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().nullable(),
  responsibilities: z.string().min(1),
  achievements: z.string().nullable(),
  location: z.string().nullable(),
});

export type TWorkDto = z.infer<typeof WorkDto>;

// Schema for the form that contains an array of work experiences
export const WorkArraySchema = z.object({
  workExperiences: z.array(WorkDto),
});

export type TWorkArraySchema = z.infer<typeof WorkArraySchema>;
