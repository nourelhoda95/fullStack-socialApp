import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { Post } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { usePost } from '../../contexts/PostContext';
import { getStoredUsers, formatTimeAgo } from '../../utils/mockData';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { motion, AnimatePresence } from 'motion/react';

interface PostCardProps {
  post: Post;
  onUserClick: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUserClick }) => {
  const { user } = useAuth();
  const { likePost, addComment, deleteComment, deletePost, updatePost, savePost } = usePost();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const users = getStoredUsers();
  const postUser = users.find(u => u.id === post.userId);
  const isOwner = user?.id === post.userId;
  const isLiked = user ? post.likes.includes(user.id) : false;
  const isSaved = user ? post.savedBy.includes(user.id) : false;

  const handleComment = () => {
    if (comment.trim()) {
      addComment(post.id, comment);
      setComment('');
    }
  };

  const handleEdit = () => {
    updatePost(post.id, editContent);
    setShowEditModal(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onUserClick(post.userId)}
        >
          <Avatar
            src={postUser?.profilePicture || ''}
            alt={postUser?.username || ''}
            size="md"
            online={postUser?.isOnline}
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {postUser?.fullName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{postUser?.username} • {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10"
                >
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Post
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="relative w-full aspect-square max-h-[500px]">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => likePost(post.id)}
              className="flex items-center gap-2 group transition-transform active:scale-90"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isLiked
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-red-500'
                }`}
              />
              <span className="text-gray-900 dark:text-gray-100">
                {post.likes.length}
              </span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 group transition-transform active:scale-90"
            >
              <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-gray-900 dark:text-gray-100">
                {post.comments.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => savePost(post.id)}
            className="transition-transform active:scale-90"
          >
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                isSaved
                  ? 'fill-blue-500 text-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
              }`}
            />
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3"
            >
              {/* Comment Input */}
              <div className="flex gap-2">
                <Avatar
                  src={user?.profilePicture || ''}
                  alt={user?.username || ''}
                  size="sm"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleComment}
                    variant="primary"
                    size="sm"
                    disabled={!comment.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {post.comments.map((c) => {
                  const commentUser = users.find(u => u.id === c.userId);
                  const isCommentOwner = user?.id === c.userId;
                  
                  return (
                    <div key={c.id} className="flex gap-2 group">
                      <Avatar
                        src={commentUser?.profilePicture || ''}
                        alt={commentUser?.username || ''}
                        size="sm"
                      />
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {commentUser?.username}
                          </p>
                          {isCommentOwner && (
                            <button
                              onClick={() => deleteComment(post.id, c.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-sm">
                          {c.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTimeAgo(c.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Post"
      >
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            placeholder="What's on your mind?"
          />
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => setShowEditModal(false)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              variant="primary"
              disabled={!editContent.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
