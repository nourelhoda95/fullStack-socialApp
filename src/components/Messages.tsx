import React, { useState, useEffect, useRef } from 'react';
import { Send, Circle, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../lib/mockApi';
import { Message, Conversation, User } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { formatDistanceToNow } from 'date-fns';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUserId && user) {
      loadMessages(selectedUserId);
      markMessagesAsSeen(selectedUserId);
      
      // Simulate real-time updates
      const interval = setInterval(() => {
        loadMessages(selectedUserId);
        loadConversations();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedUserId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = () => {
    if (!user) return;
    const convos = mockApi.getConversations(user.id);
    setConversations(convos);
  };

  const loadMessages = (otherUserId: string) => {
    if (!user) return;
    const msgs = mockApi.getConversationMessages(user.id, otherUserId);
    setMessages(msgs);
  };

  const markMessagesAsSeen = (otherUserId: string) => {
    if (!user) return;
    mockApi.markMessagesAsSeen(user.id, otherUserId);
    loadConversations();
  };

  const handleSendMessage = () => {
    if (!user || !selectedUserId || !messageText.trim()) return;

    mockApi.sendMessage(user.id, selectedUserId, messageText);
    setMessageText('');
    loadMessages(selectedUserId);
    loadConversations();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectedUser = selectedUserId ? mockApi.getUserById(selectedUserId) : null;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)]">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-full flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Messages
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No conversations yet
              </div>
            ) : (
              conversations.map((convo) => {
                const otherUser = mockApi.getUserById(convo.userId);
                if (!otherUser) return null;

                const isSelected = selectedUserId === convo.userId;
                const isLastMessageFromOther = convo.lastMessage.senderId === convo.userId;

                return (
                  <button
                    key={convo.userId}
                    onClick={() => setSelectedUserId(convo.userId)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={otherUser.profilePicture || 'https://via.placeholder.com/48'}
                        alt={otherUser.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {otherUser.isOnline && (
                        <Circle
                          size={12}
                          className="absolute bottom-0 right-0 fill-green-500 text-green-500"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {otherUser.fullName}
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDistanceToNow(new Date(convo.lastMessage.createdAt), {
                            addSuffix: false,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm truncate flex-1 ${
                            convo.unreadCount > 0 && isLastMessageFromOther
                              ? 'font-semibold text-slate-900 dark:text-slate-100'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {convo.lastMessage.senderId === user?.id && 'You: '}
                          {convo.lastMessage.content}
                        </p>
                        {convo.unreadCount > 0 && isLastMessageFromOther && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedUser.profilePicture || 'https://via.placeholder.com/40'}
                    alt={selectedUser.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedUser.isOnline && (
                    <Circle
                      size={10}
                      className="absolute bottom-0 right-0 fill-green-500 text-green-500"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedUser.fullName}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedUser.isOnline
                      ? 'Active now'
                      : selectedUser.lastSeen
                      ? `Active ${formatDistanceToNow(new Date(selectedUser.lastSeen), {
                          addSuffix: true,
                        })}`
                      : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isSentByMe = message.senderId === user?.id;
                  const sender = mockApi.getUserById(message.senderId);

                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${
                        isSentByMe ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {!isSentByMe && (
                        <img
                          src={sender?.profilePicture || 'https://via.placeholder.com/32'}
                          alt={sender?.username}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div
                        className={`max-w-[70%] ${
                          isSentByMe ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isSentByMe
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 px-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          {isSentByMe && message.seen && (
                            <span className="text-xs text-blue-500">Seen</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send size={20} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <MessageCircle size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};