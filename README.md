# VG Tracker - Video Game Library Management System

**CSE 412 - Database Management - Phase 3**
**Group 4:** Ayush Chaudhary, Vibhav Khare, Swar Mahesh Khatav, Owen Krueger

A full-stack web application for managing your video game library, tracking gameplay progress, and sharing reviews with others.

## Features

### Profile Tab
- View and edit user profile information (username, email, password)
- Display comprehensive gaming statistics (total games, completed, playing, average rating)
- Add games to your personal library from the database
- Update game status (Wishlist, Playing, Completed, Dropped, Backlog)
- Rate games in your library (1-5 stars)
- Add notes to games
- Remove games from your library

### Games Tab
- Browse complete database of video games
- Search by game title or developer
- Filter by platform, genre, and developer
- Advanced filters with date range selection
- Sort by title, release date, developer, or platform
- Active filter tags with quick removal
- Click any game to view its reviews

### Reviews Tab
- View all user reviews for a selected game
- See reviewer information and ratings
- Add your own reviews for games
- Delete your own reviews
- View review dates and ratings with star display

### Admin Panel (Admin Users Only)
- View all games in a table format
- Add new games to the database
- Edit existing game details
- Delete games from the database
- Search games within admin panel

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and development server
- **Axios** - HTTP client for API requests
- **Custom CSS** - Cyberpunk/gaming-themed design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before running this application, ensure you have:
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Quick Start

### 1. Database Setup

```bash
# Create the database
createdb vgTracker

# Run the schema
psql -d vgTracker -f database/schema_fixed.sql

# Load sample data
psql -d vgTracker -f database/seed.sql
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your PostgreSQL credentials

npm start
# Backend runs on http://localhost:3001
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 4. Access the Application

Open http://localhost:3000 in your browser.

## Database Schema

The application uses four main tables:

### User
- `userid` (Primary Key, Auto-increment)
- `username` (Unique, Not Null)
- `email` (Unique, Not Null)
- `password` (Not Null)
- `isadmin` (Boolean, Default: false)

### Game
- `gameid` (Primary Key, Auto-increment)
- `title` (Not Null)
- `platform` (Not Null)
- `genre`
- `developer`
- `releasedate` (Date)

### LibraryEntry
- `entryid` (Primary Key, Auto-increment)
- `userid` (Foreign Key -> User)
- `gameid` (Foreign Key -> Game)
- `status` (Wishlist/Playing/Completed/Dropped/Backlog)
- `userrating` (Integer, 1-5)
- `notes` (Text)

### Review
- `reviewid` (Primary Key, Auto-increment)
- `userid` (Foreign Key -> User)
- `gameid` (Foreign Key -> Game)
- `rating` (Integer, 1-5, Not Null)
- `comment` (Text)
- `reviewdate` (Date, Default: CURRENT_DATE)

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/stats` - Get user statistics
- `PUT /api/users/:id` - Update user profile

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `GET /api/games/filters` - Get filter options
- `POST /api/games` - Create new game (Admin)
- `PUT /api/games/:id` - Update game (Admin)
- `DELETE /api/games/:id` - Delete game (Admin)

### Library
- `GET /api/library/user/:userid` - Get user's library
- `POST /api/library` - Add game to library
- `PUT /api/library/:entryid` - Update library entry
- `DELETE /api/library/:entryid` - Remove from library

### Reviews
- `GET /api/reviews/game/:gameid` - Get reviews for a game
- `GET /api/reviews/user/:userid` - Get user's reviews
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:reviewid` - Update review
- `DELETE /api/reviews/:reviewid` - Delete review

## CRUD Operations Demonstrated

### CREATE
- Add games to library (POST /api/library)
- Write reviews (POST /api/reviews)
- Add new games via Admin Panel (POST /api/games)

### READ
- View user profile (GET /api/users/:id)
- Browse all games (GET /api/games)
- Read reviews (GET /api/reviews/game/:gameid)
- View library (GET /api/library/user/:userid)

### UPDATE
- Edit user profile (PUT /api/users/:id)
- Update game status (PUT /api/library/:entryid)
- Change ratings (PUT /api/library/:entryid)
- Edit games via Admin Panel (PUT /api/games/:id)

### DELETE
- Remove from library (DELETE /api/library/:entryid)
- Delete reviews (DELETE /api/reviews/:reviewid)
- Delete games via Admin Panel (DELETE /api/games/:id)

## Authentication Details

For testing purposes:
- **Username:** akchaud5
- **Email:** akchaud5@asu.edu
- **Password:** password123
- **Role:** Admin

## Project Structure

```
vg-tracker/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── database.js        # PostgreSQL connection
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Profile.jsx
│   │   │   ├── Games.jsx
│   │   │   ├── Reviews.jsx
│   │   │   └── Admin.jsx
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # React entry point
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
└── database/
    ├── schema.sql         # Database schema
    ├── schema_fixed.sql   # Fixed database schema
    └── seed.sql           # Sample data
```

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Verify database credentials in `.env`
- Ensure port 3001 is not in use: `lsof -i :3001`

### Frontend won't connect to backend
- Verify backend is running on port 3001
- Check browser console for errors
- Ensure both servers are running

### Database connection errors
- Verify PostgreSQL service is running
- Check database exists: `psql -l`
- Run the schema_fixed.sql file if tables don't exist

