
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Habit {
  id: string;
  name: string;
  goal: number;
  completed: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completion_date: string;
  created_at: string;
}

export const useHabits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch habits
  const { data: habits = [], isLoading, error } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch ALL habit completions (not just current month)
  const { data: completions = [] } = useQuery({
    queryKey: ['habit_completions', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completion_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Create habit mutation
  const createHabitMutation = useMutation({
    mutationFn: async (newHabit: { name: string; goal: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name: newHabit.name,
          goal: newHabit.goal,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
      toast({
        title: "Success",
        description: "Habit created successfully!",
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

  // Toggle habit completion mutation
  const toggleCompletionMutation = useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Check if completion already exists
      const { data: existing } = await supabase
        .from('habit_completions')
        .select('id')
        .eq('habit_id', habitId)
        .eq('completion_date', date)
        .eq('user_id', user.id)
        .single();
      
      if (existing) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add completion
        const { data, error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completion_date: date,
          })
          .select()
          .single();
        if (error) throw error;
        return { action: 'added', data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit_completions', user?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate completed count for each habit for the current month
  const getCurrentMonthCompletions = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return completions.filter(c => {
      const completionDate = new Date(c.completion_date);
      return completionDate >= startOfMonth && completionDate <= endOfMonth;
    });
  };

  const currentMonthCompletions = getCurrentMonthCompletions();
  
  const habitsWithProgress = habits.map(habit => {
    const habitCompletions = currentMonthCompletions.filter(c => c.habit_id === habit.id);
    return {
      ...habit,
      completed: habitCompletions.length,
    };
  });

  return {
    habits: habitsWithProgress,
    completions, // Return ALL completions, not just current month
    isLoading,
    error,
    createHabit: createHabitMutation.mutate,
    toggleCompletion: toggleCompletionMutation.mutate,
    isCreating: createHabitMutation.isPending,
    isToggling: toggleCompletionMutation.isPending,
  };
};
