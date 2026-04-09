# Sentinel Fraud Detection System

A comprehensive AI-powered fraud detection dashboard with real-time transaction monitoring, risk analysis, and intelligent alerting.

## Features

- 🚀 **Real-time Transaction Feed**: Live WebSocket-powered transaction monitoring
- 🤖 **AI-Powered Analysis**: Gemini AI integration for fraud detection and explanations
- 📊 **Interactive Dashboard**: Modern React interface with data visualizations
- 🔍 **Risk Analysis**: Detailed transaction analysis with risk scoring
- 💬 **AI Chat Assistant**: Intelligent fraud analysis assistant
- 🌐 **Network Graph**: Visual transaction relationship mapping

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express.js + WebSocket
- **AI**: Google Gemini 1.5 Flash
- **UI**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts + D3.js

## Run Locally

**Prerequisites:** Node.js 18+

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Set your Gemini API key in `.env`:
```bash
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Start the Application
```bash
npm run dev
```

The application will start on `http://localhost:3000` with:
- ✅ Express backend server
- ✅ WebSocket real-time feeds
- ✅ Vite development server
- ✅ AI analysis capabilities

### Backend URL Configuration

The application automatically detects and connects to your backend server:

**Development (Auto-Detection)**
- Frontend and backend on same host: http://localhost:3000
- Automatically configures API endpoints
- WebSocket connections use correct protocol (ws)

**Production (Environment Variables)**
```bash
# For separate backend server
VITE_API_URL="https://api.example.com" \
VITE_WS_URL="wss://api.example.com" \
npm run build
```

See [Backend URL Configuration Guide](./docs/BACKEND_URL_CONFIG.md) for detailed setup instructions.

## Authentication

The application includes a secure login system:

- **Demo Credentials**: 
  - Username: `admin`
  - Password: `sentinel2024`
- **Features**:
  - Password visibility toggle
  - Form validation
  - Error handling
  - Session management
  - Logout functionality

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/transactions` - Get recent transactions
- `POST /api/fraud-explanation` - AI-powered fraud analysis
- `POST /api/chat` - AI chat assistant
- `WS /api/ws` - Real-time transaction WebSocket

## Architecture

The application consists of:

1. **Backend Server** (`server.ts`):
   - Express.js REST API
   - WebSocket server for real-time data
   - Gemini AI integration
   - Mock transaction generation

2. **Frontend** (`src/`):
   - React SPA with TypeScript
   - Real-time WebSocket connections
   - Interactive dashboard components
   - AI-powered analysis tools

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - TypeScript linting

### Project Structure
```
├── server.ts              # Backend server
├── src/
│   ├── App.tsx           # Main React component
│   ├── components/       # UI components
│   └── services/         # API services
├── package.json          # Dependencies
└── .env                  # Environment variables
```
