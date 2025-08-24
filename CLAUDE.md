# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Node.js/Express)
```bash
cd backend
npm run dev          # Start development server with nodemon
npm run start        # Production server
npm run test         # Run Jest tests
npm run lint         # ESLint code checking
```

### Frontend (Next.js)
```bash
cd frontend
npm run dev          # Development server on port 3001
npm run build        # Production build
npm run start        # Production server on port 3001
npm run lint         # Next.js linting
npm run type-check   # TypeScript checking without emit
```

### Docker Environment
```bash
docker-compose up -d        # Start PostgreSQL, Redis, and Adminer
docker-compose down         # Stop all services
```

### Database Access
- **Adminer UI**: http://localhost:8080
- **PostgreSQL**: localhost:5432 (postgres/postgres)
- **Redis**: localhost:6379

## Architecture Overview

### Multi-Tenant SaaS Platform
This is a comprehensive digital marketing platform with multi-tenancy support. The architecture follows these key principles:

**Authentication & Authorization:**
- JWT-based authentication with refresh tokens stored as HTTP-only cookies
- Multi-tenant access control through UserCompany junction table
- Role-based permissions: SuperAdmin, Admin, User
- Company context switching via `X-Company-Id` header

**Database Models Hierarchy:**
```
User ←→ Company (Many-to-Many via UserCompany)
Company → MetaAccount → Campaign → AdSet → Ad
Company → AdCreative (shared creative library)
```

**API Architecture:**
- Express.js with modular route structure
- Authentication middleware chain: `auth → authorizeCompany → checkPermissions`
- Sequelize ORM with JSONB fields for flexible data storage
- Redis for session management and caching

**Frontend Architecture:**
- Next.js 14 with App Router
- Zustand for global state management (auth store pattern)
- React Hook Form + Zod for form validation
- Tailwind CSS with custom design system
- API interceptors with automatic token refresh

### Meta Ads Integration
The platform integrates with Facebook Marketing API v19.0:

**Models:** MetaAccount → Campaign → AdSet → Ad → AdCreative
**Service Layer:** `metaAdsService.js` handles API communication, sync operations, and error handling
**Sync Pattern:** Bidirectional sync with Meta API, storing both local and Meta IDs

### Key Patterns

**Multi-Tenancy Implementation:**
- Every major model includes `companyId` foreign key
- Authorization middleware validates company access
- API routes filter by `req.companyId`

**State Management:**
- Zustand stores follow the pattern: `useAuthStore`, `useCampaignStore`
- Persist middleware for auth state
- API state managed through React Query patterns

**Form Handling:**
- React Hook Form + Zod schema validation
- Consistent error handling and toast notifications
- Optimistic UI updates where appropriate

**Permission System:**
- Granular permissions stored in UserCompany.permissions JSONB
- Middleware functions: `checkPermissions(['ads_read', 'ads_management'])`
- Frontend permission checks in components

## Environment Configuration

Key environment variables in backend:
- `JWT_SECRET`, `JWT_REFRESH_SECRET` - Authentication tokens
- `DB_*` - PostgreSQL connection
- `REDIS_*` - Redis connection
- `NODE_ENV` - Environment mode

Frontend environment variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL (defaults to localhost:3000)

## Database Considerations

**Sequelize Models:**
- Use UUID primary keys for all entities
- JSONB fields for flexible configuration (targeting, permissions, metadata)
- Proper indexes on foreign keys and frequently queried fields
- Soft deletes where appropriate (status fields)

**Meta Ads Sync:**
- `syncStatus` field tracks sync state: 'pending', 'syncing', 'synced', 'error'
- `lastSyncAt` timestamp for sync monitoring
- `metaData` JSONB field stores raw API responses

## Development Notes

**API Route Organization:**
- Routes grouped by feature: `/auth`, `/meta-ads`, `/crm`
- Consistent response format: `{ success: boolean, data?: any, error?: string }`
- Middleware order: auth → company authorization → permissions → route handler

**Frontend Component Structure:**
- Dashboard layout with sidebar navigation
- Feature-based page organization: `/dashboard/campaigns`
- Reusable components in `/components/dashboard`
- Service layer for API calls with proper error handling

**Testing Strategy:**
- Backend: Jest + Supertest for API testing
- Database: Use transactions for test isolation
- Frontend: Component testing with proper mocking of API calls

The platform is designed for scalability with clear separation of concerns, proper error handling, and maintainable code structure.