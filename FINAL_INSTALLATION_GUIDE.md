# 🚀 Emission Platform - Final Installation Guide (Ubuntu 24.04)

This guide provides the verified steps to install and run the Emission platform using Docker.

## 1. Clean Docker Installation
If you have any existing Docker issues, use the provided cleanup script:
```bash
chmod +x reinstall-docker.sh
./reinstall-docker.sh
newgrp docker
```

## 2. Deploying the Platform
Run these commands in the project root:
```bash
# 1. Pull the latest fixes
git pull origin main

# 2. Build and start the containers
# Ensure you use --build to include the latest Dockerfile/Nginx changes
docker compose up -d --build

# 3. Seed the database (Important for first-time setup)
docker compose exec backend npm run seed
```

## 3. Accessing the Platform
Once running, you can access the platform at these URLs:

| Service | URL | Credentials |
| :--- | :--- | :--- |
| **Customer Website** | `http://<YOUR_IP>/` | (No login required) |
| **Admin Panel** | `http://<YOUR_IP>/admin` | `admin@emission.com` / `admin123` |
| **API / Documentation** | `http://<YOUR_IP>:3001` | - |

## 4. Troubleshooting
- **Backend Restarting?** Ensure `openssl` is installed (handled by the latest Dockerfile).
- **Socket Permissions?** Ensure you ran `newgrp docker` or restarted your terminal.
- **Port Conflicts?** Ensure ports 80 and 3001 are free on your host.

## 5. Maintenance & Migration
- **View Logs**: `docker compose logs -f`
- **Restart**: `docker compose restart`
- **Backup Data**: See [walkthrough.md](file:///C:/Users/Shashank%20patel/.gemini/antigravity/brain/13bcf06e-30a5-4057-93bc-3c1cde6ca6de/walkthrough.md) for volume backup steps.
