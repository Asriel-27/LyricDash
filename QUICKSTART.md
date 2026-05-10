# 🚀 Quick Start Guide

## 5 Menit Setup

### Step 1: Install Dependencies

```bash
# Masuk ke folder backend
cd backend
npm install
```

Tunggu hingga selesai. Output akan terlihat seperti ini:
```
added 123 packages in 15s
```

### Step 2: Jalankan Server

```bash
# Masih di folder backend
npm start
```

Anda akan melihat:
```
Server running on http://localhost:3000
```

✅ Server sudah berjalan!

### Step 3: Buka Browser

Buka browser favorit dan akses:
```
http://localhost:3000
```

Anda akan melihat halaman login LyricDash.

## 🎮 Cara Bermain

### 1. Register Akun Baru

1. Click "Register" di halaman login
2. Masukkan username (contoh: `player1`)
3. Masukkan password (contoh: `password123`)
4. Confirm password
5. Click "Register"

Akun berhasil dibuat! Anda akan langsung login.

### 2. Eksplor Chat

- Di bagian kanan, Anda akan melihat "Online Players" (mungkin kosong jika Anda sendiri)
- Buka tab baru di browser yang sama dan register akun kedua (contoh: `player2`)
- Login dengan akun kedua
- Sekarang Anda bisa lihat `player1` di "Online Players"
- Chat antara kedua akun!

### 3. Memulai Game

Dengan akun pertama (`player1`):
1. Di bagian "Start Game" sebelah kanan, click "Generate ID" untuk generate room ID
2. Pilih lagu dari dropdown (contoh: "Flower Flow")
3. Click "Join Game Room"

Dengan akun kedua (`player2`):
1. Salin Room ID dari akun pertama (terlihat di "Room ID")
2. Paste ke field "Room ID" di akun kedua
3. Pilih lagu yang sama
4. Click "Join Game Room"

Sekarang kedua pemain ada di room yang sama!

### 4. Mulai Bertanding

Dengan akun `player1`:
1. Click "Start Game"
2. Lagu akan diputar dan text area untuk mengetik akan diaktifkan
3. Mulai mengetik lirik yang terlihat

Dengan akun `player2`:
1. Akan otomatis menerima game start
2. Lagu diputar bersamaan
3. Mulai mengetik juga

Monitor progress masing-masing pemain di bagian "Players Progress" - update real-time!

### 5. Lihat Hasil

Setelah selesai mengetik:
1. Click "Finish Game"
2. Lihat leaderboard dengan ranking semua pemain
3. Lihat WPM, Accuracy, dan Score Anda

**Congrats! Anda sudah bermain LyricDash!** 🎉

## 🔧 Troubleshooting Cepat

### Port 3000 sudah digunakan?

```bash
# Gunakan port lain, contoh 3001
PORT=3001 npm start

# Kemudian akses http://localhost:3001
```

### Module not found?

```bash
# Pastikan di folder backend
cd backend

# Re-install dependencies
npm install
```

### Socket.io error?

- Buka browser DevTools (F12 atau Ctrl+Shift+I)
- Cek tab "Console" untuk error messages
- Pastikan server sudah running dan URL benar

### Audio tidak terputar?

- Aplikasi sudah include 3 sample songs
- Audio file akan di-load dari path di songs.json
- Pastikan `/audio/` folder ada di backend folder

## 📝 Test Accounts

Anda bisa langsung login menggunakan test accounts (dibuat saat registrasi):

```
Username: testuser1
Password: password123

Username: testuser2
Password: password123
```

## 🎵 Available Songs

Database sudah include 3 lagu:

1. **Flower Flow** - Dua Lipa
   - Lirik: "Flowers in bloom beneath the sun..."
   - Duration: 120 detik

2. **Digital Hearts** - The Synthetics
   - Lirik: "In the glow of pixel light..."
   - Duration: 100 detik

3. **Mountain Echo** - Wilderness
   - Lirik: "Standing at the peak so high..."
   - Duration: 110 detik

## 💡 Tips Bermain

1. **Perhatikan Typo** - Setiap huruf yang salah akan mengurangi akurasi
2. **Kecepatan Tetap Penting** - WPM dihitung dari kecepatan mengetik
3. **Fokus pada Akurasi** - Score = WPM × Accuracy, jadi akurasi sangat mempengaruhi
4. **Monitor Kompetitor** - Lihat progress pemain lain real-time di progress bar

## 🚨 Penting untuk Production

Sebelum deploy ke production, UBAH ini di `backend/server.js`:

```javascript
const JWT_SECRET = 'your-secret-key-change-this-in-production';
// Ubah menjadi:
const JWT_SECRET = 'jangan-lupa-ganti-secret-key-dengan-yang-kuat';
```

## ❓ Pertanyaan Umum

**Q: Apakah data saya tersimpan?**
A: Untuk development, data disimpan in-memory (hilang jika server restart). Untuk production, gunakan database.

**Q: Berapa pemain maksimal di satu room?**
A: Unlimited! Tergantung server resources.

**Q: Bisa tambah lagu sendiri?**
A: Ya! Edit `backend/songs.json` dan add entry baru. Lihat README.md untuk detail.

**Q: Bisa host di internet?**
A: Ya! Deploy ke Heroku, Railway, Vercel, atau server lain. Pastikan set NODE_ENV dan PRODUCTION values.

---

Selamat bermain! Jika ada masalah, lihat README.md atau TECHNICAL.md. 🎮🎵
