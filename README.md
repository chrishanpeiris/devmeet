# DevMeet

A React Native mobile app for networking at tech events. Attendees create a profile, join an event by code, and swipe through other attendees to connect based on shared tech stack and interests.

## Tech Stack

| Layer        | Choice                                    |
|--------------|-------------------------------------------|
| Framework    | React Native, Expo SDK 56                 |
| Language     | TypeScript (strict)                       |
| Navigation   | React Navigation v6 (tabs, native stack)  |
| Animations   | Reanimated 3, Gesture Handler             |
| Backend      | Supabase (auth, database, realtime)       |
| Offline      | MMKV local storage                        |
| Styling      | StyleSheet with design tokens             |

## Features

1. **Onboarding**: 3-step profile setup, pick your tech stack tags and what you are looking for
2. **Events**: Browse upcoming events or join one by a short code
3. **Attendees**: Swipe cards to connect, mutual tech stack tags highlighted in teal
4. **Connections**: Saved connections, works fully offline via MMKV

## Getting started

```bash
npm install

# Add your Supabase credentials
cp .env.example .env
# Fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON

# Run on web
npx expo start --web

# Run on device (requires Expo Go)
npx expo start
```

## Demo event codes

| Code      | Event                     |
|-----------|---------------------------|
| `REACT26` | ReactConf London 2026     |
| `TS2026`  | TypeScript Meetup Berlin  |
| `DEVSF`   | DevConnect SF             |

## Project structure

```
src/
├── screens/
│   ├── onboarding/    # Profile setup flow
│   ├── events/        # Event list, join by code
│   ├── attendees/     # Swipe card deck
│   └── connections/   # Saved connections
├── components/
│   ├── cards/         # SwipeCard (Reanimated 3)
│   └── ui/            # Tag, Button
├── navigation/        # Tab and stack navigators
├── lib/               # Supabase client, API helpers, constants
├── store/             # MMKV offline storage
├── theme/             # Colours, spacing, typography tokens
└── types/             # Shared TypeScript types
```
