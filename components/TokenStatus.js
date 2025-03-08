import React, { useState, useEffect } from 'react';
import authService from '../lib/auth';

export default function TokenStatus() {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  
  useEffect(() => {
    // Update token info
    const updateTokenInfo = () => {
      const info = authService.getTokenInfo();
      setTokenInfo(info);
      
      if (info && info.expiryTime) {
        const secondsLeft = Math.floor((info.expiryTime - new Date().getTime()) / 1000);
        setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
      } else {
        setTimeLeft(null);
      }
    };
    
    // Initial update
    updateTokenInfo();
    
    // Set up timer to update every second
    const timer = setInterval(updateTokenInfo, 1000);
    
    // Clean up timer
    return () => clearInterval(timer);
  }, []);
  
  // Format the time left
  const formatTimeLeft = () => {
    if (!timeLeft && timeLeft !== 0) return 'N/A';
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle token refresh
  const handleRefresh = async () => {
    if (!tokenInfo || !tokenInfo.refreshToken) return;
    
    try {
      const newTokenData = await authService.refreshToken(tokenInfo.refreshToken);
      authService.saveTokens(newTokenData);
      
      // Update token info
      const info = authService.getTokenInfo();
      setTokenInfo(info);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };
  
  if (!tokenInfo) {
    return (
      <div className="bg-gray-100 px-4 py-2 rounded-md text-sm">
        <span className="text-gray-600">Not authenticated</span>
        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Using API Key</span>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 px-4 py-2 rounded-md text-sm flex items-center">
      <div>
        <span className="text-gray-600">Token expires in: </span>
        <span className={`font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-green-600'}`}>
          {formatTimeLeft()}
        </span>
      </div>
      
      {timeLeft < 300 && (
        <button 
          onClick={handleRefresh}
          className="ml-4 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Refresh Token
        </button>
      )}
    </div>
  );
}
