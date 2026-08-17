# Word of Mouth Streaming

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Project-3ECF8E?logo=supabase)](https://supabase.com/)
[![Mux](https://img.shields.io/badge/Mux-Video-FF2D55?logo=mux)](https://www.mux.com/)

Word of Mouth Streaming is a creator-first streaming platform prototype for independent artists, local culture, and premium streaming experiences. The app combines a cinematic homepage, dynamic show pages, artist portal entry points, and Mux-powered video playback with Supabase-backed content lookups.

## Features

- Cinematic Word of Mouth branded homepage
- Dynamic show detail pages using slug-based routing
- Mux video player integration for on-demand playback
- Supabase-ready data layer with graceful local fallbacks
- Artist Hub and streaming plan sections
- Vercel-ready Next.js setup

## Tech Stack

- Next.js 16
- React 19
- Supabase
- Mux Player
- Vercel-ready app structure

## Local Development

```bash
npm install
npm run dev -- --port 3000
```

Then open:

- http://localhost:3000

## Production Build

```bash
npm run build
```

## Project Structure

```text
app/
  page.tsx
  shows/[id]/page.js
  artist/
  live/
lib/
  supabase.ts
supabase/
  schema.sql
  seed-shows.sql
  additional-rules.sql
```

## Deployment

This project is configured for deployment on Vercel and is designed to work with Supabase environment variables for live content.

## License

This project is for demo and development purposes.
