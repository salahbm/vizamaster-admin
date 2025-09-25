import { AlertCircleIcon } from 'lucide-react';

interface ErrorDisplayProps {
  errors: string[];
}

export const ErrorDisplay = ({ errors }: ErrorDisplayProps) => {
  if (!errors.length) return null;

  return (
    <div
      className="text-destructive font-caption-1 flex items-center gap-1"
      role="alert"
    >
      <AlertCircleIcon className="size-4 shrink-0" />
      <div className="flex flex-col">
        {errors.map((error, index) => (
          <span key={index}>{error}</span>
        ))}
      </div>
    </div>
  );
};
