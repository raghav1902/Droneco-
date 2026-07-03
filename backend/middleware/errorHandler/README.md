# Centralized Error Handler Middleware (/middleware/errorHandler)

## Purpose
Catches all errors thrown from controllers/services, formats them, and returns standard JSON error responses.

## Structure
Checks if error is a:
- Custom Operational Error
- Mongoose Validation/Duplicate Key Error
- JWT Expired/Invalid Error
And formats them into standard structure: { success: false, message: string, errors: array }
"@

System.Collections.Hashtable["backend/middleware/logger/README.md"] = @"
# Logger Middleware (/middleware/logger)

## Purpose
Logs incoming HTTP requests (using Morgan) and system errors/info events (using Winston) to logs/ directory.
