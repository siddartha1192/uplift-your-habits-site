import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext, JournalEntry } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const hasSavedRef = useRef(false); // Use ref to avoid re-renders
  const isEditing = entryId && entryId !== "new";

  // Calculate word and character counts
  const wordCount = entry.content.trim() ? entry.content.trim().split(/\s+/).length : 0;
  const charCount = entry.content.length;
  const minWords = 10;

  // Generate unique untitled name
  const generateUntitledName = () => {
    const untitledEntries = journalEntries.filter(e =>
      e.title.startsWith("Untitled")
    );

    if (untitledEntries.length === 0) {
      return "Untitled 1";
    }

    const numbers = untitledEntries
      .map(e => {
        const match = e.title.match(/Untitled (\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `Untitled ${maxNumber + 1}`;
  };

  // Load existing entry if editing
  useEffect(() => {
    if (isEditing) {
      const existingEntry = journalEntries.find(e => e.id === entryId);
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
  }, [entryId, isEditing, journalEntries, navigate, setActiveTab, toast]);

  // Save entry function (used by both manual save and auto-save)
  const saveEntry = (showToast = true) => {
    // Don't save if already saved or if there's no content
    if (hasSavedRef.current || (!entry.title.trim() && !entry.content.trim())) {
      return;
    }

    try {
      if (isEditing) {
        // Update existing entry
        const existingEntry = journalEntries.find(e => e.id === entryId);
        if (existingEntry) {
          const updatedEntry: JournalEntry = {
            id: entryId!,
            title: entry.title.trim() || existingEntry.title,
            content: entry.content,
            mood: entry.mood,
            date: existingEntry.date,
          };
          addJournalEntry(updatedEntry);
          if (showToast) {
            toast({
              title: "Entry updated",
              description: "Your journal entry has been updated.",
            });
          }
        }
      } else {
        // Create new entry
        const autoTitle = entry.title.trim() || generateUntitledName();
        const newEntry = {
          title: autoTitle,
          content: entry.content,
          mood: entry.mood,
        };
        addJournalEntry(newEntry);
        if (showToast) {
          toast({
            title: "Entry saved",
            description: `Saved as "${autoTitle}"`,
          });
        }
      }

      hasSavedRef.current = true;
    } catch (error) {
      console.error("Error saving entry:", error);
      if (showToast) {
        toast({
          title: "Save failed",
          description: "There was an error saving your entry.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle manual save button click
  const handleSave = () => {
    if (!entry.title.trim() && !entry.content.trim()) {
      toast({
        title: "Cannot save entry",
        description: "Please add a title or content to your journal entry.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    saveEntry(true);
    setIsLoading(false);

    // Navigate back to journal
    setTimeout(() => {
      navigate("/");
      setTimeout(() => setActiveTab("journal"), 100);
    }, 300);
  };

  // Handle back button (with auto-save)
  const handleBack = () => {
    // Auto-save if there's unsaved content
    if (!hasSavedRef.current && (entry.title.trim() || entry.content.trim())) {
      saveEntry(true);
    }

    navigate("/");
    setTimeout(() => setActiveTab("journal"), 100);
  };

  // Handle browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasSavedRef.current && (entry.title.trim() || entry.content.trim())) {
        // Try to save synchronously
        saveEntry(false);
        // Show browser warning
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-journal-light/5 to-background">
      <Navigation />
      <div className="flex-1 w-full animate-fade-in">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
          {/* Header Section */}
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="hover:bg-journal/10 transition-colors -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Journal
            </Button>

            <div className="flex items-start justify-between flex-wrap gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-journal via-journal to-journal-dark shadow-md">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-journal via-journal-dark to-journal bg-clip-text text-transparent">
                    {isEditing ? "Edit Entry" : "New Entry"}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground ml-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-journal to-journal-dark hover:from-journal-dark hover:to-journal shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : (isEditing ? "Update" : "Save")}
              </Button>
            </div>
          </div>

          {/* Title Input - Borderless */}
          <div className="space-y-3">
            <label htmlFor="title" className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
              Title <span className="text-xs lowercase normal-case">(optional)</span>
            </label>
            <Input
              id="title"
              placeholder="Give your entry a memorable title..."
              value={entry.title}
              onChange={(e) => setEntry({ ...entry, title: e.target.value })}
              className="text-2xl md:text-3xl font-semibold border-0 border-b-2 border-transparent focus:border-journal bg-transparent hover:bg-journal-light/5 transition-all duration-300 rounded-none px-2 h-auto py-4 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Mood Selector */}
          <div className="space-y-4 py-4">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1 block">
              How are you feeling?
            </label>
            <div className="flex gap-3 flex-wrap">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setEntry({ ...entry, mood: mood.value })}
                  className={`
                    relative px-6 py-3 rounded-full transition-all duration-300
                    transform hover:scale-110 hover:shadow-lg
                    ${entry.mood === mood.value
                      ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                      : 'bg-journal-light/10 hover:bg-journal-light/20 text-foreground'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-sm font-medium">
                      {mood.label}
                    </span>
                  </div>
                  {entry.mood === mood.value && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Textarea - Full Width, Modern */}
          <div className="space-y-3 pb-6">
            <div className="flex items-center justify-between ml-1">
              <label htmlFor="content" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Your Thoughts
              </label>
              <div className="flex items-center gap-4 text-xs">
                <span className={`transition-colors ${wordCount >= minWords ? 'text-journal font-semibold' : 'text-muted-foreground'}`}>
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
                <span className="text-muted-foreground">
                  {charCount} characters
                </span>
              </div>
            </div>

            <div className="relative group">
              <Textarea
                id="content"
                placeholder="Start writing... Let your thoughts flow freely."
                rows={16}
                value={entry.content}
                onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                className="min-h-[400px] border-0 bg-journal-light/5 hover:bg-journal-light/10 focus:bg-white transition-all duration-300 resize-none text-base leading-relaxed p-6 rounded-2xl focus-visible:ring-2 focus-visible:ring-journal/50 focus-visible:ring-offset-0 shadow-sm hover:shadow-md focus:shadow-lg"
              />
              {wordCount < minWords && wordCount > 0 && (
                <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/95 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
                  {minWords - wordCount} more {minWords - wordCount === 1 ? 'word' : 'words'} suggested
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-1 bg-journal-light/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-journal via-journal-dark to-journal transition-all duration-500 ease-out rounded-full"
                style={{ width: `${Math.min((wordCount / minWords) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Helpful Tips */}
          {!entry.content && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-journal-light/10 to-transparent backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-sm font-medium text-journal mb-1">Writing prompts to get started:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>What made you smile today?</li>
                    <li>What challenges did you overcome?</li>
                    <li>What are you grateful for right now?</li>
                    <li>What goals are you working towards?</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalEntryPage;
