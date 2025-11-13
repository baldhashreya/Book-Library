import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Set active menu based on current path
  const getActiveMenu = () => {
    if (location.pathname === '/dashboard') return 'dashboard';
    if (location.pathname === '/books') return 'book';
    if (location.pathname === '/categories') return 'category';
    if (location.pathname === '/users') return 'users';
    if (location.pathname === '/roles') return 'roles';
    if (location.pathname === '/about-me') return 'about-me';
    return 'dashboard';
  };

  const [activeMenu, setActiveMenu] = useState(getActiveMenu());

  // Update active menu when location changes
  useEffect(() => {
    setActiveMenu(getActiveMenu());
  }, [location.pathname]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'book', label: 'Book', icon: '📚', path: '/books' },
    { id: 'category', label: 'Category', icon: '📑', path: '/categories' },
    { id: 'users', label: 'Users', icon: '👥', path: '/users' },
    { id: 'roles', label: 'Roles', icon: '👑', path: '/roles' },
  ];

  const handleMenuClick = (menuId: string, path: string) => {
    setActiveMenu(menuId);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/about-me');
  };

  // Get user data from localStorage as fallback
  const getUserData = () => {
    if (user) return user;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    return { name: 'User', email: 'user@example.com' };
  };

  const currentUser = getUserData();

  return (
    <div className="main-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">📖 BookLib</h2>
          <p className="tagline">Your Digital Library</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id, item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">
              {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="header-right">
            <button className="profile-btn" onClick={handleProfileClick}>
              <span className="profile-icon">👤</span>
              <span className="profile-name">{currentUser.name}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
          </div>
        </header>

        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;