import { Link } from 'react-router-dom';
import '../index.css';
import { useContext } from 'react';
import { UserContext } from '../context/user';

const Navbar=(e)=>{
    const { login,username1 } = useContext(UserContext);
    return (
        <header>
            <div className="Nav">
            <Link to="/">
        </Link>
        {login ? (
          <div className="container2">
            <a href="/">Logout</a>
            <h3>{username1}</h3>
            <Link to="/profile">Profile</Link>
          </div>
        ) : (
          <div className="container2">
            <Link to="/">
              <h1>  Home</h1>
            </Link>
            <Link to="/signup">
              <h1>Signup</h1>
            </Link>
            <Link to="/login">
              <h1>Login</h1>
            </Link>
            </div>
            
        )}
        </div>
        </header>
    );
};
export default Navbar;