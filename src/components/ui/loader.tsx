import { FC } from 'react';

import { cn } from '@/lib/utils';

const Loader: FC = ({ className }: { className?: string }) => (
  <div className={cn('flex-center h-[100vh] w-full', className)}>
    <span className="loader" />
  </div>
);

export default Loader;
