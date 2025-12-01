# mscs-ui

Frontend UI for the Montana State Club Soccer website. Built with React, Vite, and Tailwind, using the shared MSCS component library. Displays schedules, rosters, results, and club info using data from the MSCS API.

## Project Structure

This is one of three repositories:
- **mscs-ui** (this repo) - Frontend application
- **mscs-library** - Shared component library (Tailwind + Vite + npm)
- **mscs-api** - Backend API

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install the MSCS Component Library

The library is published on npm:

```bash
npm install @montana-state-club-soccer/mscss
```

For local development of the library, you can link it:

```bash
# In your mscs-library directory:
npm link

# Back in this mscs-ui directory:
npm link @montana-state-club-soccer/mscss
```

### 3. Configure Environment Variables

Copy the example env file and update with your API URL:

```bash
cp .env.example .env.local
```

Edit `.env.local` to set your API endpoint.

### 4. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Using Your Custom Library

Import components from your library in your components:

```jsx
import { Button, Card } from '@montana-state-club-soccer/mscss'
import '@montana-state-club-soccer/mscss/dist/styles.css'
```

## Connecting to the API

The API utilities are in `src/utils/api.js`. Example usage:

```jsx
import { getSchedule, getRoster } from './utils/api'

// In your component:
const schedule = await getSchedule()
```

## Development Workflow

1. Develop shared components in `mscs-library`
2. Build the library: `npm run build` (in library repo)
3. Changes automatically reflect here if linked with `npm link`
4. Use the API endpoints from `mscs-api` for data
