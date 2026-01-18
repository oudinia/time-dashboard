import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalTimezone } from '@/lib/timezone';

interface SettingsState {
  darkMode: boolean;
  timeFormat: '12h' | '24h';
  localTimezone: string;
  showSeconds: boolean;
  toggleDarkMode: () => void;
  setTimeFormat: (format: '12h' | '24h') => void;
  setLocalTimezone: (timezone: string) => void;
  toggleShowSeconds: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      timeFormat: '12h',
      localTimezone: getLocalTimezone(),
      showSeconds: false,

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      setTimeFormat: (format) => {
        set({ timeFormat: format });
      },

      setLocalTimezone: (timezone) => {
        set({ localTimezone: timezone });
      },

      toggleShowSeconds: () => {
        set((state) => ({ showSeconds: !state.showSeconds }));
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
