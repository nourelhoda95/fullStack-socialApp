import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { mockApi, initializeMockData } from '../lib/mockApi';
import { toast } from 'sonner@2.0.3';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();

    // Check for existing session
    const currentUser = localStorage.getItem('social_app_current_user');
    const token = localStorage.getItem('social_app_token');

    if (currentUser && token) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser } = await mockApi.login(email, password);
      setUser(loggedInUser);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { user: newUser } = await mockApi.register(data);
      setUser(newUser);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Registration failed. User may already exist.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('social_app_current_user');
    localStorage.removeItem('social_app_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      const updatedUser = mockApi.updateUser(user.id, data);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
