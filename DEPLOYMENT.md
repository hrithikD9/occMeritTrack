# ============================================
# DEPLOYMENT GUIDE - OCC MeritTrack
# ============================================

## 🚀 Ready for Deployment!

All production configurations have been added. Follow these steps:

---

## STEP 1: Push Changes to GitHub

```bash
git add .
git commit -m "Production ready: Add deployment configurations"
git push origin main
```

---

## STEP 2: Deploy Backend to Render

### 2.1 Sign Up & Connect
1. Go to https://render.com
2. Sign up with your GitHub account
3. Click "New +" → "Web Service"
4. Connect to `hrithikD9/occMeritTrack` repository

### 2.2 Configure Service
```
Name: occmerittrack-api
Region: Singapore
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### 2.3 Add Environment Variables
Click "Advanced" → Add these variables:

```
MONGO_URI = (Get from MongoDB Atlas - See Step 3)
JWT_SECRET = (Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
TEACHER_PASSKEY = OCC2026
PORT = 5000
NODE_ENV = production
FRONTEND_URL = https://occmerittrack.vercel.app
```

### 2.4 Deploy
- Click "Create Web Service"
- Wait ~5-10 minutes
- Your backend URL: `https://occmerittrack-api.onrender.com`

### 2.5 Test Backend
Visit: `https://occmerittrack-api.onrender.com/api/health`

---

## STEP 3: Setup MongoDB Atlas

### 3.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub

### 3.2 Create Free Cluster
- Click "Build a Database" → Choose **M0 FREE**
- Region: AWS Mumbai (or closest)
- Cluster Name: `occMeritTrack`
- Click "Create"

### 3.3 Setup Database User
- Database Access → "Add New Database User"
- Username: `occadmin`
- Password: Generate strong password (SAVE IT!)
- Privileges: "Read and write to any database"
- Add User

### 3.4 Setup Network Access
- Network Access → "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Confirm

### 3.5 Get Connection String
1. Database → Click "Connect"
2. "Connect your application"
3. Driver: Node.js
4. Copy connection string:
   ```
   mongodb+srv://occadmin:<password>@occmerittrack.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name before `?`:
   ```
   mongodb+srv://occadmin:YOUR_PASSWORD@occmerittrack.xxxxx.mongodb.net/occmerittrack?retryWrites=true&w=majority
   ```

### 3.6 Update Render
- Go back to Render dashboard
- Your service → Environment → Edit `MONGO_URI`
- Paste the connection string
- Save changes (will trigger re-deploy)

---

## STEP 4: Deploy Frontend to Vercel

### 4.1 Sign Up & Import
1. Go to https://vercel.com
2. Sign up with your GitHub account
3. Click "Add New..." → "Project"
4. Import `hrithikD9/occMeritTrack`

### 4.2 Configure Project
```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4.3 Add Environment Variable
Environment Variables → Add:
```
VITE_API_URL = https://occmerittrack-api.onrender.com/api
```

### 4.4 Deploy
- Click "Deploy"
- Wait ~2-3 minutes
- Your app URL: `https://occmerittrack.vercel.app`

---

## STEP 5: Final Configuration

### 5.1 Update Backend CORS (if needed)
If Vercel assigns a different URL:
1. Go to Render → Your service → Environment
2. Update `FRONTEND_URL` with actual Vercel URL
3. Save (triggers re-deploy)

### 5.2 Test Complete System
1. Visit your Vercel URL
2. Test student login (no passkey needed)
3. Test teacher login (passkey: OCC2026)
4. Add a candidate
5. Check rankings
6. Export CSV

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend deployed and health check returns 200
- [ ] MongoDB connected (check backend logs)
- [ ] Frontend loads without errors
- [ ] Student role works
- [ ] Teacher login works
- [ ] Can add candidates
- [ ] Rankings display correctly
- [ ] Charts work
- [ ] CSV export works
- [ ] Mobile responsive

---

## 🔧 Troubleshooting

### Backend sleeps (Free tier)
- First request may take 30-60 seconds
- Solution: Use a cron job to ping `/api/health` every 14 minutes
- Or: Upgrade to paid plan ($7/month)

### CORS errors
- Verify `FRONTEND_URL` in Render matches Vercel URL exactly
- Check backend logs for blocked origins

### Database connection failed
- Verify IP whitelist includes 0.0.0.0/0
- Check connection string has correct password
- Ensure database name is in the URI

---

## 📊 Your Live URLs

```
Frontend: https://occmerittrack.vercel.app
Backend:  https://occmerittrack-api.onrender.com
API Docs: https://occmerittrack-api.onrender.com/api/health
```

---

## 🎉 Share Your App!

Teacher Access:
- URL: https://occmerittrack.vercel.app
- Select: Teacher
- Passkey: OCC2026

Student Access:
- URL: https://occmerittrack.vercel.app
- Select: Student
- No passkey needed

---

## 📞 Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

**Deployment Date:** March 3, 2026
**Status:** Production Ready ✅
