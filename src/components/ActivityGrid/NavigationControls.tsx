
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationControlsProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const NavigationControls = ({ currentDate, onDateChange }: NavigationControlsProps) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigateMonth('prev')} 
          className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-black hover:bg-white/10 dark:hover:bg-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-xl font-bold text-white dark:text-black">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigateMonth('next')} 
          className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-black hover:bg-white/10 dark:hover:bg-gray-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
