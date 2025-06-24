import React from 'react';

interface StatsCardsProps {
  totalCompletions: number;
  avgCompletion: number; // as percentage, e.g. 75 for 75%
  bestStreak: number;
  activeHabits: number;
  daysInMonth: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalCompletions,
  avgCompletion,
  bestStreak,
  activeHabits,
  daysInMonth,
}) => {
  const stats = [
    { label: 'Total Completions', value: totalCompletions, color: 'text-blue-400' },
    { label: 'Avg Completion', value: `${avgCompletion}%`, color: 'text-emerald-400' },
    { label: 'Best Streak', value: bestStreak, color: 'text-purple-400' },
    { label: 'Active Habits', value: activeHabits, color: 'text-orange-400' },
    { label: 'Days in Month', value: daysInMonth, color: 'text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4 text-center">
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-gray-400 text-sm mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
