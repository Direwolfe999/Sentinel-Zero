# 🚀 SENTINEL ZERO - QUICK START

## ⏱️ 5-Minute Setup

### Step 1: Get OpenRouter API Key (2 min)
1. Visit https://openrouter.ai/
2. Sign up (free, no credit card needed)
3. Copy your API key from dashboard

### Step 2: Configure Environment (1 min)
```bash
cd "/home/direwolfe-x/HACKATON PROJECTS/sentinel-zero"
cp .env.local.example .env.local
# Edit .env.local and paste your API key
nano .env.local
```

### Step 3: Run Development Server (2 min)
```bash
npm run dev
# Open http://localhost:3000 in browser
```

---

## 🎯 Testing the App (2 min)

### Finance Mode Test
1. Click "Start Analyzing"
2. Select **Finance** mode
3. Paste this text:
   ```
   "Get guaranteed returns of 50% monthly! 
    No risk, invest now!"
   ```
4. Click "Analyze"
5. **Expected**: HIGH risk badge with scam warning

### Life Mode Test
1. Select **Life** mode
2. Paste this text:
   ```
   "I work 80 hours a week, sleep 4 hours, 
    skip meals, never exercise"
   ```
3. Click "Analyze"
4. **Expected**: HIGH risk with health warning

### Business Mode Test
1. Select **Business** mode
2. Paste this text:
   ```
   "Meetings all day, no time to actual work, 
    constant interruptions"
   ```
3. Click "Analyze"
4. **Expected**: MEDIUM risk with efficiency suggestions

---

## 📦 Deployment (10 min)

### Deploy to Vercel
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_NAME/sentinel-zero
git push -u origin main

# 2. Go to https://vercel.com
# 3. Click "New Project" → Connect GitHub
# 4. Select "sentinel-zero" repository
# 5. In Environment Variables, add:
#    OPENROUTER_API_KEY = sk-xxx...
# 6. Click "Deploy"
```

**Done!** Your app is live at `sentinel-zero.vercel.app`

---

## 🐳 Docker Deployment (Alternative)

```bash
docker build -t sentinel-zero .
docker run -p 3000:3000 \
  -e OPENROUTER_API_KEY=sk-xxx... \
  sentinel-zero
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `/src/app/page.tsx` | Main UI |
| `/src/app/api/analyze/route.ts` | AI endpoint |
| `/src/lib/ai.ts` | AI logic |
| `/src/components/*` | React components |
| `/src/types/index.ts` | TypeScript types |

---

## 🔧 Troubleshooting

### Build fails
```bash
npm install
npm run build
```

### API not responding
- Check `.env.local` has OPENROUTER_API_KEY
- Try fallback mock response (works offline)

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

---

## 📊 Performance

- Build: ~13s
- Bundle: ~450KB
- API Response: < 2s
- First Load: < 3s

---

## 🎯 What's Next?

- ✅ Build successful
- ✅ Deploy to Vercel
- ⬜ Add authentication (optional)
- ⬜ Add database (optional)
- ⬜ Create analytics dashboard (optional)

See [DEPLOYMENT.md](DEPLOYMENT.md) for advanced options.

---

**Ready to demo? You're all set!** 🎉

