# Logger Middleware (`/middleware/logger`)

## Purpose
Logs incoming HTTP requests (using Morgan) and system errors/info events (using Winston) to logs/ directory.

## Implementation Guidelines
- Integrate Morgan middleware for console logging of HTTP requests in development.
- Configure Winston for file-based logging (errors and info logs).
- Ensure sensitive data (like passwords, auth tokens, and specific PII) is redacted from logs before they are written.
