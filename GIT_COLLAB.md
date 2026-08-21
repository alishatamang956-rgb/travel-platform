# Git Collaboration Guide (Hackathon / Time Pressure)

## First time only (one person does this)

```bash
cd travel-platform
git init
git add .
git commit -m "Initial working demo - SQLite + React"
```

Create a private GitHub/GitLab repo, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/travel-platform.git
git branch -M main
git push -u origin main
```

## Teammate joins

```bash
git clone https://github.com/YOUR_USERNAME/travel-platform.git
cd travel-platform
```

Then follow VSCODE_SETUP.md (two terminals, npm install + start).

## Daily workflow under time pressure

1. **Always pull first**
   ```bash
   git pull
   ```

2. **Work on your part** (frontend or backend)

3. **Commit often with clear messages**
   ```bash
   git add .
   git commit -m "Fix: admin approve button now works"
   git push
   ```

4. **If conflict appears**
   - Talk to each other
   - Prefer the version that actually runs
   - `git status` shows the conflicting files
   - Edit the file, remove `<<<<<<<` markers, then:
     ```bash
     git add .
     git commit -m "Resolve conflict in X"
     git push
     ```

## What NOT to commit

Already handled by `.gitignore`:
- `node_modules/`
- `travel.db` (SQLite database)
- `.env` (secrets)
- `dist/` / `build/`
- uploads/

## Split of work suggestion

- Person A → Frontend pages + styling
- Person B → Backend controllers / seed data / API fixes
- Both → Test the full flow together before the demo

Keep commits small and push frequently so neither of you is blocked.
