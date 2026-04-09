# Server URL Integration Summary

## What Was Created

### 1. API Configuration Module (`src/config/api.ts`)
Centralized configuration for all backend URL management with:
- **Auto-detection**: Automatically detects protocol, hostname, and port
- **Environment variables**: Support for `VITE_API_URL` and `VITE_WS_URL`
- **Helper functions**:
  - `getApiConfig()` - Get full configuration
  - `getApiUrl(endpoint)` - Generate API URLs
  - `getWebSocketUrl(path)` - Generate WebSocket URLs
  - `apiFetch(endpoint, options)` - Make API calls with error handling

### 2. API Service Layer (`src/services/api.ts`)
High-level API methods using the configuration:
- `fetchTransactions()` - Get transaction list
- `analyzeFraud(transaction)` - Run AI fraud analysis
- `chatWithAI(query, context)` - Send message to AI
- `checkServerHealth()` - Verify backend connectivity

### 3. Updated App.tsx
Integrated dynamic URL generation:
- Imports configuration functions
- Uses `getApiUrl()` for REST API calls
- Uses `getWebSocketUrl()` for WebSocket connections
- Logs connection information for debugging

### 4. Environment Configuration
- **`.env.development`** - Development URLs
- **`.env.production.example`** - Production template
- **Documentation** - Detailed configuration guide

## Architecture

```
Frontend Application
├── Build Config (Vite)
├── Environment Variables
│   ├── VITE_API_URL
│   └── VITE_WS_URL
└── Runtime Configuration
    ├── src/config/api.ts
    │   ├── Auto-detection
    │   └── Environment override
    └── src/services/api.ts
        └── HTTP + WebSocket calls
            └── Backend Server (Express)
                ├── REST API (/api/*)
                └── WebSocket (/api/ws)
```

## How URLs Are Generated

### Development (localhost)
```
Browser: http://localhost:3000
  ↓
App.tsx uses getApiUrl()
  ↓
Config auto-detects: http://localhost:3000
  ↓
API calls: http://localhost:3000/api/transactions
WebSocket: ws://localhost:3000/api/ws
```

### Production (separate servers)
```
Browser: https://app.example.com
  ↓
Environment: VITE_API_URL="https://api.example.com"
  ↓
Config uses env vars
  ↓
API calls: https://api.example.com/api/transactions
WebSocket: wss://api.example.com/api/ws
```

## Usage Examples

### In Components
```typescript
import { getApiUrl, getWebSocketUrl } from '@/config/api';
import { fetchTransactions, analyzeFraud } from '@/services/api';

// Use service layer (recommended)
const transactions = await fetchTransactions();

// Or direct URL generation
const url = getApiUrl('/api/transactions');
const response = await fetch(url);
```

### Environment Setup
```bash
# Development (auto-detection)
npm run dev

# Production with custom backend
VITE_API_URL="https://api.sentinel.com" \
VITE_WS_URL="wss://api.sentinel.com" \
npm run build
```

## File Structure
```
sentinel-fraud-detection/
├── src/
│   ├── config/
│   │   └── api.ts                 ← URL configuration
│   ├── services/
│   │   ├── api.ts                 ← Service layer
│   │   └── geminiService.ts
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   └── App.tsx                    ← Updated to use new config
├── docs/
│   └── BACKEND_URL_CONFIG.md      ← Detailed guide
├── .env.development               ← Dev URLs
├── .env.production.example        ← Production template
└── server.ts                      ← Backend Express server
```

## Key Features

✅ **Zero-Config Development** - Works out of the box with auto-detection
✅ **Production Ready** - Environment variables for deployment
✅ **Type Safe** - Full TypeScript support
✅ **Error Handling** - Built-in fetch error handling
✅ **Debugging** - Console logs for connection info
✅ **Flexible** - Support for local, remote, and hybrid setups
✅ **Scalable** - Easy to extend with more services

## Deployment Examples

### Docker Compose (Same Host)
```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: "http://backend:3000"
      VITE_WS_URL: "ws://backend:3000"
  backend:
    image: node:18
    command: npm run dev
    ports:
      - "3000:3000"
```

### Separate Cloud Deployments
```bash
# AWS S3 + API Gateway
VITE_API_URL="https://api.gateway.aws.com" \
VITE_WS_URL="wss://api.gateway.aws.com" \
npm run build

# Azure App Service
VITE_API_URL="https://backend.azurewebsites.net" \
VITE_WS_URL="wss://backend.azurewebsites.net" \
npm run build
```

## Debugging

Check browser console for:
```
API Configuration: {
  apiBaseUrl: "http://localhost:3000",
  wsUrl: "ws://localhost:3000",
  isProduction: false,
  hostname: "localhost",
  port: "3000",
  protocol: "http:"
}

Connecting to backend at: http://localhost:3000
Connecting WebSocket to: ws://localhost:3000/api/ws
```

## Next Steps

1. ✅ Test with `npm run dev`
2. ✅ Verify "Connected" status in header
3. ✅ Test API calls in console: `import { checkServerHealth } from '@/services/api'; checkServerHealth()`
4. ✅ Deploy with environment variables as needed

For more details, see [Backend URL Configuration Guide](./docs/BACKEND_URL_CONFIG.md)
