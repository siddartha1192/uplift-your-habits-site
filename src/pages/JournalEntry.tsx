import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext, JournalEntry } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

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

  // Test button to directly add an entry
  const handleTestAdd = () => {
    console.log("🔍 Test add called");
    const testEntry = {
      title: "Test Entry " + Date.now(),
      content: "This is a test entry created at " + new Date().toLocaleString(),
      mood: "good" as const,
    };
    console.log("🔍 Adding test entry:", testEntry);
    addJournalEntry(testEntry);
    toast({
      title: "Test entry added",
      description: "Check the console and journal list",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Journal
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Journal Entry" : "Create Journal Entry"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleTestAdd}
              variant="outline"
              className="flex items-center gap-2"
            >
              🧪 Test Add
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : (isEditing ? "Update Entry" : "Save Entry")}
            </Button>
          </div>
        </div>



        <Card>
          <CardHeader>
            <CardTitle>Write your thoughts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Entry title"
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                placeholder="Write your thoughts..."
                rows={12}
                value={entry.content}
                onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                className="min-h-[300px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="mood" className="text-sm font-medium">
                How are you feeling today?
              </label>
              <Select
                value={entry.mood || ""}
                onValueChange={(value: "great" | "good" | "neutral" | "bad" | "terrible") => 
                  setEntry({ ...entry, mood: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="great">Great 😄</SelectItem>
                  <SelectItem value="good">Good 🙂</SelectItem>
                  <SelectItem value="neutral">Neutral 😐</SelectItem>
                  <SelectItem value="bad">Bad 😕</SelectItem>
                  <SelectItem value="terrible">Terrible 😢</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalEntryPage;