# YatraBato — Nepal Travel Intelligence Platform

Full-stack : **Node.js/Express + SQLite backend** + **React (Vite) frontend**.

Zero MySQL setup — SQLite file is created automatically.

## Quick Start (2 terminals)

### Terminal 1 — Backend
```bash
cd backend-node
npm install
npm start
```
then:
```
Connected to SQLite.
Models synced.
Seeding demo data...
Seed complete.
Demo accounts (password for all = password123):
  admin / moderator / sabin_k / demo
Server running on http://localhost:8080
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```
the URL Vite prints (usually http://localhost:5173)

## Demo accounts (password = `password123` for all)

| Username   | Role      | Use for                          |
|------------|-----------|----------------------------------|
| admin      | ADMIN     | Approve pending places live      |
| moderator  | MODERATOR | Review moderation                |
| sabin_k    | USER      | Normal traveler                  |
| demo       | USER      | Normal traveler                  |


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
