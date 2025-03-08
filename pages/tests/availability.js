import React from 'react';
import Layout from '../../components/Layout';
import ApiTest from '../../components/ApiTest';
import AvailabilityForm from '../../components/forms/AvailabilityForm';
import apiService from '../../lib/api';

export default function AvailabilityTestPage() {
  // Handle form submission
  const handleSubmit = async (formData) => {
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
    } = formData;
    
    // Build query parameters
    const params = {
      startDate,
      endDate,
      adults,
      children
    };
    
    // Add optional parameters
    if (includeRoomTypes) params.includeRoomTypes = 1;
    if (includeRatePlans) params.includeRatePlans = 1;
    if (includeExtras) params.includeExtras = 1;
    if (includeInactive) params.includeInactive = 1;
    if (roomTypeIds) {
      params.roomTypeIds = roomTypeIds
        .split(',')
        .map(id => id.trim())
        .join(',');
    }
    
    // Call the API
    const result = await apiService.getAvailability(startDate, endDate);
    return result;
  };
  
  return (
    <Layout title="Availability Testing">
      <div className="max-w-4xl mx-auto">
        <p className="mb-6 text-gray-600">
          Test the Cloudbeds availability API to check room availability for specific dates and guest counts.
        </p>
        
        <ApiTest
          title="Room Availability"
          description="Retrieves availability information for rooms based on date range and guest count."
          endpoint="/api/v1.1/getAvailability"
          method="GET"
          onSubmit={handleSubmit}
        >
          <AvailabilityForm />
        </ApiTest>
      </div>
    </Layout>
  );
}
