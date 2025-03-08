import axios from 'axios';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  // Check if this is a GET request with an authorization code
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Missing authorization code' });
  }

  try {
    // Exchange the authorization code for an access token
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

    const { access_token, refresh_token, expires_in } = response.data;

    // Set cookies with the tokens
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

    // Redirect back to the home page or a success page
    return res.redirect('/');
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    
    // Redirect to the home page with an error
    return res.redirect('/?auth=failed');
  }
}
