# 🚀 Deployment Guide

This guide will help you deploy the MOUNT+PLUS Sales & Expenses Tracker to GitHub and Cloudflare Pages.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- ✅ All features are working locally
- ✅ Database is set up and migrations are complete
- ✅ No TypeScript or lint errors
- ✅ Build completes successfully (`npm run build`)
- ✅ Environment variables are configured

## 🐙 Step 1: Push to GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: MOUNT+PLUS Sales & Expenses Tracker"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `mountplus-tracker`)
3. **Do NOT** initialize with README (we already have one)

### 1.3 Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## ☁️ Step 2: Deploy to Cloudflare Pages

### 2.1 Prerequisites

- Cloudflare account (free tier works)
- GitHub repository connected

### 2.2 Create Cloudflare Pages Project

1. **Go to Cloudflare Dashboard**
   - Visit [Cloudflare Pages](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** → **Pages**

2. **Create a New Project**
   - Click **"Create application"**
   - Select **"Pages"** tab
   - Click **"Connect to Git"**

3. **Connect GitHub Repository**
   - Authorize Cloudflare to access your GitHub
   - Select your repository: `mountplus-tracker`

4. **Configure Build Settings**
   ```
   Project name: mountplus-tracker
   Production branch: main
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   Root directory: /
   ```

5. **Environment Variables**
   - Click **"Add variable"**
   - Add: `DATABASE_URL` = `file:./dev.db` (for SQLite)
   - Add: `NODE_VERSION` = `18` or `20`

6. **Deploy**
   - Click **"Save and Deploy"**
   - Wait for build to complete (usually 2-5 minutes)

### 2.3 Important Notes for Cloudflare

#### Database Considerations

**Option A: SQLite (Simple, for small-scale)**
- SQLite database will be included in deployment
- Data persists only during build
- Good for testing/demo purposes
- **Limitation**: Data resets on each deployment

**Option B: External Database (Recommended for Production)**
- Use Cloudflare D1 (SQLite on edge)
- Use PostgreSQL (Neon, Supabase, etc.)
- Use MySQL (PlanetScale, etc.)

To use external database:
1. Update `DATABASE_URL` in Cloudflare environment variables
2. Run migrations: `npx prisma db push` on your database
3. Redeploy

### 2.4 Custom Domain (Optional)

1. In Cloudflare Pages project settings
2. Go to **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Follow DNS configuration instructions

## 🔄 Step 3: Continuous Deployment

Once connected, Cloudflare automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Provides deployment logs and analytics

### Update Your App

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push origin main
```

Cloudflare will automatically rebuild and deploy!

## 🛠️ Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: "Prisma Client not generated"**
- Add build script in `package.json`:
```json
"scripts": {
  "build": "prisma generate && next build"
}
```

### Database Issues

**SQLite not working in production**
- Consider using Cloudflare D1 or external database
- Update `DATABASE_URL` in environment variables

**Migrations needed**
```bash
# Generate migration
npx prisma migrate dev --name init

# Push to database
npx prisma db push
```

### Performance Issues

**Slow page loads**
- Enable Cloudflare caching
- Optimize images with Next.js Image component
- Use static generation where possible

## 📊 Monitoring

### Cloudflare Analytics
- View deployment history
- Monitor traffic and performance
- Check error logs

### Access Logs
1. Go to your Cloudflare Pages project
2. Click on a deployment
3. View **"Build log"** for deployment details
4. Check **"Functions log"** for runtime errors

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use Cloudflare's environment variables for secrets
   - Rotate sensitive credentials regularly

2. **Database Security**
   - Use connection pooling for external databases
   - Enable SSL/TLS for database connections
   - Implement proper access controls

3. **API Security**
   - Validate all inputs
   - Implement rate limiting
   - Use HTTPS only (Cloudflare provides this)

## 🎯 Production Checklist

Before going live:

- [ ] Test all features in production environment
- [ ] Verify database connections
- [ ] Check all export functions (Excel/PDF)
- [ ] Test on mobile devices
- [ ] Set up custom domain
- [ ] Configure SSL certificate (auto with Cloudflare)
- [ ] Set up monitoring/alerts
- [ ] Create backup strategy for database
- [ ] Document any custom configurations
- [ ] Train users on keyboard shortcuts

## 📱 Alternative Deployment Options

### Vercel (Alternative to Cloudflare)

```bash
npm i -g vercel
vercel login
vercel
```

Follow prompts to deploy.

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Deploy

### Docker (Self-hosted)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🆘 Support

If you encounter issues:

1. Check Cloudflare deployment logs
2. Review GitHub Actions (if configured)
3. Consult [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
4. Open an issue on GitHub repository

## 🎉 Success!

Your app should now be live at:
- **Cloudflare**: `https://your-project.pages.dev`
- **Custom Domain**: `https://yourdomain.com` (if configured)

Share your deployment URL and start tracking your business! 🚀

---

**Need help?** Open an issue on GitHub or check the main README.md for more information.
