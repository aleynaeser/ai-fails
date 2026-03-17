'use client';

import { cn } from '@lib/utils';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { apiFetch } from '@lib/api/fetch';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type TCreateFailPayload } from '@lib/supabase/queries/fails';
import { failFormSchema, TFailFormValues } from '@schemas/fail-form-schema';
import { TCreateFailCategoryPayload } from '@lib/supabase/queries/categories';

interface IAddFailFormProps {
  open: boolean;
  categories: IFailCategory[];
  onClose: () => void;
}

export function AddFailForm({ open, categories, onClose }: IAddFailFormProps) {
 const router = useRouter();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TFailFormValues>({
    mode: 'all',
    resolver: zodResolver(failFormSchema),
    defaultValues: {
      categories: [],
      category: '',
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const selectedCategories = useWatch({
    control,
    name: 'categories',
  });

  const toggleCategory = (category: IFailCategory) => {
    const current = selectedCategories ?? [];
    const next = current.some((item) => item.id === category.id)
      ? current.filter((item) => item.id !== category.id)
      : [...current, category];

    setValue('categories', next, { shouldValidate: true });
  };

  const createFailMutation = useMutation({
    mutationFn: (values: TCreateFailPayload) =>
      apiFetch<IFailItem, TCreateFailPayload>('/api/fails', {
        method: 'POST',
        body: values,
      }),
    onSuccess: () => {
      reset({
        title: '',
        description: '',
        categories: [],
        category: '',
        author: '',
        url: '',
        date: new Date().toISOString().slice(0, 10),
      });
      onClose();
      router.refresh();
    },
  });

  const handleSubmitForm = async (values: TFailFormValues) => {
    clearErrors('category');

    try {
      const selected = values.categories ?? [];
      const typedCategory = values.category.trim();
      const categoriesToSend = [...selected];

      if (typedCategory) {
        const existingCategory = categories.find((category) => category.name.toLowerCase() === typedCategory.toLowerCase());

        if (existingCategory) {
          if (!categoriesToSend.some((category) => category.id === existingCategory.id)) {
            categoriesToSend.push(existingCategory);
          }
        } else {
          const createdCategory = await apiFetch<IFailCategory, TCreateFailCategoryPayload>('/api/categories', {
            method: 'POST',
            body: { name: typedCategory },
          });

          if (!categoriesToSend.some((category) => category.id === createdCategory.id)) {
            categoriesToSend.push(createdCategory);
          }
        }
      }

      if (!categoriesToSend.length) {
        setError('category', {
          type: 'manual',
          message: 'Select or write at least one category',
        });
        return;
      }

      createFailMutation.mutate({
        title: values.title,
        description: values.description,
        categories: categoriesToSend,
        author: values.author,
        url: values.url,
        date: values.date,
      });
    } catch (error) {
      setError('category', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Category creation failed',
      });
    }
  };

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  return (
    <motion.div
      className='bg-background/50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className='hidden-scrollbar mx-auto flex h-fit max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto'>
        <div className='flex items-center justify-between'>
          <div className='space-y-4'>
            <p className='text-secondary text-xs tracking-[0.2em] uppercase'>AI Fails</p>
            <h2 className='text-primary text-4xl font-bold tracking-[0.06em]'>
              <strong>Let&apos;s share the fail</strong>
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

        <form onSubmit={handleSubmit(handleSubmitForm)} className='mt-10 flex flex-col gap-8'>
          <div className='space-y-2'>
            <label
              htmlFor='title'
              className='text-secondary flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
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
                className='placeholder:text-neutral h-full w-full bg-transparent outline-none'
                placeholder='Fail Title'
              />
            </div>

            {errors.title && <p className='text-error p-2 text-xs'>{errors.title.message}</p>}
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='description'
              className='text-secondary flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
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
                className='placeholder:text-neutral h-full w-full resize-none bg-transparent outline-none'
                placeholder='A short description (max 100 words)'
                maxLength={100}
              />
            </div>

            {errors.description && <p className='text-error p-2 text-xs'>{errors.description.message}</p>}
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='category'
              className='text-secondary flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
            >
              <span className='bg-primary inline-block h-1.5 w-1.5 rounded-full' />
              Category
            </label>

            <div
              className={cn(
                'text-foreground border-stroke bg-primary/3 h-14 w-full rounded-2xl border px-5 text-sm shadow-[0_0_40px_rgba(0,0,0,0.7)]',
                {
                  'border-error': errors.category,
                },
              )}
            >
              <input
                id='category'
                {...register('category')}
                className='placeholder:text-neutral h-full w-full bg-transparent outline-none'
                placeholder='Write a category or pick below'
              />
            </div>

            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => {
                const isActive = selectedCategories?.some((item) => item.id === category.id);

                return (
                  <button
                    key={category.id}
                    type='button'
                    onClick={() => toggleCategory(category)}
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

            {errors.category && <p className='text-error p-2 text-xs'>{errors.category.message}</p>}
          </div>

          <div className='grid grid-cols-3 gap-6'>
            <div className='space-y-2'>
              <label
                htmlFor='author'
                className='text-secondary flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase'
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
                  className='placeholder:text-neutral h-full w-full bg-transparent outline-none'
                  placeholder='Author Name, X, Reddit, Medium...'
                />
              </div>
              {errors.author && <p className='text-error p-2 text-xs'>{errors.author.message}</p>}
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='url'
                className='text-secondary flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
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
                  className='placeholder:text-neutral h-full w-full bg-transparent outline-none'
                  placeholder='https://...'
                />
              </div>
              {errors.url && <p className='text-error p-2 text-xs'>{errors.url.message}</p>}
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='date'
                className='text-secondary flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase'
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
                  className='placeholder:text-neutral h-full w-full bg-transparent outline-none'
                />
              </div>
              {errors.date && <p className='text-error p-2 text-xs'>{errors.date.message}</p>}
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
              {(createFailMutation.error as Error).message ?? 'An error occurred while submitting the fail'}
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
}
