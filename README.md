# TaskFlow - Scalable Task Manager with Authentication & Dashboard

A production-ready full-stack web application for task management with user authentication, built with clean architecture principles.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens stored in HTTP-only cookies
- **Task Management**: Create, read, update, and delete tasks
- **Search & Filter**: Search tasks by keyword and filter by status
- **User Profile**: View and update user profile information
- **Responsive Design**: Beautiful UI inspired by modern task management apps
- **Clean Architecture**: Modular code structure for scalability

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **TailwindCSS** for styling
- **Axios** for HTTP requests
- **React Hook Form + Zod** for form validation
- **Context API** for state management
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **bcrypt** for password hashing
- **jsonwebtoken** for JWT generation
- **express-validator** for input validation
- **cookie-parser** for cookie handling
- **cors** for cross-origin requests
- **dotenv** for environment configuration

## 📁 Project Structure

```
taskflow/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   └── dashboard/      # Dashboard page
│   ├── components/         # Reusable React components
│   ├── context/            # React context providers
│   ├── lib/                # API client and utilities
│   └── hooks/              # Custom React hooks
│
└── backend/                 # Express backend API
    ├── config/             # Database configuration
    ├── controllers/        # Route controllers
    ├── middleware/         # Custom middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    ├── utils/              # Utility functions
    └── server.js           # Main server file
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Backend (.env):
   ```env
   MONGO_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   Frontend (.env.local):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Profile
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/profile` - Update user profile (Protected)

### Tasks
- `POST /api/tasks` - Create a new task (Protected)
- `GET /api/tasks` - Get all user tasks (Protected)
  - Query params: `?search=keyword&status=completed`
- `GET /api/tasks/:id` - Get single task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

## 🎨 UI Design

The application features a clean, modern UI with:
- **Color Scheme**: Yellow (#F4D03F) primary, Beige (#F5F1E8) background
- **Typography**: Inter font family
- **Components**: Rounded corners, subtle shadows, smooth transitions
- **Responsive**: Mobile-first design that works on all screen sizes

## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens stored in HTTP-only cookies
- CORS configured for frontend origin
- Input validation on all endpoints
- Protected routes requiring authentication
- Error messages sanitized (no stack traces in production)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Set a strong `JWT_SECRET`
4. Enable HTTPS
5. Configure proper CORS origins

### Frontend
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure environment variables for production API URL

### Recommended Infrastructure
- **Hosting**: Vercel (Frontend), Railway/Render (Backend)
- **Database**: MongoDB Atlas
- **Caching**: Redis (for future optimization)
- **CDN**: Cloudflare or similar
- **Monitoring**: Sentry for error tracking

## 🔄 Scalability Considerations

- **Horizontal Scaling**: Stateless backend design allows multiple instances
- **Database Indexing**: Indexes on user, status, and text search fields
- **Caching**: Ready for Redis integration
- **Load Balancing**: Nginx reverse proxy configuration ready
- **Microservices**: Clean separation allows easy service extraction
- **Docker**: Containerization ready


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with roomies using Next.js and Express
