import { useEffect, useState } from 'react';
import { initDatabase, db } from '../db';
import { statGroups, statDefinitions, statEntries, userPrefs, customThemes } from '../db/schema';
import { useStatsStore } from '../store/statsStore';
import { useThemeStore } from '../store/themeStore';
import { useChartPrefsStore } from '../store/chartPrefsStore';
import { DEFAULT_CHART_PREFS } from '../constants/chartPrefs';

export function useInitApp() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initDatabase();

      const [groups, definitions, entries, themes, prefs] = await Promise.all([
        db.select().from(statGroups),
        db.select().from(statDefinitions),
        db.select().from(statEntries),
        db.select().from(customThemes),
        db.select().from(userPrefs),
      ]);

      useStatsStore.getState().setGroups(groups);
      useStatsStore.getState().setDefinitions(definitions);
      useStatsStore.getState().setEntries(entries);
      useThemeStore.getState().setCustomThemes(themes);

      const prefsMap = Object.fromEntries(prefs.map((p) => [p.key, p.value]));

      if (prefsMap['activeThemeId']) {
        useThemeStore.getState().setActiveTheme(prefsMap['activeThemeId']);
      }
      if (prefsMap['inverted']) {
        useThemeStore.getState().setInverted(prefsMap['inverted'] === 'true');
      }
      if (prefsMap['chartPrefs']) {
        try {
          const parsed = JSON.parse(prefsMap['chartPrefs']);
          useChartPrefsStore.getState().setPrefs({ ...DEFAULT_CHART_PREFS, ...parsed });
        } catch {}
      }

      setReady(true);
    })();
  }, []);

  return ready;
}
