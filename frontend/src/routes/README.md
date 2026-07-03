# Routes Configuration (/src/routes)

## Purpose
Handles navigation flow, lazy-loading of pages, and routing restrictions.

## Files to Create (Placeholder)
- AppRoutes.jsx: Combines public and private paths using React Router.
- ProtectedRoute.jsx: Guards receptionist and admin dashboard paths; redirects unauthenticated users to /login.
- AdminRoute.jsx: Restricts access to Admin-only views; redirects unauthorized receptionists to their dashboard.
