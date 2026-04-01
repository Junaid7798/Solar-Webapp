<div align="center">

# Asrar Solar — Webapp & Admin Dashboard

**A complete solar energy business platform — from customer-facing website to full ERP admin dashboard.**

Built for solar installation companies in Maharashtra, India to manage leads, quotations, projects, inventory, AMC contracts, and finances — all from one place.

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## Table of Contents

- [What Is This?](#what-is-this)
- [Who Is This For?](#who-is-this-for)
- [Features](#features)
  - [Public Website](#public-website)
  - [Admin Dashboard (ERP)](#admin-dashboard-erp)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Internationalization](#internationalization)
- [Architecture Decisions](#architecture-decisions)
- [License](#license)

---

## What Is This?

Asrar Solar is a **full-stack web application** for a solar energy installation business. It has two parts:

1. **A public-facing landing page** — designed to convert visitors into leads through compelling visuals, an interactive solar calculator, and a multi-step quote request form.

2. **A private admin dashboard** — a complete business management tool (ERP) for tracking leads, creating quotations, managing installation projects, monitoring finances, handling AMC contracts, tracking inventory, and more.

The app is designed for **real-world use** by a small solar business in Maharashtra, India, with support for English, Hindi, and Marathi.

---

## Who Is This For?

| User | How They Use It |
|------|----------------|
| **Solar business owners** | Manage their entire operation from one dashboard — leads, projects, finances, inventory |
| **Sales teams** | Track leads from Google Sheets, generate quotations, follow up via WhatsApp |
| **Installation teams** | Track project stages from survey to handover, log expenses per project |
| **Customers (public)** | Calculate solar savings, request quotes, view project gallery and testimonials |
| **Developers** | Learn how to build a production React + TypeScript app with Vite, Tailwind, and real-world patterns |

---

## Features

### Public Website

#### Hero Section
- Animated aurora gradient background with parallax mouse tracking
- Twinkling star field (80 animated stars)
- Smooth scroll navigation with active section tracking
- Animated gradient text and magnetic CTA buttons

#### Services Section
- 6 interactive service cards with 3D tilt effect on hover
- Bento grid layout (2-column featured cards)
- Services: Installation, Maintenance, Inverter, Battery, AMC, Commercial

#### Brands & Partners
- Featured Luminous Solar authorized distributor badge
- Animated marquee of partner brands (Tata Solar, Havells, Livguard, Waaree, Vikram Solar, Adani Solar)
- Spotlight hover effect on featured brand card

#### About Section
- Founder quote card
- Animated stat counters (500+ families, 98% satisfaction, 3+ years, 2500+ kW)
- Feature grid with hover animations
- Visual banner image with hover zoom
- Certifications marquee strip (MNRE, MSEDCL, ISO, MEDA, PM Surya Ghar)

#### Visual Proof / Gallery
- Before/after installation showcase
- Filterable project gallery (All, Residential, Commercial, Testimony)
- Verified testimony badges with star ratings
- Hover reveal animations with category labels

#### Solar Calculator
- **Interactive savings calculator** with residential/commercial toggle
- Monthly bill slider (₹1,000 - ₹50,000)
- Roof area slider (100 - 5,000 sq.ft)
- Single-phase / Three-phase selector
- Calculates: recommended system size, monthly savings, panel count, roof needed, base cost, subsidy, final cost, payback period, CO₂ offset, trees equivalent
- Receipt-style results display with dashed borders
- Subsidy calculation per latest central/state policy guidelines
- Direct CTA to quote form

#### Quote Request Form
- **2-step multi-step form** with progress indicator
- Step 1: Name, Phone (10-digit), Email, City (dropdown), Address
- Step 2: Service type (checkboxes), System size, Roof type, Best time
- Submits to Google Sheets via Apps Script
- Auto-redirects to WhatsApp with pre-filled message
- Animated success state with confetti pattern
- Input validation with error messages and maxLength limits

#### Global UI Elements
- Custom animated cursor (dot + ring) with hover states
- Respects `prefers-reduced-motion` — disabled for users who prefer reduced motion
- Smart page loader that adapts to actual page load time
- Scroll progress bar in navbar
- Sticky floating WhatsApp button with pulse animation
- Responsive mobile menu with staggered animations
- Language switcher (English / Hindi / Marathi)

#### Footer
- Business contact info, quick links, certifications
- Animated link hover effects

---

### Admin Dashboard (ERP)

#### Authentication
- Password-protected login (configured via environment variable)
- 8-hour session persistence via sessionStorage
- Rate limiting: 5 failed attempts → 15-minute lockout
- Dev-only bypass button (tree-shaken in production builds)

#### Dashboard Overview
- **6 stat cards** with animated counters: Total Leads, This Week, Capacity, Profit, Rating, AMC count
- Revenue trend chart (Recharts AreaChart)
- Service distribution bar chart
- Priority projects with progress bars
- Recent activity feed (from lead submissions)
- Visual transformation before/after slider
- Recent testimony photo grid

#### Leads Management
- Fetches leads from Google Sheets
- Search, filter, and sort leads
- Lead detail cards with contact info
- Export to CSV
- Lead age indicators (new, recent, older)
- Stats: total leads, new this week, conversion metrics

#### Quotations
- Create, view, and manage quotations
- Status tracking: Sent, Accepted,Rejected, Revised
- PDF generation (jsPDF + jspdf-autotable)
- Share via WhatsApp
- Search and filter by status/customer/city
- Delete with confirmation

#### Projects
- Full project lifecycle management
- **7-stage progress tracker**: Site Survey → Material Procurement → Installation → Net Metering → MSEDCL Approval → Subsidy Claim → Handover
- Per-project expense ledger with add/delete
- Financial summary: Project Value, Total Expenses, Net Profit
- Document tracking (Aadhar, Electricity Bill, Property Tax, Site Photos, Net Metering Form)
- Site photo gallery per project
- Search and filter by stage/customer/city
- Avg. margin calculation across projects

#### Inventory
- Stock tracking with categories (Panels, Inverters, Cables, Structures, Accessories)
- Low stock alerts (items below minimum threshold)
- Stock value calculation
- Add new items with category, unit, min stock, price
- Adjust stock levels (add/remove)
- Mobile card view + desktop table view
- Search and filter by category

#### Financial Analytics (Profit Dashboard)
- Revenue vs Expenses area chart
- Expense breakdown pie chart (Labor, Material, Transport, Misc)
- Monthly net profit bar chart
- Key metrics: Total Revenue, Total Expenses, Net Profit, Profit Margin
- Editable finance data (persisted in localStorage)

#### AMC Tracker (Annual Maintenance Contracts)
- Contract management with status: Active, Due Soon, Overdue, Expired
- Stats dashboard: Total, Due This Month, Overdue, Active
- WhatsApp reminder integration — one-click send to customers
- Search and filter by status/customer/contract ID

#### Reminders & Tasks
- Task management for deadlines (MSEDCL Approval, Subsidy Claim, Site Survey)
- Priority levels: High, Medium, Low
- Pending / Completed tabs
- Add new tasks with type, customer, due date, priority
- Mark tasks as completed

#### Gallery Manager
- Upload and manage project photos
- Category organization (Residential, Installation, Maintenance, Testimonials)
- Before/after image management

#### WhatsApp Templates
- Pre-built message templates for common follow-ups
- Quick copy/send functionality

#### Admin Layout
- Collapsible sidebar with section grouping (Core, Operations, Content)
- Responsive bottom navigation for mobile
- Top bar with search and quick actions
- Dark theme throughout with amber accent colors

---

## How It Works

### Customer Journey
```
Visitor lands on website
  → Views services, gallery, testimonials
  → Uses solar calculator to estimate savings
  → Fills out 2-step quote form
  → Form data sent to Google Sheets
  → Auto-redirects to WhatsApp with quote details
  → Admin sees lead in dashboard
```

### Admin Workflow
```
Admin logs in with password
  → Sees dashboard overview (leads, revenue, projects)
  → Reviews new leads from Google Sheets
  → Creates quotation → generates PDF → shares via WhatsApp
  → Creates project → tracks through 7 stages
  → Logs expenses per project → calculates profit
  → Manages inventory → tracks stock levels
  → Sets up AMC contracts → sends reminders
  → Monitors financial analytics
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19 | UI component library |
| **Language** | TypeScript 5.8 | Type safety |
| **Build Tool** | Vite 6 | Fast dev server + optimized builds |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Animations** | Motion (Framer Motion) | Page transitions, scroll animations, 3D effects |
| **Charts** | Recharts | Revenue, expense, service distribution charts |
| **Forms** | React Hook Form | Form validation and state management |
| **PDF** | jsPDF + jspdf-autotable | Quotation PDF generation |
| **Routing** | React Router 7 | Client-side routing |
| **Data Storage** | Google Sheets (via Apps Script) | Lead form submissions |
| **Persistence** | localStorage + sessionStorage | Admin data, session management |
| **Deployment** | Vercel | Hosting + CI/CD |
| **i18n** | Custom context-based | English, Hindi, Marathi translations |

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** (comes with Node.js)
- A **Google Apps Script** web app URL (for lead form submissions)

### Installation

```bash
# Clone the repository
git clone https://github.com/Junaid7798/Solar-Webapp.git
cd Solar-Webapp

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Environment Variables

Edit `.env` with your values:

```env
# Admin dashboard password (required)
# WARNING: This is injected into the client bundle by Vite.
# Treat it as a light gate, not secure authentication.
VITE_ADMIN_PASSWORD=your_secure_password_here

# Google Apps Script URL for lead submissions (required for form)
VITE_GOOGLE_SHEETS_URL=your_google_apps_script_url_here

# Business contact info (optional — defaults provided)
VITE_BUSINESS_NAME=Asrar Solar
VITE_BUSINESS_TAGLINE=Clean rooftop solar for homes, farms, and businesses
VITE_BUSINESS_PHONE=918237655610
VITE_BUSINESS_EMAIL=Junaidk5610@gmail.com
```

### Running Locally

```bash
# Start development server on port 3000
npm run dev

# Open http://localhost:3000 in your browser
# Admin panel: http://localhost:3000/admin
```

---

## Project Structure

```
├── public/
│   └── images/                 # Static images (hero, gallery, products)
├── src/
│   ├── admin/                  # Admin dashboard (ERP)
│   │   ├── auth/               # Login, session management
│   │   ├── hooks/              # usePersistedData (localStorage hook)
│   │   ├── layout/             # Sidebar, TopBar, BottomNav, AdminLayout
│   │   ├── pages/
│   │   │   ├── Dashboard/      # Overview with charts + stats
│   │   │   ├── Leads/          # Google Sheets lead viewer
│   │   │   ├── Quotations/     # Quote management + PDF generation
│   │   │   ├── Projects/       # Project lifecycle + expense tracking
│   │   │   ├── Profit/         # Financial analytics dashboard
│   │   │   ├── AMC/            # Annual Maintenance Contracts
│   │   │   ├── Reminders/      # Task and deadline management
│   │   │   ├── Inventory/      # Stock tracking and alerts
│   │   │   ├── Gallery/        # Photo management
│   │   │   └── Templates/      # WhatsApp message templates
│   │   └── utils/              # PDF generation utilities
│   ├── components/
│   │   ├── common/             # ErrorBoundary, AdminErrorBoundary
│   │   ├── layout/             # Navbar, Footer
│   │   ├── sections/           # Landing page sections
│   │   │   ├── Hero.tsx        # Aurora gradient, parallax, stars
│   │   │   ├── Services.tsx    # 3D tilt service cards
│   │   │   ├── Brands.tsx      # Partner brands marquee
│   │   │   ├── About.tsx       # Stats, features, certifications
│   │   │   ├── VisualProof.tsx # Gallery with before/after
│   │   │   ├── Calculator.tsx  # Solar savings calculator
│   │   │   └── Quote.tsx       # Multi-step lead form
│   │   └── ui/                 # Reusable UI primitives
│   ├── context/                # LanguageContext (i18n)
│   ├── hooks/                  # useTranslation
│   ├── i18n/                   # Translation JSON files (en, hi, mr)
│   ├── lib/                    # Constants, storage utilities, lead processing
│   ├── pages/                  # LandingPage
│   ├── types/                  # Shared TypeScript interfaces
│   ├── App.tsx                 # Router setup
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── .env.example                # Environment variable template
├── .gitignore
├── package.json
├── tsconfig.json
├── vercel.json                 # Vercel deployment config
└── vite.config.ts              # Vite build configuration
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 with hot reload |
| `npm run build` | Create optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Remove the `dist/` directory |

---

## Deployment

This app is configured for **Vercel** deployment.

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables
# - VITE_ADMIN_PASSWORD
# - VITE_GOOGLE_SHEETS_URL
# - VITE_BUSINESS_PHONE
# - VITE_BUSINESS_EMAIL
```

The `vercel.json` configures:
- SPA routing (all routes → `index.html`)
- Static asset caching headers

---

## Internationalization

The app supports **3 languages**:

| Code | Language | Script |
|------|----------|--------|
| `en` | English | Latin |
| `hi` | Hindi | Devanagari |
| `mr` | Marathi | Devanagari |

Translation files are in `src/i18n/`. The language context persists the user's choice and the navbar provides a language switcher.

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **No backend server** | Solo developer, minimal budget. Google Sheets acts as the database. |
| **Vite + React** | Fast HMR, optimized builds, modern tooling. |
| **localStorage for admin data** | No server needed. Data persists across sessions. Trade-off: no multi-device sync. |
| **Client-side auth** | Light gate for 1-2 users on a private device. Not suitable for multi-user production. |
| **Google Sheets as DB** | Free, familiar, accessible. Apps Script handles CORS. |
| **WhatsApp for comms** | Dominant communication channel in India. Pre-filled messages reduce friction. |
| **Tailwind CSS 4** | Utility-first, fast prototyping, minimal CSS overhead. |
| **Recharts** | Declarative React charts, good DX, lightweight. |

---

## License

Proprietary — Asrar Solar. All rights reserved.

---

<div align="center">

**Built with care for Maharashtra's solar future.**

</div>
