import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../lib/mockApi';
import { User, Post } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { UserCardSkeleton } from './ui/Skeleton';
import { toast } from 'sonner@2.0.3';

export const Search: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'trending'>('users');

  useEffect(() => {
    loadSuggestedUsers();
    loadTrendingPosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadSuggestedUsers = () => {
    if (!user) return;
    
    const allUsers = mockApi.getUsers();
    const suggested = allUsers
      .filter((u) => u.id !== user.id && !user.following.includes(u.id))
      .slice(0, 5);
    setSuggestedUsers(suggested);
  };

  const loadTrendingPosts = () => {
    const allPosts = mockApi.getPosts();
    const trending = [...allPosts]
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 5);
    setTrendingPosts(trending);
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const allUsers = mockApi.getUsers();
      const results = allUsers.filter(
        (u) =>
          u.id !== user?.id &&
          (u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(results);
      setLoading(false);
    }, 300);
  };

  const handleFollow = (targetUserId: string) => {
    if (!user) return;

    const targetUser = mockApi.getUserById(targetUserId);
    if (!targetUser) return;

    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      mockApi.unfollowUser(user.id, targetUserId);
      toast.success(`Unfollowed ${targetUser.username}`);
    } else {
      mockApi.followUser(user.id, targetUserId);
      toast.success(`Following ${targetUser.username}`);
    }

    // Refresh
    loadSuggestedUsers();
    if (searchQuery) {
      handleSearch();
    }
  };

  const UserCard: React.FC<{ userData: User }> = ({ userData }) => {
    const isFollowing = user?.following.includes(userData.id);

    return (
      <div className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
        <img
          src={userData.profilePicture || 'https://via.placeholder.com/48'}
          alt={userData.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {userData.fullName}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            @{userData.username}
          </p>
          {userData.bio && (
            <p className="text-sm text-slate-600 dark:text-slate-300 truncate mt-1">
              {userData.bio}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant={isFollowing ? 'secondary' : 'primary'}
          onClick={() => handleFollow(userData.id)}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    );
  };

  const TrendingPostCard: React.FC<{ post: Post }> = ({ post }) => {
    const postUser = mockApi.getUserById(post.userId);

    return (
      <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={postUser?.profilePicture || 'https://via.placeholder.com/32'}
            alt={postUser?.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {postUser?.fullName}
            </h5>
          </div>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-2">
          {post.content}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>❤️ {post.likes.length} likes</span>
          <span>💬 {post.comments.length} comments</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Input */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <SearchIcon size={24} className="text-slate-400" />
          <Input
            placeholder="Search for users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Search Results
            </h3>
            {loading ? (
              <>
                <UserCardSkeleton />
                <UserCardSkeleton />
              </>
            ) : searchResults.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                No users found
              </p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <UserCard key={result.id} userData={result} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      {!searchQuery && (
        <>
          <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-xl p-2 shadow-sm border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Users size={20} />
              <span>Suggested Users</span>
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                activeTab === 'trending'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <TrendingUp size={20} />
              <span>Trending</span>
            </button>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {activeTab === 'users' ? (
              <div>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Suggested for you
                  </h3>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {suggestedUsers.length === 0 ? (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                      No suggestions available
                    </p>
                  ) : (
                    suggestedUsers.map((suggestedUser) => (
                      <UserCard key={suggestedUser.id} userData={suggestedUser} />
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Trending Posts
                  </h3>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {trendingPosts.length === 0 ? (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                      No trending posts
                    </p>
                  ) : (
                    trendingPosts.map((post) => (
                      <TrendingPostCard key={post.id} post={post} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
