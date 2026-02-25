# Emission — Ubuntu 24.04 Deployment Guide

Complete deployment guide for the **Customer Website** and **Admin Panel + API Server** on Ubuntu 24.04 LTS.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Ubuntu 24.04 VPS                   │
│                                                     │
│   Nginx (Reverse Proxy — port 80/443)               │
│   ├── yourdomain.com  →  Customer Frontend (static) │
│   ├── yourdomain.com/api  →  Backend API (:3001)    │
│   └── admin.yourdomain.com →  Admin Panel (static)  │
│                                                     │
│   Node.js Backend (PM2)  — port 3001                │
│   └── SQLite Database (prisma/dev.db)               │
└─────────────────────────────────────────────────────┘
```

---

## 1. Server Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v   # v20.x.x
npm -v    # 10.x.x

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Install build essentials (for native modules)
sudo apt install -y build-essential
```

---

## 2. Clone the Repository

```bash
cd /opt
sudo mkdir emission && sudo chown $USER:$USER emission
cd emission
git clone https://github.com/shashankoppo/emissionmain.git .
```

---

## 3. Build the Admin Panel (Backend + Admin Frontend)

```bash
cd /opt/emission/emission\ admin\ panel/project

# Install all dependencies (workspaces)
npm install

# Generate Prisma client
cd server
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the admin account
npx tsx src/seed.ts

# Build everything (admin client + server)
cd ..
npm run build
```

### 3.1 Configure Environment Variables

```bash
# Edit the server .env file
nano /opt/emission/emission\ admin\ panel/project/server/.env
```

Set the following:

```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="CHANGE_THIS_TO_A_STRONG_RANDOM_SECRET"
```

> [!CAUTION]
> Change `JWT_SECRET` to a long random string in production. Use `openssl rand -base64 32` to generate one.

### 3.2 Inject Razorpay Keys

```bash
cd /opt/emission/emission\ admin\ panel/project/server
npx tsx fix_razorpay_db.js
```

Or configure them later via the Admin Panel → Settings page.

### 3.3 Start Backend with PM2

```bash
cd /opt/emission/emission\ admin\ panel/project/server

# Start the server
pm2 start dist/index.js --name "emission-api" --env production

# Save PM2 process list for auto-restart on reboot
pm2 save
pm2 startup
# Run the command PM2 outputs to enable startup on boot
```

Verify it's running:

```bash
curl http://localhost:3001/api/health
# Should return: {"status":"ok","message":"Emission Admin API is running"}
```

---

## 4. Build the Customer Website

```bash
cd /opt/emission/emission/project

# Install dependencies
npm install

# Create production .env
nano .env
```

Set the API URL to your production domain:

```env
VITE_API_URL=https://yourdomain.com/api
```

```bash
# Build the static site
npm run build
# Output is in ./dist/
```

---

## 5. Configure Nginx

### 5.1 Main Site + API Proxy

```bash
sudo nano /etc/nginx/sites-available/emission
```

Paste the following (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Customer Website (static files)
    root /opt/emission/emission/project/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy → Node.js backend
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded images from backend
    location /uploads {
        proxy_pass http://127.0.0.1:3001/uploads;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css image/svg+xml;
    gzip_min_length 256;
}
```

### 5.2 Admin Panel (Optional Subdomain)

```bash
sudo nano /etc/nginx/sites-available/emission-admin
```

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;

    # Admin Panel (static files)
    root /opt/emission/emission\ admin\ panel/project/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy (same backend)
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:3001/uploads;
        proxy_set_header Host $host;
    }
}
```

### 5.3 Enable Sites & Restart Nginx

```bash
sudo ln -s /etc/nginx/sites-available/emission /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/emission-admin /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 6. SSL with Let's Encrypt (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificates (auto-configures Nginx)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com

# Auto-renewal is set up automatically. Test it:
sudo certbot renew --dry-run
```

---

## 7. Firewall Setup

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 8. Admin Credentials

| Field    | Value                |
|----------|----------------------|
| Email    | `admin@emission.com` |
| Password | `admin123`           |

> [!WARNING]
> Change the default admin password immediately after first login via the Admin Panel.

---

## 9. Useful PM2 Commands

```bash
pm2 status              # Check running processes
pm2 logs emission-api   # View live logs
pm2 restart emission-api # Restart the server
pm2 monit               # Real-time monitoring dashboard
```

---

## 10. Updating the Application

```bash
cd /opt/emission

# Pull latest code
git pull origin main

# Rebuild customer site
cd emission/project
npm install && npm run build

# Rebuild admin panel + server
cd ../../emission\ admin\ panel/project
npm install
cd server && npx prisma generate && npx prisma migrate deploy && cd ..
npm run build

# Restart backend
pm2 restart emission-api
```

---

## 11. Backup Strategy

```bash
# Backup the SQLite database (add to crontab)
cp /opt/emission/emission\ admin\ panel/project/server/prisma/dev.db \
   /opt/emission/backups/dev_$(date +%Y%m%d_%H%M%S).db

# Backup uploaded images
tar -czf /opt/emission/backups/uploads_$(date +%Y%m%d).tar.gz \
   /opt/emission/emission\ admin\ panel/project/server/uploads/
```

Add to crontab for daily backups:

```bash
crontab -e
# Add:
0 2 * * * cp /opt/emission/emission\ admin\ panel/project/server/prisma/dev.db /opt/emission/backups/dev_$(date +\%Y\%m\%d).db
```

---

## Quick Checklist

- [ ] Node.js 20 installed
- [ ] Nginx installed and configured
- [ ] Repository cloned to `/opt/emission`
- [ ] Admin panel built (`npm run build`)
- [ ] Customer site built (`npm run build`)
- [ ] `.env` configured with strong `JWT_SECRET`
- [ ] Razorpay keys configured
- [ ] PM2 running the API server
- [ ] SSL certificates installed
- [ ] Firewall enabled
- [ ] Default admin password changed
- [ ] Backups configured
