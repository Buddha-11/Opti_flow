import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user';
import '../index.css';

const ProfileUpdate = () => {
  const { setUsername1 } = useContext(UserContext); // Using context to update the username globally
  const [username, setUsername] = useState('');
  const [designation, setDesignation] = useState(''); // New field for designation
  const [errors, setErrors] = useState({ username: '', designation: '', form: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !designation.trim()) {
      setErrors({ 
        ...errors, 
        username: !username.trim() ? 'Username is required.' : '', 
        designation: !designation.trim() ? 'Designation is required.' : '' 
      });
      return;
    }

    const updatedProfile = { username, designation }; // Fields to be updated

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
  };

  return (
    <form className="update" onSubmit={handleSubmit}>
      <h3>Update Profile</h3>

      <label>Username:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      {errors.username && <div className="error">{errors.username}</div>}

      <label>Designation:</label> {/* Field for designation */}
      <input
        type="text"
        onChange={(e) => setDesignation(e.target.value)}
        value={designation}
      />
      {errors.designation && <div className="error">{errors.designation}</div>}

      <button type="submit">Update Profile</button>
      {errors.form && <div className="error">{errors.form}</div>}
    </form>
  );
};

export default ProfileUpdate;
