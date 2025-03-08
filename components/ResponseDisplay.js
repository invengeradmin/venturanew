import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactJson with no SSR since it uses browser-specific APIs
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export default function ResponseDisplay({ response, error, loading }) {
  const [copySuccess, setCopySuccess] = useState('');
  
  // Copy response to clipboard
  const copyToClipboard = () => {
    try {
      const jsonString = JSON.stringify(response, null, 2);
      navigator.clipboard.writeText(jsonString);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
      console.error('Failed to copy text: ', err);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 mt-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 mt-4">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
        <div className="text-red-700 overflow-auto">
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    );
  }
  
  if (!response) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mt-4">
        <p className="text-gray-500 text-center">No response data available yet.</p>
        <p className="text-gray-400 text-center text-sm mt-2">Run a test to see results here.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-md mt-4 overflow-hidden">
      <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-700">Response</h3>
        <div className="flex items-center">
          {copySuccess && (
            <span className="text-green-600 text-sm mr-2">{copySuccess}</span>
          )}
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700"
          >
            Copy JSON
          </button>
        </div>
      </div>
      
      <div className="p-4 overflow-auto max-h-[600px]">
        <ReactJson 
          src={response} 
          theme="rjv-default" 
          name={false} 
          collapsed={1} 
          displayDataTypes={false}
          enableClipboard={false}
        />
      </div>
    </div>
  );
}
