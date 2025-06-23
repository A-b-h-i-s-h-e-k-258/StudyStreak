
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskBreakdownItem {
  id: string;
  name: string;
  completions: number;
  goal: number;
  currentStreak: number;
  bestStreak: number;
  activeDays: number;
}

export const TaskBreakdownSection = () => {
  const tasks: TaskBreakdownItem[] = [
    {
      id: 'cp-contest',
      name: 'CP Contest',
      completions: 0,
      goal: 10,
      currentStreak: 0,
      bestStreak: 0,
      activeDays: 0,
    },
    {
      id: 'cp-31-prob',
      name: 'CP-31 3 Prob',
      completions: 0,
      goal: 30,
      currentStreak: 0,
      bestStreak: 0,
      activeDays: 0,
    },
    {
      id: 'lc-3-prob',
      name: 'LC 3 Prob',
      completions: 0,
      goal: 30,
      currentStreak: 0,
      bestStreak: 0,
      activeDays: 0,
    },
    {
      id: 'lc-potd',
      name: 'LC POTD',
      completions: 0,
      goal: 30,
      currentStreak: 0,
      bestStreak: 0,
      activeDays: 0,
    },
    {
      id: 'web-dev',
      name: 'Web Dev',
      completions: 0,
      goal: 20,
      currentStreak: 0,
      bestStreak: 0,
      activeDays: 0,
    },
  ];

  const getCompletionPercentage = (completions: number, goal: number) => {
    return Math.round((completions / goal) * 100);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          {/* Task Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{task.name}</h3>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Streaks
              </Button>
              <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                {getCompletionPercentage(task.completions, task.goal)}% Complete
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-6 mb-4">
            <div>
              <div className="text-sm text-gray-400">Completions</div>
              <div className="text-blue-400 font-medium">
                {task.completions}/{task.goal}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Current Streak</div>
              <div className="text-emerald-400 font-medium">
                {task.currentStreak} days
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Best Streak</div>
              <div className="text-purple-400 font-medium">
                {task.bestStreak} days
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Active Days</div>
              <div className="text-orange-400 font-medium">
                {task.activeDays} days
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Progress</div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(task.completions / task.goal) * 100}%` }}
              />
            </div>
            <div className="text-right text-xs text-gray-400">
              {task.completions}/{task.goal} goal
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
