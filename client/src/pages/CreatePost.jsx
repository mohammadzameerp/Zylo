import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../features/posts/postSlice';
import PostForm from '../components/posts/PostForm';
import { toast } from 'react-hot-toast';

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.posts);

  const handleSubmit = async (formData) => {
    try {
      // Dispatch thunk to create post. formData is a FormData object because of image upload
      const resultAction = await dispatch(createPost(formData));
      if (createPost.fulfilled.match(resultAction)) {
        toast.success('Post shared anonymously!');
        navigate('/');
      } else {
        toast.error(resultAction.payload || 'Failed to create post');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create <span className="gradient-text">Anonymous Post</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Share your secrets, thoughts, or questions with the world. Completely anonymous.
        </p>
      </div>

      <PostForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default CreatePost;
