# MSCS UI
## Contributors:
### Seth Keirn and Landon Farrar

Frontend application for the **Montana State Club Soccer** website.  
Built with **React**, **Vite**, and **Tailwind CSS**, using the shared **MSCSS component library**.

---

## 🚀 Tech Stack

- **Framework:** React 18  
- **Build Tool:** Vite  
- **Styling:** Tailwind CSS  
- **Routing:** React Router v6  
- **Components:** `@montana-state-club-soccer/mscss` (local library)  
- **State Management:** React Context API  

---

## 📦 Prerequisites

- Node.js **18+**
- Running **MSCS API** (see the `mscs-api` README)

---

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
````

This automatically installs the local MSCSS component library from `../MSCSS`.

---

### 2. Environment Variables (Optional)

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

**Defaults:**

* API URL: `http://localhost:5000/api`
* Dev Server Port: `3000`

If using default API settings, an env file is not required.

---

### 3. Start Development Server

```bash
npm run dev
```

The app runs at **[http://localhost:3000](http://localhost:3000)** and auto-opens in your browser.

---

## 🔄 Running UI + API Together

### **Option 1: VS Code Task (Recommended)**

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Select: **Run Task → `dev:ui+api`**

**To stop:**
Terminal → *Tasks: Terminate Task* → `dev:ui+api`

---

### **Option 2: Manual Start**

**Terminal 1 (API):**

```bash
cd ../mscs-api
npm run dev
```

**Terminal 2 (UI):**

```bash
npm run dev
```

---

## 📜 Available Scripts

| Script            | Description               |
| ----------------- | ------------------------- |
| `npm run dev`     | Start dev server with HMR |
| `npm run build`   | Build for production      |
| `npm run preview` | Preview production build  |
| `npm run lint`    | Run ESLint                |

---

## 📁 Project Structure

```
mscs-ui/
├── src/
│   ├── components/      # React components
│   │   ├── auth/        # Auth guards & route protection
│   │   └── layout/      # Header, Footer, Layout
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Route-level pages
│   ├── utils/           # API client & utilities
│   ├── App.jsx          # Root component
│   └── main.jsx         # App entry point
├── public/              # Static assets
└── index.html           # HTML template
```

---

## 🔐 Authentication

### Seed Login Accounts

* **Admin:** `admin@mscs.com` / `admin123`
* **Player:** `player@mscs.com` / `player123`

---

### Protected Routes

| Route          | Access                               |
| -------------- | ------------------------------------ |
| `/login`       | Public                               |
| `/`            | Public                               |
| `/roster`      | Authenticated                        |
| `/schedule`    | Authenticated                        |
| `/results`     | Authenticated                        |
| *Admin routes* | Require `<RoleGuard role="admin" />` |

---

### Using Auth in Components

```jsx
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  
  if (!isAuthenticated) return <Navigate to="/login" />
  
  return <div>Welcome, {user.name}</div>
}
```

---

## 🌐 API Integration

### Using API Utilities

```jsx
import { getRoster, getSchedule, getResults } from '../utils/api'

// Example:
const roster = await getRoster()
const schedule = await getSchedule()
```

### Available Functions

**Players:**
`getRoster()`, `createPlayer()`, `updatePlayer()`, `deletePlayer()`

**Schedule/Games:**
`getSchedule()`, `createGame()`, `updateGame()`, `deleteGame()`

**Results:**
`getResults()`, `createResult()`, `updateResult()`, `deleteResult()`

**Highlights:**
`getHighlights()`, `createHighlight()`, `updateHighlight()`, `deleteHighlight()`

Auth tokens are automatically included in all requests.

---

## 🎨 Using the MSCSS Component Library

Imported from the local package in `../MSCSS`:

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

### Developing the Component Library

1. Edit components in `../MSCSS/src/components`
2. Rebuild:

   ```bash
   cd ../MSCSS
   npm run build
   ```
3. UI updates automatically via Vite HMR.

---

## 🧰 Troubleshooting

### API Connection Fails

* Verify API is running on **port 5000**
* Check `VITE_API_URL` in `.env.local`
* Inspect browser Network tab for failed `/api` calls

---

### Component Library Issues

* Reinstall dependencies: `npm install`
* Ensure `../MSCSS` exists and contains `dist/`
* Rebuild:

  ```bash
  cd ../MSCSS && npm run build
  ```

---

### Port 3000 in Use

* Vite auto-increments to 3001, 3002, etc.
* Or set manually in `vite.config.js`:

```js
server: { port: 3333 }
```

---

### Login Fails

* Ensure API is seeded and running
* Clear Local Storage (DevTools → Application → Local Storage)
* Check Network tab for 400/401 errors

