'use client';

import Error from 'next/error';
import { ViewTransition } from 'react';

export default function GlobalNotFound() {
  return (
    <html lang='en'>
      <body className='font-anonymous-pro text-foreground flex items-center justify-center text-center'>
        <ViewTransition enter='fade-in' exit='fade-out'>
          <Error statusCode={404} />
        </ViewTransition>
      </body>
    </html>
  );
}
