import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../lib/mockApi';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Modal } from './ui/Modal';
import { toast } from 'sonner@2.0.3';
import { Post } from '../types';
import { unsplash_tool } from '../lib/unsplashHelper';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPost?: Post | null;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editPost,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState(editPost?.content || '');
  const [imageUrls, setImageUrls] = useState<string[]>(editPost?.images || []);
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    setLoading(true);
    try {
      if (editPost) {
        mockApi.updatePost(editPost.id, content, imageUrls.length > 0 ? imageUrls : undefined);
        toast.success('Post updated successfully');
      } else {
        mockApi.createPost(user.id, content, imageUrls.length > 0 ? imageUrls : undefined);
        toast.success('Post created successfully');
      }
      
      setContent('');
      setImageUrls([]);
      setImageSearchQuery('');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImageFromSearch = async () => {
    if (!imageSearchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would call the unsplash API
      // For demo, we'll add placeholder images
      const demoImages = [
        'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
        'https://images.unsplash.com/photo-1682687221038-404cb8830901',
        'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
      ];
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      setImageUrls([...imageUrls, `${randomImage}?w=800`]);
      setImageSearchQuery('');
      toast.success('Image added');
    } catch (error) {
      toast.error('Failed to add image');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setContent(editPost?.content || '');
    setImageUrls(editPost?.images || []);
    setImageSearchQuery('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editPost ? 'Edit Post' : 'Create Post'} size="lg">
      <div className="space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <img
            src={user?.profilePicture || 'https://via.placeholder.com/40'}
            alt={user?.username}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{user?.fullName}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">@{user?.username}</p>
          </div>
        </div>

        {/* Content Input */}
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="text-lg"
        />

        {/* Image Preview */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Image Section */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={20} className="text-slate-600 dark:text-slate-400" />
            <h4 className="font-medium text-slate-900 dark:text-slate-100">Add Images</h4>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for images (e.g., nature, city, food)"
              value={imageSearchQuery}
              onChange={(e) => setImageSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddImageFromSearch()}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
            />
            <Button size="sm" onClick={handleAddImageFromSearch} disabled={loading || imageUrls.length >= 4}>
              Add
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            You can add up to 4 images
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={loading}>
            {editPost ? 'Update' : 'Post'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
