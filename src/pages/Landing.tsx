
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const Landing = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-50 dark:via-gray-100 dark:to-gray-50">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 dark:bg-white/80 border-b border-white/10 dark:border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/1557131f-39d9-46c7-86a4-dd4813ba9510.png" 
                alt="StudyStreak Logo" 
                className="h-8 w-8"
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 dark:from-emerald-600 dark:to-blue-600 bg-clip-text text-transparent">
                StudyStreak
              </h1>
            </div>
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? 'Signing in...' : 'Sign In with Google'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl font-bold text-white dark:text-black mb-6">
            Welcome to <span className="bg-gradient-to-r from-emerald-400 to-blue-400 dark:from-emerald-600 dark:to-blue-600 bg-clip-text text-transparent">StudyStreak</span>
          </h1>
          <p className="text-xl text-gray-300 dark:text-gray-600 mb-8">
            Track your habits, achieve your goals, and build lasting study streaks.
          </p>
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4"
          >
            {loading ? 'Getting Started...' : 'Get Started'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
