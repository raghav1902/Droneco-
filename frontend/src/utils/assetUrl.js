export const getAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If VITE_API_URL is defined (e.g. https://backend.com/api), extract the base origin
  if (import.meta.env.VITE_API_URL) {
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    return `${baseUrl}${cleanPath}`;
  }
  
  // If we don't have VITE_API_URL but are in dev, fallback to localhost
  if (import.meta.env.DEV) {
    return `http://localhost:5000${cleanPath}`;
  }
  
  // Fallback to relative path
  return cleanPath;
};
