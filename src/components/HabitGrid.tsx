import { useHabits } from '@/hooks/useHabits';
import { AddHabitDialog } from './AddHabitDialog';
interface HabitGridProps {
  habits: Array<{
    id: string;
    name: string;
    goal: number;
    completed: number;
  }>;
  currentDate: Date;
}
export const HabitGrid = ({
  habits,
  currentDate
}: HabitGridProps) => {
  const {
    toggleCompletion,
    completions,
    isToggling
  } = useHabits();
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  const isDateCompleted = (habitId: string, day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return completions.some(c => c.habit_id === habitId && c.completion_date === dateStr);
  };
  const handleDayClick = (habitId: string, day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    toggleCompletion({
      habitId,
      date: dateStr
    });
  };
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({
    length: daysInMonth
  }, (_, i) => i + 1);
  const emptyDays = Array.from({
    length: firstDayOfMonth
  }, (_, i) => i);
  if (habits.length === 0) {
    return <div className="text-center py-8">
        <p className="text-gray-400 mb-4">No habits to track yet.</p>
        <AddHabitDialog />
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Click on days to mark habits as completed
        </div>
        <AddHabitDialog />
      </div>
      
      {habits.map(habit => <div key={habit.id} className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-white">{habit.name}</h4>
            <span className="text-sm text-gray-400">
              {habit.completed}/{habit.goal}
            </span>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="text-center text-xs text-gray-500 p-2">
                {day}
              </div>)}
            
            {/* Empty cells for days before month starts */}
            {emptyDays.map((_, index) => <div key={`empty-${index}`} className="p-2" />)}
            
            {/* Days of the month */}
            {days.map(day => {
          const isCompleted = isDateCompleted(habit.id, day);
          const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
          return <button key={day} onClick={() => handleDayClick(habit.id, day)} disabled={isToggling} className="font-semibold text-red-400">
                  {day}
                </button>;
        })}
          </div>
        </div>)}
    </div>;
};