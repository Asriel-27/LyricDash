# 🔧 Installation Instructions

Panduan lengkap untuk setup LyricDash di mesin lokal Anda.

## ⚡ Quick Setup (Recommended)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/LyricDash.git
cd LyricDash
```

### 2. Run Automatic Setup

**Di Windows:**
```bash
setup.bat
```

**Di macOS/Linux:**
```bash
bash setup.sh
```

Script ini akan:
- ✅ Check Node.js & npm installation
- ✅ Install all dependencies
- ✅ Create .env file
- ✅ Setup development environment

### 3. Start Server

```bash
cd backend
npm start
```

### 4. Open in Browser

```
http://localhost:3000
```

---

## 📋 Manual Setup (Step-by-Step)

Jika automatic script tidak bekerja, ikuti langkah manual ini.

### Step 1: Install Node.js

1. Download Node.js dari https://nodejs.org/
2. Pilih "LTS" (Long Term Support)
3. Install dengan default settings
4. Verify installation:

```bash
node --version
npm --version
```

Output akan terlihat:
```
v18.17.0
9.8.1
```

### Step 2: Clone Repository

```bash
git clone https://github.com/yourusername/LyricDash.git
cd LyricDash
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

Wait untuk selesai. Output akan:
```
added 123 packages, and audited 124 packages in 15s
```

### Step 4: Create Environment File

Buat file `backend/.env`:

```bash
# Windows
echo PORT=3000 > .env
echo NODE_ENV=development >> .env
echo JWT_SECRET=dev-secret-key >> .env

# macOS/Linux
cat > .env << EOF
PORT=3000
NODE_ENV=development
JWT_SECRET=dev-secret-key
EOF
```

### Step 5: Start Server

```bash
npm start
```

Anda akan lihat:
```
Server running on http://localhost:3000
```

### Step 6: Open Browser

Buka: http://localhost:3000

---

## ✅ Verification Checklist

Setelah setup, verify semua berjalan:

- [ ] Node.js terinstall (`node --version` shows v14+)
- [ ] npm terinstall (`npm --version` shows v6+)
- [ ] Dependencies terinstall (`backend/node_modules` exists)
- [ ] .env file dibuat
- [ ] Server berjalan pada port 3000
- [ ] Browser bisa akses http://localhost:3000
- [ ] Halaman login terlihat

---

## 🆘 Troubleshooting

### "Node.js is not installed"

**Solution:**
1. Download dari https://nodejs.org/
2. Run installer
3. Restart terminal/command prompt
4. Verify: `node --version`

### "npm: command not found"

**Solution:**
1. Reinstall Node.js
2. npm seharusnya included dengan Node.js
3. Add Node.js ke PATH environment variable

### "Cannot find module"

**Solution:**
```bash
cd backend
rm -rf node_modules
npm install
```

### "Port 3000 already in use"

**Solution:**
```bash
PORT=3001 npm start
# atau kill process yang menggunakan port 3000
```

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### ".env file not found"

**Solution:**
Create manual di `backend/.env`:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=dev-secret
```

### "Cannot connect to server"

**Solution:**
1. Verify server running: `npm start` output should show "Server running"
2. Check port: `http://localhost:3000` (tidak `http://127.0.0.1:3000`)
3. Firewall: Allow port 3000
4. Browser: Try different browser atau clear cache

### "Socket connection error"

**Solution:**
1. Refresh page
2. Check browser console (F12) untuk error
3. Verify server running
4. Check CORS configuration di server.js

---

## 🖥️ Development Environment

### VS Code Setup (Recommended)

1. Download VS Code: https://code.visualstudio.com/
2. Install extensions:
   - ES7+ React/Redux/React-Native snippets
   - Thunder Client (untuk test API)
   - REST Client
   - GitLens

### Recommended npm Scripts

Di `backend/package.json` sudah ada:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Development Commands

```bash
# Start dengan auto-reload
npm run dev

# Start production mode
npm start

# Check installed packages
npm list

# Update packages
npm update
```

---

## 🔐 Security Setup

### Change JWT Secret

**Development** (aman):
```
JWT_SECRET=dev-secret-key
```

**Production** (MUST CHANGE):
1. Generate strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Update di .env:
```
JWT_SECRET=<generated-secret-above>
```

3. Never commit `.env` file!

---

## 📦 Dependencies Overview

Backend dependencies di `package.json`:

```json
{
  "express": "^4.18.2",      // Web framework
  "socket.io": "^4.5.4",     // Real-time communication
  "cors": "^2.8.5",          // Cross-origin requests
  "uuid": "^9.0.0",          // Unique ID generation
  "bcryptjs": "^2.4.3",      // Password hashing
  "jsonwebtoken": "^9.0.0"   // JWT authentication
}
```

Semua will be installed dengan `npm install`.

---

## 🌐 Network Setup

### Local Network Access

Untuk access dari device lain di network:

1. Find your machine IP:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

2. Update CORS di server.js:
```javascript
app.use(cors({
  origin: "*" // Allow all (development only!)
}));
```

3. Access dari device lain:
```
http://<your-ip>:3000
```

### Firewall Exception

Windows mungkin block port 3000:
1. Windows Defender Firewall
2. Allow app through firewall
3. Find & select Node.js

---

## 🚀 Next Steps

Setelah setup berhasil:

1. **Register Account** - Buat akun baru
2. **Try Chat** - Open 2 browser tabs untuk test chat real-time
3. **Play Game** - Test multiplayer typing game
4. **Read Docs** - Baca QUICKSTART.md untuk full tutorial

---

## 💡 Tips

- **Development Mode**: Gunakan `npm run dev` untuk auto-reload
- **Terminal**: Keep server running di terminal tersendiri
- **Browser Console**: Check F12 untuk debug JavaScript
- **Network Tab**: Debug Socket.io connections
- **Hot Reload**: Ubah file JavaScript = auto reload dengan nodemon

---

## 🎓 Next Learning Path

1. ✅ **Installation Complete**
2. 📖 Read README.md - Understand aplikasi
3. 🎮 Baca QUICKSTART.md - Bermain game
4. 🔧 Study TECHNICAL.md - Understand architecture
5. 🧪 Baca API_TESTING.md - Test API
6. 🚀 Study DEPLOYMENT.md - Deploy to production

---

## 📞 Need Help?

- Check README.md untuk overview
- Check TECHNICAL.md untuk detail teknis
- Check API_TESTING.md untuk API reference
- Check GitHub issues
- Check node_modules/socket.io/docs/

---

**Installation Complete!** 🎉

Sekarang buka `http://localhost:3000` dan enjoy LyricDash! 🎮🎵
