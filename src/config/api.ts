/**
 * API Configuration
 * Handles backend server URL generation
 */

export interface ApiConfig {
  apiBaseUrl: string;
  wsUrl: string;
  isProduction: boolean;
}

export function getApiConfig(): ApiConfig {
  // Determine if we're in production or development
  const isProduction = process.env.NODE_ENV === 'production' && import.meta.env.PROD;
  
  // Get backend server URL from environment variables or detect from host
  let apiBaseUrl = '';
  let wsUrl = '';

  // Priority order: env var > window.location based detection
  const envApiUrl = import.meta.env.VITE_API_URL;
  const envWsUrl = import.meta.env.VITE_WS_URL;

  if (envApiUrl && envWsUrl) {
    // Use environment variables if provided
    apiBaseUrl = envApiUrl;
    wsUrl = envWsUrl;
  } else {
    // Auto-detect backend server from current location
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    // Default ports
    const apiPort = port || (protocol === 'https:' ? '443' : '80');
    const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;

    apiBaseUrl = baseUrl;
    
    // WebSocket protocol
    const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl = `${wsProtocol}//${hostname}${port ? `:${port}` : ''}`;
  }

  // Ensure URLs don't have trailing slashes
  apiBaseUrl = apiBaseUrl.replace(/\/$/, '');
  wsUrl = wsUrl.replace(/\/$/, '');

  return {
    apiBaseUrl,
    wsUrl,
    isProduction,
  };
}

/**
 * Get the full API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.apiBaseUrl}${endpoint}`;
}

/**
 * Get the WebSocket URL for real-time connections
 */
export function getWebSocketUrl(path: string = '/api/ws'): string {
  const config = getApiConfig();
  return `${config.wsUrl}${path}`;
}

/**
 * Fetch data from API with error handling
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// Log configuration for debugging
console.log('API Configuration:', {
  apiBaseUrl: getApiConfig().apiBaseUrl,
  wsUrl: getApiConfig().wsUrl,
  isProduction: getApiConfig().isProduction,
  hostname: window.location.hostname,
  port: window.location.port,
  protocol: window.location.protocol,
});
