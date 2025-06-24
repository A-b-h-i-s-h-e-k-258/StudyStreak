
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  goal: number;
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: { 
      title: string; 
      description?: string; 
      goal?: number;
      due_date?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title,
          description: newTask.description,
          goal: newTask.goal || 1,
          due_date: newTask.due_date,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update task status mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { 
      taskId: string; 
      status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get today's tasks
  const todaysTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.due_date === today;
  });

  return {
    tasks,
    todaysTasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTaskStatus: updateTaskStatusMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskStatusMutation.isPending,
  };
};
