import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, Chat, ChatContextType } from '../types';
import { STORAGE_KEYS, generateId } from '../utils/mockData';
import { useAuth } from './AuthContext';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadMessages();
  }, [user]);

  const loadMessages = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (stored && user) {
      const allMessages: Message[] = JSON.parse(stored);
      // Filter messages for current user
      const userMessages = allMessages.filter(
        m => m.senderId === user.id || m.receiverId === user.id
      );
      setMessages(userMessages);
      updateChats(userMessages);
    }
  };

  const updateChats = (userMessages: Message[]) => {
    if (!user) return;

    // Group messages by conversation
    const chatMap = new Map<string, Chat>();

    userMessages.forEach(msg => {
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      
      const existing = chatMap.get(otherUserId);
      const msgTime = new Date(msg.createdAt).getTime();

      if (!existing || new Date(existing.lastMessageTime).getTime() < msgTime) {
        const unreadCount = userMessages.filter(
          m => m.senderId === otherUserId && m.receiverId === user.id && !m.read
        ).length;

        chatMap.set(otherUserId, {
          userId: otherUserId,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount,
        });
      }
    });

    const chatList = Array.from(chatMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    setChats(chatList);
  };

  const sendMessage = (receiverId: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: generateId(),
      senderId: user.id,
      receiverId,
      content,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const allMessages: Message[] = stored ? JSON.parse(stored) : [];
    allMessages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    updateChats(updatedMessages);
  };

  const getMessages = (userId: string): Message[] => {
    if (!user) return [];
    
    return messages
      .filter(m => 
        (m.senderId === user.id && m.receiverId === userId) ||
        (m.senderId === userId && m.receiverId === user.id)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const markAsRead = (userId: string) => {
    if (!user) return;

    const updatedMessages = messages.map(m =>
      m.senderId === userId && m.receiverId === user.id
        ? { ...m, read: true }
        : m
    );

    setMessages(updatedMessages);
    updateChats(updatedMessages);

    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (stored) {
      const allMessages: Message[] = JSON.parse(stored);
      const updated = allMessages.map(m =>
        m.senderId === userId && m.receiverId === user.id
          ? { ...m, read: true }
          : m
      );
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        sendMessage,
        getMessages,
        markAsRead,
        activeChat,
        setActiveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
