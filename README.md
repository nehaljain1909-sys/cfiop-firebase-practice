# Firebase + React Practice

A minimal standalone project proving out a **Firebase Authentication + Firestore**
integration with a **Vite + React** app. Not related to / not themed after any
other codebase — this is purely an integration exercise.

## What it does

- Email/password signup and login (Firebase Authentication)
- Once logged in, a shared Firestore collection (`items`) that any logged-in
  user can read from and write to in real time (via `onSnapshot`)

## Tech

- Vite + React
- `firebase` JS SDK (Auth + Firestore)

## 1. Create your Firebase project (one-time, manual)

1. Go to https://console.firebase.google.com and create a new project
   (e.g. `cfiop-practice`).
2. In the project, go to **Build → Authentication → Get started**, enable the
   **Email/Password** sign-in provider.
3. Go to **Build → Firestore Database → Create database**, start in
   **test mode** for this practice project (or set the rules below).
4. Go to **Project settings → General → Your apps**, click the web icon
   (`</>`) to register a web app, and copy the config values shown
   (`apiKey`, `authDomain`, `projectId`, `storageBucket`,
   `messagingSenderId`, `appId`).

### Recommended Firestore rules for this demo

Since this is a shared list gated only by "must be logged in":

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 2. Configure your local `.env`

Copy the example file and fill in the values from step 1.4:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

`.env` is already in `.gitignore` — it will never be committed. Only
`.env.example` (with blank values) is checked in.

> Note: Firebase web config values are not treated as secret in the
> traditional sense (they're visible in any deployed site's JS bundle), but
> keeping them in `.env` and out of git is still good practice and is what
> this exercise asks for — it also means you don't accidentally publish a
> project ID/API key combo you don't intend to.

## 3. Install and run

```bash
npm install
npm run dev
```

Open the printed local URL, sign up with any email/password (6+ characters),
then add and view items in the shared list.

## 4. Build for production / deploy

```bash
npm run build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages,
Firebase Hosting). Set the same `VITE_FIREBASE_*` environment variables in
your host's dashboard (not in a committed file).

## Project structure

```
src/
  firebase.js        Firebase app/auth/db initialization (reads .env)
  AuthContext.jsx     React context: current user + signup/login/logout
  AuthForm.jsx        Login/signup form
  ItemsList.jsx        Shared Firestore list (add + live view)
  App.jsx              Wires auth state to AuthForm or ItemsList
```
