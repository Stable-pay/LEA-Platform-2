
import { createContext, useContext, useState, useEffect } from 'react';

interface DepartmentUser {
  id: string;
  name: string;
  department: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: DepartmentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (department: string, credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DepartmentUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (user?.token) {
        try {
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            setUser(null);
            localStorage.removeItem('user');
          }
        } catch (error) {
          setUser(null);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [user?.token]);

  const login = async (department: string, credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department, ...credentials })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const userData = await response.json();
      const userWithDepartment = { ...userData, department };
      setUser(userWithDepartment);
      localStorage.setItem('user', JSON.stringify(userWithDepartment));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
