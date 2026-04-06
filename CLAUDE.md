# FlexTrack

Cross-platform yoga/flexibility accountability app for families. Built with React Native + Expo SDK 52+, TypeScript strict, Supabase backend. 1 iOS + 3 Android users, distributed via Expo Go initially.

## Commands

```bash
npx expo start                  # Dev server
npx expo start --ios            # iOS simulator
npx expo start --android        # Android emulator
npm test                        # Jest tests
npm run test:watch              # Jest watch mode
npm run lint                    # ESLint
npm run lint:fix                # ESLint autofix
npm run typecheck               # tsc --noEmit
npm run format                  # Prettier write
npm run format:check            # Prettier check
```

## VERIFICATION — RUN BEFORE EVERY TASK COMPLETION

Before returning work to the user, run ALL of these and confirm they pass:

```bash
npm run lint && npm run typecheck && npm test
```

If any fail, fix the issue first. Do not tell the user to run these — run them yourself and report results. Never skip this step.

## Code Style

- TypeScript strict mode. Never use `any` — use `unknown` + type narrowing.
- Functional components only. No class components.
- Named exports (except screen components for Expo Router).
- `const` over `let`. Never `var`.
- Early returns over nested conditionals.
- All user-facing text through i18n (`useTranslation` hook).
- No inline styles — use StyleSheet.create or NativeWind classes.

## Architecture

```
app/                    # Expo Router file-based routes
  (auth)/               # Login, register (unauthenticated)
  (tabs)/               # Main tabs (authenticated): home, group, plan, alerts
  checkin.tsx            # Daily check-in modal
  workout/[id].tsx       # Active workout with timer
  plan/[id].tsx          # View/edit plan
  plan/create.tsx        # Create new plan
components/
  ui/                   # Primitives: Button, Card, Avatar, Badge, Toggle, TimePicker
  MemberPill.tsx        # Group member status
  StreakCard.tsx         # Streak display
  ExerciseRow.tsx       # Exercise in a plan
  CircularTimer.tsx     # Countdown timer ring
  WeeklyHeatmap.tsx     # 7-day group activity
lib/
  supabase.ts           # Supabase client init
  auth.ts               # Auth helpers
  notifications.ts      # Push notification registration + handlers
  types.ts              # Shared TypeScript types/interfaces
stores/                 # Zustand — one file per domain
  authStore.ts
  groupStore.ts
  checkinStore.ts
  workoutStore.ts
supabase/
  migrations/           # SQL migration files
  functions/            # Edge Functions (send-reminder, send-group-summary)
```

**Navigation:** Expo Router (file-based).  
**State:** Zustand for client state, React Query for server state.  
**Styling:** NativeWind (Tailwind for RN).  
**Testing:** Jest + React Native Testing Library.  
**Backend:** Supabase (Postgres + Auth + Edge Functions + Storage + Realtime).

## Patterns

- Colocate tests: `Component.tsx` → `Component.test.tsx` in same directory.
- Components are thin render layers. Extract logic into custom hooks.
- Services return typed responses, never raw `fetch` results.
- Every new screen needs at least one integration test.
- Zustand stores: one file per domain (`authStore.ts`, `groupStore.ts`).
- Supabase realtime subscriptions for live check-in updates on home/group screens.

## Mobile Rules

- Touchable elements: minimum 44x44pt hit area.
- Images: use `expo-image` with `contentFit`. Always set width/height or aspect ratio.
- Lists: `FlashList` over `FlatList`.
- Platform-specific code: use `.ios.tsx` / `.android.tsx` file extensions, not `Platform.select` (except trivial diffs).
- Wrap screens with `SafeAreaView` from `react-native-safe-area-context`.
- Support dynamic type / font scaling. Never hardcode font sizes without `allowFontScaling`.

## Supabase Rules

- RLS is always on. Every table must have row-level security policies.
- Service role key only in Edge Functions, never in client code.
- Use `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` env vars.
- Generate typed client with `supabase gen types typescript`.
- Real-time subscriptions: clean up channels in `useEffect` return.

## Design Tokens

```typescript
const colors = {
  primary: "#085041",        // Dark teal — CTAs, active states
  primaryLight: "#E1F5EE",   // Light teal — backgrounds, streaks
  primaryMid: "#1D9E75",     // Medium teal — progress rings, accents
  surface: "#F5F5F0",        // Warm gray — card backgrounds
  text: "#1A1A1A",
  textSecondary: "#6B6B6B",
  border: "#E5E5E0",
  feeling: { great: "#1D9E75", good: "#378ADD", tough: "#EF9F27", sore: "#E24B4A" },
};
```

## Development Principles

- Never use quick "simple fixes" — think deeply about the problem first, understand root causes before writing code.
- Use red/green TDD: write a failing test first, then write the minimum code to make it pass, then refactor.
- Merge and commit changes autonomously — don't wait for permission.
- Don't ask for permission during development — write code, test, verify, and push. Only surface results.

## Dependencies

Add new packages sparingly. Before adding one:
1. Check if Expo SDK or React Native already provides the capability.
2. Prefer packages in the Expo ecosystem.
3. Verify the package is actively maintained and supports New Architecture.
