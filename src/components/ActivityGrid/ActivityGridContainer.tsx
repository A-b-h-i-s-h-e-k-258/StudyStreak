
import React from 'react';

interface ActivityGridContainerProps {
  children: React.ReactNode;
  currentDate: Date;
}

export const ActivityGridContainer = ({ children, currentDate }: ActivityGridContainerProps) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-white/10 rounded-2xl border border-white/10 dark:border-gray-200 p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white dark:text-black mb-6">
        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h3>
      {children}
    </div>
  );
};
