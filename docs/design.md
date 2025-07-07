# GymTrack Web App Design

This document outlines a high level plan to build a web-based gym tracking application.

## Tech Stack
- **Frontend:** Next.js (React) for a modern SPA with server-side rendering.
- **Backend:** Node.js with Express for REST APIs.
- **Database:** PostgreSQL via an ORM like Prisma or Sequelize.
- **Authentication:** email/password and optional Google OAuth (using Passport.js).
- **Hosting:** Vercel or Railway for backend and frontend deployments.

## Core Features
1. **User Accounts**
   - Individual login via email/password or Google.
   - Each user stores their own data in the database.

2. **Exercise Management**
   - CRUD operations for exercises (name, category). Examples of categories: *Full Body*, *Power*, *Lower Body*.
   - Ability to add, delete, and modify exercise entries.

3. **Workout Logging**
   - Record weight, reps x sets, date performed, and optional notes.
   - Persist logs in the database with relations back to the user and exercise.

4. **Historical Tracking**
   - Filter history per exercise or per week.
   - Display progress using tables or charts (Chart.js).

5. **Workout Planning**
   - Enter or edit planned workouts by week.
   - Check off completed weights and auto-fill last week’s entries if desired.

6. **Interface**
   - Mobile-friendly design with a dark/light mode toggle.
   - Dashboard sections: *Today’s Plan*, *Add Entry*, *View History*, *Compare Progress*.

## Basic Database Schema
```
User
  id (PK)
  email
  passwordHash
  googleId

Exercise
  id (PK)
  userId (FK -> User)
  name
  category

WorkoutLog
  id (PK)
  userId (FK -> User)
  exerciseId (FK -> Exercise)
  weight
  reps
  sets
  notes
  performedAt (date)

WorkoutPlan
  id (PK)
  userId (FK -> User)
  weekLabel

WorkoutPlanItem
  id (PK)
  planId (FK -> WorkoutPlan)
  exerciseId (FK -> Exercise)
  targetWeight
  reps
  sets
```

This schema is a starting point and can be adjusted as the app evolves.

## Setup Steps
1. Initialize a Next.js project (`npx create-next-app`).
2. Create an Express server for API routes (`/api`).
3. Configure PostgreSQL connection and models using an ORM.
4. Implement authentication routes and store sessions.
5. Build frontend pages for login, workout entry, history, and planning.
6. Deploy frontend and backend (Vercel or Railway). Once deployed, connect the database and start logging workouts.

