import { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import './Reviews.css';

function Reviews({ userId, selectedGame, onBack }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (selectedGame) {
      fetchReviews();
    }
  }, [selectedGame]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getByGame(selectedGame.gameid);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewAPI.create({
        userid: userId,
        gameid: selectedGame.gameid,
        rating: parseInt(newReview.rating),
        comment: newReview.comment
      });
      setNewReview({ rating: 5, comment: '' });
      setShowAddReview(false);
      fetchReviews();
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Error creating review. You may have already reviewed this game.');
    }
  };

  const handleDeleteReview = async (reviewid) => {
    if (window.confirm('Delete this review?')) {
      try {
        await reviewAPI.delete(reviewid);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  if (!selectedGame) {
    return (
      <div className="reviews-empty">
        <div className="empty-state">
          <p>🎮 Select a game from the Games tab to view reviews</p>
        </div>
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
    <div className="reviews">
      {/* Game Header */}
      <div className="reviews-header card">
        <button className="btn-back" onClick={onBack}>
          ← Back to Games
        </button>
        <div className="game-header-content">
          <div>
            <h2 className="game-title-large">{selectedGame.title}</h2>
            <div className="game-meta">
              <span className="meta-item">{selectedGame.platform}</span>
              <span className="meta-separator">•</span>
              <span className="meta-item">{selectedGame.genre}</span>
              <span className="meta-separator">•</span>
              <span className="meta-item">{selectedGame.developer}</span>
            </div>
          </div>
          <button
            className="btn btn-add-review"
            onClick={() => setShowAddReview(!showAddReview)}
          >
            {showAddReview ? '✖ Cancel' : '➕ Add Review'}
          </button>
        </div>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <div className="add-review-card card">
          <h3>Write Your Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                className="select"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                required
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 - Masterpiece)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Great)</option>
                <option value="3">⭐⭐⭐ (3 - Good)</option>
                <option value="2">⭐⭐ (2 - Fair)</option>
                <option value="1">⭐ (1 - Poor)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Your Review</label>
              <textarea
                id="comment"
                className="input textarea"
                rows="5"
                placeholder="Share your thoughts about this game..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn">
                Submit Review
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddReview(false);
                  setNewReview({ rating: 5, comment: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-section">
        <h3 className="reviews-section-title">
          User Reviews ({reviews.length})
        </h3>

        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.reviewid} className="review-card card">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-icon">👤</span>
                  <span className="reviewer-name">{review.username}</span>
                  {review.userid === userId && (
                    <span className="you-badge">YOU</span>
                  )}
                </div>
                <div className="review-meta">
                  <span className="review-date">
                    {new Date(review.reviewdate).toLocaleDateString()}
                  </span>
                  {review.userid === userId && (
                    <button
                      className="btn-icon-small"
                      onClick={() => handleDeleteReview(review.reviewid)}
                      title="Delete review"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <div className="review-rating">
                <span className="stars">{renderStars(review.rating)}</span>
                <span className="rating-text">({review.rating}/5)</span>
              </div>

              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="empty-state">
            <p>📝 No reviews yet for this game</p>
            <p>Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;
