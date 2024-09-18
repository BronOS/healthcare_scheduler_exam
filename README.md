# 24-Hour Healthcare Scheduler Exam

## Objective

This exam is designed to simulate daily tasks at Labfinder.

1. Create a user-friendly healthcare appointment scheduling system using Next.js and TypeScript, focusing primarily on
   backend development with API calls for all functionality.
2. Create an ideal data structure to facilitate this flow
3. Complete all work in a public facing github repo. Send us back a zip file of the repo contents to run locally for
   evaluation.
4. How would you improve this system given more time?

## Context

Our users want to book tests at facilities, we must be able to handle both their need to find appointments near them,
and that are convenient for their schedule. Depending on the test, a user may need to go to a different facility that
offers the test they want.

## Tech Stack

- Frontend & Backend: Next.js 14+ with App Router
- API: Your choice of GraphQL (with Apollo) or REST
- UI: Shadcn UI components (https://ui.shadcn.com/) (optional for frontend)
- Database: Your choice of a simple text file-based solution or a NoSQL database
- Language: TypeScript

## User Expectations and Core Features

### Anonymous User

1. View a list of healthcare providers
2. See available appointment times for each provider
3. Reserve an appointment time without creating an account
4. Receive a unique reservation code for reference

### Registered User (optional)

1. Create an account (name, email, password)
2. Log in to the account
3. View personal appointment history
4. Cancel or reschedule existing appointments

### Healthcare Provider

1. View upcoming appointments (no login required for this challenge)

## Core Requirements

### Backend (Next.js API Routes)

1. Set up API routes for all necessary operations (GraphQL or REST)
2. Implement data storage solution (text file or NoSQL database)
3. Create endpoints/resolvers for:
    - Fetching providers and their available times
    - Reserving appointments
    - Fetching, canceling, and rescheduling appointments
    - User registration and authentication (optional)

### Frontend (Next.js with Shadcn UI) - Optional

1. Implement core pages/features if time permits
2. Use Shadcn UI components for a consistent look
3. Ensure responsive design for mobile and desktop
4. Implement client-side form validation

### Data Models

```typescript
interface Provider {
    id: string;
    facilityName: string;
    doctorName: string;
    specialty: string;
    availableHours: string[];
}

interface Appointment {
    id: string;
    providerId: string;
    dateTime: string;
    userEmail?: string;  // Optional for anonymous bookings
    reservationCode: string;
}

interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
}
```

## Evaluation Criteria

- Fulfillment of core user expectations
- Proper use of Next.js features (App Router, API Routes)
- TypeScript usage and type safety
- Code quality and project structure
- Choice and implementation of API style (GraphQL or REST)
- Simplicity and effectiveness of data storage solution

## Bonus Points (Time Permitting)

- Add unit or integration tests for critical paths
- Implement user interface with Shadcn UI components
- Basic security measures (authentication, input validation)
- Enhance error handling and user feedback

## Submission Guidelines

1. GitHub repository link
2. README file with:
    - Setup instructions
    - Explanation of technical choices (API style, database solution)
    - List of implemented features and any known limitations
    - Instructions for running the application locally
    - If you had more time, what else would you like to do with this project?
    - API documentation (endpoints/resolvers, request/response formats)
3. (Optional) Vercel deployment link

Focus on delivering a functional backend of core features before attempting any bonus features. Good luck!

Note: Manage your time wisely. Prioritize core functionality over optional features. It's better to have a fully
functional API with limited features than a partially complete solution with many unfinished components.