# 📁 Project Structure Documentation

## Overview

```
LyricDash/
├── backend/                      # Server-side application
├── frontend/                     # Client-side application
├── .gitattributes               # Git configuration
├── .gitignore                   # Git ignore rules
├── package.json                 # Root package.json
├── README.md                    # Main documentation
├── QUICKSTART.md               # Quick start guide
├── TECHNICAL.md                # Technical documentation
├── API_TESTING.md              # API testing guide
├── DEPLOYMENT.md               # Deployment guide
└── PROJECT_STRUCTURE.md        # This file
```

## Detailed Structure

### 📂 Root Directory Files

#### `package.json`
Root package configuration. Tidak perlu install dependencies di root, hanya di backend.

**Fungsi**: 
- Meta information tentang project
- Scripts untuk menjalankan aplikasi
- Node/npm version requirements

#### `.gitignore`
Daftar files/folders yang tidak di-commit ke Git:
- `node_modules/` - npm dependencies
- `.env` - environment variables
- `logs/` - application logs
- `dist/` - build output

#### `README.md`
Dokumentasi utama project:
- Deskripsi aplikasi
- Fitur utama
- Cara instalasi
- Cara menjalankan
- Troubleshooting

#### `QUICKSTART.md`
Guide cepat setup (5 menit):
- Step-by-step installation
- Cara bermain game
- Test accounts
- Tips & tricks

#### `TECHNICAL.md`
Dokumentasi teknis mendalam:
- Arsitektur sistem
- Data flow
- Socket events reference
- Scoring system
- Security notes

#### `API_TESTING.md`
Guide untuk test API:
- REST endpoints
- cURL examples
- Socket.io testing
- Postman collection
- Performance testing

#### `DEPLOYMENT.md`
Guide untuk deploy ke production:
- Heroku deployment
- Railway deployment
- DigitalOcean VPS
- Security considerations
- CI/CD setup

---

### 📂 Backend Directory

```
backend/
├── server.js                    # Main server file
├── package.json                # Backend dependencies
├── songs.json                  # Song database
├── .env.example               # Environment variables template
├── lyrics/                    # Folder untuk lyric files
└── audio/                     # Folder untuk audio files
```

#### `server.js` (Main Application)
**Size**: ~400 lines
**Tanggung jawab**:
- Express server setup
- Socket.io configuration
- REST API endpoints:
  - `/api/auth/register` - User registration
  - `/api/auth/login` - User login
  - `/api/songs` - Get all songs
  - `/api/songs/:id/lyrics` - Get song lyrics
- Socket event handlers:
  - User authentication & status
  - Chat messaging
  - Game room management
  - Game logic & scoring

**Key Functions**:
- `hashPassword()` - Password hashing dengan bcryptjs
- `verifyPassword()` - Verify hashed password
- `generateToken()` - Generate JWT token
- `verifyToken()` - Verify JWT token
- `loadSongs()` - Load songs dari JSON

**In-Memory Data Structures**:
- `users` - Registered users
- `onlineUsers` - Currently connected users
- `gameRooms` - Active game rooms
- `chatMessages` - Chat history
- `currentGames` - Ongoing games

#### `package.json`
Backend dependencies:
- **express** - Web framework
- **socket.io** - Real-time communication
- **cors** - Cross-origin requests
- **uuid** - Generate unique IDs
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **nodemon** (dev) - Auto-restart on file changes

#### `songs.json`
Database lagu dalam format JSON.

**Structure**:
```json
[
  {
    "id": 1,
    "title": "Song Title",
    "artist": "Artist Name",
    "audio": "/audio/file.mp3",
    "lyrics": "Full lyrics text...",
    "duration": 120
  }
]
```

**Default Songs**: 3 songs untuk testing

**Cara Menambah**: Edit file dan add entry baru

#### `.env.example`
Template untuk environment variables:
- PORT - Server port (default: 3000)
- NODE_ENV - development/production
- JWT_SECRET - Secret key untuk JWT
- Database credentials (untuk implementasi future)

#### `lyrics/` Directory
Folder untuk menyimpan lyrics files (.txt/.json).

**Tidak digunakan saat ini** - lyrics di-embed di songs.json

#### `audio/` Directory
Folder untuk audio files (.mp3/.wav).

**Current**: Kosong (untuk file audio custom)
**Default**: Audio path di songs.json bisa external

---

### 📂 Frontend Directory

```
frontend/
├── index.html                  # Main HTML file
├── style.css                  # Styling
└── app.js                     # Application logic
```

#### `index.html` (~200 lines)
Markup aplikasi web.

**Sections**:
1. **Auth Container** - Login/Register forms
2. **App Container** - Main application
   - **Header** - App title & user info
   - **Sidebar** - Online users & navigation
   - **Lobby View** - Chat & game setup
   - **Game View** - Game playing & leaderboard

**Forms**:
- Login form
- Register form
- Chat message form
- Game setup form

**Containers**:
- Waiting room
- Game area (lyrics + typing input + progress)
- Leaderboard

#### `style.css` (~600 lines)
Styling aplikasi.

**Features**:
- Dark theme (modern look)
- CSS variables untuk easy customization
- Responsive design (desktop & mobile)
- Animations & transitions
- Custom scrollbars

**Color Scheme**:
- Primary: Indigo (#6366f1)
- Secondary: Pink (#ec4899)
- Success: Green (#10b981)
- Danger: Red (#ef4444)

**Sections**:
1. Auth page styling
2. App container & header
3. Sidebar styling
4. Chat section
5. Game view styling
6. Leaderboard table
7. Button styles
8. Responsive breakpoints

#### `app.js` (~600 lines)
JavaScript logic frontend.

**Global Variables**:
- `socket` - Socket.io instance
- `currentUser` - Logged-in user
- `currentRoom` - Game room
- `currentGame` - Active game
- `typingStats` - Typing progress tracking
- `songs` - Available songs

**Functions**:
1. **Auth Functions** (~50 lines)
   - `toggleAuthForm()` - Switch between login/register
   - `handleLogin()` - Process login
   - `handleRegister()` - Process registration
   - `logout()` - Clear session

2. **UI Functions** (~30 lines)
   - `showAuthContainer()` - Show login page
   - `showAppContainer()` - Show main app
   - `switchView()` - Switch between lobby/game

3. **Socket Initialization** (~20 lines)
   - `initializeApp()` - Setup socket & listeners
   - Event handler subscriptions

4. **Socket Handlers** (~150 lines)
   - `handleUsersList()` - Update online users
   - `handleChatMessage()` - Receive chat
   - `handlePlayerJoined()` - Player join game
   - `handleGameStarted()` - Game start
   - `handleProgressUpdate()` - Progress tracking
   - `handleLeaderboard()` - Show results

5. **Game Functions** (~200 lines)
   - `loadSongs()` - Fetch songs from API
   - `generateRoomId()` - Create room ID
   - `joinGameRoom()` - Join game
   - `startGame()` - Start game
   - `leaveGameRoom()` - Leave game
   - `trackTypingProgress()` - Monitor typing
   - `updatePlayerProgress()` - Update UI progress
   - `finishGame()` - End game & show results
   - `backToWaitingRoom()` - Reset for next game

6. **Chat Functions** (~10 lines)
   - `handleChatMessage()` - Send chat message (form)

7. **Utility Functions** (~10 lines)
   - `escapeHtml()` - HTML escape untuk security

---

## 🔄 Data Flow

### Registration Flow
```
User Input → handleRegister() → POST /api/auth/register 
→ Backend validation → User creation → JWT generation 
→ localStorage → showAppContainer()
```

### Chat Flow
```
User types message → Form submit → socket.emit('chat:message')
→ Backend broadcast → socket.on('chat:message') 
→ handleChatMessage() → DOM update
```

### Game Flow
```
Join room → game:join-room → Player added to room
→ Start game → game:start → Backend creates currentGame
→ Frontend receives game:started → Show game UI
→ User types → game:typing-progress → Progress broadcast
→ All players see progress update → game:progress-update handler
→ User finishes → game:finished → Leaderboard request
→ game:leaderboard received → Display results
```

---

## 📊 File Size Summary

| File | Size | Purpose |
|------|------|---------|
| server.js | ~400 lines | Backend logic |
| index.html | ~200 lines | Frontend markup |
| style.css | ~600 lines | Frontend styling |
| app.js | ~600 lines | Frontend logic |
| songs.json | ~30 lines | Song database |

**Total: ~1,830 lines of code** (Production-ready)

---

## 🔐 Security Files

- `JWT_SECRET` in server.js - Autentikasi
- `bcryptjs` in server.js - Password hashing
- `CORS` configuration - Cross-origin security
- `.gitignore` - Prevent committing secrets

---

## 🚀 Deployment Considerations

### Backend Files Needed
- server.js
- package.json
- songs.json
- .env (production)

### Frontend Files Needed
- index.html
- style.css
- app.js

### Not Needed in Production
- .gitignore
- node_modules/ (install via npm install)
- Development docs

---

## 🔧 How to Extend

### Add New Feature

1. **Backend REST Endpoint**:
   - Add route di server.js
   - Update REST endpoint documentation

2. **Backend Socket Event**:
   - Add socket.on() handler
   - Update TECHNICAL.md

3. **Frontend HTML**:
   - Add elements di index.html

4. **Frontend Styling**:
   - Add CSS rules di style.css

5. **Frontend Logic**:
   - Add functions di app.js
   - Add socket listeners

### Add New Song

1. Edit `backend/songs.json`
2. Add audio file di `backend/audio/`
3. Restart server

### Add Database

1. Install: `npm install pg` (PostgreSQL)
2. Replace in-memory storage dengan database queries
3. Update API endpoints
4. Setup connection pooling

---

## 📚 Documentation Files Relationship

```
README.md (START HERE)
├── QUICKSTART.md (5 min setup)
├── TECHNICAL.md (Deep dive)
├── API_TESTING.md (How to test)
├── DEPLOYMENT.md (How to deploy)
└── PROJECT_STRUCTURE.md (This file)
```

---

Selamat! Anda sekarang understand complete project structure! 🎉
