import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { authApi } from '../api/client';

interface AuthContextType {
  currentUser: UserProfile | null;
  activeRole: UserRole;
  availableUsers: UserProfile[];
  isLoading: boolean;
  switchRole: (role: UserRole) => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('rebuild_demo_role') as UserRole) || 'CITIZEN';
  });
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const users = await authApi.getUsers();
        setAvailableUsers(users);

        const savedRole = (localStorage.getItem('rebuild_demo_role') as UserRole) || 'CITIZEN';
        const savedUserId = localStorage.getItem('rebuild_demo_user_id');

        let matched = users.find((u) => u.id === savedUserId);
        if (!matched) {
          matched = users.find((u) => u.role === savedRole) || users[0];
        }

        if (matched) {
          setCurrentUser(matched);
          setActiveRole(matched.role);
          localStorage.setItem('rebuild_demo_role', matched.role);
          localStorage.setItem('rebuild_demo_user_id', matched.id);
        }
      } catch (err) {
        console.warn('Failed to fetch demo users from backend, using fallback demo state', err);
        const fallback: UserProfile = {
          id: 'usr-cit-01',
          email: 'citizen@rebuildmysore.org',
          name: 'Aarav Sharma',
          role: 'CITIZEN',
          organization: 'Resident, Kuvempunagar'
        };
        setCurrentUser(fallback);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const switchRole = async (newRole: UserRole) => {
    setIsLoading(true);
    try {
      const match = availableUsers.find((u) => u.role === newRole);
      if (match) {
        setCurrentUser(match);
        setActiveRole(newRole);
        localStorage.setItem('rebuild_demo_role', newRole);
        localStorage.setItem('rebuild_demo_user_id', match.id);
      } else {
        const updated = await authApi.switchUser(newRole);
        setCurrentUser(updated);
        setActiveRole(newRole);
        localStorage.setItem('rebuild_demo_role', newRole);
        localStorage.setItem('rebuild_demo_user_id', updated.id);
      }
    } catch (err) {
      console.error('Failed to switch role', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const match = availableUsers.find((u) => u.id === userId);
      if (match) {
        setCurrentUser(match);
        setActiveRole(match.role);
        localStorage.setItem('rebuild_demo_role', match.role);
        localStorage.setItem('rebuild_demo_user_id', match.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        availableUsers,
        isLoading,
        switchRole,
        switchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
