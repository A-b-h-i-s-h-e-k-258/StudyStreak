
import React from 'react';
import { HabitBreakdownSection as HabitBreakdown } from '@/components/HabitBreakdownSection';

interface HabitBreakdownSectionProps {
  habits: any[];
  currentDate: Date;
}

export const HabitBreakdownSection = ({ habits, currentDate }: HabitBreakdownSectionProps) => {
  return (
    <section id="habit-breakdown" className="scroll-mt-20">
      <div className="backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-200 p-6 bg-slate-900/50 dark:bg-white/60 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white dark:text-black">Habit Breakdown</h2>
        </div>
        <HabitBreakdown habits={habits} currentDate={currentDate} />
      </div>
    </section>
  );
};
