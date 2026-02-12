import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Edit2, Check, X } from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatTimeAgo } from '../../utils/mockData';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { motion } from 'motion/react';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile }) => {
  const { user: currentUser, followUser, unfollowUser, updateProfile } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user.fullName,
    bio: user.bio,
    profilePicture: user.profilePicture,
    coverPhoto: user.coverPhoto,
  });

  const isFollowing = currentUser?.following.includes(user.id);

  const handleFollow = () => {
    if (isFollowing) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  const handleSaveProfile = async () => {
    await updateProfile(editData);
    setShowEditModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-500 to-purple-600">
        <img
          src={user.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <Camera className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 mb-4">
          <div className="relative">
            <Avatar
              src={user.profilePicture}
              alt={user.username}
              size="xl"
              online={user.isOnline}
              className="ring-4 ring-white dark:ring-gray-800"
            />
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          <div className="mt-4 sm:mt-0">
            {isOwnProfile ? (
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button
                onClick={handleFollow}
                variant={isFollowing ? 'ghost' : 'primary'}
                size="md"
                className="w-full sm:w-auto"
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
          </div>

          {user.bio && (
            <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatTimeAgo(user.createdAt)}</span>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {user.following.length}
              </span>{' '}
              <span className="text-gray-600 dark:text-gray-400">Following</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {user.followers.length}
              </span>{' '}
              <span className="text-gray-600 dark:text-gray-400">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editData.fullName}
            onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
          />
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>
          <Input
            label="Profile Picture URL"
            value={editData.profilePicture}
            onChange={(e) => setEditData({ ...editData, profilePicture: e.target.value })}
          />
          <Input
            label="Cover Photo URL"
            value={editData.coverPhoto}
            onChange={(e) => setEditData({ ...editData, coverPhoto: e.target.value })}
          />
          <div className="flex gap-2 justify-end pt-4">
            <Button
              onClick={() => setShowEditModal(false)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
