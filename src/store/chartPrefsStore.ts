import { create } from 'zustand';
import { DEFAULT_CHART_PREFS, type ChartPreferences } from '../constants/chartPrefs';

type ChartPrefsStore = {
  prefs: ChartPreferences;
  setPrefs: (prefs: Partial<ChartPreferences>) => void;
  setVerticalLine: (vl: Partial<ChartPreferences['verticalLine']>) => void;
};

export const useChartPrefsStore = create<ChartPrefsStore>((set) => ({
  prefs: DEFAULT_CHART_PREFS,

  setPrefs: (partial) =>
    set((s) => ({ prefs: { ...s.prefs, ...partial } })),

  setVerticalLine: (vl) =>
    set((s) => ({ prefs: { ...s.prefs, verticalLine: { ...s.prefs.verticalLine, ...vl } } })),
}));
