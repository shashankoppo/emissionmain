#!/bin/bash

# aaPanel Deployment & Configuration Script for Emission Platform
# This script automates dependency installation, database setup, and building components.

echo "🚀 Starting aaPanel Configuration..."

# 0. Fix Dubious Ownership & Permissions
echo "🛡️ Fixing Git safe directory and project permissions..."
git config --global --add safe.directory /home/elsxglobal/Desktop/emissionmain

# Aggressively reset ownership to the current user for ALL project files
sudo chown -R $(whoami):$(whoami) .
sudo chmod -R 755 .

# Fix the npm cache once and for all
echo "🧹 Fixing npm cache..."
sudo chown -R $(whoami):$(whoami) "/www/server/nodejs/cache" 2>/dev/null || true
sudo chown -R 1000:1000 "/www/server/nodejs/cache" 2>/dev/null || true
npm cache clean --force 2>/dev/null || true

# 1. Backend Setup
echo "📦 Setting up Backend Server..."
cd "emission admin panel/project/server"

# Ensure .env exists for Prisma
if [ ! -f .env ]; then
  echo "DATABASE_URL=\"file:./dev.db\"" > .env
  echo "JWT_SECRET=\"$(openssl rand -base64 32 2>/dev/null || echo 'supersecretkey')\"" >> .env
  echo "PORT=3001" >> .env
  sudo chown $(whoami):$(whoami) .env
fi

# Set ENV for the current session to ensure Prisma/npm see it
export DATABASE_URL="file:./dev.db"

npm install --no-audit --unsafe-perm
npm install nodemailer --no-audit --unsafe-perm

# Database Configuration
echo "🗄️ Configuring Database..."
# Explicitly use the env var in the command string to be 100% sure
DATABASE_URL="file:./dev.db" npx prisma generate
DATABASE_URL="file:./dev.db" npx prisma db push --accept-data-loss
DATABASE_URL="file:./dev.db" npm run seed

cd ../../../

# 2. Main Website (Customer Frontend)
echo "🌐 Setting up Main Website..."
cd "emission/project"
sudo chown -R $(whoami):$(whoami) .
npm install --no-audit --unsafe-perm
cd ../../

# 3. Admin Panel (Frontend)
echo "🔒 Setting up Admin Panel..."
cd "emission admin panel/project/client"
sudo chown -R $(whoami):$(whoami) .
npm install --no-audit --unsafe-perm
cd ../../../

echo "✅ Configuration Complete!"
echo "------------------------------------------------"
echo "Next Steps in aaPanel:"
echo "1. Side Menu -> Website -> Node Project"
echo "2. Add Node Project for the Backend (Port 3001)"
echo "3. Ensure Nginx configuration includes the /api and /uploads proxy rules"
echo "------------------------------------------------"
