// Quick verification file to test URL configuration
// Run this in the browser console to verify everything is working

console.log('%c🔍 Sentinel URL Configuration Verification', 'font-size: 16px; font-weight: bold; color: #00ff00;');
console.log('='.repeat(50));

// Test 1: Import configuration
try {
  console.log('%c✓ Importing API configuration...', 'color: #00ff00;');
  import('@/config/api').then(({ getApiConfig }) => {
    const config = getApiConfig();
    console.log('%c✓ Configuration loaded:', 'color: #00ff00;');
    console.table(config);
    
    // Verify URLs
    console.log('%cVerifying URLs...', 'color: #ffaa00;');
    if (config.apiBaseUrl && config.wsUrl) {
      console.log(`%c✓ API URL: ${config.apiBaseUrl}`, 'color: #00ff00;');
      console.log(`%c✓ WebSocket URL: ${config.wsUrl}`, 'color: #00ff00;');
    } else {
      console.error('%c✗ URLs not configured!', 'color: #ff0000;');
    }
  });
} catch (error) {
  console.error('%c✗ Failed to import configuration:', 'color: #ff0000;', error);
}

// Test 2: Import API services
try {
  console.log('%c✓ Importing API services...', 'color: #00ff00;');
  import('@/services/api').then(({ checkServerHealth, fetchTransactions }) => {
    console.log('%c✓ API services loaded', 'color: #00ff00;');
    
    // Test health check
    console.log('%cTesting backend health...', 'color: #ffaa00;');
    checkServerHealth()
      .then(() => console.log('%c✓ Backend is healthy!', 'color: #00ff00;'))
      .catch(err => console.error('%c✗ Backend health check failed:', 'color: #ff0000;', err));
    
    // Test fetch transactions
    console.log('%cFetching transactions...', 'color: #ffaa00;');
    fetchTransactions()
      .then(data => console.log('%c✓ Transactions fetched:', 'color: #00ff00;', `${data.length} items`))
      .catch(err => console.error('%c✗ Failed to fetch transactions:', 'color: #ff0000;', err));
  });
} catch (error) {
  console.error('%c✗ Failed to import services:', 'color: #ff0000;', error);
}

// Test 3: Check environment
console.log('\n%cEnvironment Variables:', 'font-weight: bold; color: #00aaff;');
console.log(`VITE_API_URL: ${import.meta.env.VITE_API_URL || '(not set - using auto-detection)'}`);
console.log(`VITE_WS_URL: ${import.meta.env.VITE_WS_URL || '(not set - using auto-detection)'}`);

// Test 4: Check browser location
console.log('\n%cBrowser Location Info:', 'font-weight: bold; color: #00aaff;');
console.table({
  protocol: window.location.protocol,
  hostname: window.location.hostname,
  port: window.location.port || '(default for protocol)',
  href: window.location.href,
});

console.log('%c'.repeat(50), 'color: #00aa00;');
console.log('%c✨ Verification complete!', 'font-size: 14px; font-weight: bold; color: #ffaa00;');
console.log('%cFor more help, run: help()', 'color: #00aaff;');

// Helper function
window.help = () => {
  console.log('%c📚 Sentinel URL Configuration Help', 'font-size: 14px; font-weight: bold;');
  console.log(`
%cConfiguration Files:%c
- docs/BACKEND_URL_CONFIG.md - Full configuration guide
- docs/URL_REFERENCE.md - URL examples
- docs/SERVER_URL_SETUP.md - Integration guide
- ARCHITECTURE.md - System architecture

%cKey Commands:%c
- getApiConfig() - Get current configuration
- checkServerHealth() - Test backend connection
- fetchTransactions() - Get transaction data

%cTest Backend:%c
- curl http://localhost:3000/api/health
- curl http://localhost:3000/api/transactions

%cStart Application:%c
- npm run dev

%cSettings:%c
- .env.development - Development config
- .env.production.example - Production template
  `, 'color: #00ff00;', 'color: #ffffff;', 'color: #00ff00;', 'color: #ffffff;', 'color: #00ff00;', 'color: #ffffff;', 'color: #00ff00;', 'color: #ffffff;');
};

console.log('%c📞 Questions? Type help() for more information', 'color: #ffaa00;');
