# Authentication Middleware (/middleware/authentication)

## Purpose
Validates the incoming JWT inside the HTTP Authorization header (Bearer <token>). Sets eq.user with decoded properties (userId, role).
