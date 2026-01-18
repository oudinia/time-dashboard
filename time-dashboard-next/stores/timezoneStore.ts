import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimeZoneSlot, TimeZoneSlotFormData } from '@/types/timezone';
import { generateId, MEMBER_COLORS } from '@/lib/utils';

interface TimezoneStoreState {
  slots: TimeZoneSlot[];
  addSlot: (data: TimeZoneSlotFormData) => TimeZoneSlot;
  updateSlot: (id: string, data: Partial<TimeZoneSlotFormData>) => void;
  deleteSlot: (id: string) => void;
  getSlot: (id: string) => TimeZoneSlot | undefined;
  getSlots: (ids: string[]) => TimeZoneSlot[];
}

const DEFAULT_SLOTS: TimeZoneSlot[] = [
  {
    id: 'default-ny',
    timezone: 'America/New_York',
    label: 'New York',
    country: 'US',
    workingHours: { start: '09:00', end: '17:00' },
    color: MEMBER_COLORS[0],
  },
  {
    id: 'default-london',
    timezone: 'Europe/London',
    label: 'London',
    country: 'GB',
    workingHours: { start: '09:00', end: '17:00' },
    color: MEMBER_COLORS[1],
  },
  {
    id: 'default-tokyo',
    timezone: 'Asia/Tokyo',
    label: 'Tokyo',
    country: 'JP',
    workingHours: { start: '09:00', end: '17:00' },
    color: MEMBER_COLORS[2],
  },
];

export const useTimezoneStore = create<TimezoneStoreState>()(
  persist(
    (set, get) => ({
      slots: DEFAULT_SLOTS,

      addSlot: (data) => {
        const newSlot: TimeZoneSlot = {
          id: generateId(),
          ...data,
          color: data.color || MEMBER_COLORS[get().slots.length % MEMBER_COLORS.length],
        };
        set((state) => ({
          slots: [...state.slots, newSlot],
        }));
        return newSlot;
      },

      updateSlot: (id, data) => {
        set((state) => ({
          slots: state.slots.map((slot) =>
            slot.id === id ? { ...slot, ...data } : slot
          ),
        }));
      },

      deleteSlot: (id) => {
        set((state) => ({
          slots: state.slots.filter((slot) => slot.id !== id),
        }));
      },

      getSlot: (id) => {
        return get().slots.find((slot) => slot.id === id);
      },

      getSlots: (ids) => {
        const allSlots = get().slots;
        return ids.map((id) => allSlots.find((s) => s.id === id)).filter(Boolean) as TimeZoneSlot[];
      },
    }),
    {
      name: 'timezone-storage',
    }
  )
);
