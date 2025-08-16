import { useState, useEffect } from 'react';
import { Task, TaskStatus, CreateTaskData, UpdateTaskData, TaskListParams, TaskListResponse } from '@/types/task';
import { useAuth } from '@/contexts/AuthContext';

// Mock data storage using localStorage
const TASKS_STORAGE_KEY = 'tasks';

export const useTasks = () => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getAllTasks = (): Task[] => {
    const tasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY) || '[]');
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: new Date(task.dueDate),
      daysRemaining: calculateDaysRemaining(new Date(task.dueDate)),
    }));
  };

  const calculateDaysRemaining = (dueDate: Date): number => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTasks = async (params: TaskListParams): Promise<TaskListResponse> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let tasks = getAllTasks().filter(task => task.userId === auth.user?.id);

    // Apply filters
    if (params.filters) {
      if (params.filters.status) {
        tasks = tasks.filter(task => task.status === params.filters!.status);
      }
      if (params.filters.isUrgent !== undefined) {
        tasks = tasks.filter(task => task.isUrgent === params.filters!.isUrgent);
      }
      if (params.filters.search) {
        const searchLower = params.filters.search.toLowerCase();
        tasks = tasks.filter(task => 
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        );
      }
    }

    // Apply sorting
    if (params.sortBy) {
      tasks.sort((a, b) => {
        let aValue: any = a[params.sortBy!];
        let bValue: any = b[params.sortBy!];

        if (aValue instanceof Date) {
          aValue = aValue.getTime();
          bValue = bValue.getTime();
        }

        if (params.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    setIsLoading(false);

    return {
      tasks: paginatedTasks,
      total: tasks.length,
      page: params.page,
      totalPages: Math.ceil(tasks.length / params.limit),
    };
  };

  const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    setIsLoading(true);

    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      userId: auth.user!.id,
      createdAt: new Date(),
      daysRemaining: calculateDaysRemaining(taskData.dueDate),
    };

    const tasks = getAllTasks();
    tasks.push(newTask);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

    setIsLoading(false);
    return newTask;
  };

  const updateTask = async (taskData: UpdateTaskData): Promise<Task> => {
    setIsLoading(true);

    const tasks = getAllTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskData.id);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...taskData,
      daysRemaining: taskData.dueDate ? calculateDaysRemaining(taskData.dueDate) : tasks[taskIndex].daysRemaining,
    };

    tasks[taskIndex] = updatedTask;
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

    setIsLoading(false);
    return updatedTask;
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    setIsLoading(true);

    const tasks = getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filteredTasks));

    setIsLoading(false);
  };

  const getTaskStats = () => {
    const tasks = getAllTasks().filter(task => task.userId === auth.user?.id);
    return {
      total: tasks.length,
      todo: tasks.filter(task => task.status === TaskStatus.TODO).length,
      inProgress: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length,
      done: tasks.filter(task => task.status === TaskStatus.DONE).length,
      urgent: tasks.filter(task => task.isUrgent).length,
    };
  };

  return {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
    isLoading,
  };
};