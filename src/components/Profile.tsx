import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Calendar, Link as LinkIcon, Edit, UserPlus, UserMinus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../lib/mockApi';
import { Post, User } from '../types';
import { PostCard } from './PostCard';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { PostSkeleton } from './ui/Skeleton';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
    coverPhoto: user?.coverPhoto || '',
  });

  useEffect(() => {
    loadPosts();
  }, [activeTab, user]);

  const loadPosts = () => {
    if (!user) return;
    
    setLoading(true);
    setTimeout(() => {
      const allPosts = mockApi.getPosts();
      
      if (activeTab === 'posts') {
        setPosts(allPosts.filter((p) => p.userId === user.id));
      } else {
        setPosts(allPosts.filter((p) => p.savedBy.includes(user.id)));
      }
      
      setLoading(false);
    }, 500);
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(editData);
      setShowEditModal(false);
    } catch (error) {
      // Error handled in context
    }
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

    // Refresh will happen through re-render
  };

  const UserListModal: React.FC<{ users: User[]; title: string }> = ({ users, title }) => (
    <div className="space-y-3">
      {users.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-4">
          No users to show
        </p>
      ) : (
        users.map((u) => {
          const isFollowing = user?.following.includes(u.id);
          return (
            <div key={u.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg">
              <img
                src={u.profilePicture || 'https://via.placeholder.com/48'}
                alt={u.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {u.fullName}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  @{u.username}
                </p>
              </div>
              {u.id !== user?.id && (
                <Button
                  size="sm"
                  variant={isFollowing ? 'secondary' : 'primary'}
                  onClick={() => handleFollow(u.id)}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus size={16} className="mr-1" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  if (!user) return null;

  const followers = user.followers.map((id) => mockApi.getUserById(id)).filter((u): u is User => u !== null);
  const following = user.following.map((id) => mockApi.getUserById(id)).filter((u): u is User => u !== null);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Photo */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
        <div className="relative">
          <div
            className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center"
            style={
              user.coverPhoto
                ? { backgroundImage: `url(${user.coverPhoto})` }
                : undefined
            }
          />

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={user.profilePicture || 'https://via.placeholder.com/128'}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 object-cover"
              />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="absolute top-4 right-4">
            <Button onClick={() => setShowEditModal(true)} size="sm">
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            {user.fullName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-3">@{user.username}</p>

          {user.bio && (
            <p className="text-slate-700 dark:text-slate-300 mb-4">{user.bio}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowFollowersModal(true)}
              className="hover:underline"
            >
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {user.followers.length}
              </span>
              <span className="text-slate-600 dark:text-slate-400 ml-1">Followers</span>
            </button>
            <button
              onClick={() => setShowFollowingModal(true)}
              className="hover:underline"
            >
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {user.following.length}
              </span>
              <span className="text-slate-600 dark:text-slate-400 ml-1">Following</span>
            </button>
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {posts.length}
              </span>
              <span className="text-slate-600 dark:text-slate-400 ml-1">Posts</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-slate-200 dark:border-slate-700 flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 'posts'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 'saved'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            Saved
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="space-y-6">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              {activeTab === 'posts' ? 'No posts yet' : 'No saved posts'}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={loadPosts} />
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editData.fullName}
            onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
          />
          <Textarea
            label="Bio"
            value={editData.bio}
            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
            rows={3}
          />
          <Input
            label="Profile Picture URL"
            value={editData.profilePicture}
            onChange={(e) => setEditData({ ...editData, profilePicture: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          <Input
            label="Cover Photo URL"
            value={editData.coverPhoto}
            onChange={(e) => setEditData({ ...editData, coverPhoto: e.target.value })}
            placeholder="https://example.com/cover.jpg"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Followers Modal */}
      <Modal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
      >
        <UserListModal users={followers} title="Followers" />
      </Modal>

      {/* Following Modal */}
      <Modal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
      >
        <UserListModal users={following} title="Following" />
      </Modal>
    </div>
  );
};
