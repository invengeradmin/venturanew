import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DateRangePicker from '../DateRangePicker';
import dateUtils from '../../lib/dates';

export default function AvailabilityForm({ onSubmit, isLoading }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      ...dateUtils.getDefaultDateRange(),
      includeRoomTypes: true,
      includeRatePlans: true,
      includeExtras: true,
      includeInactive: false,
      adults: 2,
      children: 0
    }
  });
  
  // Watch the values to conditionally show fields
  const watchIncludeRoomTypes = watch('includeRoomTypes');
  
  // Handle date range changes
  const handleDateRangeChange = (dateRange) => {
    setValue('startDate', dateRange.startDate);
    setValue('endDate', dateRange.endDate);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <DateRangePicker 
            onChange={handleDateRangeChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
          <input
            type="number"
            {...register('adults', { 
              required: 'Adults count is required',
              min: { value: 1, message: 'Minimum 1 adult' },
              max: { value: 10, message: 'Maximum 10 adults' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            min="1"
            max="10"
          />
          {errors.adults && (
            <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
          <input
            type="number"
            {...register('children', { 
              required: 'Children count is required',
              min: { value: 0, message: 'Minimum 0 children' },
              max: { value: 10, message: 'Maximum 10 children' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="10"
          />
          {errors.children && (
            <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-full">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Additional Options</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeRoomTypes"
                {...register('includeRoomTypes')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeRoomTypes" className="ml-2 text-sm text-gray-700">
                Include Room Types
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeRatePlans"
                {...register('includeRatePlans')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeRatePlans" className="ml-2 text-sm text-gray-700">
                Include Rate Plans
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeExtras"
                {...register('includeExtras')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeExtras" className="ml-2 text-sm text-gray-700">
                Include Extras
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeInactive"
                {...register('includeInactive')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeInactive" className="ml-2 text-sm text-gray-700">
                Include Inactive
              </label>
            </div>
          </div>
        </div>
        
        {watchIncludeRoomTypes && (
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type IDs (optional, comma separated)</label>
            <input
              type="text"
              {...register('roomTypeIds')}
              placeholder="e.g. 123, 456, 789"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to fetch all room types
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Check Availability'}
        </button>
      </div>
    </form>
  );
}
