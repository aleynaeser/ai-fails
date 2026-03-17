import { z } from 'zod';

export const failFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .refine((value) => value.trim().split(/\s+/).filter(Boolean).length <= 100, 'Description must be less than 100 words'),
  categoryIds: z.array(z.string()).min(1, 'You must select at least one category'),
  author: z.string().min(1, 'Author / platform is required'),
  url: z
    .string()
    .min(1, 'URL is required')
    .transform((value) => (value && !/^https?:\/\//i.test(value) ? `https://${value}` : value))
    .refine(
      (value) => {
        try {
          const url = new URL(value);
          return !!url.hostname && url.hostname.includes('.');
        } catch {
          return false;
        }
      },
      { message: 'Please enter a valid URL' },
    ),
  date: z.string().min(1, 'Date is required'),
});

export type TFailFormValues = z.infer<typeof failFormSchema>;
