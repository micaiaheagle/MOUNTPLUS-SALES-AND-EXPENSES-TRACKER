# 🚀 Deploy to Vercel (Recommended for Next.js)

Vercel is the best platform for Next.js applications with full support for App Router, Server Actions, and all modern features.

## ⚡ Quick Deploy

### Option 1: One-Click Deploy

1. **Go to Vercel**
   - Visit: https://vercel.com/new

2. **Import Git Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository: `MOUNTPLUS-SALES-AND-EXPENSES-TRACKER`

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

4. **Environment Variables**
   - Add: `DATABASE_URL` = `file:./dev.db`
   - (For production, consider using Vercel Postgres or external DB)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? mountplus-tracker
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

## ✅ Advantages of Vercel

- ✅ **Native Next.js Support**: Built by the Next.js team
- ✅ **Server Actions**: Full support out of the box
- ✅ **App Router**: Complete compatibility
- ✅ **Edge Functions**: Automatic optimization
- ✅ **Automatic HTTPS**: SSL certificates included
- ✅ **Preview Deployments**: Every PR gets a preview URL
- ✅ **Analytics**: Built-in performance monitoring
- ✅ **Zero Configuration**: Works immediately

## 🔄 Continuous Deployment

Once connected:
- Every push to `main` → Production deployment
- Every PR → Preview deployment
- Automatic rollbacks if needed

## 🗄️ Database Options

### For Production:

1. **Vercel Postgres** (Recommended)
   ```bash
   # In Vercel dashboard
   # Storage → Create Database → Postgres
   # Copy connection string to DATABASE_URL
   ```

2. **Neon** (Serverless Postgres)
   - Visit: https://neon.tech
   - Create free database
   - Copy connection string

3. **PlanetScale** (MySQL)
   - Visit: https://planetscale.com
   - Create database
   - Update Prisma schema for MySQL

4. **Supabase** (Postgres)
   - Visit: https://supabase.com
   - Create project
   - Use connection string

### Update DATABASE_URL:

In Vercel dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add/Update `DATABASE_URL` with your production database
4. Redeploy

## 🎯 Post-Deployment

After successful deployment:

1. **Run Migrations**
   ```bash
   # If using external database
   npx prisma db push
   ```

2. **Test All Features**
   - Create quotes
   - Record sales
   - Add expenses
   - Generate reports
   - Export to Excel/PDF

3. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration

## 📊 Monitoring

Vercel provides:
- Real-time logs
- Performance analytics
- Error tracking
- Deployment history

Access at: https://vercel.com/dashboard

## 💰 Pricing

- **Hobby Plan**: FREE
  - Perfect for personal projects
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS

- **Pro Plan**: $20/month
  - For production apps
  - More bandwidth
  - Team collaboration
  - Priority support

## 🔄 Migrate from Cloudflare

If you already deployed to Cloudflare:

1. Keep Cloudflare project (or delete it)
2. Deploy to Vercel using steps above
3. Update any DNS/domain settings
4. Vercel URL becomes your primary deployment

## 🆘 Troubleshooting

### Build Fails

**Check build logs in Vercel dashboard**
- Usually shows exact error
- Most issues are environment variable related

### Database Connection Issues

**Verify DATABASE_URL**
```bash
# Test locally first
npm run build
```

### Prisma Issues

**Regenerate client**
```bash
npx prisma generate
git add .
git commit -m "Regenerate Prisma client"
git push
```

## 🎉 Success!

Your app should now be live at:
- **Production**: `https://your-project.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (if configured)

Vercel is the recommended platform for Next.js applications!

---

**Need help?** Check Vercel docs: https://vercel.com/docs
