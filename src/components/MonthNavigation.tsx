
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const MonthNavigation = ({ currentDate, onDateChange }: MonthNavigationProps) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const goToCurrentMonth = () => {
    onDateChange(new Date());
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return currentDate.getMonth() === now.getMonth() && 
           currentDate.getFullYear() === now.getFullYear();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="text-gray-300 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center min-w-[180px]">
          <h2 className="text-xl font-semibold text-white">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="text-gray-300 hover:text-white hover:bg-white/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {!isCurrentMonth() && (
        <Button
          variant="outline"
          size="sm"
          onClick={goToCurrentMonth}
          className="bg-emerald-600/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30"
        >
          Today
        </Button>
      )}
    </div>
  );
};
