Student No: 9221118096
Name: Ibrahim Ali MOHAMMED

# NOKTA Submission — Startup Pitch Tester

Track: B — Slop Detector (paste a pitch paragraph → AI tests the market claims → returns a Slop Score + justification)

## Project Summary

Startup Pitch Tester lets users paste a startup pitch and get a Slop Score (1–100) with a brief justification. It is designed to highlight hype, buzzwords, and unrealistic market claims, and to make the AI's verdict fast to read and easy to trust.

## Links

- Expo QR / preview link: `exp://192.168.100.32:8081`
- Expo / EAS build: https://expo.dev/accounts/ibrahimalicode/projects/app/builds/426245d1-1a81-4d73-ad5c-d7b9058e196f
- 60s demo video: https://youtu.be/4BN5iT95QJo
- PR: https://github.com/seyyah/nokta/pull/88
- APK: `app-release.apk` (in this folder)

## Decision Log

- Chose Track B (Slop Detector) to focus on market-claim critique and the readability of AI feedback.
- Used Expo + React Native for fast iteration and easy demo sharing.
- Designed a premium, minimal UI so the analysis feels credible and is easy to scan.
- Used Gemini (`gemini-2.5-flash`) with a strict `SLOP SCORE` / `JUSTIFICATION` response format so the output parses cleanly into the score + reasoning UI.
- Guarded the edges: empty/whitespace pitches send no request, long pitches stay scrollable, and API errors surface a clear message instead of a blank screen.

## Setup

1. Install dependencies: `npm install`
2. Add your Gemini key to `app/.env` as `EXPO_PUBLIC_API_KEY=...`
3. Run: `npx expo start`

## Submission Checklist

- README.md — track, links, decision log
- idea.md — track-specific idea
- app/ — Expo project
- app-release.apk — release build
