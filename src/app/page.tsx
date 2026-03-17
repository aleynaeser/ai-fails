import Link from 'next/link';
import { apiFetch } from '@lib/api/fetch';

export default async function Home() {
  const fails = await apiFetch<IFailItem[]>('/api/fails');

  return (
    <main className='bg-background text-foreground'>
      <section className='border-stroke mt-28 border-[0.5px]'>
        <div className='grid grid-cols-4'>
          {fails.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              className='border-stroke hover:bg-accent flex min-h-44 flex-col justify-between border-[0.5px] px-6 py-5'
            >
              <div>
                <p className='text-neutral mb-2 text-xs tracking-[0.16em]'>{item.author}</p>

                <p className='text-primary mb-2 text-lg/tight font-bold tracking-[0.18em] uppercase italic'>
                  <strong>&quot;{item.title}&quot;</strong>
                </p>

                <p className='text-secondary line-clamp-2 text-xs/relaxed'>{item.description}</p>
              </div>

              <footer className='mt-8 flex items-center justify-between'>
                <div className='flex items-center gap-2 text-xs uppercase'>
                  {item.categories.map((c) => (
                    <div key={c.id} className='bg-accent text-secondary rounded-full px-3 py-1'>
                      {c.name}
                    </div>
                  ))}
                </div>

                <p className='text-secondary text-xs tracking-[0.16em]'>{item.date}</p>
              </footer>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
