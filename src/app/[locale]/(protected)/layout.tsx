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
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="w-full overflow-y-auto h-[calc(100vh-4rem)]">
          <main className="px-4 md:px-6 py-6">{children}</main>
        </div>
      </div>
    </Suspense>
  );
}
