
import { useState, useEffect } from 'react';
import { Sun, Moon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    // Check if auto mode is enabled from localStorage
    const autoModeEnabled = localStorage.getItem('auto-theme-mode') === 'true';
    setIsAutoMode(autoModeEnabled);
    
    if (autoModeEnabled) {
      applyAutoTheme();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoMode) {
      // Apply immediately when auto mode is enabled
      applyAutoTheme();
      // Check every minute for time changes
      interval = setInterval(applyAutoTheme, 60000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoMode]);

  const applyAutoTheme = () => {
    const currentHour = new Date().getHours();
    console.log('Current hour:', currentHour); // Debug log
    
    // Dark mode from 6 PM (18:00) to 6 AM (06:00)
    const shouldBeDark = currentHour >= 18 || currentHour < 6;
    
    console.log('Should be dark:', shouldBeDark); // Debug log
    setTheme(shouldBeDark ? 'dark' : 'light');
  };

  const toggleAutoMode = () => {
    const newAutoMode = !isAutoMode;
    setIsAutoMode(newAutoMode);
    localStorage.setItem('auto-theme-mode', newAutoMode.toString());
    
    if (newAutoMode) {
      applyAutoTheme();
    }
  };

  const manualThemeToggle = () => {
    if (isAutoMode) {
      setIsAutoMode(false);
      localStorage.setItem('auto-theme-mode', 'false');
    }
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-gray-300 text-white dark:text-gray-700 hover:bg-white/20 dark:hover:bg-gray-100 rounded-full px-4 transition-all duration-300"
        >
          <Sun className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Light Mode</span>
        </Button>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center space-x-2">
      {/* Auto Mode Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleAutoMode}
        className={`backdrop-blur-xl border border-white/20 dark:border-gray-300 rounded-full px-3 transition-all duration-300 hover:scale-105 ${
          isAutoMode 
            ? 'bg-emerald-500/20 text-emerald-400 dark:text-emerald-600 hover:bg-emerald-500/30' 
            : 'bg-white/10 dark:bg-gray-100 text-white dark:text-gray-700 hover:bg-white/20 dark:hover:bg-gray-200'
        }`}
        title={isAutoMode ? 'Auto mode enabled (6PM-6AM = Dark)' : 'Enable auto mode'}
      >
        <Clock className="h-4 w-4" />
      </Button>

      {/* Manual Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={manualThemeToggle}
        className="backdrop-blur-xl bg-white/10 dark:bg-gray-100 border border-white/20 dark:border-gray-300 text-white dark:text-gray-700 hover:bg-white/20 dark:hover:bg-gray-200 rounded-full px-4 transition-all duration-300 hover:scale-105"
      >
        {isDark ? (
          <>
            <Sun className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Dark Mode</span>
          </>
        )}
      </Button>
    </div>
  );
};
