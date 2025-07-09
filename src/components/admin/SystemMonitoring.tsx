
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Server, Database, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const SystemMonitoring = () => {
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
      status: 'warning',
      uptime: '98.5%',
      responseTime: '67ms',
      icon: Database
    }
  ];

  const errorLogs = [
    {
      id: '1',
      timestamp: '2024-01-07 10:30:00',
      level: 'error',
      message: 'Database connection timeout',
      service: 'API Server'
    },
    {
      id: '2',
      timestamp: '2024-01-07 09:15:00',
      level: 'warning',
      message: 'High memory usage detected',
      service: 'Database'
    },
    {
      id: '3',
      timestamp: '2024-01-07 08:45:00',
      level: 'error',
      message: 'Authentication service rate limit exceeded',
      service: 'Auth Service'
    },
    {
      id: '4',
      timestamp: '2024-01-07 07:20:00',
      level: 'info',
      message: 'Scheduled backup completed successfully',
      service: 'Storage'
    }
  ];

  const apiStats = [
    { endpoint: '/api/habits', calls: 1247, avgResponse: '45ms', errors: 3 },
    { endpoint: '/api/auth', calls: 892, avgResponse: '23ms', errors: 1 },
    { endpoint: '/api/users', calls: 567, avgResponse: '67ms', errors: 0 },
    { endpoint: '/api/tasks', calls: 334, avgResponse: '34ms', errors: 2 },
  ];

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
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <Progress value={45} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Memory Usage</span>
                <span>67%</span>
              </div>
              <Progress value={67} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Disk Usage</span>
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
                  <TableHead>Calls</TableHead>
                  <TableHead>Avg Response</TableHead>
                  <TableHead>Errors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiStats.map((stat, index) => (
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
          <CardTitle>Recent Error Logs</CardTitle>
        </CardHeader>
        <CardContent>
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
              {errorLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                  <TableCell>{log.service}</TableCell>
                  <TableCell>{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
