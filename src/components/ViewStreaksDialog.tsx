
import { useState } from 'react';
import { Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useHabits } from '@/hooks/useHabits';

interface ViewStreaksDialogProps {
  habitId: string;
  habitName: string;
}

export const ViewStreaksDialog = ({ habitId, habitName }: ViewStreaksDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { completions } = useHabits();

  const getDetailedStreaks = () => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .map(c => new Date(c.completion_date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (habitCompletions.length === 0) {
      return { streaks: [], totalDays: 0, longestStreak: 0 };
    }

    const streaks = [];
    let currentStreak = { start: habitCompletions[0], end: habitCompletions[0], length: 1 };
    
    for (let i = 1; i < habitCompletions.length; i++) {
      const currentDate = new Date(habitCompletions[i]);
      const prevDate = new Date(habitCompletions[i - 1]);
      const daysDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        currentStreak.end = currentDate;
        currentStreak.length++;
      } else {
        streaks.push({ ...currentStreak });
        currentStreak = { start: currentDate, end: currentDate, length: 1 };
      }
    }
    streaks.push({ ...currentStreak });

    const longestStreak = Math.max(...streaks.map(s => s.length));
    
    return {
      streaks: streaks.sort((a, b) => b.length - a.length),
      totalDays: habitCompletions.length,
      longestStreak
    };
  };

  const streakData = getDetailedStreaks();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Streaks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900/95 border-gray-700 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Streak Details - {habitName}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Detailed breakdown of your completion streaks
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Total Days</div>
              <div className="text-xl font-bold text-blue-400">{streakData.totalDays}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Longest Streak</div>
              <div className="text-xl font-bold text-purple-400">{streakData.longestStreak} days</div>
            </div>
          </div>

          {/* Streaks List */}
          <div className="space-y-2">
            <h4 className="text-white font-medium">All Streaks</h4>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {streakData.streaks.length > 0 ? (
                streakData.streaks.map((streak, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-300">
                          {streak.start.toLocaleDateString()} - {streak.end.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {streak.length === 1 ? 'Single day' : `${streak.length} consecutive days`}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-emerald-400">
                        {streak.length}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400">
                  No streaks yet. Start completing this habit to build streaks!
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
