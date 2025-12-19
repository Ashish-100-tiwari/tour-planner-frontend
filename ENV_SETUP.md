# Environment Variables Setup

This document explains how to set up environment variables for the Tour Planner AI frontend application.

## Quick Start

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` as needed for your environment.

## Environment Variables

### Required Variables

- **NEXT_PUBLIC_API_URL**: The base URL for the backend API
  - Default: `http://localhost:8000`
  - Production: Update to your production API URL (e.g., `https://api.yourapp.com`)

### Optional Variables

- **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**: Google Maps API key (if using maps features)
- **NEXT_PUBLIC_ANALYTICS_ID**: Analytics tracking ID

## Important Notes

- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to version control (it's in `.gitignore`)
- The `.env.example` file should be committed to help other developers
- After changing environment variables, restart the development server

## Development vs Production

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

## Restart Required

After modifying `.env.local`, you must restart the Next.js development server:

```bash
npm run dev
```
