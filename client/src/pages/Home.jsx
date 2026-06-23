import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPosts } from '../features/posts/postSlice';
import PostCard from '../components/posts/PostCard';
import SearchBar from '../components/common/SearchBar';
import { SkeletonCard } from '../components/common/Loader';
import { RiFireLine, RiTimeLine } from 'react-icons/ri';

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'general', name: 'General' },
  { id: 'humor', name: 'Humor' },
  { id: 'story', name: 'Story' },
  { id: 'confession', name: 'Confession' },
  { id: 'question', name: 'Question' },
  { id: 'advice', name: 'Advice' },
  { id: 'rant', name: 'Rant' },
  { id: 'shower-thought', name: 'Shower Thought' },
];

function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, isLoading, pagination } = useSelector((state) => state.posts);

  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = {
      page,
      limit: 10,
      sort,
    };
    if (search) params.search = search;
    if (category !== 'all') params.category = category;

    dispatch(getPosts(params));
  }, [dispatch, page, sort, search, category]);

  // Reset page to 1 when changing filters
  const handleCategoryChange = (catId) => {
    setCategory(catId);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section for unauthenticated users */}
      {!user && (
        <div className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-cyan/10 opacity-30 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Share <span className="gradient-text">Anonymously</span>. <br />
              Speak Freely.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              Express your thoughts, share secrets, and ask questions without revealing your identity. Join the Zylo community today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="px-6 py-3 rounded-xl font-semibold btn-gradient text-white shadow-lg hover:shadow-accent/20 transition-all hover:scale-[1.02]">
                Get Started
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Feed Container */}
      <div className="space-y-6">
        {/* Feed Header: Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-dark-500 p-1.5 rounded-xl border border-white/5 w-fit">
            <button
              onClick={() => handleSortChange('latest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                sort === 'latest'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <RiTimeLine className="text-lg" />
              Latest
            </button>
            <button
              onClick={() => handleSortChange('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                sort === 'trending'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <RiFireLine className="text-lg" />
              Trending
            </button>
          </div>

          {/* Search bar */}
          <div className="w-full sm:max-w-xs">
            <SearchBar onSearch={handleSearch} placeholder="Search posts..." />
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                category === cat.id
                  ? 'btn-gradient border-transparent text-white shadow-md'
                  : 'bg-dark-500 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Post List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-gray-400">
              No posts found. Be the first to share something!
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <button
              disabled={page === 1 || isLoading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={page === pagination.pages || isLoading}
              onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
