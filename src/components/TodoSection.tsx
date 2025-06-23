
import { useState } from 'react';
import { Check, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoSectionProps {
  todos: Todo[];
}

export const TodoSection = ({ todos: initialTodos }: TodoSectionProps) => {
  const [todos, setTodos] = useState(initialTodos);

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <div key={todo.id} className="flex items-center justify-between p-3 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                ${todo.completed 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : 'border-gray-400 hover:border-emerald-400'
                }
              `}
            >
              {todo.completed && <Check className="h-3 w-3" />}
            </button>
            <span className={`
              ${todo.completed 
                ? 'text-gray-400 line-through' 
                : 'text-gray-200'
              }
            `}>
              {todo.text}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
