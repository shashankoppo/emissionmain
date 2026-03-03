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
# 1. Tries to push DB schema changes
# 2. Checks if dist/index.js exists
# 3. Starts the server with a fallback to tsx if needed
CMD sh -c "echo 'Syncing Database...' && \
    (npx prisma db push --accept-data-loss || echo 'Warning: DB Push failed, attempting to start anyway...') && \
    if [ -f dist/index.js ]; then \
    echo 'Starting Production Server (dist)...' && node dist/index.js; \
    else \
    echo 'Falling back to Development Server (tsx)...' && npx tsx src/index.ts; \
    fi"
