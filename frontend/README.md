# Employee Attendance System

Name: Nimmadala Geetha Sri
College Name: Vignan's Institute Of Information Technology, Duvvada
Contact No: 9542558182

Full-stack (React + Node.js + MongoDB) minimal attendance system with:
- Employee: register, login, check-in, check-out, view history
- Manager: view all attendance, today's status

## Setup (Backend)
1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. `cd backend`
3. `npm install`
4. `npm run dev` (requires nodemon) or `npm start`

Seed sample users (optional):
node utils/seed.js

## Setup (Frontend)
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## APIs
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/attendance/checkin
- POST /api/attendance/checkout
- GET /api/attendance/my-history
- GET /api/attendance/my-summary
- GET /api/attendance/all
- GET /api/attendance/employee/:id
- GET /api/attendance/today-status

