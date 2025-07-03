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
import { Footer } from '@/components/Footer';
import { TrophySection } from '@/components/TrophySection';
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';
import { MonthlyActivityGrid } from '@/components/MonthlyActivityGrid';

const Index = () => {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    habits,
    completions,
    isLoading: habitsLoading
  } = useHabits();
  const {
    tasks,
    isLoading: tasksLoading
  } = useTasks();
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  if (loading || habitsLoading || tasksLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-50 dark:via-gray-100 dark:to-gray-50 flex items-center justify-center">
        <div className="text-white dark:text-black">Loading...</div>
      </div>;
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
  const allTodos = tasks.map(task => ({
    id: task.id,
    text: task.title,
    completed: task.status === 'completed'
  }));
  const getHabitsWithSelectedMonthProgress = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return habits.map(habit => {
      const monthCompletions = completions.filter(c => {
        if (c.habit_id !== habit.id) return false;
        const completionDate = new Date(c.completion_date);
        return completionDate >= startOfMonth && completionDate <= endOfMonth;
      }).length;
      return {
        ...habit,
        completed: monthCompletions
      };
    });
  };
  const habitsWithSelectedMonthProgress = getHabitsWithSelectedMonthProgress();
  const MiniPieChart = ({
    percentage
  }: {
    percentage: number;
  }) => {
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - percentage / 100 * circumference;
    return <div className="relative inline-flex items-center justify-center">
        <svg width="28" height="28" className="transform -rotate-90 rounded-3xl bg-red-100">
          <circle cx="14" cy="14" r={radius} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" fill="none" />
          <circle cx="14" cy="14" r={radius} stroke="rgb(34, 197, 94)" strokeWidth="2" fill="none" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-500 ease-in-out" />
        </svg>
      </div>;
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-50 dark:via-gray-100 dark:to-gray-50 text-white dark:text-black transition-colors duration-300">
      {/* Glass Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 dark:bg-white/80 border-b border-white/10 dark:border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-emerald-400 dark:text-emerald-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 dark:from-emerald-600 dark:to-blue-600 bg-clip-text text-transparent">
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
        <StatsCards />

        {/* Main Content */}
        <div className="mt-8 space-y-8">
          {/* Monthly Activity Grid - New CodeForces-style view */}
          <MonthlyActivityGrid currentDate={currentDate} onDateChange={setCurrentDate} />

          {/* Trophy Section - New Achievement System */}
          <TrophySection />

          {/* Task Progress - Full Width with enhanced styling */}
          <div className="backdrop-blur-xl bg-white/5 dark:bg-white/80 rounded-2xl border border-white/10 dark:border-gray-200 p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-white dark:text-black">
              Task Progress ({currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })})
            </h3>
            <div className="space-y-6">
              {habitsWithSelectedMonthProgress.map(habit => {
              const percentage = habit.goal > 0 ? Math.round(habit.completed / habit.goal * 100) : 0;
              return <div key={habit.id} className="flex justify-between items-center p-4 rounded-lg bg-white/5 dark:bg-white/60 border border-white/10 dark:border-gray-200 hover:bg-white/10 dark:hover:bg-white/80 transition-all duration-200">
                    <span className="text-gray-200 dark:text-gray-800 font-medium">{habit.name}</span>
                    <div className="flex items-center space-x-3">
                      <MiniPieChart percentage={percentage} />
                      <span className="text-gray-300 dark:text-gray-700 min-w-[3rem] text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>;
            })}
              {habitsWithSelectedMonthProgress.length === 0 && <div className="text-gray-400 dark:text-gray-600 text-center py-8">
                  No habits yet. Start by adding some habits to track!
                </div>}
            </div>
          </div>

          {/* Enhanced Calendar Grid Section */}
          <div className="backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-200 p-6 bg-slate-950/50 dark:bg-white/60 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-white dark:text-black">Monthly Progress</h2>
              <MonthNavigation currentDate={currentDate} onDateChange={setCurrentDate} />
            </div>
            <HabitGrid habits={habitsWithSelectedMonthProgress} currentDate={currentDate} />
          </div>

          {/* Task Breakdown Section */}
          <div className="backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-200 p-6 bg-slate-900/50 dark:bg-white/60 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white dark:text-black">Task Breakdown</h2>
            </div>
            <TaskBreakdownSection habits={habitsWithSelectedMonthProgress} currentDate={currentDate} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>;
};

export default Index;
