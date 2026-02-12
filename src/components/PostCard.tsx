import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Post, User, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../lib/mockApi';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
  onEdit?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate, onEdit }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!user) return null;

  const postUser = mockApi.getUserById(post.userId);
  const isLiked = post.likes.includes(user.id);
  const isSaved = post.savedBy.includes(user.id);
  const isOwner = post.userId === user.id;

  const handleLike = () => {
    if (isLiked) {
      mockApi.unlikePost(post.id, user.id);
    } else {
      mockApi.likePost(post.id, user.id);
    }
    onUpdate();
  };

  const handleSave = () => {
    if (isSaved) {
      mockApi.unsavePost(post.id, user.id);
      toast.success('Post removed from saved');
    } else {
      mockApi.savePost(post.id, user.id);
      toast.success('Post saved');
    }
    onUpdate();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      mockApi.deletePost(post.id);
      toast.success('Post deleted');
      onUpdate();
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    mockApi.addComment(post.id, user.id, commentText);
    setCommentText('');
    toast.success('Comment added');
    onUpdate();
  };

  const handleDeleteComment = (commentId: string) => {
    mockApi.deleteComment(post.id, commentId);
    toast.success('Comment deleted');
    onUpdate();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Post by ${postUser?.username}: ${post.content}`);
    toast.success('Link copied to clipboard');
  };

  const nextImage = () => {
    if (post.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={postUser?.profilePicture || 'https://via.placeholder.com/40'}
            alt={postUser?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              {postUser?.fullName}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              @{postUser?.username} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <MoreVertical size={20} className="text-slate-600 dark:text-slate-400" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-10"
                >
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(post);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit size={18} className="text-slate-600 dark:text-slate-400" />
                      <span className="text-slate-900 dark:text-slate-100">Edit</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-red-600 dark:text-red-400"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <img
            src={post.images[currentImageIndex]}
            alt="Post content"
            className="w-full max-h-[500px] object-cover"
          />

          {post.images.length > 1 && (
            <>
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {post.images.length}
              </div>

              {currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  ←
                </button>
              )}

              {currentImageIndex < post.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  →
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <Heart
              size={22}
              className={isLiked ? 'fill-red-500 text-red-500' : ''}
            />
            <span className="text-sm">{post.likes.length}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <MessageCircle size={22} />
            <span className="text-sm">{post.comments.length}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
          >
            <Share2 size={22} />
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors ml-auto"
          >
            <Bookmark
              size={22}
              className={isSaved ? 'fill-yellow-500 text-yellow-500' : ''}
            />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Existing Comments */}
            <div className="px-4 py-3 space-y-4 max-h-64 overflow-y-auto">
              {post.comments.map((comment: Comment) => {
                const commentUser = mockApi.getUserById(comment.userId);
                const isCommentOwner = comment.userId === user.id;

                return (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={commentUser?.profilePicture || 'https://via.placeholder.com/32'}
                      alt={commentUser?.username}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
                        <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                          {commentUser?.username}
                        </h5>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 px-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                        {isCommentOwner && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Comment */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <img
                src={user.profilePicture || 'https://via.placeholder.com/32'}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddComment}>
                Post
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
