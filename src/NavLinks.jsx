import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const NavLinks = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="collapse navbar-collapse justify-content-between">
      <ul className="navbar-nav">
        {!user && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') && (
          <li className="nav-item">
            <Link className="navbar-brand" to="/">ChatApp</Link>
          </li>
        )}
        {user && (
          <li className="nav-item">
            <Link className="nav-link" to="/chat">Chat</Link>
          </li>
        )}
      </ul>
      {user && (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to={`/user-profile/${user.userId}`}>
              <FontAwesomeIcon icon={faUser} /> Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/logout">Logout</Link>
          </li>
        </ul>
      )}
    </div>
  );
}

export default NavLinks;
