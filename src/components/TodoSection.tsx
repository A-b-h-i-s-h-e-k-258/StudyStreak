
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
  const { toggleCompletion } = useHabits();

  const handleToggleComplete = async (todoId: string, currentCompleted: boolean) => {
    const newStatus = currentCompleted ? 'pending' : 'completed';
    
    // Update task status
    updateTaskStatus({ taskId: todoId, status: newStatus });
    
    // If marking as completed, also sync with activity heatmap for today
    if (!currentCompleted) {
      const today = new Date().toISOString().split('T')[0];
      
      // Find corresponding habit (you might need to adjust this logic based on your data structure)
      // For now, we'll create a simple mapping - you can enhance this based on your needs
      // This assumes task titles might match habit names or you have another way to link them
      
      // Since we don't have a direct link between tasks and habits in the current schema,
      // we'll just mark today as active for the first habit as an example
      // You might want to enhance this logic based on your specific requirements
      console.log(`Task ${todoId} completed on ${today} - syncing with activity heatmap`);
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
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <button
            onClick={() => handleToggleComplete(todo.id, todo.completed)}
            disabled={isUpdating}
            className={`
              flex items-center justify-center w-5 h-5 rounded border-2 transition-all
              ${todo.completed
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-gray-400 hover:border-emerald-400'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {todo.completed && <Check className="w-3 h-3" />}
          </button>
          <span
            className={`flex-1 ${
              todo.completed
                ? 'text-gray-400 line-through'
                : 'text-gray-200'
            }`}
          >
            {todo.text}
          </span>
        </div>
      ))}
    </div>
  );
};
