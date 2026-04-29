# CS351 Final Project - Task Management Application

## Project Overview

This project is a full-stack task management application built for our CS351 final project. The goal of the app is to help users organize their daily work by creating tasks, grouping them into lists, and setting reminders.

The system includes a backend API built with Node.js and Express, and a frontend built with React. The backend handles authentication, data storage, and all API requests, while the frontend provides the user interface and navigation.

---

## Features

- User login and logout with authentication
- Secure access using Bearer tokens
- Create, update, complete, and delete tasks
- Filter tasks by status, due date, priority, and list
- Organize tasks into custom lists
- View tasks inside specific lists
- Create and manage reminders for tasks
- View and update user profile
- Protected frontend routes (only logged-in users can access main pages)
- Task detail page for viewing individual tasks

---

## Tech Stack

### Backend
- Node.js
- Express.js
- bcryptjs
- CORS

### Frontend
- React
- React Router
- Vite

### Tools
- GitHub
- VS Code

---

## API Overview

All API routes are versioned under:


### Authentication
- POST `/v1/auth/login`
- POST `/v1/auth/logout`
- GET `/v1/auth/me`
- PATCH `/v1/auth/me`

### Tasks
- GET `/v1/tasks`
- POST `/v1/tasks`
- GET `/v1/tasks/:id`
- PATCH `/v1/tasks/:id`
- PATCH `/v1/tasks/:id/complete`
- DELETE `/v1/tasks/:id`

Supports filtering by:
- status (pending or completed)
- priority (low, medium, high)
- due dates
- list

### Lists
- GET `/v1/lists`
- POST `/v1/lists`
- GET `/v1/lists/:id/tasks`
- PATCH `/v1/lists/:id`
- DELETE `/v1/lists/:id`

### Reminders
- GET `/v1/tasks/:taskId/reminders`
- POST `/v1/tasks/:taskId/reminders`
- PATCH `/v1/tasks/:taskId/reminders/:id`
- DELETE `/v1/tasks/:taskId/reminders/:id`

---

## Frontend Routes

- `/login` – login page
- `/tasks` – main tasks page
- `/tasks/:id` – task details
- `/lists` – lists page
- `/profile` – user profile

All main routes are protected and require login.

---

## How to Run the Project

### Backend

```bash
cd API
npm install
npm start
