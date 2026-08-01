export const getBackendURL = () => {
  const isLiveServer = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '');
    // If on live domain but env variable points to localhost, use production backend URL
    if (isLiveServer && (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1'))) {
      return 'https://teamzen-backend-1.onrender.com';
    }
    return cleanUrl;
  }

  if (isLiveServer) {
    return 'https://teamzen-backend-1.onrender.com';
  }

  return 'http://localhost:5001';
}

export const API_BASE_URL = `${getBackendURL()}/api`;
