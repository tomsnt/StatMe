# StatMe — TODO & Development Roadmap

## Phase 1 — Project Setup & Architecture
- [ ] Install core dependencies: expo-router, zustand, drizzle-orm, expo-sqlite, date-fns, victory-native-xl, react-native-svg
- [ ] Install Firebase dependencies: @react-native-firebase/app, @react-native-firebase/firestore, @react-native-firebase/auth, expo-auth-session, expo-web-browser
- [ ] Set up Expo Router file structure (tabs: index, statistics, settings + modals)
- [ ] Configure TypeScript strict mode in tsconfig.json
- [ ] Set up Drizzle ORM schema (StatGroup, StatDefinition, StatEntry, UserPrefs tables)
- [ ] Run first DB migration
- [ ] Create Zustand stores: statsStore, themeStore, chartPrefsStore, syncStore
- [ ] Create Firebase project on console.firebase.google.com and add google-services.json / GoogleService-Info.plist
- [ ] Set up useTheme() hook wired to themeStore

## Phase 2 — Core Utilities
- [ ] `src/utils/time.ts`: parseTimeInput("1.30" → 90min), formatMinutes(90 → "1.30"), sumTimeValues, formatTooltip(90 → "1h 30m")
- [ ] `src/utils/color.ts`: getGroupDotColor(entries, definitions), lighten/darken helpers
- [ ] `src/utils/format.ts`: formatDate, groupEntriesByDate, groupEntriesByGroup
- [ ] `src/constants/themes.ts`: define built-in themes (Antracite default + others once colors confirmed with user)
- [ ] `src/constants/defaultChartPrefs.ts`: default chart preferences object
- [ ] Write unit tests for time.ts arithmetic (critical edge cases: 0.45+0.30=1.15, rounding)

## Phase 3 — Calendar Screen (Tab 1)
- [ ] Build CalendarGrid component: custom month grid, white lines on theme bg
- [ ] DayCell component: shows day number + colored dot(s)
- [ ] Implement dot logic: multi-group = multiple dots, single-group = highest-value stat color
- [ ] Month navigation (swipe or arrows)
- [ ] Header: date top-left (current month/year), "+" button top-right
- [ ] "+" button opens add-entry modal (Expo Router modal route)
- [ ] Highlight today's cell
- [ ] Tap on day cell → show summary popover/sheet of entries for that day

## Phase 4 — Add Entry Modal
- [ ] Route: `app/add-entry.tsx` (modal presentation)
- [ ] Stat selector: searchable list of existing StatDefinitions + "Create new" option
- [ ] When creating new stat: name input, color picker, valueLabel input, isTimeBased toggle (permanent warning shown)
- [ ] Group selector: list of existing StatGroups + "Create new" option
- [ ] Value input: numeric keyboard, decimal support
  - If isTimeBased: show "H.MM" hint, validate MM < 60, parse to minutes on save
  - If not timeBased: standard decimal input
- [ ] isTimeBased toggle: shown but locked (non-editable) if definition already exists
- [ ] Optional description text input
- [ ] "Aggiungi" button: validates, saves to SQLite, triggers sync if enabled
- [ ] Success feedback + close modal

## Phase 5 — Statistics Screen (Tab 2)
- [ ] Route: `app/(tabs)/statistics.tsx`
- [ ] Header: "Statistiche" title + time span selector icon top-right (shows current: "1m", "6m", etc.)
- [ ] Time span picker: cycles through 1m | 3m | 6m | 1y | 2y on tap, or bottom sheet picker
- [ ] Groups list: each group card shows group name + mini line chart with all its stat lines overlaid
- [ ] Tap group card → navigate to group detail screen
- [ ] Group detail screen: shows each StatDefinition as a separate chart card
- [ ] Individual stat chart: full line chart with VictoryNativeXL, respects ChartPreferences
- [ ] Apply chart prefs: line style (smooth/sharp), data points (none/circle/diamond), vertical line (visible/style/opacity)
- [ ] Y-axis: format as "H.MM" for timeBased stats, raw number otherwise
- [ ] Tooltip on data point tap: date + value (formatted)

## Phase 6 — Settings Screen (Tab 3)
- [ ] Route: `app/(tabs)/settings.tsx`
- [ ] **Theme section**: list of built-in themes as selectable swatches, active theme highlighted
- [ ] "Create custom theme" option: color picker for bg + fg, name input, save
- [ ] Custom theme management: edit/delete custom themes
- [ ] **Chart style section**: controls for lineStyle, dataPoint, verticalLine (visible, style, opacity slider)
- [ ] Live preview of chart style options
- [ ] **Sync section**: "Sync with Google" toggle + Google account info when signed in
- [ ] Google Sign-In flow (expo-auth-session)
- [ ] Sign-out option
- [ ] **Backup section**: "Export year" picker (year selector) + export button → share JSON file
- [ ] Import JSON backup option (restore from file)
- [ ] App version info at bottom

## Phase 7 — Firebase Sync
- [ ] syncStore: manages sync state (enabled, lastSyncAt, userId, error)
- [ ] On Google sign-in: upload all local SQLite data to Firestore (merge strategy)
- [ ] Real-time listeners on Firestore collections → update local SQLite on change
- [ ] Conflict resolution: compare `updatedAt`, keep newer record
- [ ] Offline support: Firestore offline persistence enabled by default
- [ ] Sync custom themes and chart prefs to `users/{uid}/prefs`
- [ ] Handle sign-out: disable sync, keep local data

## Phase 8 — Polish & UX
- [ ] Smooth tab transitions
- [ ] Loading states for all async operations
- [ ] Empty states: calendar with no entries, statistics with no data
- [ ] Haptic feedback on "Aggiungi" success (expo-haptics)
- [ ] Pull-to-refresh on statistics screen
- [ ] Keyboard avoiding behavior in add-entry modal
- [ ] Accessibility: proper accessibilityLabel on all interactive elements
- [ ] iOS safe area insets handled everywhere

## Phase 9 — Testing & Release Prep
- [ ] Unit tests: time utils, color logic, group dot logic
- [ ] Integration tests: add entry flow, stat creation flow
- [ ] Test on iPhone simulator (multiple screen sizes)
- [ ] Test on Android emulator
- [ ] Set up EAS Build for production builds
- [ ] Configure app.json: name "StatMe", bundle ID `com.tomsnt.statme`, icons, splash screen
- [ ] Design app icon and splash screen
- [ ] Submit to TestFlight (iOS) for personal testing

## Open Items (needs user input)
- [ ] Confirm built-in theme color pairs (bg + fg hex values for each theme)
- [ ] Confirm which additional built-in themes to include beyond Antracite
- [ ] Confirm time span default (currently set to 1m — change?)
