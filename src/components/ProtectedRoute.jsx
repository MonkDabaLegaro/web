import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserType } from '../utils/auth';

export default function ProtectedRoute({ children, allowedUserTypes }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (allowedUserTypes) {
    const userType = getUserType();
    if (!allowedUserTypes.includes(userType)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
