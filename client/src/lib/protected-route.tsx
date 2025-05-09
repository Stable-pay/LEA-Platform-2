
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }

  return <Component {...rest} />;
};
