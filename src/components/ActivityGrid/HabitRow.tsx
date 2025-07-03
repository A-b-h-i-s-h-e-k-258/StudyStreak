
import React from 'react';

interface HabitRowProps {
  habitName: string;
  completions: boolean[];
  totalCompletions: number;
  daysInMonth: number;
}

export const HabitRow = ({ habitName, completions, totalCompletions, daysInMonth }: HabitRowProps) => {
  const allDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-31 gap-1 mb-3">
      <div className="w-40 text-sm text-gray-300 dark:text-gray-800 truncate pr-3 flex items-center">
        {habitName}
      </div>
      {allDays.map(day => {
        const isValidDay = day <= daysInMonth;
        const isCompleted = isValidDay && completions[day - 1];
        
        return (
          <div
            key={day}
            className={`w-4 h-4 rounded ${
              !isValidDay
                ? 'opacity-20'
                : isCompleted
                ? 'bg-green-600 dark:bg-green-500'
                : 'bg-gray-800 dark:bg-gray-300 border border-gray-700 dark:border-gray-400'
            }`}
            title={isValidDay ? `${habitName} - Day ${day} (${isCompleted ? 'Completed' : 'Not completed'})` : ''}
          />
        );
      })}
      <div className="w-16 text-sm text-gray-400 dark:text-gray-600 text-center flex items-center justify-center">
        {totalCompletions} days
      </div>
    </div>
  );
};
