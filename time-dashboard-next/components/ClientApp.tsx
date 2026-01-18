'use client';

import { useEffect, useState } from 'react';
import { Globe, ChevronRight, ChevronLeft } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Dashboard } from '@/components/dashboard';
import { TimezoneManager } from '@/components/timezone';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/stores/settingsStore';
import { cn } from '@/lib/utils';

export function ClientApp() {
  const { darkMode } = useSettingsStore();
  const [showTimezones, setShowTimezones] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Layout>
      <div className="flex gap-6">
        {/* Main Dashboard Area */}
        <div className="flex-1 min-w-0">
          <Dashboard />
        </div>

        {/* Timezone Manager Sidebar (Desktop) */}
        <div
          className={cn(
            'hidden lg:block transition-all duration-300 ease-in-out',
            showTimezones ? 'w-80' : 'w-0'
          )}
        >
          {showTimezones && (
            <div className="w-80 border-l border-neutral-200 dark:border-neutral-800 pl-6">
              <TimezoneManager />
            </div>
          )}
        </div>

        {/* Toggle Button for Timezone Panel */}
        <div className="hidden lg:flex items-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTimezones(!showTimezones)}
            className="flex items-center gap-1"
          >
            <Globe className="w-4 h-4" />
            {showTimezones ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Timezone Manager */}
      <div className="lg:hidden mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <TimezoneManager />
      </div>
    </Layout>
  );
}
