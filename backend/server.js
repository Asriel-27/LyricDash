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

// ========== PERSISTENT DATA STORAGE ==========
const usersFilePath = path.join(__dirname, 'users.json');

// Fungsi untuk memuat user dari file
function loadUsersFromFile() {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Gagal membaca users.json:", error);
  }
  return {}; 
}

// Fungsi untuk menyimpan user ke file
function saveUsersToFile(usersData) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
  } catch (error) {
    console.error("Gagal menyimpan ke users.json:", error);
  }
}

// Inisialisasi data user dari file
let users = loadUsersFromFile();

// Data RAM tetap (akan reset jika server restart)
const onlineUsers = {};
const gameRooms = {};
const currentGames = {};
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
  return [];
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

  // Simpan ke file permanen
  saveUsersToFile(users);

  const token = generateToken(userId);
  res.status(201).json({
    success: true,
    token,
    user: { id: userId, username }
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
    user: { id: user.id, username: user.username }
  });
});

app.get('/api/songs', (req, res) => {
  const songs = loadSongs();
  res.json(songs);
});

app.get('/api/songs/:songId/lyrics', (req, res) => {
  const songs = loadSongs();
  const song = songs.find(s => s.id == req.params.songId);
  if (!song) return res.status(404).json({ error: 'Lagu tidak ditemukan' });
  res.json({ lyrics: song.lyrics });
});

// ========== SOCKET.IO EVENT HANDLERS ==========

io.on('connection', (socket) => {
  socket.on('user:join', (data) => {
    const { token } = data;
    const decoded = verifyToken(token);
    if (!decoded) return;

    const userId = decoded.userId;
    const user = users[userId];
    if (!user) return;

    socket.userId = userId;
    socket.username = user.username;

    onlineUsers[userId] = {
      userId,
      username: user.username,
      socketId: socket.id,
      status: 'online'
    };

    io.emit('user:status-change', { userId, username: user.username, status: 'online' });
    io.emit('users:list', Object.values(onlineUsers));
  });

  socket.on('chat:message', (data) => {
    if (!socket.userId) return;
    const message = {
      userId: socket.userId,
      username: socket.username,
      message: data.message,
      timestamp: new Date()
    };
    chatMessages.push(message);
    if (chatMessages.length > 100) chatMessages.shift();
    io.emit('chat:message', message);
  });

  socket.on('game:join-room', (data) => {
    if (!socket.userId) return;
    const { roomId } = data;
    let room = gameRooms[roomId];
    if (!room) {
      room = gameRooms[roomId] = {
        id: roomId,
        name: `Room ${roomId.substring(0, 5)}`,
        players: [],
        songs: loadSongs(),
        currentGame: null
      };
    }
    const player = { userId: socket.userId, username: socket.username, score: 0, wpm: 0, accuracy: 0, progress: 0 };
    room.players.push(player);
    socket.join(roomId);
    io.to(roomId).emit('game:player-joined', { roomId, player, totalPlayers: room.players.length });
  });

  socket.on('game:start', (data) => {
    const { roomId, songId } = data;
    const room = gameRooms[roomId];
    if (!room) return;
    const song = room.songs.find(s => s.id == songId);
    if (!song) return;

    room.players.forEach(p => { p.progress = 0; p.wpm = 0; p.accuracy = 100; });
    room.currentGame = { roomId, songId, song, startTime: Date.now(), players: {} };
    room.players.forEach(p => { room.currentGame.players[p.userId] = { progress: 0, wpm: 0, accuracy: 100 }; });

    io.to(roomId).emit('game:started', {
      roomId,
      song: { id: song.id, title: song.title, artist: song.artist, lyrics: song.lyrics, audio: song.audio, duration: song.duration }
    });
  });

  socket.on('game:typing-progress', (data) => {
    if (!socket.userId) return;
    const { roomId, progress, wpm, accuracy } = data;
    const room = gameRooms[roomId];
    if (!room || !room.currentGame) return;

    const gamePlayer = room.currentGame.players[socket.userId];
    if (gamePlayer) {
      gamePlayer.progress = progress;
      gamePlayer.wpm = wpm;
      gamePlayer.accuracy = accuracy;
      const roomPlayer = room.players.find(p => p.userId === socket.userId);
      if (roomPlayer) { roomPlayer.progress = progress; roomPlayer.wpm = wpm; roomPlayer.accuracy = accuracy; }
    }
    io.to(roomId).emit('game:progress-update', { userId: socket.userId, username: socket.username, progress, wpm, accuracy });
  });

  socket.on('game:finished', (data) => {
    if (!socket.userId) return;
    const { roomId, finalWpm, finalAccuracy } = data;
    const room = gameRooms[roomId];
    if (!room) return;
    const player = room.players.find(p => p.userId === socket.userId);
    if (player) {
      player.wpm = finalWpm;
      player.accuracy = finalAccuracy;
      player.score = Math.round(finalWpm * (finalAccuracy / 100));
    }
    io.to(roomId).emit('game:player-finished', { userId: socket.userId, username: socket.username, wpm: finalWpm, accuracy: finalAccuracy, score: player ? player.score : 0 });
  });

  socket.on('disconnect', () => {
    if (socket.userId && onlineUsers[socket.userId]) {
      delete onlineUsers[socket.userId];
      io.emit('user:status-change', { userId: socket.userId, username: socket.username, status: 'offline' });
      io.emit('users:list', Object.values(onlineUsers));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});