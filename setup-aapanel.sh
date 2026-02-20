#!/bin/bash

# aaPanel Deployment & Configuration Script for Emission Platform
# This script automates dependency installation, database setup, and building components.

echo "🚀 Starting aaPanel Configuration..."

# 0. Fix Permissions (Crucial for aaPanel/Ubuntu)
echo "🛡️ Fixing npm cache and project permissions..."
sudo chown -R $(whoami):$(whoami) .
sudo chown -R $(whoami):$(whoami) "/www/server/nodejs/cache" 2>/dev/null || true
# Fixing the specific error mentioned in your logs
sudo chown -R 1000:1000 "/www/server/nodejs/cache" 2>/dev/null || true

# 1. Backend Setup
echo "📦 Setting up Backend Server..."
cd "emission admin panel/project/server"

# Ensure .env exists for Prisma
if [ ! -f .env ]; then
  echo "DATABASE_URL=\"file:./dev.db\"" > .env
  echo "JWT_SECRET=\"$(openssl rand -base64 32 2>/dev/null || echo 'supersecretkey')\"" >> .env
  echo "PORT=3001" >> .env
fi

npm install --no-audit
npm install nodemailer

# Database Configuration
echo "🗄️ Configuring Database..."
# Set ENV for the current session to ensure Prisma sees it
export DATABASE_URL="file:./dev.db"

# Generate Prisma Client
npx prisma generate
# Push schema to database
npx prisma db push --accept-data-loss
# Seed initial data
npm run seed

cd ../../../

# 2. Main Website (Customer Frontend)
echo "🌐 Setting up Main Website..."
cd "emission/project"
sudo chown -R $(whoami):$(whoami) .
npm install --no-audit
cd ../../

# 3. Admin Panel (Frontend)
echo "🔒 Setting up Admin Panel..."
cd "emission admin panel/project/client"
sudo chown -R $(whoami):$(whoami) .
npm install --no-audit
cd ../../../

echo "✅ Configuration Complete!"
echo "------------------------------------------------"
echo "Next Steps in aaPanel:"
echo "1. Side Menu -> Website -> Node Project"
echo "2. Add Node Project for the Backend (Port 3001)"
echo "3. Point your domains to the respective project folders"
echo "4. Ensure Nginx configuration includes the /api and /uploads proxy rules"
echo "------------------------------------------------"
