# Backend URL Configuration Guide

## Overview

The Sentinel application uses a flexible URL configuration system that supports:
- **Development**: Auto-detects localhost server
- **Production**: Uses environment variables for custom URLs
- **Environment-based**: Different URLs for different deployment environments

## Configuration Files

### `.env.development`
Development environment configuration (auto-loaded by Vite):
```
VITE_API_URL="http://localhost:3000"
VITE_WS_URL="ws://localhost:3000"
```

### `.env.production`
Production environment configuration:
```
VITE_API_URL="https://api.sentinel.example.com"
VITE_WS_URL="wss://api.sentinel.example.com"
```

## How URLs Are Resolved

### Priority Order:
1. **Environment Variables** (if set)
   - `VITE_API_URL` - REST API base URL
   - `VITE_WS_URL` - WebSocket base URL

2. **Auto-Detection** (fallback)
   - Uses `window.location` to automatically detect:
     - Protocol (http/https)
     - Hostname (localhost, example.com)
     - Port (3000, 8080, etc.)
   - Automatically converts to WebSocket protocol (ws/wss)

## Usage in Components

### Using API Configuration
```typescript
import { getApiConfig, getApiUrl, getWebSocketUrl } from '@/config/api';

// Get configuration
const config = getApiConfig();
console.log(config.apiBaseUrl); // "http://localhost:3000"
console.log(config.wsUrl);      // "ws://localhost:3000"

// Generate full API URLs
const transactionsUrl = getApiUrl('/api/transactions');
// → "http://localhost:3000/api/transactions"

// Get WebSocket URL
const wsUrl = getWebSocketUrl('/api/ws');
// → "ws://localhost:3000/api/ws"
```

### Using API Services
```typescript
import { fetchTransactions, analyzeFraud, chatWithAI } from '@/services/api';

// Automatically uses correct base URL
const transactions = await fetchTransactions();
const analysis = await analyzeFraud(transaction);
const chatResponse = await chatWithAI('What are the fraud risks?');
```

## Development Workflow

### Local Development
```bash
# Backend runs on localhost:3000
npm run dev

# Frontend auto-detects backend at http://localhost:3000
# Opens in browser at http://localhost:5173
# All API calls automatically route to http://localhost:3000
```

### Backend on Different Port
```bash
# If backend runs on port 3001:
VITE_API_URL="http://localhost:3001" \
VITE_WS_URL="ws://localhost:3001" \
npm run dev
```

### Backend on Remote Server
```bash
# Deploy frontend to https://app.sentinel.com
# Backend runs on https://api.sentinel.com

# .env.production:
VITE_API_URL="https://api.sentinel.com"
VITE_WS_URL="wss://api.sentinel.com"

# Build and deploy
npm run build
```

## Network Architecture

### Single Server (Development)
```
Frontend + Backend on same host:port
┌─────────────────────────┐
│  http://localhost:3000  │
├─────────────────────────┤
│ Frontend (Vite)         │
│ + Backend (Express)     │
│ + WebSocket             │
└─────────────────────────┘
```

### Separate Servers (Production)
```
Frontend and Backend on different hosts
┌──────────────────────┐         ┌─────────────────────┐
│ https://app.example  │◄────────┤ https://api.example │
├──────────────────────┤         ├─────────────────────┤
│ Frontend (React/TSX) │         │ Backend (Express)   │
│ Built files (HTML/   │         │ + WebSocket         │
│ CSS/JS)              │         │ + REST API          │
└──────────────────────┘         └─────────────────────┘
```

## API Endpoints

All endpoints are accessed through the configured base URL:

- `GET /api/health` - Server health check
- `GET /api/transactions` - Fetch transactions
- `POST /api/fraud-explanation` - Analyze fraud
- `POST /api/chat` - AI chat
- `WS /api/ws` - WebSocket real-time feed

## Debugging

### Enable Logging
The API configuration logs its resolved URLs to console:
```
API Configuration: {
  apiBaseUrl: "http://localhost:3000",
  wsUrl: "ws://localhost:3000",
  isProduction: false,
  hostname: "localhost",
  port: "3000",
  protocol: "http:"
}
```

### Check Current Configuration
```javascript
import { getApiConfig } from '@/config/api';
console.log(getApiConfig());
```

### Verify Backend Connectivity
```javascript
import { checkServerHealth } from '@/services/api';
checkServerHealth()
  .then(() => console.log('Backend connected'))
  .catch(err => console.error('Backend unreachable', err));
```

## Production Deployment

### Docker Example
```dockerfile
# Build frontend
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL="https://api.example.com"
ENV VITE_WS_URL="wss://api.example.com"
RUN npm run build

# Serve built files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables for CI/CD
```yaml
# GitHub Actions
- name: Build
  env:
    VITE_API_URL: ${{ secrets.API_URL }}
    VITE_WS_URL: ${{ secrets.WS_URL }}
  run: npm run build
```

## Troubleshooting

### "Backend Offline" Message
1. Check if backend is running:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. Verify URL configuration:
   ```javascript
   import { getApiConfig } from '@/config/api';
   console.log(getApiConfig());
   ```

3. Check browser Network tab for failed requests

### CORS Errors
Backend should be configured with CORS enabled:
```typescript
app.use(cors({
  origin: true,  // or specific URL
  credentials: true
}));
```

### WebSocket Connection Issues
- Ensure protocol matches (wss for https, ws for http)
- Check that server supports WebSocket upgrades
- Verify firewall allows WebSocket connections

## Summary

The URL configuration system provides:
✅ Zero-config development (auto-detection)
✅ Flexible production deployment
✅ Environment-specific configuration
✅ Automatic protocol selection
✅ Centralized API management
✅ Easy switching between local/remote backends
