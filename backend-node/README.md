# Vendor Onboarding Backend - Node.js

This is the Node.js TypeScript implementation of the Vendor Onboarding backend API.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## How to Run

1. Navigate to the backend-node directory:
   ```
   cd backend-node
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or with yarn:
   ```
   yarn install
   ```

3. Run the development server (with auto-reload):
   ```
   npm run dev
   ```
   or with yarn:
   ```
   yarn dev
   ```

4. For production, build and run:
   ```
   npm run build
   npm start
   ```
   or with yarn:
   ```
   yarn build
   yarn start
   ```

## API Endpoints

The server runs on port 3000 by default. The following endpoints are available:

- GET `/api/vendors` - Get all vendors
- POST `/api/vendors` - Create a new vendor

## Database

The application uses an SQLite in-memory database which is initialized on startup. The database is not persistent and will reset when the application is restarted.

## Backend Dockerfile (Node + SQLite)
The backend uses a multi-stage Docker build to produce a small, production-ready container while handling native dependencies like SQLite
   1. Builder Stage
      - Base image: node:20-bullseye-slim for a small, Debian-based Node environment.
      - WORKDIR: /app as the working directory.
      - Build tools: Installs compilers and libraries required to compile native Node modules like sqlite3.
      - Dependencies: Copies package.json + package-lock.json and runs npm ci for a reproducible install.
      - SQLite: Forces sqlite3 to compile from source for this container’s architecture.
      - Build app: Copies the source code and runs npm run build (TypeScript → JavaScript).
      - Prune dev dependencies: Removes unnecessary dev packages and clears npm cache to reduce image size.

   2. Runtime Stage
      - Base image: Starts fresh with node:20-bullseye-slim to keep the runtime lightweight.
      - Copy artifacts: Only copies built files (dist), production dependencies (node_modules), and package.json from the builder stage.
      - Data folder: Creates /app/data for storing SQLite files.
      - Expose port: Opens port 3000 for the API.
      - Volume: Declares /app/data as a persistent internal Docker volume, so database files survive container restarts without mapping to a host folder.
      - Start command: Runs npm run start to launch the backend server.
   3. Build and Run
      - docker build -t backend-node ./backend-node
      - docker run -d -p 3000:3000 --name backend-node backend-node
      - Access backend API at http://localhost:3000/api/{endpointName}
      - Health check: http://localhost:3000/health
      - SQLite database files are stored in the container’s internal /app/data volume.
      - Data persists across container restarts even without a host folder mapping.
   4. Why Multi-Stage?
      - Builder stage: Handles compilation, TypeScript build, and native modules.
      - Runtime stage: Only includes production artifacts → smaller, faster, and more secure image.
      - Persistence: SQLite data survives container restarts using a Docker volume.
