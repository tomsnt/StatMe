@AGENTS.md

# StatMe — Claude Development Guide

## Project Overview
StatMe is a React Native (Expo) mobile app for tracking personal statistics day by day.
Features: dark-themed calendar with colored dots, line charts per stat group, full theming
and chart customization, local SQLite storage with JSON export backup.

## Tech Stack
- **Framework**: React Native with Expo SDK (latest stable)
- **Language**: TypeScript (strict)
- **Navigation**: Expo Router (file-based, tab layout)
- **State**: Zustand
- **Local DB**: expo-sqlite via Drizzle ORM
- **Charts**: react-native-gifted-charts
- **Date handling**: date-fns

## Project Structure
```
app/
  (tabs)/
    index.tsx            # Calendar screen
    statistics.tsx       # Statistics / charts screen
    settings.tsx         # Settings screen
  add-entry.tsx          # Modal: add daily stat entry
  stat-detail/[id].tsx   # Detail chart for a single stat
src/
  components/            # Reusable UI components
  db/                    # Drizzle schema + migrations
  store/                 # Zustand stores (stats, theme, chartPrefs)
  hooks/                 # Custom hooks
  utils/                 # time.ts, color.ts, format.ts
  constants/             # themes.ts, defaultChartPrefs.ts
```

## Data Models

### StatGroup
```ts
{ id: string, name: string, color: string, createdAt: string, updatedAt: string }
```

### StatDefinition
```ts
{
  id: string,
  groupId: string,
  name: string,
  valueLabel: string,   // e.g. "ripetizioni", "ore di studio"
  color: string,        // user-chosen, shown as dot and chart line
  isTimeBased: boolean, // permanent flag — set at creation, inherited by all entries
  createdAt: string,
  updatedAt: string
}
```
`isTimeBased` is permanent and set once at creation. When adding a new entry for a
definition that has `isTimeBased = true`, the toggle must be pre-set and non-editable.

### StatEntry
```ts
{
  id: string,
  statDefinitionId: string,
  date: string,          // YYYY-MM-DD, local date only — no timezone conversion
  value: number,         // always stored as total MINUTES if isTimeBased, else raw decimal
  description?: string,
  createdAt: string,
  updatedAt: string
}
```

### Theme
```ts
{ id: string, name: string, backgroundColor: string, foregroundColor: string, isCustom: boolean }
```
App is strictly bicolor:
- `backgroundColor` → app bg, card surfaces, calendar grid bg, navbar bg
- `foregroundColor` → text, icons, calendar grid lines, navbar icons, borders

Stat/group colors (dots, chart lines) are user-chosen per stat — they are NOT theme colors
and remain independent of the active theme.

### ChartPreferences (persisted in user prefs store)
```ts
{
  lineStyle: 'smooth' | 'sharp',
  dataPoint: 'none' | 'circle' | 'diamond',  // diamond = square rotated 45°
  verticalLine: {
    visible: boolean,
    style: 'solid' | 'dashed',
    opacity: number   // 0.15–0.4, always visually behind data points
  }
}
```

## Key Business Logic

### Time Value Arithmetic
When `isTimeBased = true`:
- Input `1.30` means 1 hour 30 minutes (NOT 1.3 hours — separator is hours.minutes)
- **Store as total minutes**: `1.30 → 90`, `0.45 → 45`, `2.00 → 120`
- **Sum correctly**: 90 + 45 = 135 min → display as `2.15` (2h 15m)
- **Display**: always convert stored minutes back to `H.MM` format
- **Chart Y-axis tooltips**: show as "1h 30m", "2h 15m", etc.
- Parser: `input "H.MM" → hours * 60 + minutes`; formatter: `minutes → "${h}.${mm.padStart(2,'0')}"`

### Calendar Dot Logic
Each day cell can show multiple dots (one per group with entries that day):
- **Multiple groups** that day → one dot per group, each dot = that group's `StatGroup.color`
- **Single group** that day → one dot, color = `StatDefinition.color` of the stat with the
  **highest value** among all entries of that group on that day

### Statistics Screen — Time Span
Selector values: `1m | 3m | 6m | 1y | 2y`. Default: `1m`.
Icon in top-right shows active span (e.g. "6m"). Tapping cycles or shows a picker.

## Theming System
All theme-sensitive UI values MUST reference the active theme object — never hardcode hex
colors in component files. Use a `useTheme()` hook that returns the active theme.

Built-in themes (bg → fg):
- **Simple** (default): `#1A141F` → `#EBEBEB`
- **Sour**: `#6D329C` → `#929C32`
- **Copper**: `#9C4A19` → `#329B9C`
- **Coral**: `#57C2CF` → `#CF691D`
- **Poison**: `#DD84F2` → `#810ECF`

**Inverted flag**: each theme (built-in and custom) has an `inverted: boolean` toggle
shown as a button next to the theme selector in Settings. When active, bg and fg are swapped.
This is a display-level transform — do not store swapped values, just apply the swap at
render time via `useTheme()`. The `inverted` state is stored per-user in prefs.

Custom themes: user picks 2 colors via color picker + names it → saved locally in SQLite.

## Backup / Export
- Settings action: export all entries for a selected year as JSON
- Uses system share sheet (expo-sharing) — no server upload

## Development Commands
```bash
npx expo start            # Start dev server
npx expo run:ios          # Build and run on iOS simulator
npx expo run:android      # Build and run on Android emulator
npx drizzle-kit generate  # Generate DB migrations after schema changes
npx drizzle-kit migrate   # Apply migrations
```

## Code Conventions
- Strict TypeScript — no `any`, no type assertions without comment explaining why
- All colors via theme or stat-defined — never hardcoded hex in component files
- Time values stored as total minutes (integer). Display as HH.MM. Never store "1.30" as float.
- Dates stored as `YYYY-MM-DD` strings — local date only, no UTC conversion
- File naming: components PascalCase, utilities camelCase, hooks `use` prefix
- No inline styles — use `StyleSheet.create`
- Zustand stores: one file per domain (statsStore, themeStore, chartPrefsStore)
