
import React from 'react';
import { MonthNavigation } from '@/components/MonthNavigation';
import { HabitGrid } from '@/components/HabitGrid';

interface HabitsSectionProps {
  habits: any[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const HabitsSection = ({ habits, currentDate, onDateChange }: HabitsSectionProps) => {
  return (
    <section id="habits" className="scroll-mt-20">
      <div className="backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-200 p-6 bg-slate-950/50 dark:bg-white/60 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-white dark:text-black">Monthly Progress</h2>
          <MonthNavigation currentDate={currentDate} onDateChange={onDateChange} />
        </div>
        <HabitGrid habits={habits} currentDate={currentDate} />
      </div>
    </section>
  );
};
