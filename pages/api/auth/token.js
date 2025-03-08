import axios from 'axios';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  // Only allow POST requests for refresh
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get the refresh token from cookies
  const refreshToken = req.cookies.cloudbedsRefreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token available' });
  }

  try {
    // Exchange the refresh token for a new access token
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

    const { access_token, refresh_token, expires_in } = response.data;

    // Set cookies with the new tokens
    const tokenCookie = serialize('cloudbedsToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in,
      sameSite: 'lax',
      path: '/'
    });

    const refreshTokenCookie = serialize('cloudbedsRefreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: 'lax',
      path: '/'
    });

    // Set the expiry time cookie (not httpOnly so JS can read it)
    const expiryTime = new Date().getTime() + (expires_in * 1000);
    const expiryTimeCookie = serialize('cloudbedsTokenExpiry', expiryTime.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in,
      sameSite: 'lax',
      path: '/'
    });

    // Set the cookies in the response
    res.setHeader('Set-Cookie', [tokenCookie, refreshTokenCookie, expiryTimeCookie]);

    // Return success
    return res.status(200).json({ success: true, expiresIn: expires_in });
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    
    // Clear cookies in case of an error
    const clearTokenCookie = serialize('cloudbedsToken', '', { maxAge: -1, path: '/' });
    const clearRefreshTokenCookie = serialize('cloudbedsRefreshToken', '', { maxAge: -1, path: '/' });
    const clearExpiryTimeCookie = serialize('cloudbedsTokenExpiry', '', { maxAge: -1, path: '/' });
    
    res.setHeader('Set-Cookie', [clearTokenCookie, clearRefreshTokenCookie, clearExpiryTimeCookie]);
    
    // Return error
    return res.status(error.response?.status || 500).json({
      message: 'Error refreshing token',
      error: error.response?.data || { message: error.message }
    });
  }
}
