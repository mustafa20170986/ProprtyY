# PropertyX - Luxury Full Stack Real Estate Platform

Modern, luxury, responsive real estate platform built with:

**Frontend:** Next.js 14 (App Router), Tailwind, DaisyUI, shadcn/ui, lucide-react, GSAP, Clerk Auth, Chart.js, TanStack Table, AG Grid, Leaflet, React Hook Form, Zustand

**Backend:** NestJS, MongoDB, Mongoose, Clerk SDK, JWT

### Roles
- `user` - default, can browse, save, sell (limited)
- `seller` - CRUD own properties
- `agent` - middleman, commission, revenue dashboard
- `agency` - developer/company, team + revenue
- `admin` - approves role applications, full control

## Installation Commands

### 0. Prerequisites
```bash
node -v # >=18.17
npm -v
# MongoDB running locally or Atlas URI
```

### 1. Clone & Root
```bash
git clone <repo>
cd propertyX
```

### 2. Backend Setup
```bash
cd backend
npm install

# Packages installed:
# @nestjs/core @nestjs/common @nestjs/platform-express @nestjs/mongoose @nestjs/config @nestjs/jwt
# mongoose mongodb
# @clerk/backend
# class-validator class-transformer
# dotenv
# dev: @nestjs/cli typescript ts-node @types/node @types/express

cp .env.example .env
# Edit .env with your MONGO_URI and CLERK_SECRET_KEY

# Dev run
npm run start:dev
# -> http://localhost:4000
# Swagger: http://localhost:4000/api
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Packages:
# next@14 react react-dom
# tailwindcss postcss autoprefixer daisyui
# class-variance-authority clsx tailwind-merge lucide-react
# gsap @gsap/react
# @clerk/nextjs
# chart.js react-chartjs-2
# @tanstack/react-table ag-grid-community ag-grid-react
# leaflet react-leaflet @types/leaflet
# react-hook-form @hookform/resolvers zod
# zustand axios
# shadcn/ui components (button, card, input, etc manually added)

npx tailwindcss init -p
npx shadcn-ui@latest init

cp .env.example .env.local
# Add NEXT_PUBLIC_CLERK_*, NEXT_PUBLIC_API_URL

npm run dev
# -> http://localhost:3000
```

### 4. Environment Variables

**backend/.env**
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/propertyx
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
JWT_SECRET=supersecret
FRONTEND_URL=http://localhost:3000
```

**frontend/.env.local**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/feed
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/feed
```

## File Structure
```
propertyX/
├── frontend/ (Next.js + GSAP landing + dashboards)
└── backend/ (NestJS + Mongoose schemas)
```

## Features Implemented
- GSAP animated luxury landing page (responsive)
- Clerk auth + Get Started -> feed
- Role application with React Hook Form
- Property CRUD (RHF + coordinates)
- Feed with Interested / Book Tour
- Saved properties
- Advanced search + filters + Leaflet map
- Compare properties (Zustand store)
- Dashboards: user, seller, agent (Chart.js revenue), agency, admin (TanStack Table + AG Grid)
