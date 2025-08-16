import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { initializeDemoData } from '@/utils/demoData';

interface AuthContextType {
  auth: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Initialize demo data
    initializeDemoData();
    
    // Check for existing session on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuth({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('user');
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const authUser: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: new Date(user.createdAt),
      };

      setAuth({
        user: authUser,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem('user', JSON.stringify(authUser));
      return true;
    }

    return false;
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.some((u: any) => u.username === credentials.username)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const authUser: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: new Date(newUser.createdAt),
    };

    setAuth({
      user: authUser,
      isAuthenticated: true,
      isLoading: false,
    });

    localStorage.setItem('user', JSON.stringify(authUser));
    return true;
  };

  const logout = () => {
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};