
import React from 'react';

interface DateHeaderProps {
  daysInMonth: number;
  currentDay?: number;
}

export const DateHeader = ({ daysInMonth, currentDay }: DateHeaderProps) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-31 gap-1 mb-4">
      <div className="w-40 text-sm text-gray-300 dark:text-gray-800 font-medium">
        Habits
      </div>
      {days.map(day => (
        <div
          key={day}
          className={`w-4 h-4 flex items-center justify-center text-[10px] font-mono rounded ${
            day <= daysInMonth
              ? day === currentDay
                ? 'text-white dark:text-black ring-2 ring-blue-400 dark:ring-blue-600 bg-blue-400/20'
                : 'text-gray-400 dark:text-gray-600'
              : 'text-gray-600 dark:text-gray-400 opacity-30'
          }`}
          title={day <= daysInMonth ? `Day ${day}` : ''}
        >
          {day <= daysInMonth ? day : ''}
        </div>
      ))}
      <div className="w-16 text-sm text-gray-300 dark:text-gray-800 font-medium text-center">
        Total
      </div>
    </div>
  );
};
