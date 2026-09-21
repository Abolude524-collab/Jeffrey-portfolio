# 📊 Jeffrey Usman — Data Analyst Portfolio & CMS

A high-performance, full-stack Data Analytics Portfolio & Content Management System (CMS) built with **Next.js 14**, **Prisma ORM**, and **Neon Serverless PostgreSQL**.

Designed to showcase real-world SQL, Python, Power BI, and predictive analytics case studies with an executive dark-mode UI, mobile responsiveness, and a dynamic CMS dashboard.

---

## 🚀 Key Features

### 🌐 Public Showcase Site
- **Executive Dark Theme**: Premium glassmorphism design system built with HSL color tokens, emerald accents, and custom micro-animations.
- **Interactive Case Studies**: Rich modal overlays detailing problem statements, datasets, methodology steps, SQL/Python code snippets, key insights, and business impact.
- **Tech Stack Filtering**: Real-time client-side filtering by categories (SQL, Python, Power BI, Predictive Analytics, etc.).
- **Interactive Contact Form**: Instant inquiry submission connected directly to the database.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile browsers with responsive layouts.

### 🛡️ Admin CMS Portal (`/admin`)
- **Secure Authentication**: JWT-based authentication with `jose`, `bcryptjs`, and HttpOnly secure session cookies.
- **Projects Management**: Create, edit, feature, publish/draft, and delete case studies with image uploads via Cloudinary.
- **Unread Messages Counter**: Live unread badge indicator in the sidebar navigation for incoming client inquiries.
- **Skills & Experience**: Manage technical competencies, proficiency scores, and work timeline records.
- **Certifications**: Showcase verified professional licenses (Google, Microsoft Power BI, DataCamp).
- **Profile & Bio Controls**: Update contact details, headshot, social URLs, and downloadable resume.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Glassmorphism, Lucide Icons
- **Database**: [Neon PostgreSQL](https://neon.tech/) (Serverless PostgreSQL with connection pooling)
- **ORM**: [Prisma ORM 5](https://www.prisma.io/)
- **Authentication**: JWT (`jose`), `bcryptjs`, Secure HttpOnly Cookies
- **Media Uploads**: Cloudinary SDK
- **Testing**: Vitest

---

## 📁 Project Architecture

```
Jeffs Portfoloi/
├── frontend/
│   ├── app/
│   │   ├── admin/                # Admin CMS Pages (Projects, Skills, Messages, etc.)
│   │   │   ├── certifications/
│   │   │   ├── experience/
│   │   │   ├── login/
│   │   │   ├── messages/
│   │   │   ├── profile/
│   │   │   ├── projects/
│   │   │   └── skills/
│   │   ├── api/                  # Next.js API Routes (Auth, Admin CRUD, Contact)
│   │   │   ├── admin/
│   │   │   └── auth/
│   │   ├── projects/             # Public Case Study pages
│   │   └── page.tsx              # Main Portfolio Homepage
│   ├── components/
│   │   ├── admin/                # Admin Sidebar & Header components
│   │   ├── layout/               # Navbar & Footer components
│   │   ├── ContactForm.tsx
│   │   ├── PortfolioGrid.tsx
│   │   └── CaseStudyModal.tsx
│   ├── lib/
│   │   ├── auth/                 # Session & Auth utility
│   │   └── db/                   # Prisma Client instance
│   ├── prisma/
│   │   ├── schema.prisma         # Database models (Admin, Project, Skill, etc.)
│   │   └── seed.ts               # Database seed script
│   ├── .env.example              # Environment variables template
│   └── package.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Database**: Neon PostgreSQL connection strings (Pooled & Direct)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/jeffrey-wonder06/Jeffrey-portfolio.git
cd "Jeffrey-portfolio/frontend"

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` (and `.env.local`) file inside the `frontend` folder:

```env
# Database Connection Strings (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.us-west-2.aws.neon.tech/neondb?sslmode=require"

# Admin Authentication
ADMIN_EMAIL="jeffreyusman@gmail.com"
ADMIN_PASSWORD="YourSecureAdminPassword123!"
AUTH_SECRET="your-32-character-secret-key-goes-here"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to Neon PostgreSQL
npx prisma db push

# Seed initial admin user, projects, skills, and experience
npx prisma db seed
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Portfolio Site**: `http://localhost:3000`
- **Admin CMS**: `http://localhost:3000/admin`

---

## 🔒 Security Best Practices

1. **HttpOnly Cookies**: Authentication session tokens are stored in secure, HttpOnly cookies to protect against XSS.
2. **Environment Protection**: Connection strings and auth secrets are stored securely in `.env` files and excluded from source control (`.gitignore`).
3. **Password Hashing**: Passwords are encrypted with `bcryptjs` using 10+ salt rounds.

---

## 👤 Author

**Jeffrey Usman** — Data Analyst & Analytics Consultant
- **LinkedIn**: [Jeffrey Usman](https://www.linkedin.com/in/jeffrey-usman-a0b953352)
- **GitHub**: [@jeffrey-wonder06](https://github.com/jeffrey-wonder06)

---

Used Next.js 14, TypeScript, Tailwind CSS, Prisma, and Neon DB.
