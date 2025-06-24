import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HabitGrid } from '@/components/HabitGrid';
import { TodoSection } from '@/components/TodoSection';
import { StatsCards } from '@/components/StatsCards';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TaskBreakdownSection } from '@/components/TaskBreakdownSection';
import { MonthNavigation } from '@/components/MonthNavigation';
import { UserMenu } from '@/components/UserMenu';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { habits, isLoading: habitsLoading, completions } = useHabits();
  const { todaysTasks, isLoading: tasksLoading } = useTasks();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || habitsLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getFormattedDate = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const today = new Date();
    const day = today.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    return `${months[today.getMonth()]} ${day}${suffix}`;
  };

  // Convert tasks to todo format for TodoSection
  const todaysTodos = todaysTasks.map(task => ({
    id: task.id,
    text: task.title,
    completed: task.status === 'completed'
  }));

  // Helper to calculate the best streak for a single habit
  function getBestStreak(completedDates: string[]): number {
    if (!completedDates || completedDates.length === 0) return 0;
    // Sort dates ascending
    const dates = completedDates.map(date => new Date(date)).sort((a, b) => a.getTime() - b.getTime());
    let best = 1, current = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
        best = Math.max(best, current);
      } else if (diff > 1) {
        current = 1;
      }
    }
    return best;
  }

  // Calculate best streak among all habits using completions (same as TaskBreakdownSection)
  function calculateStreaks(habitId: string) {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .map(c => new Date(c.completion_date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (habitCompletions.length === 0) {
      return { currentStreak: 0, bestStreak: 0, activeDays: 0 };
    }

    let bestStreak = 0;
    let tempStreak = 1;

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
    return { bestStreak };
  }

  const bestStreak = habits.length > 0
    ? Math.max(...habits.map(h => calculateStreaks(h.id).bestStreak))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Glass Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-emerald-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                StudyStreak
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards
          totalCompletions={habits.reduce((sum, h) => sum + (h.completed || 0), 0)}
          avgCompletion={
            habits.length > 0
              ? Math.round(
                  habits.reduce((sum, h) => sum + ((h.completed || 0) / (h.goal || 1)), 0) / habits.length * 100
                )
              : 0
          }
          bestStreak={bestStreak}
          activeHabits={habits.filter(h => h.goal && h.goal > 0).length}
          daysInMonth={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}
        />

        {/* Main Content */}
        <div className="mt-8 space-y-8">
          {/* Calendar Grid Section */}
          <div className="backdrop-blur-xl rounded-2xl border border-white/10 p-6 bg-slate-950">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Monthly Progress</h2>
              <MonthNavigation currentDate={currentDate} onDateChange={setCurrentDate} />
            </div>
            <HabitGrid habits={habits} currentDate={currentDate} />
          </div>

          {/* Task Breakdown Section - Now below Monthly Progress */}
          <div className="backdrop-blur-xl rounded-2xl border border-white/10 p-6 bg-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Task Breakdown</h2>
            </div>
            <TaskBreakdownSection habits={habits} currentDate={currentDate} />
          </div>

          {/* Bottom Section */}
          {/* Task Progress - now full width and visually appealing */}
          <div className="mt-8">
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-800/60 to-slate-900/80 rounded-2xl border border-purple-500/20 shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-8 text-white">
                Task Progress <span className="text-purple-400">({currentDate.toLocaleDateString('en-US', { month: 'long' })})</span>
              </h3>
              <div className="space-y-6">
                {habits.map(habit => {
                  const percent = habit.goal > 0 ? Math.round((habit.completed / habit.goal) * 100) : 0;
                  return (
                    <div key={habit.id} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-white">{habit.name}</span>
                        <span className="text-purple-300 font-semibold">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-800/60 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {habits.length === 0 && (
                  <div className="text-gray-400 text-center py-4">
                    No habits yet. Start by adding some habits to track!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
