# PhishStats — Frontend

The web interface for PhishStats, a concert tracking app for Phish fans. Log the shows you've attended, browse setlists, and manage your chasing list — the songs you're hunting to finally hear live.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — dev server and build tool
- **Tailwind CSS v3** — utility-first styling with a centralized theme
- **React Router v6** — client-side routing
- **TanStack Query** — server state and API data fetching
- **Recharts** — charts and data visualization
- **lucide-react** — icons

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — stats overview, show map, chasing list preview, shows-per-year chart |
| `/shows` | Full concert attendance history, filterable by year |
| `/songs` | Phish discography with play counts, searchable |
| `/chasing` | Your chasing list — up to 5 songs you want to hear live, drag to reorder |

## Local Development

### Prerequisites

- Node 20+
- The [ps-backend](https://github.com/Phish-Stats/ps-backend) running locally (see its README)

### Setup

```bash
# Install dependencies
npm install

# Copy env file and configure
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:8000   # URL of the running backend
VITE_APP_NAME=PhishStats
```

### Run

```bash
npm run dev
```

App is available at [http://localhost:5173](http://localhost:5173).

### Other commands

```bash
npm run build      # Production build (output in /dist)
npm run preview    # Serve the production build locally
npm run lint       # ESLint
```

## Docker

### Standalone (frontend only)

```bash
cp .env.example .env   # edit VITE_API_URL to point at your backend
docker compose up --build
```

The app is served by nginx at [http://localhost:3000](http://localhost:3000).

> **Note:** Vite bakes `VITE_*` env vars into the bundle at build time. If you change `.env`, you need to rebuild the image (`docker compose up --build`).

### With the backend

If you're running the full stack via the backend's `docker-compose.yml`, you don't need this repo's compose file. Add the frontend as a service there instead, setting `VITE_API_URL` to the backend's internal service name (e.g. `http://backend:8000`).

## Theming

The primary color is defined once in `tailwind.config.js`:

```js
primary: {
  50:  '#fff7ed',
  // ...
  DEFAULT: '#f97316',   // ← change this to repaint the app
  500: '#f97316',
  600: '#ea580c',
  // ...
}
```

Dark/light mode is toggled via the sun/moon button in the nav. The preference is saved to `localStorage`.

## Project Structure

```
src/
├── components/       # Shared UI (Layout, nav)
├── context/          # ThemeContext
├── lib/
│   ├── api.ts        # Typed fetch wrapper — reads VITE_API_URL
│   └── mockData.ts   # Placeholder data (replaced by API calls over time)
├── pages/            # Route-level components
└── types/            # TypeScript interfaces matching the backend models
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Base URL of the ps-backend API (e.g. `http://localhost:8000`) |
| `VITE_APP_NAME` | No | App name shown in the browser tab (default: `PhishStats`) |
