
import React from 'react';

interface ActivityStatsProps {
  totalCompletions: number;
  currentStreak: number;
  activeHabits: number;
}

export const ActivityStats = ({ totalCompletions, currentStreak, activeHabits }: ActivityStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="text-center">
        <div className="text-2xl font-bold text-emerald-400 dark:text-emerald-600">
          {totalCompletions}
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-600">
          completions for the month
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-400 dark:text-blue-600">
          {currentStreak}
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-600">
          days in a row this month
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-400 dark:text-purple-600">
          {activeHabits}
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-600">
          active habits
        </div>
      </div>
    </div>
  );
};
