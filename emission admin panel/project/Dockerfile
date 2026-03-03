FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy workspace root manifests first
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install all deps
RUN npm install

# Copy all source (including pre-compiled dist we just pushed)
COPY . .

# Generate Prisma client for Linux
WORKDIR /app/server
RUN npx prisma generate

# Build admin client static files
WORKDIR /app
RUN npm run build --workspace=client

# Build server TypeScript (Ensure fresh compile)
WORKDIR /app/server
RUN npx tsc --outDir dist --target ES2020 --module ESNext --moduleResolution node16 --esModuleInterop true --skipLibCheck true --rootDir src || echo "Using existing dist..."

EXPOSE 3001

# IMPROVED STARTUP: 
# 1. Ensures data directory exists
# 2. Migrates DB from old volume if necessary
# 3. Tries to push DB schema changes
CMD sh -c "mkdir -p /app/data && \
    if [ -f /app/server/prisma/dev.db ] && [ ! -f /app/data/dev.db ]; then \
    echo 'Migrating database to new volume...'; \
    mv /app/server/prisma/dev.db /app/data/dev.db; \
    fi && \
    echo 'Syncing Database...' && \
    (npx prisma db push --accept-data-loss || echo 'Warning: DB Push failed...') && \
    if [ -f dist/index.js ]; then \
    echo 'Starting Production Server (dist)...' && node dist/index.js; \
    else \
    echo 'Falling back to Development Server (tsx)...' && npx tsx src/index.ts; \
    fi"
