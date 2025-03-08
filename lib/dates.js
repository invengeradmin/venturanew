import { format, addDays, differenceInDays, parseISO } from 'date-fns';

const dateUtils = {
  // Format a date to YYYY-MM-DD
  formatDateForApi: (date) => {
    return format(date, 'yyyy-MM-dd');
  },
  
  // Format a date for display
  formatDateForDisplay: (date) => {
    if (typeof date === 'string') {
      try {
        date = parseISO(date);
      } catch (e) {
        console.error('Invalid date string:', date);
        return 'Invalid date';
      }
    }
    return format(date, 'MMM dd, yyyy');
  },
  
  // Get today's date formatted for API
  getTodayFormatted: () => {
    return format(new Date(), 'yyyy-MM-dd');
  },
  
  // Get a future date formatted for API
  getFutureDateFormatted: (daysFromNow) => {
    return format(addDays(new Date(), daysFromNow), 'yyyy-MM-dd');
  },
  
  // Calculate number of nights between dates
  calculateNights: (startDate, endDate) => {
    if (typeof startDate === 'string') {
      startDate = parseISO(startDate);
    }
    if (typeof endDate === 'string') {
      endDate = parseISO(endDate);
    }
    return differenceInDays(endDate, startDate);
  },
  
  // Default date range for availability search
  getDefaultDateRange: () => {
    const today = new Date();
    const futureDate = addDays(today, 3);
    
    return {
      startDate: format(today, 'yyyy-MM-dd'),
      endDate: format(futureDate, 'yyyy-MM-dd')
    };
  }
};

export default dateUtils;
