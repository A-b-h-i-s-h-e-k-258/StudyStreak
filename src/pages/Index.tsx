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
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';
const Index = () => {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    habits,
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
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
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

  // Convert all tasks to todo format for TodoSection
  const allTodos = tasks.map(task => ({
    id: task.id,
    text: task.title,
    completed: task.status === 'completed'
  }));

  // Mini pie chart component with improved styling
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
        <svg width="28" height="28" className="transform -rotate-90">
          {/* Background circle */}
          <circle cx="14" cy="14" r={radius} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" fill="none" />
          {/* Progress circle */}
          <circle 
            cx="14" cy="14" r={radius} 
            stroke="rgb(34, 197, 94)" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray={strokeDasharray} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            className="transition-all duration-500 ease-in-out" 
          />
        </svg>
      </div>;
  };

  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
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
        <StatsCards />

        {/* Main Content */}
        <div className="mt-8 space-y-8">
          {/* All Tasks Todo - Full Width */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold mb-6">All Tasks ({getFormattedDate()})</h3>
            <TodoSection todos={allTodos} />
          </div>

          {/* Task Progress - Full Width with enhanced styling */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold mb-6">
              Task Progress ({currentDate.toLocaleDateString('en-US', {
              month: 'long'
            })})
            </h3>
            <div className="space-y-6">
              {habits.map(habit => {
                const percentage = Math.round(habit.completed / habit.goal * 100);
                return <div key={habit.id} className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <span className="text-gray-200 font-medium">{habit.name}</span>
                    <div className="flex items-center space-x-3">
                      <MiniPieChart percentage={percentage} />
                      <span className="text-gray-300 min-w-[3rem] text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>;
              })}
              {habits.length === 0 && <div className="text-gray-400 text-center py-8">
                  No habits yet. Start by adding some habits to track!
                </div>}
            </div>
          </div>

          {/* Enhanced Calendar Grid Section */}
          <div className="backdrop-blur-xl rounded-2xl border border-white/10 p-6 bg-slate-950/50">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold">Monthly Progress</h2>
              <MonthNavigation currentDate={currentDate} onDateChange={setCurrentDate} />
            </div>
            <HabitGrid habits={habits} currentDate={currentDate} />
          </div>

          {/* Task Breakdown Section */}
          <div className="backdrop-blur-xl rounded-2xl border border-white/10 p-6 bg-slate-900/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Task Breakdown</h2>
            </div>
            <TaskBreakdownSection habits={habits} currentDate={currentDate} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>;
};
export default Index;
