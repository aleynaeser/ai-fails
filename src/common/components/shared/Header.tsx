'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { IconButton } from '@components/ui/IconButton';
import { AddFailModal } from '@ui/AddFailModal';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className='fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-xs'>
        <Link href='/' className='flex-1'>
          <Image src='/images/ai-logo.png' alt='Logo' width={40} height={40} priority />
        </Link>

        <div className='flex items-center gap-16 text-xs font-bold'>
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
      </header>

      <AddFailModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
