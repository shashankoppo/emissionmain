#!/bin/bash

# Emissíon - One-Click Installation Script for Ubuntu 24.04
# This script installs Docker and launches the entire platform.

set -e

echo "🚀 Starting Emissíon Installation..."

# 1. Update System
echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
if ! [ -x "$(command -v docker)" ]; then
    echo "🐳 Installing Docker..."
    sudo apt install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
    echo "✅ Docker is already installed."
fi

# 3. Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# 4. Setup Directories
echo "📁 Setting up storage directories..."
mkdir -p "emission admin panel/project/server/uploads"
chmod -R 777 "emission admin panel/project/server/uploads"

# 5. Starting Platform
echo "🚢 Launching containers with Docker Compose (Rebuilding frontends)..."
sudo docker compose down
sudo docker compose up -d --build

# 6. Initialize Database
echo "🗄️ Initializing database..."
echo "Waiting for backend to be ready..."
sleep 15

sudo docker compose exec backend npx prisma migrate deploy
sudo docker compose exec backend npm run seed

echo ""
echo "===================================================="
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "===================================================="
echo "Customer Website: http://YOUR_SERVER_IP:5174"
echo "Admin Panel:      http://YOUR_SERVER_IP:5173"
echo "API & Uploads:    http://YOUR_SERVER_IP:3001"
echo "----------------------------------------------------"
echo "Credentials:"
echo "Email:    admin@emission.com"
echo "Password: 123"
echo "===================================================="
echo "NOTE: If products still don't load, clear your browser cache."
echo "Detailed guide: DEPLOYMENT_GUIDE.md"
