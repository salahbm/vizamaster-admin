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
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="h-[calc(100svh-4rem)] w-full flex-1 overflow-y-auto">
          <main className="px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </Suspense>
  );
}
