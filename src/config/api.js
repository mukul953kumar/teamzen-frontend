export const getBackendURL = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) {
    return envUrl.replace(/\/+$/, '')
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://teamzen-backend-1.onrender.com'
  }
  return 'http://localhost:5001'
}

export const API_BASE_URL = `${getBackendURL()}/api`
