import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  RiNotification3Line,
  RiAddLine,
  RiLogoutBoxLine,
  RiUserLine,
  RiAdminLine,
  RiArrowDownSLine,
  RiMenuLine,
  RiCloseLine,
  RiSearchLine,
} from 'react-icons/ri';
import { logout } from '../../features/auth/authSlice';
import { getNotifications } from '../../features/notifications/notificationSlice';
import NotificationDropdown from '../notifications/NotificationDropdown';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (token) {
      dispatch(getNotifications());
    }
  }, [token, dispatch]);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
    setShowNotifications(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getInitial = () => {
    if (user?.anonymousName) return user.anonymousName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'Z';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-dark-500/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-extrabold gradient-text tracking-tight">Zylo</span>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300"
            />
          </div>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {token && user ? (
            <>
              {/* Create Post Button (desktop) */}
              <Link
                to="/create"
                className="hidden sm:flex items-center gap-2 btn-gradient px-4 py-2 rounded-xl text-sm font-semibold"
              >
                <RiAddLine className="w-4 h-4" />
                <span className="hidden lg:inline">Create</span>
              </Link>

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all duration-300"
                >
                  <RiNotification3Line className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger animate-pulse" />
                  )}
                </button>
                {showNotifications && (
                  <NotificationDropdown onClose={() => setShowNotifications(false)} />
                )}
              </div>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white text-sm font-bold">
                    {getInitial()}
                  </div>
                  <RiArrowDownSLine className={`w-4 h-4 text-gray-400 transition-transform duration-300 hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl p-2 animate-scale-in origin-top-right">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{user.anonymousName || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                      <RiUserLine className="w-4 h-4" />
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                      >
                        <RiAdminLine className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition-all duration-300"
                    >
                      <RiLogoutBoxLine className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-gradient px-4 py-2 rounded-xl text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile search toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all duration-300"
          >
            {showMobileMenu ? <RiCloseLine className="w-5 h-5" /> : <RiSearchLine className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden glass-strong border-t border-white/5 animate-slide-down">
          <div className="p-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative group">
                <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-accent/50 focus:outline-none transition-all"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
