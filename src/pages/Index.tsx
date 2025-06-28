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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { habits, isLoading: habitsLoading } = useHabits();
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

  // Prepare data for pie chart
  const pieChartData = habits.map((habit, index) => ({
    name: habit.name,
    value: Math.round((habit.completed / (habit.goal || 1)) * 100),
    completed: habit.completed,
    goal: habit.goal
  }));

  // Colors for pie chart segments
  const COLORS = [
    '#10B981', // emerald-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
    '#EC4899', // pink-500
  ];

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
        <StatsCards />

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Todo */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Todo list for today ({getFormattedDate()})</h3>
                <AddTaskDialog />
              </div>
              <TodoSection todos={todaysTodos} />
            </div>

            {/* Task Progress */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-6">
                Task Progress ({currentDate.toLocaleDateString('en-US', { month: 'long' })})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Progress List */}
                <div className="space-y-4">
                  {habits.map(habit => (
                    <div key={habit.id} className="flex justify-between items-center">
                      <span className="text-gray-300">{habit.name}</span>
                      <span className="text-gray-400">
                        {Math.round((habit.completed / habit.goal) * 100)}%
                      </span>
                    </div>
                  ))}
                  {habits.length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                      No habits yet. Start by adding some habits to track!
                    </div>
                  )}
                </div>

                {/* Pie Chart */}
                <div className="h-64">
                  {habits.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${props.payload.completed}/${props.payload.goal} (${value}%)`, 
                            name
                          ]}
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ color: 'white' }}
                          formatter={(value) => <span style={{ color: 'white' }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <div>No data to display</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
