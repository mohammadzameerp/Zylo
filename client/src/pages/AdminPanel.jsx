import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';
import { RiShieldUserLine, RiDeleteBin7Line, RiFlagLine, RiUserLine, RiFileList2Line, RiChat3Line } from 'react-icons/ri';

function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [stats, setStats] = useState(null);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, reportsRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/reported-posts'),
        ]);

        setStats(statsRes.data.data || statsRes.data);
        setReportedPosts(reportsRes.data.posts || reportsRes.data.data || reportsRes.data);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to load admin dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAdminData();
    }
  }, [user, navigate]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action is permanent.')) {
      return;
    }
    try {
      await API.delete(`/admin/posts/${postId}`);
      toast.success('Post deleted successfully');
      // Update local state
      setReportedPosts((prev) => prev.filter((p) => p._id !== postId));
      // Refresh stats
      const statsRes = await API.get('/admin/stats');
      setStats(statsRes.data.data || statsRes.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete post');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <RiShieldUserLine className="text-danger text-4xl" />
          Admin <span className="text-danger">Moderation Panel</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Review reported posts, moderate inappropriate content, and view platform statistics.
        </p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass border-l-4 border-l-accent rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400">Total Users</p>
            <p className="text-3xl font-black text-white mt-1">{stats?.totalUsers || 0}</p>
          </div>
          <div className="p-3.5 bg-accent/10 text-accent rounded-xl">
            <RiUserLine className="text-2xl" />
          </div>
        </div>

        <div className="glass border-l-4 border-l-cyan rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400">Total Posts</p>
            <p className="text-3xl font-black text-white mt-1">{stats?.totalPosts || 0}</p>
          </div>
          <div className="p-3.5 bg-cyan/10 text-cyan rounded-xl">
            <RiFileList2Line className="text-2xl" />
          </div>
        </div>

        <div className="glass border-l-4 border-l-purple-500 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400">Total Comments</p>
            <p className="text-3xl font-black text-white mt-1">{stats?.totalComments || 0}</p>
          </div>
          <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-xl">
            <RiChat3Line className="text-2xl" />
          </div>
        </div>

        <div className="glass border-l-4 border-l-danger rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400">Reported Posts</p>
            <p className="text-3xl font-black text-danger mt-1">{stats?.reportedPosts || reportedPosts.length}</p>
          </div>
          <div className="p-3.5 bg-danger/10 text-danger rounded-xl">
            <RiFlagLine className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Reported Posts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white border-l-4 border-danger pl-3">
          Moderation Queue ({reportedPosts.length} reported items)
        </h2>

        <div className="space-y-4">
          {reportedPosts.length > 0 ? (
            reportedPosts.map((post) => (
              <div key={post._id} className="glass rounded-2xl p-6 space-y-4 border-danger/30 hover:border-danger/50 transition-all">
                {/* Author & Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-dark-500 flex items-center justify-center font-bold border border-white/10">
                      {post.author?.anonymousName ? post.author.anonymousName[0].toUpperCase() : 'A'}
                    </span>
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        {post.author?.anonymousName || 'Anonymous'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Reports received: <span className="text-danger font-bold">{post.reportCount || post.reportedBy?.length || 0}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Moderate Action */}
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-danger/15 hover:bg-danger/25 border border-danger/30 text-danger rounded-xl text-xs font-bold transition-all"
                  >
                    <RiDeleteBin7Line className="text-sm" />
                    Delete Post
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-400 capitalize">
                    {post.category}
                  </span>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{post.content}</p>
                  
                  {post.image && (
                    <div className="rounded-xl overflow-hidden max-w-md border border-white/5">
                      <img src={post.image} alt="Reported upload" className="w-full object-cover max-h-60" />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-gray-400">
              Clean queue! No reported posts currently.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
