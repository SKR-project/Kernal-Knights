Team Name: Kernal Knights
Problem Statement: 3. ReWear – Community Clothing Exchange

## Team Members:

Santhosh Kumar R (Team Leader)
Email: santhoshraj7117@gmail.com | Phone: 9043437309

Subash GS
Email: gssubash2.0@gmail.com | Phone: 6383436848

Manoj Kumar S
Email: manojkumar06cse@gmail.com | Phone: 8608012398

Sakthivel R
Email: sakthivelr1679@gmail.com | Phone: 8015801133

## About ReWear
ReWear is a web platform for community-based clothing exchange, promoting sustainable fashion. Users can list, browse, and swap clothes with others in their community.

## Features Overview
Backend (Node.js + Express + TypeScript)
 -JWT Authentication

 -SQLite Database (users, items, swaps, notifications, comments)

 -File uploads via Multer

 -Real-time updates with Socket.io

 -Role-based Admin system

 -Full REST API

Frontend (React + TypeScript + Tailwind CSS)
 -Responsive, modern UI

 -Login and registration with validation

 -User dashboard and item listings

 -Real-time notifications

 -Admin panel for moderation

## Project Structure

Backend

backend/
├── src/
│   ├── config/         # DB & server config
│   ├── middleware/     # Auth/validation
│   ├── routes/         # API routes
│   ├── services/       # Core logic
│   └── types/          # TypeScript types
├── uploads/            # Uploaded images
└── database.sqlite     # SQLite DB

Frontend

frontend/
├── src/
│   ├── components/     # Reusable UI
│   ├── contexts/       # Global state (auth, notifications)
│   ├── pages/          # Main views
│   ├── services/       # API integration
│   └── types/          # TS interfaces

Core Functionalities
User Management
 -Register and login with JWT

 -User profiles with avatar uploads

 -Role-based access for users and admins

Item Management
 -Add clothing items with images

- Browse and filter items

- Swap request system

Swap System
 -Send, accept, or reject swap requests

 -Track swap history

Notifications
 -Real-time updates using Socket.io

 -Unread count with dropdown display

Admin Tools
 -Manage users and content

 -Admin dashboard with statistics

## Attached some interactive snaps of the REWEAR

![Login Page of REWEAR Website](https://github.com/user-attachments/assets/c03fce8f-43a1-4238-9901-dbbbd97c0f12)

![landing page of the REWEAR Website](https://github.com/user-attachments/assets/937c0fb2-a7e2-4913-8343-cc51f526b56d)

