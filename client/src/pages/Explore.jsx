import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../features/posts/postSlice';
import PostCard from '../components/posts/PostCard';
import SearchBar from '../components/common/SearchBar';
import { SkeletonCard } from '../components/common/Loader';
import { RiHashtag, RiCompassDiscoverLine } from 'react-icons/ri';

const CATEGORY_INFOS = [
  { id: 'general', name: 'General', count: '100+ posts', desc: 'General topics and announcements', emoji: '💬' },
  { id: 'humor', name: 'Humor', count: '45+ posts', desc: 'Funny stories, memes, and jokes', emoji: '😂' },
  { id: 'story', name: 'Story', count: '30+ posts', desc: 'Deep personal or funny stories', emoji: '📖' },
  { id: 'confession', name: 'Confession', count: '80+ posts', desc: 'Share your deepest secrets', emoji: '🤫' },
  { id: 'question', name: 'Question', count: '60+ posts', desc: 'Ask anything to the community', emoji: '❓' },
  { id: 'advice', name: 'Advice', count: '40+ posts', desc: 'Give or seek life and coding advice', emoji: '💡' },
  { id: 'rant', name: 'Rant', count: '90+ posts', desc: 'Blow off steam anonymously', emoji: '😤' },
  { id: 'shower-thought', name: 'Shower Thought', count: '25+ posts', desc: 'Mind-bending late night thoughts', emoji: '🚿' },
];

const TRENDING_TAGS = ['anonymous', 'secrets', 'relationships', 'career', 'coding', 'gaming', 'lifehacks', 'confessions'];

function Explore() {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch initial random/recent posts
    const params = { limit: 15, sort: 'trending' };
    if (selectedCategory) params.category = selectedCategory;
    if (selectedTag) params.tag = selectedTag;
    if (search) params.search = search;

    dispatch(getPosts(params));
  }, [dispatch, selectedCategory, selectedTag, search]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId === selectedCategory ? null : catId);
    setSelectedTag(null);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setSelectedCategory(null);
  };

  const handleSearch = (query) => {
    setSearch(query);
  };

  const activeFilterName = selectedCategory 
    ? `Category: ${selectedCategory}` 
    : selectedTag 
    ? `Tag: #${selectedTag}` 
    : search 
    ? `Search: "${search}"` 
    : 'Trending Posts';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <RiCompassDiscoverLine className="text-accent text-4xl" />
          Explore <span className="gradient-text">Zylo</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Discover confessions, stories, advice, and trending anonymous conversations.
        </p>
      </div>

      {/* Search and Tag cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORY_INFOS.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`glass rounded-2xl p-5 text-left transition-all hover:scale-[1.01] flex items-start gap-4 ${
                    isSelected 
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/20' 
                      : 'hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-3xl p-2 bg-dark-500 rounded-xl">{cat.emoji}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white">{cat.name}</span>
                      <span className="text-xs text-gray-500 font-medium">({cat.count})</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{cat.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tag Cloud & Search */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Search Content</h2>
            <SearchBar onSearch={handleSearch} placeholder="Search anything..." />
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RiHashtag className="text-accent" />
              Trending Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'btn-gradient border-transparent text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section based on selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white border-l-4 border-cyan pl-3">
            {activeFilterName}
          </h2>
          {(selectedCategory || selectedTag || search) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedTag(null);
                setSearch('');
              }}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, idx) => <SkeletonCard key={idx} />)
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-gray-400">
              No posts found under this filter. Try explore other tags or categories!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;
