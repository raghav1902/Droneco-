# Frontend Application: React.js SPA (/frontend)

This is the client-facing single-page application (SPA) for the Coaching Institute Lead Management System built with React.js and Vite.

## Architecture Guidelines
- **Component Design**: Build atomic, highly reusable UI components inside src/components.
- **State Management**: Utilize Context API (src/context) for global states like Auth and the Multi-Step form wizard.
- **Styling**: Standardize theme tokens in src/styles/variables.css. Avoid ad-hoc styling; always inherit from variables.
- **Routing**: Guard protected paths (Admin/Receptionist dashboards) using Route Guards in src/routes.
