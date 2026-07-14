# PropertyX File Structure

propertyX/
├── .gitignore
├── README.md
├── STRUCTURE.md
├── install-commands.sh
├── frontend/
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.js
│   ├── components.json (shadcn)
│   ├── .env.example
│   ├── app/
│   │   ├── layout.tsx (ClerkProvider)
│   │   ├── page.tsx (GSAP luxury landing)
│   │   ├── globals.css (luxury theme)
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   ├── feed/page.tsx (property feed + Leaflet map + filters)
│   │   ├── properties/
│   │   │   ├── [id]/page.tsx (detail + Interested / Book Tour)
│   │   │   └── compare/page.tsx (compare up to 4)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx (sidebar)
│   │   │   ├── page.tsx (overview + role apply RHF)
│   │   │   ├── user/page.tsx (basic info)
│   │   │   ├── agent/page.tsx (revenue Chart.js + commission + email mailto + CRUD)
│   │   │   ├── agency/page.tsx (same + team management)
│   │   │   └── admin/page.tsx (TanStack Table apps + AG Grid properties)
│   │   ├── components/
│   │   │   ├── ui/ (shadcn button, card, input)
│   │   │   ├── landing/ (Navbar, Hero GSAP, Featured GSAP, Stats, Footer)
│   │   │   ├── property/ (PropertyCard, PropertyFilters advanced, MapView Leaflet, CompareBar)
│   │   │   ├── dashboard/ (RevenueChart Chart.js, StatsCards, PropertyTable TanStack)
│   │   │   ├── forms/ (PropertyForm RHF + zod, RoleApplicationForm RHF)
│   │   │   └── shared/
│   │   ├── lib/ (utils cn + formatPrice, api axios)
│   │   ├── hooks/ (custom)
│   │   └── store/ (compareStore Zustand)
│   └── public/images/
│
└── backend/
    ├── package.json
    ├── nest-cli.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        ├── main.ts
        ├── app.module.ts
        ├── common/
        │   ├── guards/roles.guard.ts
        │   └── decorators/roles.decorator.ts + current-user
        └── modules/
            ├── auth/ (sync Clerk -> Mongo)
            ├── users/
            │   └── schemas/user.schema.ts (role: user|seller|agent|agency|admin + revenueHistory)
            ├── properties/
            │   ├── schemas/property.schema.ts (location, coordinates 2dsphere, owner, commission)
            │   ├── dto/ (create/update with validation)
            │   ├── service (advanced filters, geo search, pagination, featured)
            │   └── controller (CRUD + x-user-id header)
            ├── applications/
            │   └── schemas/application.schema.ts (requestedRole, status pending/approved)
            ├── saved/
            │   └── schemas/saved.schema.ts (userId+propertyId unique)
            ├── inquiries/
            │   └── schemas/inquiry.schema.ts (interested/tour + buyer/seller)
            └── analytics/
                └── service (revenue monthly mock + real aggregation)

Mongoose Schemas Summary:

User: clerkId(unique), email, name, phone, address, role enum default user, totalRevenue, totalCommission, revenueHistory[{month,revenue,commission}], companyName, licenseNumber, agentIds

Property: title, description, type enum, listingType, price, bedrooms/bathrooms/area, location{address,city,state,country,zip}, coordinates{lat,lng} 2dsphere index, amenities[], images[], owner ref User, ownerRole, status enum, views, interestedCount, commissionPercent, featured, tags, yearBuilt

Application: userId ref, requestedRole enum agent/agency, fullName, email, phone, companyName, licenseNumber, experience, reason, documents[], status pending/approved/rejected

Saved: userId ref, propertyId ref unique index

Inquiry: propertyId ref, buyerId ref, sellerId ref, type interested/tour, message, phone, email, preferredDate, status

Advanced Features:
- Leaflet map clustering ready
- Chart.js tooltips & interactivity
- GSAP ScrollTrigger parallax
- Zustand compare max 4
- RHF zod validation everywhere
- mailto: on email click opens native client
