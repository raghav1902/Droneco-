# Role Model (/models/Role)

## Purpose
Defines the Mongoose Schema for RBAC (Role-Based Access Control).

## Fields Schema
- 
ame: String (Required, unique enum ['Admin', 'Receptionist'])
- permissions: Array of Strings (Pre-defined action strings)

## Guidelines
- Keep roles simple. In this system, only two roles exist:
  - Admin: Can perform CRUD on users, view all lead details, and edit configurations.
  - Receptionist: Can view only public lead details (Name, Email, Contact Number) and update lead statuses.
