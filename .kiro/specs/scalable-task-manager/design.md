# Design Document: Scalable Task Manager with Authentication & Dashboard

## Overview

The Scalable Task Manager is a full-stack web application built with a clear separation between frontend and backend. The architecture follows clean code principles with modular organization, making it easy to extend with new features and migrate to microservices in the future.

The system uses JWT-based authentication with HTTP-only cookies for security, MongoDB for data persistence, and a modern React-based frontend with Next.js App Router. The design emphasizes scalability, maintainability, and production readiness.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js App Router (TypeScript + TailwindCSS)       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Pages    │  │ Components │  │   Context  │    │  │
│  │  │  (Routes)  │  │    (UI)    │  │   (State)  │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │         │               │                │           │  │
│  │         └───────────────┴────────────────┘           │  │
│  │                         │                             │  │
│  │                  ┌──────▼──────┐                     │  │
│  │                  │  API Client │                     │  │
│  │                  │  (Axios)    │                     │  │
│  │                  └──────┬──────┘                     │  │
│  └─────────────────────────┼──────────────────────────┘  │
└────────────────────────────┼─────────────────────────────┘
                             │ HTTP/HTTPS
                             │ (JWT in cookies)
┌────────────────────────────▼─────────────────────────────┐
│                         Backend                           │
│  ┌──────────────────────────────────────────────────────┐│
│  │     Express.js Server (Node.js + TypeScript)         ││
│  │  ┌────────┐  ┌────────────┐  ┌──────────────┐      ││
│  │  │ Routes │─▶│Controllers │─▶│   Services   │      ││
│  │  └────────┘  └────────────┘  └──────┬───────┘      ││
│  │       │             │                 │              ││
│  │  ┌────▼─────┐  ┌───▼────────┐  ┌────▼──────┐      ││
│  │  │Middleware│  │ Validation │  │   Models  │      ││
│  │  │(Auth/Err)│  │  (express- │  │ (Mongoose)│      ││
│  │  └──────────┘  │ validator) │  └─────┬─────┘      ││
│  │                └────────────┘        │              ││
│  └───────────────────────────────────────┼────────────┘│
└──────────────────────────────────────────┼─────────────┘
                                           │
                                    ┌──────▼──────┐
                                    │   MongoDB   │
                                    │  (Database) │
                                    └─────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS for styling
- Axios for HTTP requests
- React Hook Form + Zod for form validation
- Context API for state management
- Lucide React for icons
- React Hot Toast for notifications

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- bcrypt for password hashing
- jsonwebtoken for JWT generation
- express-validator for input validation
- cookie-parser for cookie handling
- cors for cross-origin requests
- dotenv for environment configuration

### UI Design System (TaskFlow Theme)

**Color Palette:**
- Primary Yellow: `#F4D03F` (buttons, accents, highlights)
- Background Beige: `#F5F1E8` (main background)
- White: `#FFFFFF` (cards, modals)
- Text Dark: `#2C2C2C` (primary text)
- Text Gray: `#6B6B6B` (secondary text)
- Border Gray: `#E0E0E0` (dividers, borders)
- Status Colors:
  - High Priority: `#D4A574` (brown/tan)
  - Medium Priority: `#E8C68A` (light brown)
  - Low Priority: `#F0E5D8` (very light brown)
  - In Progress: `#F4D03F` (yellow)
  - Not Started: `#E0E0E0` (gray)
  - Completed: `#A8D5A8` (light green)

**Typography:**
- Font Family: Inter or similar sans-serif
- Headings: 24-32px, font-weight: 600-700
- Body: 14-16px, font-weight: 400
- Small text: 12-14px, font-weight: 400

**Component Styling:**
- Border Radius: 12px for cards, 8px for buttons, 20px for badges
- Shadows: Subtle shadows for elevation (shadow-sm, shadow-md)
- Spacing: Consistent 16px/24px grid system
- Icons: 20-24px, using Lucide React icons
- Buttons: Rounded, yellow primary, white/gray secondary
- Badges: Pill-shaped with appropriate status colors

**Layout:**
- Left Sidebar: 240px width, fixed position
- Main Content: Flexible width with max-width constraints
- Cards: White background with subtle shadow
- Modals: Centered overlay with backdrop blur

### Project Structure

```
scalable-task-manager/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── hooks/
│   │   └── useTasks.ts
│   ├── package.json
│   └── tsconfig.json
│
└── backend/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   └── taskController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Task.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   └── taskRoutes.js
    ├── utils/
    │   └── generateToken.js
    ├── server.js
    ├── package.json
    └── .env.example
```

## Components and Interfaces

### Backend Components

#### 1. Database Models

**User Model (models/User.js)**
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date (default: Date.now)
}
```

**Task Model (models/Task.js)**
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ['todo', 'in-progress', 'completed'], default: 'todo'),
  dueDate: Date,
  user: ObjectId (ref: 'User', required),
  timestamps: true (createdAt, updatedAt)
}
```

#### 2. Controllers

**authController.js**
- `register(req, res, next)`: Creates new user, hashes password, generates JWT
- `login(req, res, next)`: Validates credentials, generates JWT
- `logout(req, res)`: Clears authentication cookie

**userController.js**
- `getProfile(req, res, next)`: Returns authenticated user's profile
- `updateProfile(req, res, next)`: Updates user information

**taskController.js**
- `createTask(req, res, next)`: Creates new task for authenticated user
- `getTasks(req, res, next)`: Returns user's tasks with optional search/filter
- `getTaskById(req, res, next)`: Returns specific task if owned by user
- `updateTask(req, res, next)`: Updates task if owned by user
- `deleteTask(req, res, next)`: Deletes task if owned by user

#### 3. Middleware

**authMiddleware.js**
- `protect(req, res, next)`: Verifies JWT from cookie, attaches user to request

**errorMiddleware.js**
- `notFound(req, res, next)`: Handles 404 errors
- `errorHandler(err, req, res, next)`: Centralized error handling with appropriate status codes

#### 4. Routes

**authRoutes.js**
- POST `/api/auth/register` → authController.register
- POST `/api/auth/login` → authController.login
- POST `/api/auth/logout` → authController.logout

**userRoutes.js** (all protected)
- GET `/api/user/profile` → userController.getProfile
- PUT `/api/user/profile` → userController.updateProfile

**taskRoutes.js** (all protected)
- POST `/api/tasks` → taskController.createTask
- GET `/api/tasks` → taskController.getTasks (supports ?search=keyword&status=completed)
- GET `/api/tasks/:id` → taskController.getTaskById
- PUT `/api/tasks/:id` → taskController.updateTask
- DELETE `/api/tasks/:id` → taskController.deleteTask

#### 5. Utilities

**generateToken.js**
- `generateToken(userId)`: Creates JWT with 1 day expiration
- Returns token string for cookie storage

**db.js**
- `connectDB()`: Establishes MongoDB connection using Mongoose

### Frontend Components

#### 1. Pages (App Router)

**app/page.tsx (Landing/Login Page)**
- Split-screen layout: Left side with playful illustration, right side with login form
- Illustration: Abstract character with yellow circular head, wavy lines, and floating icons (document, checkmark, list)
- TaskFlow logo (yellow circle with "TF") in top right
- Login form card with:
  - "TaskFlow" heading
  - Email input with placeholder "Your email"
  - Password input with placeholder "Your password"
  - Yellow "Continue →" button
  - Link to register page
- Beige background color
- Responsive: Stack vertically on mobile

**app/register/page.tsx**
- Similar layout to login page
- Registration form with name, email, and password fields
- Form validation using React Hook Form + Zod
- Yellow "Create Account" button
- Link to login page
- Same playful illustration style

**app/dashboard/page.tsx**
- Protected route requiring authentication
- Layout with left sidebar and main content area
- Top bar with:
  - Search input (gray background, rounded)
  - Yellow "+ New task" button
  - Mail icon
  - User avatar (circular)
- Main content sections:
  - Calendar widget (month view with current day highlighted in yellow)
  - "My tasks" list with due date groupings (Today, Tomorrow, This week)
  - "My categories" section with icons and avatars
  - "My tracking" section with time trackers
  - "New comments" panel on right side
- Task items show: checkbox, title, due date, status badge, priority badge, team, assignee avatar
- White cards with subtle shadows on beige background

#### 2. Components

**Navbar.tsx (Sidebar)**
- Fixed left sidebar (240px width)
- TaskFlow logo at top (yellow circle with "TF" + "TaskFlow" text)
- Navigation items with icons:
  - Dashboard (grid icon)
  - My tasks (checkmark icon) - highlighted when active
  - Notifications (bell icon)
- Bottom section:
  - Settings (sliders icon)
  - Log out (arrow icon)
- Active item has yellow left border and light background
- Icons from Lucide React
- Responsive: Collapse to icon-only on mobile

**TaskCard.tsx**
- Horizontal layout with multiple columns
- Left: Circular checkbox (empty or checked with yellow fill)
- Task title (strikethrough if completed)
- Due date column (orange text for today/tomorrow)
- Stage/Status badge (yellow pill for "In progress", gray for "Not started")
- Priority badge (brown/tan pill with "High", "Medium", "Low")
- Team name
- Assignee avatar (circular, 32px)
- Hover state: Slight background color change
- Click on task opens detail modal

**TaskModal.tsx (Create/Edit Task)**
- Centered modal with white background and backdrop blur
- Header: Document icon + "Name of task" input + close button (X)
- Form sections:
  - Day selector: Clock icon + "Today"/"Tomorrow" pills + add button
  - Notification: Bell icon + "In 1 hour" pill + add button
  - Priority: Flag icon + "Add priority" button
  - Tags: Tag icon + "Add tags" button
  - Assign: User icon + "Add assignee" button
- Description section with large text area
- Yellow "Create task" button at bottom right
- Rounded corners (12px)
- Smooth animations for open/close

**ProtectedRoute.tsx**
- Wrapper component that checks authentication
- Shows loading spinner (yellow) while checking auth
- Redirects to login if not authenticated
- Renders children if authenticated

**TaskDetailModal.tsx**
- Right-side panel that slides in
- Shows full task details:
  - Title and description
  - Assignee with avatar
  - Deadline with date
  - Projects tags
  - Priority badge
  - Attachments section with file icons
  - Links section
  - Comment input at bottom with yellow send button
- Action buttons: "Archive task" (white), "Delete task" (red)
- Close button (X) in top right

**SearchModal.tsx**
- Centered modal overlay
- Search input at top
- Filter pills: Project, Deadline, Type, Assignee
- Results list showing matching tasks with checkboxes
- "Advanced search" link at bottom
- Yellow checkmarks for completed tasks

**ProfilePage.tsx**
- White card layout
- Profile photo section:
  - Large circular avatar (120px)
  - "Upload photo" button
  - Format requirements text
- Contact section:
  - Full name input field
  - Email address display with "Change email address" button
- Action buttons: "Cancel" (white), "Save changes" (yellow)

**NotificationsPanel.tsx**
- List of notification items
- Each item shows:
  - Circular checkbox (yellow when complete)
  - Task title (strikethrough if complete)
  - User avatar
  - Action description
- Yellow highlight for new notifications
- Grouped by status (latest, completed)

#### 3. Context

**AuthContext.tsx**
- Provides: `user`, `loading`, `login()`, `register()`, `logout()`, `checkAuth()`
- Manages authentication state globally
- Persists auth state using JWT in cookies
- Automatically checks auth on mount

#### 4. API Client

**lib/api.ts**
- Axios instance with base URL configuration
- Includes credentials for cookie handling
- Request/response interceptors for error handling
- API methods:
  - `auth.register(data)`
  - `auth.login(data)`
  - `auth.logout()`
  - `user.getProfile()`
  - `user.updateProfile(data)`
  - `tasks.create(data)`
  - `tasks.getAll(params)` (supports search and status filters)
  - `tasks.getById(id)`
  - `tasks.update(id, data)`
  - `tasks.delete(id)`

#### 5. Custom Hooks

**hooks/useTasks.ts**
- Manages task state and operations
- Provides: `tasks`, `loading`, `error`, `createTask()`, `updateTask()`, `deleteTask()`, `searchTasks()`, `filterTasks()`
- Handles API calls and state updates
- Provides toast notifications for operations (using react-hot-toast)

**hooks/useModal.ts**
- Manages modal open/close state
- Provides: `isOpen`, `open()`, `close()`, `toggle()`
- Handles escape key and backdrop click to close

**hooks/useSearch.ts**
- Manages search and filter state
- Debounces search input
- Combines search keyword with status filters
- Triggers API calls on changes

## Data Models

### UI Component Specifications (TaskFlow Design)

#### Login/Register Page Layout
```tsx
// Split-screen layout
<div className="min-h-screen bg-[#F5F1E8] flex">
  {/* Left side - Illustration */}
  <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
    {/* Playful illustration with yellow character */}
    <IllustrationComponent />
  </div>
  
  {/* Right side - Form */}
  <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex justify-end mb-8">
        <div className="w-12 h-12 bg-[#F4D03F] rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">TF</span>
        </div>
      </div>
      
      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8">TaskFlow</h1>
        {/* Form fields */}
      </div>
    </div>
  </div>
</div>
```

#### Dashboard Layout
```tsx
<div className="min-h-screen bg-[#F5F1E8] flex">
  {/* Sidebar */}
  <Sidebar />
  
  {/* Main Content */}
  <div className="flex-1 ml-60">
    {/* Top Bar */}
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <input 
        type="search" 
        placeholder="Search"
        className="w-96 px-4 py-2 bg-gray-100 rounded-lg"
      />
      <div className="flex items-center gap-4">
        <button className="bg-[#F4D03F] text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={20} /> New task
        </button>
        <Mail size={24} />
        <Avatar />
      </div>
    </header>
    
    {/* Dashboard Content */}
    <main className="p-8">
      {/* Content sections */}
    </main>
  </div>
</div>
```

#### Task List Item
```tsx
<div className="bg-white rounded-xl p-4 mb-2 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
  {/* Checkbox */}
  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
    {completed && <Check size={16} className="text-[#F4D03F]" />}
  </div>
  
  {/* Task Title */}
  <div className="flex-1">
    <p className={`font-medium ${completed ? 'line-through text-gray-400' : ''}`}>
      {title}
    </p>
  </div>
  
  {/* Due Date */}
  <span className="text-sm text-orange-500">{dueDate}</span>
  
  {/* Status Badge */}
  <span className="px-3 py-1 bg-[#F4D03F] text-black text-xs rounded-full">
    {status}
  </span>
  
  {/* Priority Badge */}
  <span className="px-3 py-1 bg-[#D4A574] text-white text-xs rounded-full">
    {priority}
  </span>
  
  {/* Team */}
  <span className="text-sm text-gray-600">{team}</span>
  
  {/* Avatar */}
  <img src={avatar} className="w-8 h-8 rounded-full" />
</div>
```

#### Button Styles
```tsx
// Primary Button (Yellow)
<button className="bg-[#F4D03F] hover:bg-[#E8C12F] text-black font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
  Continue <ArrowRight size={18} />
</button>

// Secondary Button (White)
<button className="bg-white hover:bg-gray-50 text-black font-medium px-6 py-2.5 rounded-lg border border-gray-300 transition-colors">
  Cancel
</button>

// Danger Button (Red)
<button className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
  Delete task
</button>
```

#### Badge Styles
```tsx
// Status Badges
const statusStyles = {
  'in-progress': 'bg-[#F4D03F] text-black',
  'not-started': 'bg-gray-200 text-gray-700',
  'completed': 'bg-green-100 text-green-700'
};

// Priority Badges
const priorityStyles = {
  'high': 'bg-[#D4A574] text-white',
  'medium': 'bg-[#E8C68A] text-black',
  'low': 'bg-[#F0E5D8] text-gray-700'
};

<span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
  {status}
</span>
```

#### Modal Styles
```tsx
// Modal Overlay
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
  {/* Modal Content */}
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
    {/* Modal Header */}
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <FileText size={24} />
        <input 
          type="text" 
          placeholder="Name of task"
          className="text-xl font-semibold outline-none"
        />
      </div>
      <button onClick={onClose}>
        <X size={24} />
      </button>
    </div>
    
    {/* Modal Body */}
    <div className="p-6">
      {/* Form content */}
    </div>
  </div>
</div>
```

#### Calendar Widget
```tsx
<div className="bg-white rounded-xl p-6 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-semibold">March 2022</h3>
    <div className="flex gap-2">
      <button><ChevronLeft size={20} /></button>
      <button><ChevronRight size={20} /></button>
    </div>
  </div>
  
  {/* Calendar Grid */}
  <div className="grid grid-cols-7 gap-2">
    {/* Day headers */}
    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
      <div key={day} className="text-center text-xs text-gray-500 font-medium">
        {day}
      </div>
    ))}
    
    {/* Date cells */}
    {dates.map(date => (
      <div 
        key={date}
        className={`
          text-center py-2 rounded-lg cursor-pointer
          ${isToday(date) ? 'bg-[#F4D03F] text-black font-bold' : 'hover:bg-gray-100'}
          ${isOtherMonth(date) ? 'text-gray-300' : ''}
        `}
      >
        {date}
      </div>
    ))}
  </div>
</div>
```

### Data Models

### User Schema (Mongoose)

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
```

### Task Schema (Mongoose)

```javascript
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['todo', 'in-progress', 'completed'],
      message: 'Status must be todo, in-progress, or completed'
    },
    default: 'todo'
  },
  dueDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, title: 'text', description: 'text' });
```

### Frontend Type Definitions (TypeScript)

```typescript
// User types
interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Task types
type TaskStatus = 'todo' | 'in-progress' | 'completed';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
}

// API response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Authentication Properties

**Property 1: Registration creates valid user accounts**
*For any* valid registration data (name, email, password), creating a user account should result in a stored user with a bcrypt-hashed password (not plaintext) and all provided fields.
**Validates: Requirements 1.1, 1.5**

**Property 2: Invalid registration data is rejected**
*For any* invalid registration data (missing required fields, invalid email format, password too short), the registration attempt should be rejected with specific field-level error messages.
**Validates: Requirements 1.3**

**Property 3: Successful registration returns JWT cookie**
*For any* successful registration, the response should include an HTTP-only cookie containing a valid JWT token.
**Validates: Requirements 1.4**

**Property 4: Valid credentials authenticate successfully**
*For any* registered user, logging in with correct credentials should generate a JWT token and return it in an HTTP-only cookie with 1 day expiration.
**Validates: Requirements 2.1, 2.3**

**Property 5: Invalid credentials are rejected**
*For any* login attempt with incorrect password or non-existent email, the authentication should fail with an appropriate error message.
**Validates: Requirements 2.2**

### User Profile Properties

**Property 6: Authenticated users can access their profile**
*For any* authenticated user, requesting their profile should return their name, email, and createdAt date without exposing the password hash.
**Validates: Requirements 3.1, 3.4**

**Property 7: Profile updates are validated and applied**
*For any* authenticated user and valid profile update data, the update should be validated, applied to the user record, and return the updated profile.
**Validates: Requirements 3.2**

**Property 8: Unauthenticated requests are rejected**
*For any* request to protected endpoints without a valid JWT token, the system should reject the request with 401 Unauthorized status.
**Validates: Requirements 3.3**

### Task Management Properties

**Property 9: Task creation associates with authenticated user**
*For any* authenticated user and valid task data, creating a task should result in a new task record associated with that user's ID, with automatic timestamps.
**Validates: Requirements 4.1, 4.4, 4.5**

**Property 10: Invalid task data is rejected**
*For any* invalid task data (missing title, invalid status value, description too long), the creation should be rejected with specific validation error messages.
**Validates: Requirements 4.2, 4.3**

**Property 11: Users only see their own tasks**
*For any* authenticated user, retrieving tasks should return only tasks where the user field matches that user's ID, never tasks belonging to other users.
**Validates: Requirements 5.1**

**Property 12: Task retrieval includes all fields**
*For any* task retrieved by an authenticated user, the response should include all fields: title, description, status, dueDate, user reference, createdAt, and updatedAt.
**Validates: Requirements 5.4**

**Property 13: Task access is authorized**
*For any* task ID and authenticated user, retrieving a specific task should succeed only if the task belongs to that user, otherwise return 404 error.
**Validates: Requirements 5.2, 5.3**

**Property 14: Task updates are validated and authorized**
*For any* authenticated user and valid task update data, updating a task should succeed only if the task belongs to that user, apply the changes, update the updatedAt timestamp, and return the updated task.
**Validates: Requirements 6.1, 6.2, 6.4**

**Property 15: Invalid task updates are rejected**
*For any* invalid task update data (invalid status, title too long, etc.), the update should be rejected with specific validation error messages.
**Validates: Requirements 6.3**

**Property 16: Task deletion is authorized**
*For any* authenticated user and task ID, deleting a task should succeed only if the task belongs to that user and remove it from the database, otherwise return 403 Forbidden.
**Validates: Requirements 7.1, 7.2**

### Search and Filter Properties

**Property 17: Search matches title and description**
*For any* authenticated user and search keyword, the returned tasks should include all user tasks where the keyword appears (case-insensitive) in either the title or description fields.
**Validates: Requirements 8.1, 8.3**

**Property 18: Status filter returns matching tasks**
*For any* authenticated user and valid status value (todo, in-progress, completed), the returned tasks should include only user tasks with that exact status.
**Validates: Requirements 9.1**

**Property 19: Invalid filter parameters are rejected**
*For any* invalid status filter value (not one of the three valid statuses), the request should be rejected with an error message.
**Validates: Requirements 9.4**

**Property 20: Search and filter can be combined**
*For any* authenticated user, search keyword, and status filter, the returned tasks should match both the search criteria (keyword in title/description) and the status filter.
**Validates: Requirements 13.3**

### Frontend Authentication Properties

**Property 21: Unauthenticated dashboard access redirects to login**
*For any* attempt to access the dashboard without valid authentication, the frontend should redirect to the login page.
**Validates: Requirements 10.1**

**Property 22: Successful authentication redirects to dashboard**
*For any* successful login or registration, the frontend should redirect the user to the dashboard page.
**Validates: Requirements 10.2**

**Property 23: Authentication persists across page reloads**
*For any* authenticated user, reloading the page should maintain authentication state by reading the JWT from the HTTP-only cookie.
**Validates: Requirements 10.4**

### Frontend Dashboard Properties

**Property 24: Dashboard displays user profile**
*For any* authenticated user accessing the dashboard, the user's name and email should be displayed.
**Validates: Requirements 11.1**

**Property 25: Dashboard statistics match task data**
*For any* authenticated user's task list, the displayed statistics (total, completed, pending) should accurately reflect the counts from the actual task data.
**Validates: Requirements 11.2, 11.3**

**Property 26: Statistics update with task operations**
*For any* task creation, update (status change), or deletion, the dashboard statistics should immediately reflect the new counts.
**Validates: Requirements 11.4**

### Frontend Task Management Properties

**Property 27: Task form submission creates/updates tasks**
*For any* valid task form data, submitting the form should send the data to the backend API and update the displayed task list with the new/updated task.
**Validates: Requirements 12.2**

**Property 28: Edit form pre-populates with task data**
*For any* task being edited, opening the edit form should pre-populate all fields (title, description, status, dueDate) with the current task values.
**Validates: Requirements 12.3**

**Property 29: Task deletion requires confirmation**
*For any* task deletion request, the frontend should display a confirmation dialog before sending the delete request to the backend and removing the task from the list.
**Validates: Requirements 12.4**

**Property 30: Form validation prevents invalid submissions**
*For any* task form with invalid data (empty title, invalid date format, etc.), the form should display field-specific error messages and prevent submission until corrected.
**Validates: Requirements 12.5, 16.1, 16.5**

### Frontend Search and Filter Properties

**Property 31: Search input triggers backend requests**
*For any* search keyword entered by the user, the frontend should send a request to the backend with the search parameter and display the returned filtered tasks.
**Validates: Requirements 13.1**

**Property 32: Filter selection triggers backend requests**
*For any* status filter selected by the user, the frontend should send a request to the backend with the status parameter and display the returned filtered tasks.
**Validates: Requirements 13.2**

**Property 33: Empty results show empty state**
*For any* search or filter operation that returns zero tasks, the frontend should display an empty state message with appropriate guidance.
**Validates: Requirements 13.4**

### Frontend UI Feedback Properties

**Property 34: Loading states display indicators**
*For any* asynchronous operation (API call), the frontend should display loading indicators while the operation is in progress.
**Validates: Requirements 14.1**

**Property 35: Operations trigger toast notifications**
*For any* completed operation (success or failure), the frontend should display a toast notification with an appropriate message describing the outcome.
**Validates: Requirements 14.2**

### Frontend Validation Properties

**Property 36: Error messages clear on correction**
*For any* form field with a validation error, correcting the field to valid data should clear the error message for that field.
**Validates: Requirements 16.2**

**Property 37: Email format is validated**
*For any* email input in registration or login forms, the frontend should validate the format and reject invalid email addresses with an error message.
**Validates: Requirements 16.3**

**Property 38: Password requirements are enforced**
*For any* password input, the frontend should enforce minimum length requirements and display error messages for passwords that don't meet the criteria.
**Validates: Requirements 16.4**

### Backend Error Handling Properties

**Property 39: Errors are caught by centralized middleware**
*For any* error thrown in route handlers, the error should be caught by the centralized error middleware and result in an appropriate error response.
**Validates: Requirements 17.1**

**Property 40: Validation errors return structured responses**
*For any* validation failure, the backend should return a structured error response with field-specific error messages and 400 status code.
**Validates: Requirements 17.2**

**Property 41: Unexpected errors are logged and sanitized**
*For any* unexpected error (not validation or authorization), the backend should log the full error details and return a generic error message to the client with 500 status code.
**Validates: Requirements 17.3**

**Property 42: Error types map to correct status codes**
*For any* error scenario, the backend should return the appropriate HTTP status code: 400 for validation, 401 for authentication, 403 for authorization, 404 for not found, 500 for server errors.
**Validates: Requirements 17.4**

## Error Handling

### Backend Error Handling Strategy

**Centralized Error Middleware:**
All errors are caught and processed by a centralized error handler that:
1. Determines the error type (validation, authentication, authorization, not found, server error)
2. Maps to appropriate HTTP status code
3. Formats error response consistently
4. Logs errors for debugging (full details for server errors, minimal for client errors)
5. Sanitizes error messages sent to clients (no stack traces in production)

**Error Response Format:**
```javascript
{
  success: false,
  message: "Human-readable error message",
  errors: [ // Optional, for validation errors
    {
      field: "email",
      message: "Email is required"
    }
  ]
}
```

**Error Types:**
- **Validation Errors (400)**: Input validation failures from express-validator
- **Authentication Errors (401)**: Missing or invalid JWT token
- **Authorization Errors (403)**: Valid token but insufficient permissions
- **Not Found Errors (404)**: Resource doesn't exist
- **Server Errors (500)**: Unexpected errors, database errors, etc.

**Error Middleware Implementation:**
```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError('Resource not found', 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new AppError('Duplicate field value entered', 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // Log error for debugging
  if (error.statusCode === 500) {
    console.error('Server Error:', err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};
```

### Frontend Error Handling Strategy

**API Error Interceptor:**
Axios interceptor catches all API errors and:
1. Extracts error message from response
2. Handles authentication errors (401) by clearing auth state and redirecting to login
3. Displays toast notifications for errors
4. Returns rejected promise with error details

**Error Handling in Components:**
- Try-catch blocks around async operations
- Display inline validation errors from backend
- Show toast notifications for operation failures
- Maintain loading states to prevent duplicate requests
- Graceful degradation for network errors

**Error Display Patterns:**
- **Form Validation**: Inline error messages below fields
- **Operation Failures**: Toast notifications with error message
- **Network Errors**: Toast notification with retry option
- **Authentication Errors**: Automatic redirect to login with message

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests:**
- Specific examples demonstrating correct behavior
- Edge cases (empty inputs, boundary values, special characters)
- Error conditions (invalid inputs, unauthorized access, not found scenarios)
- Integration points between components
- Specific user flows (registration → login → create task)

**Property-Based Tests:**
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Minimum 100 iterations per property test
- Each property test references its design document property

### Backend Testing

**Testing Framework:** Jest + Supertest
**Property Testing Library:** fast-check

**Test Organization:**
```
backend/tests/
├── unit/
│   ├── models/
│   │   ├── User.test.js
│   │   └── Task.test.js
│   ├── controllers/
│   │   ├── authController.test.js
│   │   ├── userController.test.js
│   │   └── taskController.test.js
│   └── middleware/
│       ├── authMiddleware.test.js
│       └── errorMiddleware.test.js
└── properties/
    ├── auth.properties.test.js
    ├── tasks.properties.test.js
    └── search.properties.test.js
```

**Property Test Configuration:**
- Each test runs minimum 100 iterations
- Tests tagged with: `Feature: scalable-task-manager, Property {N}: {property text}`
- Use fast-check generators for random data:
  - `fc.string()` for names, titles, descriptions
  - `fc.emailAddress()` for emails
  - `fc.constantFrom('todo', 'in-progress', 'completed')` for status
  - `fc.date()` for due dates
  - `fc.uuid()` for IDs

**Example Property Test:**
```javascript
// Feature: scalable-task-manager, Property 1: Registration creates valid user accounts
describe('Property 1: Registration creates valid user accounts', () => {
  it('should create user with hashed password for any valid registration data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 })
        }),
        async (userData) => {
          const res = await request(app)
            .post('/api/auth/register')
            .send(userData);
          
          expect(res.status).toBe(201);
          
          const user = await User.findOne({ email: userData.email });
          expect(user).toBeTruthy();
          expect(user.name).toBe(userData.name);
          expect(user.password).not.toBe(userData.password); // Should be hashed
          expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Unit Test Examples:**
```javascript
describe('Auth Controller - Unit Tests', () => {
  it('should reject registration with duplicate email', async () => {
    await User.create({
      name: 'Existing User',
      email: 'test@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: 'test@example.com',
        password: 'password456'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('email');
  });

  it('should clear cookie on logout', async () => {
    const token = generateToken('user123');
    
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'][0]).toContain('token=;');
  });
});
```

### Frontend Testing

**Testing Framework:** Jest + React Testing Library
**Property Testing Library:** fast-check
**E2E Testing:** Playwright (optional, for critical user flows)

**Test Organization:**
```
frontend/__tests__/
├── unit/
│   ├── components/
│   │   ├── TaskCard.test.tsx
│   │   ├── TaskModal.test.tsx
│   │   └── Navbar.test.tsx
│   ├── hooks/
│   │   └── useTasks.test.tsx
│   └── lib/
│       └── api.test.ts
└── properties/
    ├── auth.properties.test.tsx
    ├── dashboard.properties.test.tsx
    └── forms.properties.test.tsx
```

**Property Test Configuration:**
- Each test runs minimum 100 iterations
- Tests tagged with: `Feature: scalable-task-manager, Property {N}: {property text}`
- Use fast-check generators for random data
- Mock API calls with consistent behavior

**Example Property Test:**
```typescript
// Feature: scalable-task-manager, Property 25: Dashboard statistics match task data
describe('Property 25: Dashboard statistics match task data', () => {
  it('should display accurate statistics for any task list', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            _id: fc.uuid(),
            title: fc.string({ minLength: 1 }),
            status: fc.constantFrom('todo', 'in-progress', 'completed'),
            user: fc.constant('user123')
          }),
          { maxLength: 50 }
        ),
        async (tasks) => {
          // Mock API to return generated tasks
          jest.spyOn(api.tasks, 'getAll').mockResolvedValue({ data: tasks });

          render(<Dashboard />);
          await waitFor(() => expect(screen.queryByText('Loading')).not.toBeInTheDocument());

          const total = tasks.length;
          const completed = tasks.filter(t => t.status === 'completed').length;
          const pending = tasks.filter(t => t.status !== 'completed').length;

          expect(screen.getByText(`Total: ${total}`)).toBeInTheDocument();
          expect(screen.getByText(`Completed: ${completed}`)).toBeInTheDocument();
          expect(screen.getByText(`Pending: ${pending}`)).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Unit Test Examples:**
```typescript
describe('TaskModal - Unit Tests', () => {
  it('should display create task modal when opened', () => {
    render(<TaskModal isOpen={true} onClose={jest.fn()} onSubmit={jest.fn()} />);
    
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('should pre-populate form when editing task', () => {
    const task = {
      _id: '123',
      title: 'Test Task',
      description: 'Test Description',
      status: 'in-progress' as TaskStatus,
      dueDate: '2024-12-31'
    };

    render(<TaskModal isOpen={true} onClose={jest.fn()} onSubmit={jest.fn()} task={task} />);
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('in-progress')).toBeInTheDocument();
  });

  it('should show empty state when user has no tasks', () => {
    jest.spyOn(api.tasks, 'getAll').mockResolvedValue({ data: [] });

    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });
});
```

### Test Coverage Goals

- **Backend**: Minimum 80% code coverage
- **Frontend**: Minimum 75% code coverage
- **Property Tests**: All 42 correctness properties implemented
- **Unit Tests**: All edge cases and error conditions covered
- **Integration Tests**: Critical user flows (auth → dashboard → task CRUD)

### Continuous Integration

- Run all tests on every commit
- Fail build if any test fails
- Generate coverage reports
- Run property tests with increased iterations (500+) in CI for thorough validation
