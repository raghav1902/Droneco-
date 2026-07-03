# Authorization Middleware (/middleware/authorization)

## Purpose
Performs role-based access checks. Receives allowed roles and checks eq.user.role.

## Usage
uthorize(['Admin']) -> Guards admin-only routes.
uthorize(['Admin', 'Receptionist']) -> Guard shared routes.
