
import { useState } from 'react';
import { Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Habit {
  id: string;
  name: string;
  goal: number;
  completed: number;
}

interface HabitGridProps {
  habits: Habit[];
  currentDate: Date;
}

export const HabitGrid = ({ habits, currentDate }: HabitGridProps) => {
  const [habitData, setHabitData] = useState<Record<string, Record<number, boolean>>>({});

  // Generate days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toggleDay = (habitId: string, day: number) => {
    setHabitData(prev => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        [day]: !prev[habitId]?.[day]
      }
    }));
  };

  const getCompletedDays = (habitId: string) => {
    return Object.values(habitData[habitId] || {}).filter(Boolean).length;
  };

  const getCompletionPercentage = (habitId: string, goal: number) => {
    const completed = getCompletedDays(habitId);
    return Math.round((completed / goal) * 100);
  };

  return (
    <div className="space-y-6">
      {habits.map((habit) => (
        <div key={habit.id} className="space-y-3">
          {/* Habit Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h4 className="font-semibold text-lg">{habit.name}</h4>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-blue-400">
                  Completions: {getCompletedDays(habit.id)}/{habit.goal}
                </span>
                <span className="text-emerald-400">
                  Current Streak: 0 days
                </span>
                <span className="text-purple-400">
                  Best Streak: 0 days
                </span>
                <span className="text-orange-400">
                  Active Days: 0 days
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Streaks
              </Button>
              <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                {getCompletionPercentage(habit.id, habit.goal)}% Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getCompletedDays(habit.id) / habit.goal) * 100}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-400">
            {getCompletedDays(habit.id)}/{habit.goal} goal
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {/* Day headers */}
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-gray-400 font-medium py-2">
                {day}
              </div>
            ))}
            
            {/* Empty cells for month start alignment */}
            {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            
            {/* Days */}
            {days.map((day) => {
              const isCompleted = habitData[habit.id]?.[day] || false;
              const isToday = day === currentDate.getDate();
              
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(habit.id, day)}
                  className={`
                    aspect-square rounded-lg border transition-all duration-200 flex items-center justify-center text-xs font-medium
                    ${isCompleted 
                      ? 'bg-emerald-500/30 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/40' 
                      : 'bg-gray-800/30 border-gray-600/30 text-gray-400 hover:bg-gray-700/50 hover:border-gray-500/50'
                    }
                    ${isToday ? 'ring-2 ring-blue-400/50' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
