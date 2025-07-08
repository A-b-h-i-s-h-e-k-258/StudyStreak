
import React from 'react';
import { useHabits } from '@/hooks/useHabits';
import { ActivityGridContainer } from './ActivityGrid/ActivityGridContainer';
import { NavigationControls } from './ActivityGrid/NavigationControls';
import { ActivityStats } from './ActivityGrid/ActivityStats';
import { DateHeader } from './ActivityGrid/DateHeader';
import { HabitRow } from './ActivityGrid/HabitRow';

interface MonthlyActivityGridProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const MonthlyActivityGrid = ({
  currentDate,
  onDateChange
}: MonthlyActivityGridProps) => {
  const { habits, completions } = useHabits();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const isDateCompleted = (habitId: string, day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return completions.some(c => c.habit_id === habitId && c.completion_date === dateStr);
  };

  const getHabitCompletions = (habitId: string) => {
    const daysInMonth = getDaysInMonth(currentDate);
    const completionArray = Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      return day <= daysInMonth ? isDateCompleted(habitId, day) : false;
    });
    
    const totalCompletions = completionArray.slice(0, daysInMonth).filter(Boolean).length;
    
    return { completionArray, totalCompletions };
  };

  const getTotalStats = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const monthCompletions = completions.filter(c => {
      const completionDate = new Date(c.completion_date);
      return completionDate >= startOfMonth && completionDate <= endOfMonth;
    }).length;

    // Calculate current streak (consecutive days with at least one habit completed)
    const today = new Date();
    let currentStreak = 0;
    let checkDate = new Date(today);
    while (checkDate >= startOfMonth) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasCompletionOnDate = completions.some(c => c.completion_date === dateStr);
      if (hasCompletionOnDate) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      totalCompletions: monthCompletions,
      currentStreak,
      daysInMonth: getDaysInMonth(currentDate)
    };
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const stats = getTotalStats();
  const today = new Date();
  const currentDay = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear() 
    ? today.getDate() 
    : undefined;

  return (
    <div className="w-full">
      <ActivityGridContainer currentDate={currentDate}>
        <NavigationControls currentDate={currentDate} onDateChange={onDateChange} />
        
        <ActivityStats 
          totalCompletions={stats.totalCompletions}
          currentStreak={stats.currentStreak}
          activeHabits={habits.length}
        />

        <div className="space-y-2 sm:space-y-3 overflow-x-auto">
          <DateHeader daysInMonth={daysInMonth} currentDay={currentDay} />

          {habits.map(habit => {
            const { completionArray, totalCompletions } = getHabitCompletions(habit.id);
            return (
              <HabitRow
                key={habit.id}
                habitName={habit.name}
                completions={completionArray}
                totalCompletions={totalCompletions}
                daysInMonth={daysInMonth}
              />
            );
          })}

          {habits.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-400 dark:text-gray-600 text-sm sm:text-base">
              No habits to display. Add some habits to see your activity!
            </div>
          )}
        </div>
      </ActivityGridContainer>
    </div>
  );
};
