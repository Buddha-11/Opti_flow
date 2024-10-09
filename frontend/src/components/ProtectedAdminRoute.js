import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/user'; // Adjust the path based on your project structure

const ProtectedAdminRoute = ({ element }) => {
  const { user } = useContext(UserContext);

  // Here we assume user object has a role field, adjust based on your actual user data
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login_admin" replace />;
  }

  return element;
};

export default ProtectedAdminRoute;
