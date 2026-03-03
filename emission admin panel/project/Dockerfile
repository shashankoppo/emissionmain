FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy workspace root
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN npm install

COPY . .

# Generate Prisma client
WORKDIR /app/server
RUN npx prisma generate

# Build admin client
WORKDIR /app
RUN npm run build --workspace=client

# Build server
RUN npm run build --workspace=server

# Run migrations + seed + start
WORKDIR /app/server
EXPOSE 3001

CMD sh -c "npx prisma db push --accept-data-loss && node dist/index.js"
