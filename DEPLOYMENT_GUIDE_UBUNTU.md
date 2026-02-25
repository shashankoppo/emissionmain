# Emission — Deploy on Ubuntu 24.04

> Just follow Step 1 → 6 in order. Copy-paste each block.

---

## Step 1 — Install Everything

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git build-essential
sudo npm install -g pm2
```

---

## Step 2 — Clone & Build

```bash
# Clone
cd /opt
sudo mkdir emission && sudo chown $USER:$USER emission
cd emission
git clone https://github.com/shashankoppo/emissionmain.git .

# Build Admin Panel + Backend
cd "emission admin panel/project"
npm install
cd server
npx prisma generate
npx prisma migrate deploy
npx tsx src/seed.ts        # Creates admin account
cd ..
npm run build

# Build Customer Website
cd /opt/emission/emission/project
npm install
npm run build
```

---

## Step 3 — Configure

**Backend `.env`:**
```bash
nano "/opt/emission/emission admin panel/project/server/.env"
```
```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="PASTE_A_RANDOM_SECRET_HERE"
```
Generate a secret: `openssl rand -base64 32`

**Customer `.env`:**
```bash
nano /opt/emission/emission/project/.env
```
```env
VITE_API_URL=https://yourdomain.com/api
```
Then rebuild: `cd /opt/emission/emission/project && npm run build`

---

## Step 4 — Start Backend

```bash
cd "/opt/emission/emission admin panel/project/server"
pm2 start dist/index.js --name "emission-api"
pm2 save && pm2 startup
```

Test: `curl http://localhost:3001/api/health`

---

## Step 5 — Setup Nginx

```bash
sudo nano /etc/nginx/sites-available/emission
```

Paste this (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /opt/emission/emission/project/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:3001/uploads;
    }
}

server {
    listen 80;
    server_name admin.yourdomain.com;

    root /opt/emission/emission\ admin\ panel/project/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:3001/uploads;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/emission /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

---

## Step 6 — SSL (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com
```

Done. Auto-renews automatically.

---

## Admin Login

| Email | Password |
|---|---|
| `admin@emission.com` | `admin123` |

⚠️ Change this password after first login.

---

## Updating Later

```bash
cd /opt/emission
git pull origin main
cd "emission admin panel/project" && npm install && npm run build
cd /opt/emission/emission/project && npm install && npm run build
pm2 restart emission-api
```
