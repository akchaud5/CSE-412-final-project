import { useState, useEffect } from 'react';
import { gameAPI } from '../services/api';
import './Admin.css';

function Admin({ isAdmin }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    genre: '',
    developer: '',
    releasedate: ''
  });
  const [error, setError] = useState('');

  const platforms = ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X', 'Nintendo Switch', 'Nintendo 64', 'NES', 'Game Boy', 'GameCube'];
  const genres = ['Action', 'Action-Adventure', 'Action-RPG', 'RPG', 'FPS', 'Platformer', 'Puzzle', 'Simulation', 'Fighting', 'Horror', 'Survival Horror', 'Roguelike', 'Metroidvania', 'Shooter', 'MOBA', 'Battle Royale', 'Co-op Adventure', 'Card Game', 'Sandbox', 'Party'];

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await gameAPI.getAll();
      setGames(response.data);
    } catch (err) {
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      platform: '',
      genre: '',
      developer: '',
      releasedate: ''
    });
    setError('');
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      platform: game.platform,
      genre: game.genre,
      developer: game.developer,
      releasedate: game.releasedate ? game.releasedate.split('T')[0] : ''
    });
    setError('');
    setShowEditModal(true);
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.platform) {
      setError('Title and Platform are required');
      return;
    }

    try {
      await gameAPI.create(formData);
      setShowAddModal(false);
      resetForm();
      fetchGames();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add game');
    }
  };

  const handleEditGame = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.platform) {
      setError('Title and Platform are required');
      return;
    }

    try {
      await gameAPI.update(editingGame.gameid, formData);
      setShowEditModal(false);
      setEditingGame(null);
      resetForm();
      fetchGames();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update game');
    }
  };

  const handleDeleteGame = async (game) => {
    if (window.confirm(`Are you sure you want to delete "${game.title}"? This will also delete all associated library entries and reviews.`)) {
      try {
        await gameAPI.delete(game.gameid);
        fetchGames();
      } catch (err) {
        alert('Failed to delete game: ' + (err.response?.data?.error || 'Unknown error'));
      }
    }
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.developer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="admin-restricted">
        <div className="restricted-icon">🔒</div>
        <h2>Admin Access Required</h2>
        <p>You need administrator privileges to access this panel.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <p className="admin-subtitle">Manage games in the database</p>
      </div>

      <div className="admin-controls card">
        <input
          type="text"
          className="input search-input"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-add" onClick={openAddModal}>
          + Add New Game
        </button>
      </div>

      <div className="admin-stats">
        <span className="stat-item">Total Games: {games.length}</span>
        <span className="stat-item">Showing: {filteredGames.length}</span>
      </div>

      <div className="admin-table-container card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Platform</th>
              <th>Genre</th>
              <th>Developer</th>
              <th>Release Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map((game) => (
              <tr key={game.gameid}>
                <td>{game.gameid}</td>
                <td className="title-cell">{game.title}</td>
                <td><span className="platform-tag">{game.platform}</span></td>
                <td>{game.genre}</td>
                <td>{game.developer}</td>
                <td>{game.releasedate ? new Date(game.releasedate).toLocaleDateString() : '-'}</td>
                <td className="actions-cell">
                  <button className="btn-action btn-edit-small" onClick={() => openEditModal(game)}>
                    Edit
                  </button>
                  <button className="btn-action btn-delete-small" onClick={() => handleDeleteGame(game)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredGames.length === 0 && (
        <div className="empty-state">
          <p>No games found</p>
        </div>
      )}

      {/* Add Game Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Game</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>X</button>
            </div>
            <form onSubmit={handleAddGame}>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Platform *</label>
                  <select
                    className="select"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    required
                  >
                    <option value="">Select Platform</option>
                    {platforms.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <select
                    className="select"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  >
                    <option value="">Select Genre</option>
                    {genres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Developer</label>
                <input
                  type="text"
                  className="input"
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Release Date</label>
                <input
                  type="date"
                  className="input"
                  value={formData.releasedate}
                  onChange={(e) => setFormData({ ...formData, releasedate: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Game Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Game</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>X</button>
            </div>
            <form onSubmit={handleEditGame}>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Platform *</label>
                  <select
                    className="select"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    required
                  >
                    <option value="">Select Platform</option>
                    {platforms.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <select
                    className="select"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  >
                    <option value="">Select Genre</option>
                    {genres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Developer</label>
                <input
                  type="text"
                  className="input"
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Release Date</label>
                <input
                  type="date"
                  className="input"
                  value={formData.releasedate}
                  onChange={(e) => setFormData({ ...formData, releasedate: e.target.value })}
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
    </div>
  );
}

export default Admin;
