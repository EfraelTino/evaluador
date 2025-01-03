// /types/auth.ts
export interface AuthSession {
    user: {
      id: string;
      email: string;
      name: string;
      photoURL?: string;
    } | null;
    token: string | null;
    expirationTime?: number;
  }
  