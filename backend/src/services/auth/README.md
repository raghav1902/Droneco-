# Authentication Service (/services/auth)

## Purpose
Encapsulates token operations and credentials verification.

## Methods (Placeholder)
- generateTokens(userPayload)
- erifyAccessToken(token)
- erifyRefreshToken(token)
"@

System.Collections.Hashtable["backend/services/lead/README.md"] = @"
# Lead Service (/services/lead)

## Purpose
Core business logic for lead processing and filtering.

## Methods (Placeholder)
- egisterLead(leadData): Ingests new lead.
- listLeadsForAdmin(): Fetches all leads.
- listLeadsForReceptionist(): Fetches leads projecting only ullName, email, and mobileNumber.
- updateStatus(leadId, status): Validates and updates status.
