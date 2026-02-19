# 🚀 Emission Deployment & Installation Guide

This guide provides step-by-step instructions for installing and deploying the Emission e-commerce platform (Customer Site + Admin Panel + Backend) on various operating systems, with a focus on **Ubuntu 24.04**.

---

## 📋 Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Docker & Docker Compose** (for Docker installation)
- **Git** (for cloning the repository)

---

## 🐳 Option 1: Docker Installation (Recommended)

This is the fastest and most reliable way to get the entire system running.

### 1. Install Docker on Ubuntu 24.04
```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y ca-certificates border-radius curl gnupg lsb-release

# Add Docker’s official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2. Configure Environment Variables
Edit the `docker-compose.yml` file in the root directory to set your secrets:
- `JWT_SECRET`: A strong random string for security.
- `RAZORPAY_KEY_ID`: Your Razorpay Test/Live Key ID.
- `RAZORPAY_KEY_SECRET`: Your Razorpay Test/Live Key Secret.

### 3. Launch the Platform
```bash
# Navigate to the project root
# Build and start all containers in detached mode
sudo docker compose up -d --build
```

### 4. Setup Database
```bash
# Run migrations inside the backend container
sudo docker compose exec backend npx prisma migrate deploy
sudo docker compose exec backend npm run seed
```

**Access URLs:**
- **Customer Site**: http://localhost:5174
- **Admin Panel**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 🛠️ Option 2: Direct Installation (Ubuntu 24.04)

### 1. Install System Dependencies
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential

# Verify installation
node -v
npm -v
```

### 2. Setup Backend Server
```bash
cd "emission admin panel/project/server"
npm install

# Initialize Database
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 3. Setup Frontend Applications
```bash
# Setup Admin Client
cd "../client"
npm install

# Setup Customer Website
cd "../../../emission/project"
npm install
```

### 4. Running the Applications
You can use `pm2` to manage the processes:
```bash
sudo npm install -g pm2

# Start Backend
cd "emission admin panel/project/server"
pm2 start npm --name "emission-backend" -- run dev

# Start Admin Panel
cd "../client"
pm2 start npm --name "emission-admin" -- run dev

# Start Customer Site
cd "../../../emission/project"
pm2 start npm --name "emission-customer" -- run dev
```

---

## 🪟 Installation on Windows

### 1. Docker
- Install **Docker Desktop** from [docker.com](https://www.docker.com/products/docker-desktop).
- Open PowerShell/CMD in the project root.
- Run `docker-compose up -d --build`.

### 2. Direct
- Install **Node.js 20+** from [nodejs.org](https://nodejs.org/).
- Follow the same steps as the "Direct Installation" section above using PowerShell.

---

## 🔧 Post-Installation Checklist

1. **Admin Login**:
   - URL: http://localhost:5173
   - Default Email: `admin@emission.com`
   - Default Password: `123`
2. **Firewall**: Ensure ports `3001`, `5173`, and `5174` are open in your security groups/UFW.
3. **Domain Mapping**: If deploying to production, use Nginx as a reverse proxy to map your domain to these ports.

---

## 🆘 Troubleshooting

- **Image Upload Errors**: Ensure the `uploads/` directory in the server has write permissions (`chmod -R 777 uploads` on Linux).
- **Prisma Error**: If you see "Prisma Client could not locate the Query Engine", run `npx prisma generate`.
- **Port Conflict**: If ports are already in use, change the mapping in `docker-compose.yml`.

---
*Created for Emissíon Team • February 2026*
