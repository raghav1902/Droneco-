# Lead Model (/models/Lead)

## Purpose
Defines the Schema for inquiry leads submitted by students via the QR code form.

## Fields Schema
- **Step 1: Basic Info**
  - ullName: String (Required)
  - email: String (Required, Index)
  - mobileNumber: String (Required, Index)
  - city: String (Required)
- **Step 2: Course Info**
  - qualification: String
  - currentClass: String
  - interestedCourse: String (Required)
  - interestedSubject: String
  - preferredBatch: String
  - learningMode: String enum ['online', 'offline', 'hybrid']
- **Step 3: Additional Info**
  - queries: String
  - careerGoal: String
  - emarks: String
- **Metadata**
  - status: String enum ['new', 'contacted', 'enrolled', 'not_interested']
  - ssignedTo: ObjectId ref 'User'
  - submittedAt: Date (Default: Date.now)

## Guidelines
- Add indexes on email, mobileNumber, and status to ensure fast search.
