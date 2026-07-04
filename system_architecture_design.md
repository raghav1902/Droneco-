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
.  
 + - - -   . g i t i g n o r e  
 + - - -   b a c k e n d  
 |       + - - -   a p p . j s  
 |       + - - -   c o n f i g  
 |       |       \ - - -   R E A D M E . m d  
 |       + - - -   c o n s t a n t s  
 |       |       \ - - -   R E A D M E . m d  
 |       + - - -   c o n t r o l l e r s  
 |       |       + - - -   A d m i n  
 |       |       |       + - - -   R E A D M E . m d  
 |       |       |       \ - - -   s t a t s C o n t r o l l e r . j s  
 |       |       + - - -   A u t h  
 |       |       |       + - - -   a u t h C o n t r o l l e r . j s  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   L e a d  
 |       |       |       + - - -   c o u r s e C o n t r o l l e r . j s  
 |       |       |       + - - -   l e a d C o n t r o l l e r . j s  
 |       |       |       + - - -   q u e s t i o n C o n t r o l l e r . j s  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       \ - - -   R e c e p t i o n i s t  
 |       |               \ - - -   R E A D M E . m d  
 |       + - - -   d a t a b a s e  
 |       |       + - - -   R E A D M E . m d  
 |       |       \ - - -   s t o r e . j s  
 |       + - - -   d o c s  
 |       |       \ - - -   d a t a b a s e _ e r _ d i a g r a m . m d  
 |       + - - -   l o g s  
 |       |       \ - - -   R E A D M E . m d  
 |       + - - -   m i d d l e w a r e  
 |       |       + - - -   a u t h e n t i c a t i o n  
 |       |       |       + - - -   a u t h M i d d l e w a r e . j s  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   a u t h o r i z a t i o n  
 |       |       |       + - - -   R E A D M E . m d  
 |       |       |       \ - - -   r o l e M i d d l e w a r e . j s  
 |       |       + - - -   e r r o r H a n d l e r  
 |       |       |       + - - -   e r r o r H a n d l e r . j s  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       \ - - -   l o g g e r  
 |       |               \ - - -   R E A D M E . m d  
 |       + - - -   m o d e l s  
 |       |       + - - -   C o u r s e  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   F e e  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   L e a d  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   P a y m e n t  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   R o l e  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       \ - - -   U s e r  
 |       |               \ - - -   R E A D M E . m d  
 |       + - - -   p a c k a g e - l o c k . j s o n  
 |       + - - -   p a c k a g e . j s o n  
 |       + - - -   r o u t e s  
 |       |       + - - -   a d m i n  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   a d m i n . j s  
 |       |       + - - -   a u t h  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   a u t h . j s  
 |       |       + - - -   c o u r s e s . j s  
 |       |       + - - -   l e a d  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   l e a d s . j s  
 |       |       + - - -   q u e s t i o n s . j s  
 |       |       \ - - -   r e c e p t i o n i s t  
 |       |               \ - - -   R E A D M E . m d  
 |       + - - -   s e r v i c e s  
 |       |       + - - -   a d m i n  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   a u t h  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   f e e  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   l e a d  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   p a y m e n t  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       \ - - -   u s e r  
 |       |               \ - - -   R E A D M E . m d  
 |       + - - -   u t i l s  
 |       |       \ - - -   R E A D M E . m d  
 |       \ - - -   v a l i d a t o r s  
 |               \ - - -   R E A D M E . m d  
 + - - -   f r o n t e n d  
 |       + - - -   c o m p o n e n t s . j s o n  
 |       + - - -   i n d e x . h t m l  
 |       + - - -   j s c o n f i g . j s o n  
 |       + - - -   p a c k a g e - l o c k . j s o n  
 |       + - - -   p a c k a g e . j s o n  
 |       + - - -   p o s t c s s . c o n f i g . j s  
 |       + - - -   p u b l i c  
 |       + - - -   R E A D M E . m d  
 |       + - - -   s r c  
 |       |       + - - -   a d m i n  
 |       |       |       + - - -   A d m i n D a s h b o a r d . j s x  
 |       |       |       + - - -   c o m p o n e n t s  
 |       |       |       |       + - - -   D i s c o u n t M a n a g e m e n t . j s x  
 |       |       |       |       + - - -   F e e D a s h b o a r d . j s x  
 |       |       |       |       + - - -   F e e R u l e s . j s x  
 |       |       |       |       + - - -   F e e S t r u c t u r e . j s x  
 |       |       |       |       + - - -   R e p o r t s . j s x  
 |       |       |       |       \ - - -   s e t t i n g s  
 |       |       |       |               \ - - -   A d m i n S e t t i n g s . j s x  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   a p i  
 |       |       |       + - - -   a p i . j s  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   A p p . j s x  
 |       |       + - - -   a s s e t s  
 |       |       |       + - - -   D r o n e c o . j p g  
 |       |       |       \ - - -   D r o n e C o _ L o g o - c o p y . p n g  
 |       |       + - - -   c o m p o n e n t s  
 |       |       |       + - - -   R E A D M E . m d  
 |       |       |       \ - - -   u i  
 |       |       |               + - - -   b a d g e . j s x  
 |       |       |               + - - -   b u t t o n . j s x  
 |       |       |               + - - -   c a r d . j s x  
 |       |       |               + - - -   d i a l o g . j s x  
 |       |       |               + - - -   d r o p d o w n - m e n u . j s x  
 |       |       |               + - - -   i n p u t . j s x  
 |       |       |               + - - -   s e l e c t . j s x  
 |       |       |               + - - -   t a b l e . j s x  
 |       |       |               + - - -   t a b s . j s x  
 |       |       |               + - - -   t o a s t . j s x  
 |       |       |               \ - - -   t o a s t e r . j s x  
 |       |       + - - -   c o n s t a n t s  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   c o n t e x t  
 |       |       |       + - - -   A u t h C o n t e x t . j s x  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   f o r m s  
 |       |       |       + - - -   R E A D M E . m d  
 |       |       |       + - - -   R e v i e w  
 |       |       |       |       \ - - -   i n d e x . j s x  
 |       |       |       + - - -   S t e p 1  
 |       |       |       |       \ - - -   i n d e x . j s x  
 |       |       |       + - - -   S t e p 2  
 |       |       |       |       \ - - -   i n d e x . j s x  
 |       |       |       + - - -   S t e p 3  
 |       |       |       |       \ - - -   i n d e x . j s x  
 |       |       |       + - - -   S t u d e n t F o r m . j s x  
 |       |       |       \ - - -   S u c c e s s  
 |       |       |               \ - - -   i n d e x . j s x  
 |       |       + - - -   h o o k s  
 |       |       |       + - - -   R E A D M E . m d  
 |       |       |       \ - - -   u s e - t o a s t . j s  
 |       |       + - - -   i n d e x . c s s  
 |       |       + - - -   l a y o u t s  
 |       |       |       + - - -   A p p L a y o u t . j s x  
 |       |       |       + - - -   P a g e H e a d e r . j s x  
 |       |       |       + - - -   R E A D M E . m d  
 |       |       |       \ - - -   S i d e b a r . j s x  
 |       |       + - - -   l i b  
 |       |       |       \ - - -   u t i l s . j s  
 |       |       + - - -   m a i n . j s x  
 |       |       + - - -   p a g e s  
 |       |       |       + - - -   a d m i n  
 |       |       |       + - - -   a u t h  
 |       |       |       |       \ - - -   L o g i n . j s x  
 |       |       |       + - - -   f o r m  
 |       |       |       + - - -   R E A D M E . m d  
 |       |       |       \ - - -   r e c e p t i o n i s t  
 |       |       + - - -   r e c e p t i o n i s t  
 |       |       |       + - - -   c o m p o n e n t s  
 |       |       |       |       + - - -   a d m i s s i o n s  
 |       |       |       |       |       \ - - -   A d m i s s i o n W i z a r d . j s x  
 |       |       |       |       + - - -   C o l l e c t F e e . j s x  
 |       |       |       |       + - - -   D u e L i s t . j s x  
 |       |       |       |       + - - -   P a y m e n t H i s t o r y . j s x  
 |       |       |       |       + - - -   R e c e i p t P a g e . j s x  
 |       |       |       |       + - - -   R e c e p t i o n D a s h b o a r d . j s x  
 |       |       |       |       + - - -   s e t t i n g s  
 |       |       |       |       |       \ - - -   R e c e p t i o n S e t t i n g s . j s x  
 |       |       |       |       + - - -   S t u d e n t L e a d s . j s x  
 |       |       |       |       + - - -   s t u d e n t s  
 |       |       |       |       |       + - - -   S t u d e n t P r o f i l e . j s x  
 |       |       |       |       |       \ - - -   S t u d e n t s L i s t . j s x  
 |       |       |       |       \ - - -   S t u d e n t S e a r c h . j s x  
 |       |       |       + - - -   R E A D M E . m d  
 |       |       |       \ - - -   R e c e p t i o n i s t D a s h b o a r d . j s x  
 |       |       + - - -   r o u t e s  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   s e r v i c e s  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   s t y l e s  
 |       |       |       \ - - -   R E A D M E . m d  
 |       |       + - - -   u t i l s  
 |       |       |       + - - -   R E A D M E . m d  
 |       |       |       \ - - -   t o a s t . j s  
 |       |       \ - - -   v a l i d a t i o n s  
 |       |               \ - - -   R E A D M E . m d  
 |       + - - -   t a i l w i n d . c o n f i g . j s  
 |       \ - - -   v i t e . c o n f i g . j s  
 + - - -   g e n _ s t r u c t u r e . j s  
 + - - -   R E A D M E . m d  
 \ - - -   s y s t e m _ a r c h i t e c t u r e _ d e s i g n . m d  
 