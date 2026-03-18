# 🚀 SENTINEL ZERO - DEPLOYMENT GUIDE

## Production-Ready Checklist

### ✅ Pre-Deployment

- [x] Next.js 14+ configured with TypeScript
- [x] All dependencies installed
- [x] Build succeeds without errors
- [x] Components styled with TailwindCSS
- [x] API routes tested locally
- [x] Environment variables configured

### 🔧 Environment Setup

Create `.env.local`:
```
OPENROUTER_API_KEY=sk-xxx
NODE_ENV=production
```

Or use `.env.production` for production builds.

---

## Deployment to Vercel (Recommended)

### Step 1: Prepare Repository

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: Sentinel Zero app"
```

### Step 2: Push to GitHub/GitLab

```bash
git branch -M main
git remote add origin https://github.com/yourname/sentinel-zero.git
git push -u origin main
```

### Step 3: Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Option B: Vercel Dashboard**
1. Visit https://vercel.com/new
2. Import GitHub repository
3. Select `sentinel-zero` project
4. Add environment variables:
   - `OPENROUTER_API_KEY=your_key_here`
5. Click Deploy

### Step 4: Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   OPENROUTER_API_KEY = sk-xxx...
   NODE_ENV = production
   ```
3. Apply to Production

### Step 5: Verify Deployment

```bash
# Check deployment status
vercel --prod

# Your site is live at:
# https://your-project.vercel.app
```

---

## Alternative: Docker Deployment

### Build Docker Image

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build & Run

```bash
# Build image
docker build -t sentinel-zero .

# Run container
docker run -p 3000:3000 \
  -e OPENROUTER_API_KEY=sk-xxx... \
  -e NODE_ENV=production \
  sentinel-zero
```

### Deploy to Cloud

**AWS ECS:**
```bash
# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker tag sentinel-zero:latest <account>.dkr.ecr.<region>.amazonaws.com/sentinel-zero:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/sentinel-zero:latest
```

**Google Cloud Run:**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/sentinel-zero
gcloud run deploy sentinel-zero --image gcr.io/PROJECT_ID/sentinel-zero
```

---

## Alternative: Self-Hosted (VPS)

### Prerequisites

- Ubuntu 20.04+ or similar
- Node.js 18+
- Nginx or Apache
- PM2 for process management
- SSL certificate (Let's Encrypt)

### Deploy Steps

```bash
# SSH into server
ssh user@your-vps-ip

# Clone repository
git clone https://github.com/yourname/sentinel-zero.git
cd sentinel-zero

# Install dependencies
npm ci

# Create .env.production
nano .env.production
# Add: OPENROUTER_API_KEY=sk-xxx...
# Add: NODE_ENV=production

# Build application
npm run build

# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name sentinel-zero -- start

# Setup auto-restart
pm2 startup
pm2 save

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/sentinel-zero
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sentinel-zero /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Performance Optimization

### Build Optimization

```bash
# Check bundle size
npm run build
# Analyze: du -sh .next

# Create production bundle analysis
npm install -g next-bundle-analyzer
```

### Caching Strategies

Configure in `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
      ],
    },
    {
      source: '/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ];
}
```

---

## Monitoring & Logging

### Vercel Monitoring

- Real-time logs: `vercel logs`
- Analytics: Vercel Dashboard
- Error tracking: Integrated

### Self-Hosted Monitoring

```bash
# View logs
pm2 logs sentinel-zero

# Monitor processes
pm2 monit

# Setup log rotation
npm install -g pm2-logrotate
pm2 install pm2-logrotate
```

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs

# In sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

---

## Security Checklist

- [x] Environment variables secured (no hardcoded keys)
- [x] CORS headers configured
- [x] Input validation (Zod)
- [x] API rate limiting (configure in production)
- [x] HTTPS enforced
- [x] Security headers set
- [ ] Add authentication if needed
- [ ] Implement rate limiting middleware
- [ ] Regular dependency updates

### Add Rate Limiting

```bash
npm install express-rate-limit next-cors
```

---

## Performance Benchmarks

### Expected Metrics

- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Total Bundle Size**: ~450KB
- **API Response Time**: < 2s (average)
- **Lighthouse Score**: 90+

### Monitor with

- Google PageSpeed Insights
- WebPageTest
- Lighthouse CI
- Vercel Analytics

---

## Rollback Procedure

### Vercel

```bash
# View deployments
vercel deployments

# Promote previous deployment
vercel promote <deployment-url>
```

### Self-Hosted

```bash
# Revert to previous commit
git revert HEAD
npm run build
pm2 reload sentinel-zero
```

---

## Scaling Considerations

### Database (if added)

- Use PostgreSQL or MongoDB
- Connection pooling: PgBouncer or Mongoose
- Caching layer: Redis

### CDN

Configure Vercel's built-in CDN or use:
- Cloudflare
- AWS CloudFront
- Bunny CDN

### Load Balancing

For self-hosted:
- Nginx load balancing
- Docker Swarm
- Kubernetes

---

## Cost Estimation

### Vercel (Recommended)

- **Hobby**: Free tier (5 concurrent functions)
- **Pro**: $20/month (unlimited functions, edge middleware)
- **Enterprise**: Custom pricing

### Self-Hosted VPS

- **DigitalOcean**: $5-20/month
- **Linode**: $5-20/month
- **AWS EC2**: $0.0116-0.1922/hour

---

## Post-Deployment

1. ✅ Test all features in production
2. ✅ Monitor error logs for 24 hours
3. ✅ Set up uptime monitoring (Pingdom, UptimeRobot)
4. ✅ Document production endpoints
5. ✅ Setup automated backups
6. ✅ Configure analytics
7. ✅ Create incident response plan

---

## Support & Troubleshooting

### Common Issues

**Issue: API key not working**
- Verify key is correctly set in environment variables
- Check OpenRouter dashboard for key status
- Ensure key has necessary permissions

**Issue: Slow response times**
- Check OpenRouter status page
- Verify network latency
- Monitor function execution time in Vercel

**Issue: Build fails**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm ci`
- Check for TypeScript errors: `npx tsc --noEmit`

---

For more help:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [OpenRouter Docs](https://openrouter.ai/docs)

