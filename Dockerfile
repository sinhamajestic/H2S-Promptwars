# Build client
FROM node:20-alpine AS build-client
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm install
COPY client/ ./client/
RUN npm run build --workspace=client

# Build server
FROM node:20-alpine AS build-server
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm install
COPY server/ ./server/
RUN npm run build --workspace=server

# Production image
FROM node:20-alpine
WORKDIR /app

# Copy package files to install production dependencies
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --omit=dev --workspace=server

# Copy compiled files
COPY --from=build-server /app/server/dist ./server/dist
COPY --from=build-client /app/client/dist ./client/dist

# Ensure the server can run
EXPOSE 8787
ENV PORT=8787
ENV NODE_ENV=production

# Start server
CMD ["node", "server/dist/index.js"]
