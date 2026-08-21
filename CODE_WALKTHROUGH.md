# Code Walkthrough — Explain any file to judges / teammates

This is a React + Node monorepo.  
**There are no separate .html or .css pages.**  
In React, **each page is its own `.jsx` file**. Styling is in one global CSS file.

---

## High-level architecture

```
Browser (React)  ←→  http://localhost:8080/api  ←→  Express + SQLite
     ↑                                                      ↑
  pages/ + components/                              models/ + controllers/
```

---

## Backend (`backend-node/`)

| File | What it does (say this to judges) |
|------|-----------------------------------|
| `server.js` | Starts the server, creates tables, seeds demo data |
| `src/app.js` | Express app: CORS, JSON, routes, static uploads |
| `src/config/db.js` | SQLite connection (zero setup for judges) |
| `src/models/User.js` | User table (username, role, password hash) |
| `src/models/Place.js` | Place/listing table + filters (type, difficulty, vehicleAccess JSON…) |
| `src/models/Review.js` | Structured review (6 optional JSON sections) |
| `src/models/Media.js` | Photo metadata |
| `src/models/index.js` | Relationships (Place belongsTo User, Review belongsTo Place…) |
| `src/controllers/authController.js` | Register + Login → JWT |
| `src/controllers/placeController.js` | Search, featured, get one, create place |
| `src/controllers/reviewController.js` | Submit review, get reviews for a place |
| `src/controllers/adminController.js` | Pending list + approve/reject |
| `src/middleware/auth.js` | JWT verification + role check |
| `src/routes/*.js` | Maps URLs to controller functions |

**Key design points you can mention:**
- New places & reviews start as `PENDING` → admin must approve
- `vehicleAccess` is stored as JSON array
- SQLite so judges don’t need MySQL

---

## Frontend (`frontend/src/`)

| File / Folder | Responsibility |
|---------------|----------------|
| `main.jsx` | React entry point, mounts `<App />` |
| `App.jsx` | Router — decides which page to show for each URL |
| `api/client.js` | **All** calls to the backend (axios + JWT header) |
| `context/AuthContext.jsx` | Login state, JWT in localStorage, `useAuth()` hook |
| `styles/global.css` | All styling (one file) |
| `data/constants.js` | Provinces, types, difficulties, seasons (shared constants) |

### Pages (one file = one screen)

| File | Screen |
|------|--------|
| `pages/HomePage.jsx` | Landing + featured places |
| `pages/BrowsePage.jsx` | Search + filters + place grid |
| `pages/PlaceDetailPage.jsx` | Single place + its reviews |
| `pages/AddPlacePage.jsx` | Form to submit a new place |
| `pages/AddReviewPage.jsx` | Form to submit a structured review |
| `pages/LoginPage.jsx` | Login + quick-fill demo buttons |
| `pages/RegisterPage.jsx` | New account |
| `pages/AdminDashboardPage.jsx` | Approve/reject places & reviews |
| `pages/ModerationPage.jsx` | Moderator queue |

### Components (reusable pieces)

| File | Used for |
|------|----------|
| `components/Navbar.jsx` | Top navigation + login/logout |
| `components/PlaceCard.jsx` | Card in the grid |
| `components/FilterSidebar.jsx` | Left-side filters on Browse |
| `components/ReviewSections.jsx` | Renders the 6 review sections |

---

## How a typical request works (good for viva)

1. User opens `/browse`
2. `BrowsePage` calls `searchPlaces()` from `api/client.js`
3. Axios sends `GET /api/places?...` with JWT if logged in
4. Express route → `placeController.search`
5. Sequelize queries SQLite
6. JSON returns → React updates the grid

---

## Auth flow

1. Login → backend returns `{ token, username, role }`
2. Frontend stores them in `localStorage`
3. Every later request adds `Authorization: Bearer <token>`
4. Backend middleware checks the token and attaches `req.user`

---

## What is intentionally simple (you can say this)

- No photo upload UI yet (backend supports it)
- No protected-route redirect (backend still blocks unauthorized calls)
- SQLite instead of MySQL for zero-setup demos

These are acceptable for a college / hackathon demo.
