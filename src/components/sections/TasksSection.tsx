
import React from 'react';
import { TaskBreakdownSection } from '@/components/TaskBreakdownSection';

interface TasksSectionProps {
  habits: any[];
  currentDate: Date;
}

export const TasksSection = ({ habits, currentDate }: TasksSectionProps) => {
  return (
    <section id="tasks" className="scroll-mt-20">
      <div className="backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-200 p-6 bg-slate-900/50 dark:bg-white/60 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white dark:text-black">Task Breakdown</h2>
        </div>
        <TaskBreakdownSection habits={habits} currentDate={currentDate} />
      </div>
    </section>
  );
};
