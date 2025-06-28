
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useHabitUpdates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update habit goal mutation
  const updateHabitGoalMutation = useMutation({
    mutationFn: async ({ habitId, newGoal }: { habitId: string; newGoal: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('habits')
        .update({ goal: newGoal, updated_at: new Date().toISOString() })
        .eq('id', habitId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
      toast({
        title: "Success",
        description: "Goal updated successfully!",
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

  return {
    updateHabitGoal: updateHabitGoalMutation.mutate,
    isUpdating: updateHabitGoalMutation.isPending,
  };
};
