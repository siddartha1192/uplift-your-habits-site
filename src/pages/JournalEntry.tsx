
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext, JournalEntry } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { JournalTemplates } from "@/components/JournalTemplates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const JournalEntryPage: React.FC = () => {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useAppContext();
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [entry, setEntry] = useState({
    title: "",
    content: "",
    mood: undefined as undefined | "great" | "good" | "neutral" | "bad" | "terrible",
  });

  // If we have an entryId and it's not "new", load the existing entry
  useEffect(() => {
    if (entryId && entryId !== "new") {
      const existingEntry = journalEntries.find(entry => entry.id === entryId);
      if (existingEntry) {
        setEntry({
          title: existingEntry.title,
          content: existingEntry.content,
          mood: existingEntry.mood,
        });
        // If this entry was created from a template, mark it as active
        setActiveTemplate(existingEntry.title);
      }
    }
  }, [entryId, journalEntries]);

  // Auto-save functionality
  useEffect(() => {
    // Only enable auto-save if there are unsaved changes and entry has content
    if (hasUnsavedChanges && (entry.title.trim() || entry.content.trim())) {
      // Clear any existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Set new timer to save after 3 seconds of inactivity
      const timer = setTimeout(() => {
        handleSaveEntry(true);
        setHasUnsavedChanges(false);
      }, 3000);
      
      setAutoSaveTimer(timer);
    }
    
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [entry, hasUnsavedChanges]);

  // Apply a template to the current entry
  const applyTemplate = (templateContent: { title: string; prompts: string[] }) => {
    const formattedPrompts = templateContent.prompts.join('\n\n');
    setEntry({
      title: templateContent.title,
      content: formattedPrompts,
    } as typeof entry);
    setActiveTemplate(templateContent.title);
    setHasUnsavedChanges(true);
  };

  // Handle content change and mark as having unsaved changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry({ ...entry, content: e.target.value });
    setHasUnsavedChanges(true);
  };

  // Handle title change and mark as having unsaved changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, title: e.target.value });
    setHasUnsavedChanges(true);
  };

  // Handle mood change and mark as having unsaved changes
  const handleMoodChange = (value: "great" | "good" | "neutral" | "bad" | "terrible") => {
    setEntry({ ...entry, mood: value });
    setHasUnsavedChanges(true);
  };

  // Create or update a journal entry
  const handleSaveEntry = (isAutoSave = false) => {
    if (entry.title.trim() && entry.content.trim()) {
      if (entryId && entryId !== "new") {
        // Handle edit - delete old and add updated entry with same ID
        const entryToEdit = journalEntries.find(e => e.id === entryId);
        if (entryToEdit) {
          deleteJournalEntry(entryId);
          addJournalEntry({
            ...entry,
            id: entryId,
            date: entryToEdit.date,
          } as any);
          
          if (!isAutoSave) {
            toast({
              title: "Journal entry updated",
              description: "Your journal entry has been saved successfully.",
            });
          }
        }
      } else {
        // Create new entry
        addJournalEntry(entry);
        
        if (!isAutoSave) {
          toast({
            title: "Journal entry created",
            description: "Your journal entry has been saved successfully.",
          });
        }
      }
      
      // Only navigate back if not auto-saving
      if (!isAutoSave) {
        navigate("/journal");
      }
    } else if (!isAutoSave) {
      toast({
        title: "Cannot save entry",
        description: "Please add a title and content to your journal entry.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/journal")} 
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-journal">
          {entryId && entryId !== "new" ? "Edit Journal Entry" : "Create Journal Entry"}
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="templates">Use Template</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Entry title"
                value={entry.title}
                onChange={handleTitleChange}
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
                onChange={handleContentChange}
                className="min-h-[300px]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="mood" className="text-sm font-medium">
                How are you feeling today?
              </label>
              <Select
                value={entry.mood}
                onValueChange={handleMoodChange}
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
          </TabsContent>
          
          <TabsContent value="templates">
            <JournalTemplates 
              onSelectTemplate={applyTemplate}
              activeTemplate={activeTemplate}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => navigate("/journal")} className="mr-2">
            Cancel
          </Button>
          <Button onClick={() => handleSaveEntry(false)} className="bg-journal hover:bg-journal-dark">
            {entryId && entryId !== "new" ? "Save Changes" : "Save Entry"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryPage;
