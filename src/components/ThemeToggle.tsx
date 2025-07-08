
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-gray-300 text-white dark:text-gray-700 hover:bg-white/20 dark:hover:bg-gray-100 rounded-full px-4 transition-all duration-300"
      >
        <Sun className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">Light</span>
      </Button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleTheme} 
      className="backdrop-blur-xl bg-white/10 dark:bg-gray-100 border border-white/20 dark:border-gray-300 text-white dark:text-gray-700 hover:bg-white/20 dark:hover:bg-gray-200 rounded-full px-4 transition-all duration-300 hover:scale-105"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium hidden sm:inline">Dark</span>
        </>
      )}
    </Button>
  );
};
