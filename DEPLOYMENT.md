# Deployment Guide — Railway (Backend) + Vercel (Frontend)

---

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
gh repo create task-management --public --push
# or manually create a repo on github.com and push
```

---

## Step 2 — Deploy Backend to Railway

### 2a. Create Railway project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select your repository
4. When asked for the root directory, set it to **`backend`**

### 2b. Add a PostgreSQL database

1. Inside your Railway project, click **+ New → Database → PostgreSQL**
2. Railway auto-sets `DATABASE_URL` in your backend service — no manual copy needed

### 2c. Set environment variables

In your Railway backend service → **Variables** tab, add:

| Variable | Value |
|---|---|
| `JWT_ACCESS_SECRET` | any long random string |
| `JWT_REFRESH_SECRET` | a different long random string |
| `JWT_ACCESS_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | your Vercel URL (add after Step 3, e.g. `https://your-app.vercel.app`) |

> `DATABASE_URL` is set automatically by Railway — don't add it manually.

### 2d. Get your backend URL

After deploy completes, click **Settings → Networking → Generate Domain**.  
Copy the URL — you'll need it for the frontend. It looks like:  
`https://task-management-backend.up.railway.app`

---

## Step 3 — Deploy Frontend to Vercel

### 3a. Import project

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Framework will be auto-detected as **Next.js**

### 3b. Set environment variables

In the Vercel project settings → **Environment Variables**, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | your Railway backend URL from Step 2d |

### 3c. Deploy

Click **Deploy**. Vercel builds and gives you a live URL like:  
`https://task-management-abc123.vercel.app`

---

## Step 4 — Update FRONTEND_URL on Railway

Go back to Railway → your backend service → Variables, and set:

```
FRONTEND_URL = https://task-management-abc123.vercel.app
```

This is required for CORS to allow requests from your frontend.  
Railway will automatically redeploy after saving.

---

## Step 5 (Optional) — Auto-deploy via GitHub Actions

To enable automatic deployment on every push to `main`:

### Get Railway token
1. Railway → Account Settings → Tokens → Create token
2. Copy the token

### Get Vercel token
1. Vercel → Settings → Tokens → Create token
2. Copy the token

### Add secrets to GitHub
Go to your GitHub repo → Settings → Secrets → Actions → add:

| Secret | Value |
|---|---|
| `RAILWAY_TOKEN` | your Railway token |
| `VERCEL_TOKEN` | your Vercel token |

Now every `git push origin main` auto-deploys both backend and frontend.

---

## Checklist

- [ ] GitHub repo created and code pushed
- [ ] Railway project created with `backend/` as root
- [ ] PostgreSQL plugin added on Railway
- [ ] Railway env vars set (JWT secrets, NODE_ENV)
- [ ] Backend domain generated on Railway
- [ ] Vercel project created with `frontend/` as root
- [ ] `NEXT_PUBLIC_API_URL` set on Vercel to Railway backend URL
- [ ] `FRONTEND_URL` on Railway updated to Vercel URL
- [ ] Both services redeployed and working

---

## Troubleshooting

**Prisma migration fails on Railway**  
→ Make sure `DATABASE_URL` is present in Railway variables (added automatically by the PostgreSQL plugin).

**CORS error in browser**  
→ Make sure `FRONTEND_URL` on Railway exactly matches your Vercel URL (no trailing slash).

**401 errors after login**  
→ Verify `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set on Railway and not empty.

**Build fails on Vercel**  
→ Confirm root directory is set to `frontend`, not the repo root.
