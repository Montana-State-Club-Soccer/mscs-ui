# MSCS UI

Frontend application for the Montana State Club Soccer website. Built with React, Vite, and Tailwind CSS, using the shared MSCSS component library.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Components**: @montana-state-club-soccer/mscss (local library)
- **State**: React Context API

## Prerequisites

- Node.js 18+ and npm
- Running MSCS API (see `mscs-api` README)

## Setup

### 1. Install Dependencies

```bash
npm install
```

This installs the local MSCSS component library from `../MSCSS` automatically.

### 2. Environment Variables (Optional)

Create `.env.local` to customize the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

**Defaults:**
- API URL: `http://localhost:5000/api`
- Dev Server Port: `3000`

If the API is running on the default port, no env file is needed.

### 3. Start Development Server

```bash
npm run dev
```

App runs on `http://localhost:3000` and auto-opens in your browser.

## Running Both UI and API Together

### Option 1: VS Code Task (Recommended)

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run Task → `dev:ui+api`
3. Both servers start automatically

**Stop:** Terminal → Tasks: Terminate Task → `dev:ui+api`

### Option 2: Manual

**Terminal 1 (API):**
```bash
cd ../mscs-api
npm run dev
```

**Terminal 2 (UI):**
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
mscs-ui/
├── src/
│   ├── components/      # React components
│   │   ├── auth/        # Auth guards & protection
│   │   └── layout/      # Header, Footer, Layout
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components (routes)
│   ├── utils/           # API client & utilities
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── index.html           # HTML template
```

## Authentication

### Login Accounts (from seed)

- **Admin**: `admin@mscs.com` / `admin123`
- **Player**: `player@mscs.com` / `player123`

### Protected Routes

Routes are protected by role:
- `/login` - Public
- `/` - Public (home)
- `/roster` - Authenticated users
- `/schedule` - Authenticated users
- `/results` - Authenticated users
- Admin-only routes use `<RoleGuard role="admin">`

### Using Auth in Components

```jsx
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  
  if (!isAuthenticated) return <Navigate to="/login" />
  
  return <div>Welcome, {user.name}</div>
}
```

## API Integration

### Using API Utilities

```jsx
import { getRoster, getSchedule, getResults } from '../utils/api'

// In your component:
const roster = await getRoster()
const schedule = await getSchedule()
```

**Available functions:**
- `getRoster()`, `createPlayer(data)`, `updatePlayer(id, data)`, `deletePlayer(id)`
- `getSchedule()`, `createGame(data)`, `updateGame(id, data)`, `deleteGame(id)`
- `getResults()`, `createResult(data)`, `updateResult(id, data)`, `deleteResult(id)`
- `getHighlights()`, `createHighlight(data)`, `updateHighlight(id, data)`, `deleteHighlight(id)`

Auth tokens are automatically included in requests.

## Using the MSCSS Component Library

The library is locally linked from `../MSCSS`:

```jsx
import { Button, Card, Input, Badge } from '@montana-state-club-soccer/mscss'

function MyPage() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
      <Badge color="blue">New</Badge>
    </Card>
  )
}
```

**Developing the library:**
1. Make changes in `../MSCSS/src/components`
2. Build: `cd ../MSCSS && npm run build`
3. UI auto-updates (Vite HMR)

## Troubleshooting

**API connection fails:**
- Ensure API is running on port 5000
- Check `VITE_API_URL` in `.env.local` (if set)
- Verify network tab shows requests to `http://localhost:5000/api`

**Component library not found:**
- Run `npm install` to reinstall local link
- Check `../MSCSS` exists and has `dist/` folder
- Rebuild library: `cd ../MSCSS && npm run build`

**Port 3000 already in use:**
- Vite will auto-pick 3001, 3002, etc.
- Or change port in `vite.config.js`: `server: { port: 3333 }`

**Login fails:**
- Verify API is running and seeded
- Clear browser localStorage (F12 → Application → Local Storage → Clear)
- Check Network tab for 400/401 errors from `/api/auth/login`
