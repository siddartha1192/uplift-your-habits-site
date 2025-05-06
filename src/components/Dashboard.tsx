
import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, CheckCircle2, CalendarCheck, Target, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard: React.FC = () => {
  const { habits, journalEntries, goals, setActiveTab } = useAppContext();
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate habits completed today
  const habitsCompletedToday = habits.filter(habit => 
    habit.daysCompleted.includes(today)
  ).length;
  
  // Calculate overall habit completion rate
  const habitCompletionRate = habits.length > 0 
    ? Math.round((habitsCompletedToday / habits.length) * 100) 
    : 0;
  
  // Calculate journal entry streak
  const hasJournalEntryToday = journalEntries.some(entry => 
    new Date(entry.date).toISOString().split('T')[0] === today
  );
  
  // Calculate goals progress
  const averageGoalProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)
    : 0;
  
  // Calculate completed goals
  const completedGoals = goals.filter(goal => goal.completed).length;

  // Handle card click to navigate to respective tabs
  const handleCardClick = (tab: "habits" | "journal" | "goals") => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 animate-fade-in">Your Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Habits Card */}
        <Card 
          className="hover-scale transform transition-all duration-300 hover:shadow-lg cursor-pointer"
          onClick={() => handleCardClick("habits")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-habit-dark">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Habits
            </CardTitle>
            <CardDescription>Your daily rituals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completion Today</span>
                <span className="text-xl font-semibold">{habitsCompletedToday}/{habits.length}</span>
              </div>
              <Progress 
                value={habitCompletionRate} 
                className="h-2 bg-muted"
              />
              <div className="flex items-center justify-center group">
                <span className="text-habit-dark group-hover:underline transition-all flex items-center">
                  Manage Habits <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Journal Card */}
        <Card 
          className="hover-scale transform transition-all duration-300 hover:shadow-lg cursor-pointer"
          onClick={() => handleCardClick("journal")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-journal-dark">
              <CalendarCheck className="mr-2 h-5 w-5" />
              Journal
            </CardTitle>
            <CardDescription>Your reflections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Entries</span>
                <span className="text-xl font-semibold">{journalEntries.length}</span>
              </div>
              <div className="flex items-center justify-center h-8">
                {hasJournalEntryToday ? (
                  <span className="text-green-600 font-medium flex items-center">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Entry added today
                  </span>
                ) : (
                  <span className="text-muted-foreground">No entry today</span>
                )}
              </div>
              <div className="flex items-center justify-center group">
                <span className="text-journal-dark group-hover:underline transition-all flex items-center">
                  View Journal <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Goals Card */}
        <Card 
          className="hover-scale transform transition-all duration-300 hover:shadow-lg cursor-pointer"
          onClick={() => handleCardClick("goals")}  
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-goal-dark">
              <Target className="mr-2 h-5 w-5" />
              Goals
            </CardTitle>
            <CardDescription>Your ambitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Progress</span>
                <span className="text-xl font-semibold">{averageGoalProgress}%</span>
              </div>
              <Progress 
                value={averageGoalProgress} 
                className="h-2 bg-muted"
              />
              <div className="flex justify-between items-center text-sm">
                <span>Active: {goals.length - completedGoals}</span>
                <span>Completed: {completedGoals}</span>
              </div>
              <div className="flex items-center justify-center group">
                <span className="text-goal-dark group-hover:underline transition-all flex items-center">
                  Track Goals <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Summary */}
      <Card className="mt-6 transform transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="mr-2 h-5 w-5" />
            Activity Summary
          </CardTitle>
          <CardDescription>Your recent progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Recent Habits */}
            <div>
              <h3 className="font-medium mb-2">Recent Habits</h3>
              {habits.length > 0 ? (
                <ul className="space-y-2">
                  {habits.slice(0, 3).map(habit => (
                    <li 
                      key={habit.id} 
                      className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab("habits");
                      }}
                    >
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          habit.daysCompleted.includes(today) 
                            ? 'bg-habit text-white' 
                            : 'border-2 border-habit/30'
                        }`}
                      >
                        {habit.daysCompleted.includes(today) && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{habit.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Streak: {habit.streak} {habit.streak === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No habits added yet</p>
              )}
            </div>
            
            {/* Recent Journal Entries */}
            <div>
              <h3 className="font-medium mb-2">Recent Journal Entries</h3>
              {journalEntries.length > 0 ? (
                <ul className="space-y-2">
                  {journalEntries.slice(0, 2).map(entry => (
                    <li 
                      key={entry.id} 
                      className="p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab("journal");
                      }}
                    >
                      <p className="font-medium">{entry.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No journal entries yet</p>
              )}
            </div>
            
            {/* Goals Progress */}
            <div>
              <h3 className="font-medium mb-2">Goals Progress</h3>
              {goals.length > 0 ? (
                <ul className="space-y-3">
                  {goals.slice(0, 2).map(goal => (
                    <li 
                      key={goal.id} 
                      className="hover:bg-muted/50 p-2 rounded-md transition-colors cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab("goals");
                      }}
                    >
                      <div className="flex justify-between mb-1">
                        <p className="font-medium">{goal.title}</p>
                        <span className="text-sm">{goal.progress}%</span>
                      </div>
                      <Progress 
                        value={goal.progress} 
                        className="h-2 bg-muted"
                        indicatorClassName={goal.progress === 100 ? "bg-green-500" : undefined}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No goals added yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
