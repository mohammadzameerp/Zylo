import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RiSendPlaneFill, RiLoader4Line } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { createComment } from '../../features/comments/commentSlice';

export default function CommentForm({ postId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.comments);
  const [content, setContent] = useState('');

  const getInitial = () => {
    if (user?.anonymousName) return user.anonymousName.charAt(0).toUpperCase();
    return 'Z';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to comment');
      return navigate('/login');
    }
    if (!content.trim()) return;

    dispatch(createComment({ postId, content: content.trim() }))
      .unwrap()
      .then(() => {
        setContent('');
        toast.success('Comment added!');
      })
      .catch((err) => {
        toast.error(err || 'Failed to add comment');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-subtle rounded-xl p-4">
      <div className="flex items-start gap-3">
        {user && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
            {getInitial()}
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={token ? 'Write a comment...' : 'Login to comment...'}
            disabled={!token}
            className="w-full min-h-[60px] bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 resize-none leading-relaxed disabled:opacity-50"
            rows={2}
          />
          <div className="flex justify-end pt-2 border-t border-white/5">
            <button
              type="submit"
              disabled={isLoading || !content.trim() || !token}
              className="flex items-center gap-1.5 btn-gradient px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RiLoader4Line className="w-4 h-4 animate-spin" />
              ) : (
                <RiSendPlaneFill className="w-4 h-4" />
              )}
              Send
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
