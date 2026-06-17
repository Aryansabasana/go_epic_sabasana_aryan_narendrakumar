import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FiHome, 
  FiCode, 
  FiCheckSquare, 
  FiDatabase, 
  FiUser, 
  FiSliders, 
  FiLogOut, 
  FiSearch 
} from 'react-icons/fi';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/problems?keyword=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome />, roles: ['user', 'admin'] },
    { name: 'Problems', path: '/problems', icon: <FiCode />, roles: ['user', 'admin'] },
    { name: 'Solutions', path: '/solutions', icon: <FiCheckSquare />, roles: ['user', 'admin'] },
    { name: 'Datasets', path: '/datasets', icon: <FiDatabase />, roles: ['user', 'admin'] },
    { name: 'Profile', path: '/profile', icon: <FiUser />, roles: ['user', 'admin'] },
  ];

  // Add Admin item if role is admin
  if (user && user.role === 'admin') {
    menuItems.push({ name: 'Admin panel', path: '/admin', icon: <FiSliders />, roles: ['admin'] });
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">GoEpic</span>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <li key={item.path} className={`sidebar-item ${isActive ? 'active' : ''}`}>
                <Link to={item.path}>
                  {item.icon}
                  <span className="sidebar-item-text">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span className="logout-btn-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main viewport */}
      <div className="main-wrapper">
        <header className="navbar">
          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <FiSearch className="navbar-search-icon" />
            <input 
              type="text" 
              placeholder="Search problems or topics..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </form>

          <div className="navbar-actions">
            {user ? (
              <div className="user-profile-widget" onClick={() => navigate('/profile')}>
                <div className="user-avatar">
                  {getInitials(user.name)}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px' }}>Sign In</Link>
            )}
          </div>
        </header>

        <main className="content-viewport">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
