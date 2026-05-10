# API Testing Guide

Gunakan guide ini untuk test API endpoints menggunakan tools seperti Postman, cURL, atau REST Client di VS Code.

## Authentication API

### 1. Register User

**Endpoint**: `POST /api/auth/register`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "testuser"
  }
}
```

**Error Response** (400):
```json
{
  "error": "Username sudah terdaftar"
}
```

---

### 2. Login User

**Endpoint**: `POST /api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "testuser"
  }
}
```

**Error Response** (401):
```json
{
  "error": "Username atau password salah"
}
```

---

## Songs API

### 3. Get All Songs

**Endpoint**: `GET /api/songs`

**Headers**: None required

**Response** (200):
```json
[
  {
    "id": 1,
    "title": "Flower Flow",
    "artist": "Dua Lipa",
    "audio": "/audio/sample1.mp3",
    "lyrics": "Flowers in bloom beneath the sun...",
    "duration": 120
  },
  {
    "id": 2,
    "title": "Digital Hearts",
    "artist": "The Synthetics",
    "audio": "/audio/sample2.mp3",
    "lyrics": "In the glow of pixel light...",
    "duration": 100
  }
]
```

---

### 4. Get Song Lyrics

**Endpoint**: `GET /api/songs/:songId/lyrics`

**Example**: `GET /api/songs/1/lyrics`

**Response** (200):
```json
{
  "lyrics": "Flowers in bloom beneath the sun, dancing with the morning light..."
}
```

**Error Response** (404):
```json
{
  "error": "Lagu tidak ditemukan"
}
```

---

## cURL Examples

### Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Get Songs:
```bash
curl http://localhost:3000/api/songs
```

### Get Song Lyrics:
```bash
curl http://localhost:3000/api/songs/1/lyrics
```

---

## Socket.io Testing

Untuk test Socket.io events, gunakan Socket.io client atau Web Browser Console.

### Test dengan Browser Console

1. Buka aplikasi di `http://localhost:3000`
2. Buka DevTools (F12)
3. Buka Console tab
4. Test events:

```javascript
// Join dengan token
socket.emit('user:join', { token: 'YOUR_JWT_TOKEN' });

// Kirim chat message
socket.emit('chat:message', { message: 'Hello World!' });

// Join game room
socket.emit('game:join-room', { roomId: 'room_123' });

// Start game
socket.emit('game:start', { roomId: 'room_123', songId: 1 });

// Update typing progress
socket.emit('game:typing-progress', {
  roomId: 'room_123',
  progress: 50,
  wpm: 60,
  accuracy: 95
});

// Finish game
socket.emit('game:finished', {
  roomId: 'room_123',
  finalWpm: 65,
  finalAccuracy: 96,
  timeSpent: 120
});

// Get leaderboard
socket.emit('game:get-leaderboard', { roomId: 'room_123' });

// Leave room
socket.emit('game:leave-room', { roomId: 'room_123' });
```

### Listen to Socket Events

```javascript
// Listen to user list
socket.on('users:list', (users) => {
  console.log('Online users:', users);
});

// Listen to chat message
socket.on('chat:message', (message) => {
  console.log('New message:', message);
});

// Listen to player joined
socket.on('game:player-joined', (data) => {
  console.log('Player joined:', data);
});

// Listen to game started
socket.on('game:started', (data) => {
  console.log('Game started:', data);
});

// Listen to progress update
socket.on('game:progress-update', (data) => {
  console.log('Progress update:', data);
});

// Listen to leaderboard
socket.on('game:leaderboard', (leaderboard) => {
  console.log('Leaderboard:', leaderboard);
});
```

---

## VS Code REST Client Extension

Gunakan extension "REST Client" untuk test API dengan mudah.

File `test.http`:

```http
### Variables
@baseUrl = http://localhost:3000
@token = YOUR_JWT_TOKEN_HERE

### Register New User
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}

### Login User
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}

### Get All Songs
GET {{baseUrl}}/api/songs

### Get Song 1 Lyrics
GET {{baseUrl}}/api/songs/1/lyrics

### Get Song 2 Lyrics
GET {{baseUrl}}/api/songs/2/lyrics

### Get Song 3 Lyrics
GET {{baseUrl}}/api/songs/3/lyrics
```

Install REST Client extension:
1. Buka Extensions di VS Code (Ctrl+Shift+X)
2. Search "REST Client"
3. Install by Huachao Mao
4. Buat file `test.http`
5. Click "Send Request" untuk tiap request

---

## Postman Collection

Anda bisa import collection ini ke Postman:

```json
{
  "info": {
    "name": "LyricDash API",
    "description": "API Testing untuk LyricDash"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/api/auth/register",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"testuser\",\"password\":\"password123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/api/auth/login",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"testuser\",\"password\":\"password123\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Songs",
      "item": [
        {
          "name": "Get All Songs",
          "request": {
            "method": "GET",
            "url": "http://localhost:3000/api/songs"
          }
        },
        {
          "name": "Get Song 1 Lyrics",
          "request": {
            "method": "GET",
            "url": "http://localhost:3000/api/songs/1/lyrics"
          }
        }
      ]
    }
  ]
}
```

---

## Test Scenarios

### Scenario 1: Simple Chat Test
1. Register 2 users di 2 browser tabs
2. Both login
3. One user send chat message
4. Verify message appears di both tabs real-time

### Scenario 2: Single Player Game
1. Login 1 user
2. Generate room ID
3. Join game room
4. Start game with a song
5. Type some lyrics
6. Finish game
7. Check leaderboard (should show 1 player)

### Scenario 3: Multiplayer Game
1. Open 2 browser tabs
2. Register & login 2 users
3. Tab 1: Create room and join
4. Tab 2: Join same room with same room ID
5. Both players in same room
6. Tab 1: Start game
7. Both: Start typing
8. Monitor progress updates real-time
9. Both: Finish game
10. Check leaderboard (should show 2 players ranked)

### Scenario 4: User Status
1. Register 2 users
2. Tab 1: Login user1
3. Verify user1 appears in "Online Players"
4. Tab 2: Login user2
5. Verify both users online di both tabs
6. Close tab 1 (or logout)
7. Verify user1 disappears from "Online Players" di tab 2

---

## Performance Testing

### Simple Load Test (cURL)
```bash
#!/bin/bash
# test-load.sh

for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"testuser\",\"password\":\"password123\"}" &
done
wait
echo "Completed 10 requests"
```

Run:
```bash
bash test-load.sh
```

---

Selamat testing! 🧪
