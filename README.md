# Numeo Assessment

This project consists of a React client and a Node.js/Express server.

## Project Structure

- `client/client`: Frontend application (Vite + React)
- `server`: Backend application (Node.js + Express)

## How to Run

### Prerequisites
- Node.js installed
- npm installed

### Server
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   The server will start on the configured port (default is usually 3000 or 5000).

### Client
1. Navigate to the client directory:
   ```bash
   cd client/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Access the application at the URL provided by Vite (usually http://localhost:5173).

## Assumptions and Trade-offs

- **Translation API**: 
  - I was unable to utilize the OpenAI API as it is a paid service.
  - I attempted to set up the Google Cloud Translation API, but encountered payment method issues on Google's end.
  - Consequently, I utilized the free API provided by [MyMemory](https://mymemory.translated.net).
  - **Note**: The MyMemory API was working correctly during development yesterday, but unfortunately, it appears to be unstable or not working as of now. Please be aware of this limitation when testing the translation features.

