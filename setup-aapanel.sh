#!/bin/bash

# aaPanel Nuclear Deployment Script for Emission Platform
# This script is designed to force-fix all permission and environmental issues common in aaPanel.

echo "🚀 Starting ULTIMATE aaPanel Configuration..."

# 1. Mandatory Sudo Check
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run this script with sudo:"
  echo "sudo ./setup-aapanel.sh"
  exit
fi

USER_HOME="/home/elsxglobal"
PROJECT_DIR="$USER_HOME/Desktop/emissionmain"

# 2. Fix Git Safe Directory
echo "🛡️ Fixing Git trust..."
git config --global --add safe.directory "$PROJECT_DIR"

# 3. Nuclear Permission Reset
echo "🧹 Cleaning up locked files and fixing ownership..."
# Fix the user's home cache
chown -R elsxglobal:elsxglobal "$USER_HOME/.npm" 2>/dev/null || true
chown -R elsxglobal:elsxglobal "$USER_HOME/.cache" 2>/dev/null || true

# Global npm cache fix for aaPanel
chown -R 1000:1000 "/www/server/nodejs/cache" 2>/dev/null || true

# Enter Project Directory
cd "$PROJECT_DIR"
chown -R elsxglobal:elsxglobal .
chmod -R 755 .

# Remove locked node_modules to start fresh
echo "🗑️  Removing old node_modules and lockfiles..."
find . -name "node_modules" -type d -prune -exec rm -rf {} +
find . -name "package-lock.json" -delete

# 4. Backend Reconstruction
echo "📦 Rebuilding Backend Server..."
cd "emission admin panel/project/server"

# Generate fresh .env if missing
if [ ! -f .env ]; then
  cat > .env << EOF
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="$(openssl rand -base64 32)"
EOF
  chown elsxglobal:elsxglobal .env
fi

# Install as current user to avoid permission pitfalls
sudo -u elsxglobal npm install --no-audit
sudo -u elsxglobal npm install nodemailer --no-audit

# Database Configuration with explicit ENV
echo "🗄️  Configuring Database..."
export DATABASE_URL="file:./dev.db"
sudo -u elsxglobal DATABASE_URL="file:./dev.db" npx prisma generate
sudo -u elsxglobal DATABASE_URL="file:./dev.db" npx prisma db push --accept-data-loss
sudo -u elsxglobal DATABASE_URL="file:./dev.db" npm run seed

cd "$PROJECT_DIR"

# 5. Frontend Reconstruction
echo "🌐 Rebuilding Main Website..."
cd "emission/project"
sudo -u elsxglobal npm install --no-audit
cd "$PROJECT_DIR"

echo "🔒 Rebuilding Admin Panel..."
cd "emission admin panel/project/client"
sudo -u elsxglobal npm install --no-audit
cd "$PROJECT_DIR"

echo "✅ ULTIMATE SUCCESS!"
echo "------------------------------------------------"
echo "Your platform is now ready. Next steps in aaPanel:"
echo "1. Website -> Node Project -> Add Project"
echo "2. Port: 3001, Root: $PROJECT_DIR/emission admin panel/project/server"
echo "3. Remember to add Nginx proxy rules for /api and /uploads"
echo "------------------------------------------------"
