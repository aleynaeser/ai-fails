import { z } from 'zod';

export const failFormSchema = z.object({
  title: z.string().min(1, 'Başlık zorunlu'),
  description: z
    .string()
    .min(1, 'Açıklama zorunlu')
    .refine((value) => value.trim().split(/\s+/).filter(Boolean).length <= 100, 'Kısa açıklama en fazla 100 kelime olmalı'),
  categoryIds: z.array(z.string()).min(1, 'En az bir kategori seçmelisiniz'),
  author: z.string().min(1, 'Yazar / platform zorunlu'),
  url: z
    .string()
    .transform((value) => (value && !/^https?:\/\//i.test(value) ? `https://${value}` : value))
    .pipe(z.string().url('Geçerli bir URL girin')),
  date: z.string().min(1, 'Tarih zorunlu'),
});

export type TFailFormValues = z.infer<typeof failFormSchema>;
