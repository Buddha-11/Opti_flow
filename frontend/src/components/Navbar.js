import { Link } from 'react-router-dom';
import '../index.css';
import { useContext } from 'react';
import { UserContext } from '../context/user';

const Navbar = () => {
  const { login, username1 } = useContext(UserContext);
  
  return (
    <header>
      <div className="Nav">
        <Link to="/">
          <h1>Optiflow</h1> {/* Add a title or logo if necessary */}
        </Link>
        {login ? (
          <div className="container2">
            <Link to="/">Logout</Link>
            <h3>{username1}</h3>
            <Link to="/profile">Profile</Link>
          </div>
        ) : (
          <div className="container2">
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
