# 🐙 GitHub Setup Guide

Follow these steps to push your project to GitHub and prepare for deployment.

## 📝 Step-by-Step Instructions

### 1. Stop Development Server

Before building, stop the development server:
- Press `Ctrl+C` in the terminal running `npm run dev`

### 2. Test Build Locally

```bash
npm run build
```

This will:
- Generate Prisma client
- Build the Next.js application
- Check for any errors

If successful, you'll see:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### 3. Initialize Git (if not already done)

```bash
git init
```

### 4. Review Files to Commit

Check what will be committed:
```bash
git status
```

You should see:
- ✅ Source code files
- ✅ package.json and package-lock.json
- ✅ README.md
- ✅ .env.example
- ❌ node_modules (excluded by .gitignore)
- ❌ .next (excluded by .gitignore)
- ❌ .env (excluded by .gitignore)
- ❌ prisma/dev.db (excluded by .gitignore)

### 5. Stage All Files

```bash
git add .
```

### 6. Create Initial Commit

```bash
git commit -m "Initial commit: MOUNT+PLUS Sales & Expenses Tracker

Features:
- Quotations with multi-line items
- Sales and expense tracking
- Financial reports with date filtering
- Export to Excel and PDF
- Smart insights dashboard
- Keyboard shortcuts
- Modern Excel-like UI"
```

### 7. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Fill in:
   - **Repository name**: `mountplus-tracker` (or your preferred name)
   - **Description**: `Modern business management system with quotations, sales tracking, and financial reporting`
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have one)
3. Click **"Create repository"**

### 8. Connect to GitHub

Copy the commands from GitHub (they'll look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values.

### 9. Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files
3. README.md should be displayed at the bottom

## 🎯 What Gets Committed

### ✅ Included Files
- All source code (`app/`, `components/`, `actions/`, `lib/`)
- Configuration files (`package.json`, `tsconfig.json`, `tailwind.config.ts`)
- Prisma schema (`prisma/schema.prisma`)
- Documentation (`README.md`, `DEPLOYMENT.md`, `.env.example`)
- Public assets (`public/`)

### ❌ Excluded Files (via .gitignore)
- `node_modules/` - Dependencies (will be installed on deployment)
- `.next/` - Build output (will be generated on deployment)
- `.env` - Environment variables (sensitive data)
- `prisma/dev.db` - Local database (will be created on deployment)
- IDE files (`.vscode/`, `.idea/`)

## 🔄 Future Updates

After making changes:

```bash
# Check what changed
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add: description of your changes"

# Push to GitHub
git push origin main
```

## 🌟 Repository Settings (Recommended)

### Add Topics
In GitHub repository settings, add topics:
- `nextjs`
- `typescript`
- `prisma`
- `tailwindcss`
- `business-management`
- `sales-tracking`
- `expense-tracker`

### Add Description
```
Modern business management system built with Next.js 15, featuring quotations, sales tracking, expense management, and comprehensive financial reporting with Excel/PDF export.
```

### Enable Issues
- Go to Settings → Features
- Enable "Issues" for bug reports and feature requests

## 📋 Pre-Deployment Checklist

Before deploying to Cloudflare:

- [ ] All files committed to GitHub
- [ ] README.md is complete and accurate
- [ ] .env.example is included (but not .env)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No sensitive data in repository
- [ ] Database file (.db) is not committed
- [ ] All dependencies are in package.json

## 🚀 Next Steps

After pushing to GitHub:
1. Follow `DEPLOYMENT.md` for Cloudflare deployment
2. Set up environment variables in Cloudflare
3. Configure custom domain (optional)
4. Test the deployed application

## ⚠️ Important Notes

### Database Considerations
- SQLite database (`dev.db`) is NOT committed to GitHub
- On deployment, you'll need to:
  - Use Cloudflare D1 (SQLite on edge), OR
  - Use external database (PostgreSQL, MySQL)
  - Run `npx prisma db push` to create tables

### Environment Variables
- Never commit `.env` file
- Always use `.env.example` as template
- Set environment variables in Cloudflare dashboard

### Security
- Review all files before committing
- Don't commit API keys or passwords
- Use GitHub secrets for sensitive CI/CD data

## 🆘 Troubleshooting

### "Permission denied" error
```bash
# Check if you have write access to the repository
git remote -v

# If wrong URL, update it
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### "Authentication failed"
- Use GitHub Personal Access Token instead of password
- Generate token at: Settings → Developer settings → Personal access tokens
- Use token as password when prompted

### Large files error
```bash
# Check file sizes
git ls-files -z | xargs -0 du -h | sort -h

# If database file is too large, ensure it's in .gitignore
echo "prisma/*.db" >> .gitignore
git rm --cached prisma/dev.db
git commit -m "Remove database file"
```

## ✅ Success Indicators

You've successfully set up GitHub when:
- ✅ Repository is visible on GitHub
- ✅ All source files are present
- ✅ README displays correctly
- ✅ No sensitive data is exposed
- ✅ Build badge shows passing (if CI/CD configured)

---

**Ready to deploy?** Continue with `DEPLOYMENT.md` for Cloudflare Pages setup!
