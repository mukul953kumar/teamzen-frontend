export const getBackendURL = () => {
  const isServer = typeof window === 'undefined';
  if (isServer) return 'http://localhost:5001';

  const hostname = window.location.hostname;

  // Detect local environment (localhost, 127.0.0.1, local Wi-Fi IPs like 192.168.x.x, 10.x.x.x, 172.x.x.x, or *.local)
  const isLocalEnv =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local') ||
    /^192\.168\.\d+\.\d+$/.test(hostname) ||
    /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+$/.test(hostname);

  const envUrl = import.meta.env.VITE_API_URL;

  if (isLocalEnv) {
    const protocol = window.location.protocol || 'http:';
    return `${protocol}//${hostname}:5001`;
  }

  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '');
    return cleanUrl.replace(/\/api$/i, '');
  }

  return 'https://teamzen-backend-1.onrender.com';
};

export const API_BASE_URL = `${getBackendURL()}/api`;

