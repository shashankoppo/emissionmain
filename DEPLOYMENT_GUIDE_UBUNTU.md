# Emission — Deploy with Docker 🐳

> **3 commands.** That's it.

---

## Prerequisites

Install Docker on Ubuntu 24.04:

```bash
sudo apt update
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# Log out and back in, then continue
```

---

## Deploy

```bash
# 1. Clone
git clone https://github.com/shashankoppo/emissionmain.git /opt/emission
cd /opt/emission

# 2. Set your secret key
echo 'JWT_SECRET=paste-a-random-secret-here' > .env

# 3. Launch everything
docker compose up -d --build
```

**That's it.** ✅

- Customer Website → `http://your-server-ip` (port 80)
- Backend API → `http://your-server-ip:3001/api`
- Admin Panel → `http://your-server-ip:3001` (served from backend)

---

## Admin Login

| Email | Password |
|---|---|
| `admin@emission.com` | `admin123` |

⚠️ Change password after first login.

---

## Add SSL (HTTPS) — Optional

```bash
sudo apt install -y certbot
sudo certbot certonly --standalone -d yourdomain.com
```

Then update `docker-compose.yml` to mount the certs into nginx.

---

## Useful Commands

```bash
docker compose logs -f          # View live logs
docker compose restart           # Restart everything
docker compose down              # Stop everything
docker compose up -d --build     # Rebuild & restart
```

---

## Update to Latest Code

```bash
cd /opt/emission
git pull origin main
docker compose up -d --build
```

---

## Without Docker (Manual)

If you prefer not to use Docker, follow these 6 steps:

### Step 1 — Install

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git build-essential
sudo npm install -g pm2
```

### Step 2 — Clone & Build

```bash
cd /opt
sudo mkdir emission && sudo chown $USER:$USER emission
cd emission
git clone https://github.com/shashankoppo/emissionmain.git .

# Backend
cd "emission admin panel/project"
npm install
cd server
npx prisma generate && npx prisma migrate deploy && npx tsx src/seed.ts
cd .. && npm run build

# Frontend
cd /opt/emission/emission/project
npm install && npm run build
```

### Step 3 — Configure .env

```bash
nano "/opt/emission/emission admin panel/project/server/.env"
```
```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="paste-a-random-secret"
```

### Step 4 — Start Backend

```bash
cd "/opt/emission/emission admin panel/project/server"
pm2 start dist/index.js --name "emission-api"
pm2 save && pm2 startup
```

### Step 5 — Nginx

```bash
sudo nano /etc/nginx/sites-available/emission
```
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /opt/emission/emission/project/dist;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    location /api { proxy_pass http://127.0.0.1:3001; }
    location /uploads { proxy_pass http://127.0.0.1:3001/uploads; }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/emission /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

### Step 6 — SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```
