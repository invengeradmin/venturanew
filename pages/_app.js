import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

function CloudbedsApiTester({ Component, pageProps }) {
  const router = useRouter();
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);

  // Set up global token refresh mechanism
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Function to check if token needs refreshing
    const checkTokenExpiry = async () => {
      const expiryTime = localStorage.getItem('cloudbedsTokenExpiry');
      if (!expiryTime) return;

      const expiryTimeMs = parseInt(expiryTime, 10);
      const currentTime = new Date().getTime();
      
      // If token expires in less than 5 minutes and we're not already refreshing
      if (expiryTimeMs - currentTime < 5 * 60 * 1000 && expiryTimeMs > currentTime && !isTokenRefreshing) {
        setIsTokenRefreshing(true);
        
        try {
          // Call the token refresh API
          await axios.post('/api/auth/token');
          
          // Update the expiry time in localStorage
          const response = await axios.get('/api/auth/me');
          if (response.data.expiryTime) {
            localStorage.setItem('cloudbedsTokenExpiry', response.data.expiryTime);
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          
          // If refresh fails, clear localStorage
          localStorage.removeItem('cloudbedsToken');
          localStorage.removeItem('cloudbedsRefreshToken');
          localStorage.removeItem('cloudbedsTokenExpiry');
          
          // Redirect to home if on a protected page
          if (router.pathname !== '/' && router.pathname !== '/auth/callback') {
            router.push('/');
          }
        } finally {
          setIsTokenRefreshing(false);
        }
      }
    };
    
    // Check on mount and then every minute
    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [router, isTokenRefreshing]);

  return <Component {...pageProps} />;
}

export default CloudbedsApiTester;
