# 🎓 Placement Portal — Backend

A RESTful API server powering the Placement Portal platform, enabling **students**, **companies**, and **admins** to manage campus placement workflows end-to-end.

---

## 📦 Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| **Runtime**    | Node.js                          |
| **Framework**  | Express.js v5                    |
| **ORM**        | Prisma v5                        |
| **Database**   | PostgreSQL (Neon — serverless)   |
| **Auth**       | JWT (`jsonwebtoken`) + bcrypt    |
| **Env Config** | dotenv                           |

---

## 🗂️ Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema (models & relations)
│   └── seed.js              # Seed script for sample data
├── prisma.config.ts         # Prisma CLI configuration
├── src/
│   ├── index.js             # Express app entry point (port 3000)
│   ├── controllers/
│   │   ├── auth.controller.js      # Student signup & login
│   │   ├── student.controller.js   # Profile, applications, dashboard
│   │   ├── company.controller.js   # Company auth, job CRUD, applicants
│   │   ├── job.controller.js       # Job listing, apply, my applications
│   │   └── admin.controller.js     # Admin auth, company approval, stats
│   ├── routes/
│   │   ├── auth.routes.js          # /api/auth/*
│   │   ├── student.routes.js       # /api/student/*
│   │   ├── company.routes.js       # /api/company/*
│   │   ├── job.routes.js           # /api/jobs/*
│   │   └── admin.routes.js         # /api/admin/*
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT verification
│   │   └── role.middleware.js       # Role-based access control
│   └── lib/
│       └── prisma.js               # Prisma client singleton
├── .env                     # Environment variables (DATABASE_URL, JWT_SECRET)
├── .gitignore
└── package.json
```

## 🔐 Authentication & Authorization

### JWT Authentication
- Tokens are issued on login with a **1-day expiry**.
- The token payload includes `userId`/`companyId`/`adminId` and a `role` field.
- Protected routes require a `Bearer <token>` in the `Authorization` header.

### Role-Based Access Control
Three roles exist in the system:

| Role        | Description                                       |
| ----------- | ------------------------------------------------- |
| `student`   | Can update profile, browse jobs, apply, view apps |
| `company`   | Can post/edit/delete jobs, view applicants         |
| `admin`     | Can approve/reject companies, view platform stats  |

### Company Approval Workflow
Companies register with a `PENDING` status and **cannot log in or post jobs** until an admin changes their status to `APPROVED`.

---

## 🛣️ API Endpoints

All routes are prefixed with `/api`.

### 🔑 Auth — `/api/auth`

| Method | Endpoint  | Auth | Description          |
| ------ | --------- | ---- | -------------------- |
| POST   | `/signup` | ❌   | Register a student   |
| POST   | `/login`  | ❌   | Login as a student   |

---

### 🧑‍🎓 Student — `/api/student`

| Method | Endpoint        | Auth | Role      | Description               |
| ------ | --------------- | ---- | --------- | ------------------------- |
| PATCH  | `/profile`      | ✅   | `student` | Update student profile    |
| GET    | `/applications` | ✅   | `student` | View all my applications  |
| GET    | `/dashboard`    | ✅   | `student` | Dashboard stats           |

---

### 🏢 Company — `/api/company`

| Method | Endpoint                    | Auth | Role      | Description                       |
| ------ | --------------------------- | ---- | --------- | --------------------------------- |
| POST   | `/signup`                   | ❌   | —         | Register a new company            |
| POST   | `/login`                    | ❌   | —         | Login as a company                |
| POST   | `/jobs`                     | ✅   | `company` | Post a new job opening            |
| GET    | `/viewJobs`                 | ✅   | `company` | List all jobs posted by company   |
| GET    | `/jobs/:jobId/applicants`   | ✅   | `company` | View applicants for a job         |
| PATCH  | `/jobs/:jobId`              | ✅   | `company` | Edit a job posting                |
| DELETE | `/jobs/:jobId`              | ✅   | `company` | Delete a job posting              |

---

### 💼 Jobs — `/api/jobs`

| Method | Endpoint            | Auth | Role      | Description                                  |
| ------ | ------------------- | ---- | --------- | -------------------------------------------- |
| GET    | `/`                 | ❌   | —         | List all jobs (paginated, filterable)         |
| POST   | `/apply`            | ✅   | `student` | Apply for a job                              |
| GET    | `/my-applications`  | ✅   | any       | View current user's applications             |

**Query Parameters for `GET /api/jobs/`:**

| Param      | Type   | Default | Description                        |
| ---------- | ------ | ------- | ---------------------------------- |
| `page`     | number | `1`     | Page number                        |
| `limit`    | number | `10`    | Results per page                   |
| `location` | string | —       | Filter by company location         |
| `minCtc`   | number | —       | Minimum CTC filter                 |
| `search`   | string | —       | Search by job role (case-insensitive) |

---

### 🛡️ Admin — `/api/admin`

| Method | Endpoint                    | Auth | Role    | Description                          |
| ------ | --------------------------- | ---- | ------- | ------------------------------------ |
| POST   | `/login`                    | ❌   | —       | Login as admin                       |
| GET    | `/companies/pending`        | ✅   | `admin` | List all pending companies           |
| PATCH  | `/companies/:id/approve`    | ✅   | `admin` | Approve a company                    |
| PATCH  | `/companies/:id/reject`     | ✅   | `admin` | Reject a company                     |
| GET    | `/companies`                | ✅   | `admin` | List all companies (filterable)      |
| GET    | `/stats`                    | ✅   | `admin` | Platform-wide statistics dashboard   |

**Query Parameters for `GET /api/admin/companies`:**

| Param    | Type   | Description                                  |
| -------- | ------ | -------------------------------------------- |
| `status` | string | Filter by status (`PENDING`, `APPROVED`, `REJECTED`) |
| `search` | string | Search by company name (case-insensitive)    |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database (or a [Neon](https://neon.tech) serverless instance)

### Installation

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
#    Create a .env file with the following:
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret_key"

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev

# 6. (Optional) Seed the database with sample data
npm run seed

# 7. Start the development server
npm run dev
```

The server will start on **`http://localhost:3000`**.

---

## 📝 Environment Variables

| Variable       | Description                          | Required |
| -------------- | ------------------------------------ | -------- |
| `DATABASE_URL` | PostgreSQL connection string         | ✅       |
| `JWT_SECRET`   | Secret key for JWT signing/verification | ✅    |

---

## 📜 Available Scripts

| Script        | Command              | Description                 |
| ------------- | -------------------- | --------------------------- |
| `npm run dev` | `node src/index.js`  | Start the development server |
| `npm run seed`| `node prisma/seed.js`| Seed the database            |

---