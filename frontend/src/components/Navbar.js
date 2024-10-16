import { Link } from 'react-router-dom';
import '../index.css';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context/user';

const Navbar = () => {
  const { login, setLogin, username1, setUsername1 } = useContext(UserContext);

  useEffect(() => {
   
    const storedUsername = localStorage.getItem('username');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (storedUsername && !username1) {
      setUsername1(storedUsername); 
    }

    if (isLoggedIn && !login) {
      setLogin(true); 
    }
  }, [username1, setUsername1, login, setLogin]);

  return (
    <header>
      <div className="Nav">
        <Link to="/">
          <h1>Optiflow</h1>
        </Link>

        <div className="container2">
          {login ? (
            <>
              <Link to="/logout">Logout</Link>
              <h3>{username1}</h3>
              <Link to="/profile">Profile</Link>
              <Link to="/update_profile">Update Profile</Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
