
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation('/auth');
    return null;
  }

  return <Component {...rest} />;
};
