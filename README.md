# Task Management System

A full-stack Task  Management System built with Node.js + TypeScript (backend) and Next.js + TypeScript (frontend).

---

## Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (Access + Refresh tokens), bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (with auto-refresh interceptor)
- **Notifications**: react-hot-toast
- **Icons**: lucide-react

---

## Prerequisites

- Node.js 18+
- PostgreSQL (running locally or via Docker)
- npm or yarn

---

## Setup

### 1. Clone & install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — copy and edit:
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/taskmanagement"
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

**Frontend** — copy and edit:
```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3. Set up the database

Create the PostgreSQL database:
```sql
CREATE DATABASE taskmanagement;
```

Run Prisma migrations:
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run the development servers

**Backend** (in one terminal):
```bash
cd backend
npm run dev
# Runs on http://localhost:4000
```

**Frontend** (in another terminal):
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout user |

### Tasks (all protected — requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks (pagination, filtering, search) |
| POST | `/tasks` | Create a task |
| GET | `/tasks/:id` | Get single task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| PATCH | `/tasks/:id/toggle` | Toggle task completion |

### Query Parameters for `GET /tasks`
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 50) |
| `status` | string | Filter by `PENDING`, `IN_PROGRESS`, or `COMPLETED` |
| `priority` | string | Filter by `LOW`, `MEDIUM`, or `HIGH` |
| `search` | string | Search by title (case-insensitive) |

---

## Project Structure

```
task-management/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # DB schema (User, Task, RefreshToken)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts  # Register, login, refresh, logout
│   │   │   └── task.controller.ts  # CRUD + toggle + pagination
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts  # JWT authentication guard
│   │   │   └── error.middleware.ts # Global error handler
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts              # Token generation/verification
│   │   │   └── prisma.ts           # Prisma client singleton
│   │   └── index.ts                # Express app entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── auth/
    │   │   │   ├── login/page.tsx
    │   │   │   └── register/page.tsx
    │   │   ├── dashboard/
    │   │   │   ├── layout.tsx      # Sidebar layout + auth guard
    │   │   │   └── page.tsx        # Stats overview
    │   │   ├── tasks/
    │   │   │   └── page.tsx        # Full task CRUD + filters
    │   │   ├── globals.css
    │   │   └── layout.tsx
    │   ├── components/
    │   │   └── tasks/
    │   │       ├── TaskCard.tsx
    │   │       ├── TaskModal.tsx
    │   │       ├── TaskFiltersBar.tsx
    │   │       └── Pagination.tsx
    │   ├── hooks/
    │   │   ├── useAuth.tsx          # Auth context + provider
    │   │   └── useTasks.ts          # Tasks state management
    │   ├── lib/
    │   │   ├── api.ts               # Axios instance + refresh interceptor
    │   │   ├── auth.ts              # Auth API calls
    │   │   └── tasks.ts             # Tasks API calls
    │   └── types/
    │       └── index.ts             # Shared TypeScript types
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## Key Design Decisions

- **Refresh token rotation**: Each token refresh issues a new refresh token and invalidates the old one.
- **Auth guard**: The dashboard layout checks for a valid user on mount and redirects to `/auth/login` if unauthenticated. The Axios interceptor automatically retries failed requests after refreshing the token.
- **Task ownership**: All task queries include `userId` in the `where` clause to ensure users can only access their own tasks.
- **Pagination + filtering**: The `GET /tasks` endpoint supports simultaneous pagination, status/priority filtering, and full-text title search.
