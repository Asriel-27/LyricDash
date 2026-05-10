# LyricDash - Dokumentasi Teknis

## 📐 Arsitektur Sistem

### Backend Architecture

```
┌─────────────────────────────────────────┐
│         Express.js Server               │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │     REST API Layer               │  │
│  ├──────────────────────────────────┤  │
│  │ /api/auth/register               │  │
│  │ /api/auth/login                  │  │
│  │ /api/songs                       │  │
│  │ /api/songs/:id/lyrics            │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │     Socket.io Real-time Layer    │  │
│  ├──────────────────────────────────┤  │
│  │ user:join                        │  │
│  │ user:status-change               │  │
│  │ chat:message                     │  │
│  │ game:*                           │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │     Data Layer (In-Memory)       │  │
│  ├──────────────────────────────────┤  │
│  │ users (authentication)           │  │
│  │ onlineUsers (status)             │  │
│  │ gameRooms (game state)           │  │
│  │ chatMessages (history)           │  │
│  │ songs.json (songs database)      │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│      Browser Application                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │     UI Layer (HTML/CSS)          │  │
│  ├──────────────────────────────────┤  │
│  │ - Auth Container                 │  │
│  │ - Lobby View (Chat + Setup)      │  │
│  │ - Game View (Playing + Results)  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │     Logic Layer (JavaScript)     │  │
│  ├──────────────────────────────────┤  │
│  │ - Auth Management                │  │
│  │ - Game Logic                     │  │
│  │ - Typing Tracking                │  │
│  │ - Socket Event Handlers          │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │     Socket.io Client             │  │
│  ├──────────────────────────────────┤  │
│  │ Real-time communication          │  │
│  │ with server                      │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │     State Management             │  │
│  ├──────────────────────────────────┤  │
│  │ currentUser                      │  │
│  │ currentRoom                      │  │
│  │ currentGame                      │  │
│  │ typingStats                      │  │
│  │ localStorage (token)             │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## 🔄 Data Flow

### User Registration Flow
```
1. User fills registration form
2. Frontend sends POST /api/auth/register
3. Backend validates & hashes password
4. Backend creates user & generates JWT
5. Frontend stores token in localStorage
6. Redirect to app
7. Socket connects with token
```

### Chat Flow
```
1. User types and sends message
2. Frontend emits chat:message event
3. Backend broadcasts to all connected sockets
4. All clients receive chat:message event
5. UI updates with new message
6. Message stored in chatMessages array (max 100)
```

### Game Flow
```
1. User joins room via game:join-room
2. Players are added to room.players array
3. Game starts via game:start event
4. Song data sent to all players
5. Audio starts playing
6. Typing input enabled
7. Each keystroke emits game:typing-progress
8. Server updates player progress
9. Server broadcasts progress to room
10. All clients update progress display
11. Player finishes game:finished event
12. Leaderboard calculated and displayed
```

## 🔌 Socket Events Reference

### User Events

#### `user:join`
Client → Server
```javascript
{
  token: "JWT_TOKEN"
}
```

Response (broadcast): `user:status-change`, `users:list`

#### `user:status-change`
Server → All Clients
```javascript
{
  userId: "user-id",
  username: "username",
  status: "online" | "offline"
}
```

#### `users:list`
Server → All Clients
```javascript
[
  { userId, username, socketId, status: "online" },
  ...
]
```

### Chat Events

#### `chat:message`
Client → Server
```javascript
{
  message: "text content"
}
```

Server → All Clients
```javascript
{
  userId: "user-id",
  username: "username",
  message: "text content",
  timestamp: Date
}
```

### Game Events

#### `game:join-room`
Client → Server
```javascript
{
  roomId: "room_id"
}
```

Response: `game:player-joined`

#### `game:player-joined`
Server → Room
```javascript
{
  roomId: "room_id",
  player: {
    userId, username, score, wpm, accuracy, progress
  },
  totalPlayers: number
}
```

#### `game:start`
Client → Server
```javascript
{
  roomId: "room_id",
  songId: number
}
```

Response: `game:started`

#### `game:started`
Server → Room
```javascript
{
  roomId: "room_id",
  song: {
    id, title, artist, lyrics, audio, duration
  }
}
```

#### `game:typing-progress`
Client → Server
```javascript
{
  roomId: "room_id",
  progress: 0-100,
  wpm: number,
  accuracy: 0-100
}
```

Server broadcasts: `game:progress-update`

#### `game:progress-update`
Server → Room
```javascript
{
  userId: "user-id",
  username: "username",
  progress: 0-100,
  wpm: number,
  accuracy: 0-100
}
```

#### `game:finished`
Client → Server
```javascript
{
  roomId: "room_id",
  finalWpm: number,
  finalAccuracy: 0-100,
  timeSpent: seconds
}
```

#### `game:get-leaderboard`
Client → Server
```javascript
{
  roomId: "room_id"
}
```

Response: `game:leaderboard`

#### `game:leaderboard`
Server → Client
```javascript
[
  {
    rank: 1,
    userId: "user-id",
    username: "username",
    score: number,
    wpm: number,
    accuracy: 0-100
  },
  ...
]
```

#### `game:leave-room`
Client → Server
```javascript
{
  roomId: "room_id"
}
```

Response: `game:player-left`

## 🔐 Authentication Flow

### JWT Token
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId: "user-id", exp: expiry_time }
Secret: "your-secret-key-change-this-in-production"
```

### Token Storage
- Stored in `localStorage` with key `"token"`
- Sent with Socket.io connection via `user:join` event
- Verified server-side using `jwt.verify()`

## 📊 Scoring System

### WPM Calculation
```
WPM = (Number of Words Typed) / (Time in Minutes)
A word = 5 characters (standard)
```

### Accuracy Calculation
```
Accuracy = (Correct Characters / Total Characters Typed) × 100
```

### Final Score
```
Score = WPM × (Accuracy / 100)
```

## 🗄️ Data Structures

### User Object
```javascript
{
  id: "uuid",
  username: "string",
  password: "bcrypt_hash",
  createdAt: Date
}
```

### Online User Object
```javascript
{
  userId: "uuid",
  username: "string",
  socketId: "socket_id",
  status: "online"
}
```

### Game Room Object
```javascript
{
  id: "room_id",
  name: "string",
  players: [
    {
      userId: "uuid",
      username: "string",
      score: number,
      wpm: number,
      accuracy: number,
      progress: 0-100
    }
  ],
  songs: [/* song objects */],
  currentGame: {
    roomId: "room_id",
    songId: number,
    song: { /* full song object */ },
    startTime: timestamp,
    players: {
      [userId]: {
        progress: 0-100,
        wpm: number,
        accuracy: 0-100
      }
    }
  }
}
```

### Song Object
```javascript
{
  id: number,
  title: "string",
  artist: "string",
  audio: "/path/to/audio.mp3",
  lyrics: "string",
  duration: seconds
}
```

### Chat Message Object
```javascript
{
  userId: "uuid",
  username: "string",
  message: "string",
  timestamp: Date
}
```

## 🚀 Performance Considerations

1. **Message History Limit**: Chat messages capped at 100 to prevent memory overflow
2. **Socket Broadcasting**: Only broadcast to relevant rooms/users
3. **Progress Updates**: Throttled via socket emission rate
4. **In-Memory Storage**: Suitable for demo; use database for production

## 🔒 Security Notes

### Current Implementation (Development)
- Passwords hashed with bcryptjs (10 rounds)
- JWT token-based auth
- CORS enabled

### For Production
- Use environment variables for secrets
- Implement database persistence
- Add rate limiting
- Enable HTTPS
- Implement refresh tokens
- Add input validation & sanitization
- Use helmet.js for security headers
- Implement CSRF protection
- Add logging & monitoring

## 📱 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with Socket.io support

## 🎯 Future Enhancements

1. Database integration (PostgreSQL/MongoDB)
2. User profiles & statistics
3. Achievements/Badges system
4. Difficulty levels
5. Custom songs upload
6. Social features (friends, challenges)
7. Mobile app (React Native)
8. Advanced analytics
9. Payment system (premium features)
10. API documentation (Swagger)

---

**Last Updated**: 2024
**Version**: 1.0.0
