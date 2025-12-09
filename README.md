# 📊 MOUNT+PLUS Sales & Expenses Tracker

A modern, full-featured business management system built with Next.js 15, featuring quotations, sales tracking, expense management, and comprehensive financial reporting.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.10.2-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

## ✨ Features

### 📝 Quotations Management
- Create multi-line item quotes with individual pricing
- Convert quotes to job cards with editable details
- Print professional quotations
- Export to Excel and PDF
- Track quote status (Pending/Approved/Rejected)

### 💰 Sales Tracking
- Record sales with customer details
- Track payment types (Cash/Credit/Mobile Money)
- Monitor job status (In Progress/Completed)
- Export sales data to Excel
- Real-time sales analytics

### 💸 Expense Management
- Categorized expense tracking (Fuel, Salaries, Rent, etc.)
- Monthly expense grouping
- Personnel-based expense logging
- Export to Excel and PDF
- Expense breakdown by category

### 📈 Financial Reports
- **Date Range Filtering**: View reports by All Time, 3 Months, 6 Months, or 1 Year
- **Trend Analysis**: Month-over-month comparison with visual indicators
- **Monthly Performance**: Detailed breakdown with profit margins
- **Export Options**: Professional PDF and Excel reports
- **Dynamic Metrics**: Real-time calculation of revenue, expenses, and profit

### 🎯 Dashboard Features
- **Quick Metrics**: Today's sales, monthly expenses, accounts receivable, jobs in progress
- **Business Intelligence**: Top 5 customers, expense breakdown, financial summary
- **Smart Insights**: AI-like recommendations based on your data
- **Recent Transactions**: Quick view of latest activities
- **Visual Indicators**: Color-coded cards with trend arrows

### ⌨️ Keyboard Shortcuts
- `Ctrl+D`: Dashboard
- `Ctrl+Q`: Quotes
- `Ctrl+S`: Sales
- `Ctrl+E`: Expenses
- `Ctrl+R`: Reports
- `?`: Show keyboard shortcuts help

### 🎨 Modern UI/UX
- Excel-like professional design
- Responsive layout for all devices
- Hover effects and smooth transitions
- Color-coded sections for easy navigation
- Dark sidebar with teal accents

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Excel Export**: XLSX
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd MOUNTPLUS-SALES-AND-EXPENSES-TRACKER
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Create and migrate database
npx prisma db push
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 📦 Database Schema

The application uses four main models:

- **Sale**: Customer sales with payment tracking
- **Expense**: Business expenses with categorization
- **Quote**: Multi-item quotations with conversion to jobs
- **Models include**: timestamps, amounts, status tracking, and relationships

## 🌐 Deployment

### Deploy to Cloudflare Pages

1. **Build the project**
```bash
npm run build
```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set build output directory: `.next`
   - Set Node.js version: `18` or higher

3. **Environment Variables**
   - Add `DATABASE_URL` if using external database
   - For SQLite, the database will be included in the build

4. **Deploy**
   - Cloudflare will automatically build and deploy
   - Your app will be live at `your-project.pages.dev`

### Alternative: Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard
│   ├── quotes/            # Quotes page
│   ├── sales/             # Sales page
│   ├── expenses/          # Expenses page
│   └── reports/           # Reports page
├── components/            # React components
│   ├── AddQuoteModal.tsx
│   ├── ConvertToJobModal.tsx
│   ├── QuotesTable.tsx
│   ├── SalesTable.tsx
│   ├── ExpensesTable.tsx
│   ├── ReportsClient.tsx
│   ├── QuickInsights.tsx
│   └── KeyboardShortcuts.tsx
├── actions/               # Server actions
│   ├── quotes.ts
│   ├── sales.ts
│   └── expenses.ts
├── lib/                   # Utilities
│   ├── prisma.ts
│   └── export.ts
├── prisma/               # Database
│   └── schema.prisma
└── public/               # Static assets
```

## 🔧 Configuration

### Database

The app is configured to use **PostgreSQL** by default in `prisma/schema.prisma` for production compatibility (Vercel).

For local development, you can:
1. Use a local PostgreSQL instance.
2. OR switch to SQLite temporarily (change `provider = "postgresql"` to `provider = "sqlite"` in `prisma/schema.prisma` and update `DATABASE_URL` to `file:./dev.db`). **Note: Do not commit SQLite configuration if deploying to Vercel.**

To deploy to Vercel:
1. Create a Postgres database (Vercel Postgres, Neon, Supabase).
2. Set `DATABASE_URL` in Vercel Environment Variables.
3. Run `npx prisma db push` (or let the build script handle generation, and run migrations manually or via a command).

### Customization

- **Logo**: Replace `public/logo.png` with your company logo
- **Colors**: Edit TailwindCSS classes in components
- **Company Name**: Update throughout the codebase (search for "MOUNT+PLUS")

## 📊 Features Roadmap

- [x] Quotations with multi-line items
- [x] Sales and expense tracking
- [x] Financial reports with filtering
- [x] Export to Excel and PDF
- [x] Keyboard shortcuts
- [x] Smart insights
- [ ] User authentication
- [ ] Multi-user support
- [ ] Invoice generation
- [ ] Email notifications
- [ ] Advanced analytics charts
- [ ] Mobile app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components inspired by Microsoft Excel
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for MOUNT+PLUS**
