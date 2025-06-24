
import { Check } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

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

  const handleToggleComplete = (todoId: string, currentCompleted: boolean) => {
    const newStatus = currentCompleted ? 'pending' : 'completed';
    updateTaskStatus({ taskId: todoId, status: newStatus });
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tasks scheduled for today. Great job staying on top of things!
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
