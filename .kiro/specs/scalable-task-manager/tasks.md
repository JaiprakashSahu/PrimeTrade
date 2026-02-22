# Implementation Plan: Scalable Task Manager with Authentication & Dashboard

## Overview

This implementation plan breaks down the full-stack application into discrete, incremental steps. The backend will be built with Node.js + Express + MongoDB, and the frontend with Next.js + TypeScript. Each task builds on previous work, with testing integrated throughout to validate functionality early.

The implementation follows a bottom-up approach: database models → controllers → routes → frontend components → integration.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Create `/backend` and `/frontend` folders
  - Initialize backend: `npm init`, install dependencies (express, mongoose, bcrypt, jsonwebtoken, express-validator, dotenv, cookie-parser, cors, nodemon)
  - Initialize frontend: `npx create-next-app@latest frontend --typescript --tailwind --app`, install dependencies (axios, react-hook-form, zod, @hookform/resolvers, lucide-react, react-hot-toast)
  - Create backend folder structure: config/, controllers/, middleware/, models/, routes/, utils/
  - Create frontend folder structure: components/, context/, lib/, hooks/
  - Configure TailwindCSS with TaskFlow color palette (#F4D03F yellow, #F5F1E8 beige, custom browns for badges)
  - Create .env.example files for both projects
  - _Requirements: 20.1, 20.4_

- [x] 2. Implement database configuration and models
  - [x] 2.1 Create database connection (config/db.js)
    - Implement MongoDB connection using Mongoose
    - Add connection error handling and logging
    - _Requirements: 19.5_

  - [x] 2.2 Create User model (models/User.js)
    - Define schema with name, email (unique), password, createdAt fields
    - Add pre-save hook for password hashing with bcrypt (salt rounds: 10)
    - Add matchPassword method for credential verification
    - Add toJSON method to exclude password from responses
    - _Requirements: 19.1, 1.5, 3.4_

  - [x] 2.3 Create Task model (models/Task.js)
    - Define schema with title, description, status (enum), dueDate, user reference
    - Enable timestamps (createdAt, updatedAt)
    - Add indexes for efficient querying (user + status, text search on title/description)
    - _Requirements: 19.2_

  - [x] 2.4 Write property test for User model
    - **Property 1: Registration creates valid user accounts**
    - **Validates: Requirements 1.1, 1.5**

  - [x] 2.5 Write property test for password hashing
    - **Property 6: Authenticated users can access their profile (password not exposed)**
    - **Validates: Requirements 3.4**

- [-] 3. Implement authentication utilities and middleware
  - [x] 3.1 Create JWT token generator (utils/generateToken.js)
    - Implement function to generate JWT with 1 day expiration
    - Use JWT_SECRET from environment variables
    - _Requirements: 18.2_

  - [x] 3.2 Create authentication middleware (middleware/authMiddleware.js)
    - Implement protect middleware to verify JWT from cookies
    - Extract user ID from token and attach to request
    - Handle missing or invalid tokens with 401 response
    - _Requirements: 3.3_

  - [x] 3.3 Create error handling middleware (middleware/errorMiddleware.js)
    - Implement centralized error handler for all error types
    - Map error types to appropriate HTTP status codes (400, 401, 403, 404, 500)
    - Format consistent error responses
    - Log server errors, sanitize client responses
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

  - [-] 3.4 Write property test for authentication middleware
    - **Property 8: Unauthenticated requests are rejected**
    - **Validates: Requirements 3.3**

  - [ ] 3.5 Write property test for error handling
    - **Property 42: Error types map to correct status codes**
    - **Validates: Requirements 17.4**

- [-] 4. Implement authentication controller and routes
  - [x] 4.1 Create auth controller (controllers/authController.js)
    - Implement register function: validate input, create user, generate token, set cookie
    - Implement login function: validate credentials, generate token, set cookie
    - Implement logout function: clear authentication cookie
    - Add express-validator validation chains
    - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

  - [x] 4.2 Create auth routes (routes/authRoutes.js)
    - Define POST /api/auth/register → authController.register
    - Define POST /api/auth/login → authController.login
    - Define POST /api/auth/logout → authController.logout
    - _Requirements: 1.1, 2.1, 2.4_

  - [ ] 4.3 Write property test for registration
    - **Property 3: Successful registration returns JWT cookie**
    - **Validates: Requirements 1.4**

  - [ ] 4.4 Write property test for invalid registration
    - **Property 2: Invalid registration data is rejected**
    - **Validates: Requirements 1.3**

  - [ ] 4.5 Write property test for login
    - **Property 4: Valid credentials authenticate successfully**
    - **Validates: Requirements 2.1, 2.3**

  - [ ] 4.6 Write property test for invalid login
    - **Property 5: Invalid credentials are rejected**
    - **Validates: Requirements 2.2**

  - [ ] 4.7 Write unit test for duplicate email registration
    - Test that registering with existing email returns error
    - _Requirements: 1.2_

  - [ ] 4.8 Write unit test for logout
    - Test that logout clears authentication cookie
    - _Requirements: 2.4_

- [-] 5. Implement user profile controller and routes
  - [x] 5.1 Create user controller (controllers/userController.js)
    - Implement getProfile function: return authenticated user's profile
    - Implement updateProfile function: validate and update user data
    - Add express-validator validation chains
    - _Requirements: 3.1, 3.2_

  - [x] 5.2 Create user routes (routes/userRoutes.js)
    - Define GET /api/user/profile → userController.getProfile (protected)
    - Define PUT /api/user/profile → userController.updateProfile (protected)
    - Apply protect middleware to all routes
    - _Requirements: 3.1, 3.2_

  - [ ] 5.3 Write property test for profile access
    - **Property 6: Authenticated users can access their profile**
    - **Validates: Requirements 3.1, 3.4**

  - [ ] 5.4 Write property test for profile updates
    - **Property 7: Profile updates are validated and applied**
    - **Validates: Requirements 3.2**

- [-] 6. Checkpoint - Backend authentication complete
  - Ensure all authentication tests pass
  - Verify JWT tokens are generated and validated correctly
  - Test registration, login, logout, and profile endpoints manually
  - Ask the user if questions arise

- [-] 7. Implement task controller and routes
  - [x] 7.1 Create task controller (controllers/taskController.js)
    - Implement createTask: validate input, create task with user association, set timestamps
    - Implement getTasks: return user's tasks with optional search and status filter
    - Implement getTaskById: return task if owned by user, else 404
    - Implement updateTask: validate, authorize, update task, update timestamp
    - Implement deleteTask: authorize and delete task
    - Add express-validator validation chains for all operations
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 8.1, 8.3, 9.1, 9.4_

  - [x] 7.2 Create task routes (routes/taskRoutes.js)
    - Define POST /api/tasks → taskController.createTask (protected)
    - Define GET /api/tasks → taskController.getTasks (protected, supports ?search=keyword&status=completed)
    - Define GET /api/tasks/:id → taskController.getTaskById (protected)
    - Define PUT /api/tasks/:id → taskController.updateTask (protected)
    - Define DELETE /api/tasks/:id → taskController.deleteTask (protected)
    - Apply protect middleware to all routes
    - _Requirements: 4.1, 5.1, 5.2, 6.1, 7.1, 8.1, 9.1_

  - [ ] 7.3 Write property test for task creation
    - **Property 9: Task creation associates with authenticated user**
    - **Validates: Requirements 4.1, 4.4, 4.5**

  - [ ] 7.4 Write property test for invalid task data
    - **Property 10: Invalid task data is rejected**
    - **Validates: Requirements 4.2, 4.3**

  - [ ] 7.5 Write property test for task isolation
    - **Property 11: Users only see their own tasks**
    - **Validates: Requirements 5.1**

  - [ ] 7.6 Write property test for task retrieval
    - **Property 12: Task retrieval includes all fields**
    - **Validates: Requirements 5.4**

  - [ ] 7.7 Write property test for task authorization
    - **Property 13: Task access is authorized**
    - **Validates: Requirements 5.2, 5.3**

  - [ ] 7.8 Write property test for task updates
    - **Property 14: Task updates are validated and authorized**
    - **Validates: Requirements 6.1, 6.2, 6.4**

  - [ ] 7.9 Write property test for invalid updates
    - **Property 15: Invalid task updates are rejected**
    - **Validates: Requirements 6.3**

  - [ ] 7.10 Write property test for task deletion
    - **Property 16: Task deletion is authorized**
    - **Validates: Requirements 7.1, 7.2**

  - [ ] 7.11 Write unit test for deleting non-existent task
    - Test that deleting non-existent task returns 404
    - _Requirements: 7.3_

- [ ] 8. Implement search and filter functionality
  - [ ] 8.1 Write property test for search
    - **Property 17: Search matches title and description**
    - **Validates: Requirements 8.1, 8.3**

  - [ ] 8.2 Write property test for status filter
    - **Property 18: Status filter returns matching tasks**
    - **Validates: Requirements 9.1**

  - [ ] 8.3 Write property test for invalid filter
    - **Property 19: Invalid filter parameters are rejected**
    - **Validates: Requirements 9.4**

  - [ ] 8.4 Write property test for combined search and filter
    - **Property 20: Search and filter can be combined**
    - **Validates: Requirements 13.3**

  - [ ] 8.5 Write unit test for empty search
    - Test that no search parameter returns all user tasks
    - _Requirements: 8.2_

  - [ ] 8.6 Write unit test for empty filter
    - Test that no status filter returns all user tasks
    - _Requirements: 9.2_

- [-] 9. Complete backend server setup
  - [x] 9.1 Create main server file (server.js)
    - Import and configure express app
    - Add middleware: express.json(), cookie-parser, cors (with credentials)
    - Mount routes: /api/auth, /api/user, /api/tasks
    - Add error handling middleware
    - Connect to database
    - Start server on PORT from environment
    - _Requirements: 18.1, 18.2_

  - [x] 9.2 Create .env.example file
    - Document required environment variables: MONGO_URI, JWT_SECRET, PORT, NODE_ENV
    - _Requirements: 18.2_

  - [ ] 9.3 Write unit test for CORS configuration
    - Test that CORS headers are present in responses
    - _Requirements: 18.1_

- [~] 10. Checkpoint - Backend complete
  - Ensure all backend tests pass
  - Test all API endpoints manually with Postman or similar
  - Verify error handling works correctly
  - Verify search and filter work as expected
  - Ask the user if questions arise

- [-] 11. Set up frontend API client and authentication context
  - [x] 11.1 Create API client (lib/api.ts)
    - Create Axios instance with base URL and credentials config
    - Add response interceptor for error handling (401 → redirect to login)
    - Implement API methods: auth.register, auth.login, auth.logout
    - Implement API methods: user.getProfile, user.updateProfile
    - Implement API methods: tasks.create, tasks.getAll, tasks.getById, tasks.update, tasks.delete
    - _Requirements: 10.4_

  - [x] 11.2 Create authentication context (context/AuthContext.tsx)
    - Define AuthContext with user state, loading state, and auth methods
    - Implement login function: call API, update state, redirect to dashboard
    - Implement register function: call API, update state, redirect to dashboard
    - Implement logout function: call API, clear state, redirect to login
    - Implement checkAuth function: verify token on mount, update state
    - Provide context to app via provider
    - _Requirements: 10.2, 10.3, 10.4_

  - [ ] 11.3 Write property test for authentication persistence
    - **Property 23: Authentication persists across page reloads**
    - **Validates: Requirements 10.4**

- [-] 12. Implement authentication pages
  - [x] 12.1 Create registration page (app/register/page.tsx)
    - Build split-screen layout: left side with playful illustration, right side with form
    - Create illustration component with yellow character and floating icons
    - Build form card with white background, rounded corners, shadow
    - Add fields: name, email, password with beige input backgrounds
    - Implement validation using React Hook Form + Zod
    - Display field-specific error messages in red below inputs
    - Add yellow "Create Account →" button with hover effect
    - Add link to login page
    - Call register function from AuthContext on submit
    - Redirect to dashboard on success
    - Make responsive: stack vertically on mobile
    - _Requirements: 1.1, 1.3, 10.2, 16.1, 16.3, 16.4, 16.5_

  - [x] 12.2 Create login page (app/login/page.tsx)
    - Build same split-screen layout as register page
    - Reuse illustration component
    - Build form card with "TaskFlow" heading
    - Add fields: email, password with placeholders "Your email", "Your password"
    - Implement validation using React Hook Form + Zod
    - Display field-specific error messages
    - Add yellow "Continue →" button with arrow icon
    - Add link to register page
    - Call login function from AuthContext on submit
    - Redirect to dashboard on success
    - Make responsive
    - _Requirements: 2.1, 2.2, 10.2, 16.1, 16.3, 16.4, 16.5_

  - [~] 12.3 Create illustration component (components/LoginIllustration.tsx)
    - Build playful abstract character with yellow circular head
    - Add wavy connecting lines
    - Add floating icons: document (FileText), checkmark (CheckCircle), list (List)
    - Use brown/tan colors for hands and icons
    - Make responsive: scale down on smaller screens
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ] 12.3 Write property test for successful authentication redirect
    - **Property 22: Successful authentication redirects to dashboard**
    - **Validates: Requirements 10.2**

  - [ ] 12.4 Write property test for email validation
    - **Property 37: Email format is validated**
    - **Validates: Requirements 16.3**

  - [ ] 12.5 Write property test for password validation
    - **Property 38: Password requirements are enforced**
    - **Validates: Requirements 16.4**

  - [ ] 12.6 Write property test for form validation
    - **Property 30: Form validation prevents invalid submissions**
    - **Validates: Requirements 12.5, 16.1, 16.5**

  - [ ] 12.7 Write property test for error message clearing
    - **Property 36: Error messages clear on correction**
    - **Validates: Requirements 16.2**

- [ ] 13. Implement protected route component
  - [~] 13.1 Create ProtectedRoute component (components/ProtectedRoute.tsx)
    - Check authentication state from AuthContext
    - Show loading indicator while checking auth
    - Redirect to login if not authenticated
    - Render children if authenticated
    - _Requirements: 10.1_

  - [ ] 13.2 Write property test for unauthenticated redirect
    - **Property 21: Unauthenticated dashboard access redirects to login**
    - **Validates: Requirements 10.1**

  - [ ] 13.3 Write unit test for logout redirect
    - Test that logout clears state and redirects to login
    - _Requirements: 10.3_

- [ ] 14. Implement task management hook
  - [~] 14.1 Create useTasks hook (hooks/useTasks.ts)
    - Manage tasks state, loading state, error state
    - Implement fetchTasks function with optional search and filter params
    - Implement createTask function: call API, update state, show toast
    - Implement updateTask function: call API, update state, show toast
    - Implement deleteTask function: call API, update state, show toast
    - _Requirements: 12.2, 12.4, 13.1, 13.2, 14.2_

- [ ] 15. Implement task UI components
  - [~] 15.1 Create TaskCard component (components/TaskCard.tsx)
    - Display task title, description, status badge, due date
    - Add edit and delete buttons
    - Call onEdit and onDelete callbacks from props
    - Style with TailwindCSS, add hover states
    - _Requirements: 12.3, 12.4, 14.4_

  - [~] 15.2 Create TaskModal component (components/TaskModal.tsx)
    - Build form with fields: title, description, status dropdown, due date picker
    - Implement validation using React Hook Form + Zod
    - Support both create and edit modes (pre-populate for edit)
    - Display field-specific error messages
    - Call onSubmit callback with form data
    - _Requirements: 12.1, 12.2, 12.3, 12.5, 16.1, 16.5_

  - [ ] 15.3 Write property test for task form submission
    - **Property 27: Task form submission creates/updates tasks**
    - **Validates: Requirements 12.2**

  - [ ] 15.4 Write property test for edit form pre-population
    - **Property 28: Edit form pre-populates with task data**
    - **Validates: Requirements 12.3**

  - [ ] 15.5 Write property test for task deletion confirmation
    - **Property 29: Task deletion requires confirmation**
    - **Validates: Requirements 12.4**

  - [ ] 15.6 Write unit test for create task modal
    - Test that modal displays create form when opened
    - _Requirements: 12.1_

- [ ] 16. Implement navigation component
  - [~] 16.1 Create Navbar component (components/Navbar.tsx)
    - Display app branding/logo
    - Show user name when authenticated
    - Add logout button that calls logout from AuthContext
    - Implement responsive mobile menu
    - Style with TailwindCSS
    - _Requirements: 15.1, 15.2, 15.3_

- [ ] 17. Implement dashboard page
  - [~] 17.1 Create dashboard page (app/dashboard/page.tsx)
    - Wrap with ProtectedRoute component
    - Display user profile (name, email) from AuthContext
    - Calculate and display task statistics (total, completed, pending)
    - Add search bar input with onChange handler
    - Add status filter dropdown with onChange handler
    - Display task list using TaskCard components
    - Add "Create Task" button to open TaskModal
    - Show loading indicators during API calls
    - Show empty state when no tasks exist
    - Show empty state when search/filter returns no results
    - Use useTasks hook for task operations
    - _Requirements: 10.1, 11.1, 11.2, 11.3, 11.4, 12.1, 13.1, 13.2, 13.4, 14.1, 14.3_

  - [ ] 17.2 Write property test for profile display
    - **Property 24: Dashboard displays user profile**
    - **Validates: Requirements 11.1**

  - [ ] 17.3 Write property test for statistics accuracy
    - **Property 25: Dashboard statistics match task data**
    - **Validates: Requirements 11.2, 11.3**

  - [ ] 17.4 Write property test for statistics updates
    - **Property 26: Statistics update with task operations**
    - **Validates: Requirements 11.4**

  - [ ] 17.5 Write property test for search functionality
    - **Property 31: Search input triggers backend requests**
    - **Validates: Requirements 13.1**

  - [ ] 17.6 Write property test for filter functionality
    - **Property 32: Filter selection triggers backend requests**
    - **Validates: Requirements 13.2**

  - [ ] 17.7 Write property test for empty results
    - **Property 33: Empty results show empty state**
    - **Validates: Requirements 13.4**

  - [ ] 17.8 Write property test for loading indicators
    - **Property 34: Loading states display indicators**
    - **Validates: Requirements 14.1**

  - [ ] 17.9 Write property test for toast notifications
    - **Property 35: Operations trigger toast notifications**
    - **Validates: Requirements 14.2**

  - [ ] 17.10 Write unit test for empty task list
    - Test that empty state is shown when user has no tasks
    - _Requirements: 14.3_

- [ ] 18. Implement responsive design
  - [~] 18.1 Add responsive styles to all components
    - Ensure mobile layout (320px+) works correctly
    - Ensure tablet layout (768px+) works correctly
    - Ensure desktop layout (1024px+) works correctly
    - Use TailwindCSS responsive utilities (sm:, md:, lg:)
    - Test on different screen sizes
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ] 18.2 Write unit tests for responsive breakpoints
    - Test mobile rendering (320px)
    - Test tablet rendering (768px)
    - Test desktop rendering (1024px)
    - _Requirements: 15.1, 15.2, 15.3_

- [ ] 19. Implement landing page
  - [~] 19.1 Create landing page (app/page.tsx)
    - Add welcome message and app description
    - Add navigation links to login and register pages
    - Style with TailwindCSS
    - Make responsive
    - _Requirements: 15.1, 15.2, 15.3_

- [~] 20. Checkpoint - Frontend complete
  - Ensure all frontend tests pass
  - Test all user flows manually (register → login → dashboard → CRUD tasks → logout)
  - Verify responsive design on different screen sizes
  - Verify error handling and validation work correctly
  - Ask the user if questions arise

- [ ] 21. Create documentation
  - [~] 21.1 Create backend README.md
    - Add project description and features
    - Document setup instructions (npm install, .env configuration)
    - List all environment variables with descriptions
    - Document API endpoints with request/response examples
    - Add testing instructions (npm test)
    - _Requirements: All_

  - [~] 21.2 Create frontend README.md
    - Add project description and features
    - Document setup instructions (npm install, environment configuration)
    - Document available scripts (dev, build, test)
    - Add component documentation
    - Add testing instructions
    - _Requirements: All_

  - [~] 21.3 Create root README.md
    - Add overall project description
    - Document tech stack
    - Add setup instructions for both frontend and backend
    - Document production deployment considerations
    - Add scalability plan: Nginx reverse proxy, Docker containerization, MongoDB Atlas, Redis caching, load balancing, CI/CD pipeline, rate limiting, horizontal scaling
    - _Requirements: All_

  - [~] 21.4 Create Postman collection
    - Add all API endpoints with example requests
    - Include authentication flow examples
    - Add environment variables for base URL and tokens
    - Export as JSON file
    - _Requirements: All_

- [ ] 22. Final integration and testing
  - [ ] 22.1 Run full test suite
    - Run all backend tests (unit + property tests)
    - Run all frontend tests (unit + property tests)
    - Verify all 42 correctness properties are tested
    - Ensure minimum coverage goals are met (80% backend, 75% frontend)
    - _Requirements: All_

  - [ ] 22.2 Manual end-to-end testing
    - Test complete user journey: register → login → create tasks → search → filter → edit → delete → logout
    - Test error scenarios: invalid inputs, unauthorized access, network errors
    - Test on different browsers (Chrome, Firefox, Safari)
    - Test on different devices (mobile, tablet, desktop)
    - _Requirements: All_

  - [ ] 22.3 Performance and security review
    - Verify passwords are hashed (not plaintext in database)
    - Verify JWT tokens are in HTTP-only cookies
    - Verify CORS is configured correctly
    - Verify error messages don't expose sensitive information
    - Test API response times under load
    - _Requirements: 1.5, 2.3, 3.4, 18.1, 18.3, 18.4_

- [~] 23. Final checkpoint - Project complete
  - Ensure all tests pass
  - Verify all documentation is complete and accurate
  - Confirm application is production-ready
  - Ask the user if questions arise

## Notes

- All tasks are required for comprehensive production-ready implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation follows a bottom-up approach: models → controllers → routes → components → integration
- All code should be clean, modular, well-commented, and production-ready
- No placeholder code - everything should be fully functional
