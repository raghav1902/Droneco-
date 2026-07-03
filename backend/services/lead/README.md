# Lead Service (`/services/lead`)

## Purpose
Core business logic for lead processing, data filtering, and role-based data projection.

## Methods (Placeholder)
- `registerLead(leadData)`: Ingests new lead and saves it to MongoDB.
- `listLeadsForAdmin()`: Fetches all leads.
- `listLeadsForReceptionist()`: Fetches leads projecting only `fullName`, `email`, and `mobileNumber`.
- `updateStatus(leadId, status)`: Validates and updates status.

## Guidelines
- Service layer contains all business rules (e.g., duplicate checks on lead mobile numbers).
- Never return fields like `remarks` or `queries` to a receptionist request; sanitize the payload at the service level.
