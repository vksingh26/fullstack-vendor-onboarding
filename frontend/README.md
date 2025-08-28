# Vendor Onboarding Frontend - Vue 3 + TypeScript + Vite

This is the frontend application for the Vendor Onboarding portal built with Vue 3 using TypeScript and Vite.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## How to Run

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or with yarn:
   ```
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   ```
   or with yarn:
   ```
   yarn dev
   ```

4. For production, build and preview:
   ```
   npm run build
   npm run preview
   ```
   or with yarn:
   ```
   yarn build
   yarn preview
   ```

## Changing the Backend

The application can work with either the Java or Node.js backend. To change which backend is used:

1. Open the file `src/services/VendorService.ts`
2. Locate the following line:
   ```typescript
   const useNodeBackend = true; // Set to true if using Node backend, false for Java backend
   ```
3. Change the value to:
   - `true` to use the Node.js backend (running on port 3000)
   - `false` to use the Java backend (running on port 3001)
4. Save the file and refresh your application

## Backend URLs

The backend URLs are configured in the `VendorService.ts` file:
- Node.js backend: http://localhost:3000/api
- Java backend: http://localhost:3001/api

Make sure the corresponding backend server is running before trying to use the frontend application.

## Running Tests

To run the tests:
```
npm run test
```

For watch mode:
```
npm run test:watch
```

For coverage report:
```
npm run test:coverage
```
