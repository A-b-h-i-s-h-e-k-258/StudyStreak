
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ChatbaseResponse {
  hash: string;
  userId: string;
  userEmail: string;
}

export const useChatbase = () => {
  const { user, session } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !session) {
      return;
    }

    const initializeChatbase = async () => {
      try {
        // Generate hash for authenticated user
        const { data, error } = await supabase.functions.invoke('generate-chatbase-hash');
        
        if (error) {
          console.error('Error generating Chatbase hash:', error);
          setError('Failed to initialize chat');
          return;
        }

        const { hash, userId, userEmail } = data as ChatbaseResponse;

        // Load Chatbase script if not already loaded
        if (!document.getElementById('nEqARrXrtx00fjML66dey')) {
          const script = document.createElement('script');
          script.src = 'https://www.chatbase.co/embed.min.js';
          script.id = 'nEqARrXrtx00fjML66dey';
          script.setAttribute('domain', 'www.chatbase.co');
          
          script.onload = () => {
            // Initialize Chatbase with user authentication
            if (window.chatbase) {
              window.chatbase('init', {
                chatbotId: 'nEqARrXrtx00fjML66dey',
                domain: 'www.chatbase.co',
                userId: userId,
                userHash: hash,
                userName: userEmail,
              });
              setIsLoaded(true);
            }
          };

          script.onerror = () => {
            setError('Failed to load chat widget');
          };

          document.body.appendChild(script);
        } else {
          // Script already loaded, just initialize
          if (window.chatbase) {
            window.chatbase('init', {
              chatbotId: 'nEqARrXrtx00fjML66dey',
              domain: 'www.chatbase.co',
              userId: userId,
              userHash: hash,
              userName: userEmail,
            });
            setIsLoaded(true);
          }
        }
      } catch (err) {
        console.error('Chatbase initialization error:', err);
        setError('Chat initialization failed');
      }
    };

    initializeChatbase();
  }, [user, session]);

  return { isLoaded, error };
};

// Extend window object for TypeScript
declare global {
  interface Window {
    chatbase: any;
  }
}
