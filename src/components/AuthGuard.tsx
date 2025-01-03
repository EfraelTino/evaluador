import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { loading, session } = useAuth(true);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return session ? <>{children}</> : null;
};