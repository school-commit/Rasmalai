# Rasmalai AI

A React + Vite + Capacitor Android AI chat app. The existing UI is preserved; the AI is now named **Rasmalai**.

## API

The app keeps using the existing Cloudflare Worker URL:

`https://jyoti-ai-api.aditya543maurya.workers.dev/`

The Gemini API key stays inside the Worker as `GEMINI_API_KEY`. The frontend never contains the key.

## First launch

After the 3-second splash, Rasmalai asks once for:
- name
- nickname
- gender (Male/Female)

The profile is saved in device `localStorage`, so it is not asked again on normal app launches.

## Android build

GitHub Actions workflow: `.github/workflows/build-android.yml`

It builds a debug APK automatically on pushes to `main` and can also be run manually. The artifact is named `Rasmalai-APK`.

The Android application id remains `com.aditya.jyoti` so the renamed app can update the previous Jyoti installation instead of being treated as a different package.

## Worker update

`cloudflare-worker/worker.js` is included for the matching backend contract. Deploy this code to the existing `jyoti-ai-api` Worker while keeping the existing Worker URL and `GEMINI_API_KEY` secret.
