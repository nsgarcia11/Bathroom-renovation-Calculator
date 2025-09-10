import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Subscription } from '@/types';

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async (): Promise<Subscription | null> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Subscription fetch error:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Subscription fetch error:', error);
        return null;
      }
    },
    retry: false,
  });
}

export function useHasActiveSubscription() {
  const { data: subscription } = useSubscription();
  return subscription?.status === 'active';
}
