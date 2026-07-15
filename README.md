# Droneco: Institute Lead & Fee Management System

A comprehensive, full-stack **MERN** (MongoDB, Express, React, Node.js) application tailored specifically for **Droneco's** lead acquisition and student enrollment workflows. The platform handles everything from initial student inquiries and dynamic admission processes, to complex fee configuration, reporting, and secure RBAC (Role-Based Access Control) user management.

## 🏗 Tech Stack & Architecture

### Frontend (Client)
- **Framework:** React.js (Bootstrapped with Vite for high performance)
- **Styling:** Custom Vanilla CSS utilizing CSS Variables for dynamic theming and responsive UI.
- **Animations:** Framer Motion for premium micro-interactions.
- **Icons:** Lucide React for scalable vector icons.
- **API Communication:** Axios with request/response interceptors for automatic JWT attachment.
- **State Management:** React hooks, Context API (AuthContext), and persistent local state.

### Backend (Server)
- **Environment:** Node.js with Express.js
- **Database:** MongoDB via Mongoose ODM, utilizing **MongoDB Transactions** for multi-document atomicity (e.g., admitting a student and generating fee structures in one go).
- **Authentication:** Fully robust JSON Web Tokens (JWT) mapped securely to MongoDB `User` collections, removing any reliance on mock stores.
- **Media Storage:** Integrated with **Cloudinary** for scalable, secure handling of student profile photos, signatures, and document uploads.
- **Security:** 
  - `helmet` for HTTP header security.
  - `express-rate-limit` to prevent brute force (including protected media upload endpoints).
  - `express-mongo-sanitize` for NoSQL injection prevention.
  - Strict CORS configuration configurable via `.env`.
  - **Zod** integrated for robust backend schema validation.
- **Data Integrity:** **Soft Deletes** (`deleted_at` fields) implemented across major entities to prevent accidental data loss.

## 🔑 Key Features

1. **Role-Based Access & User Management**
   - **Admin:** Full access to configure fee structures, courses, system settings, and manage staff users.
   - **Receptionist:** Handles day-to-day operations like lead tracking and fee collections.
   - **Dynamic Settings:** Global system settings (company info, receipt prefixes) loaded centrally from the DB.

2. **Lead & Admission Wizard (Transaction-Safe)**
   - **Lead Tracking:** Status progression (New, Hot, Enrolled).
   - **Admission Wizard:** A guided flow that seamlessly links Leads -> Students -> Courses -> Fees. 
   - **Student Identity:** Auto-generated structured IDs (`ADM-2026-XXXX`).

3. **Financial & Fee Management**
   - **Dynamic Courses & Fees:** Assign custom fee amounts, taxes, and installments to distinct courses.
   - **Payment Processing:** Record partial or full payments (UPI, Card, Cash) linked to student fee profiles.
   - **Discount Engine:** Granular control over global and course-specific discount rules.

4. **Dynamic Form Engine**
   - Inject bespoke fields into inquiry forms natively via the Admin Settings UI.
   - Enforced validation rules map dynamically from UI config to the backend Zod schemas.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Running locally on `localhost:27017` or Atlas URI. *Note: MongoDB Transactions require a replica set or Atlas cluster.*)

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Do **NOT** commit the `.env` file. Create it in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/institute_lead_db
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

In the `frontend` directory, create a `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Running Locally
Run these in separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Navigate to `http://localhost:5173` in your browser.
