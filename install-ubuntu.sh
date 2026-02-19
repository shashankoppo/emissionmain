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

# 3. Setup Directories
echo "📁 Setting up storage directories..."
mkdir -p "emission admin panel/project/server/uploads"

# 4. Starting Platform
echo "🚢 Launching containers with Docker Compose..."
sudo docker compose up -d --build

# 5. Initialize Database
echo "🗄️ Initializing database..."
echo "Waiting for backend to be ready..."
sleep 10

sudo docker compose exec backend npx prisma migrate deploy
sudo docker compose exec backend npm run seed

echo ""
echo "===================================================="
echo "🎉 INSTALLATION COMPLETE!"
echo "===================================================="
echo "Customer Website: http://localhost:5174"
echo "Admin Panel:      http://localhost:5173 (admin@emission.com / 123)"
echo "Backend API:      http://localhost:3001"
echo "===================================================="
echo "Detailed guide: DEPLOYMENT_GUIDE.md"
