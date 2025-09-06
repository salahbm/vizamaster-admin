import React, { Suspense } from 'react';

import Header from '@/components/shared/header/header';
import Sidebar from '@/components/shared/sidebar/trigger';
import Loader from '@/components/ui/loader';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Loader />}>
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 overflow-y-auto bg-background pt-7 md:bg-gray lg:pt-13">
            <div className="md:px-6 lg:px-10">{children}</div>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
