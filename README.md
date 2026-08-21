# YatraBato — Nepal Travel Intelligence Platform

Full-stack demo: **Node.js/Express + SQLite backend** + **React (Vite) frontend**.

Zero MySQL setup — SQLite file is created automatically.



### Terminal 1 — Backend
```bash
cd backend-node
npm install
npm start
```
then
```
Connected to SQLite.
Models synced.
Seeding demo data...
Seed complete.
Demo accounts (password for all = password123):
  admin / moderator / sabin_k / demo
Server running on http://localhost:8080
```

forr Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the URL Vite prints (usually http://localhost:5173)

heree we have Demo accounts (password = `password123` for all)

| Username   | Role      | Use for                          |
|------------|-----------|----------------------------------|
| admin      | ADMIN     | Approve pending places live      |
| moderator  | MODERATOR | Review moderation                |
| sabin_k    | USER      | Normal traveler                  |
| demo       | USER      | Normal traveler                  |

## 3-minute demo script for judges

1. Open http://localhost:5173 → Home page with featured places
2. Click **Browse** → try filters (type, difficulty, vehicle access)
3. Click any place → see details + structured reviews
4. **Log in** as `admin` / `password123` (use the quick-fill buttons)
5. Go to **Admin** → approve the pending place **"Panchase Hike"**
6. Go back to Browse → Panchase Hike now appears (refresh if needed)

## Project structure

```
travel-platform/
├── backend-node/          # Express + Sequelize + SQLite
│   ├── server.js          # Entry point + seed
│   ├── src/
│   │   ├── app.js
│   │   ├── config/db.js
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── travel.db          # Created on first run
└── frontend/              # React + Vite
    └── src/
        ├── api/client.js  # All backend calls
        ├── context/       # Auth (JWT)
        ├── pages/         # One file = one page
        ├── components/
        └── styles/
```

## Important notes

- Backend must be running before frontend (API is on :8080)
- Data survives server restarts (SQLite file)
- New places/reviews start as PENDING and need admin approval
