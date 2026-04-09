# Server URL Reference

## Quick URLs

### Local Development
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000/api/ws
- **Command**: `npm run dev`

### API Endpoints
All endpoints are available at `{API_BASE_URL}{ENDPOINT}`:

| Method | Endpoint | URL |
|--------|----------|-----|
| GET | `/api/health` | `http://localhost:3000/api/health` |
| GET | `/api/transactions` | `http://localhost:3000/api/transactions` |
| POST | `/api/fraud-explanation` | `http://localhost:3000/api/fraud-explanation` |
| POST | `/api/chat` | `http://localhost:3000/api/chat` |
| WS | `/api/ws` | `ws://localhost:3000/api/ws` |

### Configuration Hierarchy

```
1. Environment Variables (Highest Priority)
   VITE_API_URL=https://api.example.com
   VITE_WS_URL=wss://api.example.com

2. Auto-Detection (Fallback)
   Uses window.location.{protocol, hostname, port}
   ↓
   http://localhost:3000
   ws://localhost:3000
```

## Scenario Guide

### Scenario 1: Full-Stack on Localhost
```bash
# Both frontend and backend on same host
# Start: npm run dev

Configuration Used:
├─ API Base: http://localhost:3000
├─ WebSocket: ws://localhost:3000
└─ Status: Auto-detected ✓
```

### Scenario 2: Backend on Different Port
```bash
# Frontend: http://localhost:5173 (Vite)
# Backend: http://localhost:3001

Environment:
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

Start:
VITE_API_URL=http://localhost:3001 \
VITE_WS_URL=ws://localhost:3001 \
npm run dev
```

### Scenario 3: Remote Backend
```bash
# Frontend: https://app.sentinel.com (built)
# Backend: https://api.sentinel.com (separate server)

Build with env vars:
VITE_API_URL=https://api.sentinel.com \
VITE_WS_URL=wss://api.sentinel.com \
npm run build

Deploy dist folder to frontend server
```

### Scenario 4: Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:3000"
    environment:
      VITE_API_URL: http://backend:3000
      VITE_WS_URL: ws://backend:3000
  backend:
    image: node:18
    working_dir: /app
    command: npm run dev
    volumes:
      - .:/app
    ports:
      - "3000:3000"
```

## URL Detection Logic

```typescript
// getCurrentUrl() logic
const hostname = window.location.hostname  // "localhost", "example.com", etc.
const port = window.location.port          // "3000", "5173", "80", "" (default), etc.
const protocol = window.location.protocol  // "http:", "https:"
const wsProtocol = protocol === "https:" ? "wss:" : "ws:"

// Build URLs
if (VITE_API_URL env var exists) {
  Use VITE_API_URL and VITE_WS_URL
} else {
  apiBase = `${protocol}//${hostname}${port ? `:${port}` : ''}`
  wsBase = `${wsProtocol}//${hostname}${port ? `:${port}` : ''}`
}
```

## Testing URLs

### Test Health Check
```bash
# Development
curl http://localhost:3000/api/health

# Production
curl https://api.example.com/api/health
```

### Test WebSocket
```javascript
// Browser console
const ws = new WebSocket('ws://localhost:3000/api/ws');
ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => console.log('Message:', event.data);
ws.onerror = (error) => console.error('Error:', error);
```

### Test API Fetch
```javascript
// Browser console
import { checkServerHealth } from '@/services/api';
checkServerHealth().then(() => console.log('Backend OK'));
```

## Common URLs

### Local Machine
```
Frontend:  http://localhost:5173
Backend:   http://localhost:3000
API:       http://localhost:3000/api/*
WebSocket: ws://localhost:3000/api/ws
```

### Self-Hosted
```
Frontend:  https://sentinel.mycompany.com
Backend:   https://sentinel-api.mycompany.com
API:       https://sentinel-api.mycompany.com/api/*
WebSocket: wss://sentinel-api.mycompany.com/api/ws
```

### AWS
```
Frontend:  https://d123abc.cloudfront.net
Backend:   https://api.abc123.execute-api.us-east-1.amazonaws.com
API:       https://api.abc123.execute-api.us-east-1.amazonaws.com/api/*
WebSocket: wss://api.abc123.execute-api.us-east-1.amazonaws.com/api/ws
```

### Azure
```
Frontend:  https://sentinel-app.azurestaticapps.net
Backend:   https://sentinel-backend.azurewebsites.net
API:       https://sentinel-backend.azurewebsites.net/api/*
WebSocket: wss://sentinel-backend.azurewebsites.net/api/ws
```

## Environment Variable Examples

### Development (.env.development)
```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Staging (.env.staging)
```
VITE_API_URL=https://api-staging.sentinel.com
VITE_WS_URL=wss://api-staging.sentinel.com
```

### Production (.env.production)
```
VITE_API_URL=https://api.sentinel.com
VITE_WS_URL=wss://api.sentinel.com
```

## Port Reference

| Service | Default Port | Configurable |
|---------|--------------|--------------|
| Frontend (Vite) | 5173 | Yes (vite.config.ts) |
| Backend (Express) | 3000 | Yes (server.ts) |
| WebSocket | Same as Backend | Yes |

## SSL/TLS

When using HTTPS:
- REST API: Use `https://`
- WebSocket: Use `wss://` (not `wss://` on http origin)
- Certificates: Required for production

```typescript
// Auto-detected
protocol = "https:" → API = "https://api.com"
protocol = "https:" → WS = "wss://api.com"
```

## DNS/Domain

Ensure your DNS is configured correctly:
- Frontend domain points to frontend server IP
- Backend domain points to backend server IP
- Same domain can work with path-based routing (e.g., api.com/api vs api.com)

```bash
# Example DNS records
A record: app.sentinel.com → 192.0.2.1 (frontend)
A record: api.sentinel.com → 192.0.2.2 (backend)
```

## Summary

✅ Development: Auto-detects localhost:3000
✅ Production: Use environment variables
✅ Build time: Set VITE_API_URL and VITE_WS_URL
✅ Runtime: Uses getApiConfig() to determine URLs
✅ Flexible: Supports any network architecture
