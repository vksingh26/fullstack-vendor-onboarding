# ---------- Builder stage ----------
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install build tools for native modules
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git python3 make g++ pkg-config libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install all deps for build
RUN npm ci

# Ensure sqlite3 is compiled for this image arch
ENV npm_config_build_from_source=1
RUN npm rebuild sqlite3 --build-from-source

# Copy source and build TS
COPY . .
RUN npm run build

# Prune devDependencies for runtime
RUN npm prune --production && npm cache clean --force

# ---------- Runtime stage ----------
FROM node:20-bullseye-slim AS runtime

WORKDIR /app

# Copy runtime artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Ensure data directory exists for mounted volume
RUN mkdir -p /app/data

EXPOSE 3000

# Persist SQLite data in a volume
VOLUME ["/app/data"]

CMD ["npm", "run", "start"]

