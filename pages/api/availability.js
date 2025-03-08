import axios from 'axios';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get query parameters from the request
  const {
    startDate,
    endDate,
    adults,
    children,
    includeRoomTypes,
    includeRatePlans,
    includeExtras,
    includeInactive,
    roomTypeIds,
  } = req.query;

  // Validate required parameters
  if (!startDate || !endDate) {
    return res.status(400).json({ 
      message: 'Missing required parameters: startDate and endDate are required' 
    });
  }

  try {
    // Determine which authentication method to use
    const token = req.cookies.cloudbedsToken;
    const headers = {
      'x-property-id': process.env.CLOUDBEDS_PROPERTY_ID
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['x-api-key'] = process.env.CLOUDBEDS_API_KEY;
    }

    // Build the request parameters
    const params = {
      startDate,
      endDate,
      adults: adults || 2,
      children: children || 0
    };
    
    // Add optional parameters
    if (includeRoomTypes) params.includeRoomTypes = 1;
    if (includeRatePlans) params.includeRatePlans = 1;
    if (includeExtras) params.includeExtras = 1;
    if (includeInactive) params.includeInactive = 1;
    if (roomTypeIds) params.roomTypeIds = roomTypeIds;
    
    // Make request to Cloudbeds API
    const response = await axios.get('https://api.cloudbeds.com/api/v1.1/getAvailability', {
      headers,
      params
    });

    // Return successful response
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching availability:', error.response?.data || error.message);
    
    // Handle API errors
    return res.status(error.response?.status || 500).json({
      message: 'Error fetching availability data',
      error: error.response?.data || { message: error.message }
    });
  }
}
