# Custom Database Design & Entity Relationship (ER) Diagram

This document describes the schema design, field definitions, and relationships for the complete Coaching Institute Lead Management System database.

---

## 1. Entity-Relationship (ER) Diagram

Below is the complete ER diagram mapping out the entire system exactly as implemented in the backend models: Leads (Inquiries), Students, Fees, Payments, Parents, Courses, and other foundational collections.

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        String name
        String email "Unique, Indexed"
        String password "Hashed"
        String role "Admin | Receptionist"
        String status "active | inactive"
    }

    COURSES {
        ObjectId _id PK
        String courseName "Unique"
        String code "Unique"
        Number durationMonths
        Boolean isActive
    }
    
    PROGRAMS {
        ObjectId _id PK
        String name
        String code "Unique"
    LEADS {
        ObjectId _id PK
        String full_name
        String email
        String mobile_number
        ObjectId interested_course_id FK "ref COURSES"
        String status "Enum: New, Contacted, Interested, Not Interested, Enrolled"
        ObjectId assigned_to_staff_id FK "ref USERS"
        Date submitted_at
    }

    STUDENTS {
        ObjectId _id PK
        String student_id
        String enrollment_number
        ObjectId parent_id FK "ref PARENTS"
        ObjectId department_id FK "ref COURSES/PROGRAMS"
        ObjectId program_id FK "ref PROGRAMS"
        String status "ACTIVE | SUSPENDED | ALUMNI | DROPOUT"
    }

    PARENTS {
        ObjectId _id PK
        String primary_contact "FATHER | MOTHER | GUARDIAN"
    }

    FEES {
        ObjectId _id PK
        ObjectId lead_id FK "ref LEADS"
        ObjectId student_id FK "ref STUDENTS"
        ObjectId course_id FK "ref COURSES"
        Number total_amount
        Number net_payable
        Number paid_amount
        Number due_amount
        String status "Pending | Partial | Paid"
    }

    PAYMENTS {
        ObjectId _id PK
        ObjectId fee_id FK "ref FEES"
        ObjectId student_id FK "ref STUDENTS"
        Number amount_paid
        String payment_method "Cash | UPI | Card | Bank Transfer | Cheque"
        String receipt_number
        String status "SUCCESS | PENDING | FAILED | REFUNDED"
    }

    DISCOUNTRULES {
        ObjectId _id PK
        String name
        String type "Percentage | Flat"
        Number value
        Boolean is_active
    }

    SETTINGS {
        ObjectId _id PK
        String type "global"
    }

    QUESTIONS {
        ObjectId _id PK
        String questionText
        Number stepNumber
        String fieldType
    }

    FEEDBACKLOG {
        ObjectId _id PK
        ObjectId lead_id FK "ref LEADS"
        String staff_id FK "ref USERS"
        String feedback_text
        Date next_follow_up_date
    }

    %% Relationships
    USERS ||--o{ LEADS : "assigned_to"
    COURSES ||--o{ LEADS : "selected_in"
    
    LEADS ||--o{ FEEDBACKLOG : "receives"
    USERS ||--o{ FEEDBACKLOG : "writes"
    
    LEADS ||--o| STUDENTS : "converts_to"
    PARENTS ||--o{ STUDENTS : "has_child"
    COURSES ||--o{ STUDENTS : "enrolls"
    PROGRAMS ||--o{ STUDENTS : "enrolls_in_program"

    STUDENTS ||--o{ FEES : "assigned_to"
    LEADS ||--o{ FEES : "assigned_to (pre-admission)"
    COURSES ||--o{ FEES : "dictates_amount"

    FEES ||--o{ PAYMENTS : "receives"
    STUDENTS ||--o{ PAYMENTS : "makes"
```

---

## 2. Collection Schema Specifications

### Core Financial & Student Models (The "Post-Admission" Flow)

**Student Collection (`students`)**
Stores the official student record post-enrollment.
- **Foreign Keys**: `parent_id`, `department_id`, `program_id`.
- **Key Fields**: `enrollment_number` (Auto-generated), `personal_info`, `contact_info`, `academic_history`.
- **Note**: A lead converts into a student upon finalizing admission.

**Parent Collection (`parents`)**
Stores guardian contact info and links to children.
- **Key Fields**: `father`, `mother`, `guardian` objects, `primary_contact`.
- **Foreign Keys**: `children_ids` (Array of Student ObjectIds).

**Fee Collection (`fees`)**
Generates the ledger for a student's course.
- **Foreign Keys**: `lead_id`, `student_id`, `course_id`.
- **Key Fields**: `net_payable`, `paid_amount`, `due_amount`, `status` (Pending/Partial/Paid).

**Payment Collection (`payments`)**
Records individual transaction receipts against a Fee ledger.
- **Foreign Keys**: `fee_id`, `student_id`, `collected_by` (Users).
- **Key Fields**: `amount_paid`, `payment_method`, `receipt_number`, `transaction_id`.

**Discount Rule Collection (`discountrules`)**
Stores global discounts that can be applied to fees.
- **Key Fields**: `name`, `type` (Flat/Percentage), `value`, `is_active`.

**Settings Collection (`settings`)**
Stores global system configurations (e.g., fee grace periods, institute name, receipt prefixes).

**Program Collection (`programs`)**
Stores academic categorizations like Course Programs.

### Lead & Inquiry Models (The "Pre-Admission" Flow)

**User Collection (`users`)**
Admins and Receptionists.

**Courses Collection (`courses`)**
Offered programs.

**Leads Collection (`leads`)**
Prospects created from the inquiry form. Can convert into `Students`.
- **Status**: Stored as a simple Enum (`New`, `Contacted`, `Interested`, `Not Interested`, `Enrolled`), NOT as a separate collection.

**Questions (`questions`)**
Dynamic form engine questions for Step 2/3 of the inquiry. (Lead Responses are stored natively on the `Lead` document's `responses` array rather than a separate collection).

**FeedbackLog (`feedbacklogs`)**
Call logs and notes written by Staff regarding a Lead, plus `nextFollowUpDate`.
