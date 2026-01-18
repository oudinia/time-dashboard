'use client';

import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50">
      <Header />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
