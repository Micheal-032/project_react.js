📱 Social Media Feed – Full Stack Application

A modern **full-stack social media platform** built with **React and Node.js/Express**. The app allows users to create posts, interact through likes and comments, and manage profiles with secure authentication and a responsive UI.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

📘 Project Description

This project demonstrates a complete **full-stack architecture** where users can register, log in, and interact with a dynamic social media feed. The platform supports **post creation, engagement features, protected routes, and responsive design**, making it a strong example of modern web application development.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

⚙️ Core Features

Authentication System 🔐

• Secure user signup and login
• JWT-based authentication system
• Protected routes using React Router
• Session handling with secure tokens

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

Social Feed System 📰

• Create, edit, and delete posts
• Support for text and image posts
• Dynamic feed displaying posts from users
• Pagination for efficient loading

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

Engagement Features ❤️

• Like and unlike posts
• Add comments to posts
• Edit and delete comments
• Engagement counters for likes and comments

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

User Profile 👤

• View profile information
• Update profile details
• Display user's posts and activity

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

🧩 Frontend Structure

components
• PostCard
• CommentBox
• Navbar
• LikeButton

pages
• Feed
• Profile
• Login
• Register

context
• AuthContext
• PostContext

services
• api.js

routes
• ProtectedRoute.js

Component Flow

App → Navbar → Feed → PostCard → LikeButton → CommentBox

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

🧰 Technology Stack

Frontend
React.js
React Router
Context API
Axios

Backend
Node.js
Express.js

Database
MongoDB / JSON Server

Authentication
JWT (JSON Web Token)

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

⚙️ Installation & Setup

🧩 Prerequisites

• Node.js
• npm or yarn
• Git

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

📥 Clone the Repository

```bash
git clone https://github.com/your-username/social-media-feed.git
cd social-media-feed
```

---

📦 Backend Setup

```bash
cd backend
npm install
npm start
```

Backend server runs at
[http://localhost:5000](http://localhost:5000)

---

💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at
[http://localhost:3000](http://localhost:3000)

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

✨ **Key Highlights**

✅ Secure authentication with JWT
✅ Full CRUD operations for posts and comments
✅ Protected routes using React Router
✅ Global state management using Context API
✅ Responsive and modern UI design
✅ Scalable and modular project structure

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

🚀 **Conclusion**

This project demonstrates a **production-ready full-stack social media application** implementing modern development practices, scalable architecture, and interactive engagement using **React, Node.js, and REST APIs**.
