
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
  profiles?: {
    full_name: string;
  };
}

export const ContentModeration = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch user content with profile information
      const { data, error } = await supabase
        .from('user_content')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching content:', error);
        toast({
          title: "Error",
          description: "Failed to fetch content",
          variant: "destructive"
        });
        return;
      }

      setContent(data || []);
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
      const { error } = await supabase
        .from('user_content')
        .update({
          status,
          moderated_by: (await supabase.auth.getUser()).data.user?.id,
          moderated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (error) {
        console.error('Error moderating content:', error);
        toast({
          title: "Error",
          description: "Failed to moderate content",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setContent(content.map(item => 
        item.id === contentId ? { ...item, status } : item
      ));

      // Log admin action
      await supabase
        .from('admin_logs')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'content_moderation',
          target_type: 'content',
          target_id: contentId,
          details: { action: status }
        });
      
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
    const data = item.content_data;
    switch (item.content_type) {
      case 'habit':
        return `Habit: ${data.name || 'Unknown'}`;
      case 'task':
        return `Task: ${data.title || 'Unknown'}`;
      case 'comment':
        return `Comment: ${data.text?.substring(0, 50) || 'Unknown'}...`;
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
        {content.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No content found for moderation
          </div>
        ) : (
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
                  <TableCell>{item.profiles?.full_name || 'Unknown User'}</TableCell>
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
                              <strong>User:</strong> {item.profiles?.full_name || 'Unknown User'}
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
        )}
      </CardContent>
    </Card>
  );
};
