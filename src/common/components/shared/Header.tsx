'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { IconButton } from '@components/ui/IconButton';
import { AddFailModal } from '@ui/AddFailModal';

export default function Header({ categories }: { categories: IFailCategory[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className='fixed top-0 right-0 left-0 z-50 flex flex-col items-center justify-between gap-4 p-7 backdrop-blur-xs lg:flex-row'>
        <div className='flex w-full items-center justify-between'>
          <Link href='/' className='flex-1'>
            <Image src='/images/ai-logo.png' alt='Logo' width={40} height={40} priority />
          </Link>

          <div className='hidden items-center gap-16 text-xs font-bold lg:flex'>
            <h1>AI FAILS</h1>

            <p className='max-w-82'>
              A REPOSITORY OF ETHICAL
              <br /> LAPSES AND SYSTEM VIOLATIONS.
              <br /> CONTRIBUTE TO THE ARCHIVE.
            </p>

            <div className='flex items-center gap-2'>
              <span className='bg-primary dot-opacity-pulse h-1.5 w-1.5 rounded-full' />
              <h2>TURKIYE, TR</h2>
              <p className='pl-2'>
                {new Date().toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className='flex flex-1 items-center justify-end'>
            <IconButton content="Let's Share" onClick={() => setIsModalOpen(true)} />
          </div>
        </div>

        <div className='flex w-full items-center justify-between gap-16 text-xs font-bold lg:hidden'>
          <h1>AI FAILS</h1>

          <p className='max-w-82 line-clamp-3 md:line-clamp-4'>
            A REPOSITORY OF ETHICAL
            <br /> LAPSES AND SYSTEM VIOLATIONS.
            <br /> CONTRIBUTE TO THE ARCHIVE.
          </p>

          <div className='flex items-center gap-2'>
            <span className='bg-primary dot-opacity-pulse h-1.5 w-1.5 rounded-full' />
            <h2>TURKIYE, TR</h2>
            <p className='pl-2'>
              {new Date().toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </header>

      <AddFailModal open={isModalOpen} categories={categories} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
