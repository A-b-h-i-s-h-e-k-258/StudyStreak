
import React from 'react';

interface AnalyticsSectionProps {
  habitsWithSelectedMonthProgress: any[];
  currentDate: Date;
}

export const AnalyticsSection = ({ habitsWithSelectedMonthProgress, currentDate }: AnalyticsSectionProps) => {
  const MiniPieChart = ({ percentage }: { percentage: number; }) => {
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - percentage / 100 * circumference;
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width="28" height="28" className="transform -rotate-90 rounded-3xl bg-red-100">
          <circle cx="14" cy="14" r={radius} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" fill="none" />
          <circle cx="14" cy="14" r={radius} stroke="rgb(34, 197, 94)" strokeWidth="2" fill="none" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-500 ease-in-out" />
        </svg>
      </div>
    );
  };

  return (
    <section id="analytics" className="scroll-mt-20">
      <div className="backdrop-blur-xl bg-white/5 dark:bg-white/80 rounded-2xl border border-white/10 dark:border-gray-200 p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-white dark:text-black">
          Task Progress ({currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })})
        </h3>
        <div className="space-y-6">
          {habitsWithSelectedMonthProgress.map(habit => {
            const percentage = habit.goal > 0 ? Math.round(habit.completed / habit.goal * 100) : 0;
            return (
              <div key={habit.id} className="flex justify-between items-center p-4 rounded-lg bg-white/5 dark:bg-white/60 border border-white/10 dark:border-gray-200 hover:bg-white/10 dark:hover:bg-white/80 transition-all duration-200">
                <span className="text-gray-200 dark:text-gray-800 font-medium">{habit.name}</span>
                <div className="flex items-center space-x-3">
                  <MiniPieChart percentage={percentage} />
                  <span className="text-gray-300 dark:text-gray-700 min-w-[3rem] text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
          {habitsWithSelectedMonthProgress.length === 0 && (
            <div className="text-gray-400 dark:text-gray-600 text-center py-8">
              No habits yet. Start by adding some habits to track!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
