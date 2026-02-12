import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationContextType } from '../types';
import { STORAGE_KEYS, generateId } from '../utils/mockData';
import { useAuth } from './AuthContext';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (stored) {
      const allNotifications: Notification[] = JSON.parse(stored);
      // Filter notifications for current user
      const userNotifications = user 
        ? allNotifications.filter(n => n.userId === user.id)
        : [];
      setNotifications(userNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
    allNotifications.push(newNotification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(allNotifications));

    if (user && notification.userId === user.id) {
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);

    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (stored) {
      const allNotifications: Notification[] = JSON.parse(stored);
      const updated = allNotifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);

    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (stored) {
      const allNotifications: Notification[] = JSON.parse(stored);
      const updated = allNotifications.map(n =>
        user && n.userId === user.id ? { ...n, read: true } : n
      );
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
