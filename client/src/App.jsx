import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './features/auth/authSlice';

// Layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';

// Common components
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import AdminPanel from './pages/AdminPanel';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
  }, [dispatch, token, user]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-dark-700 text-white flex flex-col font-sans">
      {!isAuthPage && <Navbar />}
      
      <div className={`flex-1 flex max-w-7xl w-full mx-auto px-4 md:px-6 lg:px-8 py-6 pb-24 md:pb-6 gap-6 ${!isAuthPage ? 'pt-16' : ''}`}>
        {/* Sidebar on desktop */}
        {!isAuthPage && (
          <aside className="hidden md:block w-64 shrink-0">
            <Sidebar />
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/post/:id" element={<PostDetail />} />
            
            {/* Protected Routes */}
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {!isAuthPage && <MobileNav />}
    </div>
  );
}

export default App;
