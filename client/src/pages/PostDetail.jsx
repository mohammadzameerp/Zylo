import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost } from '../features/posts/postSlice';
import PostCard from '../components/posts/PostCard';
import CommentList from '../components/comments/CommentList';
import Loader from '../components/common/Loader';
import { RiArrowLeftLine } from 'react-icons/ri';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { post, isLoading, isError, message } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !post) {
    return (
      <div className="space-y-4 animate-fade-in">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-all font-semibold"
        >
          <RiArrowLeftLine className="text-xl" />
          Back to Feed
        </button>
        <div className="glass rounded-2xl p-12 text-center text-gray-400">
          {message || 'Post not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-all font-semibold"
      >
        <RiArrowLeftLine className="text-xl" />
        Back
      </button>

      {/* Full Post Card */}
      <PostCard post={post} />

      {/* Discussion Section */}
      <div className="space-y-6 pt-4">
        <h3 className="text-lg font-bold text-white border-l-4 border-accent pl-3">
          Discussion
        </h3>

        {/* Comment List */}
        <CommentList postId={post._id} />
      </div>
    </div>
  );
}

export default PostDetail;
