import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getStats: (id) => api.get(`/users/${id}/stats`),
  update: (id, data) => api.put(`/users/${id}`, data),
};

export const gameAPI = {
  getAll: () => api.get('/games'),
  getById: (id) => api.get(`/games/${id}`),
  getFilters: () => api.get('/games/filters'),
  create: (game) => api.post('/games', game),
  update: (id, game) => api.put(`/games/${id}`, game),
  delete: (id) => api.delete(`/games/${id}`),
};

export const libraryAPI = {
  getByUser: (userid) => api.get(`/library/user/${userid}`),
  add: (entry) => api.post('/library', entry),
  update: (entryid, entry) => api.put(`/library/${entryid}`, entry),
  delete: (entryid) => api.delete(`/library/${entryid}`),
};

export const reviewAPI = {
  getByGame: (gameid) => api.get(`/reviews/game/${gameid}`),
  getByUser: (userid) => api.get(`/reviews/user/${userid}`),
  create: (review) => api.post('/reviews', review),
  update: (reviewid, review) => api.put(`/reviews/${reviewid}`, review),
  delete: (reviewid) => api.delete(`/reviews/${reviewid}`),
};

export default api;
