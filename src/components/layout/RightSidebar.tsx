import React from 'react';
import { TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getStoredUsers } from '../../utils/mockData';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { motion } from 'motion/react';

interface RightSidebarProps {
  onUserClick: (userId: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onUserClick }) => {
  const { user, followUser } = useAuth();
  const users = getStoredUsers();

  // Get suggested users (users not followed by current user)
  const suggestedUsers = users
    .filter((u) => u.id !== user?.id && !user?.following.includes(u.id))
    .slice(0, 5);

  // Mock trending topics
  const trendingTopics = [
    { tag: 'Technology', posts: '12.5K' },
    { tag: 'Photography', posts: '8.2K' },
    { tag: 'Travel', posts: '6.8K' },
    { tag: 'Fitness', posts: '5.4K' },
  ];

  return (
    <div className="hidden lg:block w-80 space-y-4">
      {/* Suggested Users */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Suggested For You
            </h3>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {suggestedUsers.map((suggestedUser) => (
            <div key={suggestedUser.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="cursor-pointer"
                  onClick={() => onUserClick(suggestedUser.id)}
                >
                  <Avatar
                    src={suggestedUser.profilePicture}
                    alt={suggestedUser.username}
                    size="md"
                    online={suggestedUser.isOnline}
                  />
                </div>
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onUserClick(suggestedUser.id)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {suggestedUser.fullName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    @{suggestedUser.username}
                  </p>
                </div>
                <Button
                  onClick={() => followUser(suggestedUser.id)}
                  variant="primary"
                  size="sm"
                >
                  Follow
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Trending Topics
            </h3>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {trendingTopics.map((topic, index) => (
            <div
              key={topic.tag}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    #{index + 1} Trending
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    #{topic.tag}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {topic.posts} posts
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:underline">About</a>
            <span>•</span>
            <a href="#" className="hover:underline">Help</a>
            <span>•</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms</a>
          </div>
          <p>© 2024 SocialHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
