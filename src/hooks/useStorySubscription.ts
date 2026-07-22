import { useEffect } from 'react';
import { supabase, isOffline } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import logoSrc from '../assets/tzipur_logo.png';

export function useStorySubscription() {
  const { session } = useAuth();

  useEffect(() => {
    if (isOffline || !session) return;

    // Request notification permissions if we haven't already
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const channel = supabase
      .channel('public:stories')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stories',
          // Note: When backend is ready, you'll filter by family_id or user_id
          // filter: `user_id=eq.${session.user.id}`, 
        },
        (payload) => {
          if (payload.new.status === 'ready') {
            // Trigger browser notification
            if (Notification.permission === 'granted') {
              new Notification('הסיפור שלכם מוכן!', {
                body: 'היכנסו לאפליקציה כדי לקרוא את הסיפור החדש.',
                icon: logoSrc
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);
}
