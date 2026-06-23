import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserStats, updateProfile, reset as resetAuth } from '../features/auth/authSlice';
import { getBookmarks, getPosts } from '../features/posts/postSlice';
import PostCard from '../components/posts/PostCard';
import { SkeletonCard } from '../components/common/Loader';
import { toast } from 'react-hot-toast';
import { RiUserLine, RiBookmarkLine, RiFileList2Line, RiSettings4Line, RiHeartLine, RiChat3Line, RiShuffleLine } from 'react-icons/ri';

const ADJECTIVES = ['Silent', 'Neon', 'Ghost', 'Shadow', 'Secret', 'Curious', 'Mystic', 'Hidden', 'Phantom', 'Cosmic', 'Wandering', 'Quiet'];
const NOUNS = ['Coder', 'Panda', 'Shadow', 'Fox', 'Owl', 'Wolf', 'Ranger', 'Ninja', 'Ghost', 'Voyager', 'Nomad', 'Knight'];

function Profile() {
  const dispatch = useDispatch();
  const { user, stats, isLoading: isAuthLoading } = useSelector((state) => state.auth);
  const { posts, bookmarks, isLoading: isPostsLoading } = useSelector((state) => state.posts);

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'bookmarks' | 'settings'
  const [newAnonymousName, setNewAnonymousName] = useState(user?.anonymousName || '');

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserStats());
      dispatch(getBookmarks());
      dispatch(getPosts({ author: user._id, limit: 100 }));
    }
  }, [dispatch, user?._id]);

  const handleGenerateName = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setNewAnonymousName(`${adj}${noun}${num}`);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!newAnonymousName.trim()) {
      return toast.error('Anonymous username cannot be empty');
    }
    try {
      const resultAction = await dispatch(updateProfile({ anonymousName: newAnonymousName }));
      if (updateProfile.fulfilled.match(resultAction)) {
        toast.success('Anonymous name updated!');
        dispatch(resetAuth());
      } else {
        toast.error(resultAction.payload || 'Failed to update name');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const userPosts = posts.filter(
    (post) => post.author?._id === user?._id || post.author === user?._id
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header Card */}
      <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-cyan/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <img
            src={user?.avatar}
            alt={user?.anonymousName}
            className="w-24 h-24 rounded-full border-4 border-accent/20 shadow-md object-cover bg-dark-500"
          />
          {/* Details */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold">{user?.anonymousName}</h2>
            <p className="text-gray-400 text-sm">Member since {formatDate(user?.createdAt)}</p>
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-accent capitalize">
              Role: {user?.role}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 text-center space-y-1">
          <div className="p-3 bg-accent/10 text-accent rounded-xl w-fit mx-auto">
            <RiFileList2Line className="text-2xl" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.postsCount || userPosts.length}</p>
          <p className="text-xs font-medium text-gray-400">Total Posts</p>
        </div>

        <div className="glass rounded-2xl p-5 text-center space-y-1">
          <div className="p-3 bg-cyan/10 text-cyan rounded-xl w-fit mx-auto">
            <RiHeartLine className="text-2xl" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.likesReceived || 0}</p>
          <p className="text-xs font-medium text-gray-400">Likes Received</p>
        </div>

        <div className="glass rounded-2xl p-5 text-center space-y-1">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mx-auto">
            <RiChat3Line className="text-2xl" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.commentsReceived || 0}</p>
          <p className="text-xs font-medium text-gray-400">Comments Received</p>
        </div>

        <div className="glass rounded-2xl p-5 text-center space-y-1">
          <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl w-fit mx-auto">
            <RiBookmarkLine className="text-2xl" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.bookmarksCount || bookmarks.length}</p>
          <p className="text-xs font-medium text-gray-400">Bookmarks Saved</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-dark-500 p-1.5 rounded-2xl border border-white/5 w-full">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'posts'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <RiFileList2Line className="text-lg" />
          My Posts
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <RiBookmarkLine className="text-lg" />
          Bookmarks
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <RiSettings4Line className="text-lg" />
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          isPostsLoading ? (
            Array.from({ length: 2 }).map((_, idx) => <SkeletonCard key={idx} />)
          ) : userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-gray-400">
              You haven't posted anything yet.
            </div>
          )
        )}

        {activeTab === 'bookmarks' && (
          isPostsLoading ? (
            Array.from({ length: 2 }).map((_, idx) => <SkeletonCard key={idx} />)
          ) : bookmarks.length > 0 ? (
            bookmarks.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-gray-400">
              No bookmarked posts found.
            </div>
          )
        )}

        {activeTab === 'settings' && (
          <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold">Account Settings</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-300">Edit Anonymous Username</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <RiUserLine className="text-xl" />
                    </span>
                    <input
                      type="text"
                      value={newAnonymousName}
                      onChange={(e) => setNewAnonymousName(e.target.value)}
                      placeholder="Enter new anonymous name"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 text-white placeholder-gray-500 transition-all outline-none"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateName}
                    title="Generate random name"
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 text-accent transition-all flex items-center justify-center"
                  >
                    <RiShuffleLine className="text-xl" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="px-6 py-3 rounded-xl font-semibold btn-gradient text-white shadow-lg hover:shadow-accent/20 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {isAuthLoading ? 'Saving...' : 'Save Name'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
