# VS Code Setup & Run Guide (for you + teammate)

## 1. Install these (once)

- **Node.js 18+** → https://nodejs.org (LTS)
- **VS Code** → https://code.visualstudio.com
- Recommended VS Code extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - Thunder Client (optional, for testing API)

## 2. Open the project

1. Unzip `travel-platform.zip`
2. In VS Code: **File → Open Folder** → select the `travel-platform` folder
3. You should see two main folders: `backend-node` and `frontend`

## 3. Run the project (two terminals inside VS Code)

Open the Terminal panel (`Ctrl+`` ` or View → Terminal).

### Terminal 1 — Backend
```bash
cd backend-node
npm install
npm start
```
Leave this running. You need to see “Server running on http://localhost:8080”.

### Terminal 2 — Frontend (click the `+` button in the terminal panel to open a second terminal)
```bash
cd frontend
npm install
npm run dev
```
Click the link that appears (usually http://localhost:5173).

## 4. If something fails

| Problem | Fix |
|---------|-----|
| `Cannot find module 'dotenv'` | Run `npm install` again inside `backend-node` |
| Port 8080 already in use | Kill the old process or change PORT in `.env` |
| Frontend shows “Could not load places” | Backend is not running or wrong port |
| `npm` not recognized | Node.js is not installed or not in PATH |

## 5. Useful VS Code tips

- Click any file in the explorer to open it
- `Ctrl+P` → type filename to jump quickly
- Split editor: right-click a tab → Split
- Search whole project: `Ctrl+Shift+F`

That’s it. Both of you can open the same folder (or clone from Git) and run the two `npm` commands.
