
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Github, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Check if we're in an iframe
  const isInIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  // Get safe redirect URL for iframe contexts
  const getSafeRedirectUrl = () => {
    try {
      if (isInIframe()) {
        // In iframe, use the current origin without trying to access parent
        return window.location.origin;
      }
      return window.location.origin;
    } catch (e) {
      return window.location.origin;
    }
  };

  useEffect(() => {
    console.log('Auth page loaded, checking existing session...');

    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Existing session found:', !!session?.user);
        if (session) {
          // Check if user is admin
          const { data: isAdmin } = await supabase
            .rpc('is_admin', { user_id: session.user.id });
          
          if (isAdmin) {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleEmailAuth = async (type: 'signin' | 'signup') => {
    setLoading(true);
    try {
      const redirectUrl = getSafeRedirectUrl();
      
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your signup."
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        // Check if user is admin after successful login
        if (data.user) {
          const { data: isAdmin } = await supabase
            .rpc('is_admin', { user_id: data.user.id });
          
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in."
          });
          
          if (isAdmin) {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    console.log('Starting Google OAuth flow...');
    setLoading(true);
    
    try {
      const inIframe = isInIframe();
      console.log('Is in iframe:', inIframe);

      if (inIframe) {
        // In iframe, show warning and suggest opening in new tab
        toast({
          title: "Preview Mode Limitation",
          description: "Google sign-in works best when opened in a new tab. Please try the email/password option instead.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const redirectUrl = getSafeRedirectUrl();
      console.log('Redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }

      console.log('Google OAuth initiated successfully');
      // Don't set loading to false here - the page will redirect
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: "Authentication Error",
        description: "Please try using email/password sign-in instead.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'github' | 'google') => {
    if (provider === 'google') {
      await handleGoogleAuth();
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = getSafeRedirectUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('/lovable-uploads/0153d363-cf53-44c8-9fae-b429bfd52c74.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Card className="w-full max-w-md bg-gray-900/95 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/1557131f-39d9-46c7-86a4-dd4813ba9510.png" 
              alt="StudyStreak Logo" 
              className="h-12 w-12"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-50">Welcome to StudyStreak</CardTitle>
          <CardDescription className="text-gray-400">
            Track your habits and achieve your goals
          </CardDescription>
          {isInIframe() && (
            <div className="mt-2 text-xs text-yellow-400 bg-yellow-900/20 rounded p-2">
              Preview mode: For best experience with social sign-in, open in a new tab.
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="signin" className="text-gray-300">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-gray-300">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-gray-300">Email</Label>
                <Input 
                  id="signin-email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="bg-gray-800 border-gray-600 text-white" 
                  placeholder="Enter your email" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-gray-300">Password</Label>
                <Input 
                  id="signin-password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-gray-800 border-gray-600 text-white" 
                  placeholder="Enter your password" 
                />
              </div>
              <Button 
                onClick={() => handleEmailAuth('signin')} 
                disabled={loading} 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-gray-300">Full Name</Label>
                <Input 
                  id="signup-name" 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="bg-gray-800 border-gray-600 text-white" 
                  placeholder="Enter your full name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="bg-gray-800 border-gray-600 text-white" 
                  placeholder="Enter your email" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-gray-800 border-gray-600 text-white" 
                  placeholder="Create a password" 
                />
              </div>
              <Button 
                onClick={() => handleEmailAuth('signup')} 
                disabled={loading} 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <Button 
                variant="outline" 
                onClick={handleGoogleAuth} 
                disabled={loading} 
                className="w-full bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
