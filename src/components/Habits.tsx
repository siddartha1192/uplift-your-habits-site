import React, { useState } from "react";
import { useAppContext, Habit } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, CheckCircle2, Calendar, Flame, X } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";

const Habits: React.FC = () => {
  const { habits, addHabit, toggleHabitCompletion, deleteHabit } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    frequency: "daily" as "daily" | "weekly",
  });

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Create a habit
  const handleCreateHabit = () => {
    if (newHabit.title.trim()) {
      addHabit(newHabit);
      setNewHabit({
        title: "",
        description: "",
        frequency: "daily",
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Habits</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-habit hover:bg-habit-dark">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Habit</DialogTitle>
              <DialogDescription>Add a new habit to track your daily or weekly activities</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Habit Name
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Morning Meditation"
                  value={newHabit.title}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your habit"
                  rows={3}
                  value={newHabit.description}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="frequency" className="text-sm font-medium">
                  Frequency
                </label>
                <Select
                  value={newHabit.frequency}
                  onValueChange={(value: "daily" | "weekly") =>
                    setNewHabit({ ...newHabit, frequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateHabit} className="bg-habit hover:bg-habit-dark">
                Create Habit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-habit/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-habit" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your first habit to start tracking your daily wins and building consistency.
          </p>
          <Button 
            className="bg-habit hover:bg-habit-dark"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Habit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onToggle={toggleHabitCompletion}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface HabitCardProps {
  habit: Habit;
  today: string;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  today,
  onToggle,
  onDelete,
}) => {
  const isCompletedToday = habit.daysCompleted.includes(today);
  
  // Calculate last 7 days for display
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split('T')[0]);
  }

  // Calculate completion rate for the last 7 days
  const completedDaysCount = last7Days.filter(date => habit.daysCompleted.includes(date)).length;
  const completionRate = Math.round((completedDaysCount / 7) * 100);

  return (
    <Card 
      className="habit-card overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-[1.01]"
      onClick={() => onToggle(habit.id, today)}
    >
      <CardContent className="p-0">
        <div className="p-4 pb-3 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{habit.title}</h3>
            <p className="text-muted-foreground text-sm">{habit.description}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit.id);
            }}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Habit stats with circular progress - updated layout */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center text-sm mb-1">
              <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>{habit.frequency}</span>
            </div>
            <div className="flex items-center text-sm">
              <Flame className="mr-1 h-4 w-4 text-orange-500" />
              <span>
                {habit.streak} {habit.streak === 1 ? "day" : "days"}
              </span>
            </div>
          </div>
          
          <CircularProgress 
            value={completionRate} 
            size={60} 
            strokeWidth={6}
            indicatorColor="stroke-habit" 
            className="animate-fade-in"
          />
        </div>
        
        {/* Last 7 days tracker */}
        <div className="px-4 py-2 border-t">
          <div className="text-xs text-muted-foreground mb-2">Last 7 days</div>
          <div className="flex justify-between">
            {last7Days.map((date) => {
              const isCompleted = habit.daysCompleted.includes(date);
              const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
              
              return (
                <div 
                  key={date} 
                  className="flex flex-col items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(habit.id, date);
                  }}
                >
                  <div className="text-xs mb-1">{dayLabel}</div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted 
                        ? "bg-habit border-habit text-white scale-110" 
                        : "border-gray-300 hover:border-habit/50"
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Action button */}
        <div className="p-4 border-t">
          <div
            className={`w-full h-12 rounded-md flex items-center justify-center transition-all ${
              isCompletedToday 
                ? "bg-green-50 text-habit border border-habit" 
                : "bg-habit text-white hover:bg-habit-dark"
            }`}
          >
            {isCompletedToday ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Completed Today
              </>
            ) : (
              "Mark as Completed"
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Habits;
