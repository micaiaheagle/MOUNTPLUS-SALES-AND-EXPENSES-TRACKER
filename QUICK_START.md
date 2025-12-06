# ⚡ Quick Start Guide

Get your MOUNT+PLUS tracker up and running in 5 minutes!

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma generate
npx prisma db push

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

## 📤 Push to GitHub

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Initialize git
git init
git add .
git commit -m "Initial commit"

# 3. Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## ☁️ Deploy to Cloudflare

1. **Go to** [Cloudflare Pages](https://pages.cloudflare.com/)
2. **Connect** your GitHub repository
3. **Configure:**
   - Build command: `npm run build`
   - Build output: `.next`
   - Node version: `18`
4. **Add environment variable:**
   - `DATABASE_URL` = `file:./dev.db`
5. **Deploy!** 🎉

## 🎯 Key Features

- **Ctrl+D** - Dashboard
- **Ctrl+Q** - Quotes
- **Ctrl+S** - Sales
- **Ctrl+E** - Expenses
- **Ctrl+R** - Reports
- **?** - Show shortcuts

## 📊 First Steps

1. **Create a Quote** - Go to Quotes → New Quote
2. **Convert to Job** - Click "Convert to Job" on any quote
3. **Record Expenses** - Go to Expenses → Record Cost
4. **View Reports** - Check Reports page for insights
5. **Export Data** - Use Excel/PDF buttons on any page

## 🔧 Configuration

### Change Company Name
Search and replace "MOUNT+PLUS" in:
- `README.md`
- `components/*.tsx`
- `app/layout.tsx`

### Add Logo
Replace `public/logo.png` with your logo (recommended: 200x200px)

### Customize Colors
Edit TailwindCSS classes:
- Primary: `bg-[#217346]` (green)
- Secondary: `bg-blue-600` (blue)
- Danger: `bg-red-600` (red)

## 📚 Documentation

- **Full Setup**: See `README.md`
- **GitHub Guide**: See `GITHUB_SETUP.md`
- **Deployment**: See `DEPLOYMENT.md`

## 🆘 Quick Troubleshooting

### Build fails?
```bash
# Stop dev server first
# Then run:
npm run build
```

### Database issues?
```bash
npx prisma generate
npx prisma db push
```

### Port already in use?
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

## ✅ Checklist

Before deploying:
- [ ] Build succeeds locally
- [ ] All features tested
- [ ] No .env file in git
- [ ] README updated
- [ ] Database schema is correct

---

**Need more help?** Check the full documentation files or open an issue on GitHub!
