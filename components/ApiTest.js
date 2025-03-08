import React, { useState } from 'react';
import ResponseDisplay from './ResponseDisplay';
import { toast } from 'react-toastify';

export default function ApiTest({ 
  title, 
  description, 
  endpoint, 
  method = 'GET',
  children,
  onSubmit 
}) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await onSubmit(formData);
      setResponse(result);
      toast.success('API request successful!');
    } catch (err) {
      console.error('API request failed:', err);
      setError(err.response?.data || {
        message: err.message || 'An unexpected error occurred'
      });
      toast.error('API request failed. See details below.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {description && (
          <p className="mt-1 text-gray-600">{description}</p>
        )}
        <div className="mt-2 flex items-center">
          <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
            method === 'GET' ? 'bg-blue-100 text-blue-800' : 
            method === 'POST' ? 'bg-green-100 text-green-800' : 
            method === 'PUT' ? 'bg-yellow-100 text-yellow-800' : 
            method === 'DELETE' ? 'bg-red-100 text-red-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {method}
          </span>
          <span className="text-sm font-mono text-gray-500">{endpoint}</span>
        </div>
      </div>
      
      <div className="px-6 py-4">
        {/* Render the form or children */}
        {React.Children.map(children, child => {
          // Clone the child and pass the handleSubmit function
          return React.cloneElement(child, {
            onSubmit: handleSubmit,
            isLoading: loading
          });
        })}
        
        {/* API Response */}
        <ResponseDisplay 
          response={response} 
          error={error} 
          loading={loading} 
        />
      </div>
    </div>
  );
}
