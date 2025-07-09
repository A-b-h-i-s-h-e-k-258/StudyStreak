
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, UserPlus, TrendingUp, Activity } from 'lucide-react';

export const AnalyticsDashboard = () => {
  // Mock data for charts
  const dailyActiveUsers = [
    { date: '2024-01-01', users: 45 },
    { date: '2024-01-02', users: 52 },
    { date: '2024-01-03', users: 38 },
    { date: '2024-01-04', users: 67 },
    { date: '2024-01-05', users: 74 },
    { date: '2024-01-06', users: 89 },
    { date: '2024-01-07', users: 95 },
  ];

  const signupData = [
    { date: '2024-01-01', signups: 5 },
    { date: '2024-01-02', signups: 8 },
    { date: '2024-01-03', signups: 3 },
    { date: '2024-01-04', signups: 12 },
    { date: '2024-01-05', signups: 7 },
    { date: '2024-01-06', signups: 15 },
    { date: '2024-01-07', signups: 9 },
  ];

  const habitCompletionData = [
    { name: 'Exercise', completions: 85 },
    { name: 'Reading', completions: 72 },
    { name: 'Meditation', completions: 68 },
    { name: 'Water Intake', completions: 91 },
    { name: 'Sleep Schedule', completions: 76 },
  ];

  const userEngagement = [
    { name: 'Highly Active', value: 35, color: '#10b981' },
    { name: 'Moderately Active', value: 45, color: '#3b82f6' },
    { name: 'Low Activity', value: 20, color: '#f59e0b' },
  ];

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'New Signups',
      value: '89',
      change: '+23%',
      icon: UserPlus,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: '856',
      change: '+8%',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Habit Completion',
      value: '78%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
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
              <LineChart data={dailyActiveUsers}>
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
              <BarChart data={signupData}>
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
            <CardTitle>Habit Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={habitCompletionData} layout="horizontal">
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
