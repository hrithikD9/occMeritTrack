# 🚀 GitHub Push Checklist

Quick reference guide for securely pushing OCC MeritTrack to GitHub.

---

## ✅ Pre-Push Checklist

### 1. **Run Security Check**
```bash
# Windows
check-security.bat

# Linux/Mac
chmod +x check-security.sh
./check-security.sh
```

### 2. **Verify .env Files**
- [ ] `backend/.env` - Contains ACTUAL secrets (NOT committed)
- [ ] `backend/.env.example` - Template only (committed)
- [ ] `.env` - Frontend config (can be committed if no secrets)
- [ ] `.env.example` - Template (committed)

### 3. **Check Git Status**
```bash
git status
```

**Should NOT see:**
- ❌ `.env` files
- ❌ `node_modules/`
- ❌ `dist/` or `build/`
- ❌ `.log` files

---

## 📋 First-Time GitHub Setup

### Step 1: Initialize Repository (if not done)
```bash
cd f:/occMeritTrack
git init
```

### Step 2: Verify .gitignore is Working
```bash
# Add all files
git add .

# Check what will be committed
git status

# If .env appears, remove it:
git rm --cached .env
git rm --cached backend/.env
```

### Step 3: Initial Commit
```bash
git commit -m "Initial commit: OCC MeritTrack - HSC Performance Evaluation System"
```

### Step 4: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name: `occMeritTrack` or `OCC-MeritTrack`
4. **Keep it PRIVATE** (recommended for security)
5. DO NOT initialize with README (you already have one)
6. Click "Create repository"

### Step 5: Link and Push
```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/occMeritTrack.git

# Set default branch
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 🔄 Regular Push Workflow

### Every Time You Push:

```bash
# 1. Check status
git status

# 2. Add changes
git add .

# 3. Run security check
check-security.bat  # or ./check-security.sh

# 4. Commit with descriptive message
git commit -m "Add: feature description"

# 5. Push to GitHub
git push origin main
```

---

## 🚨 If .env Was Accidentally Committed

### Quick Fix (Before Pushing):
```bash
# Undo the commit
git reset HEAD~1

# Remove .env from staging
git rm --cached backend/.env

# Re-commit without .env
git add .
git commit -m "Your commit message"
```

### If Already Pushed:
1. ⚠️ **Immediately rotate ALL credentials**
   - Generate new MongoDB connection string
   - Generate new JWT secret
   - Change teacher passkey

2. **Remove from history:**
   ```bash
   # Remove file from all commits
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all

   # Force push (DANGEROUS - use only if necessary)
   git push origin --force --all
   ```

3. **Better option - Contact GitHub Support**
   - For private repos: Request cache clearing
   - For public repos: Consider repo as compromised

---

## 📁 What Gets Committed

### ✅ YES - Safe to Commit
```
src/
backend/
  controllers/
  models/
  routes/
  middleware/
  utils/
  config/
  server.js
  package.json
  .env.example
  .gitignore
public/
.gitignore
.gitattributes
.env.example
package.json
vite.config.js
index.html
README.md
SECURITY.md
```

### ❌ NO - Never Commit
```
.env
backend/.env
node_modules/
dist/
build/
*.log
.DS_Store
coverage/
```

---

## 🔐 Security Best Practices

### Before Every Push:
- [ ] Run security check script
- [ ] Review `git diff` for secrets
- [ ] Ensure .env files are ignored
- [ ] Check no API keys in code

### Repository Settings:
- [ ] Set repository to **Private**
- [ ] Enable branch protection
- [ ] Require pull request reviews
- [ ] Enable secret scanning (GitHub Advanced Security)

### Code Security:
- [ ] Store secrets in .env files only
- [ ] Use `.env.example` for templates
- [ ] Never hardcode credentials
- [ ] Use environment variables

---

## 🛠️ Useful Git Commands

```bash
# Check what will be committed
git diff --cached

# See all tracked files
git ls-files

# Remove file from git but keep locally
git rm --cached <filename>

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Check remote repository
git remote -v

# Pull latest changes
git pull origin main
```

---

## 📞 Need Help?

- **Git Issues:** Check [Git Documentation](https://git-scm.com/doc)
- **GitHub Issues:** Check [GitHub Docs](https://docs.github.com)
- **Security:** Review [SECURITY.md](./SECURITY.md)

---

## 🎯 Quick Commands Reference

```bash
# Daily workflow
git status                          # Check changes
check-security.bat                  # Security check
git add .                           # Stage changes
git commit -m "message"             # Commit
git push origin main                # Push to GitHub

# First time setup
git init                            # Initialize repo
git remote add origin <url>         # Add remote
git branch -M main                  # Set branch name
git push -u origin main             # Initial push

# Emergency fixes
git rm --cached .env                # Remove .env from git
git reset HEAD~1                    # Undo last commit
```

---

**Remember:** When in doubt, run `check-security.bat` before pushing!
