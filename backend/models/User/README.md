# User Model (/models/User)

## Purpose
Defines the Mongoose Schema for the application users (Admin, Receptionist).

## Fields Schema
- 
ame: String (Required)
- email: String (Required, Unique, Indexed)
- password: String (Required, Hashed)
- 
ole: ObjectId ref 'Role' (Required)
- status: String enum ['active', 'inactive']

## Guidelines
- Use Mongoose pre-save hook to hash passwords using crypt.
- Exclude password field from default JSON transformations.
