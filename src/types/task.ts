export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  isUrgent: boolean;
  createdAt: Date;
  dueDate: Date;
  userId: string;
  // Calculated field
  daysRemaining: number;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  isUrgent: boolean;
  dueDate: Date;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  isUrgent?: boolean;
  search?: string;
}

export interface TaskListParams {
  page: number;
  limit: number;
  filters?: TaskFilters;
  sortBy?: 'title' | 'dueDate' | 'createdAt' | 'daysRemaining';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}