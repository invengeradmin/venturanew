import React, { useState } from 'react';
import { format, addDays, isAfter } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateUtils from '../lib/dates';

export default function DateRangePicker({ 
  initialStartDate = new Date(), 
  initialEndDate = addDays(new Date(), 1),
  onChange,
  minNights = 1,
  maxNights = 30
}) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState('');
  
  const handleStartDateChange = (date) => {
    setStartDate(date);
    
    // Ensure end date is at least minNights after the start date
    if (!isAfter(endDate, addDays(date, minNights - 1))) {
      const newEndDate = addDays(date, minNights);
      setEndDate(newEndDate);
      
      // Trigger the onChange callback
      if (onChange) {
        onChange({
          startDate: dateUtils.formatDateForApi(date),
          endDate: dateUtils.formatDateForApi(newEndDate)
        });
      }
    } else {
      // Trigger the onChange callback
      if (onChange) {
        onChange({
          startDate: dateUtils.formatDateForApi(date),
          endDate: dateUtils.formatDateForApi(endDate)
        });
      }
    }
    
    // Clear any existing errors
    setError('');
  };
  
  const handleEndDateChange = (date) => {
    // Validate that end date is after start date + minNights
    if (!isAfter(date, addDays(startDate, minNights - 1))) {
      setError(`Minimum stay is ${minNights} ${minNights === 1 ? 'night' : 'nights'}`);
      return;
    }
    
    // Validate that end date is not more than maxNights from start date
    if (isAfter(date, addDays(startDate, maxNights))) {
      setError(`Maximum stay is ${maxNights} nights`);
      return;
    }
    
    setEndDate(date);
    setError('');
    
    // Trigger the onChange callback
    if (onChange) {
      onChange({
        startDate: dateUtils.formatDateForApi(startDate),
        endDate: dateUtils.formatDateForApi(date)
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={addDays(startDate, minNights)}
            dateFormat="yyyy-MM-dd"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-end">
          <div className="bg-gray-100 px-3 py-2 rounded-md">
            <span className="text-sm text-gray-500">Nights: </span>
            <span className="font-medium">{dateUtils.calculateNights(startDate, endDate)}</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}
