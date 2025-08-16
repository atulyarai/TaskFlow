# Architecture Documentation

## Technical Overview

TaskFlow is a modern task management application built with React, TypeScript, and Vite. The application follows a component-based architecture with context-based state management and uses local storage for data persistence.

## Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Context API
- **Routing:** React Router DOM
- **Form Handling:** React Hook Form + Zod
- **UI Components:** shadcn/ui component library
- **Data Persistence:** Local Storage
- **Notifications:** Sonner (Toast notifications)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── tasks/          # Task management components
│   │   ├── TaskCard.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskStats.tsx
│   └── ui/             # Base UI components (shadcn/ui)
├── contexts/           # React Context providers
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   ├── useTasks.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utility libraries
│   └── utils.ts
├── pages/              # Page components
│   ├── AuthPage.tsx
│   ├── Dashboard.tsx
│   ├── Index.tsx
│   └── NotFound.tsx
├── types/              # TypeScript type definitions
│   ├── auth.ts
│   └── task.ts
└── utils/              # Helper functions
    └── demoData.ts
```

## Database Schema

### User Entity

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}
```

### Task Entity

```typescript
enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  isUrgent: boolean;
  createdAt: Date;
  dueDate: Date;
  userId: string;
  daysRemaining: number; // Calculated field
}
```

### Authentication Schema

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}
```

## Class/Module Breakdown

### 1. Authentication Module

#### AuthContext (`src/contexts/AuthContext.tsx`)

- **Purpose:** Global authentication state management
- **Responsibilities:**
  - User authentication state management
  - Login/logout functionality
  - User registration
  - Local storage persistence
  - Demo data initialization

#### LoginForm (`src/components/auth/LoginForm.tsx`)

- **Purpose:** User login interface
- **Responsibilities:**
  - Username/password input
  - Form validation with react-hook-form
  - Authentication submission
  - Error handling and user feedback

#### RegisterForm (`src/components/auth/RegisterForm.tsx`)

- **Purpose:** User registration interface
- **Responsibilities:**
  - User registration form with validation
  - Username, email, and password input
  - Account creation
  - Success/error feedback

### 2. Task Management Module

#### useTasks Hook (`src/hooks/useTasks.ts`)

- **Purpose:** Task data management and operations
- **Responsibilities:**
  - CRUD operations for tasks
  - Local storage persistence
  - Task filtering and search
  - Pagination and sorting
  - Statistics calculation
  - Loading state management

#### TaskForm (`src/components/tasks/TaskForm.tsx`)

- **Purpose:** Task creation and editing
- **Responsibilities:**
  - Task input fields (title, description, status, urgency, due date)
  - Form validation
  - Submit handling for create/edit modes
  - Error handling

#### TaskCard (`src/components/tasks/TaskCard.tsx`)

- **Purpose:** Individual task display
- **Responsibilities:**
  - Task information display
  - Status updates
  - Edit/delete actions
  - Urgency indicators
  - Days remaining calculation

#### TaskFilters (`src/components/tasks/TaskFilters.tsx`)

- **Purpose:** Task filtering and search
- **Responsibilities:**
  - Filter by status and urgency
  - Search functionality
  - Sort options
  - Filter state management

#### TaskStats (`src/components/tasks/TaskStats.tsx`)

- **Purpose:** Task statistics display
- **Responsibilities:**
  - Task count by status
  - Progress indicators
  - Summary statistics
  - Visual dashboard elements

### 3. UI Component Library

#### shadcn/ui Components (`src/components/ui/`)

- **Purpose:** Reusable UI components
- **Components:**
  - Button, Input, Card, Form
  - Dialog, Dropdown, Badge
  - Toast, Progress, Avatar
  - And many more...

### 4. Page Components

#### Dashboard (`src/pages/Dashboard.tsx`)

- **Purpose:** Main application interface
- **Responsibilities:**
  - Task overview and management
  - Statistics display
  - Quick actions
  - Navigation and layout

#### AuthPage (`src/pages/AuthPage.tsx`)

- **Purpose:** Authentication page wrapper
- **Responsibilities:**
  - Login/register form switching
  - Page layout and styling
  - Authentication flow management

## Data Flow Architecture

### Authentication Flow

1. User submits login/register form
2. Form validation occurs using react-hook-form + zod
3. Authentication logic processes credentials
4. User data is stored in local storage
5. AuthContext state is updated
6. User is redirected to dashboard
7. Protected routes are unlocked

### Task Management Flow

1. User creates/edits task via TaskForm
2. Form validation occurs
3. Task data is processed by useTasks hook
4. Data is persisted to local storage
5. UI is updated with new task data
6. Success/error feedback is shown via toast notifications

### State Management

- **Global State:** AuthContext for user authentication
- **Local State:** Component-level state for forms and UI
- **Data State:** useTasks hook for task data management
- **Persistence:** Local storage for user sessions and task data

## Data Persistence Strategy

### Local Storage Implementation

```typescript
// User data persistence
localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("users", JSON.stringify(users));

// Task data persistence
localStorage.setItem("tasks", JSON.stringify(tasks));
```

### Demo Data Initialization

- Automatic demo user creation on first load
- Sample tasks for testing and demonstration
- Realistic task data with various statuses and urgency levels

## API Integration (Future-Ready)

### Authentication Endpoints (Planned)

```typescript
POST / api / auth / register;
POST / api / auth / login;
POST / api / auth / logout;
GET / api / auth / me;
```

### Task Endpoints (Planned)

```typescript
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
PATCH /api/tasks/:id/status
```

## Security Considerations

- Form validation with Zod schema validation
- Input sanitization and validation
- Local storage data validation
- Protected route implementation
- Secure password handling (for future API integration)

## Performance Optimizations

- Efficient local storage operations
- Optimized re-rendering with proper dependency arrays
- Lazy loading for route-based code splitting (planned)
- Memoization for expensive calculations
- Bundle size optimization with Vite

## Testing Strategy

- Component testing with React Testing Library (planned)
- Hook testing for useTasks and useAuth
- Integration testing for authentication flow
- E2E testing for user workflows
- Local storage mocking for development

## Deployment Architecture

- **Frontend:** Static hosting (Vercel/Netlify)
- **Backend:** Node.js/Express API (planned)
- **Database:** PostgreSQL/MongoDB (planned)
- **Authentication:** JWT tokens (planned)
- **File Storage:** Cloud storage (planned)

## Key Features Implemented

1. **User Authentication**

   - Login/Register functionality
   - Session persistence
   - Protected routes
   - Demo user for testing

2. **Task Management**

   - Full CRUD operations
   - Status management (TODO, IN_PROGRESS, DONE)
   - Urgency flags
   - Due date tracking
   - Days remaining calculation

3. **Advanced Features**

   - Task filtering and search
   - Sorting by multiple fields
   - Pagination support
   - Statistics dashboard
   - Responsive design

4. **User Experience**
   - Modern UI with shadcn/ui
   - Toast notifications
   - Loading states
   - Form validation
   - Error handling

---

This architecture provides a solid foundation for the TaskFlow application with clear separation of concerns, type safety, and modern React patterns. The local storage implementation allows for immediate functionality while maintaining a structure that can easily transition to a full backend API.
