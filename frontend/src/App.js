import React, { useState, useEffect } from 'react';
import './styles.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Chatbot from './components/Chatbot';
import Directory from './components/Directory';
import Community from './components/Community';

function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('chatbot');
  const [showRegister, setShowRegister] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved user and theme
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentTab('chatbot');
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const FloatingElements = () => (
    <div className="floating-elements">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="floating-element"></div>
      ))}
    </div>
  );

  if (!user) {
    return (
      <div className="app">
        <FloatingElements />
        
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                🌟 TherapyConnect
              </div>
              <div className="header-actions">
                <button 
                  className="btn btn-ghost"
                  onClick={toggleTheme}
                >
                  {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container">
          <div style={{ padding: '2rem 0' }}>
            {/* Welcome Section */}
            <div className="text-center mb-lg animate-fade-in">
              <h1 className="text-gradient mb-sm">
                Welcome to TherapyConnect
              </h1>
              <p style={{ 
                fontSize: '1.25rem', 
                color: 'var(--text-secondary)', 
                fontWeight: '500',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Empowering families to find help, faster.
              </p>
            </div>

            {/* Login/Register Toggle */}
            <div className="nav-tabs animate-slide-in-up" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <button 
                className={`nav-tab ${!showRegister ? 'active' : ''}`}
                onClick={() => setShowRegister(false)}
              >
                <span className="nav-tab-icon">🔑</span>
                Login
              </button>
              <button 
                className={`nav-tab ${showRegister ? 'active' : ''}`}
                onClick={() => setShowRegister(true)}
              >
                <span className="nav-tab-icon">✨</span>
                Create Account
              </button>
            </div>

            {/* Login/Register Forms */}
            <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
              {showRegister ? (
                <Register 
                  onRegister={handleLogin} 
                  onSwitchToLogin={() => setShowRegister(false)}
                />
              ) : (
                <Login 
                  onLogin={handleLogin} 
                  onSwitchToRegister={() => setShowRegister(true)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <FloatingElements />
      
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              🌟 TherapyConnect
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-sm)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              <span>Welcome, <strong style={{ color: 'var(--text-accent)' }}>{user.full_name || user.role}</strong></span>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-ghost"
                onClick={toggleTheme}
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Navigation Tabs */}
        <div className="nav-tabs animate-slide-in-down">
          <button 
            className={`nav-tab ${currentTab === 'chatbot' ? 'active' : ''}`}
            onClick={() => setCurrentTab('chatbot')}
          >
            <span className="nav-tab-icon">🤖</span>
            AI Assistant
          </button>
          <button 
            className={`nav-tab ${currentTab === 'directory' ? 'active' : ''}`}
            onClick={() => setCurrentTab('directory')}
          >
            <span className="nav-tab-icon">👥</span>
            Find Therapists
          </button>
          <button 
            className={`nav-tab ${currentTab === 'community' ? 'active' : ''}`}
            onClick={() => setCurrentTab('community')}
          >
            <span className="nav-tab-icon">💬</span>
            Community
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {currentTab === 'chatbot' && <Chatbot user={user} />}
          {currentTab === 'directory' && <Directory user={user} />}
          {currentTab === 'community' && <Community user={user} />}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        marginTop: 'var(--space-2xl)',
        padding: 'var(--space-lg) 0',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <div className="container">
          <p>© 2024 TherapyConnect. Empowering families with care and support.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

