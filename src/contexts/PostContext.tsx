import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, PostContextType } from '../types';
import { getStoredPosts, updateStoredPosts, generateId } from '../utils/mockData';
import { useAuth } from './AuthContext';

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const storedPosts = getStoredPosts();
    // Sort by creation date (newest first)
    const sortedPosts = storedPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(sortedPosts);
  };

  const createPost = (content: string, image?: string) => {
    if (!user) return;

    const newPost: Post = {
      id: generateId(),
      userId: user.id,
      content,
      image,
      likes: [],
      comments: [],
      savedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    updateStoredPosts(updatedPosts);
  };

  const updatePost = (postId: string, content: string) => {
    const updatedPosts = posts.map(post =>
      post.id === postId
        ? { ...post, content, updatedAt: new Date().toISOString() }
        : post
    );
    setPosts(updatedPosts);
    updateStoredPosts(updatedPosts);
  };

  const deletePost = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    updateStoredPosts(updatedPosts);
  };

  const likePost = (postId: string) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.id);
        return {
          ...post,
          likes: isLiked
            ? post.likes.filter(id => id !== user.id)
            : [...post.likes, user.id],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    updateStoredPosts(updatedPosts);
  };

  const addComment = (postId: string, content: string) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: generateId(),
              userId: user.id,
              content,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    updateStoredPosts(updatedPosts);
  };

  const deleteComment = (postId: string, commentId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(c => c.id !== commentId),
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    updateStoredPosts(updatedPosts);
  };

  const savePost = (postId: string) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isSaved = post.savedBy.includes(user.id);
        return {
          ...post,
          savedBy: isSaved
            ? post.savedBy.filter(id => id !== user.id)
            : [...post.savedBy, user.id],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    updateStoredPosts(updatedPosts);
  };

  const getSavedPosts = (): Post[] => {
    if (!user) return [];
    return posts.filter(post => post.savedBy.includes(user.id));
  };

  const getUserPosts = (userId: string): Post[] => {
    return posts.filter(post => post.userId === userId);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        createPost,
        updatePost,
        deletePost,
        likePost,
        addComment,
        deleteComment,
        savePost,
        getSavedPosts,
        getUserPosts,
        loading,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
