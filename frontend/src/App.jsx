import { useState, useEffect } from 'react';
import { userAPI } from './services/api';
import Profile from './components/Profile';
import Games from './components/Games';
import Reviews from './components/Reviews';
import Admin from './components/Admin';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);

  // For demo purposes, using user ID 7 (akchaud5)
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await userAPI.getById(7);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setCurrentUser({ userid: 7, username: 'akchaud5', isadmin: true });
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setActiveTab('reviews');
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="bg-grid"></div>
        <div className="bg-glow"></div>
        <div className="loading">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Animated background */}
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">▶</div>
            <h1>VG TRACKER</h1>
          </div>
          {currentUser && (
            <div className="user-badge">
              <span className="user-icon">👤</span>
              <span className="username">{currentUser.username}</span>
              {currentUser.isadmin && <span className="admin-indicator">ADMIN</span>}
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          <span className="tab-text">Profile</span>
        </button>
        <button
          className={`tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          <span className="tab-icon">🎮</span>
          <span className="tab-text">Games</span>
        </button>
        <button
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <span className="tab-icon">⭐</span>
          <span className="tab-text">Reviews</span>
        </button>
        {currentUser?.isadmin && (
          <button
            className={`tab tab-admin ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <span className="tab-icon">⚙️</span>
            <span className="tab-text">Admin</span>
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'profile' && (
          <Profile
            userId={currentUser?.userid}
            onUserUpdate={handleUserUpdate}
          />
        )}
        {activeTab === 'games' && <Games onGameSelect={handleGameSelect} />}
        {activeTab === 'reviews' && (
          <Reviews
            userId={currentUser?.userid}
            selectedGame={selectedGame}
            onBack={() => setSelectedGame(null)}
          />
        )}
        {activeTab === 'admin' && (
          <Admin isAdmin={currentUser?.isadmin} />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>CSE 412 - Database Management | Group 4 | Phase 3</p>
        <p>Ayush Chaudhary - Vibhav Khare - Swar Mahesh Khatav - Owen Krueger</p>
      </footer>
    </div>
  );
}

export default App;
