#!/bin/bash

# aaPanel Deployment & Configuration Script for Emission Platform
# This script automates dependency installation, database setup, and building components.

echo "🚀 Starting aaPanel Configuration..."

# 1. Backend Setup
echo "📦 Setting up Backend Server..."
cd "emission admin panel/project/server"
npm install
npm install nodemailer # Ensure nodemailer is installed

# Database Configuration
echo "🗄️ Configuring Database..."
# Generate Prisma Client
npx prisma generate
# Push schema to database (works for SQLite/MySQL/Postgres)
npx prisma db push
# Seed initial data (Admin, Settings)
npm run seed

cd ../../../

# 2. Main Website (Customer Frontend)
echo "🌐 Setting up Main Website..."
cd "emission/project"
npm install
# Note: In aaPanel, if you use static sites, you need to build:
# npm run build
cd ../../

# 3. Admin Panel (Frontend)
echo "🔒 Setting up Admin Panel..."
cd "emission admin panel/project/client"
npm install
# npm run build
cd ../../../

echo "✅ Configuration Complete!"
echo "------------------------------------------------"
echo "Next Steps in aaPanel:"
echo "1. Side Menu -> Website -> Node Project"
echo "2. Add Node Project for the Backend (Port 3001)"
echo "3. Point your domains to the respective project folders"
echo "4. Ensure Nginx configuration includes the /api and /uploads proxy rules"
echo "------------------------------------------------"
