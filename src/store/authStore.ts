import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { AuthService } from '../services/auth.service';
import { AuthSession } from '../types/auth';

interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
  validateAndRefreshSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      loading: false,
      error: null,
      isInitialized: false,

      signInWithGoogle: async () => {
        try {
          set({ loading: true, error: null });
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          const session = await AuthService.refreshSession();
          console.log('Sesión después de iniciar sesión con Google:', session);
          set({ session });
        } catch (error) {
          console.error('Error al iniciar sesión con Google:', error);
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null });
          await signOut(auth);
          console.log('Usuario ha cerrado sesión.');
          set({ session: null });
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      initialize: async () => {
        console.log('Inicializando AuthStore...');
        try {
          const { session } = get();
          console.log('Estado inicial del store:', session);

          if (session?.token) {
            console.log('Token detectado, validando...');
            const isValid = await AuthService.validateToken(session.token);
            console.log('¿Token válido?', isValid);

            if (isValid) {
              set({ session, isInitialized: true });
              console.log('Sesión válida, inicialización completa.');
              return;
            }
          }

          console.log('No hay sesión válida, suscribiéndose a cambios de autenticación...');
          const unsubscribe = AuthService.subscribeToAuthChanges((newSession) => {
            console.log('Cambio detectado por AuthService:', newSession);
            set({
              session: newSession,
              loading: false,
              isInitialized: true,
            });
          });

          // Limpia la suscripción al desmontar
          return () => {
            console.log('Desuscribiendo cambios...');
            unsubscribe();
            set({ isInitialized: true });
          };
        } catch (error) {
          console.error('Error durante la inicialización:', error);
          set({ error: (error as Error).message, isInitialized: true });
        }
      },

      validateAndRefreshSession: async () => {
        const { session } = get();
        if (!session?.token) {
          console.log('No hay token en la sesión.');
          return false;
        }

        try {
          const isValid = await AuthService.validateToken(session.token);
          if (!isValid) {
            console.log('Token inválido, refrescando sesión...');
            const newSession = await AuthService.refreshSession();
            console.log('Nueva sesión después de refrescar:', newSession);
            set({ session: newSession });
            return !!newSession;
          }

          console.log('El token es válido.');
          return true;
        } catch (error) {
          console.error('Error al validar o refrescar el token:', error);
          set({ error: (error as Error).message });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ session: state.session }),
    }
  )
);
