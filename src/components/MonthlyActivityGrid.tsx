
import { useHabits } from '@/hooks/useHabits';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthlyActivityGridProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const MonthlyActivityGrid = ({ currentDate, onDateChange }: MonthlyActivityGridProps) => {
  const { habits, completions } = useHabits();

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const isDateCompleted = (habitId: string, day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return completions.some(c => c.habit_id === habitId && c.completion_date === dateStr);
  };

  const getHabitStats = (habitId: string) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthCompletions = completions.filter(c => {
      if (c.habit_id !== habitId) return false;
      const completionDate = new Date(c.completion_date);
      return completionDate >= startOfMonth && completionDate <= endOfMonth;
    }).length;

    return monthCompletions;
  };

  const getTotalStats = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthCompletions = completions.filter(c => {
      const completionDate = new Date(c.completion_date);
      return completionDate >= startOfMonth && completionDate <= endOfMonth;
    }).length;

    // Calculate current streak (consecutive days with at least one habit completed)
    const today = new Date();
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    while (checkDate >= startOfMonth) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasCompletionOnDate = completions.some(c => c.completion_date === dateStr);
      
      if (hasCompletionOnDate) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      totalCompletions: monthCompletions,
      currentStreak,
      daysInMonth: getDaysInMonth(currentDate)
    };
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const stats = getTotalStats();

  return (
    <div className="backdrop-blur-xl bg-white/5 dark:bg-white/80 rounded-2xl border border-white/10 dark:border-gray-200 p-6 shadow-lg">
      {/* Header with navigation */}
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

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400 dark:text-emerald-600">
            {stats.totalCompletions}
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-600">
            completions for the month
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400 dark:text-blue-600">
            {stats.currentStreak}
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-600">
            days in a row this month
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400 dark:text-purple-600">
            {habits.length}
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-600">
            active habits
          </div>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="space-y-3">
        {/* Days header */}
        <div className="flex items-center">
          <div className="w-40 text-sm font-medium text-gray-400 dark:text-gray-600">
            Habits
          </div>
          <div className="flex gap-1 ml-4">
            {days.map((day) => (
              <div
                key={day}
                className="w-4 h-4 flex items-center justify-center text-xs text-gray-500 dark:text-gray-600"
                title={`Day ${day}`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Habit rows */}
        {habits.map((habit) => {
          const habitCompletions = getHabitStats(habit.id);
          return (
            <div key={habit.id} className="flex items-center">
              <div className="w-40 text-sm text-gray-300 dark:text-gray-800 truncate pr-3">
                {habit.name}
              </div>
              <div className="flex gap-1 ml-4">
                {days.map((day) => {
                  const isCompleted = isDateCompleted(habit.id, day);
                  return (
                    <div
                      key={day}
                      className={`w-4 h-4 ${
                        isCompleted
                          ? 'bg-green-600 dark:bg-green-500'
                          : 'bg-gray-800 dark:bg-gray-300 border border-gray-700 dark:border-gray-400'
                      }`}
                      title={`${habit.name} - Day ${day} (${isCompleted ? 'Completed' : 'Not completed'})`}
                    />
                  );
                })}
              </div>
              <div className="ml-4 text-sm text-gray-400 dark:text-gray-600 min-w-[60px]">
                {habitCompletions} days
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-600">
            No habits to display. Add some habits to see your activity!
          </div>
        )}
      </div>
    </div>
  );
};
