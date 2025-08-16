import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task, TaskStatus } from '@/types/task';
import { Edit, Trash2, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-status-todo text-white';
      case TaskStatus.IN_PROGRESS:
        return 'bg-status-progress text-white';
      case TaskStatus.DONE:
        return 'bg-status-done text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.DONE:
        return 'Done';
      default:
        return status;
    }
  };

  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return 'text-destructive';
    if (days <= 1) return 'text-warning';
    if (days <= 3) return 'text-status-progress';
    return 'text-muted-foreground';
  };

  const formatDaysRemaining = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return '1 day remaining';
    return `${days} days remaining`;
  };

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 animate-scale-in card-gradient">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getStatusColor(task.status)}>
                {getStatusText(task.status)}
              </Badge>
              {task.isUrgent && (
                <Badge variant="secondary" className="bg-warning text-warning-foreground">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {task.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{task.dueDate.toLocaleDateString()}</span>
            </div>
            <div className={`flex items-center gap-1 ${getDaysRemainingColor(task.daysRemaining)}`}>
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formatDaysRemaining(task.daysRemaining)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};