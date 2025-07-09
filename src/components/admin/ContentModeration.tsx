
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ContentItem {
  id: string;
  user_id: string;
  content_type: string;
  content_data: any;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_email?: string;
}

export const ContentModeration = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      // Mock data for demonstration
      const mockContent: ContentItem[] = [
        {
          id: '1',
          user_id: '2',
          content_type: 'habit',
          content_data: { name: 'Morning Exercise', goal: 30 },
          status: 'pending',
          created_at: '2024-01-07T08:30:00Z',
          user_email: 'user1@example.com'
        },
        {
          id: '2',
          user_id: '3',
          content_type: 'task',
          content_data: { title: 'Complete Project', description: 'Finish the web development project' },
          status: 'pending',
          created_at: '2024-01-07T09:15:00Z',
          user_email: 'user2@example.com'
        },
        {
          id: '3',
          user_id: '2',
          content_type: 'comment',
          content_data: { text: 'This is a great habit tracking app!' },
          status: 'approved',
          created_at: '2024-01-06T14:20:00Z',
          user_email: 'user1@example.com'
        }
      ];
      
      setContent(mockContent);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleModerateContent = async (contentId: string, status: 'approved' | 'rejected') => {
    try {
      setContent(content.map(item => 
        item.id === contentId ? { ...item, status } : item
      ));
      
      toast({
        title: "Success",
        description: `Content ${status} successfully`
      });
    } catch (error) {
      console.error('Error moderating content:', error);
      toast({
        title: "Error",
        description: "Failed to moderate content",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const renderContentPreview = (item: ContentItem) => {
    switch (item.content_type) {
      case 'habit':
        return `Habit: ${item.content_data.name}`;
      case 'task':
        return `Task: ${item.content_data.title}`;
      case 'comment':
        return `Comment: ${item.content_data.text?.substring(0, 50)}...`;
      default:
        return 'Unknown content';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            Loading content...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.user_email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.content_type}</Badge>
                </TableCell>
                <TableCell>{renderContentPreview(item)}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Content Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <strong>Type:</strong> {item.content_type}
                          </div>
                          <div>
                            <strong>User:</strong> {item.user_email}
                          </div>
                          <div>
                            <strong>Content:</strong>
                            <pre className="mt-2 p-3 bg-muted rounded text-sm">
                              {JSON.stringify(item.content_data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {item.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleModerateContent(item.id, 'approved')}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleModerateContent(item.id, 'rejected')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
