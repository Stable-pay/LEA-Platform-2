
import { useLocation } from 'wouter';

const AuthPage = () => {
  const [, setLocation] = useLocation();
  
  // Redirect to home page
  setLocation('/');
  
  return null;
};

export default AuthPage;
