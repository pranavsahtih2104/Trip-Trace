# Trip-Trace

# ✈️ TripTrace — Full Stack Travel Management System

TripTrace is a full-stack travel planning and expense tracking application built using the MERN stack.  
It allows users to manage trips, track expenses, maintain a travel journal, monitor trip activities, and analyze spending in real-time.

---

## 🚀 Features

### 🔐 Authentication
- User signup & login (JWT based authentication)
- Password hashing using bcrypt
- Protected routes

### 🧳 Trip Management
- Create, edit, delete trips
- Automatic trip status detection (Planned / Ongoing / Completed)
- Filter trips by status
- Dashboard statistics

### 💰 Expense Tracking
- Add / Edit / Delete expenses
- Categorize expenses
- Budget tracking
- Real-time spending calculation
- Visual spending breakdown (Pie Chart)

### ✅ Activities
- Add trip activities
- Mark activities as completed
- Delete activities
- Auto progress tracking

### 📝 Travel Journal
- Add journal entries per trip
- Store personal travel memories

### 📊 Analysis
- Expense distribution by category
- Remaining budget calculation
- Visual data representation using Recharts

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

## 🏗 Architecture

- Backend follows MVC pattern
- JWT middleware for route protection
- MongoDB embedded subdocuments for:
  - expenses
  - activities
  - journal
- Full state synchronization between frontend and backend
- Refetch strategy for consistency

