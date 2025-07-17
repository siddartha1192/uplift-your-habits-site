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

const JournalEntryPage: React.FC = () => {
  const { journalEntries, addJournalEntry } = useAppContext();
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [entry, setEntry] = useState({
    title: "",
    content: "",
    mood: undefined as undefined | "great" | "good" | "neutral" | "bad" | "terrible",
  });

  const isEditing = entryId && entryId !== "new";

  // Load existing entry if editing
  useEffect(() => {
    if (isEditing) {
      const existingEntry = journalEntries.find(entry => entry.id === entryId);
      if (existingEntry) {
        setEntry({
          title: existingEntry.title,
          content: existingEntry.content,
          mood: existingEntry.mood,
        });
      } else {
        navigate("/journal");
        toast({
          title: "Entry not found",
          description: "The journal entry you're looking for doesn't exist.",
          variant: "destructive",
        });
      }
    }
  }, [entryId, journalEntries, navigate, toast, isEditing]);

  const handleSave = () => {
    if (!entry.title.trim() && !entry.content.trim()) {
      toast({
        title: "Cannot save entry",
        description: "Please add a title or content to your journal entry.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing) {
        // Update existing entry
        const existingEntry = journalEntries.find(e => e.id === entryId);
        if (existingEntry) {
          const updatedEntry: JournalEntry = {
            id: entryId!,
            title: entry.title || "Untitled Entry",
            content: entry.content,
            mood: entry.mood,
            date: existingEntry.date,
          };
          addJournalEntry(updatedEntry);
          toast({
            title: "Entry updated",
            description: "Your journal entry has been updated successfully.",
          });
        }
      } else {
        // Create new entry
        const newEntry = {
          title: entry.title || "Untitled Entry",
          content: entry.content,
          mood: entry.mood,
        };
        addJournalEntry(newEntry);
        toast({
          title: "Entry created",
          description: "Your journal entry has been created successfully.",
        });
      }

      navigate("/journal");
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your journal entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/journal")} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Journal Entry" : "Create Journal Entry"}
          </h1>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isEditing ? "Update Entry" : "Save Entry"}
        </Button>
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
              value={entry.mood}
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
  );
};

export default JournalEntryPage;