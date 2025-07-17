import React, { createContext, useContext, useState, useEffect } from "react";

// Types for our data
export type Habit = {
  id: string;
  title: string;
  description: string;
  frequency: "daily" | "weekly";
  daysCompleted: string[]; // ISO date strings
  createdAt: string;
  streak: number;
};

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: string; // ISO date string
  mood?: "great" | "good" | "neutral" | "bad" | "terrible";
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  targetDate: string; // ISO date string
  progress: number; // 0-100
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  completed: boolean;
  createdAt: string;
};

type AppContextType = {
  habits: Habit[];
  journalEntries: JournalEntry[];
  goals: Goal[];
  addHabit: (habit: Omit<Habit, "id" | "daysCompleted" | "createdAt" | "streak"> | Habit) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "date"> | JournalEntry) => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "completed"> | Goal) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  toggleTaskCompletion: (goalId: string, taskId: string) => void;
  deleteHabit: (habitId: string) => void;
  deleteJournalEntry: (entryId: string) => void;
  deleteGoal: (goalId: string) => void;
  activeTab: "dashboard" | "habits" | "journal" | "goals";
  setActiveTab: (tab: "dashboard" | "habits" | "journal" | "goals") => void;
};

// Sample data
const sampleHabits: Habit[] = [
  {
    id: "h1",
    title: "Morning Meditation",
    description: "15 minutes of mindfulness meditation",
    frequency: "daily",
    daysCompleted: [
      new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    ],
    createdAt: new Date(Date.now() - 604800000).toISOString(), // A week ago
    streak: 1,
  },
  {
    id: "h2",
    title: "Read a Book",
    description: "Read at least 30 minutes",
    frequency: "daily",
    daysCompleted: [
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // Two days ago
      new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    ],
    createdAt: new Date(Date.now() - 1209600000).toISOString(), // Two weeks ago
    streak: 2,
  },
];

const sampleJournalEntries: JournalEntry[] = [
  {
    id: "j1",
    title: "My reflection today",
    content: "Today was a productive day. I managed to complete most of my tasks and had time for self-care.",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    mood: "good",
  },
];

const sampleGoals: Goal[] = [
  {
    id: "g1",
    title: "Run a 5K",
    description: "Train and complete a 5K run",
    targetDate: new Date(Date.now() + 7776000000).toISOString(), // 90 days from now
    progress: 25,
    tasks: [
      { id: "t1", title: "Buy running shoes", completed: true },
      { id: "t2", title: "Complete week 1 of training", completed: true },
      { id: "t3", title: "Complete week 2 of training", completed: false },
      { id: "t4", title: "Register for a 5K event", completed: false },
    ],
    completed: false,
    createdAt: new Date(Date.now() - 604800000).toISOString(), // A week ago
  },
];

// Create context with default values
const AppContext = createContext<AppContextType>({
  habits: [],
  journalEntries: [],
  goals: [],
  addHabit: () => {},
  toggleHabitCompletion: () => {},
  addJournalEntry: () => {},
  addGoal: () => {},
  updateGoalProgress: () => {},
  toggleTaskCompletion: () => {},
  deleteHabit: () => {},
  deleteJournalEntry: () => {},
  deleteGoal: () => {},
  activeTab: "dashboard",
  setActiveTab: () => {},
});

// Load data from localStorage if available
const loadFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(`uplift-app-${key}`);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }
  return defaultValue;
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => 
    loadFromLocalStorage("habits", sampleHabits)
  );
  
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => 
    loadFromLocalStorage("journal", sampleJournalEntries)
  );
  
  const [goals, setGoals] = useState<Goal[]>(() => 
    loadFromLocalStorage("goals", sampleGoals)
  );

  const [activeTab, setActiveTab] = useState<"dashboard" | "habits" | "journal" | "goals">("dashboard");

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("uplift-app-habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("uplift-app-journal", JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem("uplift-app-goals", JSON.stringify(goals));
  }, [goals]);

  // Habit functions
  const addHabit = (habit: Omit<Habit, "id" | "daysCompleted" | "createdAt" | "streak"> | Habit) => {
    // Check if this is an edit (has an id) or a new habit
    if ('id' in habit && habit.id) {
      // This is an edit, replace the existing habit
      setHabits(habits.map(h => h.id === habit.id ? habit as Habit : h));
    } else {
      // This is a new habit
      const newHabit: Habit = {
        ...(habit as Omit<Habit, "id" | "daysCompleted" | "createdAt" | "streak">),
        id: `h${Date.now()}`,
        daysCompleted: [],
        createdAt: new Date().toISOString(),
        streak: 0,
      };
      setHabits([...habits, newHabit]);
    }
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const alreadyCompleted = habit.daysCompleted.includes(date);
          let newDaysCompleted;
          let newStreak;
          
          if (alreadyCompleted) {
            newDaysCompleted = habit.daysCompleted.filter((d) => d !== date);
            // Recalculate streak
            newStreak = calculateStreak(newDaysCompleted);
          } else {
            newDaysCompleted = [...habit.daysCompleted, date].sort();
            // Update streak by checking if today and yesterday (or the most recent day) are in sequence
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            
            if (date === today && (habit.daysCompleted.includes(yesterday) || habit.streak === 0)) {
              newStreak = habit.streak + 1;
            } else {
              newStreak = calculateStreak([...habit.daysCompleted, date]);
            }
          }
          
          return {
            ...habit,
            daysCompleted: newDaysCompleted,
            streak: newStreak,
          };
        }
        return habit;
      })
    );
  };

  // Helper function to calculate streak
  const calculateStreak = (daysCompleted: string[]): number => {
    if (daysCompleted.length === 0) return 0;
    
    // Sort dates in ascending order
    const sortedDays = [...daysCompleted].sort();
    
    // Start with the most recent day
    let streak = 1;
    let currentDate = new Date(sortedDays[sortedDays.length - 1]);
    let previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    
    // Check backwards day by day
    for (let i = sortedDays.length - 2; i >= 0; i--) {
      const checkDate = new Date(sortedDays[i]);
      
      if (checkDate.toISOString().split('T')[0] === previousDate.toISOString().split('T')[0]) {
        streak++;
        previousDate.setDate(previousDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
  };

  // Journal functions
  const addJournalEntry = (entry: Omit<JournalEntry, "id" | "date"> | JournalEntry) => {
    // Check if this is an edit (has an id) or a new entry
    if ('id' in entry && entry.id) {
      // This is an edit, replace the existing entry
      setJournalEntries(entries => 
        entries.map(e => e.id === entry.id ? entry as JournalEntry : e)
      );
    } else {
      // This is a new entry
      const newEntry: JournalEntry = {
        ...(entry as Omit<JournalEntry, "id" | "date">),
        id: `j${Date.now()}`,
        date: new Date().toISOString(),
      };
      setJournalEntries(entries => [...entries, newEntry]);
    }
  };

  const deleteJournalEntry = (entryId: string) => {
    setJournalEntries(entries => entries.filter((entry) => entry.id !== entryId));
  };

  // Goal functions
  const addGoal = (goal: Omit<Goal, "id" | "createdAt" | "completed"> | Goal) => {
    // Check if this is an edit (has an id) or a new goal
    if ('id' in goal && goal.id) {
      // This is an edit, replace the existing goal
      setGoals(goals.map(g => g.id === goal.id ? goal as Goal : g));
    } else {
      // This is a new goal
      const newGoal: Goal = {
        ...(goal as Omit<Goal, "id" | "createdAt" | "completed">),
        id: `g${Date.now()}`,
        createdAt: new Date().toISOString(),
        completed: false,
      };
      setGoals([...goals, newGoal]);
    }
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const isCompleted = progress === 100;
          return {
            ...goal,
            progress,
            completed: isCompleted,
          };
        }
        return goal;
      })
    );
  };

  const toggleTaskCompletion = (goalId: string, taskId: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedTasks = goal.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          );
          
          // Calculate progress based on completed tasks
          const completedTasks = updatedTasks.filter((task) => task.completed).length;
          const totalTasks = updatedTasks.length;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          
          return {
            ...goal,
            tasks: updatedTasks,
            progress,
            completed: progress === 100,
          };
        }
        return goal;
      })
    );
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId));
  };

  return (
    <AppContext.Provider
      value={{
        habits,
        journalEntries,
        goals,
        addHabit,
        toggleHabitCompletion,
        addJournalEntry,
        addGoal,
        updateGoalProgress,
        toggleTaskCompletion,
        deleteHabit,
        deleteJournalEntry,
        deleteGoal,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);
