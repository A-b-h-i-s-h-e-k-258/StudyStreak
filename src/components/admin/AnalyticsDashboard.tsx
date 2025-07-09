
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, UserPlus, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalUsers: number;
  newSignups: number;
  activeUsers: number;
  habitCompletionRate: number;
  dailyActiveUsers: Array<{ date: string; users: number }>;
  signupData: Array<{ date: string; signups: number }>;
  habitCompletionData: Array<{ name: string; completions: number }>;
}

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch users created in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: newSignups } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Fetch total habits
      const { count: totalHabits } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true });

      // Fetch habit completions
      const { count: totalCompletions } = await supabase
        .from('habit_completions')
        .select('*', { count: 'exact', head: true });

      // Calculate habit completion rate
      const habitCompletionRate = totalHabits && totalCompletions 
        ? Math.round((totalCompletions / (totalHabits * 30)) * 100) 
        : 0;

      // Fetch daily signups for the last 7 days
      const signupData = [];
      const dailyActiveUsers = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const { count: dailySignups } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dateStr)
          .lt('created_at', `${dateStr}T23:59:59.999Z`);

        // For active users, we'll use a simplified metric based on habit completions
        const { count: dailyCompletions } = await supabase
          .from('habit_completions')
          .select('*', { count: 'exact', head: true })
          .eq('completion_date', dateStr);

        signupData.push({
          date: dateStr,
          signups: dailySignups || 0
        });

        dailyActiveUsers.push({
          date: dateStr,
          users: dailyCompletions || 0
        });
      }

      // Fetch habit completion data by habit name
      const { data: habits } = await supabase
        .from('habits')
        .select(`
          name,
          habit_completions (
            id
          )
        `)
        .limit(5);

      const habitCompletionData = habits?.map(habit => ({
        name: habit.name,
        completions: habit.habit_completions?.length || 0
      })) || [];

      setAnalytics({
        totalUsers: totalUsers || 0,
        newSignups: newSignups || 0,
        activeUsers: totalCompletions || 0, // Using completions as proxy for active users
        habitCompletionRate,
        dailyActiveUsers,
        signupData,
        habitCompletionData
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Failed to load analytics data
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toString(),
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'New Signups',
      value: analytics.newSignups.toString(),
      change: '+23%',
      icon: UserPlus,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: analytics.activeUsers.toString(),
      change: '+8%',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Habit Completion',
      value: `${analytics.habitCompletionRate}%`,
      change: '+5%',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
  ];

  const userEngagement = [
    { name: 'Highly Active', value: 35, color: '#10b981' },
    { name: 'Moderately Active', value: 45, color: '#3b82f6' },
    { name: 'Low Activity', value: 20, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.signupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="signups" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Habit Completion by Habit</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.habitCompletionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="completions" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userEngagement}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userEngagement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
