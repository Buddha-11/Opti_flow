import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/user';
import{ jwtDecode } from 'jwt-decode'; // Correct import without curly braces

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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

          // Simulate a delay before setting the state
          setTimeout(() => {
            setUser({ _id: decoded.id, admin: decoded.admin });
            setIsAuthenticated(true);
            setIsAdmin(decoded.admin); // This will update isAdmin after the delay

            console.log("User authenticated after delay, Admin status:", decoded.admin);
          }, 2000); // Delay for 2 seconds
          
        } catch (error) {
          console.log('Token is invalid or expired.', error);
          setIsAuthenticated(false);
        }
      } else {
        console.log("No token found, redirecting to login");
        setIsAuthenticated(false);
      }
    };

    // Call the function to handle the token decoding and state update
    handleToken();
  }, [setUser]); // Only setUser needs to be in the dependency array

  // Log state during rendering (after updates)
  setTimeout(() => {
    console.log("Render: isAdmin:", isAdmin, "isAuthenticated:", isAuthenticated);

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
  }, 2000);
  

  return children;
};

export default ProtectedRoute;
