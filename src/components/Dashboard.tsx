import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CheckCircle2, CalendarCheck, Target, ArrowRight, TrendingUp, Sparkles, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/ui/circular-progress";

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

  // Get last 30 days mood data
  const getLast30DaysMoodData = () => {
    const moodValues: { [key: string]: number } = {
      'great': 5,
      'good': 4,
      'neutral': 3,
      'bad': 2,
      'terrible': 1
    };

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

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

  const moodData = getLast30DaysMoodData();
  const maxMoodValue = 5;
  const avgMood = moodData.filter(d => d.value > 0).length > 0
    ? moodData.filter(d => d.value > 0).reduce((acc, d) => acc + d.value, 0) / moodData.filter(d => d.value > 0).length
    : 0;

  // Get last 7 days habit completion
  const getLast7DaysHabitData = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const completedCount = habits.filter(h => h.daysCompleted.includes(dateStr)).length;
      const total = habits.length;
      return {
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount,
        total,
        percentage: total > 0 ? (completedCount / total) * 100 : 0
      };
    });
  };

  const habitWeekData = getLast7DaysHabitData();

  // Handle card click to navigate to respective tabs
  const handleCardClick = (tab: "habits" | "journal" | "goals") => {
    setActiveTab(tab);
  };

  // Get mood emoji
  const getMoodEmoji = (mood?: string) => {
    const moodEmojis: { [key: string]: string } = {
      'great': '😄',
      'good': '🙂',
      'neutral': '😐',
      'bad': '😕',
      'terrible': '😢'
    };
    return mood ? moodEmojis[mood] : '�';
  };

  // Get mood color
  const getMoodColor = (value: number) => {
    if (value === 0) return 'bg-gray-200';
    if (value >= 4.5) return 'bg-green-500';
    if (value >= 3.5) return 'bg-blue-500';
    if (value >= 2.5) return 'bg-yellow-500';
    if (value >= 1.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-habit via-journal to-goal bg-clip-text text-transparent animate-fade-in">
          Your Dashboard
        </h2>
        <p className="text-muted-foreground">Track your wellness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Habits Card */}
        <Card
          className="hover-scale transform transition-all duration-300 hover:shadow-xl cursor-pointer border-t-4 border-t-habit overflow-hidden relative"
          onClick={() => handleCardClick("habits")}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-habit/10 to-transparent rounded-bl-full" />
          <CardHeader className="pb-2 relative">
            <CardTitle className="flex items-center text-habit-dark">
              <div className="p-2 rounded-lg bg-habit/10 mr-2">
                <CheckCircle2 className="h-5 w-5 text-habit" />
              </div>
              Habits
            </CardTitle>
            <CardDescription>Daily rituals tracker</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Today's Progress</span>
                    <span className="text-2xl font-bold text-habit-dark">{habitsCompletedToday}/{habits.length}</span>
                  </div>
                  {habits.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-xs text-muted-foreground">
                        Best streak: {Math.max(...habits.map(h => h.streak), 0)} days
                      </span>
                    </div>
                  )}
                  <div className="flex items-center group pt-2">
                    <span className="text-habit-dark font-medium group-hover:underline transition-all flex items-center text-sm">
                      Manage Habits <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
                <CircularProgress
                  value={habitCompletionRate}
                  size={90}
                  strokeWidth={10}
                  indicatorColor="stroke-habit"
                  className="animate-fade-in"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Card */}
        <Card
          className="hover-scale transform transition-all duration-300 hover:shadow-xl cursor-pointer border-t-4 border-t-journal overflow-hidden relative"
          onClick={() => handleCardClick("journal")}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-journal/10 to-transparent rounded-bl-full" />
          <CardHeader className="pb-2 relative">
            <CardTitle className="flex items-center text-journal-dark">
              <div className="p-2 rounded-lg bg-journal/10 mr-2">
                <CalendarCheck className="h-5 w-5 text-journal" />
              </div>
              Journal
            </CardTitle>
            <CardDescription>Your daily reflections</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Entries</span>
                    <span className="text-2xl font-bold text-journal-dark">{journalEntries.length}</span>
                  </div>
                  <div className="h-6 flex items-center">
                    {hasJournalEntryToday ? (
                      <span className="text-green-600 font-medium flex items-center text-xs">
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Journaled today!
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Start your entry</span>
                    )}
                  </div>
                  <div className="flex items-center group pt-1">
                    <span className="text-journal-dark font-medium group-hover:underline transition-all flex items-center text-sm">
                      View Journal <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <CircularProgress
                    value={hasJournalEntryToday ? 100 : 0}
                    size={90}
                    strokeWidth={10}
                    showPercentage={false}
                    indicatorColor="stroke-journal"
                    className="animate-fade-in"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {hasJournalEntryToday ? (
                      <CheckCircle2 className="h-10 w-10 text-journal" />
                    ) : (
                      <Sparkles className="h-8 w-8 text-journal/40" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Card */}
        <Card
          className="hover-scale transform transition-all duration-300 hover:shadow-xl cursor-pointer border-t-4 border-t-goal overflow-hidden relative"
          onClick={() => handleCardClick("goals")}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-goal/10 to-transparent rounded-bl-full" />
          <CardHeader className="pb-2 relative">
            <CardTitle className="flex items-center text-goal-dark">
              <div className="p-2 rounded-lg bg-goal/10 mr-2">
                <Target className="h-5 w-5 text-goal" />
              </div>
              Goals
            </CardTitle>
            <CardDescription>Your ambitions</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Progress</span>
                    <span className="text-2xl font-bold text-goal-dark">{averageGoalProgress}%</span>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-muted-foreground">Active: <span className="font-semibold text-foreground">{goals.length - completedGoals}</span></span>
                    <span className="text-muted-foreground">Done: <span className="font-semibold text-green-600">{completedGoals}</span></span>
                  </div>
                  <div className="flex items-center group pt-1">
                    <span className="text-goal-dark font-medium group-hover:underline transition-all flex items-center text-sm">
                      Track Goals <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
                <CircularProgress
                  value={averageGoalProgress}
                  size={90}
                  strokeWidth={10}
                  indicatorColor="stroke-goal"
                  className="animate-fade-in"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary with Enhanced Graphics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trends - Monthly Graph */}
        <Card className="transform transition-all duration-300 hover:shadow-xl border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-700">
              <div className="p-2 rounded-lg bg-purple-100 mr-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              Monthly Mood Trends
            </CardTitle>
            <CardDescription>Your emotional journey over 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {journalEntries.length > 0 ? (
              <div className="space-y-4">
                {/* Average Mood Display */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-transparent">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Mood</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {avgMood.toFixed(1)} / 5.0
                    </p>
                  </div>
                  <div className="text-5xl">
                    {avgMood >= 4 ? '😄' : avgMood >= 3 ? '🙂' : avgMood >= 2 ? '😐' : '😕'}
                  </div>
                </div>

                {/* Mood Graph */}
                <div className="relative h-32 flex items-end gap-[2px] justify-between">
                  {moodData.map((data, index) => {
                    const height = data.value > 0 ? (data.value / maxMoodValue) * 100 : 0;
                    const isToday = data.date === today;
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center group relative"
                      >
                        <div
                          className={`w-full rounded-t transition-all duration-300 ${
                            data.value > 0 ? getMoodColor(data.value) : 'bg-gray-200'
                          } ${isToday ? 'ring-2 ring-purple-500 ring-offset-1' : ''} hover:opacity-80`}
                          style={{ height: `${height}%` }}
                        >
                          {/* Tooltip */}
                          {data.mood && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                              {getMoodEmoji(data.mood)} {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-500" />
                      <span>Great</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-blue-500" />
                      <span>Good</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-yellow-500" />
                      <span>Neutral</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-orange-500" />
                      <span>Bad</span>
                    </div>
                  </div>
                  <span className="text-purple-600 font-medium">{moodData.filter(d => d.value > 0).length} entries</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mb-2 opacity-20" />
                <p>Start journaling to see your mood trends</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Habit Weekly Heatmap */}
        <Card className="transform transition-all duration-300 hover:shadow-xl border-t-4 border-t-habit">
          <CardHeader>
            <CardTitle className="flex items-center text-habit-dark">
              <div className="p-2 rounded-lg bg-habit/10 mr-2">
                <BarChart className="h-5 w-5 text-habit" />
              </div>
              Weekly Habit Progress
            </CardTitle>
            <CardDescription>Last 7 days completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            {habits.length > 0 ? (
              <div className="space-y-4">
                {/* Week Overview */}
                <div className="grid grid-cols-7 gap-2">
                  {habitWeekData.map((day, index) => {
                    const isToday = day.date === today;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className="text-xs text-muted-foreground mb-2 font-medium">
                          {day.day}
                        </div>
                        <div className="relative group">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
                              day.percentage === 100
                                ? 'bg-gradient-to-br from-habit to-habit-dark text-white shadow-lg scale-105'
                                : day.percentage >= 50
                                ? 'bg-habit-light text-habit-dark'
                                : day.percentage > 0
                                ? 'bg-habit-light/50 text-habit'
                                : 'bg-gray-100 text-gray-400'
                            } ${isToday ? 'ring-2 ring-habit ring-offset-2' : ''}`}
                          >
                            {day.completed}/{day.total}
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                            {day.percentage.toFixed(0)}% complete
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Weekly Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="p-3 rounded-lg bg-habit/5">
                    <p className="text-xs text-muted-foreground mb-1">Weekly Average</p>
                    <p className="text-xl font-bold text-habit-dark">
                      {(habitWeekData.reduce((acc, d) => acc + d.percentage, 0) / 7).toFixed(0)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-habit/5">
                    <p className="text-xs text-muted-foreground mb-1">Perfect Days</p>
                    <p className="text-xl font-bold text-habit-dark">
                      {habitWeekData.filter(d => d.percentage === 100).length}/7
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <BarChart className="h-12 w-12 mb-2 opacity-20" />
                <p>Add habits to track your weekly progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Goals Detailed Progress */}
      <Card className="mt-6 transform transition-all duration-300 hover:shadow-xl border-t-4 border-t-goal">
        <CardHeader>
          <CardTitle className="flex items-center text-goal-dark">
            <div className="p-2 rounded-lg bg-goal/10 mr-2">
              <Target className="h-5 w-5 text-goal" />
            </div>
            Goals Breakdown
          </CardTitle>
          <CardDescription>Individual goal progress tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map(goal => (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg border hover:border-goal transition-all duration-300 hover:shadow-md cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("goals");
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <CircularProgress
                          value={goal.progress}
                          size={50}
                          strokeWidth={6}
                          indicatorColor="stroke-goal"
                        />
                        {goal.completed && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-goal" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold group-hover:text-goal transition-colors">{goal.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {goal.tasks.filter(t => t.completed).length} of {goal.tasks.length} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-goal-dark">{goal.progress}%</p>
                      {goal.completed && (
                        <p className="text-xs text-green-600 font-medium mt-1">✓ Completed</p>
                      )}
                    </div>
                  </div>

                  <Progress
                    value={goal.progress}
                    className="h-2"
                    indicatorClassName={goal.progress === 100 ? "bg-gradient-to-r from-goal to-green-500" : "bg-gradient-to-r from-goal to-goal-light"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Target className="h-12 w-12 mb-2 opacity-20" />
              <p>Set your first goal to track progress</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
