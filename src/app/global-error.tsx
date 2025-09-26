'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Safely log error details
    console.warn('Global error occurred:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="bg-background text-foreground container flex h-screen w-full flex-col items-center justify-center gap-y-4">
          <h2 className="text-destructive text-5xl font-bold">
            Oops, Something Went Wrong!
          </h2>
          <p className="text-muted-foreground text-center text-lg">
            {error?.message || 'An unexpected error occurred'}
          </p>
          <Button variant="default" onClick={() => reset()} className="mt-4">
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}
