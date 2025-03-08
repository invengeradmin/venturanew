import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import authService from '../lib/auth';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for authentication status on load
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    
    // Check if there's an auth failure in the URL
    if (router.query.auth === 'failed') {
      toast.error('Authentication failed. Please try again.');
    }
  }, [router.query]);
  
  // Handle OAuth login button click
  const handleOAuthLogin = () => {
    window.location.href = authService.getAuthUrl();
  };
  
  // Test modules list
  const testModules = [
    {
      title: 'Room Availability',
      description: 'Check room availability for specific dates and guest counts.',
      path: '/tests/availability',
      icon: '🏨'
    },
    {
      title: 'Reservations',
      description: 'Create, search, and manage hotel reservations.',
      path: '/tests/reservations',
      icon: '📅'
    },
    {
      title: 'Guest Management',
      description: 'Search for guests, create guest profiles, and view guest details.',
      path: '/tests/guests',
      icon: '👤'
    },
    {
      title: 'Payments',
      description: 'Process payments, create invoices, and refund transactions.',
      path: '/tests/payments',
      icon: '💳'
    },
    {
      title: 'Housekeeping',
      description: 'View and manage room cleaning and maintenance status.',
      path: '/tests/housekeeping',
      icon: '🧹'
    },
  ];
  
  return (
    <Layout title="Cloudbeds API Test Suite">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome to the Cloudbeds API Test Suite</h2>
          <p className="text-gray-600 mb-4">
            This application allows you to test various Cloudbeds API endpoints and see exactly how they work.
            Use the test modules below to explore different API functionality.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You can test the API using either your API key or OAuth authentication.
                  {!isAuthenticated && (
                    <button 
                      onClick={handleOAuthLogin}
                      className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Connect with OAuth
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testModules.map((module, index) => (
              <Link href={module.path} key={index}>
                <div className="border border-gray-200 rounded-lg p-4 transition duration-200 hover:bg-gray-50 hover:border-blue-300 cursor-pointer">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{module.icon}</span>
                    <h3 className="text-lg font-medium">{module.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{module.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">API Credentials Status</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">API Key Authentication</h3>
            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <span className="text-gray-600 mr-2">Status:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                Configured
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">OAuth Authentication</h3>
            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <span className="text-gray-600 mr-2">Status:</span>
              <span className={`px-2 py-1 ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} rounded text-xs font-medium`}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            
            {!isAuthenticated && (
              <div className="mt-2">
                <button
                  onClick={handleOAuthLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Connect with OAuth
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
