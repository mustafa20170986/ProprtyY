#!/bin/bash
# PropertyX Full Stack Setup - Run step by step

# 1. Root setup
echo "Creating root..."
mkdir propertyX && cd propertyX
mkdir frontend backend

# 2. Backend NestJS
cd backend
echo "Installing backend dependencies..."
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express @nestjs/mongoose @nestjs/config @nestjs/jwt @clerk/backend mongoose class-validator class-transformer cors
npm install -D @nestjs/cli @nestjs/schematics typescript ts-node @types/node @types/express

# If using Nest CLI to generate project from scratch:
# npx @nestjs/cli new . --package-manager npm --skip-git

# env
cp .env.example .env
echo "Edit .env then run: npm run start:dev"

cd ..

# 3. Frontend Next.js
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*"

# Install luxury stack
npm install daisyui@latest
npm install class-variance-authority clsx tailwind-merge lucide-react gsap @gsap/react @clerk/nextjs chart.js react-chartjs-2 @tanstack/react-table ag-grid-community ag-grid-react leaflet react-leaflet react-hook-form @hookform/resolvers zod zustand axios

npm install -D @types/leaflet

# shadcn
npx shadcn-ui@latest init -d
npx shadcn-ui@latest add button card input label textarea

# env
cp .env.example .env.local

echo "Run frontend: npm run dev"
cd ..

echo "Done! Backend at :4000 Frontend at :3000"
