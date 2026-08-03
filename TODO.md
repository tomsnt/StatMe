# StatMe — TODO & Development Roadmap

## Phase 1 — Project Setup & Architecture ✅
- [x] Install core dependencies: expo-router, zustand, drizzle-orm, expo-sqlite, date-fns, react-native-gifted-charts, react-native-svg
- [x] Set up Expo Router file structure (tabs: index, statistics, settings + modals)
- [x] Configure TypeScript strict mode in tsconfig.json
- [x] Set up Drizzle ORM schema (StatGroup, StatDefinition, StatEntry, UserPrefs, CustomThemes)
- [x] Create Zustand stores: statsStore, themeStore, chartPrefsStore
- [x] Set up useTheme() hook wired to themeStore
- [x] Create useInitApp() hook — loads DB into stores on startup

## Phase 2 — Core Utilities ✅
- [x] `src/utils/time.ts`: parseTimeInput, formatMinutes, sumTimeValues, formatMinutesToLabel
- [x] `src/utils/color.ts`: getCalendarDotColor (dot logic per group)
- [x] `src/utils/format.ts`: formatDate, monthDays, formatMonthYear
- [x] `src/constants/themes.ts`: Simple, Sour, Copper, Coral, Poison + inverted flag logic
- [x] `src/constants/chartPrefs.ts`: default chart preferences
- [x] `src/constants/timeSpan.ts`: 1m | 3m | 6m | 1y | 2y

## Phase 3 — Calendar Screen (Tab 1)
- [ ] Build CalendarGrid component: custom month grid, lines in fg color on bg
- [ ] DayCell component: shows day number + colored dot(s)
- [ ] Implement dot logic via getCalendarDotColor (multi-group = multiple dots, single-group = highest-value stat color)
- [ ] Month navigation (swipe left/right or arrow buttons)
- [ ] Highlight today's cell
- [ ] Tap on day cell → show bottom sheet with summary of entries for that day

## Phase 4 — Add Entry Modal
- [ ] Stat selector: list of existing StatDefinitions + "Crea nuova" option
- [ ] When creating new stat: name input, color picker, valueLabel input, isTimeBased toggle (permanent — show warning)
- [ ] Group selector: list of existing StatGroups + "Crea nuovo gruppo" option
- [ ] Value input: numeric keyboard, decimal support
  - If isTimeBased: show "H.MM" placeholder, validate MM < 60, store as total minutes
  - If not timeBased: standard decimal input
- [ ] isTimeBased: locked (non-editable) when definition already exists, shown as read-only badge
- [ ] Optional description text input
- [ ] "Aggiungi" button: validates → saves to SQLite → updates statsStore → haptic → close modal

## Phase 5 — Statistics Screen (Tab 2)
- [ ] Groups list: each group card shows group name + mini line chart (all stat lines overlaid)
- [ ] Tap group card → group detail screen with individual chart per StatDefinition
- [ ] Individual stat chart: line chart via react-native-gifted-charts, respects ChartPreferences
- [ ] Apply chart prefs: line style (smooth/sharp), data points (none/circle/diamond), vertical line
- [ ] Y-axis: format as "H.MM" for timeBased stats, raw number otherwise
- [ ] Tooltip on data point tap: date + formatted value
- [ ] Time span selector cycles through 1m | 3m | 6m | 1y | 2y

## Phase 6 — Settings Screen (Tab 3)
- [ ] **Theme section**: horizontal list of built-in theme swatches, active one highlighted
- [ ] "Inverted" toggle button next to active theme
- [ ] "Crea tema custom" option: color picker for bg + fg, name input, save to SQLite
- [ ] Custom theme management: delete custom themes
- [ ] **Chart style section**: lineStyle picker, dataPoint picker, verticalLine controls (visible toggle, solid/dashed, opacity slider)
- [ ] Live mini-chart preview that reflects selected chart prefs
- [ ] **Backup section**: year selector + "Esporta JSON" button → expo-sharing share sheet
- [ ] Import JSON backup (restore from file via expo-document-picker)
- [ ] App version info at bottom
- [ ] All prefs persisted to SQLite `user_prefs` table on change

## Phase 7 — Polish & UX
- [ ] Loading states for all async operations
- [ ] Empty states: calendar with no entries, statistics with no data
- [ ] Haptic feedback on "Aggiungi" success (expo-haptics)
- [ ] Keyboard avoiding behavior in add-entry modal
- [ ] iOS safe area insets handled everywhere (useSafeAreaInsets)
- [ ] Smooth animations on modal open/close

## Phase 8 — Testing & Release Prep
- [ ] Unit tests: time.ts arithmetic edge cases (0.45+0.30=1.15, rounding)
- [ ] Test on iPhone simulator (multiple screen sizes)
- [ ] Test on Android emulator
- [ ] Set up EAS Build for production builds
- [ ] Design app icon and splash screen
- [ ] Submit to TestFlight (iOS) for personal testing
