<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CyberShield Knowledge Hub

The official knowledge repository of the Department Cybersecurity Cell — featuring project showcases, CTF writeups, roadmaps, blogs, career resources, and more.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Frontend Setup](#frontend-setup)
- [Firebase Setup](#firebase-setup)
- [Backend Setup](#backend-setup)
- [Running the App](#running-the-app)
- [Environment Variables Reference](#environment-variables-reference)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Auth | Firebase Authentication (Google + Email/Password) |
| Backend | Node.js, Express 4, TypeScript |
| Database | MongoDB (Mongoose 8) |
| Auth Middleware | Firebase Admin SDK |

---

## Project Structure

```
cysproj/
├── components/          # React UI components
├── contexts/            # AuthContext (Firebase auth state)
├── services/            # firebase.ts (client SDK init)
├── public/demo/         # SVG placeholder images
├── App.tsx
├── index.tsx            # Entry point — wrapped with BrowserRouter + AuthProvider
└── backend/
    ├── config/
    │   └── serviceAccountKey.json   ← you place this here (see Firebase Setup)
    ├── src/
    │   ├── config/      # db.ts (Mongoose), firebase.ts (Admin SDK)
    │   ├── middleware/  # auth.ts (JWT verification)
    │   ├── models/      # User.ts (Mongoose schema)
    │   └── routes/      # auth.ts, health.ts
    ├── .env             ← you create this (copy from .env.example)
    └── package.json
```

---

## Frontend Setup

**Prerequisites:** Node.js ≥ 18

```bash
# 1. Clone the repo
git clone https://github.com/ShudarsanRegmi/CysKnowledgeHub.git
cd CysKnowledgeHub

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

> No `.env` file is needed for the frontend — the Firebase client config is embedded in `services/firebase.ts`.

---

## Firebase Setup

### 1 — Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it (e.g. `dept-website-dev`) → **Create project**

### 2 — Enable Authentication

1. In the left sidebar click **Build → Authentication**
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Enable **Email/Password**:
   - Click **Email/Password** → toggle the first switch **Enable** → **Save**
5. Enable **Google**:
   - Click **Google** → toggle **Enable**
   - Set a **Project support email** (pick your Google account)
   - Click **Save**

### 3 — Add authorised domains

1. Still in **Authentication**, click the **Settings** tab
2. Under **Authorized domains**, confirm `localhost` is present (it is by default)
3. When you deploy, add your production domain here too

### 4 — Register a Web App & copy the config

1. Go to **Project Overview** (home icon) → click the **`</>`** (Web) icon
2. Give it a nickname → click **Register app**
3. Copy the `firebaseConfig` object shown and paste it into `services/firebase.ts`:

```ts
// services/firebase.ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",   // optional
};
```

### 5 — Download a Service Account key (for the backend)

1. Go to **Project Settings** (gear icon) → **Service accounts** tab
2. Click **Generate new private key** → **Generate key**
3. A JSON file will download — rename it to `serviceAccountKey.json`
4. Place it at:

```
backend/config/serviceAccountKey.json
```

> ⚠️ **Never commit this file.** It is already listed in `.gitignore`.

---

## Backend Setup

### 1 — Install MongoDB locally

**Ubuntu/Debian:**
```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start the service
sudo systemctl start mongod
sudo systemctl enable mongod   # auto-start on boot

# Verify it's running
mongosh --eval "db.runCommand({ connectionStatus: 1 })"
```

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Windows:**
Download the MSI installer from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) and follow the wizard. Make sure to install **MongoDB as a service**.

### 2 — Create the backend `.env` file

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and confirm the values:

```env
PORT=5000
NODE_ENV=development

# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/cybershield

# Path to the service account key downloaded in Firebase Setup → Step 5
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json

# Allowed frontend origin for CORS
CLIENT_ORIGIN=http://localhost:5173
```

### 3 — Install backend dependencies

```bash
cd backend
npm install
```

### 4 — Place the service account key

Make sure `backend/config/serviceAccountKey.json` exists (downloaded in **Firebase Setup → Step 5**).

```bash
ls backend/config/serviceAccountKey.json   # should print the path without error
```

### 5 — Start the backend dev server

```bash
cd backend
npm run dev
```

You should see:

```
✅  MongoDB connected
🚀  Server running on port 5000
```

Test the health endpoint:
```bash
curl http://localhost:5000/health
# {"status":"ok","uptime":...,"timestamp":"..."}
```

---

## Running the App

Open **two terminals**:

**Terminal 1 — Frontend:**
```bash
cd cysproj
npm run dev
# → http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
cd cysproj/backend
npm run dev
# → http://localhost:5000
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.  
Click **Sign In** in the top-right navbar to authenticate via Google or Email/Password.

---

## Environment Variables Reference

### Frontend (`services/firebase.ts` — hardcoded, no `.env` needed)

| Key | Description |
|---|---|
| `apiKey` | Firebase Web API key |
| `authDomain` | Firebase auth domain |
| `projectId` | Firebase project ID |
| `storageBucket` | Firebase storage bucket |
| `messagingSenderId` | FCM sender ID |
| `appId` | Firebase app ID |
| `measurementId` | Google Analytics measurement ID (optional) |

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Express server port |
| `NODE_ENV` | `development` | Node environment |
| `MONGO_URI` | `mongodb://localhost:27017/cybershield` | MongoDB connection string |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | `./config/serviceAccountKey.json` | Path to Firebase service account JSON |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

---

## API Endpoints

| Method | Route | Auth required | Description |
|---|---|---|---|
| `GET` | `/health` | No | Server health check |
| `POST` | `/api/auth/login` | Yes (Bearer token) | Upsert user in MongoDB after Firebase sign-in |
| `GET` | `/api/auth/me` | Yes (Bearer token) | Get current user's MongoDB document |

> The `Authorization` header must be `Bearer <Firebase ID token>`. The frontend sends this automatically after sign-in.

---

## Common Issues

| Error | Cause | Fix |
|---|---|---|
| `auth/configuration-not-found` | Sign-in provider not enabled in Firebase Console | Enable Email/Password and/or Google in **Authentication → Sign-in method** |
| `auth/popup-blocked` | Browser blocked the Google popup | Allow popups for `localhost` in browser settings |
| `MongoServerError: connect ECONNREFUSED` | MongoDB not running | Run `sudo systemctl start mongod` |
| `Error: Cannot find module '...serviceAccountKey.json'` | Key file not placed in `backend/config/` | Download and place the key as described in Firebase Setup → Step 5 |
| `403 Forbidden` on `/api/auth/login` | Expired or missing Firebase ID token | Sign out and sign back in to refresh the token |
