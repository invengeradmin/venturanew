import axios from 'axios';

const authService = {
  // Generate the OAuth authorization URL
  getAuthUrl: () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || process.env.CLOUDBEDS_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || process.env.CLOUDBEDS_REDIRECT_URI;
    const scope = 'read:property read:roomType read:reservation write:reservation read:guest write:guest read:housekeeping';
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in localStorage to verify when the callback returns
    if (typeof window !== 'undefined') {
      localStorage.setItem('oauthState', state);
    }
    
    return `https://api.cloudbeds.com/auth/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  },
  
  // Exchange authorization code for access token
  exchangeCodeForToken: async (code) => {
    try {
      const tokenUrl = 'https://api.cloudbeds.com/auth/oauth/token';
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('client_id', process.env.CLOUDBEDS_CLIENT_ID);
      params.append('client_secret', process.env.CLOUDBEDS_CLIENT_SECRET);
      params.append('redirect_uri', process.env.CLOUDBEDS_REDIRECT_URI);
      params.append('code', code);
      
      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  },
  
  // Refresh the access token
  refreshToken: async (refreshToken) => {
    try {
      const tokenUrl = 'https://api.cloudbeds.com/auth/oauth/token';
      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('client_id', process.env.CLOUDBEDS_CLIENT_ID);
      params.append('client_secret', process.env.CLOUDBEDS_CLIENT_SECRET);
      params.append('refresh_token', refreshToken);
      
      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },
  
  // Save tokens to localStorage
  saveTokens: (tokenData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cloudbedsToken', tokenData.access_token);
      localStorage.setItem('cloudbedsRefreshToken', tokenData.refresh_token);
      localStorage.setItem('cloudbedsTokenExpiry', new Date().getTime() + (tokenData.expires_in * 1000));
    }
  },
  
  // Get stored token info
  getTokenInfo: () => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const token = localStorage.getItem('cloudbedsToken');
    const refreshToken = localStorage.getItem('cloudbedsRefreshToken');
    const expiryTime = localStorage.getItem('cloudbedsTokenExpiry');
    
    if (!token || !refreshToken || !expiryTime) {
      return null;
    }
    
    const isExpired = new Date().getTime() > parseInt(expiryTime, 10);
    
    return {
      token,
      refreshToken,
      expiryTime: parseInt(expiryTime, 10),
      isExpired
    };
  },
  
  // Clear all auth data
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cloudbedsToken');
      localStorage.removeItem('cloudbedsRefreshToken');
      localStorage.removeItem('cloudbedsTokenExpiry');
      localStorage.removeItem('oauthState');
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const tokenInfo = authService.getTokenInfo();
    return tokenInfo !== null && !tokenInfo.isExpired;
  }
};

export default authService;
