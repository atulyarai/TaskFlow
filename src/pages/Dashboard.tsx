import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFiltersComponent } from '@/components/tasks/TaskFilters';
import { TaskStats } from '@/components/tasks/TaskStats';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Task, TaskFilters, TaskListParams, TaskListResponse, CreateTaskData, UpdateTaskData } from '@/types/task';
import { Plus, LogOut, ArrowLeft, ArrowRight, LayoutGrid, List } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { auth, logout } = useAuth();
  const { getTasks, createTask, updateTask, deleteTask, getTaskStats, isLoading } = useTasks();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<TaskListResponse>({
    tasks: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  
  const [filters, setFilters] = useState<TaskFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'title' | 'dueDate' | 'createdAt' | 'daysRemaining'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    urgent: 0,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const loadTasks = async (params?: Partial<TaskListParams>) => {
    const taskParams: TaskListParams = {
      page: currentPage,
      limit: 8,
      filters,
      sortBy,
      sortOrder,
      ...params,
    };

    try {
      const result = await getTasks(taskParams);
      setTasks(result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    }
  };

  const loadStats = () => {
    setStats(getTaskStats());
  };

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [currentPage, filters, sortBy, sortOrder]);

  const handleCreateTask = async (data: CreateTaskData) => {
    await createTask(data);
    loadTasks();
    loadStats();
    toast({
      title: 'Success',
      description: 'Task created successfully',
    });
  };

  const handleUpdateTask = async (data: UpdateTaskData) => {
    await updateTask(data);
    loadTasks();
    loadStats();
    setEditingTask(null);
    toast({
      title: 'Success',
      description: 'Task updated successfully',
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
      loadTasks();
      loadStats();
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    }
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const openTaskForm = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-muted-foreground">Welcome back, {auth.user?.username}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="hero" onClick={openTaskForm}>
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <TaskStats stats={stats} />

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <TaskFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          </div>
          <Card className="lg:w-80 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dueDate">Due Date</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="createdAt">Created</SelectItem>
                      <SelectItem value="daysRemaining">Days Left</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">↑</SelectItem>
                      <SelectItem value="desc">↓</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tasks.tasks.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No tasks found</p>
              <Button variant="hero" onClick={openTaskForm}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {tasks.tasks.map((task, index) => (
              <div key={task.id} style={{ animationDelay: `${index * 100}ms` }}>
                <TaskCard
                  task={task}
                  onEdit={openEditForm}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {tasks.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="px-4 py-2 text-muted-foreground">
              Page {currentPage} of {tasks.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === tasks.totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>

      {/* Task Form Dialog */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={closeTaskForm}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        isLoading={isLoading}
      />
    </div>
  );
};