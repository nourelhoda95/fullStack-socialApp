import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { getStoredUsers } from '../../utils/mockData';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';

interface SearchProps {
  onUserClick: (userId: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onUserClick }) => {
  const [query, setQuery] = useState('');
  const { user, followUser, unfollowUser } = useAuth();
  const users = getStoredUsers();

  const filteredUsers = users.filter(
    (u) =>
      u.id !== user?.id &&
      (u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.fullName.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {query ? (
          filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No users found
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isFollowing = user?.following.includes(u.id);
              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => onUserClick(u.id)}
                    >
                      <Avatar
                        src={u.profilePicture}
                        alt={u.username}
                        size="lg"
                        online={u.isOnline}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {u.fullName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          @{u.username}
                        </p>
                        {u.bio && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {u.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => isFollowing ? unfollowUser(u.id) : followUser(u.id)}
                      variant={isFollowing ? 'outline' : 'primary'}
                      size="sm"
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Search for users by username or name
          </div>
        )}
      </div>
    </div>
  );
};
