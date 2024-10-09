import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user';
import '../index.css';
import {jwtDecode} from 'jwt-decode'; // Correct import without curly braces

const ProfileUpdate = () => {
  const [loading, setLoading] = useState(true); // Set to true initially
  const { setUsername1 } = useContext(UserContext); // Using context to update the username globally
  const [username, setUsername] = useState('');
  const [designation, setDesignation] = useState(''); // New field for designation
  const [errors, setErrors] = useState({ username: '', designation: '', form: '' });
  const navigate = useNavigate();
  let id; // Variable for user ID

  // Decode the token on component mount and handle the loading state
  useEffect(() => {
    const handleToken = () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('jwt='));
      console.log('Token found in cookie:', token);

      if (token) {
        const tokenValue = token.split('=')[1];
        try {
          const decoded = jwtDecode(tokenValue);
          console.log('Decoded token:', decoded);
          id = decoded.id; // Set the user ID from token
          console.log(id);
        } catch (error) {
          console.log('Token is invalid or expired.', error);
        }
      } else {
        console.log('No token found, redirecting to login');
      }

      // Set loading to false after the token is decoded
      setLoading(false);
    };

    // Call the function to decode the token
    handleToken();
  }, []); // Run once when the component is mounted

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!username.trim() || !designation.trim()) {
      setErrors({ 
        ...errors, 
        username: !username.trim() ? 'Username is required.' : '', 
        designation: !designation.trim() ? 'Designation is required.' : '' 
      });
      return;
    }

    // Only proceed if loading is false (i.e., token is decoded)
    if (!loading) {
      const updatedProfile = { username, designation, id }; // Fields to be updated

      try {
        const response = await fetch('/api/update_profile', {
          method: 'PATCH',
          body: JSON.stringify(updatedProfile),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();

        if (!response.ok) {
          setErrors(json.errors);
        } else {
          setUsername1(username); // Update the context with the new username
          setErrors({ username: '', designation: '', form: '' });
          setUsername('');
          setDesignation('');
          navigate('/profile'); // Redirect after successful update
          console.log('Profile updated successfully:', json);
        }
      } catch (err) {
        console.error('Request failed:', err);
        setErrors({ ...errors, form: 'Failed to update profile. Please try again later.' });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state while decoding the token
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Update Profile</h3>

      <label>Username:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={loading} // Disable input when loading
      />
      {errors.username && <div className="error">{errors.username}</div>}

      <label>Designation:</label> {/* Field for designation */}
      <input
        type="text"
        onChange={(e) => setDesignation(e.target.value)}
        value={designation}
        disabled={loading} // Disable input when loading
      />
      {errors.designation && <div className="error">{errors.designation}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Update Profile'}
      </button>
      {errors.form && <div className="error">{errors.form}</div>}
    </form>
  );
};

export default ProfileUpdate;
