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
```

---

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

Developed by **Youcef BD**

---

## ⭐ Contribute

Feel free to fork the project and improve it!
