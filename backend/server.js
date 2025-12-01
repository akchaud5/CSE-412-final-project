const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== USER ROUTES ====================

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT userid, username, email, isadmin FROM public."User" ORDER BY userid');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT userid, username, email, isadmin FROM public."User" WHERE userid = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user stats
app.get('/api/users/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const statsQuery = `
      SELECT 
        COUNT(*) as total_games,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_games,
        COUNT(CASE WHEN status = 'Playing' THEN 1 END) as playing_games,
        COUNT(CASE WHEN status = 'Wishlist' THEN 1 END) as wishlist_games,
        ROUND(AVG(userrating), 2) as avg_rating
      FROM libraryentry
      WHERE userid = $1
    `;
    const result = await pool.query(statsQuery, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    let updateFields = [];
    let values = [];
    let paramCount = 1;

    if (username) {
      updateFields.push(`username = $${paramCount}`);
      values.push(username);
      paramCount++;
    }
    if (email) {
      updateFields.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    if (password) {
      updateFields.push(`password = $${paramCount}`);
      values.push(password);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE public."User" SET ${updateFields.join(', ')} WHERE userid = $${paramCount} RETURNING userid, username, email, isadmin`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// ==================== GAME ROUTES ====================

// Get all games with optional filters
app.get('/api/games/filters', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ARRAY_AGG(DISTINCT platform) as platforms,
        ARRAY_AGG(DISTINCT genre) as genres,
        ARRAY_AGG(DISTINCT developer) as developers,
        MIN(releasedate) as min_date,
        MAX(releasedate) as max_date
      FROM game
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all games
app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM game ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get game by ID
app.get('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM game WHERE gameid = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new game
app.post('/api/games', async (req, res) => {
  try {
    const { title, platform, genre, developer, releasedate } = req.body;
    const result = await pool.query(
      'INSERT INTO game (title, platform, genre, developer, releasedate) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, platform, genre, developer, releasedate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update game (Admin only)
app.put('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, platform, genre, developer, releasedate } = req.body;
    const result = await pool.query(
      'UPDATE game SET title = $1, platform = $2, genre = $3, developer = $4, releasedate = $5 WHERE gameid = $6 RETURNING *',
      [title, platform, genre, developer, releasedate, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete game (Admin only)
app.delete('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM game WHERE gameid = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== LIBRARY ENTRY ROUTES ====================

// Get library entries for a user
app.get('/api/library/user/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const result = await pool.query(`
      SELECT l.*, g.title, g.platform, g.genre, g.developer, g.releasedate
      FROM libraryentry l
      JOIN game g ON l.gameid = g.gameid
      WHERE l.userid = $1
      ORDER BY l.entryid
    `, [userid]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add game to library
app.post('/api/library', async (req, res) => {
  try {
    const { userid, gameid, status, userrating, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO libraryentry (userid, gameid, status, userrating, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userid, gameid, status, userrating, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update library entry
app.put('/api/library/:entryid', async (req, res) => {
  try {
    const { entryid } = req.params;
    const { status, userrating, notes } = req.body;
    const result = await pool.query(
      'UPDATE libraryentry SET status = $1, userrating = $2, notes = $3 WHERE entryid = $4 RETURNING *',
      [status, userrating, notes, entryid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Library entry not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete library entry
app.delete('/api/library/:entryid', async (req, res) => {
  try {
    const { entryid } = req.params;
    const result = await pool.query('DELETE FROM libraryentry WHERE entryid = $1 RETURNING *', [entryid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Library entry not found' });
    }
    res.json({ message: 'Library entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== REVIEW ROUTES ====================

// Get reviews for a game
app.get('/api/reviews/game/:gameid', async (req, res) => {
  try {
    const { gameid } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.username, g.title
      FROM review r
      JOIN public."User" u ON r.userid = u.userid
      JOIN game g ON r.gameid = g.gameid
      WHERE r.gameid = $1
      ORDER BY r.reviewdate DESC
    `, [gameid]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reviews by a user
app.get('/api/reviews/user/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const result = await pool.query(`
      SELECT r.*, g.title, g.platform
      FROM review r
      JOIN game g ON r.gameid = g.gameid
      WHERE r.userid = $1
      ORDER BY r.reviewdate DESC
    `, [userid]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create review
app.post('/api/reviews', async (req, res) => {
  try {
    const { userid, gameid, rating, comment } = req.body;
    const result = await pool.query(
      'INSERT INTO review (userid, gameid, rating, comment, reviewdate) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *',
      [userid, gameid, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update review
app.put('/api/reviews/:reviewid', async (req, res) => {
  try {
    const { reviewid } = req.params;
    const { rating, comment } = req.body;
    const result = await pool.query(
      'UPDATE review SET rating = $1, comment = $2 WHERE reviewid = $3 RETURNING *',
      [rating, comment, reviewid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete review
app.delete('/api/reviews/:reviewid', async (req, res) => {
  try {
    const { reviewid } = req.params;
    const result = await pool.query('DELETE FROM review WHERE reviewid = $1 RETURNING *', [reviewid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================Game Statistics ROUTES ===============
app.get('/api/statistics/popularity/:game_status', async (req, res) => {
  try {
    //const { game_status } = req.params;
    let { game_status } = req.params;
    const queryParam = game_status === 'all' ? '%' : game_status;
    const result = await pool.query(`
      SELECT game.title, game.gameid, COUNT(*) AS numberOwned
      FROM libraryentry
      JOIN game ON libraryentry.gameid = game.gameid
      WHERE libraryentry.status LIKE $1
      GROUP BY game.gameid, game.title
      ORDER BY numberOwned DESC
      LIMIT 3
    `, [queryParam]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/statistics/rating/:game_genre', async (req, res) => {
  try {
    //const { game_genre } = req.params;
    let { game_genre } = req.params;
    const queryParam = game_genre === 'all' ? '%' : game_genre;
    const result = await pool.query(`
      SELECT game.title, game.gameid, AVG(review.rating) AS AverageReview
      FROM review
      JOIN game ON review.gameid = game.gameid
      WHERE game.genre LIKE $1
      GROUP BY game.gameid, game.title
      ORDER BY AverageReview DESC
      LIMIT 5
    `, [queryParam]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/statistics/Devs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT game.developer, COUNT(*) AS numberDevelopedGames
      FROM game
      GROUP BY game.developer
      ORDER BY numberDevelopedGames DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/statistics/Users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT public."User".username, COUNT(libraryentry.gameid) AS OwnedGames
      FROM public."User"
      JOIN libraryentry ON public."User".userid = libraryentry.userid
      GROUP BY public."User".userid
      ORDER BY OwnedGames DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'VG Tracker API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
