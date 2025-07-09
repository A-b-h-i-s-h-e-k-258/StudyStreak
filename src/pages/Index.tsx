
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedNavigation } from '@/components/EnhancedNavigation';
import { DashboardSection } from '@/components/sections/DashboardSection';
import { HabitsSection } from '@/components/sections/HabitsSection';
import { HabitBreakdownSection } from '@/components/sections/HabitBreakdownSection';
import { AnalyticsSection } from '@/components/sections/AnalyticsSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { MonthlyActivityGrid } from '@/components/MonthlyActivityGrid';
import { QRSection } from '@/components/QRSection';
import { Footer } from '@/components/Footer';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { ChatbaseWidget } from '@/components/ChatbaseWidget';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useHabits } from '@/hooks/useHabits';
import { useScrollNavigation } from '@/hooks/useScrollNavigation';
import { useAddHabitDialog } from '@/hooks/useAddHabitDialog';

const Index = () => {
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const qrSectionRef = useRef<HTMLDivElement>(null);
  const { habits, completions, isLoading: habitsLoading } = useHabits();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { scrollToSection } = useScrollNavigation();
  const { isOpen: isAddHabitDialogOpen, openDialog: openAddHabitDialog, closeDialog: closeAddHabitDialog } = useAddHabitDialog();

  const scrollToQRSection = () => {
    qrSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    console.log('Auth state:', { user: !!user, loading, isInitialLoad });
    
    const authCheckTimer = setTimeout(() => {
      if (!loading) {
        setIsInitialLoad(false);
        if (!user) {
          console.log('No user found, redirecting to auth');
          navigate('/auth');
        }
      }
    }, 100);

    return () => clearTimeout(authCheckTimer);
  }, [user, loading, navigate, isInitialLoad]);

  if (loading || isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-50 dark:via-gray-100 dark:to-gray-50 flex items-center justify-center">
        <div className="text-white dark:text-black">Loading...</div>
      </div>
    );
  }

  if (habitsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-50 dark:via-gray-100 dark:to-gray-50 flex items-center justify-center">
        <div className="text-white dark:text-black">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getHabitsWithSelectedMonthProgress = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return habits.map(habit => {
      const monthCompletions = completions.filter(c => {
        if (c.habit_id !== habit.id) return false;
        const completionDate = new Date(c.completion_date);
        return completionDate >= startOfMonth && completionDate <= endOfMonth;
      }).length;
      return {
        ...habit,
        completed: monthCompletions
      };
    });
  };

  const habitsWithSelectedMonthProgress = getHabitsWithSelectedMonthProgress();
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-50 dark:via-gray-100 dark:to-gray-50 text-white dark:text-black transition-colors duration-300">
      {/* Enhanced Navigation */}
      <EnhancedNavigation
        onScrollToSection={scrollToSection}
        onAddHabit={openAddHabitDialog}
        onShare={scrollToQRSection}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Dashboard Section */}
          <DashboardSection displayName={displayName} />

          {/* Monthly Activity Grid */}
          <div className="w-full overflow-hidden">
            <MonthlyActivityGrid currentDate={currentDate} onDateChange={setCurrentDate} />
          </div>

          {/* Achievements Section */}
          <AchievementsSection />

          {/* Analytics Section */}
          <AnalyticsSection 
            habitsWithSelectedMonthProgress={habitsWithSelectedMonthProgress}
            currentDate={currentDate}
          />

          {/* Habits Section */}
          <HabitsSection 
            habits={habitsWithSelectedMonthProgress}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />

          {/* Habit Breakdown Section */}
          <HabitBreakdownSection 
            habits={habitsWithSelectedMonthProgress}
            currentDate={currentDate}
          />

          {/* QR Code Section */}
          <QRSection ref={qrSectionRef} />
        </div>
      </div>

      {/* Dialogs */}
      <AddHabitDialog 
        open={isAddHabitDialogOpen}
        onOpenChange={closeAddHabitDialog}
      />

      {/* Chatbase Widget - Only for authenticated users */}
      <ChatbaseWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
