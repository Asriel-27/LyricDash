// ========== GLOBAL STATE ==========
// Taruh API_URL di bagian paling atas, di luar fungsi atau kurung apapun
const API_URL = 'https://lyricdash.up.railway.app';

let socket = null;
let currentUser = null;
let currentRoom = null;
let currentGame = null;
let songs = [];
let typingStats = {
  startTime: null,
  initialText: '',
  currentProgress: 0,
  totalChars: 0,
  correctChars: 0
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    currentUser = JSON.parse(localStorage.getItem('user'));
    showAppContainer();
    initializeApp();
  } else {
    showAuthContainer();
  }

  // Auth Form Listeners (Nama fungsi chat sudah diperbaiki)
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('register-form').addEventListener('submit', handleRegister);
  document.getElementById('chat-form').addEventListener('submit', sendChatMessage); 
});

// ========== AUTH FUNCTIONS ==========
function toggleAuthForm() {
  document.getElementById('login-form').classList.toggle('hidden');
  document.getElementById('register-form').classList.toggle('hidden');
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    // URL sudah ditambahkan API_URL
    const response = await fetch(API_URL + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Login failed');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    currentUser = data.user;

    showAppContainer();
    initializeApp();
  } catch (error) {
    console.error('Login error:', error);
    alert('Login error occurred');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const passwordConfirm = document.getElementById('register-password-confirm').value;

  if (password !== passwordConfirm) {
    alert('Passwords do not match');
    return;
  }

  try {
    // URL sudah ditambahkan API_URL
    const response = await fetch(API_URL + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Registration failed');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    currentUser = data.user;

    showAppContainer();
    initializeApp();
  } catch (error) {
    console.error('Register error:', error);
    alert('Registration error occurred');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (socket) {
    socket.disconnect();
  }
  showAuthContainer();
  location.reload();
}

// ========== UI FUNCTIONS ==========
function showAuthContainer() {
  document.getElementById('auth-container').classList.add('active');
  document.getElementById('app-container').classList.remove('active');
}

function showAppContainer() {
  document.getElementById('auth-container').classList.remove('active');
  document.getElementById('app-container').classList.add('active');
  document.getElementById('current-username').textContent = currentUser.username;
}

function switchView(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  
  // Show selected view
  document.getElementById(viewName + '-view').classList.add('active');

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

// ========== SOCKET.IO INITIALIZATION ==========
function initializeApp() {
  // Hanya buat koneksi jika socket masih null
  if (!socket) {
    socket = io(API_URL);
  }

  const token = localStorage.getItem('token');
  socket.emit('user:join', { token });

  // Socket Event Listeners
  socket.off('connect').on('connect', () => {
    console.log('Connected to server');
  });

  socket.off('users:list').on('users:list', handleUsersList);
  socket.off('user:status-change').on('user:status-change', handleUserStatusChange);
  socket.off('chat:message').on('chat:message', handleChatMessage);
  socket.off('game:player-joined').on('game:player-joined', handlePlayerJoined);
  socket.off('game:started').on('game:started', handleGameStarted);
  socket.off('game:progress-update').on('game:progress-update', handleProgressUpdate);
  socket.off('game:player-finished').on('game:player-finished', handlePlayerFinished);
  socket.off('game:leaderboard').on('game:leaderboard', handleLeaderboard);
  socket.off('game:player-left').on('game:player-left', handlePlayerLeft);
  socket.off('error').on('error', handleError);

  // Load songs
  loadSongs();
}

// ========== SOCKET HANDLERS ==========
function handleUsersList(users) {
  const usersList = document.getElementById('online-users');
  usersList.innerHTML = '';

  if (users.length === 0) {
    usersList.innerHTML = '<p class="empty-state">No users online</p>';
    return;
  }

  users.forEach(user => {
    const userEl = document.createElement('div');
    userEl.className = 'user-item';
    userEl.innerHTML = `
      <div class="user-status online"></div>
      <span>${user.username}</span>
    `;
    usersList.appendChild(userEl);
  });
}

function handleUserStatusChange(data) {
  // Just log for now, UI will update via users:list event
  console.log(`User ${data.username} is ${data.status}`);
}

function handleChatMessage(data) {
  const chatMessages = document.getElementById('chat-messages');
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message';
  messageEl.innerHTML = `
    <div class="username">${escapeHtml(data.username)}</div>
    <div class="message">${escapeHtml(data.message)}</div>
  `;
  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handlePlayerJoined(data) {
  const playersList = document.getElementById('game-players');
  playersList.innerHTML = '';

  // Gunakan data.allPlayers yang dikirim dari server
  if (data.allPlayers) {
    data.allPlayers.forEach(player => {
      const playerEl = document.createElement('div');
      playerEl.className = 'player-item';
      playerEl.innerHTML = `
        <div class="player-name">${escapeHtml(player.username)}</div>
        <div class="player-score">Ready</div>
      `;
      playersList.appendChild(playerEl);
    });
  }

  console.log(`${data.player.username} joined the game room`);
}

function handleGameStarted(data) {
  currentGame = data;
  
  // Update UI with song info
  document.getElementById('song-title').textContent = data.song.title;
  document.getElementById('song-artist').textContent = data.song.artist;
  document.getElementById('lyrics-text').textContent = data.song.lyrics;
  
  // Set audio
  const audio = document.getElementById('game-audio');
  audio.src = data.song.audio;
  
  // Show game area, hide waiting room
  document.getElementById('waiting-room').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');

  // Enable typing input and start tracking
  const typingInput = document.getElementById('typing-input');
  typingInput.disabled = false;
  typingInput.focus();

  typingStats.startTime = Date.now();
  typingStats.initialText = '';
  typingStats.totalChars = data.song.lyrics.length;

  // Start tracking typing progress
  typingInput.addEventListener('input', trackTypingProgress);

  // Play audio
  audio.play();
  
  console.log('Game started!');
}

function handleProgressUpdate(data) {
  updatePlayerProgress(data);
}

function handlePlayerFinished(data) {
  console.log(`${data.username} finished the game with WPM: ${data.wpm}`);
}

function handleLeaderboard(leaderboard) {
  const leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = '';

  leaderboard.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.rank}</td>
      <td>${escapeHtml(entry.username)}</td>
      <td>${entry.wpm.toFixed(2)}</td>
      <td>${entry.accuracy.toFixed(2)}%</td>
      <td>${entry.score}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}

function handlePlayerLeft(data) {
  console.log(`A player left. Total players: ${data.totalPlayers}`);
}

function handleError(data) {
  console.error('Socket error:', data.message);
  alert(data.message);
}

// ========== GAME FUNCTIONS ==========
async function loadSongs() {
  try {
    // URL sudah ditambahkan API_URL
    const response = await fetch(API_URL + '/api/songs');
    songs = await response.json();

    const songSelect = document.getElementById('song-select');
    songSelect.innerHTML = '';

    songs.forEach(song => {
      const option = document.createElement('option');
      option.value = song.id;
      option.textContent = `${song.title} - ${song.artist}`;
      songSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading songs:', error);
  }
}

function generateRoomId() {
  const roomId = 'room_' + Math.random().toString(36).substr(2, 9);
  document.getElementById('room-id').value = roomId;
}

function joinGameRoom() {
  let roomId = document.getElementById('room-id').value;

  if (!roomId) {
    alert('Please enter or generate a room ID');
    return;
  }

  currentRoom = {
    id: roomId,
    players: [{ userId: currentUser.id, username: currentUser.username }]
  };

  socket.emit('game:join-room', { roomId });

  // Switch to game view
  document.getElementById('game-view').classList.add('active');
  document.getElementById('lobby-view').classList.remove('active');
  document.getElementById('game-room-id').textContent = roomId;

  console.log(`Joined room: ${roomId}`);
}

function startGame() {
  const songId = document.getElementById('song-select').value;

  if (!songId) {
    alert('Please select a song');
    return;
  }

  if (!currentRoom) {
    alert('Please join a room first');
    return;
  }

  socket.emit('game:start', {
    roomId: currentRoom.id,
    songId: parseInt(songId)
  });
}

function leaveGameRoom() {
  if (currentRoom) {
    socket.emit('game:leave-room', { roomId: currentRoom.id });
    currentRoom = null;
  }

  // Reset game area
  document.getElementById('waiting-room').classList.remove('hidden');
  document.getElementById('game-area').classList.add('hidden');
  document.getElementById('leaderboard-area').classList.add('hidden');

  // Switch back to lobby
  document.getElementById('game-view').classList.remove('active');
  document.getElementById('lobby-view').classList.add('active');
}

function trackTypingProgress() {
  const typingInput = document.getElementById('typing-input');
  const lyrics = document.getElementById('lyrics-text').textContent;
  const currentText = typingInput.value;

  // Calculate progress
  const progress = Math.min((currentText.length / lyrics.length) * 100, 100);
  
  // Calculate WPM and Accuracy
  const elapsedSeconds = (Date.now() - typingStats.startTime) / 1000;
  const elapsedMinutes = elapsedSeconds / 60;
  const words = currentText.trim().split(/\s+/).length;
  const wpm = words > 0 && elapsedMinutes > 0 ? words / elapsedMinutes : 0;

  // Calculate accuracy
  let correctChars = 0;
  for (let i = 0; i < currentText.length; i++) {
    if (i < lyrics.length && currentText[i] === lyrics[i]) {
      correctChars++;
    }
  }
  const accuracy = currentText.length > 0 ? (correctChars / currentText.length) * 100 : 100;

  // Send progress to server
  if (currentRoom && currentGame) {
    socket.emit('game:typing-progress', {
      roomId: currentRoom.id,
      progress,
      wpm: wpm,
      accuracy: accuracy
    });
  }
}

function updatePlayerProgress(data) {
  const progressContainer = document.getElementById('progress-container');
  let playerProgressEl = document.getElementById(`progress-${data.userId}`);

  if (!playerProgressEl) {
    playerProgressEl = document.createElement('div');
    playerProgressEl.id = `progress-${data.userId}`;
    playerProgressEl.className = 'player-progress-item';
    progressContainer.appendChild(playerProgressEl);
  }

  playerProgressEl.innerHTML = `
    <div class="progress-header">
      <div class="player-name">${escapeHtml(data.username)}</div>
      <div class="player-stats">WPM: ${data.wpm.toFixed(2)} | Accuracy: ${data.accuracy.toFixed(2)}%</div>
    </div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" style="width: ${data.progress}%">
        ${Math.round(data.progress)}%
      </div>
    </div>
  `;
}

function finishGame() {
  const typingInput = document.getElementById('typing-input');
  const lyrics = document.getElementById('lyrics-text').textContent;
  const currentText = typingInput.value;

  // Calculate final stats
  const elapsedSeconds = (Date.now() - typingStats.startTime) / 1000;
  const elapsedMinutes = elapsedSeconds / 60;
  const words = currentText.trim().split(/\s+/).length;
  const finalWpm = words > 0 && elapsedMinutes > 0 ? words / elapsedMinutes : 0;

  let correctChars = 0;
  for (let i = 0; i < currentText.length; i++) {
    if (i < lyrics.length && currentText[i] === lyrics[i]) {
      correctChars++;
    }
  }
  const finalAccuracy = currentText.length > 0 ? (correctChars / currentText.length) * 100 : 100;

  // Send finish event
  if (currentRoom && currentGame) {
    socket.emit('game:finished', {
      roomId: currentRoom.id,
      finalWpm,
      finalAccuracy,
      timeSpent: elapsedSeconds
    });

    // Get and show leaderboard
    socket.emit('game:get-leaderboard', { roomId: currentRoom.id });
  }

  // Show leaderboard, hide game area
  document.getElementById('game-area').classList.add('hidden');
  document.getElementById('leaderboard-area').classList.remove('hidden');

  // Disable typing input
  typingInput.disabled = true;
  typingInput.removeEventListener('input', trackTypingProgress);
}

function backToWaitingRoom() {
  // Reset game area
  document.getElementById('leaderboard-area').classList.add('hidden');
  document.getElementById('waiting-room').classList.remove('hidden');

  // Reset form and input
  document.getElementById('typing-input').value = '';
  document.getElementById('typing-input').disabled = true;
  document.getElementById('game-audio').pause();
  document.getElementById('game-audio').currentTime = 0;

  // Reset progress display
  document.getElementById('progress-container').innerHTML = '';
}

// ========== CHAT FUNCTIONS ==========
// Nama fungsi sudah diubah agar tidak bertabrakan dengan fungsi yang di atas
function sendChatMessage(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const message = input.value.trim();

  if (!message) return;

  socket.emit('chat:message', { message });
  input.value = '';
}

// ========== UTILITY FUNCTIONS ==========
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}