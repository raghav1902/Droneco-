# Authentication Controller (/controllers/Auth)

## Purpose
Handles routes associated with user login, logout, and token refresh.

## Actions (Placeholder)
- login(req, res): Verifies credentials, retrieves role permissions, and returns JWT access and refresh tokens.
- logout(req, res): Invalidates refresh tokens.
- efreshToken(req, res): Issues new access token using a valid refresh token.
