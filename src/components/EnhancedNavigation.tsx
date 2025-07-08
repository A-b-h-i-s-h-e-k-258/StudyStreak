
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Target, 
  ListTodo, 
  TrendingUp, 
  Trophy, 
  Plus,
  Menu,
  X,
  Share2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from '@/components/UserMenu';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}

interface EnhancedNavigationProps {
  onScrollToSection: (sectionId: string) => void;
  onAddHabit: () => void;
  onAddTask: () => void;
  onShare: () => void;
}

export const EnhancedNavigation = ({ 
  onScrollToSection, 
  onAddHabit, 
  onAddTask, 
  onShare 
}: EnhancedNavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => onScrollToSection('dashboard')
    },
    {
      id: 'habits',
      label: 'Habits',
      icon: Target,
      onClick: () => onScrollToSection('habits')
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: ListTodo,
      onClick: () => onScrollToSection('tasks')
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      onClick: () => onScrollToSection('analytics')
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      onClick: () => onScrollToSection('achievements')
    }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavClick = (item: NavigationItem) => {
    item.onClick();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 dark:bg-white/80 border-b border-white/10 dark:border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <img 
              src="/lovable-uploads/1557131f-39d9-46c7-86a4-dd4813ba9510.png" 
              alt="StudyStreak Logo" 
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 dark:from-emerald-600 dark:to-blue-600 bg-clip-text text-transparent">
              StudyStreak
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavClick(item)}
                  className="text-gray-300 dark:text-gray-700 hover:text-emerald-400 dark:hover:text-emerald-600 hover:bg-white/10 dark:hover:bg-gray-200 transition-all duration-200 group"
                >
                  <IconComponent className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Actions & User Menu */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Quick Action Buttons - Hidden on small screens */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                onClick={onAddHabit}
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white border-0 transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Habit
              </Button>
              
              <Button
                onClick={onAddTask}
                variant="outline"
                size="sm"
                className="border-emerald-500/30 text-emerald-400 dark:text-emerald-600 hover:bg-emerald-500/10 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>

              <Button
                onClick={onShare}
                variant="ghost"
                size="sm"
                className="text-gray-300 dark:text-gray-700 hover:text-emerald-400 dark:hover:text-emerald-600"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <ThemeToggle />
            <UserMenu />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="lg:hidden text-gray-300 dark:text-gray-700 p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-14 sm:top-16 left-0 right-0 backdrop-blur-xl bg-white/10 dark:bg-white/90 border-b border-white/10 dark:border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavClick(item)}
                    className="w-full justify-start text-gray-300 dark:text-gray-700 hover:text-emerald-400 dark:hover:text-emerald-600 hover:bg-white/10 dark:hover:bg-gray-200 py-3"
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Mobile Quick Actions */}
              <div className="pt-3 border-t border-white/10 dark:border-gray-200 space-y-2">
                <Button
                  onClick={() => { onAddHabit(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Habit
                </Button>
                
                <Button
                  onClick={() => { onAddTask(); setIsMobileMenuOpen(false); }}
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 dark:text-emerald-600 py-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
