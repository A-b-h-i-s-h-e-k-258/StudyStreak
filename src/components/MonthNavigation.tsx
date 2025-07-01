import { ChevronLeft, ChevronRight, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/hooks/useHabits';
import { useToast } from '@/hooks/use-toast';
interface MonthNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}
export const MonthNavigation = ({
  currentDate,
  onDateChange
}: MonthNavigationProps) => {
  const {
    habits,
    completions
  } = useHabits();
  const {
    toast
  } = useToast();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };
  const goToCurrentMonth = () => {
    onDateChange(new Date());
  };
  const isCurrentMonth = () => {
    const now = new Date();
    return currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear();
  };
  const exportProgress = () => {
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const exportData = {
      month: monthKey,
      monthName: `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
      exportDate: new Date().toISOString(),
      habits: habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        goal: habit.goal,
        completed: habit.completed,
        completions: completions.filter(c => c.habit_id === habit.id).filter(c => {
          const completionDate = new Date(c.completion_date);
          return completionDate.getMonth() === currentDate.getMonth() && completionDate.getFullYear() === currentDate.getFullYear();
        }).map(c => c.completion_date)
      }))
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-progress-${monthKey}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Export Complete",
      description: `Progress data for ${months[currentDate.getMonth()]} ${currentDate.getFullYear()} has been downloaded.`
    });
  };
  const viewTrends = () => {
    // For now, just show a toast. This could be expanded to open a trends modal
    toast({
      title: "Coming Soon",
      description: "Detailed trends and streak analysis will be available soon!"
    });
  };
  return <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')} className="text-gray-300 hover:text-white transition-all duration-200 bg-stone-950 hover:bg-stone-800">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center min-w-[180px]">
          <h2 className="text-xl font-semibold text-stone-950">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')} className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        {!isCurrentMonth() && <Button variant="outline" size="sm" onClick={goToCurrentMonth} className="bg-emerald-600/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 transition-all duration-200">
            Today
          </Button>}
        
        <Button variant="ghost" size="sm" onClick={viewTrends} className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Trends</span>
        </Button>
        
        <Button variant="ghost" size="sm" onClick={exportProgress} className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Export</span>
        </Button>
      </div>
    </div>;
};