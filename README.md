# 🎵 LyricDash

**LyricDash** adalah aplikasi game typing multiplayer real-time yang menggabungkan elemen game, chatroom, dan kompetisi typing berdasarkan lirik lagu. Pemain dapat berkompetisi dengan pemain lain secara real-time sambil bersenang-senang dengan musik favorit mereka.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Struktur Folder](#struktur-folder)
- [Cara Menjalankan](#cara-menjalankan)
- [Konfigurasi](#konfigurasi)
- [API & Socket Events](#api--socket-events)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## ✨ Fitur Utama

- 🎮 **Game Typing Multiplayer**: Berkompetisi dengan pemain lain secara real-time
- 💬 **Real-time Chatroom**: Komunikasi langsung dengan pemain lain
- 🎵 **Lirik Lagu**: Game berdasarkan lirik lagu dari berbagai artis
- 👤 **Sistem Autentikasi**: Login dan registrasi dengan enkripsi password
- 🔐 **JWT Token**: Keamanan session berbasis token
- 📊 **Statistik Game**: Tracking WPM (Words Per Minute), accuracy, dan progress
- 🌐 **Cross-Platform**: Kompatibel dengan berbagai browser modern

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time Communication**: Socket.IO
- **Database**: In-memory (JSON file storage)
- **Authentication**: JWT (JSON Web Token) + Bcryptjs
- **CORS**: Cross-Origin Resource Sharing

### Frontend
- **HTML5**: Markup
- **CSS3**: Styling
- **JavaScript (Vanilla)**: Logic dan interaksi
- **Socket.IO Client**: Real-time communication

### DevOps
- **Docker**: Container support (Dockerfile tersedia)
- **Package Manager**: npm

## 📦 Prasyarat

Sebelum memulai, pastikan Anda sudah menginstall:

1. **Node.js** (versi 14.0.0 atau lebih tinggi)
   - Download dari: https://nodejs.org/
   - Verifikasi: `node --version` dan `npm --version`

2. **npm** (biasanya sudah termasuk dengan Node.js)
   - Verifikasi: `npm --version`

3. **Git** (opsional, untuk cloning repository)
   - Download dari: https://git-scm.com/

## 🚀 Instalasi

### 1. Clone atau Download Repository

```bash
# Menggunakan Git
git clone https://github.com/yourusername/LyricDash.git
cd LyricDash

# Atau download manual dan extract ke folder
```

### 2. Setup Otomatis (Windows)

Jika Anda menggunakan Windows, jalankan script setup:

```bash
# Buka Command Prompt atau PowerShell
# Navigate ke folder LyricDash
cd d:\LyricDash\LyricDash

# Jalankan setup script
setup.bat
```

Script ini akan:
- ✅ Mengecek instalasi Node.js dan npm
- ✅ Install semua dependencies
- ✅ Membuat file konfigurasi
- ✅ Siap untuk development

### 3. Setup Manual (Untuk Semua Platform)

Jika Anda lebih suka setup manual atau menggunakan Linux/Mac:

```bash
# Navigate ke folder project
cd LyricDash

# Install dependencies di backend
cd backend
npm install

# Kembali ke root folder
cd ..

# Atau gunakan command dari root
npm run install-all
```

## 📁 Struktur Folder

```
LyricDash/
├── backend/                    # Backend Node.js + Express
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── Dockerfile             # Docker configuration
│   ├── songs.json             # Database lirik lagu
│   ├── users.json             # Database pengguna (auto-generated)
│   └── lyrics/                # Folder penyimpanan lirik
│
├── frontend/                   # Frontend static files
│   ├── index.html             # Main HTML file
│   ├── app.js                 # Main application logic
│   ├── style.css              # Styling
│   └── audio/                 # Folder penyimpanan audio/musik
│
├── package.json               # Root package configuration
├── setup.bat                  # Setup script untuk Windows
├── setup.sh                   # Setup script untuk Linux/Mac
└── README.md                  # File dokumentasi ini
```

## ▶️ Cara Menjalankan

### Development Mode (dengan Auto-reload)

```bash
# Dari folder root
npm run dev

# Atau manual dari backend
cd backend
npm run dev
```

Server akan berjalan di: `http://localhost:3000`
Frontend dapat diakses di: `http://localhost:3000`

### Production Mode

```bash
# Dari folder root
npm start

# Atau manual dari backend
cd backend
npm start
```

### Menggunakan Docker

```bash
# Build image
docker build -t lyricdash ./backend

# Run container
docker run -p 3000:3000 lyricdash
```

## ⚙️ Konfigurasi

### Konfigurasi Server (backend/server.js)

Beberapa konfigurasi utama yang dapat dimodifikasi:

```javascript
// CORS Configuration
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://lyricdash.vercel.app",
      "http://127.0.0.1:5500",
      "http://localhost:5500"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Server Port (default 3000)
const PORT = process.env.PORT || 3000;
```

### Environment Variables (Opsional)

Buat file `.env` di folder backend jika diperlukan:

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
```

## 🔌 API & Socket Events

### REST API Endpoints

#### User Authentication
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/logout` - Logout pengguna

#### Game & Rooms
- `GET /api/games` - Get semua game rooms
- `POST /api/games` - Create game room baru
- `GET /api/songs` - Get semua lagu

#### User Profile
- `GET /api/users/:userId` - Get profile pengguna
- `PUT /api/users/:userId` - Update profile pengguna

### Socket.IO Events

#### Connection
```javascript
socket.on('connect') // User terhubung
socket.on('disconnect') // User terputus
```

#### Game Events
```javascript
socket.emit('join-room', { roomId, userId })
socket.emit('start-game', { roomId })
socket.emit('update-progress', { userId, progress, wpm, accuracy })
socket.emit('end-game', { roomId, results })
```

#### Chat Events
```javascript
socket.emit('send-message', { roomId, message, userId })
socket.on('receive-message', { userId, message, timestamp })
```

## 📝 Development Tips

### Debugging
- Buka DevTools browser (`F12`) untuk melihat console logs
- Gunakan Chrome DevTools untuk inspect Network tab
- Check server logs di terminal untuk melihat error

### Hot Reload
- Backend menggunakan `nodemon` - otomatis restart saat file berubah
- Frontend adalah static files - refresh browser untuk melihat perubahan

### Adding New Songs
1. Edit file `backend/songs.json`
2. Tambahkan object lagu baru dengan format:
```json
{
  "id": "song-id",
  "title": "Song Title",
  "artist": "Artist Name",
  "lyrics": "Lirik lagu...",
  "difficulty": "easy|medium|hard"
}
```

## 🤝 Kontribusi

Kami sangat menerima kontribusi! Untuk berkontribusi:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini dilisensikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk detail lengkap.

## 📧 Kontak & Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/LyricDash/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/LyricDash/discussions)

---

**Dibuat dengan ❤️ oleh Senior Fullstack JavaScript Developer**

Happy Typing! 🎵✨
