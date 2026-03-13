'use client';

import Error from 'next/error';

export default function GlobalNotFound() {
  return (
    <html lang='en'>
      <body>
        <div className='text-primary flex h-full items-center justify-center py-28 text-center text-4xl'>
          <Error statusCode={404} />;
        </div>
      </body>
    </html>
  );
}
