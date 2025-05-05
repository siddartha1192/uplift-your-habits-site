
import React, { useState } from "react";
import { useAppContext, Goal } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Target, Calendar, Trophy, Pencil, X, Plus } from "lucide-react";

const Goals: React.FC = () => {
  const { goals, addGoal, toggleTaskCompletion, deleteGoal } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    tasks: [] as { id: string; title: string; completed: boolean }[],
    progress: 0,
  });
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Open edit dialog with goal data
  const handleEditGoal = (goal: Goal) => {
    setNewGoal({
      title: goal.title,
      description: goal.description,
      targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
      tasks: [...goal.tasks], // Create a copy of tasks
      progress: goal.progress,
    });
    setEditingGoalId(goal.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Add task to new goal
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      setNewGoal({
        ...newGoal,
        tasks: [
          ...newGoal.tasks,
          {
            id: Date.now().toString(),
            title: newTaskTitle,
            completed: false,
          },
        ],
      });
      setNewTaskTitle("");
    }
  };

  // Remove task from new goal
  const handleRemoveTask = (taskId: string) => {
    setNewGoal({
      ...newGoal,
      tasks: newGoal.tasks.filter((task) => task.id !== taskId),
    });
  };

  // Create or update a goal
  const handleSaveGoal = () => {
    if (newGoal.title.trim() && newGoal.targetDate) {
      if (isEditMode && editingGoalId) {
        // Delete old goal and add updated one with same ID and creation date
        const goalToEdit = goals.find(goal => goal.id === editingGoalId);
        if (goalToEdit) {
          deleteGoal(editingGoalId);
          
          // Calculate progress based on completed tasks
          const completedTasks = newGoal.tasks.filter(task => task.completed).length;
          const progress = newGoal.tasks.length > 0 
            ? Math.round((completedTasks / newGoal.tasks.length) * 100) 
            : 0;
          
          addGoal({
            ...newGoal,
            id: editingGoalId,
            progress: progress,
            createdAt: goalToEdit.createdAt,
            completed: progress === 100,
          } as any);
        }
      } else {
        // Create new goal
        addGoal(newGoal);
      }
      
      // Reset form
      setNewGoal({
        title: "",
        description: "",
        targetDate: "",
        tasks: [],
        progress: 0,
      });
      setIsEditMode(false);
      setEditingGoalId(null);
      setIsDialogOpen(false);
    }
  };

  // Reset form when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setNewGoal({
        title: "",
        description: "",
        targetDate: "",
        tasks: [],
        progress: 0,
      });
      setNewTaskTitle("");
      setIsEditMode(false);
      setEditingGoalId(null);
    }
  };

  // Filter goals into active and completed
  const activeGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Goals</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-goal hover:bg-goal-dark">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Goal" : "Create a New Goal"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Goal Title
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Run a 5K"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal"
                  rows={3}
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="targetDate" className="text-sm font-medium">
                  Target Date
                </label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tasks</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a task"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTask();
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleAddTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {newGoal.tasks.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {newGoal.tasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between bg-muted/50 p-2 rounded"
                      >
                        <div className="flex items-center">
                          <Checkbox
                            id={`new-task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => {
                              setNewGoal({
                                ...newGoal,
                                tasks: newGoal.tasks.map(t => 
                                  t.id === task.id ? { ...t, completed: !t.completed } : t
                                )
                              });
                            }}
                            className="mr-2 data-[state=checked]:bg-goal data-[state=checked]:border-goal"
                          />
                          <span>{task.title}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveTask(task.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveGoal} className="bg-goal hover:bg-goal-dark">
                {isEditMode ? "Save Changes" : "Create Goal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-goal/10 flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-goal" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Set meaningful goals to give direction to your habits and track your progress.
          </p>
          <Button 
            className="bg-goal hover:bg-goal-dark"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Goals */}
          <div>
            <h3 className="text-lg font-semibold mb-4">In Progress</h3>
            {activeGoals.length === 0 ? (
              <p className="text-muted-foreground">No active goals</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggleTask={toggleTaskCompletion}
                    onDelete={deleteGoal}
                    onEdit={handleEditGoal}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Completed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggleTask={toggleTaskCompletion}
                    onDelete={deleteGoal}
                    onEdit={handleEditGoal}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface GoalCardProps {
  goal: Goal;
  onToggleTask: (goalId: string, taskId: string) => void;
  onDelete: (goalId: string) => void;
  onEdit: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onToggleTask,
  onDelete,
  onEdit,
}) => {
  const targetDate = new Date(goal.targetDate);
  const daysLeft = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  const formattedTargetDate = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  // Format creation date
  const createdAt = new Date(goal.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 pb-2 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg flex items-center">
              {goal.title}
              {goal.completed && (
                <Trophy className="ml-2 h-4 w-4 text-goal" />
              )}
            </h3>
            <p className="text-muted-foreground text-sm">{goal.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onEdit(goal)}
              className="text-muted-foreground hover:text-goal transition-colors p-1 rounded-full hover:bg-muted"
              aria-label="Edit goal"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(goal.id)}
              className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-full hover:bg-muted"
              aria-label="Delete goal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Goal progress */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <Progress 
            value={goal.progress} 
            className="h-2 mb-4"
            indicatorClassName="bg-goal"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {createdAt}</span>
            </div>
            <div className="flex items-center">
              <Target className="mr-1 h-3 w-3" />
              <span>Target: {formattedTargetDate}</span>
            </div>
          </div>
          
          {/* Tasks */}
          {goal.tasks.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Tasks:</h4>
              <ul className="space-y-2">
                {goal.tasks.map((task) => (
                  <li key={task.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => onToggleTask(goal.id, task.id)}
                      className="data-[state=checked]:bg-goal data-[state=checked]:border-goal"
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-sm ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Days left (show only if not completed) */}
          {!goal.completed && daysLeft > 0 && (
            <div className="mt-4 text-sm text-center px-2 py-1 bg-goal/10 rounded-md text-goal-dark">
              {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
            </div>
          )}
          
          {/* Completed message */}
          {goal.completed && (
            <div className="mt-4 text-sm text-center px-2 py-1 bg-green-100 rounded-md text-green-800">
              Goal completed! 🎉
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Goals;
