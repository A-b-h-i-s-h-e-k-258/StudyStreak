
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoalModificationDialog } from './GoalModificationDialog';
import { useHabits } from '@/hooks/useHabits';

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

    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < habitCompletions.length; i++) {
      const completionDate = new Date(habitCompletions[i]);
      completionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
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

    return { currentStreak, bestStreak, activeDays };
  };

  const handleGoalSave = (taskId: string, newGoal: number) => {
    console.log(`Goal for task ${taskId} updated to ${newGoal}`);
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No habits to track yet. Add some habits in the Monthly Progress section above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Streaks
                </Button>
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
                  style={{ width: habit.goal === 0 ? '0%' : `${(habit.completed / habit.goal) * 100}%` }}
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
