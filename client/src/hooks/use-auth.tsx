
import { createContext, useContext } from 'react';

const AuthContext = createContext({
  isAuthenticated: true,
  user: { id: '1', name: 'Guest' },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{ isAuthenticated: true, user: { id: '1', name: 'Guest' } }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
