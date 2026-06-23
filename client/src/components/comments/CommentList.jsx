import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiDeleteBinLine, RiTimeLine, RiChat3Line } from 'react-icons/ri';
import TimeAgo from 'react-timeago';
import toast from 'react-hot-toast';
import { getComments, deleteComment } from '../../features/comments/commentSlice';
import CommentForm from './CommentForm';

export default function CommentList({ postId }) {
  const dispatch = useDispatch();
  const { comments, isLoading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (postId) {
      dispatch(getComments(postId));
    }
  }, [postId, dispatch]);

  const handleDelete = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      dispatch(deleteComment(commentId));
      toast.success('Comment deleted');
    }
  };

  const getInitial = (comment) => {
    const name = comment.anonymousName || comment.author?.anonymousName || 'A';
    return name.charAt(0).toUpperCase();
  };

  const getName = (comment) => {
    return comment.anonymousName || comment.author?.anonymousName || 'Anonymous';
  };

  const isOwner = (comment) => {
    if (!user) return false;
    const authorId = comment.author?._id || comment.author;
    return authorId === user._id;
  };

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <CommentForm postId={postId} />

      {/* Comment Count */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <RiChat3Line className="w-4 h-4" />
        <span>{Array.isArray(comments) ? comments.length : 0} Comments</span>
      </div>

      {/* Comments */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-subtle rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="h-4 bg-white/10 rounded w-24" />
              </div>
              <div className="h-4 bg-white/5 rounded w-full" />
            </div>
          ))}
        </div>
      ) : Array.isArray(comments) && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="glass-subtle rounded-xl p-4 animate-fade-in transition-all duration-300 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/70 to-cyan/70 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {getInitial(comment)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{getName(comment)}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <RiTimeLine className="w-3 h-3" />
                        {comment.createdAt ? <TimeAgo date={comment.createdAt} /> : 'Just now'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {isOwner(comment) && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-danger hover:bg-danger/10 transition-all duration-300 shrink-0"
                  >
                    <RiDeleteBinLine className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-subtle rounded-xl p-8 text-center">
          <RiChat3Line className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
