
import { useEffect } from 'react';
import { useChatbase } from '@/hooks/useChatbase';
import { useAuth } from '@/hooks/useAuth';

export const ChatbaseWidget = () => {
  const { user } = useAuth();
  const { isLoaded, error } = useChatbase();

  useEffect(() => {
    // Add the Chatbase initialization script to the document head
    if (user && !document.querySelector('script[data-chatbase-init]')) {
      const initScript = document.createElement('script');
      initScript.setAttribute('data-chatbase-init', 'true');
      initScript.innerHTML = `
        (function(){
          if(!window.chatbase||window.chatbase("getState")!=="initialized"){
            window.chatbase=(...arguments)=>{
              if(!window.chatbase.q){window.chatbase.q=[]}
              window.chatbase.q.push(arguments)
            };
            window.chatbase=new Proxy(window.chatbase,{
              get(target,prop){
                if(prop==="q"){return target.q}
                return(...args)=>target(prop,...args)
              }
            })
          }
        })();
      `;
      document.head.appendChild(initScript);
    }
  }, [user]);

  // Only render for authenticated users
  if (!user) {
    return null;
  }

  // Show error message if initialization failed
  if (error) {
    console.error('Chatbase error:', error);
    return null; // Fail silently in production
  }

  // Widget loads automatically via the hook, no visual component needed
  return null;
};
