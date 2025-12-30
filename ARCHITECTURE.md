# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                     (http://localhost:3000)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    NEXT.JS FRONTEND                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Pages (App Router)                                    │ │
│  │  - Landing Page (/)                                    │ │
│  │  - Auth (login, register)                              │ │
│  │  - Notes Library (/notes)                              │ │
│  │  - Voting System (/vote)                               │ │
│  │  - Profile (/profile)                                  │ │
│  │  - Admin Dashboard (/admin)                            │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  State Management (Zustand)                            │ │
│  │  - Auth Store (user, token)                            │ │
│  │  - Theme Store (dark/light mode)                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Client (Axios)                                    │ │
│  │  - JWT Token Interceptor                               │ │
│  │  - Error Handler                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ REST API
                           │ (JSON)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    GOLANG BACKEND API                        │
│                  (http://localhost:8080)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Routes                                                │ │
│  │  /api/auth/*     - Authentication                      │ │
│  │  /api/notes/*    - Notes Management                    │ │
│  │  /api/elections/* - Election System                    │ │
│  │  /api/users/*    - User Management                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware                                            │ │
│  │  - JWT Authentication                                  │ │
│  │  - Admin Authorization                                 │ │
│  │  - CORS Handler                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Controllers                                           │ │
│  │  - Auth Controller (register, login)                  │ │
│  │  - Note Controller (CRUD operations)                  │ │
│  │  - Election Controller (vote, results)                │ │
│  │  - User Controller (profile, history)                 │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Utils                                                 │ │
│  │  - JWT Token Generation                                │ │
│  │  - Password Hashing (bcrypt)                           │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ MongoDB Driver
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    MONGODB DATABASE                          │
│                  (mongodb:mongodb+srv://Oludiran-Ayoade:Circumspect1_@newnode.xwu1abo.mongodb.net/?bowen_accounting=true&w=majority&appName=NewNode)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Collections                                           │ │
│  │  - users         (authentication & profiles)           │ │
│  │  - notes         (course materials)                    │ │
│  │  - elections     (voting data)                         │ │
│  │  - votes         (vote records)                        │ │
│  │  - note_downloads (download tracking)                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Registration Flow

```
User Browser
    │
    │ 1. Fill registration form
    │    (email, matric, password)
    ▼
Next.js Frontend
    │
    │ 2. Validate with Zod schema
    │    - Email format (@bowen.edu.ng)
    │    - Matric format (ACC/20/1234)
    │    - Password length (min 8)
    ▼
    │ 3. POST /api/auth/register
    │
Go Backend
    │
    │ 4. Validate request
    │ 5. Check if user exists
    │ 6. Hash password (bcrypt)
    ▼
MongoDB
    │ 7. Insert user document
    │
    ▼ 8. Return user data
Go Backend
    │
    │ 9. Generate JWT token
    │
    ▼ 10. Return token + user
Next.js Frontend
    │
    │ 11. Store in localStorage
    │ 12. Update Zustand store
    │
    ▼ 13. Redirect to /notes
User Browser
```

### 2. Download Note Flow

```
User Browser
    │
    │ 1. Click "Download" button
    ▼
Next.js Frontend
    │
    │ 2. Check authentication
    │ 3. Add JWT to header
    │ 4. POST /api/notes/:id/download
    ▼
Go Backend
    │
    │ 5. Verify JWT token
    │ 6. Extract user ID
    ▼
MongoDB
    │ 7. Increment downloadCount
    │ 8. Insert download record
    │
    ▼ 9. Return success
Go Backend
    │
    ▼ 10. Return file URL
Next.js Frontend
    │
    ▼ 11. Trigger download
User Browser
```

### 3. Cast Vote Flow

```
User Browser
    │
    │ 1. Select candidate
    │ 2. Click "Vote"
    │ 3. Confirm in modal
    ▼
Next.js Frontend
    │
    │ 4. Validate selection
    │ 5. POST /api/elections/vote
    │    { electionId, positionId, candidateId }
    ▼
Go Backend
    │
    │ 6. Verify JWT token
    │ 7. Check if already voted
    ▼
MongoDB
    │ 8. Query existing votes
    │    (electionId + positionId + userId)
    │
    │ If not voted:
    │ 9. Insert vote record
    │
    ▼ 10. Return success
Go Backend
    │
    ▼ 11. Confirm vote recorded
Next.js Frontend
    │
    │ 12. Update UI
    │ 13. Disable vote button
    │
    ▼ 14. Show success message
User Browser
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION SYSTEM                     │
└─────────────────────────────────────────────────────────────┘

Registration:
  User Input → Frontend Validation → Backend Validation
    → Hash Password → Store in DB → Generate JWT → Return Token

Login:
  User Input → Find User in DB → Compare Password (bcrypt)
    → Generate JWT → Return Token

Protected Routes:
  Request → Extract JWT from Header → Verify Token
    → Decode Claims → Check Expiry → Allow/Deny Access

Token Structure:
  {
    "userId": "507f1f77bcf86cd799439011",
    "email": "student@bowen.edu.ng",
    "role": "student",
    "exp": 1234567890,
    "iat": 1234567890
  }

Token Lifecycle:
  - Generated on login/register
  - Stored in localStorage
  - Added to all API requests (Authorization header)
  - Expires after 7 days
  - Removed on logout
```

---

## Component Hierarchy

```
App (layout.tsx)
│
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   │   ├── Notes Library
│   │   ├── Vote
│   │   └── Announcements
│   ├── Theme Toggle
│   └── Auth Buttons
│       ├── Login (if not authenticated)
│       ├── Register (if not authenticated)
│       ├── Profile (if authenticated)
│       ├── Admin (if admin)
│       └── Logout (if authenticated)
│
├── Page Content
│   │
│   ├── Landing Page (/)
│   │   ├── Hero Section
│   │   ├── Stats Section
│   │   ├── Features Section
│   │   ├── How It Works Section
│   │   └── CTA Section
│   │
│   ├── Auth Pages (/auth/*)
│   │   ├── Login Form
│   │   └── Register Form
│   │
│   ├── Notes Library (/notes)
│   │   ├── Search Bar
│   │   ├── Filters (Course, Semester, Sort)
│   │   └── Note Cards
│   │       ├── Note Info
│   │       ├── Preview Button
│   │       └── Download Button
│   │
│   ├── Voting Page (/vote)
│   │   ├── Election Header
│   │   └── Positions
│   │       └── Candidate Cards
│   │           ├── Candidate Info
│   │           ├── Manifesto
│   │           └── Vote Button
│   │
│   ├── Profile Page (/profile)
│   │   ├── User Info Card
│   │   ├── Stats Card
│   │   ├── Download History
│   │   └── Vote History
│   │
│   └── Admin Dashboard (/admin)
│       ├── Stats Grid
│       ├── Quick Actions
│       ├── Recent Notes
│       └── Active Elections
│
└── Footer
    ├── About Section
    ├── Quick Links
    ├── Contact Info
    └── Social Media Links
```

---

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                      ZUSTAND STORES                          │
└─────────────────────────────────────────────────────────────┘

Auth Store (authStore.ts)
  State:
    - user: User | null
    - token: string | null
    - isAuthenticated: boolean
  
  Actions:
    - setAuth(user, token)
    - logout()
    - initAuth()
  
  Persistence:
    - localStorage: 'auth_token', 'user'

Theme Store (themeStore.ts)
  State:
    - isDark: boolean
  
  Actions:
    - toggleTheme()
    - setTheme(isDark)
  
  Persistence:
    - localStorage: 'theme'
    - document.documentElement.classList
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
└─────────────────────────────────────────────────────────────┘

Layer 1: Frontend Validation
  - Zod schemas for form validation
  - Email format checking
  - Matric number format
  - Password strength

Layer 2: Network Security
  - HTTPS in production
  - CORS configuration
  - JWT in Authorization header

Layer 3: Backend Validation
  - Request body validation
  - JWT token verification
  - Role-based access control

Layer 4: Database Security
  - Password hashing (bcrypt)
  - Parameterized queries
  - No sensitive data in responses

Layer 5: Application Logic
  - One vote per position
  - Download tracking
  - Admin-only operations
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                     │
└─────────────────────────────────────────────────────────────┘

Frontend (Vercel)
  - Automatic deployments from Git
  - Edge network (CDN)
  - SSL/TLS certificates
  - Environment variables
  URL: https://your-app.vercel.app

Backend (Railway/Render)
  - Container deployment
  - Auto-scaling
  - Health checks
  - Environment variables
  URL: https://your-api.railway.app

Database (MongoDB Atlas)
  - Managed MongoDB cluster
  - Automatic backups
  - Monitoring & alerts
  - Network security
  URL: mongodb+srv://cluster.mongodb.net

DNS Configuration
  - Frontend: accounting.bowen.edu.ng
  - Backend: api.accounting.bowen.edu.ng
```

---

## Performance Optimizations

```
Frontend:
  ✓ Next.js App Router (Server Components)
  ✓ Code splitting (automatic)
  ✓ Image optimization
  ✓ CSS optimization (Tailwind purge)
  ✓ Lazy loading
  ✓ Client-side caching

Backend:
  ✓ Connection pooling (MongoDB)
  ✓ Efficient queries (indexes)
  ✓ JWT stateless auth
  ✓ GZIP compression
  ✓ Response caching (future)

Database:
  ✓ Indexes on frequently queried fields
  ✓ Aggregation pipelines
  ✓ Connection pooling
```

---

## Monitoring & Logging

```
Frontend (Vercel):
  - Deployment logs
  - Function invocations
  - Error tracking
  - Performance metrics

Backend (Railway/Render):
  - Application logs
  - CPU/Memory usage
  - Request/Response times
  - Error rates

Database (MongoDB Atlas):
  - Query performance
  - Connection metrics
  - Storage usage
  - Slow queries
```

---

This architecture provides a scalable, secure, and maintainable system for the Bowen University Accounting Department Portal.
