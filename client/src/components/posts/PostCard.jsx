import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  RiHeartLine,
  RiHeartFill,
  RiChat3Line,
  RiBookmarkLine,
  RiBookmarkFill,
  RiShareLine,
  RiFlag2Line,
  RiMoreLine,
  RiTimeLine,
} from 'react-icons/ri';
import TimeAgo from 'react-timeago';
import toast from 'react-hot-toast';
import { likePost, bookmarkPost, reportPost } from '../../features/posts/postSlice';
import { SERVER_URL } from '../../services/api';

const categoryColors = {
  general: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  confession: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  advice: 'bg-green-500/15 text-green-400 border-green-500/20',
  rant: 'bg-red-500/15 text-red-400 border-red-500/20',
  funny: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  humor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  serious: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  story: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  question: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'shower-thought': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

export default function PostCard({ post, showFull = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!post) return null;

  const isLiked = user && post.likes && (post.likes.includes(user._id) || post.likes.includes(user.id));
  const isBookmarked = user && user.bookmarks && (user.bookmarks.includes(post._id) || user.bookmarks.includes(post.id));
  const isAuthor = user && (post.author === user._id || post.author?._id === user._id || post.author === user.id || post.author?._id === user.id);
  const likeCount = post.likesCount !== undefined ? post.likesCount : post.likeCount || post.likes?.length || 0;
  const commentCount = post.commentCount || post.comments?.length || 0;
  const category = post.category?.toLowerCase() || 'general';
  const categoryStyle = categoryColors[category] || categoryColors.general;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to like posts');
      return navigate('/login');
    }
    setIsLikeAnimating(true);
    dispatch(likePost(post._id));
    setTimeout(() => setIsLikeAnimating(false), 500);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to bookmark posts');
      return navigate('/login');
    }
    dispatch(bookmarkPost(post._id));
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleReport = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to report posts');
      return navigate('/login');
    }
    dispatch(reportPost(post._id));
    toast.success('Post reported. Thank you for helping keep Zylo safe.');
    setShowMenu(false);
  };

  const handleCardClick = () => {
    if (!showFull) {
      navigate(`/post/${post._id}`);
    }
  };

  const getInitial = () => {
    const name = post.anonymousName || post.author?.anonymousName || 'A';
    return name.charAt(0).toUpperCase();
  };

  const getAuthorName = () => {
    return post.anonymousName || post.author?.anonymousName || 'Anonymous';
  };

  return (
    <article
      onClick={handleCardClick}
      className={`glass rounded-2xl p-5 sm:p-6 transition-all duration-300 animate-fade-in ${
        !showFull ? 'cursor-pointer card-hover hover:scale-[1.01]' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white text-sm font-bold shrink-0">
            {getInitial()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{getAuthorName()}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <RiTimeLine className="w-3 h-3" />
              {post.createdAt ? <TimeAgo date={post.createdAt} /> : 'Just now'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.category && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${categoryStyle}`}>
              {post.category}
            </span>
          )}
          {!isAuthor && user && (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all"
              >
                <RiMoreLine className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 glass-strong rounded-xl p-1 min-w-[140px] animate-scale-in origin-top-right z-10">
                  <button
                    onClick={handleReport}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-all"
                  >
                    <RiFlag2Line className="w-4 h-4" />
                    Report Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      {post.title && (
        <h3 className={`text-lg font-semibold text-white mb-2 ${!showFull ? 'line-clamp-2' : ''}`}>
          {post.title}
        </h3>
      )}

      {/* Content */}
      <div className={`text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap ${!showFull ? 'line-clamp-6' : ''}`}>
        {post.content}
      </div>

      {/* Image */}
      {post.image && (
        <div className="mb-4 rounded-xl overflow-hidden bg-dark-600/30 flex justify-center border border-white/5">
          <img
            src={
              post.image.startsWith('http') || post.image.startsWith('data:')
                ? post.image
                : post.image.startsWith('/uploads')
                ? `${SERVER_URL}${post.image}`
                : `${SERVER_URL}/uploads/${post.image}`
            }
            alt="Post"
            className="w-full max-h-[450px] sm:max-h-[550px] object-contain rounded-xl"
            loading="lazy"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-xs font-medium text-accent bg-accent/10 rounded-full border border-accent/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center gap-1 pt-3 border-t border-white/5">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-300 ${
            isLiked
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-gray-500 hover:text-red-400 hover:bg-white/5'
          }`}
        >
          {isLiked ? (
            <RiHeartFill className={`w-5 h-5 ${isLikeAnimating ? 'heart-beat' : ''}`} />
          ) : (
            <RiHeartLine className="w-5 h-5" />
          )}
          <span className="font-medium">{likeCount > 0 ? likeCount : ''}</span>
        </button>

        {/* Comment */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/post/${post._id}`);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-cyan hover:bg-white/5 transition-all duration-300"
        >
          <RiChat3Line className="w-5 h-5" />
          <span className="font-medium">{commentCount > 0 ? commentCount : ''}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-300 ${
            isBookmarked
              ? 'text-warning hover:bg-warning/10'
              : 'text-gray-500 hover:text-warning hover:bg-white/5'
          }`}
        >
          {isBookmarked ? <RiBookmarkFill className="w-5 h-5" /> : <RiBookmarkLine className="w-5 h-5" />}
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-accent hover:bg-white/5 transition-all duration-300 ml-auto"
        >
          <RiShareLine className="w-5 h-5" />
        </button>
      </div>
    </article>
  );
}
