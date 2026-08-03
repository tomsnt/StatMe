import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  return useThemeStore((s) => s.getActiveColors());
}
