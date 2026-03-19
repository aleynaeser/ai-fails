import Link from 'next/link';
import { createClient } from '@lib/supabase/server';
import { getFails } from '@lib/supabase/queries/fails';

export default async function Home() {
  const supabase = await createClient();
  const fails = await getFails(supabase);

  return (
    <main className='bg-background text-foreground px-1 md:px-0'>
      <section className='border-stroke mt-44 border-[0.5px] md:mt-30'>
        <div className='grid grid-cols-1 md:grid-cols-4 md:px-0'>
          {fails.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              className='border-stroke hover:bg-accent/50 font-nunito-sans flex min-h-44 flex-col justify-between border-[0.5px] px-6 py-5'
            >
              <div>
                <p className='text-secondary mb-2 text-xs'>{item.author}</p>

                <p className='text-primary mb-2 text-lg/tight font-bold tracking-wider uppercase italic'>
                  <strong>&quot;{item.title}&quot;</strong>
                </p>

                <p className='text-neutral line-clamp-2 text-xs/relaxed'>{item.description}</p>
              </div>

              <footer className='mt-8 flex items-center justify-between'>
                <div className='flex flex-wrap items-center gap-2 text-xs uppercase'>
                  {item.categories.map((c) => (
                    <div key={c.id} className='bg-accent text-neutral rounded-full px-3 py-1'>
                      {c.name}
                    </div>
                  ))}
                </div>

                <p className='text-secondary text-xs'>{item.date}</p>
              </footer>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
