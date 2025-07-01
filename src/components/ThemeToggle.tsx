
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

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-full px-4 transition-all duration-300"
      >
        <Sun className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">Light Mode</span>
      </Button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 text-white dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10 rounded-full px-4 transition-all duration-300 hover:scale-105"
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
  );
};
