import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../lib/mockApi';
import { Post } from '../types';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { PostSkeleton } from './ui/Skeleton';
import { Button } from './ui/Button';
import { motion } from 'motion/react';

export const Feed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setLoading(true);
    setTimeout(() => {
      const allPosts = mockApi.getPosts();
      setPosts(allPosts);
      setLoading(false);
    }, 800);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowCreatePost(true);
  };

  const handleCloseModal = () => {
    setShowCreatePost(false);
    setEditingPost(null);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create Post Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 mb-6"
      >
        <div className="flex items-center gap-3">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/40'}
            alt={user.username}
            className="w-12 h-12 rounded-full"
          />
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex-1 text-left px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            What's on your mind, {user.fullName.split(' ')[0]}?
          </button>
          <Button size="sm" onClick={() => setShowCreatePost(true)}>
            <Plus size={20} />
          </Button>
        </div>
      </motion.div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              No posts yet. Be the first to share something!
            </p>
            <Button onClick={() => setShowCreatePost(true)}>
              Create Post
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpdate={loadPosts}
              onEdit={handleEditPost}
            />
          ))
        )}
      </div>

      {/* Create/Edit Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={handleCloseModal}
        onSuccess={loadPosts}
        editPost={editingPost}
      />
    </div>
  );
};
