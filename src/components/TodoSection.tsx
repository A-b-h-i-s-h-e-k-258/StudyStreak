
import { Check } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoSectionProps {
  todos: Todo[];
}

export const TodoSection = ({ todos }: TodoSectionProps) => {
  const { updateTaskStatus, isUpdating } = useTasks();
  const { toggleCompletion, habits, completions } = useHabits();

  const handleToggleComplete = async (todoId: string, currentCompleted: boolean) => {
    const newStatus = currentCompleted ? 'pending' : 'completed';
    
    // Update task status
    updateTaskStatus({ taskId: todoId, status: newStatus });
    
    // If marking as completed, also sync with activity heatmap for today
    if (!currentCompleted) {
      const today = new Date().toISOString().split('T')[0];
      
      // Find the corresponding habit for this task
      // For now, we'll try to match by name similarity or create a mapping
      const matchingHabit = habits.find(habit => 
        habit.name.toLowerCase().includes(todos.find(t => t.id === todoId)?.text.toLowerCase() || '')
      );
      
      if (matchingHabit) {
        // Check if today is already marked as completed for this habit
        const isAlreadyCompleted = completions.some(c => 
          c.habit_id === matchingHabit.id && 
          c.completion_date === today
        );
        
        if (!isAlreadyCompleted) {
          toggleCompletion({ habitId: matchingHabit.id, date: today });
        }
      }
      
      console.log(`Task ${todoId} completed on ${today} - syncing with activity heatmap`);
    } else {
      // If unchecking a task, also remove from habit tracking
      const today = new Date().toISOString().split('T')[0];
      const matchingHabit = habits.find(habit => 
        habit.name.toLowerCase().includes(todos.find(t => t.id === todoId)?.text.toLowerCase() || '')
      );
      
      if (matchingHabit) {
        const isCompleted = completions.some(c => 
          c.habit_id === matchingHabit.id && 
          c.completion_date === today
        );
        
        if (isCompleted) {
          toggleCompletion({ habitId: matchingHabit.id, date: today });
        }
      }
    }
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tasks yet. Create your first task to get started!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => {
        // Check if this task is also completed in habits for today
        const today = new Date().toISOString().split('T')[0];
        const matchingHabit = habits.find(habit => 
          habit.name.toLowerCase().includes(todo.text.toLowerCase())
        );
        const isHabitCompleted = matchingHabit ? completions.some(c => 
          c.habit_id === matchingHabit.id && 
          c.completion_date === today
        ) : false;
        
        // Use either task completion or habit completion status
        const isCompleted = todo.completed || isHabitCompleted;
        
        return (
          <div
            key={todo.id}
            className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <button
              onClick={() => handleToggleComplete(todo.id, isCompleted)}
              disabled={isUpdating}
              className={`
                flex items-center justify-center w-5 h-5 rounded border-2 transition-all
                ${isCompleted
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-gray-400 hover:border-emerald-400'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isCompleted && <Check className="w-3 h-3" />}
            </button>
            <span
              className={`flex-1 ${
                isCompleted
                  ? 'text-gray-400 line-through'
                  : 'text-gray-200'
              }`}
            >
              {todo.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
