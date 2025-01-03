import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';

export const useAuth = (requireAuth: boolean = true) => {
  const { session, loading, error, validateAndRefreshSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      if (session?.token) {
        const isValid = await validateAndRefreshSession();
        if (!isValid && requireAuth) {
          router.push('/data');
        }
      } else if (requireAuth) {
        router.push('/');
      }
    };

    validateSession();
  }, [session, requireAuth, router, validateAndRefreshSession]);

  return { session, loading, error };
};