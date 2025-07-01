import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';
import { AddHabitDialog } from './AddHabitDialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface HabitGridProps {
  habits: Array<{
    id: string;
    name: string;
    goal: number;
    completed: number;
  }>;
  currentDate: Date;
}

export const HabitGrid = ({ habits, currentDate }: HabitGridProps) => {
  const { toggleCompletion, completions, isToggling, deleteHabit, isDeleting } = useHabits();
  const { tasks, updateTaskStatus } = useTasks();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateCompleted = (habitId: string, day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return completions.some(c => c.habit_id === habitId && c.completion_date === dateStr);
  };

  const getCompletedDaysForMonth = (habitId: string) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    return completions.filter(c => {
      if (c.habit_id !== habitId) return false;
      const completionDate = new Date(c.completion_date);
      return completionDate >= startOfMonth && completionDate <= endOfMonth;
    }).length;
  };

  const handleDayClick = (habitId: string, day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    
    toggleCompletion({ habitId, date: dateStr });
    
    // Only sync with tasks if it's today's date
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) {
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        // Find matching task by name similarity
        const matchingTask = tasks.find(task => 
          task.title.toLowerCase().includes(habit.name.toLowerCase()) ||
          habit.name.toLowerCase().includes(task.title.toLowerCase())
        );
        
        if (matchingTask) {
          const isCurrentlyCompleted = isDateCompleted(habitId, day);
          const newTaskStatus = isCurrentlyCompleted ? 'pending' : 'completed';
          updateTaskStatus({ taskId: matchingTask.id, status: newTaskStatus });
        }
      }
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Get today's date for comparison
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();
  const todayDate = isCurrentMonth ? today.getDate() : null;

  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 dark:text-gray-500 mb-4">No habits to track yet.</p>
        <AddHabitDialog />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400 dark:text-gray-500">
          Click on days to mark habits as completed • Green = completed
        </div>
        <AddHabitDialog />
      </div>
      
      {habits.map((habit) => {
        const completedThisMonth = getCompletedDaysForMonth(habit.id);
        const progressPercentage = Math.round((completedThisMonth / daysInMonth) * 100);
        
        return (
          <div key={habit.id} className="space-y-4 p-6 rounded-xl bg-white/5 dark:bg-white/60 border border-white/10 dark:border-gray-200 backdrop-blur-sm shadow-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white dark:text-gray-900 text-lg">{habit.name}</h4>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 dark:text-red-600 hover:text-red-300 dark:hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-100 p-1 h-8 w-8"
                        disabled={isDeleting}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 dark:bg-white border border-white/10 dark:border-gray-200 text-white dark:text-gray-900">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white dark:text-gray-900">Delete Habit</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300 dark:text-gray-600">
                          Are you sure you want to delete "{habit.name}"? This will permanently remove the habit and all its completion data for all months. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 dark:bg-gray-100 border-white/20 dark:border-gray-300 text-white dark:text-gray-700 hover:bg-white/20 dark:hover:bg-gray-200">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300 dark:text-gray-600">
                    {completedThisMonth}/{daysInMonth} days
                  </span>
                  <span className="text-sm text-emerald-400 dark:text-emerald-600 font-medium">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <Progress 
                  value={progressPercentage} 
                  className="h-2 bg-white/10 dark:bg-gray-200"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 p-2 font-medium">
                  {day}
                </div>
              ))}
              
              {/* Empty cells for days before month starts */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="p-2" />
              ))}
              
              {/* Days of the month */}
              {days.map((day) => {
                const isCompleted = isDateCompleted(habit.id, day);
                const isToday = todayDate === day;
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(habit.id, day)}
                    disabled={isToggling}
                    className={`
                      relative p-3 text-sm rounded-lg font-medium transition-all duration-200 
                      hover:scale-105 active:scale-95 transform
                      ${isCompleted 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400' 
                        : 'bg-white/10 dark:bg-gray-100 text-gray-300 dark:text-gray-700 hover:bg-white/20 dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-900'
                      }
                      ${isToday ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent' : ''}
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-transparent
                    `}
                  >
                    {day}
                    {isToday && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Streak indicator */}
            {completedThisMonth > 0 && (
              <div className="flex items-center justify-center pt-2">
                <div className="text-xs text-gray-400 dark:text-gray-500 bg-white/5 dark:bg-gray-100 px-3 py-1 rounded-full">
                  🔥 {completedThisMonth} days this month
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
