import React, { useState } from 'react';
import { Image, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePost } from '../../contexts/PostContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const { createPost } = usePost();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      createPost(content, imageUrl || undefined);
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex gap-3">
        <Avatar
          src={user?.profilePicture || ''}
          alt={user?.username || ''}
          size="md"
        />
        <div className="flex-1 space-y-3">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            rows={isExpanded ? 4 : 2}
          />

          {showImageInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Enter image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imageUrl && (
                <div className="mt-2 relative rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => setShowImageInput(!showImageInput)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showImageInput
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Image className="w-5 h-5" />
                <span className="text-sm font-medium">Photo</span>
              </button>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setContent('');
                    setImageUrl('');
                    setShowImageInput(false);
                    setIsExpanded(false);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  size="sm"
                  disabled={!content.trim()}
                >
                  Post
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
