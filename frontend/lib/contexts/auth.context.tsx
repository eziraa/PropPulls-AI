'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCurrentUserQuery } from '../redux/api/auth.api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Get access token from cookies
  const accessToken = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('access='))?.split('=')[1] : null;
  const { data, error, isLoading } = useGetCurrentUserQuery(
    { accessToken }
  );
    const router = useRouter();
    useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }
    if (error) {
      setUser(null);
      setLoading(false);
      router.push('/login'); // Redirect to login if there's an error
      return;
    }
    if (data) {
      setUser(data);
      setLoading(false);
    }
  }, [data, error, isLoading, router]);


  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
