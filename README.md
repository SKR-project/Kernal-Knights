
Team Name:Kernal Knights

Problem statement: 3.ReWear – Community Clothing Exchange

Team Leader:

Name: Santhosh Kumar R

Mail Id: santhoshraj7117@gmail.com

Ph no: 9043437309


Member 1:

  Name:Subash GS
  
  Mail Id: gssubash2.0@gmail.com
  
  Ph no: 6383436848
  

Member 2:

  Name:Manoj Kumar S
  
  Mail Id: manojkumar06cse@gmail.com
  
  Ph no: 8608012398
  

Member 3:

  Name: Sakthivel R
  
  Mail Id: sakthivelr1679@gmail.com
  
  Ph no: 8015801133

## Our Proposed solution which developed as a product(Website), which it explains how it works seamlessly and the features of the REWEAR

ReWear is a community clothing exchange web application focused on sustainable fashion. The platform enables users to list, browse, and swap clothing items while promoting sustainable fashion practices.

## Key Features Implemented

### Backend (Node.js + Express + TypeScript)

- Authentication System: JWT-based auth with user registration/login

- Database: SQLite with tables for users, items, swaps, notifications, comments

- File Upload: Multer integration for image handling

- Real-time Communication: Socket.io for live notifications and updates

- Admin System: Role-based access control with moderation capabilities

- API Endpoints: Complete REST API for all platform operations

### Frontend (React + TypeScript + Tailwind CSS)

- User Interface: Modern, responsive design with Tailwind CSS

- Authentication: Login/register pages with form validation

- Dashboard: User profile management and item overview

- Item Management: Browse, add, and manage clothing items

- Real-time Notifications: Bell icon with dropdown for unread notifications

- Admin Panel: Moderation tools for managing users and content

## Technical Architecture

### Backend Structure

backend/

├── src/

│   ├── config/          # Database and server configuration

│   ├── middleware/       # Auth and validation middleware

│   ├── routes/          # API route handlers

│   ├── services/        # Business logic

│   └── types/           # TypeScript type definitions

├── uploads/             # File storage

└── database.sqlite      # SQLite database

### Frontend Structure

frontend/

├── src/

│   ├── components/      # Reusable UI components

│   ├── contexts/        # React contexts (auth, notifications)

│   ├── pages/          # Application pages

│   ├── services/       # API integration

│   └── types/          # TypeScript interfaces

## Core Features

### User Management

- Registration and login with JWT authentication

- User profiles with avatar uploads

- Role-based access (user/admin)

### Item Management

- Add clothing items with images and descriptions

- Browse items with filtering and search

- Item detail pages with swap functionality

- Image upload and storage

### Swap System

- Request swaps between users

- Accept/reject swap requests

- Swap history tracking

### Notifications

- Real-time notifications via Socket.io

- Unread notification counter

- Notification dropdown with recent items

- Email-style notification system

### Admin Features

- User management and moderation

- Content moderation capabilities

- Admin dashboard with statistics

## Technical Implementation Details

### Database Schema

- Users: id, username, email, password_hash, role, avatar, created_at

- Items: id, user_id, title, description, category, size, condition, images, status

- Swaps: id, requester_id, item_id, status, created_at

- Notifications: id, user_id, type, message, is_read, created_at

- Comments: id, item_id, user_id, content, created_at

### Real-time Features

- Socket.io integration for live updates

- Notification broadcasting

- Real-time chat capabilities (prepared)

### Notifications

- Real-time notifications via Socket.io

- Unread notification counter

- Notification dropdown with recent items

- Email-style notification system

### Admin Features

- User management and moderation

- Content moderation capabilities

- Admin dashboard with statistics

## Technical Implementation Details

### Database Schema

- Users: id, username, email, password_hash, role, avatar, created_at

- Items: id, user_id, title, description, category, size, condition, images, status

- Swaps: id, requester_id, item_id, status, created_at

- Notifications: id, user_id, type, message, is_read, created_at

- Comments: id, item_id, user_id, content, created_at

### Real-time Features

- Socket.io integration for live updates

- Notification broadcasting

- Real-time chat capabilities (prepared)

## Dependencies Resolved

- Fixed TypeScript version conflict (downgraded to 4.9.5 for React compatibility)

- Installed all necessary packages for both frontend and backend

- Configured development scripts and build processes

## Current Status

The platform is fully functional with:

- Complete user authentication system

- Item listing and management

- Real-time notifications

- Admin moderation tools

- Responsive design

- File upload capabilities

- Swap functionality

The application is ready for testing and deployment, with all core features implemented and working together seamlessly.

## Attached some interactive snaps of the REWEAR

![Login Page of REWEAR Website](https://github.com/user-attachments/assets/c03fce8f-43a1-4238-9901-dbbbd97c0f12)

![landing page of the REWEAR Website](https://github.com/user-attachments/assets/937c0fb2-a7e2-4913-8343-cc51f526b56d)


To run this ReWear project on your local machine, here are the steps you need right now:
Prerequisites

    Node.js (version 18 or higher) - Download from nodejs.org
    Git - Download from git-scm.com
    PostgreSQL - Download from postgresql.org

Setup Steps
1. Clone the Repository

git clone <your-repo-url>
cd rewear-project

2. Install Dependencies

npm install

3. Set Up Database

First, create a PostgreSQL database:

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE rewear_db;
\q

4. Environment Variables

Create a .env file in the root directory:

DATABASE_URL=postgresql://username:password@localhost:5432/rewear_db
SESSION_SECRET=your-super-secret-session-key-here
REPL_ID=your-app-id
REPLIT_DOMAINS=localhost:5000
ISSUER_URL=https://replit.com/oidc
NODE_ENV=development

Replace:

    username and password with your PostgreSQL c

