
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // Development environments
  if (hostname === 'localhost' || 
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||  // Local network
      hostname.startsWith('10.')) {       // Another local network
    return 'http://localhost:7000';
  }
  
  
  return 'https://devconnect-backend-v2.onrender.com';
};

export const BASE_URL = getBaseUrl();
export const SOCKET_URL = BASE_URL;