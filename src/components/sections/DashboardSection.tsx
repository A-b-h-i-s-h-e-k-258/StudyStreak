
import React from 'react';
import { StatsCards } from '@/components/StatsCards';

interface DashboardSectionProps {
  displayName: string;
}

export const DashboardSection = ({ displayName }: DashboardSectionProps) => {
  return (
    <section id="dashboard" className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white dark:text-black mb-2">
          Welcome back, {displayName}! 👋
        </h2>
        <p className="text-gray-300 dark:text-gray-600">
          Ready to continue your learning streak?
        </p>
      </div>
      <StatsCards />
    </section>
  );
};
