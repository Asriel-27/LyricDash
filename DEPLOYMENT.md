# 🚀 Deployment Guide

Guide untuk deploy LyricDash ke production menggunakan berbagai platform.

## Platform Pilihan

1. **Heroku** (Recommended untuk pemula)
2. **Railway** (Free tier generous)
3. **Render**
4. **DigitalOcean** (VPS)
5. **Vercel** (Frontend static)
6. **Custom Server** (VPS/Dedicated)

---

## 🟣 Deployment ke Heroku

### Prasyarat
- Heroku account (https://www.heroku.com/)
- Heroku CLI installed (https://devcenter.heroku.com/articles/heroku-cli)

### Step 1: Login ke Heroku

```bash
heroku login
```

### Step 2: Create Heroku App

```bash
cd LyricDash
heroku create lyricdash-yourname

# Atau dengan custom name
heroku create your-custom-app-name
```

### Step 3: Set Environment Variables

```bash
heroku config:set JWT_SECRET="your-very-secure-secret-key"
heroku config:set NODE_ENV="production"
```

### Step 4: Deploy

```bash
git push heroku main
```

Tunggu proses selesai. Output akan terlihat:
```
Compressing source files... done.
Building source:
remote:        Created release v1 of app...
remote: Deployed to Heroku
```

### Step 5: Test Deployment

```bash
heroku open
```

Browser akan buka aplikasi Anda di `https://your-app-name.herokuapp.com`

### Step 6: View Logs

```bash
heroku logs --tail
```

---

## 🚂 Deployment ke Railway

### Prasyarat
- Railway account (https://railway.app/)
- Railway CLI (opsional)

### Step 1: Via GitHub

1. Push code ke GitHub
2. Login ke Railway
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Select LyricDash repository
6. Railway akan otomatis detect Node.js project
7. Set environment variables (klik project → Variables)

```
JWT_SECRET = your-secret-key
NODE_ENV = production
```

8. Deploy!

### Step 2: Custom Domain (Opsional)

1. Di Railway Dashboard, klik project
2. Settings → Custom Domain
3. Add custom domain
4. Update DNS records sesuai instruksi

---

## 💎 Deployment ke Render

### Prasyarat
- Render account (https://render.com/)
- GitHub repository dengan code

### Step 1: Create Web Service

1. Login ke Render
2. Click "New +" → "Web Service"
3. Connect GitHub account
4. Select LyricDash repository
5. Fill details:
   - Name: `lyricdash`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

### Step 2: Set Environment Variables

1. Dalam form, scroll ke "Environment"
2. Add:
   ```
   Key: JWT_SECRET
   Value: your-secret-key
   ```

3. Add:
   ```
   Key: NODE_ENV
   Value: production
   ```

4. Click "Create Web Service"

Render akan auto-deploy dari Git push.

---

## 🌊 Deployment ke DigitalOcean (VPS)

### Prasyarat
- DigitalOcean account
- Droplet (minimal $4/bulan - Ubuntu 20.04)
- SSH access ke server

### Step 1: SSH ke Server

```bash
ssh root@your-droplet-ip
```

### Step 2: Update System

```bash
apt update && apt upgrade -y
```

### Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
```

Verify:
```bash
node --version
npm --version
```

### Step 4: Install Nginx (Reverse Proxy)

```bash
apt install -y nginx
systemctl start nginx
```

### Step 5: Clone Repository

```bash
cd /var/www
git clone https://github.com/yourusername/LyricDash.git
cd LyricDash/backend
npm install
```

### Step 6: Setup PM2 (Process Manager)

```bash
npm install -g pm2

# Start app
pm2 start server.js --name "lyricdash"

# Auto start on reboot
pm2 startup
pm2 save
```

### Step 7: Configure Nginx

Create `/etc/nginx/sites-available/lyricdash`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
ln -s /etc/nginx/sites-available/lyricdash /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 8: Setup SSL (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

## 🔧 Production Configuration

### Update server.js untuk Production

```javascript
// Add at top of server.js
require('dotenv').config();

// Update JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-this';

// Add helmet untuk security headers
const helmet = require('helmet');
app.use(helmet());

// Add compression
const compression = require('compression');
app.use(compression());

// Update CORS untuk production
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Update package.json

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "prod": "NODE_ENV=production node server.js"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "helmet": "^7.0.0",
    "compression": "^1.7.4"
  }
}
```

### Install Production Dependencies

```bash
npm install dotenv helmet compression
npm install --save-dev dotenv-cli
```

---

## 📋 Pre-Deployment Checklist

- [ ] Change JWT_SECRET di environment
- [ ] Set NODE_ENV=production
- [ ] Test semua fitur di local
- [ ] Update CORS origin
- [ ] Database backup (jika menggunakan DB)
- [ ] Configure logging
- [ ] Setup monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Configure backup strategy
- [ ] Test SSL certificate

---

## 🔒 Security Considerations

### 1. Environment Variables

Jangan commit `.env` file!

```bash
echo ".env" >> .gitignore
```

### 2. Database

Gunakan managed database service:
- Heroku Postgres
- Railway Postgres
- DigitalOcean Managed Database
- AWS RDS

### 3. Secrets Management

Untuk production, gunakan secrets manager:
- AWS Secrets Manager
- HashiCorp Vault
- 1Password Business
- LastPass Enterprise

### 4. SSL/TLS

- Always use HTTPS
- Setup automatic renewal
- Use strong ciphers

### 5. Monitoring & Logging

```bash
npm install sentry winston
```

Configure error tracking dan logging centralized.

### 6. Rate Limiting

```bash
npm install express-rate-limit
```

### 7. CORS

Restrict to known domains hanya:

```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

---

## 📊 Monitoring Production

### Health Check Endpoint

Add to server.js:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});
```

Monitor dengan:
- UptimeRobot
- Healthchecks.io
- Datadog
- New Relic

### Log Aggregation

```bash
npm install winston-daily-rotate-file
```

### Performance Monitoring

- New Relic
- Datadog
- Sentry
- Loggly

---

## 🔄 Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - name: Install dependencies
        run: cd backend && npm install
      
      - name: Run tests
        run: cd backend && npm test
      
      - name: Deploy to Heroku
        run: |
          git remote add heroku https://git.heroku.com/${{ secrets.HEROKU_APP }}.git
          git push heroku main
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
```

---

## 🐛 Troubleshooting Deployment

### App Crashes saat Start

```bash
heroku logs --tail
# atau
pm2 logs
```

### Database Connection Error

- Check connection string di environment variables
- Verify database credentials
- Check IP whitelist untuk managed DB

### Static Files Not Serving

```javascript
// Ensure frontend files are served
app.use(express.static(path.join(__dirname, '../frontend')));
```

### Socket.io Connection Issues

- Check CORS configuration
- Verify protocol (ws vs wss untuk HTTPS)
- Check firewall rules

---

## 📈 Scaling untuk Future

Ketika user bertambah:

1. **Horizontal Scaling**
   - Load balancer (Nginx, HAProxy)
   - Multiple Node instances
   - PM2 Cluster mode

2. **Database Scaling**
   - Migrate ke PostgreSQL/MongoDB
   - Implement caching (Redis)
   - Database replication

3. **Frontend**
   - CDN (Cloudflare, AWS CloudFront)
   - Static site generator
   - Edge caching

4. **Real-time Optimization**
   - Redis adapter untuk Socket.io
   - Message queue (RabbitMQ, Kafka)
   - WebSocket optimization

---

Selamat deploy! 🚀
