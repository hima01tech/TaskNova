TaskNova Task Management Suite

TaskNova is a professional-grade, full-stack task management application featuring a modern, dark-themed interface. Developed with a focus on high-performance state management and secure data persistence, it combines a responsive React frontend with a robust Node.js/Express backend to provide a streamlined productivity ecosystem.

Core Features

Modern React/Tailwind Dashboard: High-performance UI utilizing glassmorphism design principles, CSS transitions, and micro-interactions for an optimized user experience.

Secure JWT Authentication: Industry-standard session management using JSON Web Tokens (JWT) and BcryptJS for sensitive data encryption.

RESTful API Integration: Fully decoupled architecture with structured API endpoints for task CRUD operations and user management.

Real-time Progress Tracking: Dynamic data visualization of task completion rates through calculated metrics and visual indicators.

Persistent Data Storage: Relational data modeling using MongoDB and Mongoose ODM for reliable performance and scalability.

Responsive Architecture: Mobile-first design implementation ensuring seamless functionality across all device form factors.

Technical Stack

Frontend: React (Hooks, Context API), Tailwind CSS, Lucide Icons, Canvas-Confetti.

Backend: Node.js, Express.js.

Database: MongoDB with Mongoose ODM.

Security: JWT, BcryptJS, CORS configuration.

Project Structure

├── client/          # React Frontend (Vite/CRA)
├── server/          # Node.js Express Backend
│   ├── models/      # Mongoose Schemas
│   ├── routes/      # API Endpoint definitions
│   └── middleware/  # Auth and validation logic


Quick Start

Backend: Navigate to /server, install dependencies with npm install, configure your .env (PORT, MONGO_URI, JWT_SECRET), and run npm start.

Frontend: Navigate to /client, install dependencies with npm install, and run npm run dev to launch the development server.

Distributed under the MIT License.
