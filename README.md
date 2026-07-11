# Droneco: Institute Lead & Fee Management System

A comprehensive, full-stack **MERN** (MongoDB, Express, React, Node.js) application designed to manage educational institute workflows. The platform handles everything from initial student inquiries and lead tracking to final admissions, fee collection, and administrative reporting.

## 🏗 Architecture & Tech Stack

### Frontend (Client)
- **Framework:** React.js (Bootstrapped with Vite for high performance)
- **Styling:** Custom Vanilla CSS utilizing CSS Variables for dynamic theming (Dark/Light mode ready) and interactive layouts.
- **Animations:** Framer Motion for premium, smooth micro-interactions and transitions.
- **Icons:** Lucide React for modern, scalable vector icons.
- **API Communication:** Axios with request/response interceptors for automatic JWT attachment and error handling.
- **State Management:** React hooks and Context API for global state (AuthContext).

### Backend (Server)
- **Environment:** Node.js with Express.js
- **Database:** MongoDB, managed via Mongoose ODM.
- **Authentication:** JSON Web Tokens (JWT) for stateless, secure API access.
- **Security:** 
  - `helmet` for HTTP header security
  - `express-rate-limit` to prevent brute force and DDoS attacks
  - `express-mongo-sanitize` to prevent NoSQL injection vulnerabilities
  - Strict CORS configuration scoped to the frontend origin.
  - Zod integrated for robust schema validation at both UI and API levels.

## 🔑 Key Modules & Features

### 1. Role-Based Access Control (RBAC)
- **Admin:** Has full access to reports, fee configurations, discount rules, course management, and global settings.
- **Receptionist:** Handles day-to-day operations: tracking leads, admitting students, collecting fees, and managing follow-ups.
- **Counselor (Planned):** Dedicated access for interacting with prospective students.

### 2. Lead & Admission Management
- **Lead Tracking:** Record inquiries, track statuses (New, Contacted, Interested, Enrolled), and maintain follow-up logs.
- **Admission Wizard:** A step-by-step flow to convert a lead into an enrolled student. Automatically populates submitted form data (including dynamic questions) and generates unique `ST-YYYY-XXXX` identifiers and linked `Parent` profiles.
- **Student Profile & ID:** A comprehensive view of a student's personal details, auto-populated ID Cards, course enrollment, fee structure, and payment history securely tied to the unified Student document.

### 3. Financial & Fee Management
- **Fee Structures:** Assign total fees, tax percentages, and installment rules to specific courses.
- **Discount Rules:** Admins can define discount criteria (e.g., Early Bird, Scholarship) that can be toggled and applied dynamically.
- **Fee Collection:** Process installments using various payment methods (Cash, UPI, Card, Bank Transfer) and auto-calculate remaining balances.
- **Payment History:** Detailed transactional ledgers for each student.

### 4. Admin Analytics & Reporting
- **Dashboards:** Real-time metrics tracking Total Collections, Pending Fees, and Lead Conversion Rates.
- **Charts:** Visual representation of Revenue Trends and Course Popularity using Recharts.
- **Settings Management:** Globally configure Institute Info (logo/name), Fee defaults (late fees, admission fees), and Receipt prefixes.

### 5. Dynamic Form Builder
- **Customizable Inquiries:** Admins can dynamically toggle the visibility and required status of native fields (like Category, Address, Guardian Details) on the public inquiry form.
- **Custom Fields Engine:** Inject bespoke text, number, date, or dropdown fields into specific steps of the form without changing code.
- **Automated Validation:** The backend automatically maps and enforces validation rules dynamically based on the active form configuration.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance running on `localhost:27017` or a MongoDB Atlas URI)

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
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/institute-lead-management
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 3. Running the Application
Open two separate terminal windows.

**Terminal 1: Start Backend**
```bash
cd backend
npm run dev
```

**Terminal 2: Start Frontend**
```bash
cd frontend
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

## 🛡️ Security Notes
This application implements multiple security layers:
- Passwords are encrypted using bcrypt before being stored.
- JWT tokens are strictly validated on all protected routes via an `authMiddleware`.
- Role-based middleware ensures users can only access endpoints mapped to their specific roles.
- Invalid MongoDB ObjectIDs are intercepted and rejected before querying to prevent database cast errors.
