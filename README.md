# CEBS Club Event Calendar

A centralized event calendar for 12 college clubs at UM-DAE CEBS. Club in-charges submit events through a simple form, clashes are detected automatically, and everyone can view events on an interactive calendar or list.

## Features

- 📅 **Calendar & List Views** — FullCalendar month/week/day + scrollable event list
- 📝 **Easy Event Submission** — Google-Forms-style layout with dropdowns for venues, clubs, audience
- ⚠️ **Clash Detection** — Warns when two events overlap at the same venue (but allows override)
- 🔐 **Passwordless Login** — Magic link sent to college email (no passwords to share!)
- 🛡️ **Bot Protection** — Cloudflare Turnstile CAPTCHA on the submission form
- ✏️ **Secret Edit Links** — Each submitted event gets a unique link for future edits
- 👑 **Admin Panel** — Manage authorized users and all events

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Vanilla HTML/CSS/JS + Bootstrap 5 | Free |
| Calendar | FullCalendar.js v6 | Free |
| Auth | Firebase Auth (email link / password) | Free |
| Database | Cloud Firestore | Free (Spark plan) |
| Hosting | GitHub Pages | Free |
| CAPTCHA | Cloudflare Turnstile | Free |

## Setup Guide

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → name it (e.g., `cebs-calendar`) → disable Analytics → Create
3. Click the **Web** icon (`</>`) to add a web app → register it
4. Copy the Firebase config object and paste it into [`js/firebase-config.js`](js/firebase-config.js), replacing the placeholder values

### 2. Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password** (toggle ON)
3. Also enable **Email link (passwordless sign-in)** under the same section
4. Go to the **Settings** tab → **Authorized domains** → add your domain (e.g., `yourusername.github.io`)

### 3. Create Firestore Database

1. In Firebase Console → **Firestore Database** → **Create database**
2. Select **Start in production mode** → choose a region close to India (e.g., `asia-south1`)
3. Go to the **Rules** tab → paste the contents of [`firestore.rules`](firestore.rules) → Publish

### 4. Seed the First Admin User

In Firebase Console → Firestore → click **Start collection** → collection ID: `authorizedUsers`

Add a document:
- **Document ID**: your college email (e.g., `admin@cbs.ac.in`)
- Fields:
  - `email` (string): `admin@cbs.ac.in`
  - `name` (string): `Your Name`
  - `clubName` (string): `Admin`
  - `role` (string): `admin`

### 5. Update Configuration

Edit [`js/firebase-config.js`](js/firebase-config.js):

```javascript
// Replace these with your actual values:
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "cebs-calendar.firebaseapp.com",
    projectId: "cebs-calendar",
    storageBucket: "cebs-calendar.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

// Set your college email domain:
const ALLOWED_EMAIL_DOMAIN = 'cbs.ac.in';
```

### 6. Set Up Cloudflare Turnstile (Optional)

1. Create a [Cloudflare account](https://dash.cloudflare.com/)
2. Go to **Turnstile** → **Add site**
3. Enter your domain → select **Managed** mode → create
4. Copy the **Site Key** and paste it in `js/firebase-config.js`:
   ```javascript
   const TURNSTILE_SITE_KEY = '0x4AAAAAA...';
   ```

### 7. Deploy to GitHub Pages

```bash
# Create a new repository
git init
git add .
git commit -m "Initial commit - CEBS Event Calendar"
git remote add origin https://github.com/YOUR_USERNAME/cebs-calendar.git
git push -u origin main
```

1. Go to your GitHub repo → **Settings** → **Pages**
2. Source: **Deploy from a branch** → branch: `main`, folder: `/ (root)` → Save
3. Your site will be live at `https://YOUR_USERNAME.github.io/cebs-calendar/`

### 8. Connect a Custom Domain (Optional)

1. Buy a domain (e.g., from [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) or [Namecheap](https://www.namecheap.com/))
2. Add DNS records at your registrar:

   | Type  | Name | Value |
   |-------|------|-------|
   | A     | @    | 185.199.108.153 |
   | A     | @    | 185.199.109.153 |
   | A     | @    | 185.199.110.153 |
   | A     | @    | 185.199.111.153 |
   | CNAME | www  | YOUR_USERNAME.github.io |

3. In GitHub repo Settings → Pages → Custom domain → enter your domain
4. Check **Enforce HTTPS**
5. **Important**: Add your custom domain to Firebase Auth → Settings → Authorized domains

## File Structure

```
├── index.html              ← Public calendar + list view
├── submit.html             ← Event submission form (login required)
├── login.html              ← Passwordless login page
├── admin.html              ← Admin panel (admin only)
├── edit.html               ← Edit event via secret link
├── css/
│   └── style.css           ← All custom styles
├── js/
│   ├── firebase-config.js  ← Firebase config + shared constants
│   ├── auth.js             ← Authentication logic
│   ├── calendar.js         ← Calendar + list view logic
│   ├── submit.js           ← Form submission + clash detection
│   ├── admin.js            ← Admin panel logic
│   └── edit.js             ← Edit event logic
├── firestore.rules         ← Firestore security rules
└── README.md               ← This file
```

## Clubs

Dance · Theatre · Music · Cinematography · Science · Math · Art · Literature · E-Game · Cultural · E-Cell · Alumni Cell

## Adding Club In-Charges

1. Log in as admin → go to **Admin Panel**
2. Click **Add New User**
3. Enter their name, college email, assigned club, and role
4. They can now log in via the magic link or set a password

## Notes

- **Firebase Spark (Free) Plan Limits**: 50K reads/day, 20K writes/day, 5 email links/day. More than enough for college use.
- **Email link limit**: Firebase free tier allows only 5 passwordless email links per day. For more, upgrade to Blaze plan (still free within normal usage). As a workaround, club in-charges can also use email + password login.
- **Clash detection** checks for overlapping time ranges at the **same venue** (including sub-venue like specific room number or auditorium).

## License

MIT — built for UM-DAE CEBS
