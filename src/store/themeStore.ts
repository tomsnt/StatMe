import { create } from 'zustand';
import { BUILT_IN_THEMES, DEFAULT_THEME_ID, type Theme } from '../constants/themes';
import type { CustomTheme } from '../db/schema';

type ThemeStore = {
  activeThemeId: string;
  inverted: boolean;
  customThemes: CustomTheme[];
  setActiveTheme: (id: string) => void;
  setInverted: (inverted: boolean) => void;
  setCustomThemes: (themes: CustomTheme[]) => void;
  addCustomTheme: (theme: CustomTheme) => void;
  removeCustomTheme: (id: string) => void;
  getActiveColors: () => { bg: string; fg: string };
  getAllThemes: () => Theme[];
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  activeThemeId: DEFAULT_THEME_ID,
  inverted: false,
  customThemes: [],

  setActiveTheme: (id) => set({ activeThemeId: id }),
  setInverted: (inverted) => set({ inverted }),
  setCustomThemes: (themes) => set({ customThemes: themes }),
  addCustomTheme: (theme) => set((s) => ({ customThemes: [...s.customThemes, theme] })),
  removeCustomTheme: (id) => set((s) => ({ customThemes: s.customThemes.filter((t) => t.id !== id) })),

  getAllThemes: () => {
    const { customThemes } = get();
    return [
      ...BUILT_IN_THEMES,
      ...customThemes.map((t) => ({
        id: t.id,
        name: t.name,
        backgroundColor: t.backgroundColor,
        foregroundColor: t.foregroundColor,
        isCustom: true,
      })),
    ];
  },

  getActiveColors: () => {
    const { activeThemeId, inverted, customThemes } = get();
    const allThemes = [
      ...BUILT_IN_THEMES,
      ...customThemes.map((t) => ({
        id: t.id,
        name: t.name,
        backgroundColor: t.backgroundColor,
        foregroundColor: t.foregroundColor,
        isCustom: true,
      })),
    ];
    const theme = allThemes.find((t) => t.id === activeThemeId) ?? BUILT_IN_THEMES[0]!;
    return inverted
      ? { bg: theme.foregroundColor, fg: theme.backgroundColor }
      : { bg: theme.backgroundColor, fg: theme.foregroundColor };
  },
}));
