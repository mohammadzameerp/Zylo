import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader } from './Loader';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, token, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
