# 🗄️ Adding Backend Database to Your App

## Complete Guide: From localStorage to Database

---

## 📋 Table of Contents

1. [Current Architecture (localStorage)](#current-architecture)
2. [New Architecture (Backend + Database)](#new-architecture)
3. [Backend Options](#backend-options)
4. [Database Options](#database-options)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [Authentication & User Management](#authentication--user-management)
7. [Deployment Guide](#deployment-guide)

---

## 1. Current Architecture (localStorage)

### How It Works Now

```
┌──────────────────────────────────────┐
│         Browser                      │
│                                      │
│  ┌──────────────────────────────┐  │
│  │   React App (Frontend)       │  │
│  │   - Components               │  │
│  │   - State (AppContext)       │  │
│  │   - localStorage             │  │
│  └──────────────────────────────┘  │
│                                      │
│  Data stored in browser only         │
│  (Not shared between devices)        │
└──────────────────────────────────────┘
```

### Limitations
- ❌ Data only on one browser/device
- ❌ Lost if browser data is cleared
- ❌ Can't sync across devices
- ❌ No user authentication
- ❌ No data backup
- ❌ Limited to ~5-10MB storage

---

## 2. New Architecture (Backend + Database)

### With Backend & Database

```
┌─────────────────────┐         ┌─────────────────────┐         ┌──────────────┐
│   Browser/Client    │         │   Backend Server    │         │   Database   │
│                     │         │                     │         │              │
│  ┌──────────────┐  │         │  ┌──────────────┐  │         │  ┌────────┐  │
│  │ React App    │  │ HTTP    │  │ Express API  │  │  Query  │  │ Users  │  │
│  │              │◄─┼────────►│  │              │◄─┼────────►│  │ Habits │  │
│  │ - UI/UX      │  │  JSON   │  │ - Routes     │  │  SQL/   │  │ Journal│  │
│  │ - Display    │  │  REST   │  │ - Logic      │  │  NoSQL  │  │ Goals  │  │
│  │              │  │         │  │ - Validation │  │         │  │        │  │
│  └──────────────┘  │         │  └──────────────┘  │         │  └────────┘  │
│                     │         │                     │         │              │
└─────────────────────┘         └─────────────────────┘         └──────────────┘
```

### Benefits
- ✅ Data syncs across all devices
- ✅ Persistent and backed up
- ✅ Multiple users supported
- ✅ User authentication/authorization
- ✅ Unlimited storage
- ✅ Advanced queries and analytics

---

## 3. Backend Options

### Option 1: Node.js + Express (Recommended)
**Why**: Same JavaScript/TypeScript as frontend, easy learning curve

**Stack**:
```
Frontend: React + TypeScript
Backend: Node.js + Express + TypeScript
Database: PostgreSQL or MongoDB
```

**Pros**:
- Same language as frontend (JavaScript/TypeScript)
- Large ecosystem (npm packages)
- Fast development
- Great for REST APIs
- Easy to deploy

**Cons**:
- Single-threaded (but handles concurrency well)
- Needs good error handling

---

### Option 2: Other Backend Options

#### Python + Flask/FastAPI
**Good if**: You know Python
```python
# Flask example
@app.route('/api/habits', methods=['GET'])
def get_habits():
    habits = Habit.query.all()
    return jsonify(habits)
```

#### Python + Django
**Good if**: You want batteries-included framework
- Built-in admin panel
- ORM included
- More opinionated

#### Java + Spring Boot
**Good if**: You need enterprise features
- Very robust
- Great for large teams
- More verbose

#### Go
**Good if**: You need high performance
- Fast compilation
- Good concurrency
- Learning curve

---

## 4. Database Options

### Option 1: PostgreSQL (Recommended for Structured Data)

**Type**: SQL (Relational)

**Why Choose**:
- ✅ ACID compliant (data integrity)
- ✅ Complex relationships between data
- ✅ Strong typing
- ✅ Advanced queries
- ✅ Free and open source

**Schema Example**:
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habits table
CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habit completions (days completed)
CREATE TABLE habit_completions (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER REFERENCES habits(id),
  completion_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(habit_id, completion_date)
);

-- Journal entries
CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  content TEXT,
  mood VARCHAR(50),
  entry_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Goals
CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Goal tasks
CREATE TABLE goal_tasks (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### Option 2: MongoDB (NoSQL - Document Database)

**Why Choose**:
- ✅ Flexible schema
- ✅ JSON-like documents
- ✅ Easy to start
- ✅ Good for rapid prototyping

**Schema Example**:
```javascript
// Users collection
{
  _id: ObjectId("..."),
  email: "user@example.com",
  passwordHash: "...",
  name: "John Doe",
  createdAt: ISODate("2024-01-01")
}

// Habits collection
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  title: "Exercise",
  description: "30 min daily",
  daysCompleted: [
    "2024-11-01",
    "2024-11-02",
    "2024-11-03"
  ],
  streak: 3,
  createdAt: ISODate("2024-01-01")
}

// Journal entries collection
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  title: "Great Day",
  content: "Today was amazing...",
  mood: "great",
  date: "2024-11-25",
  createdAt: ISODate("2024-11-25")
}
```

---

### Option 3: Supabase (PostgreSQL + Backend as a Service)

**Why Choose**:
- ✅ PostgreSQL database
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ REST API auto-generated
- ✅ No backend code needed
- ✅ Free tier available

**Perfect for**: Quick start without writing backend

---

### Option 4: Firebase (NoSQL + Backend as a Service)

**Why Choose**:
- ✅ Real-time database
- ✅ Built-in authentication
- ✅ File storage
- ✅ Hosting included
- ✅ Great mobile support

---

## 5. Step-by-Step Implementation

### Approach 1: Full Backend (Node.js + Express + PostgreSQL)

#### Step 1: Setup Backend Project

```bash
# Create backend folder
mkdir uplift-backend
cd uplift-backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express pg cors dotenv bcrypt jsonwebtoken
npm install -D typescript @types/node @types/express ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

#### Step 2: Create Backend Structure

```
uplift-backend/
├── src/
│   ├── server.ts           # Main entry point
│   ├── config/
│   │   └── database.ts     # DB connection
│   ├── routes/
│   │   ├── auth.ts         # Login/register routes
│   │   ├── habits.ts       # Habit CRUD
│   │   ├── journal.ts      # Journal CRUD
│   │   └── goals.ts        # Goal CRUD
│   ├── controllers/
│   │   ├── habitController.ts
│   │   ├── journalController.ts
│   │   └── goalController.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Habit.ts
│   │   ├── JournalEntry.ts
│   │   └── Goal.ts
│   ├── middleware/
│   │   ├── auth.ts         # JWT verification
│   │   └── errorHandler.ts
│   └── types/
│       └── index.ts        # TypeScript types
├── .env                    # Environment variables
├── package.json
└── tsconfig.json
```

#### Step 3: Setup Database Connection

**File**: `src/config/database.ts`

```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'uplift_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});
```

**File**: `.env`

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uplift_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_here_make_it_long_and_random
```

#### Step 4: Create Server Entry Point

**File**: `src/server.ts`

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import habitRoutes from './routes/habits';
import journalRoutes from './routes/journal';
import goalRoutes from './routes/goals';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // Your frontend URL
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/goals', goalRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

#### Step 5: Create Authentication Middleware

**File**: `src/middleware/auth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
};
```

#### Step 6: Create Habit Routes

**File**: `src/routes/habits.ts`

```typescript
import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';

const router = express.Router();

// Get all habits for user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    // Get habits
    const habitsResult = await pool.query(
      'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Get completions for each habit
    const habitsWithCompletions = await Promise.all(
      habitsResult.rows.map(async (habit) => {
        const completionsResult = await pool.query(
          'SELECT completion_date FROM habit_completions WHERE habit_id = $1 ORDER BY completion_date',
          [habit.id]
        );

        return {
          id: habit.id.toString(),
          title: habit.title,
          description: habit.description,
          daysCompleted: completionsResult.rows.map(r =>
            r.completion_date.toISOString().split('T')[0]
          ),
          streak: habit.streak,
        };
      })
    );

    res.json(habitsWithCompletions);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

// Create habit
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      'INSERT INTO habits (user_id, title, description, streak) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, description, 0]
    );

    const habit = result.rows[0];
    res.status(201).json({
      id: habit.id.toString(),
      title: habit.title,
      description: habit.description,
      daysCompleted: [],
      streak: 0,
    });
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

// Toggle habit completion
router.post('/:habitId/toggle', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { habitId } = req.params;
    const { date } = req.body; // Format: "2024-11-25"
    const userId = req.userId;

    // Verify habit belongs to user
    const habitResult = await pool.query(
      'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
      [habitId, userId]
    );

    if (habitResult.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if already completed
    const completionResult = await pool.query(
      'SELECT * FROM habit_completions WHERE habit_id = $1 AND completion_date = $2',
      [habitId, date]
    );

    if (completionResult.rows.length > 0) {
      // Remove completion
      await pool.query(
        'DELETE FROM habit_completions WHERE habit_id = $1 AND completion_date = $2',
        [habitId, date]
      );
    } else {
      // Add completion
      await pool.query(
        'INSERT INTO habit_completions (habit_id, completion_date) VALUES ($1, $2)',
        [habitId, date]
      );
    }

    // Recalculate streak
    const newStreak = await calculateStreak(parseInt(habitId));
    await pool.query(
      'UPDATE habits SET streak = $1 WHERE id = $2',
      [newStreak, habitId]
    );

    res.json({ success: true, streak: newStreak });
  } catch (error) {
    console.error('Error toggling habit:', error);
    res.status(500).json({ error: 'Failed to toggle habit' });
  }
});

// Calculate streak helper
async function calculateStreak(habitId: number): Promise<number> {
  const result = await pool.query(
    'SELECT completion_date FROM habit_completions WHERE habit_id = $1 ORDER BY completion_date DESC',
    [habitId]
  );

  if (result.rows.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const row of result.rows) {
    const completionDate = new Date(row.completion_date);
    completionDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - streak);

    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Update habit
router.put('/:habitId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { habitId } = req.params;
    const { title, description } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      'UPDATE habits SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, description, habitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ error: 'Failed to update habit' });
  }
});

// Delete habit
router.delete('/:habitId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.userId;

    // Delete completions first
    await pool.query('DELETE FROM habit_completions WHERE habit_id = $1', [habitId]);

    // Delete habit
    const result = await pool.query(
      'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *',
      [habitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
});

export default router;
```

#### Step 7: Create Auth Routes

**File**: `src/routes/auth.ts`

```typescript
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, passwordHash, name]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
```

#### Step 8: Update Frontend to Use API

**File**: `src/contexts/AppContext.tsx` (Modified)

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Load data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [habitsRes, journalRes, goalsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/journal'),
        api.get('/goals'),
      ]);

      setHabits(habitsRes.data);
      setJournalEntries(journalRes.data);
      setGoals(goalsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add habit
  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    try {
      const response = await api.post('/habits', habit);
      setHabits([...habits, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  // Update habit
  const updateHabit = async (updatedHabit: Habit) => {
    try {
      await api.put(`/habits/${updatedHabit.id}`, updatedHabit);
      setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h));
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  };

  // Toggle habit completion
  const toggleHabit = async (habitId: string, date: string) => {
    try {
      const response = await api.post(`/habits/${habitId}/toggle`, { date });

      // Update local state
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        const isCompleted = habit.daysCompleted.includes(date);
        const updatedHabit = {
          ...habit,
          daysCompleted: isCompleted
            ? habit.daysCompleted.filter(d => d !== date)
            : [...habit.daysCompleted, date].sort(),
          streak: response.data.streak,
        };
        setHabits(habits.map(h => h.id === habitId ? updatedHabit : h));
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  };

  // Delete habit
  const deleteHabit = async (habitId: string) => {
    try {
      await api.delete(`/habits/${habitId}`);
      setHabits(habits.filter(h => h.id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);

      // Load data after login
      await loadAllData();

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setHabits([]);
    setJournalEntries([]);
    setGoals([]);
  };

  return (
    <AppContext.Provider
      value={{
        habits,
        journalEntries,
        goals,
        loading,
        user,
        addHabit,
        updateHabit,
        toggleHabit,
        deleteHabit,
        login,
        logout,
        // ... other functions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
```

#### Step 9: Create Login Page

**File**: `src/pages/Login.tsx`

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-journal-light/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Login to Uplift Your Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
```

---

### Approach 2: Using Supabase (Easiest)

#### Step 1: Setup Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create account and new project
3. Get your API keys

#### Step 2: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

#### Step 3: Create Supabase Client

**File**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Step 4: Update AppContext for Supabase

```typescript
import { supabase } from '@/lib/supabase';

// Fetch habits
const fetchHabits = async () => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Add habit
const addHabit = async (habit: Omit<Habit, 'id'>) => {
  const { data, error } = await supabase
    .from('habits')
    .insert([habit])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Authentication
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};
```

---

## 6. Authentication & User Management

### JWT Token Flow

```
1. User logs in with email/password
   ↓
2. Backend verifies credentials
   ↓
3. Backend generates JWT token
   ↓
4. Frontend stores token in localStorage
   ↓
5. Frontend includes token in all API requests
   ↓
6. Backend verifies token on each request
   ↓
7. Backend returns user-specific data
```

### Security Best Practices

1. **Password Hashing**: Use bcrypt (never store plain passwords)
2. **JWT Tokens**: Set reasonable expiration (7 days)
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS to only allow your frontend domain
5. **Input Validation**: Validate all user inputs
6. **Rate Limiting**: Prevent brute force attacks
7. **SQL Injection**: Use parameterized queries

---

## 7. Deployment Guide

### Backend Deployment (Recommended: Railway)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial backend"
git push origin main
```

2. **Deploy to Railway**
- Go to [railway.app](https://railway.app)
- Connect GitHub repo
- Add PostgreSQL database
- Set environment variables
- Deploy!

### Frontend Deployment (Vercel/Netlify)

1. **Build production**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

---

## 📊 Migration Checklist

### Phase 1: Backend Setup
- [ ] Choose backend framework
- [ ] Choose database
- [ ] Setup local development environment
- [ ] Create database schema
- [ ] Implement API routes

### Phase 2: Authentication
- [ ] Implement user registration
- [ ] Implement user login
- [ ] Add JWT middleware
- [ ] Create login/register UI

### Phase 3: Data Migration
- [ ] Update AppContext to use API
- [ ] Replace localStorage with API calls
- [ ] Test all CRUD operations
- [ ] Handle loading states
- [ ] Handle errors

### Phase 4: Testing
- [ ] Test all features locally
- [ ] Test authentication flow
- [ ] Test data sync across devices
- [ ] Performance testing

### Phase 5: Deployment
- [ ] Deploy database
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Update environment variables
- [ ] Test production

---

## 💡 Quick Start Recommendation

**For Beginners**: Start with **Supabase**
- No backend code needed
- Built-in authentication
- Generous free tier
- Can migrate later

**For Learning**: Use **Node.js + Express + PostgreSQL**
- Learn full stack development
- More control
- Industry standard

**For Speed**: Use **Firebase**
- Quick setup
- Real-time features
- Good documentation

---

## 🎯 Next Steps

1. Choose your approach (Supabase recommended for start)
2. Follow step-by-step guide
3. Test locally
4. Deploy to production
5. Migrate existing localStorage data (if needed)

Let me know which approach you'd like to use and I can provide more specific guidance!
