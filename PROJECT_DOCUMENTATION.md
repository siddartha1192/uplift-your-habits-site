# 🌟 Uplift Your Habits - Complete Project Documentation

> A comprehensive guide to understanding your health and wellness React application

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & File Structure](#architecture--file-structure)
4. [Core Concepts](#core-concepts)
5. [Component Breakdown](#component-breakdown)
6. [Data Flow & State Management](#data-flow--state-management)
7. [Styling System](#styling-system)
8. [Feature Deep Dives](#feature-deep-dives)
9. [How to Modify Features](#how-to-modify-features)
10. [Common Patterns](#common-patterns)

---

## 1. Project Overview

### What is This App?
A health and wellness application that helps users:
- **Track Daily Habits** - Build and maintain positive routines
- **Journal Entries** - Reflect on thoughts and emotions with mood tracking
- **Set Goals** - Break down ambitions into actionable tasks
- **View Dashboard** - Visual analytics of progress and trends

### Key Features
- ✅ Habit tracking with streaks
- 📔 Journal entries with mood selection
- 🎯 Goal management with task breakdown
- 📊 Visual dashboard with graphs and progress indicators
- 💾 Local storage persistence (data saved in browser)

---

## 2. Technology Stack

### Frontend Framework
**React 18.3.1** - JavaScript library for building user interfaces
- **Component-based**: UI is broken into reusable pieces
- **Declarative**: You describe what the UI should look like, React handles updates
- **Virtual DOM**: Efficient rendering by updating only what changed

### Language
**TypeScript 5.5.3** - JavaScript with type safety
- Catches errors before runtime
- Better IDE autocomplete
- Self-documenting code with types

### Build Tool
**Vite 5.4.10** - Fast development server and build tool
- Hot Module Replacement (HMR) - instant updates without full refresh
- Fast builds using esbuild
- Optimized production bundles

### UI Components
**shadcn/ui** - Pre-built, accessible component library
- Built on **Radix UI** (headless components)
- Styled with **Tailwind CSS**
- Fully customizable

### Styling
**Tailwind CSS 3.4.11** - Utility-first CSS framework
- Classes like `flex`, `bg-blue-500`, `p-4` instead of custom CSS
- Responsive design with `md:`, `lg:` prefixes
- Theme customization in `tailwind.config.ts`

### Routing
**React Router DOM 6.26.2** - Navigation between pages
- Client-side routing (no page reloads)
- URL-based navigation
- Nested routes support

### Additional Libraries
- **date-fns** - Date formatting and manipulation
- **lucide-react** - Beautiful icon library
- **sonner** - Toast notifications
- **React Hook Form** + **Zod** - Form handling with validation

---

## 3. Architecture & File Structure

### Project Structure
```
uplift-your-habits-site/
├── src/
│   ├── main.tsx                 # App entry point
│   ├── App.tsx                  # Root component with routing
│   ├── index.css                # Global styles & theme
│   │
│   ├── components/              # Reusable UI components
│   │   ├── Navigation.tsx       # Top navigation bar
│   │   ├── Dashboard.tsx        # Main dashboard with analytics
│   │   ├── Habits.tsx           # Habits list & management
│   │   ├── Journal.tsx          # Journal entries list
│   │   ├── Goals.tsx            # Goals list & management
│   │   │
│   │   └── ui/                  # shadcn/ui components
│   │       ├── button.tsx       # Button component
│   │       ├── card.tsx         # Card container
│   │       ├── input.tsx        # Text input
│   │       ├── textarea.tsx     # Multi-line input
│   │       ├── dialog.tsx       # Modal dialogs
│   │       ├── progress.tsx     # Progress bar
│   │       ├── circular-progress.tsx  # Circular progress ring
│   │       └── ... (30+ components)
│   │
│   ├── pages/                   # Full-page components
│   │   ├── Index.tsx            # Main page with tab navigation
│   │   ├── JournalEntry.tsx     # Journal entry editor
│   │   └── NotFound.tsx         # 404 page
│   │
│   ├── contexts/                # Global state management
│   │   └── AppContext.tsx       # Shared data (habits, journal, goals)
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-toast.ts         # Toast notification hook
│   │   └── use-mobile.tsx       # Mobile detection
│   │
│   └── lib/
│       └── utils.ts             # Utility functions (cn, etc.)
│
├── public/                      # Static assets
├── package.json                 # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind customization
└── vite.config.ts              # Vite configuration
```

---

## 4. Core Concepts

### React Fundamentals

#### Components
**What**: Independent, reusable pieces of UI
**How**: Functions that return JSX (HTML-like syntax)

```tsx
// Simple component
const Greeting: React.FC = () => {
  return <h1>Hello World</h1>;
};

// Component with props
interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};
```

#### State (useState)
**What**: Data that can change over time
**How**: When state updates, React re-renders the component

```tsx
const [count, setCount] = useState(0);
// count = current value
// setCount = function to update value

// Update state
setCount(count + 1);
```

#### Effects (useEffect)
**What**: Side effects that run after render
**How**: Fetch data, setup subscriptions, update DOM

```tsx
useEffect(() => {
  // This runs after component renders
  console.log('Component mounted');

  // Cleanup function (optional)
  return () => {
    console.log('Component unmounting');
  };
}, [dependency]); // Re-run when dependency changes
```

#### Context (useContext)
**What**: Share data across components without prop drilling
**How**: Provider wraps components, consumers access data

```tsx
// Create context
const AppContext = createContext();

// Provider (in parent)
<AppContext.Provider value={data}>
  <ChildComponent />
</AppContext.Provider>

// Consumer (in child)
const data = useContext(AppContext);
```

#### Refs (useRef)
**What**: Persist values across renders without causing re-render
**How**: Store mutable values, access DOM elements

```tsx
const countRef = useRef(0);
// countRef.current = actual value
// Changing countRef.current doesn't trigger re-render
```

### TypeScript Basics

#### Types & Interfaces
```tsx
// Type definition
type Mood = "great" | "good" | "neutral" | "bad" | "terrible";

// Interface for objects
interface Habit {
  id: string;
  title: string;
  description: string;
  daysCompleted: string[];
  streak: number;
}

// Component props interface
interface DashboardProps {
  userName?: string; // Optional with ?
  count: number;     // Required
}
```

---

## 5. Component Breakdown

### 5.1 Navigation.tsx
**Purpose**: Top navigation bar with tabs

**Key Features**:
- Tab-based navigation (Dashboard, Habits, Journal, Goals)
- Active state highlighting
- Responsive design (icons only on mobile)
- Gradient logo

**Props**: None (uses context)

**State Management**:
- Gets `activeTab` and `setActiveTab` from AppContext
- Updates active tab on click

**How It Works**:
```tsx
// 1. Get context
const { activeTab, setActiveTab } = useAppContext();

// 2. Define tabs
const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  // ... more tabs
];

// 3. Render tabs with active state
{tabs.map(tab => (
  <button
    className={activeTab === tab.id ? "bg-primary/10" : ""}
    onClick={() => setActiveTab(tab.id)}
  >
    <tab.icon />
    {tab.label}
  </button>
))}
```

---

### 5.2 Dashboard.tsx
**Purpose**: Main analytics dashboard with visual progress

**Key Features**:
- Summary cards for Habits, Journal, Goals
- Monthly mood trend graph (30 days)
- Weekly habit completion heatmap (7 days)
- Individual goal progress breakdown

**Data Calculations**:

```tsx
// 1. Calculate habit completion rate
const habitsCompletedToday = habits.filter(habit =>
  habit.daysCompleted.includes(today)
).length;

const habitCompletionRate = habits.length > 0
  ? Math.round((habitsCompletedToday / habits.length) * 100)
  : 0;

// 2. Calculate mood data for last 30 days
const getLast30DaysMoodData = () => {
  const moodValues = {
    'great': 5, 'good': 4, 'neutral': 3, 'bad': 2, 'terrible': 1
  };

  // Generate array of last 30 dates
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  // Map each date to mood data
  return last30Days.map(date => {
    const entry = journalEntries.find(e =>
      new Date(e.date).toISOString().split('T')[0] === date
    );
    return {
      date,
      mood: entry?.mood,
      value: entry?.mood ? moodValues[entry.mood] : 0
    };
  });
};
```

**Visual Components**:

**Mood Graph**:
- 30 vertical bars representing days
- Height = mood value (1-5)
- Color = mood type (green=great, red=terrible)
- Hover shows tooltip with date and emoji

**Habit Heatmap**:
- 7 boxes for days of the week
- Color intensity = completion percentage
- Shows completed/total ratio

**Goal Cards**:
- Circular progress ring
- Linear progress bar
- Task completion count

---

### 5.3 Habits.tsx
**Purpose**: Manage daily habits and track completion

**Key Features**:
- List of all habits
- Daily checkboxes for completion
- Streak tracking (consecutive days)
- Add/Edit/Delete habits via dialog
- Calendar view (optional)

**Data Structure**:
```tsx
interface Habit {
  id: string;              // Unique identifier
  title: string;           // Habit name
  description: string;     // Habit details
  daysCompleted: string[]; // Array of dates ["2024-11-25", ...]
  streak: number;          // Current streak count
}
```

**How Habit Toggle Works**:
```tsx
const handleToggle = (habitId: string, date: string) => {
  // Find the habit
  const habit = habits.find(h => h.id === habitId);

  // Check if already completed today
  const isCompleted = habit.daysCompleted.includes(date);

  if (isCompleted) {
    // Remove date (uncomplete)
    const updated = {
      ...habit,
      daysCompleted: habit.daysCompleted.filter(d => d !== date),
      streak: calculateNewStreak(habit, date, false)
    };
  } else {
    // Add date (complete)
    const updated = {
      ...habit,
      daysCompleted: [...habit.daysCompleted, date].sort(),
      streak: calculateNewStreak(habit, date, true)
    };
  }

  // Update context
  updateHabit(updated);
};
```

**Streak Calculation**:
- Counts consecutive days working backwards from today
- Breaks if a day is missing
- Updates when habit is toggled

---

### 5.4 Journal.tsx & JournalEntry.tsx

#### Journal.tsx (List View)
**Purpose**: Display all journal entries

**Features**:
- Grid of journal entry cards
- Shows title, date, mood emoji, content preview
- Filter/sort options
- Click to edit entry
- Delete entry

**How It Renders**:
```tsx
{journalEntries.map(entry => (
  <Card key={entry.id} onClick={() => navigateToEdit(entry.id)}>
    <CardHeader>
      <div className="flex justify-between">
        <CardTitle>{entry.title}</CardTitle>
        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {formatDate(entry.date)}
      </p>
    </CardHeader>
    <CardContent>
      <p className="line-clamp-3">{entry.content}</p>
    </CardContent>
  </Card>
))}
```

#### JournalEntry.tsx (Editor)
**Purpose**: Create/edit journal entries

**Features**:
- Borderless modern design
- Large title input
- Interactive mood selector (pill buttons)
- Expansive writing area (textarea)
- Word/character counter with progress bar
- Auto-save on navigation

**Data Structure**:
```tsx
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: "great" | "good" | "neutral" | "bad" | "terrible";
  date: string;
}
```

**Auto-Save Logic**:
```tsx
// 1. Use ref to track if saved (avoids re-renders)
const hasSavedRef = useRef(false);

// 2. Save function
const saveEntry = (showToast = true) => {
  if (hasSavedRef.current || (!entry.title && !entry.content)) {
    return; // Already saved or empty
  }

  // Generate "Untitled X" if no title
  const autoTitle = entry.title.trim() || generateUntitledName();

  // Create/update entry
  addJournalEntry({
    title: autoTitle,
    content: entry.content,
    mood: entry.mood,
  });

  hasSavedRef.current = true; // Mark as saved
};

// 3. Auto-save on back button
const handleBack = () => {
  if (!hasSavedRef.current && (entry.title || entry.content)) {
    saveEntry(true); // Save with toast notification
  }
  navigate("/");
};

// 4. Auto-save on browser close
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (!hasSavedRef.current && (entry.title || entry.content)) {
      saveEntry(false);
      e.preventDefault();
    }
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
});
```

**Unique Untitled Name Generation**:
```tsx
const generateUntitledName = () => {
  // Find all untitled entries
  const untitledEntries = journalEntries.filter(e =>
    e.title.startsWith("Untitled")
  );

  if (untitledEntries.length === 0) {
    return "Untitled 1";
  }

  // Extract numbers from "Untitled X"
  const numbers = untitledEntries
    .map(e => {
      const match = e.title.match(/Untitled (\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => num > 0);

  // Find max and add 1
  const maxNumber = Math.max(...numbers);
  return `Untitled ${maxNumber + 1}`;
};
```

---

### 5.5 Goals.tsx
**Purpose**: Manage goals with task breakdowns

**Key Features**:
- List of goals with progress bars
- Task lists within each goal
- Checkbox to complete tasks
- Progress auto-calculates from completed tasks
- Add/Edit/Delete goals

**Data Structure**:
```tsx
interface Goal {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  progress: number;    // 0-100, calculated from tasks
  completed: boolean;  // True when progress = 100
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
}
```

**Progress Calculation**:
```tsx
const calculateProgress = (tasks: Task[]) => {
  if (tasks.length === 0) return 0;

  const completedCount = tasks.filter(t => t.completed).length;
  return Math.round((completedCount / tasks.length) * 100);
};

// Auto-update when task toggled
const handleTaskToggle = (goalId: string, taskId: string) => {
  const goal = goals.find(g => g.id === goalId);

  // Toggle task
  const updatedTasks = goal.tasks.map(task =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
  );

  // Recalculate progress
  const newProgress = calculateProgress(updatedTasks);

  // Update goal
  updateGoal({
    ...goal,
    tasks: updatedTasks,
    progress: newProgress,
    completed: newProgress === 100
  });
};
```

---

## 6. Data Flow & State Management

### Context Architecture

```
┌─────────────────────────────────────┐
│         AppContext.tsx              │
│  (Global State Container)           │
│                                     │
│  - habits: Habit[]                  │
│  - journalEntries: JournalEntry[]   │
│  - goals: Goal[]                    │
│  - activeTab: string                │
│                                     │
│  Functions:                         │
│  - addHabit()                       │
│  - updateHabit()                    │
│  - deleteHabit()                    │
│  - addJournalEntry()                │
│  - deleteJournalEntry()             │
│  - addGoal()                        │
│  - updateGoal()                     │
│  - deleteGoal()                     │
│  - setActiveTab()                   │
└────────────┬────────────────────────┘
             │
             │ (Provides data to all children)
             │
    ┌────────┴────────────────────────┐
    │                                 │
    ▼                                 ▼
┌────────┐                    ┌──────────────┐
│ App.tsx│                    │ Index.tsx    │
│        │                    │              │
│ Routes │                    │ Tab Content: │
└────┬───┘                    │ - Dashboard  │
     │                        │ - Habits     │
     │                        │ - Journal    │
     │                        │ - Goals      │
     ▼                        └──────────────┘
┌──────────────┐
│JournalEntry  │
│   (Page)     │
└──────────────┘
```

### How Data Flows

#### 1. Initial Load
```tsx
// AppContext.tsx
const AppProvider: React.FC = ({ children }) => {
  // Load from localStorage on mount
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  return (
    <AppContext.Provider value={{ habits, setHabits, ... }}>
      {children}
    </AppContext.Provider>
  );
};
```

#### 2. Reading Data (Component)
```tsx
// Dashboard.tsx
const Dashboard: React.FC = () => {
  // Access context
  const { habits, journalEntries, goals } = useAppContext();

  // Use data
  const totalHabits = habits.length;
  const completedToday = habits.filter(h =>
    h.daysCompleted.includes(today)
  ).length;

  return <div>Completed: {completedToday}/{totalHabits}</div>;
};
```

#### 3. Updating Data (Component)
```tsx
// Habits.tsx
const Habits: React.FC = () => {
  const { habits, updateHabit } = useAppContext();

  const handleComplete = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    const today = new Date().toISOString().split('T')[0];

    // Create updated habit
    const updated = {
      ...habit,
      daysCompleted: [...habit.daysCompleted, today],
      streak: habit.streak + 1
    };

    // Update context (triggers re-render everywhere)
    updateHabit(updated);
  };

  // ...
};
```

#### 4. Context Update Flow
```
User Action → Component Function → Context Update →
→ localStorage Save → Re-render All Consumers
```

**Example Flow**:
```
1. User clicks habit checkbox in Habits.tsx
2. handleToggle() called
3. updateHabit() in context
4. setHabits() updates state
5. useEffect saves to localStorage
6. All components using habits re-render
   - Dashboard updates completion %
   - Habits shows new checkbox state
   - Habit heatmap updates
```

---

## 7. Styling System

### Tailwind CSS

**Concept**: Utility classes instead of custom CSS
```tsx
// Traditional CSS
<div className="my-custom-card">
  <h1 className="card-title">Title</h1>
</div>

// CSS file
.my-custom-card {
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

// Tailwind approach (no CSS file needed)
<div className="p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-xl font-bold">Title</h1>
</div>
```

### Common Utility Classes

#### Spacing
```
p-4     = padding: 1rem (all sides)
px-4    = padding-left & padding-right: 1rem
py-2    = padding-top & padding-bottom: 0.5rem
m-4     = margin: 1rem
space-y-4 = gap between children vertically
```

#### Sizing
```
w-full  = width: 100%
h-screen = height: 100vh
max-w-4xl = max-width: 56rem
min-h-[400px] = min-height: 400px (arbitrary value)
```

#### Colors
```
bg-blue-500      = background: blue
text-white       = color: white
border-gray-200  = border-color: gray

// Custom colors from theme
bg-habit         = Your custom teal
text-journal     = Your custom purple
border-goal      = Your custom orange
```

#### Layout
```
flex            = display: flex
grid            = display: grid
grid-cols-3     = 3 columns
justify-between = space-between
items-center    = align-items: center
```

#### Responsive Design
```
md:flex        = flex on medium screens and up
lg:grid-cols-4 = 4 columns on large screens
hover:bg-blue-600 = background on hover
```

### Theme Customization

**File**: `tailwind.config.ts`

```ts
export default {
  theme: {
    extend: {
      colors: {
        // Feature colors
        habit: {
          DEFAULT: '#4ECDC4',  // Teal
          light: '#A7E8BD',
          dark: '#177E89',
        },
        journal: {
          DEFAULT: '#9B87F5',  // Purple
          light: '#D6BCFA',
          dark: '#6E59A5',
        },
        goal: {
          DEFAULT: '#FF7F50',  // Coral
          light: '#FFBE76',
          dark: '#E67E22',
        },
      },
      borderRadius: {
        lg: '0.75rem', // 12px
      },
    },
  },
};
```

**Usage**:
```tsx
<div className="bg-habit text-white">      // Teal background
<div className="border-journal-light">     // Light purple border
<div className="text-goal-dark">           // Dark orange text
```

### CSS Variables

**File**: `src/index.css`

```css
:root {
  --background: 190 25% 97%;    /* Light cyan tint */
  --foreground: 222.2 84% 4.9%; /* Dark text */
  --primary: 175 65% 55%;       /* Teal */
  --secondary: 260 80% 75%;     /* Purple */
  --accent: 25 100% 65%;        /* Orange */
  --radius: 0.75rem;            /* Border radius */
}
```

**Usage**:
```tsx
<div className="bg-background text-foreground">
<button className="bg-primary">
```

### Animation Classes

**File**: `src/index.css`

```css
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover-scale {
  @apply hover:scale-105 transition-transform duration-300;
}
```

**Usage**:
```tsx
<div className="animate-fade-in">        // Fades in on mount
<Card className="hover-scale">          // Scales up on hover
```

---

## 8. Feature Deep Dives

### 8.1 Local Storage Persistence

**How It Works**:
```tsx
// AppContext.tsx

// 1. Initialize state from localStorage
const [habits, setHabits] = useState<Habit[]>(() => {
  try {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load habits:', error);
    return [];
  }
});

// 2. Save to localStorage whenever state changes
useEffect(() => {
  try {
    localStorage.setItem('habits', JSON.stringify(habits));
  } catch (error) {
    console.error('Failed to save habits:', error);
  }
}, [habits]); // Re-run when habits changes
```

**Data Stored**:
- `habits` - Array of habit objects
- `journalEntries` - Array of journal entry objects
- `goals` - Array of goal objects

**Storage Location**: Browser's localStorage
- Persists even after browser close
- Specific to domain (localhost or your domain)
- Max ~5-10MB depending on browser

**Clearing Data**:
```js
// In browser console
localStorage.clear();

// Or programmatically
localStorage.removeItem('habits');
localStorage.removeItem('journalEntries');
localStorage.removeItem('goals');
```

---

### 8.2 Routing System

**File**: `App.tsx`

```tsx
function App() {
  return (
    <AppProvider>  {/* Wrap in context */}
      <Router>
        <Routes>
          {/* Main page with tabs */}
          <Route path="/" element={<Index />} />

          {/* Journal entry editor */}
          <Route path="/journal/:entryId" element={<JournalEntry />} />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
```

**How Navigation Works**:

```tsx
// Programmatic navigation
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const goToJournal = () => {
    navigate('/journal/new');  // Go to create new entry
  };

  const goToEditEntry = (entryId: string) => {
    navigate(`/journal/${entryId}`);  // Go to edit entry
  };

  return <button onClick={goToJournal}>New Entry</button>;
};

// Getting route params
import { useParams } from 'react-router-dom';

const JournalEntry = () => {
  const { entryId } = useParams<{ entryId: string }>();
  // entryId = "123" or "new"

  const isEditing = entryId && entryId !== "new";
  // ...
};
```

**URL Structure**:
- `/` - Main page (Index.tsx)
- `/journal/new` - Create new entry
- `/journal/abc123` - Edit entry with ID "abc123"

---

### 8.3 Toast Notifications

**File**: Uses `sonner` library

**Setup**:
```tsx
// App.tsx or main layout
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div>
      <YourComponents />
      <Toaster />  {/* Add toaster component */}
    </div>
  );
}
```

**Usage**:
```tsx
import { useToast } from "@/hooks/use-toast";

const MyComponent = () => {
  const { toast } = useToast();

  const handleSave = () => {
    // Show success toast
    toast({
      title: "Entry saved",
      description: "Your journal entry has been saved.",
    });

    // Show error toast
    toast({
      title: "Save failed",
      description: "There was an error.",
      variant: "destructive",
    });
  };
};
```

---

### 8.4 Form Handling

**Example**: Add Habit Dialog in Habits.tsx

```tsx
// 1. Define form schema with Zod
const habitSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

// 2. Setup form with React Hook Form
const form = useForm<z.infer<typeof habitSchema>>({
  resolver: zodResolver(habitSchema),
  defaultValues: {
    title: "",
    description: "",
  },
});

// 3. Handle submit
const onSubmit = (data: z.infer<typeof habitSchema>) => {
  const newHabit = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description || "",
    daysCompleted: [],
    streak: 0,
  };

  addHabit(newHabit);
  form.reset();
  setIsDialogOpen(false);
};

// 4. Render form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Exercise" {...field} />
          </FormControl>
          <FormMessage />  {/* Shows validation errors */}
        </FormItem>
      )}
    />
    <Button type="submit">Add Habit</Button>
  </form>
</Form>
```

**Validation Flow**:
1. User submits form
2. Zod validates against schema
3. If invalid: Show error messages
4. If valid: Call onSubmit with data

---

## 9. How to Modify Features

### 9.1 Add a New Field to Habits

**Step 1**: Update type in `AppContext.tsx`
```tsx
export interface Habit {
  id: string;
  title: string;
  description: string;
  daysCompleted: string[];
  streak: number;
  category?: string;  // NEW FIELD
}
```

**Step 2**: Update form schema in `Habits.tsx`
```tsx
const habitSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),  // NEW
});
```

**Step 3**: Add form field
```tsx
<FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <FormControl>
        <Input placeholder="Health" {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

**Step 4**: Include in habit creation
```tsx
const newHabit: Habit = {
  id: Date.now().toString(),
  title: data.title,
  description: data.description || "",
  category: data.category,  // NEW
  daysCompleted: [],
  streak: 0,
};
```

**Step 5**: Display in UI
```tsx
<p className="text-sm text-muted-foreground">
  {habit.category && `Category: ${habit.category}`}
</p>
```

---

### 9.2 Change Dashboard Card Colors

**File**: `Dashboard.tsx`

**Find**:
```tsx
<Card className="border-t-4 border-t-habit">
```

**Change to**:
```tsx
<Card className="border-t-4 border-t-green-500">
```

**Or create new theme color in `tailwind.config.ts`**:
```ts
colors: {
  mycolor: {
    DEFAULT: '#FF6B6B',
    light: '#FFA5A5',
    dark: '#CC5555',
  },
}
```

**Use**:
```tsx
<Card className="border-t-4 border-t-mycolor">
```

---

### 9.3 Add New Dashboard Widget

**File**: `Dashboard.tsx`

**Location**: After the existing cards section

```tsx
{/* Add this after the goals breakdown card */}
<Card className="mt-6 transform transition-all duration-300 hover:shadow-xl">
  <CardHeader>
    <CardTitle className="flex items-center">
      <Sparkles className="mr-2 h-5 w-5" />
      My New Widget
    </CardTitle>
    <CardDescription>Widget description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Your widget content */}
    <div>
      <p>Total Habits: {habits.length}</p>
      <p>Total Entries: {journalEntries.length}</p>
    </div>
  </CardContent>
</Card>
```

---

### 9.4 Modify Mood Graph Colors

**File**: `Dashboard.tsx`

**Find** the `getMoodColor` function:
```tsx
const getMoodColor = (value: number) => {
  if (value === 0) return 'bg-gray-200';
  if (value >= 4.5) return 'bg-green-500';      // Great
  if (value >= 3.5) return 'bg-blue-500';       // Good
  if (value >= 2.5) return 'bg-yellow-500';     // Neutral
  if (value >= 1.5) return 'bg-orange-500';     // Bad
  return 'bg-red-500';                          // Terrible
};
```

**Change colors**:
```tsx
const getMoodColor = (value: number) => {
  if (value === 0) return 'bg-gray-200';
  if (value >= 4.5) return 'bg-emerald-500';    // Changed
  if (value >= 3.5) return 'bg-cyan-500';       // Changed
  if (value >= 2.5) return 'bg-amber-500';      // Changed
  if (value >= 1.5) return 'bg-rose-500';       // Changed
  return 'bg-red-600';                          // Changed
};
```

---

### 9.5 Change Number of Mood Graph Days

**File**: `Dashboard.tsx`

**Find**:
```tsx
const last30Days = Array.from({ length: 30 }, (_, i) => {
```

**Change to** (e.g., 60 days):
```tsx
const last60Days = Array.from({ length: 60 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (59 - i));  // 59 instead of 29
  return date.toISOString().split('T')[0];
});
```

**Also update**:
```tsx
<CardDescription>Your emotional journey over 60 days</CardDescription>
```

---

## 10. Common Patterns

### 10.1 Adding CRUD Operations

**Pattern for any new feature**:

```tsx
// 1. Define type in AppContext.tsx
export interface MyFeature {
  id: string;
  name: string;
  value: number;
}

// 2. Create state
const [myFeatures, setMyFeatures] = useState<MyFeature[]>(() => {
  const saved = localStorage.getItem('myFeatures');
  return saved ? JSON.parse(saved) : [];
});

// 3. Save to localStorage
useEffect(() => {
  localStorage.setItem('myFeatures', JSON.stringify(myFeatures));
}, [myFeatures]);

// 4. Create CRUD functions
const addMyFeature = (feature: Omit<MyFeature, 'id'>) => {
  const newFeature = {
    id: Date.now().toString(),
    ...feature,
  };
  setMyFeatures([...myFeatures, newFeature]);
};

const updateMyFeature = (updated: MyFeature) => {
  setMyFeatures(myFeatures.map(f =>
    f.id === updated.id ? updated : f
  ));
};

const deleteMyFeature = (id: string) => {
  setMyFeatures(myFeatures.filter(f => f.id !== id));
};

// 5. Add to context value
<AppContext.Provider value={{
  myFeatures,
  addMyFeature,
  updateMyFeature,
  deleteMyFeature,
  // ... other values
}}>
```

---

### 10.2 Creating Reusable Components

```tsx
// components/MyCard.tsx
interface MyCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const MyCard: React.FC<MyCardProps> = ({
  title,
  description,
  icon,
  children,
  onClick
}) => {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default MyCard;

// Usage
<MyCard
  title="My Title"
  description="Description"
  icon={<Star className="h-5 w-5" />}
  onClick={() => console.log('clicked')}
>
  <p>Card content goes here</p>
</MyCard>
```

---

### 10.3 Conditional Rendering

```tsx
// 1. If/Else with ternary
{isLoading ? <Spinner /> : <Content />}

// 2. Conditional with &&
{hasError && <ErrorMessage />}

// 3. Multiple conditions
{
  status === 'loading' ? <Spinner /> :
  status === 'error' ? <Error /> :
  status === 'success' ? <Success /> :
  <Empty />
}

// 4. Early return
if (isLoading) {
  return <Spinner />;
}

if (hasError) {
  return <Error />;
}

return <Content />;
```

---

### 10.4 Mapping Arrays

```tsx
// 1. Simple list
{habits.map(habit => (
  <div key={habit.id}>{habit.title}</div>
))}

// 2. With index
{habits.map((habit, index) => (
  <div key={habit.id}>
    {index + 1}. {habit.title}
  </div>
))}

// 3. With filtering
{habits
  .filter(h => h.streak > 0)
  .map(habit => (
    <div key={habit.id}>{habit.title}</div>
  ))
}

// 4. With sorting
{habits
  .sort((a, b) => b.streak - a.streak)
  .map(habit => (
    <div key={habit.id}>
      {habit.title} - Streak: {habit.streak}
    </div>
  ))
}
```

---

### 10.5 Event Handlers

```tsx
// 1. Inline function
<button onClick={() => console.log('clicked')}>Click</button>

// 2. Named function
const handleClick = () => {
  console.log('clicked');
};
<button onClick={handleClick}>Click</button>

// 3. With parameters
const handleDelete = (id: string) => {
  deleteHabit(id);
};
<button onClick={() => handleDelete(habit.id)}>Delete</button>

// 4. Event object
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
<input onChange={handleChange} />

// 5. Stop propagation
const handleClick = (e: React.MouseEvent) => {
  e.stopPropagation();  // Don't trigger parent click
  console.log('clicked');
};
```

---

## 🎓 Learning Resources

### React
- [Official React Docs](https://react.dev/)
- [React Tutorial](https://react.dev/learn)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript for React](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components)

### React Router
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

### shadcn/ui
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Component Examples](https://ui.shadcn.com/docs/components/accordion)

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

---

## 📝 Quick Reference

### Common File Locations
- **Add new component**: `src/components/MyComponent.tsx`
- **Add new page**: `src/pages/MyPage.tsx`
- **Update types**: `src/contexts/AppContext.tsx`
- **Change theme colors**: `tailwind.config.ts`
- **Add global styles**: `src/index.css`
- **Configure routes**: `src/App.tsx`

### Key Imports
```tsx
// React hooks
import { useState, useEffect, useRef, useContext } from 'react';

// Routing
import { useNavigate, useParams } from 'react-router-dom';

// Context
import { useAppContext } from '@/contexts/AppContext';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Icons
import { CheckCircle2, Star, Settings } from 'lucide-react';

// Toast
import { useToast } from '@/hooks/use-toast';

// Utils
import { cn } from '@/lib/utils';
```

### Debugging Tips
```tsx
// 1. Console logging
console.log('Value:', myValue);
console.table(myArray);  // Nice table format

// 2. React DevTools
// Install browser extension to inspect component state

// 3. Check localStorage
console.log(localStorage.getItem('habits'));

// 4. Type errors
// Check terminal output when running npm run dev
// Look for TypeScript errors in your IDE
```

---

## 🎯 Next Steps

Now that you understand the architecture, you can:

1. **Modify existing features** - Change colors, add fields, adjust layouts
2. **Add new features** - Create new components and add to context
3. **Improve UI** - Experiment with Tailwind classes and animations
4. **Add integrations** - Connect to APIs or databases
5. **Optimize performance** - Use React.memo, useMemo, useCallback

Remember:
- **Start small** - Make one change at a time
- **Test frequently** - Check browser after each change
- **Read errors carefully** - TypeScript and console errors are helpful
- **Use DevTools** - Browser DevTools and React DevTools
- **Reference this doc** - Refer back when stuck

---

## 📧 Support

If you get stuck:
1. Check browser console for errors
2. Read the error message carefully
3. Search for the error on Google/StackOverflow
4. Check component documentation (shadcn/ui, React, etc.)
5. Review this documentation

---

**Last Updated**: November 2024
**Version**: 1.0.0

Happy coding! 🚀
