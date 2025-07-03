
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

  // Calculate current streak (consecutive days with at least one habit completed)
  const getCurrentStreak = () => {
    const today = new Date();
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    while (checkDate) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasCompletionOnDate = completions.some(c => c.completion_date === dateStr);
      
      if (hasCompletionOnDate) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
      
      // Prevent infinite loop
      if (currentStreak > 365) break;
    }
    
    return currentStreak;
  };

  // Check if all tasks are completed this week
  const getAllTasksCompletedThisWeek = () => {
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

  // Calculate total completions this month
  const getMonthlyCompletions = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return completions.filter(c => {
      const completionDate = new Date(c.completion_date);
      return completionDate >= startOfMonth && completionDate <= endOfMonth;
    }).length;
  };

  const currentStreak = getCurrentStreak();
  const allTasksCompletedThisWeek = getAllTasksCompletedThisWeek();
  const monthlyCompletions = getMonthlyCompletions();
  const totalHabits = habits.length;

  const achievements: Achievement[] = [
    {
      id: 'streak-3',
      name: '3-Day Streak',
      description: 'Complete habits for 3 consecutive days',
      icon: Star,
      earned: currentStreak >= 3,
      type: 'streak'
    },
    {
      id: 'streak-5',
      name: '5-Day Streak',
      description: 'Complete habits for 5 consecutive days',
      icon: Zap,
      earned: currentStreak >= 5,
      type: 'streak'
    },
    {
      id: 'streak-10',
      name: '10-Day Streak',
      description: 'Complete habits for 10 consecutive days',
      icon: Trophy,
      earned: currentStreak >= 10,
      type: 'streak'
    },
    {
      id: 'weekly-completion',
      name: 'Weekly Champion',
      description: 'Complete all tasks this week',
      icon: Target,
      earned: allTasksCompletedThisWeek,
      type: 'completion'
    },
    {
      id: 'habit-creator',
      name: 'Habit Builder',
      description: 'Create your first 3 habits',
      icon: Calendar,
      earned: totalHabits >= 3,
      type: 'milestone'
    },
    {
      id: 'monthly-warrior',
      name: 'Monthly Warrior',
      description: 'Complete 50+ habit sessions this month',
      icon: Award,
      earned: monthlyCompletions >= 50,
      type: 'consistency'
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
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-white/5 dark:bg-white/60 border border-white/10 dark:border-gray-200">
            <div className="text-2xl font-bold text-emerald-400 dark:text-emerald-600">
              {currentStreak}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600">
              Current Streak
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5 dark:bg-white/60 border border-white/10 dark:border-gray-200">
            <div className="text-2xl font-bold text-blue-400 dark:text-blue-600">
              {monthlyCompletions}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600">
              This Month
            </div>
          </div>
        </div>

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
