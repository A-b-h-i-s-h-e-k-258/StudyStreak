
import { Trophy, Star, Target, Calendar, Zap, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  earned: boolean;
  type: 'streak' | 'completion' | 'consistency' | 'milestone';
}

export const TrophySection = () => {
  const { habits, completions } = useHabits();
  const { tasks } = useTasks();

  // Check for 7 consecutive days of all habits completed
  const getOneWeekWonder = () => {
    if (habits.length === 0) return false;
    
    const today = new Date();
    let consecutiveDays = 0;
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // Check if ALL habits have completions on this date
      const allHabitsCompleted = habits.every(habit => 
        completions.some(c => c.habit_id === habit.id && c.completion_date === dateStr)
      );
      
      if (allHabitsCompleted) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    
    return consecutiveDays >= 7;
  };

  // Check for perfect month (no missed days in current month)
  const getPerfectMonth = () => {
    if (habits.length === 0) return false;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Check each day of the month
    for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if ALL habits have completions on this date
      const allHabitsCompleted = habits.every(habit => 
        completions.some(c => c.habit_id === habit.id && c.completion_date === dateStr)
      );
      
      if (!allHabitsCompleted) {
        return false;
      }
    }
    
    return true;
  };

  // Check if all tasks are completed this week
  const getWeeklyChampion = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weekTasks = tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return taskDate >= startOfWeek && taskDate <= today;
    });
    
    const completedWeekTasks = weekTasks.filter(task => task.status === 'completed');
    return weekTasks.length > 0 && completedWeekTasks.length === weekTasks.length;
  };

  const oneWeekWonder = getOneWeekWonder();
  const perfectMonth = getPerfectMonth();
  const weeklyChampion = getWeeklyChampion();

  const achievements: Achievement[] = [
    {
      id: 'one-week-wonder',
      name: 'One-Week Wonder',
      description: '7 consecutive days of all habits',
      icon: Star,
      earned: oneWeekWonder,
      type: 'streak'
    },
    {
      id: 'perfect-month',
      name: 'Perfect Month',
      description: 'No missed days in a full month',
      icon: Trophy,
      earned: perfectMonth,
      type: 'consistency'
    },
    {
      id: 'weekly-champion',
      name: 'Weekly Champion',
      description: 'Complete 100% tasks in a week',
      icon: Target,
      earned: weeklyChampion,
      type: 'completion'
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalAchievements = achievements.length;

  const getBadgeVariant = (type: Achievement['type']) => {
    switch (type) {
      case 'streak': return 'default';
      case 'completion': return 'secondary';
      case 'consistency': return 'outline';
      case 'milestone': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/80 border border-white/10 dark:border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white dark:text-black">
          <Trophy className="h-5 w-5 text-yellow-500" />
          🏆 Achievements & Badges
        </CardTitle>
        <div className="text-sm text-gray-400 dark:text-gray-600">
          {earnedAchievements.length} of {totalAchievements} achievements unlocked
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Achievements Grid */}
        <div className="space-y-3">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  achievement.earned
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/30'
                    : 'bg-gray-800/50 dark:bg-gray-200/50 border border-gray-700 dark:border-gray-300 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    achievement.earned
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-600 dark:bg-gray-400 text-gray-300 dark:text-gray-600'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={`font-medium text-sm ${
                      achievement.earned 
                        ? 'text-white dark:text-black' 
                        : 'text-gray-400 dark:text-gray-600'
                    }`}>
                      {achievement.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {achievement.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {achievement.earned && (
                    <Badge 
                      variant={getBadgeVariant(achievement.type)}
                      className="text-xs"
                    >
                      Earned
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {earnedAchievements.length === 0 && (
          <div className="text-center py-6 text-gray-400 dark:text-gray-600">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Start completing habits to earn your first badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
