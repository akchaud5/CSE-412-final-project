import { useState, useEffect } from 'react';
import { gameAPI } from '../services/api';
import './Games.css';

function Games({ onGameSelect }) {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterDeveloper, setFilterDeveloper] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    filterGames();
  }, [searchTerm, filterPlatform, filterGenre, filterDeveloper, dateFrom, dateTo, sortBy, sortOrder, games]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await gameAPI.getAll();
      setGames(response.data);
      setFilteredGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGames = () => {
    let filtered = [...games];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(term) ||
        (game.developer && game.developer.toLowerCase().includes(term))
      );
    }

    // Platform filter
    if (filterPlatform) {
      filtered = filtered.filter(game => game.platform === filterPlatform);
    }

    // Genre filter
    if (filterGenre) {
      filtered = filtered.filter(game => game.genre === filterGenre);
    }

    // Developer filter
    if (filterDeveloper) {
      filtered = filtered.filter(game => game.developer === filterDeveloper);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(game =>
        game.releasedate && new Date(game.releasedate) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(game =>
        game.releasedate && new Date(game.releasedate) <= new Date(dateTo)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'releasedate':
          comparison = new Date(a.releasedate || 0) - new Date(b.releasedate || 0);
          break;
        case 'developer':
          comparison = (a.developer || '').localeCompare(b.developer || '');
          break;
        case 'platform':
          comparison = a.platform.localeCompare(b.platform);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredGames(filtered);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterPlatform('');
    setFilterGenre('');
    setFilterDeveloper('');
    setDateFrom('');
    setDateTo('');
    setSortBy('title');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm || filterPlatform || filterGenre || filterDeveloper || dateFrom || dateTo;

  const platforms = [...new Set(games.map(g => g.platform))].sort();
  const genres = [...new Set(games.map(g => g.genre).filter(Boolean))].sort();
  const developers = [...new Set(games.map(g => g.developer).filter(Boolean))].sort();

  if (loading) {
    return (
      <div className="loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="games">
      <div className="games-header">
        <h2>Game Library</h2>
        <p className="games-count">{filteredGames.length} of {games.length} Games</p>
      </div>

      {/* Filters */}
      <div className="filters-container card">
        <div className="filter-group">
          <input
            type="text"
            className="input search-input"
            placeholder="Search games or developers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <select
            className="select"
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
          >
            <option value="">All Platforms</option>
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>

          <select
            className="select"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <button
            className={`btn btn-toggle ${showAdvanced ? 'active' : ''}`}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Less Filters' : 'More Filters'}
          </button>

          {hasActiveFilters && (
            <button className="btn btn-clear" onClick={clearAllFilters}>
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="advanced-filters">
            <div className="filter-row">
              <select
                className="select"
                value={filterDeveloper}
                onChange={(e) => setFilterDeveloper(e.target.value)}
              >
                <option value="">All Developers</option>
                {developers.map(dev => (
                  <option key={dev} value={dev}>{dev}</option>
                ))}
              </select>

              <select
                className="select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title">Sort by Title</option>
                <option value="releasedate">Sort by Release Date</option>
                <option value="developer">Sort by Developer</option>
                <option value="platform">Sort by Platform</option>
              </select>

              <select
                className="select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="filter-row date-filters">
              <div className="date-input-group">
                <label>Released From:</label>
                <input
                  type="date"
                  className="input"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <label>Released To:</label>
                <input
                  type="date"
                  className="input"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="active-filters">
          {searchTerm && (
            <span className="filter-tag">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')}>x</button>
            </span>
          )}
          {filterPlatform && (
            <span className="filter-tag">
              Platform: {filterPlatform}
              <button onClick={() => setFilterPlatform('')}>x</button>
            </span>
          )}
          {filterGenre && (
            <span className="filter-tag">
              Genre: {filterGenre}
              <button onClick={() => setFilterGenre('')}>x</button>
            </span>
          )}
          {filterDeveloper && (
            <span className="filter-tag">
              Developer: {filterDeveloper}
              <button onClick={() => setFilterDeveloper('')}>x</button>
            </span>
          )}
          {dateFrom && (
            <span className="filter-tag">
              From: {dateFrom}
              <button onClick={() => setDateFrom('')}>x</button>
            </span>
          )}
          {dateTo && (
            <span className="filter-tag">
              To: {dateTo}
              <button onClick={() => setDateTo('')}>x</button>
            </span>
          )}
        </div>
      )}

      {/* Games Grid */}
      <div className="games-grid">
        {filteredGames.map((game) => (
          <div
            key={game.gameid}
            className="game-card card"
            onClick={() => onGameSelect(game)}
          >
            <div className="game-card-header">
              <h3 className="game-card-title">{game.title}</h3>
              <span className="game-platform-badge">{game.platform}</span>
            </div>

            <div className="game-card-body">
              <div className="game-info-row">
                <span className="info-label">Genre:</span>
                <span className="info-value">{game.genre || 'N/A'}</span>
              </div>
              <div className="game-info-row">
                <span className="info-label">Developer:</span>
                <span className="info-value">{game.developer || 'N/A'}</span>
              </div>
              <div className="game-info-row">
                <span className="info-label">Released:</span>
                <span className="info-value">
                  {game.releasedate ? new Date(game.releasedate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="game-card-footer">
              <button className="btn-view-reviews">
                View Reviews
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="empty-state">
          <p>No games found</p>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

export default Games;
