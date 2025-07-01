
import { GoalModificationDialog } from './GoalModificationDialog';
import { ViewStreaksDialog } from './ViewStreaksDialog';
import { useHabits } from '@/hooks/useHabits';
import { useHabitUpdates } from '@/hooks/useHabitUpdates';

interface TaskBreakdownSectionProps {
  habits: Array<{
    id: string;
    name: string;
    goal: number;
    completed: number;
  }>;
  currentDate: Date;
}

export const TaskBreakdownSection = ({ habits, currentDate }: TaskBreakdownSectionProps) => {
  const { completions } = useHabits();
  const { updateHabitGoal } = useHabitUpdates();

  // Filter completions for the selected month
  const getMonthCompletions = (habitId: string) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    return completions.filter(c => {
      if (c.habit_id !== habitId) return false;
      const completionDate = new Date(c.completion_date);
      return completionDate >= startOfMonth && completionDate <= endOfMonth;
    }).length;
  };

  // Update habits with the selected month's completion data
  const habitsWithMonthProgress = habits.map(habit => ({
    ...habit,
    completed: getMonthCompletions(habit.id)
  }));

  const getCompletionPercentage = (completions: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.round((completions / goal) * 100);
  };

  const calculateStreaks = (habitId: string) => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .map(c => new Date(c.completion_date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (habitCompletions.length === 0) {
      return { currentStreak: 0, bestStreak: 0, activeDays: 0 };
    }

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;
    let activeDays = habitCompletions.length;

    // Calculate current streak starting from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if today is completed
    const todayCompleted = habitCompletions.some(date => {
      const completionDate = new Date(date);
      completionDate.setHours(0, 0, 0, 0);
      return completionDate.getTime() === today.getTime();
    });

    if (todayCompleted) {
      currentStreak = 1;
      
      // Count consecutive days going backwards
      for (let i = 1; i < 365; i++) { // Check up to a year back
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        
        const dayCompleted = habitCompletions.some(date => {
          const completionDate = new Date(date);
          completionDate.setHours(0, 0, 0, 0);
          return completionDate.getTime() === checkDate.getTime();
        });
        
        if (dayCompleted) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      // Check if yesterday was completed to continue streak
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const yesterdayCompleted = habitCompletions.some(date => {
        const completionDate = new Date(date);
        completionDate.setHours(0, 0, 0, 0);
        return completionDate.getTime() === yesterday.getTime();
      });
      
      if (yesterdayCompleted) {
        currentStreak = 1;
        
        // Count consecutive days going backwards from yesterday
        for (let i = 2; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          
          const dayCompleted = habitCompletions.some(date => {
            const completionDate = new Date(date);
            completionDate.setHours(0, 0, 0, 0);
            return completionDate.getTime() === checkDate.getTime();
          });
          
          if (dayCompleted) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculate best streak
    for (let i = 1; i < habitCompletions.length; i++) {
      const currentDate = new Date(habitCompletions[i]);
      const prevDate = new Date(habitCompletions[i - 1]);
      const daysDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);
    bestStreak = Math.max(bestStreak, currentStreak);

    return { currentStreak, bestStreak, activeDays };
  };

  const handleGoalSave = (taskId: string, newGoal: number) => {
    updateHabitGoal({ habitId: taskId, newGoal });
  };

  if (habitsWithMonthProgress.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No habits to track yet. Add some habits in the Monthly Progress section above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habitsWithMonthProgress.map((habit) => {
        const streaks = calculateStreaks(habit.id);
        
        return (
          <div key={habit.id} className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
            {/* Task Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
              <div className="flex items-center space-x-4">
                <GoalModificationDialog
                  taskName={habit.name}
                  currentGoal={habit.goal}
                  onGoalSave={(newGoal) => handleGoalSave(habit.id, newGoal)}
                />
                <ViewStreaksDialog 
                  habitId={habit.id}
                  habitName={habit.name}
                />
                <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                  {getCompletionPercentage(habit.completed, habit.goal)}% Complete
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-6 mb-4">
              <div>
                <div className="text-sm text-gray-400">Completions</div>
                <div className="text-blue-400 font-medium">
                  {habit.completed}/{habit.goal === 0 ? '∞' : habit.goal}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Current Streak</div>
                <div className="text-emerald-400 font-medium">
                  {streaks.currentStreak} days
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Best Streak</div>
                <div className="text-purple-400 font-medium">
                  {streaks.bestStreak} days
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Active Days</div>
                <div className="text-orange-400 font-medium">
                  {streaks.activeDays} days
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400">Progress</div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: habit.goal === 0 ? '0%' : `${Math.min((habit.completed / habit.goal) * 100, 100)}%` }}
                />
              </div>
              <div className="text-right text-xs text-gray-400">
                {habit.completed}/{habit.goal === 0 ? '∞' : habit.goal} goal
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
