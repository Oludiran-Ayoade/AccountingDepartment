# Deployment Guide

This guide covers deploying the Bowen Accounting Department Portal to production.

## Table of Contents
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Railway/Render)](#backend-deployment)
- [Database Setup (MongoDB Atlas)](#database-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for testing)

### 2. Configure Database Access
1. Go to **Database Access**
2. Add a new database user
3. Set username and password (save these!)
4. Grant **Read and Write** permissions

### 3. Configure Network Access
1. Go to **Network Access**
2. Add IP Address
3. Choose **Allow Access from Anywhere** (0.0.0.0/0) for now
4. (In production, restrict to your server IPs)

### 4. Get Connection String
1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `bowen_accounting`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bowen_accounting?retryWrites=true&w=majority
```

---

## Backend Deployment

### Option A: Railway (Recommended)

#### 1. Prepare Your Code
```bash
cd backend

# Create Procfile
echo "web: ./main" > Procfile

# Create railway.json
cat > railway.json << EOF
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "go run main.go",
    "restartPolicyType": "ON_FAILURE"
  }
}
EOF
```

#### 2. Deploy to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Choose the `backend` directory

#### 3. Set Environment Variables
In Railway dashboard, go to **Variables** and add:
```
PORT=8080
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bowen_accounting
DB_NAME=bowen_accounting
JWT_SECRET=your-super-secret-production-key-min-32-chars
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### 4. Get Your Backend URL
Railway will provide a URL like: `https://your-app.railway.app`

### Option B: Render

#### 1. Create render.yaml
```yaml
services:
  - type: web
    name: bowen-accounting-api
    env: go
    buildCommand: go build -o main .
    startCommand: ./main
    envVars:
      - key: PORT
        value: 8080
      - key: MONGODB_URI
        sync: false
      - key: DB_NAME
        value: bowen_accounting
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        sync: false
```

#### 2. Deploy
1. Go to https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect your repository
5. Select `backend` directory
6. Add environment variables
7. Deploy

---

## Frontend Deployment (Vercel)

### 1. Prepare Your Code
```bash
cd frontend

# Update .env.local with production API URL
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app" > .env.production
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Import your repository
5. Select `frontend` directory
6. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Set Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### 4. Redeploy
After adding environment variables, trigger a new deployment.

---

## Environment Variables Summary

### Backend (.env)
```bash
PORT=8080
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bowen_accounting
DB_NAME=bowen_accounting
JWT_SECRET=super-secret-key-minimum-32-characters-long
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (.env.production)
```bash
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

---

## Post-Deployment

### 1. Update CORS Settings
Make sure your backend allows requests from your frontend URL.

In `backend/main.go`, the CORS is already configured to use `FRONTEND_URL` from environment variables.

### 2. Test the Deployment

#### Test Backend
```bash
curl https://your-api.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Bowen Accounting API is running"
}
```

#### Test Frontend
1. Visit `https://your-app.vercel.app`
2. Try registering a new account
3. Try logging in
4. Test all features

### 3. Create First Admin User

#### Option A: MongoDB Atlas Dashboard
1. Go to MongoDB Atlas
2. Click **Browse Collections**
3. Find `bowen_accounting` → `users`
4. Find your user document
5. Edit and change `role` from `"student"` to `"admin"`

#### Option B: MongoDB Shell
```bash
mongosh "mongodb+srv://cluster.mongodb.net/bowen_accounting" --username your-username

db.users.updateOne(
  { email: "admin@bowen.edu.ng" },
  { $set: { role: "admin" } }
)
```

### 4. Set Up Custom Domain (Optional)

#### For Frontend (Vercel)
1. Go to Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain (e.g., `accounting.bowen.edu.ng`)
3. Update DNS records as instructed
4. Wait for SSL certificate to be issued

#### For Backend (Railway)
1. Go to Railway dashboard → **Settings** → **Domains**
2. Add custom domain (e.g., `api.accounting.bowen.edu.ng`)
3. Update DNS records
4. Update `FRONTEND_URL` in backend env vars
5. Update `NEXT_PUBLIC_API_URL` in frontend env vars

---

## Security Checklist

Before going live, ensure:

- [ ] Changed `JWT_SECRET` to a strong random string (min 32 chars)
- [ ] MongoDB Atlas network access is configured properly
- [ ] HTTPS is enabled (automatic with Vercel/Railway)
- [ ] Environment variables are set correctly
- [ ] CORS is configured to allow only your frontend domain
- [ ] Database backups are enabled
- [ ] Error messages don't expose sensitive information
- [ ] Rate limiting is implemented (optional but recommended)

---

## Monitoring & Maintenance

### Vercel
- View deployment logs in Vercel dashboard
- Monitor function invocations and bandwidth
- Set up deployment notifications

### Railway/Render
- View application logs in dashboard
- Monitor CPU and memory usage
- Set up uptime monitoring

### MongoDB Atlas
- Monitor database metrics
- Set up alerts for high usage
- Enable automatic backups

---

## Troubleshooting

### Backend Issues

**Error: Cannot connect to database**
- Check MongoDB Atlas connection string
- Verify database user credentials
- Check network access whitelist

**Error: CORS issues**
- Verify `FRONTEND_URL` matches your actual frontend URL
- Check if frontend is using correct API URL

### Frontend Issues

**Error: API calls failing**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is running and accessible
- Check browser console for CORS errors

**Error: Environment variables not working**
- Redeploy after adding environment variables
- Ensure variables start with `NEXT_PUBLIC_` for client-side access

---

## Rollback Procedure

### Vercel
1. Go to **Deployments**
2. Find the last working deployment
3. Click **⋯** → **Promote to Production**

### Railway
1. Go to **Deployments**
2. Select previous deployment
3. Click **Redeploy**

---

## Cost Estimates

### Free Tier (Suitable for Testing)
- **MongoDB Atlas**: M0 Free (512 MB storage)
- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month credit (enough for small apps)

### Production (Estimated)
- **MongoDB Atlas**: M10 ($0.08/hour) ≈ $57/month
- **Vercel**: Pro ($20/month) for team features
- **Railway**: ~$10-20/month depending on usage

---

## Support

For deployment issues:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

**Your application is now live! 🚀**
