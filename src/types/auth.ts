// /types/auth.ts
export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    photoURL?: string;
  } | null; // <- Aquí está la posibilidad de ser null
  token: string | null;
  expirationTime?: number;
}
