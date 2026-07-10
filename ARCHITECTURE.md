# Droneco Institute Lead Management System
## System Architecture Design

This document outlines the architecture for the College Institute Management System. It explains the high-level design of the frontend, backend, and database to assist future developers with onboarding and maintenance.

---

## 1. High-Level Architecture
The system follows a standard **Client-Server Architecture**:
- **Frontend**: A Single Page Application (SPA) built with React and Vite.
- **Backend**: A RESTful API built with Node.js and Express.js.
- **Database**: A NoSQL database (MongoDB) hosted on MongoDB Atlas.

Communication between the frontend and backend occurs via HTTPS using JSON payloads. All protected routes require a Bearer JWT (JSON Web Token) for authentication.

---

## 2. Backend Architecture (Domain-Driven Design)
The backend recently underwent a major refactoring from a legacy MVC monolith to a **Domain-Driven Design (DDD)** approach. 

Instead of grouping files by technical type (e.g., all controllers together, all routes together), files are now grouped by **business domain**. This makes the codebase vastly more scalable and easier to navigate.

### Directory Structure
```
backend/
├── src/
│   ├── modules/
│   │   ├── core/           # Core settings, admin configs, upload routes
│   │   ├── finance/        # Fees, payments, invoices, discounts
│   │   ├── leads/          # Lead generation, dynamic questions, feedback
│   │   ├── students/       # Admitted students, academic records
│   │   └── users/          # Authentication, roles, users
```

### Module Anatomy
Every domain folder (e.g., `students/`) is self-contained and typically includes:
- `*.model.js`: The Mongoose schema and database interaction logic.
- `*.controller.js`: The business logic for processing requests.
- `*.routes.js`: The Express route definitions linking URLs to controllers.
- `*.validation.js`: (Optional) Joi schemas for validating incoming request payloads.

---

## 3. Frontend Architecture (Component-Driven)
The frontend is built using **React + Vite**. It strictly adheres to a modular, component-driven approach to avoid "God Components" (massive, monolithic files that are hard to read and debug).

### Directory Structure
```
frontend/
├── src/
│   ├── admin/
│   │   ├── AdminDashboard.jsx     # The main orchestrator/controller component
│   │   └── components/            # Extracted UI components for the dashboard
│   │       ├── AnalyticsDashboard.jsx
│   │       ├── LeadDetailModal.jsx
│   │       └── LeadsTable.jsx
│   ├── forms/                     # Multi-step wizard components
│   │   ├── StudentForm.jsx        # Parent form orchestrator
│   │   ├── StepPersonal.jsx       
│   │   ├── StepAcademic.jsx       
│   │   ├── StepAddress.jsx        
│   │   └── StepMedia.jsx          
│   └── utils/
│       └── validators.js          # Shared validation logic
```

### State Management
State is largely managed via React `useState` and `useEffect` at the orchestrator level (e.g., `AdminDashboard.jsx`). Data and callback functions are passed down to child components via props.

---

## 4. Database Architecture (MongoDB)
The database utilizes a NoSQL document model. 

### Key Collections & Relationships:
- **Users**: Handles authentication and RBAC (Role-Based Access Control) for Admins, Receptionists, etc.
- **Leads**: Stores initial inquiries. When a lead is admitted, their data is structurally migrated to the `Students` collection.
- **Students**: Stores admitted students. References `Parent` and `Academic` collections.
- **Courses**: Defines the catalog of available programs.
- **Fees & Payments**: Tracks financial transactions and invoice generation.

### Best Practices Enforced:
- **Soft Deletes**: Collections use a `deleted_at: null` field to ensure data is never permanently lost.
- **Audit Logs**: Actions are tracked in an `AuditLog` collection for compliance.
- **Indexing**: Frequent lookup fields (like `email`, `phone`, `enrollment_number`) are indexed for fast retrieval.

---

## 5. Deployment Strategy
The system is designed to be deployed on **Render.com**:
- **Web Service**: Runs the Node.js backend (`npm run start`).
- **Static Site**: Serves the Vite React production build (`npm run build`).
- **Environment Variables**: Managed securely via Render's dashboard. Ensure `VITE_API_URL` is set in the frontend to point to the live backend.
