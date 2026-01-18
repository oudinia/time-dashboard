'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
