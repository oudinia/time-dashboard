import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const MEMBER_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#6366F1', // indigo
];

export function getNextColor(usedColors: string[]): string {
  const availableColors = MEMBER_COLORS.filter((c) => !usedColors.includes(c));
  if (availableColors.length > 0) {
    return availableColors[0];
  }
  return MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];
}
