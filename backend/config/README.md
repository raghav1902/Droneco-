# Backend Configuration Module (/config)

## Purpose
This directory stores application configuration modules that parse and validate environment variables. 

## Files to Create (Placeholder)
- db.config.js: DB connection configs.
- jwt.config.js: Keys, encryption algorithms, and expirations.
- logger.config.js: Winston log formatting and level settings.

## Guidelines
- Centralize all configurations. Never access process.env directly in services or controllers; always export from this directory.
