import { useState, useEffect } from 'react';
import { userAPI, libraryAPI, gameAPI } from '../services/api';
import './Profile.css';

function Profile({ userId, onUserUpdate }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '', password: '' });
  const [editError, setEditError] = useState('');
  const [allGames, setAllGames] = useState([]);
  const [addGameForm, setAddGameForm] = useState({ gameid: '', status: 'Playing', notes: '' });

  useEffect(() => {
    if (userId) {
      fetchProfileData();
      fetchAllGames();
    }
  }, [userId]);

  const fetchAllGames = async () => {
    try {
      const response = await gameAPI.getAll();
      setAllGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [userRes, statsRes, libraryRes] = await Promise.all([
        userAPI.getById(userId),
        userAPI.getStats(userId),
        libraryAPI.getByUser(userId)
      ]);
      setUser(userRes.data);
      setStats(statsRes.data);
      setLibrary(libraryRes.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      username: user?.username || '',
      email: user?.email || '',
      password: ''
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');

    const updateData = {};
    if (editForm.username !== user.username) updateData.username = editForm.username;
    if (editForm.email !== user.email) updateData.email = editForm.email;
    if (editForm.password) updateData.password = editForm.password;

    if (Object.keys(updateData).length === 0) {
      setShowEditModal(false);
      return;
    }

    try {
      const response = await userAPI.update(userId, updateData);
      setUser(response.data);
      if (onUserUpdate) onUserUpdate(response.data);
      setShowEditModal(false);
    } catch (error) {
      setEditError(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!addGameForm.gameid) return;

    try {
      await libraryAPI.add({
        userid: userId,
        gameid: parseInt(addGameForm.gameid),
        status: addGameForm.status,
        userrating: null,
        notes: addGameForm.notes
      });
      setShowAddModal(false);
      setAddGameForm({ gameid: '', status: 'Playing', notes: '' });
      fetchProfileData();
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  const updateLibraryEntry = async (entryid, status, rating) => {
    try {
      await libraryAPI.update(entryid, { status, userrating: rating, notes: '' });
      fetchProfileData();
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const deleteLibraryEntry = async (entryid) => {
    if (window.confirm('Remove this game from your library?')) {
      try {
        await libraryAPI.delete(entryid);
        fetchProfileData();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  // Get games not already in library
  const availableGames = allGames.filter(
    game => !library.some(entry => entry.gameid === game.gameid)
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="profile">
      {/* User Info Card */}
      <div className="profile-header card">
        <div className="profile-avatar">
          <div className="avatar-icon">👤</div>
        </div>
        <div className="profile-info">
          <h2 className="profile-username">{user?.username}</h2>
          <p className="profile-email">{user?.email}</p>
          {user?.isadmin && <span className="admin-badge">ADMIN</span>}
        </div>
        <button className="btn btn-edit" onClick={openEditModal}>
          Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-value">{stats?.total_games || 0}</div>
          <div className="stat-label">Total Games</div>
        </div>
        <div className="stat-card card">
          <div className="stat-value">{stats?.completed_games || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card card">
          <div className="stat-value">{stats?.playing_games || 0}</div>
          <div className="stat-label">Playing</div>
        </div>
        <div className="stat-card card">
          <div className="stat-value">{stats?.avg_rating || 'N/A'}</div>
          <div className="stat-label">Avg Rating</div>
        </div>
      </div>

      {/* Library Section */}
      <div className="library-section">
        <div className="section-header">
          <h3>Your Library</h3>
          <button className="btn btn-add" onClick={() => setShowAddModal(true)}>
            + Add Game
          </button>
        </div>

        <div className="library-grid">
          {library.map((entry) => (
            <div key={entry.entryid} className="library-card card">
              <div className="library-card-header">
                <h4 className="game-title">{entry.title}</h4>
                <span className="platform-badge">{entry.platform}</span>
              </div>

              <div className="game-details">
                <p><strong>Genre:</strong> {entry.genre}</p>
                <p><strong>Developer:</strong> {entry.developer}</p>
                <p><strong>Released:</strong> {new Date(entry.releasedate).toLocaleDateString()}</p>
              </div>

              <div className="library-controls">
                <select
                  className="select status-select"
                  value={entry.status}
                  onChange={(e) => updateLibraryEntry(entry.entryid, e.target.value, entry.userrating)}
                >
                  <option value="Wishlist">Wishlist</option>
                  <option value="Playing">Playing</option>
                  <option value="Completed">Completed</option>
                  <option value="Dropped">Dropped</option>
                  <option value="Backlog">Backlog</option>
                </select>

                <select
                  className="select rating-select"
                  value={entry.userrating || ''}
                  onChange={(e) => updateLibraryEntry(entry.entryid, entry.status, e.target.value)}
                >
                  <option value="">No Rating</option>
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★ (4)</option>
                  <option value="3">★★★ (3)</option>
                  <option value="2">★★ (2)</option>
                  <option value="1">★ (1)</option>
                </select>

                <button
                  className="btn-icon btn-delete"
                  onClick={() => deleteLibraryEntry(entry.entryid)}
                  title="Remove from library"
                >
                  X
                </button>
              </div>

              {entry.notes && (
                <div className="game-notes">
                  <strong>Notes:</strong> {entry.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        {library.length === 0 && (
          <div className="empty-state">
            <p>No games in your library yet</p>
            <p>Click "Add Game" to get started!</p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>X</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              {editError && <div className="error-message">{editError}</div>}
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="input"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="input"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  className="input"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Game Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Game to Library</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>X</button>
            </div>
            <form onSubmit={handleAddGame}>
              <div className="form-group">
                <label>Select Game</label>
                <select
                  className="select"
                  value={addGameForm.gameid}
                  onChange={(e) => setAddGameForm({ ...addGameForm, gameid: e.target.value })}
                  required
                >
                  <option value="">-- Choose a game --</option>
                  {availableGames.map((game) => (
                    <option key={game.gameid} value={game.gameid}>
                      {game.title} ({game.platform})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  className="select"
                  value={addGameForm.status}
                  onChange={(e) => setAddGameForm({ ...addGameForm, status: e.target.value })}
                >
                  <option value="Wishlist">Wishlist</option>
                  <option value="Playing">Playing</option>
                  <option value="Completed">Completed</option>
                  <option value="Dropped">Dropped</option>
                  <option value="Backlog">Backlog</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  className="input textarea"
                  value={addGameForm.notes}
                  onChange={(e) => setAddGameForm({ ...addGameForm, notes: e.target.value })}
                  placeholder="Add notes about this game..."
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
