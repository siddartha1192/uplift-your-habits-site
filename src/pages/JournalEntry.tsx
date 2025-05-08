
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
import { ArrowLeft, Save, ListTodo } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { isEntryValidForAutoSave } from "@/utils/journalUtils";
import TodoListCard from "@/components/journal/TodoListCard";

const JournalEntryPage: React.FC = () => {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useAppContext();
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [showTodoList, setShowTodoList] = useState(false);
  
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
    if (hasUnsavedChanges && isEntryValidForAutoSave(entry)) {
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
    console.log("Applying template:", templateContent.title);
    const formattedPrompts = templateContent.prompts.join('\n\n');
    setEntry({
      title: templateContent.title,
      content: formattedPrompts,
      mood: entry.mood,
    });
    setActiveTemplate(templateContent.title);
    setHasUnsavedChanges(true);
    
    // Switch to write tab after template is applied
    setActiveTab("write");
    
    toast({
      title: "Template applied",
      description: `${templateContent.title} template has been applied.`,
    });
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

  // Toggle todo list
  const handleToggleTodoList = () => {
    setShowTodoList(!showTodoList);
  };

  // Create or update a journal entry
  const handleSaveEntry = (isAutoSave = false) => {
    // Add console logs to debug saving issues
    console.log("Saving entry:", entry);
    console.log("Is valid for save:", isEntryValidForAutoSave(entry));

    if (entry.title.trim() === "" && entry.content.trim() === "") {
      if (!isAutoSave) {
        toast({
          title: "Cannot save entry",
          description: "Please add a title or content to your journal entry.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      if (entryId && entryId !== "new") {
        // Handle edit - delete old and add updated entry with same ID
        const entryToEdit = journalEntries.find(e => e.id === entryId);
        if (entryToEdit) {
          deleteJournalEntry(entryId);
          const updatedEntry: JournalEntry = {
            ...entry,
            id: entryId,
            date: entryToEdit.date,
          };
          addJournalEntry(updatedEntry);
          console.log("Updated entry:", updatedEntry);
          
          if (!isAutoSave) {
            toast({
              title: "Journal entry updated",
              description: "Your journal entry has been saved successfully.",
            });
            
            navigate("/journal"); // Fixed - navigate to journal not dashboard
          }
        }
      } else {
        // This is a completely new entry
        const newId = `j${Date.now()}`;
        const newEntry: JournalEntry = {
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          id: newId,
          date: new Date().toISOString(),
        };
        
        // Critical fix: Using addJournalEntry directly with the new entry
        addJournalEntry(newEntry);
        
        console.log("New entry created:", newEntry);
        
        if (!isAutoSave) {
          toast({
            title: "Journal entry created",
            description: "Your journal entry has been saved successfully.",
          });
          
          navigate("/journal"); // Fixed - navigate to journal not dashboard
        }
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your journal entry. Please try again.",
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
        
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggleTodoList}
            className="flex items-center gap-1"
          >
            <ListTodo className="h-4 w-4" />
            {showTodoList ? "Hide Todo List" : "Show Todo List"}
          </Button>
          <Button 
            onClick={() => handleSaveEntry(false)} 
            className="bg-journal hover:bg-journal-dark flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            {entryId && entryId !== "new" ? "Save Changes" : "Save Entry"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${showTodoList ? 'md:col-span-2' : 'md:col-span-3'} bg-white rounded-lg shadow p-6`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        </div>

        {showTodoList && (
          <div className="md:col-span-1">
            <TodoListCard />
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalEntryPage;
