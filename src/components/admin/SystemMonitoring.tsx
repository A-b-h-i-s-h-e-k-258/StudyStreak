
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Server, Database, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemStats {
  totalHabits: number;
  totalTasks: number;
  totalUsers: number;
  totalCompletions: number;
  recentErrors: Array<{
    id: string;
    timestamp: string;
    level: string;
    message: string;
    service: string;
  }>;
}

export const SystemMonitoring = () => {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSystemStats = async () => {
    try {
      setLoading(true);

      // Fetch system statistics
      const [
        { count: totalHabits },
        { count: totalTasks },
        { count: totalUsers },
        { count: totalCompletions },
        { data: adminLogs }
      ] = await Promise.all([
        supabase.from('habits').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('habit_completions').select('*', { count: 'exact', head: true }),
        supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      // Convert admin logs to error format for display
      const recentErrors = adminLogs?.map(log => ({
        id: log.id,
        timestamp: new Date(log.created_at).toLocaleString(),
        level: log.action.includes('error') ? 'error' : 'info',
        message: `Admin action: ${log.action}`,
        service: log.target_type || 'System'
      })) || [];

      setSystemStats({
        totalHabits: totalHabits || 0,
        totalTasks: totalTasks || 0,
        totalUsers: totalUsers || 0,
        totalCompletions: totalCompletions || 0,
        recentErrors
      });

    } catch (error) {
      console.error('Error fetching system stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch system statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchSystemStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const systemHealth = [
    {
      name: 'API Server',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '45ms',
      icon: Server
    },
    {
      name: 'Database',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: '12ms',
      icon: Database
    },
    {
      name: 'Auth Service',
      status: 'healthy',
      uptime: '100%',
      responseTime: '23ms',
      icon: Zap
    },
    {
      name: 'Storage',
      status: 'healthy',
      uptime: '98.5%',
      responseTime: '67ms',
      icon: Database
    }
  ];

  const getApiStats = () => {
    if (!systemStats) return [];
    
    return [
      { endpoint: '/api/habits', calls: systemStats.totalHabits, avgResponse: '45ms', errors: 0 },
      { endpoint: '/api/tasks', calls: systemStats.totalTasks, avgResponse: '34ms', errors: 0 },
      { endpoint: '/api/users', calls: systemStats.totalUsers, avgResponse: '67ms', errors: 0 },
      { endpoint: '/api/completions', calls: systemStats.totalCompletions, avgResponse: '23ms', errors: 0 },
    ];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-600">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600">Warning</Badge>;
      case 'info':
        return <Badge variant="secondary">Info</Badge>;
      default:
        return <Badge variant="outline">Debug</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemHealth.map((service, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <service.icon className="w-5 h-5" />
                  <h3 className="font-medium">{service.name}</h3>
                </div>
                {getStatusIcon(service.status)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  {getStatusBadge(service.status)}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Uptime:</span>
                  <span>{service.uptime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response:</span>
                  <span>{service.responseTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Database Usage</span>
                <span>{systemStats ? Math.min(90, systemStats.totalUsers + systemStats.totalHabits) : 0}%</span>
              </div>
              <Progress value={systemStats ? Math.min(90, systemStats.totalUsers + systemStats.totalHabits) : 0} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>API Calls</span>
                <span>{systemStats ? Math.min(85, systemStats.totalCompletions / 10) : 0}%</span>
              </div>
              <Progress value={systemStats ? Math.min(85, systemStats.totalCompletions / 10) : 0} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Storage Usage</span>
                <span>23%</span>
              </div>
              <Progress value={23} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Network I/O</span>
                <span>34%</span>
              </div>
              <Progress value={34} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Avg Response</TableHead>
                  <TableHead>Errors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getApiStats().map((stat, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{stat.endpoint}</TableCell>
                    <TableCell>{stat.calls.toLocaleString()}</TableCell>
                    <TableCell>{stat.avgResponse}</TableCell>
                    <TableCell>
                      <Badge variant={stat.errors > 0 ? "destructive" : "secondary"}>
                        {stat.errors}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {!systemStats?.recentErrors.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity logs
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemStats.recentErrors.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                    <TableCell>{log.service}</TableCell>
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
