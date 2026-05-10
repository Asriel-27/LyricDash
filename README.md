# LyricDash - Multiplayer Typing Game & Real-time Chatroom

Selamat datang di **LyricDash**! Aplikasi web interaktif yang menggabungkan permainan mengetik multipemain dengan chatroom real-time.

## 📋 Deskripsi Aplikasi

LyricDash adalah aplikasi web full-stack yang memungkinkan pengguna untuk:

1. **Registrasi dan Login** - Sistem autentikasi sederhana untuk setiap pengguna
2. **Real-time Chatroom** - Berkomunikasi dengan pengguna lain secara instant
3. **Multiplayer Typing Game** - Berlomba mengetik lirik lagu dengan pemain lain
4. **Leaderboard & Scoring** - Sistem poin berdasarkan kecepatan (WPM) dan akurasi
5. **Audio Integration** - Dengarkan lagu sambil bermain

### Fitur Utama

- ✅ Autentikasi pengguna (Register/Login)
- ✅ Chat room real-time dengan Socket.io
- ✅ Multiplayer typing game dengan progress tracking
- ✅ Audio playback terintegrasi
- ✅ Leaderboard dinamis
- ✅ Tracking WPM (Words Per Minute) dan Akurasi
- ✅ User status (Online/Offline)
- ✅ Game rooms dengan beberapa pemain

## 🏗️ Struktur Proyek

```
LyricDash/
├── backend/                    # Server-side (Node.js, Express, Socket.io)
│   ├── server.js              # File utama server
│   ├── package.json           # Dependencies Node.js
│   ├── songs.json             # Database lagu (format JSON)
│   ├── lyrics/                # Folder untuk file lirik
│   └── audio/                 # Folder untuk file audio
├── frontend/                   # Client-side (HTML, CSS, JavaScript)
│   ├── index.html             # Halaman utama
│   ├── style.css              # Styling aplikasi
│   └── app.js                 # Logika frontend
├── .gitignore                 # Git ignore rules
└── README.md                  # Dokumentasi proyek
```

## 🛠️ Stack Teknologi

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (Dark theme)
- **JavaScript (Vanilla)** - Interactivity
- **Socket.io Client** - Real-time updates

## 📦 Persyaratan Instalasi

Pastikan Anda telah menginstall:
- **Node.js** (v14 atau lebih tinggi) - Download di https://nodejs.org/
- **npm** (bundled dengan Node.js)
- **Git** - Download di https://git-scm.com/

## 🚀 Cara Instalasi & Menjalankan

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/LyricDash.git
cd LyricDash
```

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# (Opsional) Install nodemon untuk development dengan auto-reload
npm install --save-dev nodemon
```

### 3. Setup Frontend

Frontend sudah siap digunakan karena hanya menggunakan HTML/CSS/JS vanilla.

### 4. Jalankan Aplikasi

#### Development Mode:

```bash
# Dari folder backend
cd backend

# Menggunakan nodemon (auto-restart saat ada perubahan)
npm run dev

# Atau menggunakan node biasa
npm start
```

Kemudian buka browser dan akses:
```
http://localhost:3000
```

#### Production Mode:

```bash
cd backend
npm start
```

## 📖 Cara Menggunakan Aplikasi

### 1. Registrasi & Login
- Klik "Register" untuk membuat akun baru
- Atau langsung "Login" jika sudah punya akun
- Username dan password disimpan di server

### 2. Chatroom
- Setelah login, Anda akan melihat daftar pengguna online
- Ketik pesan di input box dan kirim
- Lihat pesan real-time dari pengguna lain

### 3. Memulai Game
- Di bagian "Start Game", generate atau masuk Room ID
- Pilih lagu dari dropdown
- Klik "Join Game Room"
- Tunggu pemain lain bergabung (atau mulai sendiri)
- Klik "Start Game" untuk memulai

### 4. Bermain Game
- Lihat lirik di bagian atas
- Dengarkan audio lagu
- Mulai mengetik lirik di text area
- Monitor progress Anda dan pemain lain secara real-time
- Klik "Finish Game" ketika selesai

### 5. Leaderboard
- Lihat ranking, WPM, dan akurasi semua pemain
- WPM = Words Per Minute
- Accuracy = Persentase ketikan yang benar
- Score = WPM × Accuracy

## 🎵 Menambah Lagu Baru

Untuk menambah lagu baru ke database:

1. Edit file `backend/songs.json`
2. Tambahkan entry baru dengan format:
```json
{
  "id": 4,
  "title": "Nama Lagu",
  "artist": "Nama Artis",
  "audio": "/audio/filename.mp3",
  "lyrics": "Teks lirik lagu di sini...",
  "duration": 120
}
```

3. Letakkan file audio (.mp3) di folder `backend/audio/`
4. Restart server

## 🔐 Keamanan

- Password di-hash menggunakan bcryptjs
- JWT (JSON Web Token) untuk autentikasi
- Token disimpan di localStorage browser
- CORS di-enable untuk development

### ⚠️ Important untuk Production:
- Ubah `JWT_SECRET` di `server.js`
- Gunakan database proper (tidak in-memory)
- Enable HTTPS
- Implement rate limiting
- Validasi input yang lebih ketat

## 🐛 Troubleshooting

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
PORT=3001 npm start
```

### Module not found error
```bash
# Pastikan sudah install dependencies
npm install

# Atau reinstall
rm -rf node_modules
npm install
```

### Socket.io connection error
- Pastikan server sudah running
- Cek network tab di browser DevTools
- Pastikan CORS configuration correct

### Audio tidak terputar
- Letakkan file audio di folder `backend/audio/`
- Update path di `songs.json`
- Gunakan format .mp3 atau .wav

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user

### Songs
- `GET /api/songs` - Ambil daftar semua lagu
- `GET /api/songs/:songId/lyrics` - Ambil lirik lagu spesifik

## 🔗 Socket Events

### User Events
- `user:join` - User bergabung dengan aplikasi
- `user:status-change` - User online/offline
- `users:list` - Daftar user online

### Chat Events
- `chat:message` - Kirim pesan chat

### Game Events
- `game:join-room` - Join game room
- `game:start` - Mulai game
- `game:typing-progress` - Update progress ketikan
- `game:finished` - User selesai bermain
- `game:get-leaderboard` - Request leaderboard
- `game:leave-room` - Keluar dari game room

## 🎨 Customization

### Mengubah Tema Warna
Edit CSS variables di `style.css`:
```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
  /* ... */
}
```

### Mengubah Durasi Game
Edit di `server.js` bagian `loadSongs()`

## 📝 Lisensi

MIT License - Bebas digunakan untuk keperluan personal dan komersial

## 👨‍💻 Author

Dibuat oleh: Senior Fullstack JavaScript Developer

## 🤝 Kontribusi

Silakan fork repository dan submit pull request untuk improvement!

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di GitHub repository.

---

**Selamat bermain dan bersenang-senang dengan LyricDash!** 🎮🎵
