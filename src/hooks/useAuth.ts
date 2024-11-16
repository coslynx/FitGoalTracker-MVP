import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { User } from '../../api/models/userModel';

interface UserLoginData {
  email: string;
  password: string;
}

const useAuth = (): {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: UserLoginData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: UserLoginData) => {
    setLoading(true);
    setError(null);
    try {
      const token = await authService.loginUser(credentials);
      localStorage.setItem('token', token);
      const user = await authService.getUserProfile();
      setUser(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logoutUser();
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const user = await authService.getUserProfile();
          setUser(user);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [logout]);

  const isAuthenticated = !!user;

  return { user, isAuthenticated, login, logout, loading, error };
};

export default useAuth;
```