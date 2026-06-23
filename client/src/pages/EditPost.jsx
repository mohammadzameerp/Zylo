import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost } from '../features/posts/postSlice';
import PostForm from '../components/posts/PostForm';
import Loader from '../components/common/Loader';
import { toast } from 'react-hot-toast';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { post, isLoading: isPostLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);

  // Authorization check: Make sure user owns the post or is admin
  useEffect(() => {
    if (post && user) {
      const isOwner = post.author?._id === user._id || post.author === user._id;
      const isAdmin = user.role === 'admin';
      if (!isOwner && !isAdmin) {
        toast.error('You are not authorized to edit this post');
        navigate('/');
      }
    }
  }, [post, user, navigate]);

  const handleSubmit = async (formData) => {
    try {
      const resultAction = await dispatch(updatePost({ id, data: formData }));
      if (updatePost.fulfilled.match(resultAction)) {
        toast.success('Post updated successfully!');
        navigate(`/post/${id}`);
      } else {
        toast.error(resultAction.payload || 'Failed to update post');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    }
  };

  if (isPostLoading || !post) {
    return <Loader />;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Edit <span className="gradient-text">Anonymous Post</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Make updates to your post.
        </p>
      </div>

      <PostForm initialData={post} onSubmit={handleSubmit} isLoading={isPostLoading} />
    </div>
  );
}

export default EditPost;
