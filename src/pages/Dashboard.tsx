
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-50 dark:via-gray-100 dark:to-gray-50 flex items-center justify-center">
        <div className="text-white dark:text-black">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
              onClick={handleSignOut}
              disabled={signingOut}
              variant="outline"
              className="text-gray-300 dark:text-gray-700 border-gray-600 dark:border-gray-300 hover:bg-white/10 dark:hover:bg-gray-100"
            >
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-xl bg-white/5 dark:bg-white/80 rounded-2xl border border-white/10 dark:border-gray-200 p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white dark:text-black mb-6">
            Welcome to your Dashboard!
          </h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/10 dark:bg-white/60 border border-white/20 dark:border-gray-200">
              <h2 className="text-lg font-semibold text-white dark:text-black mb-2">User Information</h2>
              <p className="text-gray-300 dark:text-gray-700">
                <strong>Name:</strong> {user.user_metadata?.full_name || 'Not provided'}
              </p>
              <p className="text-gray-300 dark:text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-white/10 dark:bg-white/60 border border-white/20 dark:border-gray-200">
              <h2 className="text-lg font-semibold text-white dark:text-black mb-2">Quick Actions</h2>
              <p className="text-gray-300 dark:text-gray-700">
                Your study tracking dashboard will be available here soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
