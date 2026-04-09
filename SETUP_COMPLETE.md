# URL Generation with Host Server - Complete Setup

## 🎯 What Was Created

### Core Files

1. **`src/config/api.ts`** - URL Configuration Module
   - Detects and manages backend URLs
   - Supports environment variables
   - Auto-detects localhost configuration
   - Returns properly formatted API and WebSocket endpoints

2. **`src/services/api.ts`** - API Service Layer
   - High-level functions for common API calls
   - Uses configuration for correct URLs
   - Error handling and logging

3. **`src/App.tsx`** - Updated to Use Dynamic URLs
   - Integrated configuration functions
   - Logs connection information
   - Properly routes all API calls

### Configuration Files

4. **`.env.development`** - Development Environment
   ```
   VITE_API_URL=http://localhost:3000
   VITE_WS_URL=ws://localhost:3000
   ```

5. **`.env.production.example`** - Production Template
   ```
   VITE_API_URL=https://api.example.com
   VITE_WS_URL=wss://api.example.com
   ```

### Documentation

6. **`docs/BACKEND_URL_CONFIG.md`** - Comprehensive Configuration Guide
7. **`docs/SERVER_URL_SETUP.md`** - Integration Summary
8. **`docs/URL_REFERENCE.md`** - Quick Reference for URLs
9. **`test-urls.sh`** - Linux/Mac test script
10. **`test-urls.bat`** - Windows test script

## 🚀 Quick Start

### Development (Auto-Detection)
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3000 (auto-detected)
- WebSocket: ws://localhost:3000/api/ws (auto-detected)

### Production (Separate Servers)
```bash
VITE_API_URL="https://api.example.com" \
VITE_WS_URL="wss://api.example.com" \
npm run build
```

## 📋 How URLs Are Generated

### Configuration Detection Flow
```
App Starts
  ↓
@import getApiConfig()
  ↓
Check VITE_API_URL env var
  ├─ If set: Use env var
  └─ If not: Auto-detect
      ├─ window.location.protocol → http/https
      ├─ window.location.hostname → localhost/example.com
      ├─ window.location.port → 3000/5173/etc
      └─ Generate: http://localhost:3000
  ↓
Return { apiBaseUrl, wsUrl, isProduction }
  ↓
Use in fetch/WebSocket calls
```

## 💻 Usage Examples

### Getting Current Configuration
```typescript
import { getApiConfig } from '@/config/api';

const config = getApiConfig();
console.log(config.apiBaseUrl);  // "http://localhost:3000"
console.log(config.wsUrl);       // "ws://localhost:3000"
console.log(config.isProduction); // false
```

### Making API Calls
```typescript
import { fetchTransactions, analyzeFraud } from '@/services/api';

// Service layer automatically uses correct URLs
const transactions = await fetchTransactions();
const analysis = await analyzeFraud(transaction);
```

### Generating URLs
```typescript
import { getApiUrl, getWebSocketUrl } from '@/config/api';

const apiUrl = getApiUrl('/api/transactions');
// → "http://localhost:3000/api/transactions"

const wsUrl = getWebSocketUrl('/api/ws');
// → "ws://localhost:3000/api/ws"
```

## 🧪 Testing URLs

### Linux/Mac
```bash
chmod +x test-urls.sh
./test-urls.sh
```

### Windows
```batch
test-urls.bat
```

### Manual Testing
```bash
# Check health
curl http://localhost:3000/api/health

# Get transactions
curl http://localhost:3000/api/transactions

# Test in browser console
import { checkServerHealth } from '@/services/api';
checkServerHealth().then(() => console.log('✅ Backend OK'));
```

## 🌐 Network Architecture

### Single Server (Development)
```
Frontend (Vite 5173) ───→ Backend (Express 3000)
                         ├─ REST API
                         └─ WebSocket
URL: http://localhost:3000
```

### Separate Servers (Production)
```
Frontend (CDN)          Backend (Cloud)
http://app.example.com  https://api.example.com
         │                       │
         └─────── API Calls ──────┤
         └─── WebSocket (wss) ───┤
```

## 🔧 Configuration Matrix

| Environment | Frontend | Backend | API URL | WS URL |
|-------------|----------|---------|---------|--------|
| Dev Local | localhost:5173 | localhost:3000 | Auto-detected | Auto-detected |
| Dev Remote Backend | localhost:5173 | example.com:3000 | http://example.com:3000 | ws://example.com:3000 |
| Production | example.com | api.example.com | https://api.example.com | wss://api.example.com |

## 📦 File Structure
```
sentinel-fraud-detection/
├── src/
│   ├── config/
│   │   └── api.ts              ← URL generation
│   ├── services/
│   │   ├── api.ts              ← API layer
│   │   └── geminiService.ts
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   └── App.tsx                 ← Updated with getApiUrl()
├── docs/
│   ├── BACKEND_URL_CONFIG.md   ← Full guide
│   ├── SERVER_URL_SETUP.md     ← Integration guide
│   ├── URL_REFERENCE.md        ← URL examples
│   └── ...
├── .env.development            ← Dev config
├── .env.production.example     ← Production template
├── test-urls.sh                ← Test script (Linux/Mac)
├── test-urls.bat               ← Test script (Windows)
├── server.ts                   ← Backend
└── package.json
```

## 🔌 API Endpoints

All requests automatically use the configured base URL:

```
GET  /api/health               ← Health check
GET  /api/transactions         ← Get transactions
POST /api/fraud-explanation    ← Analyze fraud
POST /api/chat                 ← AI chat
WS   /api/ws                   ← Real-time data
```

Example calls:
```typescript
// Development
http://localhost:3000/api/health
http://localhost:3000/api/transactions

// Production
https://api.example.com/api/health
https://api.example.com/api/transactions
```

## 🔐 CORS Configuration

Backend (server.ts) includes CORS setup:
```typescript
app.use(cors({
  origin: true,        // or specific URL
  credentials: true
}));
```

## 🚢 Deployment Examples

### Docker Compose
```yaml
services:
  frontend:
    build: .
    environment:
      VITE_API_URL: http://backend:3000
      VITE_WS_URL: ws://backend:3000
  backend:
    image: node:18
    command: npm run dev
```

### GitHub Pages + AWS API Gateway
```bash
VITE_API_URL="https://api.aws.com" \
VITE_WS_URL="wss://api.aws.com" \
npm run build
# Push dist/ to GitHub Pages
```

### Vercel + Backend
```bash
# Set environment variables in Vercel dashboard
VITE_API_URL=https://backend-production.example.com
VITE_WS_URL=wss://backend-production.example.com
```

## ✅ Verification Checklist

- [ ] `src/config/api.ts` exists and exports getApiConfig()
- [ ] `src/services/api.ts` exists with API functions
- [ ] `App.tsx` imports and uses getApiUrl()
- [ ] `.env.development` has correct URLs
- [ ] Console shows "API Configuration:" log on app start
- [ ] "Connected" status appears in header after login
- [ ] API calls work (check Network tab in DevTools)
- [ ] WebSocket connects (check Console for "Connecting WebSocket to:")

## 🧠 Key Concepts

### Auto-Detection
- Works out of the box in development
- No configuration needed
- Uses current browser location

### Environment Variables
- Used for production deployments
- Overrides auto-detection
- Set during build time

### Service Layer
- Consistent error handling
- Type safety
- Easy to mock for testing

## 📞 Troubleshooting

### "Backend Offline" Message
1. Check backend is running: `npm run dev`
2. Verify URL: Check console for API Configuration log
3. Check Network tab in DevTools for failed requests
4. Test health: `curl http://localhost:3000/api/health`

### Wrong API URL
1. Check environment variables: `echo $VITE_API_URL`
2. Check browser console for API Configuration log
3. Check if localhost differs from deployed domain

### WebSocket Connection Fails
1. Verify protocol: `ws://` for HTTP, `wss://` for HTTPS
2. Check CORS is enabled in backend
3. Verify firewall allows WebSocket connections
4. Check browser WebSocket support

## 🎓 Learn More

- **URL Configuration**: See `docs/BACKEND_URL_CONFIG.md`
- **Quick Reference**: See `docs/URL_REFERENCE.md`
- **Setup Summary**: See `docs/SERVER_URL_SETUP.md`
- **API Service**: Check `src/services/api.ts`
- **Configuration**: Check `src/config/api.ts`

## 🎉 Summary

✅ Complete URL configuration system
✅ Auto-detection for development
✅ Environment variables for production
✅ Type-safe service layer
✅ Flexible deployment options
✅ Comprehensive documentation
✅ Test scripts for verification

Your Sentinel application now has a professional, scalable URL configuration system that works seamlessly across development and production environments!
