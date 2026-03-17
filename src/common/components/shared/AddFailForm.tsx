'use client';

import { cn } from '@lib/utils';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { apiFetch } from '@lib/api/fetch';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { failCategories } from '@constants/fail-categories';
import { failFormSchema, TFailFormValues } from '@schemas/fail-form-schema';

interface IAddFailFormProps {
  open: boolean;
  onClose: () => void;
}

export function AddFailForm({ open, onClose }: IAddFailFormProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFailFormValues>({
    mode: 'all',
    resolver: zodResolver(failFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const selectedCategoryIds = watch('categoryIds');

  const toggleCategory = (id: string) => {
    const current = selectedCategoryIds ?? [];
    const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
    setValue('categoryIds', next, { shouldValidate: true });
  };

  const createFailMutation = useMutation({
    mutationFn: (values: TFailFormValues) =>
      apiFetch<IFailItem, TFailFormValues>('/api/fails', {
        method: 'POST',
        body: values,
      }),
    onSuccess: () => {
      reset();
      onClose();
    },
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [open]);

  return (
    <motion.div
      className='bg-background/50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className='hidden-scrollbar mx-auto flex h-fit max-h-[90vh] max-w-5xl flex-col overflow-y-auto px-10 py-16'>
        <div className='flex items-center justify-between'>
          <div className='space-y-4'>
            <p className='text-neutral text-xs tracking-[0.2em] uppercase'>AI Fails</p>
            <h2 className='text-primary text-4xl font-bold tracking-[0.06em]'>
              <strong>Let&apos;s share the story with us.</strong>
            </h2>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='text-secondary border-stroke hover:bg-accent flex h-12 w-12 items-center justify-center rounded-full border text-xl'
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit((values) => createFailMutation.mutate(values))}
          className='mt-10 flex flex-col gap-8'
        >
          {/* TITLE */}
          <div className='space-y-2'>
            <label
              htmlFor='title'
              className='text-neutral flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
            >
              <span className='bg-primary inline-block h-1.5 w-1.5 rounded-full' />
              Title
            </label>

            <div
              className={cn(
                'text-foreground border-stroke bg-primary/3 h-16 w-full rounded-2xl border px-6 text-sm shadow-[0_0_40px_rgba(0,0,0,0.7)]',
                {
                  'border-error': errors.title,
                },
              )}
            >
              <input
                id='title'
                {...register('title')}
                className='placeholder:text-secondary h-full w-full bg-transparent outline-none'
                placeholder='Story Title'
              />
            </div>

            {errors.title && <p className='text-error p-2 text-xs'>{errors.title.message}</p>}
          </div>

          {/* DESCRIPTION */}
          <div className='space-y-2'>
            <label
              htmlFor='description'
              className='text-neutral flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
            >
              <span className='bg-primary inline-block h-1.5 w-1.5 rounded-full' />
              Description
            </label>

            <div
              className={cn(
                'text-foreground border-stroke bg-primary/3 h-24 w-full rounded-2xl border p-6 text-sm shadow-[0_0_40px_rgba(0,0,0,0.7)]',
                {
                  'border-error': errors.description,
                },
              )}
            >
              <textarea
                id='description'
                {...register('description')}
                className='placeholder:text-secondary h-full w-full resize-none bg-transparent outline-none'
                placeholder='A short description (max 100 words)'
                maxLength={100}
              />
            </div>

            {errors.description && <p className='text-error p-2 text-xs'>{errors.description.message}</p>}
          </div>

          {/* CATEGORY */}
          <div className='space-y-2'>
            <label
              htmlFor='categoryIds'
              className='text-neutral flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
            >
              <span className='bg-primary inline-block h-1.5 w-1.5 rounded-full' />
              Category
            </label>

            <div className='flex flex-wrap gap-2'>
              {failCategories.map((category) => {
                const isActive = selectedCategoryIds?.includes(category.id);

                return (
                  <button
                    key={category.id}
                    type='button'
                    onClick={() => toggleCategory(category.id)}
                    className={cn('rounded-full border px-3 py-1 text-xs tracking-[0.14em] uppercase', {
                      'bg-primary text-background border-primary hover:bg-primary/90': isActive,
                      'text-secondary border-stroke hover:bg-secondary/20': !isActive,
                    })}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>

            {errors.categoryIds && <p className='text-error p-2 text-xs'>{errors.categoryIds.message}</p>}
          </div>

          {/* AUTHOR + URL + DATE */}
          <div className='grid grid-cols-3 gap-6'>
            <div className='space-y-2'>
              <label
                htmlFor='author'
                className='text-neutral flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase'
              >
                <span className='bg-primary inline-block h-1.5 w-1.5 rounded-full' />
                Author / Platform
              </label>

              <div
                className={cn(
                  'text-foreground border-stroke bg-primary/3 h-16 w-full rounded-2xl border px-6 text-sm shadow-[0_0_40px_rgba(0,0,0,0.7)]',
                  {
                    'border-error': errors.author,
                  },
                )}
              >
                <input
                  id='author'
                  {...register('author')}
                  className='placeholder:text-secondary h-full w-full bg-transparent outline-none'
                  placeholder='Author Name, X, Reddit, Medium...'
                />
              </div>
              {errors.author && <p className='text-error p-2 text-xs'>{errors.author.message}</p>}
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='url'
                className='text-neutral flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
              >
                <span className='bg-primary inline-block h-1.5 w-1.5 rounded-full' />
                URL
              </label>

              <div
                className={cn(
                  'text-foreground border-stroke bg-primary/3 h-16 w-full rounded-2xl border px-6 text-sm shadow-[0_0_40px_rgba(0,0,0,0.7)]',
                  {
                    'border-error': errors.url,
                  },
                )}
              >
                <input
                  id='url'
                  {...register('url')}
                  className='placeholder:text-secondary h-full w-full bg-transparent outline-none'
                  placeholder='https://...'
                />
              </div>
              {errors.url && <p className='text-error p-2 text-xs'>{errors.url.message}</p>}
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='date'
                className='text-neutral flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
              >
                <span className='bg-primary inline-block h-1.5 w-1.5 rounded-full' />
                Date
              </label>

              <div
                className={cn(
                  'text-foreground border-stroke bg-primary/3 h-16 w-full rounded-2xl border px-6 text-sm shadow-[0_0_40px_rgba(0,0,0,0.7)]',
                  {
                    'border-error': errors.date,
                  },
                )}
              >
                <input
                  id='date'
                  type='date'
                  {...register('date')}
                  className='placeholder:text-secondary h-full w-full bg-transparent outline-none'
                />
              </div>
              {errors.date && <p className='text-[11px] text-red-400'>{errors.date.message}</p>}
            </div>
          </div>

          <button
            type='submit'
            disabled={createFailMutation.isPending}
            className='disabled:bg-neutral text-background bg-primary/90 hover:bg-primary h-10 w-full rounded-full px-8 text-sm font-semibold tracking-[0.18em] uppercase'
          >
            {createFailMutation.isPending ? 'Saving...' : 'Submit'}
          </button>

          {createFailMutation.isError && (
            <p className='text-error p-2 text-xs'>
              {(createFailMutation.error as Error).message ?? 'Kayıt sırasında bir hata oluştu.'}
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
}
