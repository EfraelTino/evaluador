import { 
    onIdTokenChanged
  } from 'firebase/auth';
  import { auth } from '@/config/firebase';
  import { AuthSession } from '../types/auth';
  
  export class AuthService {
    static async getToken(): Promise<string | null> {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return null;
        return await currentUser.getIdToken(true);
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    }
  
    static async validateToken(token: string): Promise<boolean> {
      try {
        // Aquí podrías agregar validación adicional del token con tu backend
        const currentUser = auth.currentUser;
        if (!currentUser) return false;
        
        const newToken = await currentUser.getIdToken();
        return token === newToken;
      } catch {
        return false;
      }
    }
  
    static async refreshSession(): Promise<AuthSession | null> {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
  
      const token = await this.getToken();
      if (!token) return null;
  
      return {
        user: {
          id: currentUser.uid,
          email: currentUser.email || '',
          name: currentUser.displayName || '',
          photoURL: currentUser.photoURL || undefined
        },
        token,
        expirationTime: new Date().getTime() + (60 * 60 * 1000) // 1 hora
      };
    }
  
    static subscribeToAuthChanges(callback: (session: AuthSession | null) => void) {
        return onIdTokenChanged(auth, async (user) => {
          console.log("Auth state changed:", user);
          if (user) {
            const session = await this.refreshSession();
            console.log("Session refreshed:", session);
            callback(session);
          } else {
            console.log("No user found");
            callback(null);
          }
        });
      }
      
  }
  