import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext, JournalEntry } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Calendar, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { format } from "date-fns";

const moodOptions = [
  { value: "great", emoji: "😄", label: "Great", color: "from-green-400 to-emerald-500" },
  { value: "good", emoji: "🙂", label: "Good", color: "from-blue-400 to-cyan-500" },
  { value: "neutral", emoji: "😐", label: "Neutral", color: "from-gray-400 to-slate-500" },
  { value: "bad", emoji: "😕", label: "Bad", color: "from-orange-400 to-amber-500" },
  { value: "terrible", emoji: "😢", label: "Terrible", color: "from-red-400 to-rose-500" },
] as const;

const JournalEntryPage: React.FC = () => {
  const { journalEntries, addJournalEntry, setActiveTab } = useAppContext();
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [entry, setEntry] = useState({
    title: "",
    content: "",
    mood: undefined as undefined | "great" | "good" | "neutral" | "bad" | "terrible",
  });

  const [isLoading, setIsLoading] = useState(false);
  const isEditing = entryId && entryId !== "new";

  // Calculate word and character counts
  const wordCount = entry.content.trim() ? entry.content.trim().split(/\s+/).length : 0;
  const charCount = entry.content.length;
  const minWords = 10; // Suggested minimum words for a meaningful entry

  console.log("🔍 JournalEntryPage mounted");
  console.log("🔍 entryId:", entryId);
  console.log("🔍 isEditing:", isEditing);
  console.log("🔍 Current journal entries:", journalEntries);

  // Load existing entry if editing
  useEffect(() => {
    console.log("🔍 useEffect for loading entry triggered");
    if (isEditing) {
      const existingEntry = journalEntries.find(entry => entry.id === entryId);
      console.log("🔍 Found existing entry:", existingEntry);
      if (existingEntry) {
        setEntry({
          title: existingEntry.title,
          content: existingEntry.content,
          mood: existingEntry.mood,
        });
      } else {
        navigate("/");
        setActiveTab("journal");
        toast({
          title: "Entry not found",
          description: "The journal entry you're looking for doesn't exist.",
          variant: "destructive",
        });
      }
    }
  }, [entryId, journalEntries, navigate, toast, isEditing, setActiveTab]);

  const handleSave = () => {
    console.log("🔍 handleSave called");
    console.log("🔍 Current entry state:", entry);

    if (!entry.title.trim() && !entry.content.trim()) {
      toast({
        title: "Cannot save entry",
        description: "Please add a title or content to your journal entry.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("🔍 About to call addJournalEntry");

    try {
      if (isEditing) {
        console.log("🔍 Editing existing entry");
        // Update existing entry
        const existingEntry = journalEntries.find(e => e.id === entryId);
        if (existingEntry) {
          const updatedEntry: JournalEntry = {
            id: entryId!,
            title: entry.title || "Untitled Entry",
            content: entry.content,
            mood: entry.mood,
            date: existingEntry.date, // Keep original date
          };
          console.log("🔍 Calling addJournalEntry with updated entry:", updatedEntry);
          addJournalEntry(updatedEntry);
          toast({
            title: "Entry updated",
            description: "Your journal entry has been updated successfully.",
          });
        }
      } else {
        console.log("🔍 Creating new entry");
        // Create new entry - let the context handle ID and date generation
        const newEntry = {
          title: entry.title || "Untitled Entry",
          content: entry.content,
          mood: entry.mood,
        };
        console.log("🔍 Calling addJournalEntry with new entry:", newEntry);
        addJournalEntry(newEntry);
        toast({
          title: "Entry created",
          description: "Your journal entry has been created successfully.",
        });
      }

      console.log("🔍 About to navigate back");
      // Navigate back to main page and set journal tab
      navigate("/");
      console.log("🔍 Navigation called, setting timeout for tab switch");
      // Use setTimeout to ensure navigation completes first
      setTimeout(() => {
        console.log("🔍 Setting active tab to journal");
        setActiveTab("journal");
      }, 100);
      
    } catch (error) {
      console.error("🔍 Error saving journal entry:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    console.log("🔍 handleBack called");
    navigate("/");
    // Set the active tab to journal when going back
    setTimeout(() => {
      console.log("🔍 Setting active tab to journal from back button");
      setActiveTab("journal");
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-journal-light/10">
      <Navigation />
      <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in flex-1 w-full">
        {/* Header Section */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 hover:bg-journal-light/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Journal
          </Button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-journal to-journal-dark shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-journal to-journal-dark bg-clip-text text-transparent">
                  {isEditing ? "Edit Your Entry" : "New Journal Entry"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-journal to-journal-dark hover:from-journal-dark hover:to-journal shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : (isEditing ? "Update Entry" : "Save Entry")}
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-journal-light/30">
          <CardHeader className="border-b border-journal-light/20 bg-gradient-to-r from-journal-light/5 to-transparent">
            <CardTitle className="text-journal flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Capture Your Thoughts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Title Input */}
            <div className="space-y-2 group">
              <label htmlFor="title" className="text-sm font-semibold text-foreground flex items-center gap-2">
                Title
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Input
                id="title"
                placeholder="Give your entry a memorable title..."
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                className="text-lg border-2 focus:border-journal transition-all duration-300 hover:border-journal-light"
              />
            </div>

            {/* Mood Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground block">
                How are you feeling today?
              </label>
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setEntry({ ...entry, mood: mood.value })}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all duration-300
                      transform hover:scale-110 hover:shadow-lg
                      ${entry.mood === mood.value
                        ? `border-transparent bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                        : 'border-border hover:border-journal-light bg-card hover:bg-journal-light/5'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-3xl">{mood.emoji}</span>
                      <span className={`text-xs font-medium ${entry.mood === mood.value ? 'text-white' : 'text-muted-foreground'}`}>
                        {mood.label}
                      </span>
                    </div>
                    {entry.mood === mood.value && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-lg">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="content" className="text-sm font-semibold text-foreground">
                  Your Thoughts
                </label>
                <div className="flex items-center gap-4 text-xs">
                  <span className={`${wordCount >= minWords ? 'text-journal font-medium' : 'text-muted-foreground'}`}>
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  </span>
                  <span className="text-muted-foreground">
                    {charCount} {charCount === 1 ? 'character' : 'characters'}
                  </span>
                </div>
              </div>
              <div className="relative">
                <Textarea
                  id="content"
                  placeholder="Pour your heart out... What's on your mind today?"
                  rows={12}
                  value={entry.content}
                  onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                  className="min-h-[300px] border-2 focus:border-journal transition-all duration-300 hover:border-journal-light resize-none text-base leading-relaxed"
                />
                {wordCount < minWords && wordCount > 0 && (
                  <div className="absolute bottom-3 left-3 text-xs text-muted-foreground bg-background/90 px-2 py-1 rounded-md backdrop-blur-sm">
                    {minWords - wordCount} more {minWords - wordCount === 1 ? 'word' : 'words'} for a complete entry
                  </div>
                )}
              </div>
              {/* Progress Bar */}
              <div className="relative w-full h-1.5 bg-journal-light/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-journal to-journal-dark transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${Math.min((wordCount / minWords) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Helpful Tips */}
            {!entry.content && (
              <div className="p-4 rounded-lg bg-journal-light/10 border border-journal-light/30">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-journal">💡 Tip:</span> Try writing about your day,
                  your goals, things you're grateful for, or challenges you're facing. There's no wrong way to journal!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalEntryPage;