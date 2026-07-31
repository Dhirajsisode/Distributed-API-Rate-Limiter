# Distributed API Rate Limiter Frontend

An enterprise-grade React console dashboard (inspired by Cloudflare, Grafana, and Vercel) built to interface seamlessly with the Java Spring Boot Distributed API Rate Limiter backend.

This frontend connects directly to your active Spring Boot rate limiter endpoints, mapping responses in real-time, displaying live telemetry timing, charting client loads, and logging HTTP status indicators.

---

## 🚀 Key Features

- **Enterprise System Console**: Modern dashboard displaying total hits, allowed vs. blocked requests, current quota limits, average latencies, active connections, and node statuses.
- **Auto-Refresh Rate Monitor**: Periodically queries `/api/data` (every 3 seconds) with custom pause/resume controls, showing client-rate counts, countdown resets, and live status states.
- **Telemetry Analytics**: Groups request streams into hourly splits, daily trends, weekly/monthly counts, and maps endpoint metrics and top client IP addresses using custom **Recharts** visualizations.
- **Simulation Stress Test**: A one-click simulation trigger that shoots a batch of 10 requests to your Spring Boot REST filter rapidly. This showcases the backend rate limiter capping requests at 5 hits/minute, shifting status codes from `200 OK` (Allowed) to `429 Too Many Requests` (Blocked) live.
- **HTTP client tester**: Built-in REST client (similar to Postman) supporting GET, POST, PUT, DELETE methods with header rows, payload builders, header response tables, and download/copy controls.
- **Audit Logs Table**: Full list of network logs with advanced search, column sorting, pagination, method/status filters, date filters, and custom CSV Export.
- **Glassmorphic UI Themes**: Beautiful dark/light mode designs with full local persistence.
- **Secure Auth Flow**: Protected dashboard paths guarded by standard React Router gates.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + Custom Glassmorphism System
- **Routing**: React Router DOM (v6)
- **Data Querying**: TanStack React Query (v5) + Axios
- **Animations**: Framer Motion
- **Visualizations**: Recharts
- **Form Validations**: React Hook Form + Zod
- **Alerts**: React Toastify + Lucide Icons

---

## ⚙️ Setup and Installation

### 1. Configure Environment Variables
Create a `.env` file in the root folder (or copy from `.env.example`):
```bash
VITE_API_URL=http://localhost:8080
```

### 2. Install Dependencies
Run the package installation:
```bash
npm install
```

### 3. Run Development Server
Start the development compiler (maps proxies to bypass local CORS errors):
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build Production Bundle
Compile the optimized distribution package (includes bundle split optimizations):
```bash
npm run build
```

### 5. Preview Production Build
Run local preview of the build outputs:
```bash
npm run preview
```

---

## 🔌 API Integration Architecture

The Spring Boot backend exposes a rate limiter on `GET /api/data` (which blocks IPs after 5 calls per minute). This frontend integrates with it directly:
- **Axios Telemetry**: The Axios client (`src/api/client.ts`) includes metadata interceptors that measure the precise roundtrip speed of every server request in milliseconds.
- **Request Log Store**: Every API request made (manual dashboard clicks, background polling, or custom client tests) is intercepted and logged into a persistent local database (`RateLimiterContext`).
- **Dynamic Metrics Engine**: The dashboard analytics, rates, and resets are calculated dynamically from the active window requests, aligning 100% with the backend's fixed window algorithm.
- **Development Proxy**: Vite is configured with a server proxy (`/api-proxy` -> `http://localhost:8080`) to automatically bypass browser CORS blocks when testing locally.

---

## ☁️ Deployment

This project is fully optimized for SPA client routing and can be deployed with zero code adjustments:
- **Vercel**: Pre-configured with `vercel.json` rewrite routing.
- **Netlify**: Pre-configured with `netlify.toml` redirect rules.
