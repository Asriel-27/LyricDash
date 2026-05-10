const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://lyricdash.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "https://lyricdash.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ========== DATA STORAGE (In-Memory) ==========
// Format: { userId: { id, username, password (hashed), createdAt } }
const users = {};

// Format: { userId: { userId, username, socket, status: 'online'/'offline' } }
const onlineUsers = {};

// Format: { roomId: { id, name, players: [], songs: [], currentGame: null } }
const gameRooms = {};

// Format untuk current game: { roomId, songIndex, startTime, players: { userId: { progress, wpm, accuracy } } }
const currentGames = {};

// Messages storage: { [timestamp]: { userId, username, message, timestamp } }
const chatMessages = [];

const JWT_SECRET = 'your-secret-key-change-this-in-production';

// ========== UTILITY FUNCTIONS ==========
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function loadSongs() {
  const songsPath = path.join(__dirname, 'songs.json');
  if (fs.existsSync(songsPath)) {
    return JSON.parse(fs.readFileSync(songsPath, 'utf-8'));
  }
  // Default songs jika file tidak ada
  return [
    {
      id: 1,
      title: "Sample Song 1",
      artist: "Demo Artist",
      audio: "/audio/sample1.mp3",
      lyrics: "Sample lyrics for testing the typing game application",
      duration: 120
    },
    {
      id: 2,
      title: "Sample Song 2",
      artist: "Demo Artist",
      audio: "/audio/sample2.mp3",
      lyrics: "Another set of sample lyrics for the multiplayer typing game",
      duration: 100
    }
  ];
}

// ========== REST API ENDPOINTS ==========

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password diperlukan' });
  }

  if (Object.values(users).some(u => u.username === username)) {
    return res.status(400).json({ error: 'Username sudah terdaftar' });
  }

  const userId = uuidv4();
  users[userId] = {
    id: userId,
    username,
    password: hashPassword(password),
    createdAt: new Date()
  };

  const token = generateToken(userId);
  res.status(201).json({
    success: true,
    token,
    user: {
      id: userId,
      username
    }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password diperlukan' });
  }

  const user = Object.values(users).find(u => u.username === username);

  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ error: 'Username atau password salah' });
  }

  const token = generateToken(user.id);
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username
    }
  });
});

// Get Songs
app.get('/api/songs', (req, res) => {
  const songs = loadSongs();
  res.json(songs);
});

// Get Song Lyrics
app.get('/api/songs/:songId/lyrics', (req, res) => {
  const songs = loadSongs();
  const song = songs.find(s => s.id == req.params.songId);

  if (!song) {
    return res.status(404).json({ error: 'Lagu tidak ditemukan' });
  }

  res.json({ lyrics: song.lyrics });
});

// ========== SOCKET.IO EVENT HANDLERS ==========

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User join (authenticate)
  socket.on('user:join', (data) => {
    const { token } = data;
    const decoded = verifyToken(token);

    if (!decoded) {
      socket.emit('error', { message: 'Token tidak valid' });
      return;
    }

    const userId = decoded.userId;
    const user = users[userId];

    socket.userId = userId;
    socket.username = user.username;

    onlineUsers[userId] = {
      userId,
      username: user.username,
      socketId: socket.id,
      status: 'online'
    };

    // Broadcast user online
    io.emit('user:status-change', {
      userId,
      username: user.username,
      status: 'online'
    });

    // Send online users list
    io.emit('users:list', Object.values(onlineUsers));

    console.log(`${user.username} joined the chat`);
  });

  // Chat message
  socket.on('chat:message', (data) => {
    if (!socket.userId) {
      socket.emit('error', { message: 'Anda harus login terlebih dahulu' });
      return;
    }

    const message = {
      userId: socket.userId,
      username: socket.username,
      message: data.message,
      timestamp: new Date()
    };

    chatMessages.push(message);

    // Limit chat history to last 100 messages
    if (chatMessages.length > 100) {
      chatMessages.shift();
    }

    // Broadcast message ke semua user
    io.emit('chat:message', message);
  });

  // Join game room
  socket.on('game:join-room', (data) => {
    if (!socket.userId) {
      socket.emit('error', { message: 'Anda harus login terlebih dahulu' });
      return;
    }

    const { roomId } = data;
    let room = gameRooms[roomId];

    if (!room) {
      room = gameRooms[roomId] = {
        id: roomId,
        name: `Game Room ${roomId.substring(0, 8)}`,
        players: [],
        songs: loadSongs(),
        currentGame: null
      };
    }

    const player = {
      userId: socket.userId,
      username: socket.username,
      score: 0,
      wpm: 0,
      accuracy: 0,
      progress: 0
    };

    room.players.push(player);
    socket.join(roomId);

    // Notify room members
    io.to(roomId).emit('game:player-joined', {
      roomId,
      player,
      allPlayers: room.players, // Wajib ada agar UI app.js bisa menggambar ulang daftar
      totalPlayers: room.players.length
    });

    console.log(`${socket.username} joined game room ${roomId}`);
  });

  // Start game
  socket.on('game:start', (data) => {
    if (!socket.userId) return;

    const { roomId, songId } = data;
    const room = gameRooms[roomId];

    if (!room) {
      socket.emit('error', { message: 'Room tidak ditemukan' });
      return;
    }

    const song = room.songs.find(s => s.id == songId);
    if (!song) {
      socket.emit('error', { message: 'Lagu tidak ditemukan' });
      return;
    }

    // Reset player progress
    room.players.forEach(p => {
      p.progress = 0;
      p.wpm = 0;
      p.accuracy = 100;
    });

    room.currentGame = {
      roomId,
      songId,
      song,
      startTime: Date.now(),
      players: {}
    };

    room.players.forEach(p => {
      room.currentGame.players[p.userId] = {
        progress: 0,
        wpm: 0,
        accuracy: 100
      };
    });

    // Broadcast game start
    io.to(roomId).emit('game:started', {
      roomId,
      song: {
        id: song.id,
        title: song.title,
        artist: song.artist,
        lyrics: song.lyrics,
        audio: song.audio,
        duration: song.duration
      }
    });

    console.log(`Game started in room ${roomId} with song "${song.title}"`);
  });

  // Player typing progress
  socket.on('game:typing-progress', (data) => {
    if (!socket.userId) return;

    const { roomId, progress, wpm, accuracy } = data;
    const room = gameRooms[roomId];

    if (!room || !room.currentGame) return;

    // Update player progress in game
    const gamePlayer = room.currentGame.players[socket.userId];
    if (gamePlayer) {
      gamePlayer.progress = progress;
      gamePlayer.wpm = wpm;
      gamePlayer.accuracy = accuracy;

      // Update room player
      const roomPlayer = room.players.find(p => p.userId === socket.userId);
      if (roomPlayer) {
        roomPlayer.progress = progress;
        roomPlayer.wpm = wpm;
        roomPlayer.accuracy = accuracy;
      }
    }

    // Broadcast progress update
    io.to(roomId).emit('game:progress-update', {
      userId: socket.userId,
      username: socket.username,
      progress,
      wpm,
      accuracy
    });
  });

  // Game finished
  socket.on('game:finished', (data) => {
    if (!socket.userId) return;

    const { roomId, finalWpm, finalAccuracy, timeSpent } = data;
    const room = gameRooms[roomId];

    if (!room) return;

    const player = room.players.find(p => p.userId === socket.userId);
    if (player) {
      player.wpm = finalWpm;
      player.accuracy = finalAccuracy;
      player.score = Math.round(finalWpm * (finalAccuracy / 100));
    }

    // Broadcast finish
    io.to(roomId).emit('game:player-finished', {
      userId: socket.userId,
      username: socket.username,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      score: player.score
    });
    
    const leaderboard = room.players
      .sort((a, b) => b.score - a.score)
      .map((p, index) => ({
        rank: index + 1,
        username: p.username,
        score: p.score,
        wpm: p.wpm,
        accuracy: p.accuracy
      }));

    io.to(roomId).emit('game:leaderboard', leaderboard);
  });

  // Get leaderboard
  socket.on('game:get-leaderboard', (data) => {
    const { roomId } = data;
    const room = gameRooms[roomId];

    if (!room) {
      socket.emit('error', { message: 'Room tidak ditemukan' });
      return;
    }

    const leaderboard = room.players
      .sort((a, b) => b.score - a.score)
      .map((p, index) => ({
        rank: index + 1,
        userId: p.userId,
        username: p.username,
        score: p.score,
        wpm: p.wpm,
        accuracy: p.accuracy
      }));

    socket.emit('game:leaderboard', leaderboard);
  });

  // Leave room
  socket.on('game:leave-room', (data) => {
    if (!socket.userId) return;

    const { roomId } = data;
    const room = gameRooms[roomId];

    if (room) {
      room.players = room.players.filter(p => p.userId !== socket.userId);

      io.to(roomId).emit('game:player-left', {
        userId: socket.userId,
        totalPlayers: room.players.length
      });

      socket.leave(roomId);

      // Delete room if empty
      if (room.players.length === 0) {
        delete gameRooms[roomId];
        console.log(`Game room ${roomId} deleted (empty)`);
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    if (socket.userId && onlineUsers[socket.userId]) {
      delete onlineUsers[socket.userId];

      io.emit('user:status-change', {
        userId: socket.userId,
        username: socket.username,
        status: 'offline'
      });

      io.emit('users:list', Object.values(onlineUsers));
    }

    console.log(`User disconnected: ${socket.id}`);
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});