#!/bin/bash

# Docker Clean Reinstall Script for Ubuntu 24.04
# This script removes ALL existing Docker components and performs a fresh, official installation.

set -e

echo "🛑 Stopping Docker services..."
sudo systemctl stop docker.service || true
sudo systemctl stop docker.socket || true

echo "🧹 Uninstalling all conflicting Docker packages..."
sudo apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras || true
sudo apt-get autoremove -y --purge || true

# Optional: Uncomment if you want to wipe ALL Docker data (volumes, images, etc.)
# echo "⚠️ Wiping Docker data (/var/lib/docker)..."
# sudo rm -rf /var/lib/docker
# sudo rm -rf /var/lib/containerd

echo "🌐 Installing dependencies..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

echo "🔑 Adding Docker's official GPG key..."
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "📝 Adding Docker repository to Apt sources..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "📥 Installing Docker Engine (Latest Stable)..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "👤 Configuring user permissions ($USER)..."
sudo usermod -aG docker $USER || true

echo "✅ Docker installation complete!"
echo "----------------------------------------------------"
echo "🚀 NEXT STEPS:"
echo "1. Restart your terminal (or run: newgrp docker)"
echo "2. Run 'docker run hello-world' to verify"
echo "3. Run your project: 'docker compose up -d'"
echo "----------------------------------------------------"
