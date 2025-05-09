
import { createContext, useContext, useState } from 'react';

interface DepartmentUser {
  id: string;
  name: string;
  department: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: DepartmentUser | null;
  login: (department: string, credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DepartmentUser | null>(null);

  const login = async (department: string, credentials: any) => {
    // Simulate API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department, ...credentials })
    });

    if (response.ok) {
      const userData = await response.json();
      setUser({ ...userData, department });
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
