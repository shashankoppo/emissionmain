FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy workspace root manifests first (for caching)
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install all deps
RUN npm install

# Copy all source
COPY . .

# Generate Prisma client
WORKDIR /app/server
RUN npx prisma generate

# Build admin client static files
WORKDIR /app
RUN npm run build --workspace=client

# Build server TypeScript -> dist/
# Use explicit tsc with compatible settings for this Node version
WORKDIR /app/server
RUN npx tsc --outDir dist --target ES2020 --module ESNext --moduleResolution node16 --esModuleInterop true --skipLibCheck true --rootDir src || \
    npx tsc --outDir dist --target ES2020 --module CommonJS --esModuleInterop true --skipLibCheck true --rootDir src || \
    echo "TypeScript build warning - trying tsx fallback"

EXPOSE 3001

# Run DB push (creates/updates tables) then start server
# Fall back to tsx if compiled JS not available
CMD sh -c "npx prisma db push --accept-data-loss && \
    if [ -f dist/index.js ]; then \
    echo 'Starting compiled server...' && node dist/index.js; \
    else \
    echo 'Falling back to tsx...' && npx tsx src/index.ts; \
    fi"
