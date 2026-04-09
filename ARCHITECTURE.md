# Sentinel URL Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SENTINEL FRAUD DETECTION SYSTEM                     │
└─────────────────────────────────────────────────────────────────────────┘

                            FRONTEND (React/Vite)
                    ┌──────────────────────────────────┐
                    │         App.tsx                  │
                    │  - Login State                   │
                    │  - WebSocket Management          │
                    │  - API Integration               │
                    └────────────┬─────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
    ┌──────────────┐    ┌──────────────────┐   ┌──────────────┐
    │  Dashboard   │    │  RiskAnalysis    │   │   AIChat     │
    │  Component   │    │   Component      │   │  Component   │
    └──────────────┘    └──────────────────┘   └──────────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   API Service Layer     │
                    │  (src/services/api.ts)  │
                    │ - fetchTransactions()   │
                    │ - analyzeFraud()        │
                    │ - chatWithAI()          │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────────────┐
                    │  URL Configuration Module       │
                    │  (src/config/api.ts)            │
                    │                                 │
                    │  Priority:                      │
                    │  1. VITE_API_URL env var       │
                    │  2. Auto-detect from location  │
                    │                                 │
                    │  Returns:                       │
                    │  - apiBaseUrl                   │
                    │  - wsUrl                        │
                    │  - isProduction                 │
                    └────────────┬────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
    │  HTTP Call   │    │ WebSocket    │    │  Environment     │
    │ Fetch API    │    │  Connection  │    │  Variables       │
    └──────────────┘    └──────────────┘    └──────────────────┘
          │                      │                      │
          │ API_URL              │ WS_URL               │
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Backend Server        │
                    │   (server.ts)           │
                    │                         │
                    │  Port: 3000             │
                    │  Express + WebSocket    │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  REST API    │    │ WebSocket    │    │  Gemini AI   │
    │ /api/health  │    │ /api/ws      │    │  Service     │
    │ /api/tx      │    │ Real-time    │    │ Analysis     │
    │ /api/fraud   │    │ Feeds        │    └──────────────┘
    │ /api/chat    │    │              │
    └──────────────┘    └──────────────┘
```

## URL Resolution Flow

```
┌─────────────────────────────────────────────┐
│  Application Starts                         │
│  App.tsx loads                              │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         ┌──────────────────────┐
         │  getApiConfig()      │
         │  called from:        │
         │  useEffect()         │
         │  Component render    │
         └──────────────┬───────┘
                        │
         ┌──────────────▼──────────────┐
         │  Check Code Path:           │
         │  1. env VITE_API_URL set?   │
         └──────────────┬──────────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
        YES             NO            │
          │             │             │
          ▼             ▼             │
    ┌─────────┐   ┌─────────────────┐│
    │ Use env │   │ Auto-detect     ││
    │ var     │   │ window.location ││
    └─────────┘   └────────┬────────┘│
          │                │         │
          │                ▼         │
          │        ┌─────────────────┐
          │        │ get hostname    │
          │        │ get port        │
          │        │ get protocol    │
          │        │ build URLs      │
          │        └────────┬────────┘
          │                 │
          └────────┬────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │  return {                    │
    │    apiBaseUrl,               │
    │    wsUrl,                    │
    │    isProduction              │
    │  }                           │
    └──────────────┬───────────────┘
                   │
          ┌────────▼────────┐
          │   Use URLs in   │
          │ - fetch()       │
          │ - WebSocket()   │
          │ - Components    │
          └─────────────────┘
```

## Development Environment

```
┌──────────────────────────────┐
│   Development Machine        │
│                              │
│  npm run dev                 │
│        │                     │
│        ├─ Frontend (Vite)    │
│        │  localhost:5173     │
│        │                     │
│        └─ Backend (Express)  │
│           localhost:3000     │
│                              │
│  Configuration:              │
│  ✓ Auto-detected             │
│  ✓ No setup needed           │
│  ✓ Works immediately         │
└──────────────────────────────┘
                │
                │ HTTP requests
                │ WebSocket (ws://)
                │
                ▼
        Both on localhost
```

## Production Environment (Separate Servers)

```
┌──────────────────────────────┐        ┌──────────────────────────────┐
│   Frontend Server            │        │   Backend Server             │
│   (CDN/Static Host)          │        │   (API Server)               │
│                              │        │                              │
│   app.example.com            │        │   api.example.com            │
│   - React build files        │        │   - Express.js               │
│   - Vite dist/               │        │   - WebSocket                │
│                              │        │   - REST API                 │
│                              │        │                              │
│   VITE_API_URL=              │        │   Listening on               │
│   https://api.example.com    │        │   port 3000                  │
│                              │        │                              │
│   VITE_WS_URL=               │        │   CORS enabled               │
│   wss://api.example.com      │        │                              │
└──────────┬───────────────────┘        └──────────────┬───────────────┘
           │                                           │
           │        HTTPS requests                    │
           ├──────────────────────────────────────────┤
           │                                           │
           │        WSS (WebSocket Secure)            │
           └──────────────────────────────────────────┤
```

## File Structure

```
sentinel-fraud-detection/
├── src/
│   ├── config/
│   │   └── api.ts                  ◄── URL Configuration
│   │       ├── getApiConfig()
│   │       ├── getApiUrl()
│   │       ├── getWebSocketUrl()
│   │       └── apiFetch()
│   │
│   ├── services/
│   │   ├── api.ts                  ◄── API Service Layer
│   │   │   ├── fetchTransactions()
│   │   │   ├── analyzeFraud()
│   │   │   ├── chatWithAI()
│   │   │   └── checkServerHealth()
│   │   └── geminiService.ts
│   │
│   ├── components/
│   │   ├── App.tsx                 ◄── Updated to use URLs
│   │   │   ├── useEffect: fetch(getApiUrl(...))
│   │   │   └── WebSocket: getWebSocketUrl(...)
│   │   ├── Dashboard.tsx
│   │   ├── RiskAnalysis.tsx
│   │   ├── AIChat.tsx
│   │   └── Login.tsx
│   │
│   └── types.ts
│
├── docs/
│   ├── BACKEND_URL_CONFIG.md       ◄── Configuration Guide
│   ├── SERVER_URL_SETUP.md         ◄── Setup Summary
│   ├── URL_REFERENCE.md            ◄── URL Examples
│   └── ...
│
├── .env.development                ◄── Dev Config
│   VITE_API_URL=http://localhost:3000
│
├── .env.production.example         ◄── Prod Template
│   VITE_API_URL=https://api.example.com
│
├── test-urls.sh                    ◄── Test Script (Linux/Mac)
├── test-urls.bat                   ◄── Test Script (Windows)
├── SETUP_COMPLETE.md               ◄── Summary
├── server.ts                       ◄── Backend Server
├── package.json
└── README.md
```

## Configuration Cascade

```
           Environment Setup
                  │
        ┌─────────▼─────────┐
        │ Check ENV vars    │
        │ VITE_API_URL?     │
        │ VITE_WS_URL?      │
        └────────┬──────────┘
                 │
        ┌────────▼──────────────────┐
        │ IF set: Use env vars      │
        │ IF not: Auto-detect       │
        └────────┬──────────────────┘
                 │
        ╔════════▼═══════════════════╗
        ║ Return Configuration       ║
        ║ {                          ║
        ║   apiBaseUrl,              ║
        ║   wsUrl,                   ║
        ║   isProduction             ║
        ║ }                          ║
        ╚════════╤═══════════════════╝
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
  REST         WebSocket    Components
  Calls        Connections  Configuration
    │            │            │
    └────────────┼────────────┘
                 │
            ┌────▼────┐
            │ Backend  │
            │ Server   │
            └──────────┘
```

## URL Generation Examples

```
┌─────────────────────────────────────────┐
│  getApiUrl('/api/transactions')         │
├─────────────────────────────────────────┤
│  Development (auto-detected):           │
│  http://localhost:3000/api/transactions │
├─────────────────────────────────────────┤
│  Production (env var):                  │
│  https://api.example.com/api/transactions│
├─────────────────────────────────────────┤
│  Custom Port:                           │
│  http://api.company.local:8000/api/tx  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  getWebSocketUrl('/api/ws')             │
├─────────────────────────────────────────┤
│  Development (auto-detected):           │
│  ws://localhost:3000/api/ws             │
├─────────────────────────────────────────┤
│  Production (env var):                  │
│  wss://api.example.com/api/ws          │
├─────────────────────────────────────────┤
│  Custom Port:                           │
│  ws://api.company.local:8000/api/ws    │
└─────────────────────────────────────────┘
```

## Summary

✅ **Flexible URL Generation** - Adapts to any environment
✅ **Auto-Detection** - Works out-of-box in development
✅ **Configuration Priority** - Env vars override auto-detection
✅ **Type-Safe** - Full TypeScript support
✅ **Centralized Management** - Single source of truth
✅ **Easy Debugging** - Logs configuration at startup
✅ **Scalable Deployment** - Works with any backend location
