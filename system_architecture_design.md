# System Architecture, Tech Stack, & Database Specifications

This document serves as the absolute blueprint for the **Coaching Institute Lead Management System**. It outlines the technology stack, system architecture flows, and the advanced database design including the Entity-Relationship (ER) model.

---

## 1. Technology Stack Specification

| Component | Technology | Version | Purpose & Core Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | 18.x | Dynamic, responsive Single Page Application (SPA). Manages student wizard form steps, staff logins, and dashboards. |
| **Styling** | Vanilla CSS | CSS3 | Custom variables and responsive layouts utilizing modern design specs (dark modes, micro-animations, clean grids). |
| **Backend** | Node.js + Express.js | 20.x | RESTful API backend handling route security, request validation, and database orchestration. |
| **Database** | MongoDB | 7.0+ | Document-based NoSQL database chosen for its JSON-friendly dynamic schema structure. |
| **ORM** | Mongoose | 8.x | Object Data Modeling (ODM) library for schema enforcement and MongoDB relationships in Node.js. |
| **Client Validation**| Zod / Yup | - | Form validation inside the React wizard before payload submission. |
| **Server Validation**| Zod / Joi | - | Enforces payload schemas at Express entry routing. |
| **Security** | JWT (JSON Web Tokens) | - | Statless session authorization for Admin and Receptionist logins. |

---

## 2. System Architecture

The project is designed using the **MVC + Service Layer** pattern. Business logic is strictly separated from request handling.

```mermaid
graph TD
    subgraph Client [Frontend React.js SPA]
        A[Student Forms / Staff Dashboards] --> B[Vite Router / Guards]
        B --> C[React Context State]
        C --> D[Axios Client API Wrappers]
    end

    subgraph API Gateway [Express App Routing]
        D -- HTTPS JSON Request --> E[Express Router]
        E --> F[Middleware: Winston Logger]
        F --> G[Middleware: JWT Validator]
        G --> H[Middleware: Zod Payload Validator]
    end

    subgraph Service Layer [Express MVC Controller & Service]
        H --> I[Controllers]
        I --> J[Services Layer Business Rules]
        J -- Field Projection Guard --> K[Mongoose Models]
    end

    subgraph Storage [Database]
        K --> L[(MongoDB Database)]
    end
```

### Flow Separation Rules
1.  **Strict Security Field Projection**: 
    When a Receptionist requests lead details, the `LeadService` applies a Mongoose projection filter (`select('fullName email mobileNumber status')`). Sensitive student details (remarks, queries, career goals) never leave the database, preventing network-sniffing leaks.
2.  **Stateless Session Control**: 
    Express uses stateless JWT verification. Upon a successful login, the `staff` member gets a token payload containing their unique role, checked during authorization middleware processing.

---

## 3. Database Entity-Relationship (ER) Diagram

The system employs a **hybrid dynamic design** containing the following 8 collections. It allows the multi-step form's Step 2 and Step 3 questions to be fully configured in the database, meaning new questions can be added by an admin without changing the database schema.

```mermaid
erDiagram
    STAFF {
        ObjectId staff_id PK
        string name
        string email "UNIQUE"
        string password_hash
        string role
        string status
        datetime created_at
        datetime updated_at
    }

    COURSES {
        ObjectId course_id PK
        string course_name "UNIQUE"
        string code "UNIQUE"
        string description
        int duration_months
        boolean is_active
        datetime created_at
    }

    LEAD_STATUS {
        ObjectId status_id PK
        string name "UNIQUE"
        string key "UNIQUE"
        string color_code
        datetime created_at
    }

    LEADS {
        ObjectId lead_id PK
        string full_name
        string email
        string mobile_number
        string city
        ObjectId interested_course_id FK
        ObjectId status_id FK
        ObjectId assigned_to_staff_id FK
        datetime submitted_at
        datetime updated_at
    }

    QUESTIONS {
        ObjectId question_id PK
        string question_text
        int step_number
        string field_type
        string options
        boolean is_required
        boolean is_active
        datetime created_at
    }

    LEAD_RESPONSES {
        ObjectId response_id PK
        ObjectId lead_id FK
        ObjectId question_id FK
        string response_value
        datetime created_at
    }

    FEEDBACK_RESPONSES {
        ObjectId feedback_id PK
        ObjectId lead_id FK
        ObjectId staff_id FK
        string feedback_text
        datetime next_follow_up_date
        datetime created_at
    }

    AUDIT_LOGS {
        ObjectId audit_id PK
        ObjectId staff_id FK
        string action
        string details
        datetime timestamp
    }

    STAFF ||--o{ LEADS : assigned_to
    COURSES ||--o{ LEADS : selected_by
    LEAD_STATUS ||--o{ LEADS : has_status

    LEADS ||--o{ LEAD_RESPONSES : gives
    QUESTIONS ||--o{ LEAD_RESPONSES : asked_in

    LEADS ||--o{ FEEDBACK_RESPONSES : receives
    STAFF ||--o{ FEEDBACK_RESPONSES : writes

    STAFF ||--o{ AUDIT_LOGS : creates
```

---

## 4. Collection Schemas & Configurations

### STAFF (`staff`)
Stores administrative personnel login details.
*   **Indices**: Unique index on `email`.

```json
{
  "staff_id": "ObjectId (PK)",
  "name": "String",
  "email": "String (Unique)",
  "password_hash": "String (Bcrypt Hash)",
  "role": "String",
  "status": "String",
  "created_at": "Date",
  "updated_at": "Date"
}
```

### COURSES (`courses`)
Stores course offerings.
*   **Indices**: Unique index on `code`, `course_name`.

```json
{
  "course_id": "ObjectId (PK)",
  "course_name": "String (Unique)",
  "code": "String (Unique)",
  "description": "String",
  "duration_months": "Number",
  "is_active": "Boolean",
  "created_at": "Date"
}
```

### LEAD_STATUS (`lead_status`)
Pipeline status states.

```json
{
  "status_id": "ObjectId (PK)",
  "name": "String (Unique)",
  "key": "String (Unique)",
  "color_code": "String (Hex)",
  "created_at": "Date"
}
```

### LEADS (`leads`)
Core inquiry documents generated at Step 1 of form completion.
*   **Indices**: Compound index `{ mobile_number: 1, email: 1 }` to block duplicates. Index on `assigned_to_staff_id` and `status_id`.

```json
{
  "lead_id": "ObjectId (PK)",
  "full_name": "String",
  "email": "String",
  "mobile_number": "String",
  "city": "String",
  "interested_course_id": "ObjectId (ref courses, Nullable)",
  "status_id": "ObjectId (ref lead_status)",
  "assigned_to_staff_id": "ObjectId (ref staff, Nullable)",
  "submitted_at": "Date",
  "updated_at": "Date"
}
```

### QUESTIONS (`questions`)
Stores question fields shown inside Step 2 and Step 3.

```json
{
  "question_id": "ObjectId (PK)",
  "question_text": "String",
  "step_number": "Number (2 | 3)",
  "field_type": "String (text | dropdown | radio | checkbox)",
  "options": "String",
  "is_required": "Boolean",
  "is_active": "Boolean",
  "created_at": "Date"
}
```

### LEAD_RESPONSES (`lead_responses`)
Stores the dynamic answers to student questions.
*   **Indices**: Compound index `{ lead_id: 1, question_id: 1 }` (guarantees a single answer per question per student).

```json
{
  "response_id": "ObjectId (PK)",
  "lead_id": "ObjectId (ref leads)",
  "question_id": "ObjectId (ref questions)",
  "response_value": "String",
  "created_at": "Date"
}
```

### FEEDBACK_RESPONSES (`feedback_responses`)
Follow-up log detailing telephone conversations, notes, and callbacks.
*   **Indices**: Index on `lead_id`, `next_follow_up_date`.

```json
{
  "feedback_id": "ObjectId (PK)",
  "lead_id": "ObjectId (ref leads)",
  "staff_id": "ObjectId (ref staff)",
  "feedback_text": "String",
  "next_follow_up_date": "Date (Nullable)",
  "created_at": "Date"
}
```

### AUDIT_LOGS (`audit_logs`)
Monitors sensitive operations.
*   **Indices**: TTL Index on `timestamp` (auto-delete logs older than 90 days).

```json
{
  "audit_id": "ObjectId (PK)",
  "staff_id": "ObjectId (ref staff)",
  "action": "String (e.g. LEAD_EXPORT)",
  "details": "String",
  "timestamp": "Date"
}
```

---

## 5. Query Tuning & Performance

To optimize database access, developers must execute queries using index prefix rules:
1.  **Preventing In-Memory Sorts**:
    Any listing queried for receptionist lists must be sorted using an existing index path to avoid MongoDB's 32MB sort limit:
    *   Index configuration: `db.leads.createIndex({ assigned_to_staff_id: 1, submitted_at: -1, status_id: 1 })`
    *   Query structure: `db.leads.find({ assigned_to_staff_id: id }).sort({ submitted_at: -1 })`
2.  **Partial Index for Unassigned Leads**:
    Since unassigned leads are frequently queried for redirection:
    *   Index configuration: `db.leads.createIndex({ submitted_at: -1 }, { partialFilterExpression: { assigned_to_staff_id: { $exists: false } } })`
