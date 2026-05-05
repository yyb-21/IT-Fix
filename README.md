 <<<<<<< HEAD
# 🛠️ IT-Fix — IT Support Ticket Management System

A full-stack web application for managing IT support tickets within an organization. Users can submit issues, IT support staff can triage and resolve them, and admins have full oversight of the platform.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Roles & Permissions](#roles--permissions)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview

IT-Fix is a role-based ticket management system designed for internal IT support teams. Employees can raise support tickets, track their status in real time, and receive notifications when their issues are resolved. IT staff can accept, triage, update, and close tickets from a dedicated dashboard. Admins have a global view of all users and tickets.

---

## ✨ Features

### 👤 All Authenticated Users
- Secure registration & login with JWT-based authentication (powered by Supabase Auth)
- Role-based redirect on login (`user` → `/dashboard`, `it_support`/`admin` → `/it/dashboard`)
- Profile page
- Real-time toast notifications

### 🙋 Regular Users (`user`)
- Submit new IT support tickets with title, description, category, and priority
- View own tickets and their statuses
- Receive in-app notifications when a ticket is resolved

### 🧑‍💻 IT Support Staff (`it_support`)
- View all submitted tickets
- Accept or refuse unassigned tickets
- Update ticket status (`open` → `in_progress` → `resolved` → `closed`)
- View the IT team members list
- Real-time notifications for newly submitted tickets

### 🔐 Admins (`admin`)
- All IT support capabilities
- Access to the Admin panel with a full user list
- Manage and oversee all tickets across the organization

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| TailwindCSS v3 | Utility-first styling |
| Axios | HTTP client |
| jwt-decode | JWT token parsing |
| lucide-react | Icon library |
| react-hot-toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| Supabase | Database (PostgreSQL) + Auth |
| @supabase/supabase-js | Supabase client |
| dotenv | Environment variable management |
| cors | Cross-origin request handling |

---

## 📁 Project Structure

```
IT-Fix/
├── back-end/
│   ├── config/
│   │   └── supabase.js          # Supabase client initialization (anon + admin)
│   ├── controllers/
│   │   ├── authcontroller.js    # Register, login, forgot/reset password
│   │   ├── ticketscontroller.js # CRUD + accept/refuse ticket logic
│   │   └── userscontroller.js   # List all users / IT team members
│   ├── middleware/
│   │   └── authmiddleware.js    # JWT auth guard + role-based access control
│   ├── routes/
│   │   ├── authroutes.js        # POST /api/auth/*
│   │   ├── ticketsroutes.js     # GET/POST/PUT/DELETE /api/tickets/*
│   │   └── usersroutes.js       # GET /api/users/*
│   ├── utils/
│   │   └── roles.js             # Role constants
│   ├── server.js                # Express app entry point
│   └── .env                     # Environment variables (not committed)
│
└── front-end/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   ├── auth.js          # Auth API calls (login, register)
    │   │   ├── client.js        # Axios instance with auth interceptor
    │   │   ├── tickets.js       # Ticket API calls
    │   │   └── users.js         # User API calls
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── NotificationDropdown.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── RoleGuard.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Spinner.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── TicketModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state (token, user, role)
    │   ├── hooks/
    │   │   ├── useTickets.js
    │   │   ├── useUsers.js
    │   │   ├── useITNewTicketNotifications.js
    │   │   └── useUserResolvedTicketNotifications.js
    │   ├── layouts/
    │   │   ├── AppLayout.jsx    # Authenticated layout (sidebar + navbar)
    │   │   └── PublicLayout.jsx # Public layout (login/register)
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── UserDashboardPage.jsx
    │   │   ├── NewTicketPage.jsx
    │   │   ├── ITDashboardPage.jsx
    │   │   ├── ITTeamPage.jsx
    │   │   ├── AdminPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── HomeRedirectPage.jsx
    │   │   └── UnauthorizedPage.jsx
    │   ├── utils/
    │   │   ├── formatDate.js
    │   │   ├── roleRedirect.js
    │   │   └── status.js
    │   ├── App.jsx              # Route definitions
    │   └── main.jsx             # App entry point
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
=======
# IT-Fix

# 🚀 IT-Fix — IT Support Ticketing System

## 📌 Overview

**IT-Fix** is a full-stack web application designed to manage IT support within an organization.
It allows users to report issues, IT support staff to resolve them, and administrators to monitor the entire system.

The platform follows a **role-based access system** to ensure security and proper workflow management.

---

## 🎯 Features

### 👤 User

* Register & login
* Create support tickets
* View **only their own tickets**
* Track ticket status (Pending, In Progress, Resolved)

### 🛠️ IT Support

* View all submitted tickets
* Take charge of tickets
* Update ticket status
* Manage and resolve issues

### 🛡️ Admin

* View all users and tickets
* Monitor system activity
* Cannot resolve tickets (read-only control)

---

## 🔐 Authentication & Authorization

* JWT-based authentication
* Role-based access control:

  * `user`
  * `it_support`
  * `admin`
* Protected routes on backend

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## 📂 Project Structure

```
IT-Fix/
│
├── front-end/        # React + Vite app
├── back-end/         # Node.js + Express API
│
└── README.md
>>>>>>> 43421ef20d85c3e7a036a323780e1068402fd485
```

---

<<<<<<< HEAD
## 🔐 Roles & Permissions

| Feature | `user` | `it_support` | `admin` |
|---|:---:|:---:|:---:|
| Submit tickets | ✅ | ❌ | ❌ |
| View own tickets | ✅ | — | — |
| View all tickets | ❌ | ✅ | ✅ |
| Accept / Refuse tickets | ❌ | ✅ | ✅ |
| Update ticket status | ❌ | ✅ | ✅ |
| Delete tickets | own only | ✅ | ✅ |
| View IT team | ❌ | ✅ | ✅ |
| Admin panel (all users) | ❌ | ❌ | ✅ |
| Profile page | ✅ | ✅ | ✅ |

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset email | Public |
| `POST` | `/api/auth/reset-password` | Reset password with token | Public |

### Tickets — `/api/tickets`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/tickets` | Get tickets (own for users, all for IT/admin) | 🔒 Any |
| `POST` | `/api/tickets` | Create a new ticket | 🔒 Any |
| `PUT` | `/api/tickets/:id` | Update ticket status & assignment | 🔒 IT / Admin |
| `PUT` | `/api/tickets/:id/accept` | Accept an unassigned ticket | 🔒 IT / Admin |
| `PUT` | `/api/tickets/:id/refuse` | Refuse an unassigned ticket (closes it) | 🔒 IT / Admin |
| `DELETE` | `/api/tickets/:id` | Delete a ticket | 🔒 Owner / IT / Admin |

### Users — `/api/users`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/users` | Get all users | 🔒 Admin |
| `GET` | `/api/users/it-team` | Get IT support & admin users | 🔒 IT / Admin |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A **Supabase** project with:
  - Auth enabled
  - A `tickets` table (see schema below)
  - Service role key (for admin operations)

#### Supabase `tickets` table schema

```sql
create table tickets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text default 'Other',
  priority text default 'Medium',
  status text default 'open',
  user_id uuid references auth.users(id),
  assigned_to uuid references auth.users(id),
  created_at timestamptz default now()
);
```

---

### Backend Setup

```bash
# Navigate to the back-end folder
cd back-end

# Install dependencies
npm install

# Create your environment file
cp .env.example .env   # (or create .env manually — see Environment Variables below)

# Start the server
npm start
```

The API will be available at `http://localhost:5003` (or the port set in `.env`).

---

### Frontend Setup

```bash
# Navigate to the front-end folder
cd front-end

# Install dependencies
npm install

# Create your environment file
cp .env.example .env

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend — `back-end/.env`

| Variable | Description | Example |
|---|---|---|
| `SUPABASE_URL` | Your Supabase project URL | `https://xxxx.supabase.co` |
| `SUPABASE_KEY` | Supabase **service role** secret key | `sb_secret_...` |
| `PORT` | Port the server runs on | `5003` |
| `SMTP_HOST` | SMTP server for password reset emails | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_SECURE` | Use TLS (`true`/`false`) | `false` |
| `SMTP_USER` | SMTP username / email address | `you@gmail.com` |
| `SMTP_PASS` | SMTP password or app password | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | Sender address for emails | `you@gmail.com` |
| `FRONTEND_URL` | Frontend URL for CORS & email links | `http://localhost:5173` |

> ⚠️ **Never commit your `.env` file.** It contains sensitive credentials. The `.gitignore` already excludes it.

### Frontend — `front-end/.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5003` |

---

## ☁️ Deployment

The frontend is configured for deployment on **Vercel** (`vercel.json` is included).

### Frontend (Vercel)

1. Push the `front-end/` folder (or the full repo) to GitHub.
2. Import the project in Vercel and set the **root directory** to `front-end`.
3. Add the environment variable `VITE_API_URL` pointing to your deployed backend.

### Backend

Deploy to any Node.js-compatible host (e.g., Render, Railway, Fly.io):

1. Set all environment variables from the table above in your host's dashboard.
2. The start command is: `node server.js`
3. Update `CORS` origins in `server.js` to include your production frontend URL.

The live frontend is currently deployed at: **https://it-fix-eight.vercel.app**
=======
## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yyb-21/IT-Fix.git
cd IT-Fix
```

---

### 2. Backend Setup

```bash
cd back-end
npm install
```

Create a `.env` file:

```
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Run the server:

```bash
node server.js
```

---

### 3. Frontend Setup

```bash
cd front-end
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5001/api
```

Run the app:

```bash
npm run dev
```

---

## 🌐 Deployment

* Frontend: Vercel
* Backend: Render

Make sure to update:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🧠 Future Improvements

* 💬 Ticket comments system
* 📎 File upload (screenshots)
* 🔔 Notifications
* 🔍 Advanced filtering & search
* 👥 Admin user management panel

---

## ⚠️ Notes

* Admin accounts are **not publicly registered** for security reasons.
* Only authorized roles can access specific features.

---

## 👨‍💻 Author

Developed by **Youssouf BOUDERBALA**

---

## ⭐ Contribute

Feel free to fork the project and improve it!
>>>>>>> 43421ef20d85c3e7a036a323780e1068402fd485
