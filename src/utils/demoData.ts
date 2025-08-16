import { TaskStatus } from '@/types/task';

// Initialize demo data
export const initializeDemoData = () => {
  // Check if demo user already exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const demoUserExists = users.some((user: any) => user.username === 'demo');
  
  if (!demoUserExists) {
    // Add demo user
    const demoUser = {
      id: 'demo-user-1',
      username: 'demo',
      email: 'demo@taskflow.com',
      password: 'demo',
      createdAt: new Date().toISOString(),
    };
    
    users.push(demoUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Add demo tasks
    const demoTasks = [
      {
        id: 'task-1',
        title: 'Design System Implementation',
        description: 'Create a comprehensive design system with reusable components, color schemes, and typography guidelines.',
        status: TaskStatus.IN_PROGRESS,
        isUrgent: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'demo-user-1',
      },
      {
        id: 'task-2',
        title: 'API Documentation',
        description: 'Write comprehensive API documentation using Swagger/OpenAPI specification.',
        status: TaskStatus.TODO,
        isUrgent: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'demo-user-1',
      },
      {
        id: 'task-3',
        title: 'User Authentication Flow',
        description: 'Implement secure user authentication with login, registration, and session management.',
        status: TaskStatus.DONE,
        isUrgent: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'demo-user-1',
      },
      {
        id: 'task-4',
        title: 'Performance Optimization',
        description: 'Optimize application performance by implementing lazy loading, code splitting, and caching strategies.',
        status: TaskStatus.TODO,
        isUrgent: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'demo-user-1',
      },
      {
        id: 'task-5',
        title: 'Mobile Responsiveness',
        description: 'Ensure the application works seamlessly across all device sizes and orientations.',
        status: TaskStatus.IN_PROGRESS,
        isUrgent: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'demo-user-1',
      },
      {
        id: 'task-6',
        title: 'Testing Suite Setup',
        description: 'Set up comprehensive testing including unit tests, integration tests, and end-to-end tests.',
        status: TaskStatus.TODO,
        isUrgent: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'demo-user-1',
      },
      {
        id: 'task-7',
        title: 'Database Migration',
        description: 'Plan and execute database schema migration for the new features.',
        status: TaskStatus.DONE,
        isUrgent: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'demo-user-1',
      },
      {
        id: 'task-8',
        title: 'Code Review Process',
        description: 'Establish code review guidelines and implement peer review process for all changes.',
        status: TaskStatus.TODO,
        isUrgent: false,
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'demo-user-1',
      },
    ];
    
    localStorage.setItem('tasks', JSON.stringify(demoTasks));
  }
};