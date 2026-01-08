# Multi-Tenant SaaS Admin Dashboard

A production-ready multi-tenant admin dashboard built with Next.js, featuring organization-based multi-tenancy, role-based access control (RBAC), and a modern UI built with shadcn/ui.

## 🚀 Features

- **Multi-Tenancy**: Organization-based isolation with tenant switching
- **Authentication**: Secure session-based authentication with NextAuth.js
- **Role-Based Access Control**: Three roles (OWNER, ADMIN, MEMBER) with granular permissions
- **User Management**: Full CRUD operations for users with role assignment
- **Organization Settings**: Manage organization details and preferences
- **Dashboard Analytics**: Overview with charts and statistics
- **Modern UI**: Built with shadcn/ui, Tailwind CSS, and dark mode support
- **Type Safety**: Full TypeScript coverage with Prisma ORM
- **Server Actions**: Secure server-side operations with validation
- **Responsive Design**: Mobile-first responsive layout

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Validation**: Zod
- **Forms**: React Hook Form

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Environment variables configured

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/multi_tenant_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Auth routes (signin, signup)
│   ├── (dashboard)/          # Dashboard routes
│   │   └── [orgId]/         # Organization-scoped routes
│   │       ├── dashboard/   # Dashboard overview
│   │       ├── users/       # User management
│   │       └── settings/    # Organization settings
│   ├── actions/             # Server actions
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard components
│   ├── settings/            # Settings components
│   ├── users/               # User management components
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── prisma.ts            # Prisma client
│   ├── rbac.ts              # Role-based access control
│   ├── validations.ts       # Zod schemas
│   └── utils.ts             # Utility functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
└── middleware.ts            # Auth middleware
```

## 🏗️ Architecture

### Multi-Tenancy Model

The application uses **organization-based multi-tenancy**:

- **User**: Individual user accounts
- **Organization**: Tenant organizations
- **Membership**: Many-to-many relationship between users and organizations with roles

**Roles:**
- **OWNER**: Full access, can manage all aspects
- **ADMIN**: Can manage users and read settings
- **MEMBER**: Read-only access to users and settings

### Tenant Isolation

Tenant isolation is enforced at multiple levels:

1. **Database Queries**: All queries filter by `organizationId`
2. **Server Actions**: RBAC checks ensure users can only access their organization's data
3. **Middleware**: Route protection ensures users can only access their organizations
4. **UI Level**: Components only display data for the current organization

### Authentication & Authorization

- **Authentication**: Session-based with NextAuth.js
- **Authorization**: Role-based access control (RBAC) with permission checks
- **Middleware**: Protects routes and enforces tenant access

### Server Actions

All data mutations use Next.js Server Actions with:
- Zod validation
- RBAC permission checks
- Tenant isolation enforcement
- Error handling

## 🔐 Security Features

- **Input Validation**: All inputs validated with Zod schemas
- **Password Hashing**: bcrypt with salt rounds
- **Session Security**: Secure session management with NextAuth
- **CSRF Protection**: Built-in Next.js CSRF protection
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in XSS protection
- **Environment Variables**: Sensitive data in `.env` files

## 📊 Database Schema

```prisma
User
  - id, email, name, password, ...

Organization
  - id, name, slug, logo, ...

Membership
  - userId, organizationId, role (OWNER | ADMIN | MEMBER)
```

## 🧪 Testing Accounts

After running the seed script, you can use these test accounts:

- **owner@acme.com** / password123 (Owner of Acme Corp)
- **admin@acme.com** / password123 (Admin of Acme Corp)
- **member@acme.com** / password123 (Member of Acme Corp)
- **owner@tech.com** / password123 (Owner of Tech Startup)
- **multi@example.com** / password123 (Member of both organizations)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

1. Build the application: `npm run build`
2. Set environment variables
3. Run migrations: `npm run db:migrate`
4. Start the server: `npm start`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio

## 🎨 UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) components:

- Button, Card, Input, Label
- Dialog, Dropdown Menu, Select
- Table, Badge, Avatar
- Toast notifications
- And more...

## 🔄 State Management

- **Server State**: React Server Components with Server Actions
- **Client State**: React hooks (useState, useForm)
- **Session State**: NextAuth.js session management

## 📈 Performance Optimizations

- Server Components by default
- Streaming and Suspense for loading states
- Optimized database queries with Prisma
- Memoized chart components
- Image optimization with Next.js Image

## 🤝 Contributing

This is a reference implementation. Feel free to use it as a starting point for your own projects.

## 📄 License

MIT

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)

---

Built with ❤️ as a production-ready reference implementation.
# nextjs-multi-tenant-dashboard
