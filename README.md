# AI Employee Analytics System

A full-stack MERN application that serves as a professional dashboard to manage employees and analyze their career progression using AI. Built with React + Vite on the frontend and Node.js + Express on the backend, integrated with MongoDB Atlas and OpenRouter AI API.

## Features

- **Modern Dark Dashboard**: Professional UI built with plain CSS and Lucide React icons.
- **Employee Management**: Register, view, and delete employee records.
- **Performance Analytics**: Visual bar charts using Recharts.
- **Match & Rank System**: Filter employees based on required skills and experience, generating a match score.
- **AI Career Analysis**: Uses DeepSeek AI via OpenRouter to analyze an employee's profile, providing suitable roles, missing skills, and promotion recommendations.

## Tech Stack

- **Frontend**: React.js, Vite, Axios, Recharts, Lucide React
- **Backend**: Node.js, Express.js, Mongoose, OpenAI SDK
- **Database**: MongoDB Atlas
- **AI Integration**: OpenRouter API (deepseek/deepseek-chat)

## Setup Instructions

### 1. Clone the repository
Navigate to the root folder of this project in your terminal.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your credentials in `backend/.env`:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `OPENROUTER_API_KEY`: Your API key from OpenRouter.
5. Start the backend server:
   ```bash
   node server.js
   # or npm run dev if nodemon is installed
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Deployment Instructions

### Deploying the Backend (Render / Heroku)
1. Push your code to a GitHub repository.
2. Create a new Web Service on Render (or similar platform).
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Set the Build Command to `npm install`.
6. Set the Start Command to `node server.js`.
7. Add your Environment Variables (`MONGO_URI`, `OPENROUTER_API_KEY`).
8. Deploy!

### Deploying the Frontend (Vercel / Netlify)
1. Since Vite is used, the build folder is `dist`.
2. Connect your GitHub repository to Vercel.
3. Set the Root Directory to `frontend`.
4. Vercel should automatically detect Vite.
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Important**: You must update the `API_BASE_URL` in `frontend/src/App.jsx` from `http://localhost:5000/api` to your deployed backend URL before deploying, or set it via environment variables (`VITE_API_BASE_URL`).
6. Deploy!
