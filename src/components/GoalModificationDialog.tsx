
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GoalModificationDialogProps {
  taskName: string;
  currentGoal: number;
  onGoalSave: (newGoal: number) => void;
}

export const GoalModificationDialog = ({ taskName, currentGoal, onGoalSave }: GoalModificationDialogProps) => {
  const [goal, setGoal] = useState(currentGoal);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onGoalSave(goal);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setGoal(currentGoal);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10"
        >
          <Settings className="h-4 w-4 mr-1" />
          Edit Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900/95 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Modify Goal - {taskName}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set a new target goal for this task. Enter 0 to disable tracking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="goal" className="text-right text-gray-300">
              Goal
            </Label>
            <Input
              id="goal"
              type="number"
              min="0"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="col-span-3 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Save Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
