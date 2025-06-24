
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
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const habits = [
    { id: 'cp-contest', name: 'CP Contest', goal: 10, completed: 0 },
    { id: 'cp-prob', name: 'CP-31 3 Prob', goal: 30, completed: 0 },
    { id: 'lc-prob', name: 'LC 3 Prob', goal: 30, completed: 0 },
    { id: 'lc-potd', name: 'LC POTD', goal: 30, completed: 0 },
    { id: 'web-dev', name: 'Web Dev', goal: 20, completed: 0 },
  ];

  const todaysTodos = [
    { id: 1, text: 'CP Contest', completed: false },
    { id: 2, text: 'CP-31 3 Prob', completed: false },
    { id: 3, text: 'LC 3 Prob', completed: false },
    { id: 4, text: 'LC POTD', completed: false },
    { id: 5, text: 'Web Dev', completed: false },
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
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
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const today = new Date();
    const day = today.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                   day === 2 || day === 22 ? 'nd' :
                   day === 3 || day === 23 ? 'rd' : 'th';
    
    return `${months[today.getMonth()]} ${day}${suffix}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Glass Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-emerald-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                AuraTrack
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
          {/* Task Breakdown Section */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Task Breakdown</h2>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  See CP trends
                </Button>
                <Button variant="outline" size="sm" className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  See LC trends
                </Button>
                <Button variant="outline" size="sm" className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  See Web Dev trends
                </Button>
              </div>
            </div>
            
            <TaskBreakdownSection />
          </div>

          {/* Calendar Grid Section */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Monthly Progress</h2>
              <MonthNavigation 
                currentDate={currentDate} 
                onDateChange={setCurrentDate} 
              />
            </div>
            <HabitGrid habits={habits} currentDate={currentDate} />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Todo */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Todo list for today ({getFormattedDate()})</h3>
                <Button 
                  className="backdrop-blur-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add new Task
                </Button>
              </div>
              <TodoSection todos={todaysTodos} />
            </div>

            {/* Task Progress */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-6">Task Progress ({currentDate.toLocaleDateString('en-US', { month: 'long' })})</h3>
              <div className="space-y-4">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex justify-between items-center">
                    <span className="text-gray-300">{habit.name}</span>
                    <span className="text-gray-400">{habit.completed}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
