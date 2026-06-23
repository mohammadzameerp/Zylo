# Zylo — An Anonymous Social Space 🌐✨

Hey there! Welcome to **Zylo**, a modern, anonymous social media platform built from scratch. 

I built this project to explore how we can create safe, highly interactive social spaces online. Zylo is designed like a cross between Twitter's dark mode and Discord's premium glassmorphic UI. It lets people share secrets, confessions, ask questions, or blow off steam without revealing their name, email, or identity to the public.

---

## 🎨 What makes Zylo cool?

- **Completely Anonymous Profiles**: When you register, the app suggests fun random usernames (like `SilentPanda342` or `NeonGhost99`) so you never have to think about a nickname or expose your real identity.
- **Glassmorphic UI Design**: The styling is premium, dark-themed, and loaded with subtle micro-animations (like a pulsing heart on likes).
- **Latest & Trending Feeds**: Browse posts by what's hot (sorting by likes count) or what's new.
- **Moderation Queue**: If a post is flagged/reported by 3 or more users, it is instantly routed to the Admin panel where administrators can moderate or delete the post.
- **Real-Time feel Alerts**: A clean notifications system triggers alerts when someone likes or comments on your posts.

---

## 🛠️ The Tech Stack I Used

- **Frontend**: React (built with Vite for sub-second hot reloading), Tailwind CSS (version 3 for custom grids and absolute control), Redux Toolkit (handling global slices for auth, notifications, and posts), and React Router v7.
- **Backend**: Node.js & Express.js for a robust headless REST API.
- **Database**: MongoDB (via Mongoose) utilizing document validation and query indexes.
- **Authentication**: JWT token-based auth with passwords hashed using `bcryptjs`.
- **Security**: Rate limiters to prevent spam and DDoS (limits on auth endpoints and post/comment creations).

---

## 🚀 How to Run It on Your Machine

Running this project locally is super simple. Since MongoDB Server might not be running on your machine, I set up a self-contained environment.

### 1. Grab the repository
```bash
git clone https://github.com/mohammadzameerp/Zylo.git
cd Zylo
```

### 2. Install all dependencies
I've written a root script to install everything (root, backend, and frontend packages) in one go:
```bash
npm run install-all
```

### 3. Setup your environment
Create a `.env` file inside the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zylo
JWT_SECRET=supersecretzylojwtkey
JWT_EXPIRE=30d
```

### 4. Start MongoDB
If you don't have a MongoDB service running on your machine, you can run a local instance:
- Download the portable ZIP version of MongoDB Community Server for Windows.
- Run `mongod` pointing to a local database folder in your workspace:
  ```powershell
  & "path/to/extracted/bin/mongod.exe" --dbpath ./mongodb_data --port 27017
  ```

### 5. Start the development servers
From the root folder, launch the concurrent dev runner:
```bash
npm run dev
```

Vite will boot the frontend on [http://localhost:3000](http://localhost:3000), and Express will boot the API server on [http://localhost:5000](http://localhost:5000). 
*(Note: If you accidentally open port 5000 in your browser, the backend is smart enough to auto-redirect you to port 3000!)*

---

## 📡 API Endpoints at a Glance

### Auth
- `POST /api/auth/register` (Register)
- `POST /api/auth/login` (Login)
- `POST /api/auth/logout` (Logout)
- `GET /api/auth/me` (Fetch current user profile)

### Posts & Comments
- `GET /api/posts` (Fetch posts feed)
- `POST /api/posts` (Create post with optional image file)
- `PUT /api/posts/:id/like` (Toggle like)
- `PUT /api/posts/:id/bookmark` (Toggle bookmark)
- `POST /api/posts/:postId/comments` (Add a comment)

### Notifications & Moderation
- `GET /api/notifications` (Unread notifications list)
- `GET /api/admin/reported-posts` (Admins only moderation queue)

---

## 🤝 Let's Connect!

**Mohammad Zameer Pasha**
- 📧 Email: mohammad.zameer.p@gmail.com
- 📸 Instagram: [@thezameer21](https://www.instagram.com/thezameer21/)
- 💼 LinkedIn: [Mohammad Zameer Pasha](https://www.linkedin.com/in/mohammad-zameer-pasha/)
- 🐙 GitHub: [mohammadzameerp](https://github.com/mohammadzameerp)
