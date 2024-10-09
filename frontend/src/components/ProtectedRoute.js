import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/user';
import {jwtDecode} from 'jwt-decode'; // Ensure the correct import

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    console.log("ProtectedRoute useEffect running");

    // Function to handle token decoding and state setting
    const handleToken = () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('jwt='));
      console.log('Token found in cookie:', token);

      if (token) {
        const tokenValue = token.split('=')[1];
        try {
          const decoded = jwtDecode(tokenValue);
          console.log('Decoded token:', decoded);

          // Update the user context and states
          setUser({ _id: decoded.id, admin: decoded.admin });
          setIsAuthenticated(true);
          setIsAdmin(decoded.admin); // Update admin status
          
          console.log("User authenticated, Admin status:", decoded.admin);
        } catch (error) {
          console.log('Token is invalid or expired.', error);
          setIsAuthenticated(false);
        }
      } else {
        console.log("No token found, redirecting to login");
        setIsAuthenticated(false);
      }

      // Set loading to false after processing is done
      setLoading(false);
    };

    // Call the function to handle the token decoding and state update
    handleToken();
  }, [setUser]); // Only setUser needs to be in the dependency array

  // Log state during rendering
  console.log("Render: isAdmin:", isAdmin, "isAuthenticated:", isAuthenticated);

  // If loading, don't render anything yet
  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // Redirect to /login_admin if it's an admin-only route but user isn't an admin
  if (adminOnly && !isAdmin) {
    console.log("Admin-only route, but user is not an admin. Redirecting to /login_admin");
    return <Navigate to="/login_admin" />;
  }

  // Redirect to /login if the user is not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /login");
    return <Navigate to="/login" />;
  }

  return children; // Render the protected children if authenticated
};

export default ProtectedRoute;
