# Ethara Assignment - Task Manager Application

This is a full-stack web application built for the Ethara Assignment, featuring project management, task assignment, and role-based access control.

## 🚀 Live Demo
**Live URL:** [Insert Railway URL here after deployment]

## 🛠️ Technology Stack
- **Frontend:** React (Vite, JSX), Vanilla CSS (Glassmorphism UI), React Router, Context API.
- **Backend:** Node.js, Express, JSON Web Tokens (JWT).
- **Database:** MongoDB (Mongoose).

## ✨ Features
1. **Authentication:** Secure signup and login with JWT.
2. **Role-Based Access Control:** 
   - **Admins** can create projects and assign tasks.
   - **Members** can view tasks, update their task statuses.
3. **Project & Team Management:** Group tasks by project.
4. **Task Tracking:** Dashboard showing total, completed, pending, and overdue tasks.
5. **Modern UI:** Premium, dynamic aesthetic with glassmorphism, micro-animations, and a sleek dark theme.

## ⚙️ Local Development

### 1. Database Setup
The backend is configured to use a local MongoDB instance by default (`mongodb://127.0.0.1:27017/taskmanager`). Make sure MongoDB is running locally, or provide a `MONGODB_URI` environment variable.

### 2. Running Locally
Run the backend:
```bash
cd backend
npm install
npm start
```

Run the frontend:
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Railway Deployment Instructions (Mandatory)

To deploy this application to Railway and get your Live URL:

1. **Push to GitHub:**
   - Initialize a git repository in this folder: `git init`
   - Add all files: `git add .`
   - Commit: `git commit -m "Initial commit"`
   - Push to your GitHub repository.

2. **Deploy on Railway:**
   - Log in to [Railway.app](https://railway.app/).
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Select your repository.
   - **Add Database:** Right-click on the Railway canvas -> **New** -> **Database** -> **MongoDB**.
   - **Link Environment Variables:** In your web service settings, go to **Variables**, and add `MONGODB_URI` with the connection string from the MongoDB service you just created. Also add `JWT_SECRET` (e.g., `supersecretkey`).
   - Railway will automatically detect the root `package.json`, run the `build` script (which builds the frontend and installs backend dependencies), and run the `start` script to serve the application on port 5000.
   - Go to your web service settings -> **Networking** -> **Generate Domain**. This is your Live URL.

Enjoy your fully functional Task Manager!
