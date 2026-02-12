import React from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { getStoredUsers, formatTimeAgo } from '../../utils/mockData';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { motion } from 'motion/react';

interface ChatWindowProps {
  userId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ userId }) => {
  const { user } = useAuth();
  const { getMessages, sendMessage, markAsRead } = useChat();
  const [message, setMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const users = getStoredUsers();
  const chatUser = users.find(u => u.id === userId);
  const messages = getMessages(userId);

  React.useEffect(() => {
    markAsRead(userId);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, userId, markAsRead]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(userId, message);
      setMessage('');
    }
  };

  if (!chatUser) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
        <Avatar
          src={chatUser.profilePicture}
          alt={chatUser.username}
          size="md"
          online={chatUser.isOnline}
        />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {chatUser.fullName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {chatUser.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === user?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                  <Avatar
                    src={isOwn ? user?.profilePicture || '' : chatUser.profilePicture}
                    alt={isOwn ? user?.username || '' : chatUser.username}
                    size="sm"
                  />
                  <div>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(msg.createdAt)}
                      </p>
                      {isOwn && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {msg.read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSend}
            variant="primary"
            disabled={!message.trim()}
            className="px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
