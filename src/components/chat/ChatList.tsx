import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { getStoredUsers, formatTimeAgo } from '../../utils/mockData';
import { Avatar } from '../common/Avatar';
import { motion } from 'motion/react';

interface ChatListProps {
  onSelectChat: (userId: string) => void;
  selectedUserId: string | null;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedUserId }) => {
  const { chats } = useChat();
  const users = getStoredUsers();

  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {chats.map((chat) => {
        const chatUser = users.find(u => u.id === chat.userId);
        if (!chatUser) return null;

        const isSelected = selectedUserId === chat.userId;

        return (
          <motion.button
            key={chat.userId}
            onClick={() => onSelectChat(chat.userId)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${
              isSelected
                ? 'bg-blue-50 dark:bg-blue-900/30'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="relative">
              <Avatar
                src={chatUser.profilePicture}
                alt={chatUser.username}
                size="md"
                online={chatUser.isOnline}
              />
              {chat.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {chat.unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {chatUser.fullName}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(chat.lastMessageTime)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {chat.lastMessage}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
