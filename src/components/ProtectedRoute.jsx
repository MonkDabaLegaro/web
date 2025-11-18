import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserType } from '../utils/auth';

export default function ProtectedRoute({ children, allowedUserTypes }) {
  const authenticated = isAuthenticated();
  const userType = getUserType();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    return <Navigate to={userType === 'admin' ? '/admin' : '/cliente'} replace />;
  }

  return children;
}
