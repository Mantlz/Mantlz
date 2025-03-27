import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Accessibility settings
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  largerText: boolean;
  setLargerText: (value: boolean) => void;
  screenReader: boolean;
  setScreenReader: (value: boolean) => void;
  keyboardNavigation: boolean;
  setKeyboardNavigation: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Accessibility settings
      reducedMotion: false,
      setReducedMotion: (value) => set({ reducedMotion: value }),
      highContrast: false,
      setHighContrast: (value) => set({ highContrast: value }),
      largerText: false,
      setLargerText: (value) => set({ largerText: value }),
      screenReader: false,
      setScreenReader: (value) => set({ screenReader: value }),
      keyboardNavigation: true,
      setKeyboardNavigation: (value) => set({ keyboardNavigation: value }),
    }),
    {
      name: 'settings-storage',
    }
  )
); 