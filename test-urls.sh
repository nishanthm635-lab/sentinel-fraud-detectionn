#!/bin/bash

# ============================================
# Sentinel URL Configuration Test Script
# ============================================
# This script helps verify that the backend URLs
# are correctly configured and accessible

set -e

echo "🔍 Sentinel Backend URL Configuration Test"
echo "==========================================="
echo ""

# Detect local backend
LOCAL_HOST="${LOCAL_HOST:-localhost}"
LOCAL_PORT="${LOCAL_PORT:-3000}"
API_URL="${VITE_API_URL:-http://${LOCAL_HOST}:${LOCAL_PORT}}"
WS_URL="${VITE_WS_URL:-ws://${LOCAL_HOST}:${LOCAL_PORT}}"

echo "Configuration Detected:"
echo "  API URL:       $API_URL"
echo "  WebSocket URL: $WS_URL"
echo ""

# Test 1: Health Check
echo "📋 Test 1: Server Health Check"
echo "  Testing: $API_URL/api/health"
if command -v curl &> /dev/null; then
  if curl -s "$API_URL/api/health" > /dev/null 2>&1; then
    echo "  ✅ Backend is running and accessible"
  else
    echo "  ❌ Backend is not responding"
    echo "  Make sure to run: npm run dev"
  fi
else
  echo "  ⚠️  curl not available, skipping"
fi
echo ""

# Test 2: API Transactions Endpoint
echo "📋 Test 2: Transactions Endpoint"
echo "  Testing: $API_URL/api/transactions"
if command -v curl &> /dev/null; then
  RESPONSE=$(curl -s "$API_URL/api/transactions" 2>&1 || echo "ERROR")
  if [ "$RESPONSE" != "ERROR" ] && [ ! -z "$RESPONSE" ]; then
    echo "  ✅ Transactions endpoint is responding"
    echo "  Sample response (first 100 chars):"
    echo "  $RESPONSE" | head -c 100
    echo "..."
  else
    echo "  ❌ Transactions endpoint not accessible"
  fi
else
  echo "  ⚠️  curl not available, skipping"
fi
echo ""

# Test 3: Environment Variables
echo "📋 Test 3: Environment Variables"
if [ ! -z "$VITE_API_URL" ]; then
  echo "  ✅ VITE_API_URL is set: $VITE_API_URL"
else
  echo "  ⓘ  VITE_API_URL not set (using auto-detection)"
fi

if [ ! -z "$VITE_WS_URL" ]; then
  echo "  ✅ VITE_WS_URL is set: $VITE_WS_URL"
else
  echo "  ⓘ  VITE_WS_URL not set (using auto-detection)"
fi
echo ""

# Test 4: Port Accessibility
echo "📋 Test 4: Port Accessibility"
if command -v netstat &> /dev/null; then
  if netstat -an | grep -q ":$LOCAL_PORT "; then
    echo "  ✅ Port $LOCAL_PORT is listening"
  else
    echo "  ⚠️  Port $LOCAL_PORT may not be listening"
  fi
elif command -v ss &> /dev/null; then
  if ss -an | grep -q ":$LOCAL_PORT "; then
    echo "  ✅ Port $LOCAL_PORT is listening"
  else
    echo "  ⚠️  Port $LOCAL_PORT may not be listening"
  fi
else
  echo "  ⚠️  netstat/ss not available, skipping"
fi
echo ""

echo "==========================================="
echo "✨ Configuration test complete!"
echo ""
echo "📚 For more information:"
echo "  - URL Configuration: docs/BACKEND_URL_CONFIG.md"
echo "  - URL Reference:     docs/URL_REFERENCE.md"
echo "  - Setup Guide:       docs/SERVER_URL_SETUP.md"
echo ""
echo "🚀 To start the application:"
echo "  npm run dev"
echo ""
