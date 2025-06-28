
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';

export const StatsCards = () => {
  const { habits, completions } = useHabits();
  const { tasks } = useTasks();

  // Calculate total completions across all habits
  const totalCompletions = completions.length;

  // Calculate average completion percentage
  const avgCompletion = habits.length > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + (habit.completed / (habit.goal || 1)) * 100, 0) / habits.length)
    : 0;

  // Calculate best streak across all habits
  const bestStreak = habits.reduce((maxStreak, habit) => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habit.id)
      .map(c => new Date(c.completion_date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (habitCompletions.length === 0) return maxStreak;

    let tempStreak = 1;
    let bestHabitStreak = 1;

    for (let i = 1; i < habitCompletions.length; i++) {
      const currentDate = new Date(habitCompletions[i]);
      const prevDate = new Date(habitCompletions[i - 1]);
      const daysDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        bestHabitStreak = Math.max(bestHabitStreak, tempStreak);
        tempStreak = 1;
      }
    }
    bestHabitStreak = Math.max(bestHabitStreak, tempStreak);

    return Math.max(maxStreak, bestHabitStreak);
  }, 0);

  // Active tasks count
  const activeTasks = tasks.filter(task => task.status !== 'completed').length;

  // Days in current month
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  const stats = [
    { label: 'Total Completions', value: totalCompletions.toString(), color: 'text-blue-400' },
    { label: 'Avg Completion', value: `${avgCompletion}%`, color: 'text-emerald-400' },
    { label: 'Best Streak', value: bestStreak.toString(), color: 'text-purple-400' },
    { label: 'Active Tasks', value: activeTasks.toString(), color: 'text-orange-400' },
    { label: 'Days in Month', value: daysInMonth.toString(), color: 'text-red-400' },
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
