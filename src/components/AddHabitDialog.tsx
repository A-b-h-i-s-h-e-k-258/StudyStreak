
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';

export const AddHabitDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(30);
  const { createHabit, isCreating } = useHabits();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createHabit({ name: name.trim(), goal });
      setName('');
      setGoal(30);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="backdrop-blur-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Habit</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new habit to track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name" className="text-gray-300">Habit Name</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Daily Exercise"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="habit-goal" className="text-gray-300">Monthly Goal</Label>
            <Input
              id="habit-goal"
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              min="1"
              max="31"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-gray-800 border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isCreating ? 'Creating...' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
