
import React, { useState } from "react";
import { useAppContext, JournalEntry } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { PlusCircle, BookOpen, Calendar, Pencil, X, MessageSquareText } from "lucide-react";
import { JournalEntryCard } from "./JournalEntryCard";
import { JournalTemplates } from "./JournalTemplates";

const Journal: React.FC = () => {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: undefined as undefined | "great" | "good" | "neutral" | "bad" | "terrible",
  });

  // Open edit dialog with entry data
  const handleEditEntry = (entry: JournalEntry) => {
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
    });
    setEditingEntryId(entry.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
    setActiveTemplate(null); // Clear any template when editing
  };

  // Apply a template to the current entry
  const applyTemplate = (templateContent: { title: string; prompts: string[] }) => {
    const formattedPrompts = templateContent.prompts.join('\n\n');
    setNewEntry({
      ...newEntry,
      title: templateContent.title,
      content: formattedPrompts,
    });
    setActiveTemplate(templateContent.title);
  };

  // Create or update a journal entry
  const handleSaveEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      if (isEditMode && editingEntryId) {
        // Delete the old entry and add the updated one with the same ID and date
        const entryToEdit = journalEntries.find(entry => entry.id === editingEntryId);
        if (entryToEdit) {
          deleteJournalEntry(editingEntryId);
          addJournalEntry({
            ...newEntry,
            id: editingEntryId,
            date: entryToEdit.date,
          } as any);
        }
      } else {
        // Create new entry
        addJournalEntry(newEntry);
      }
      
      // Reset form
      setNewEntry({
        title: "",
        content: "",
        mood: undefined,
      });
      setIsEditMode(false);
      setEditingEntryId(null);
      setIsDialogOpen(false);
      setActiveTemplate(null);
    }
  };

  // Reset form when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setNewEntry({
        title: "",
        content: "",
        mood: undefined,
      });
      setIsEditMode(false);
      setEditingEntryId(null);
      setActiveTemplate(null);
    }
  };

  // Group entries by month for display
  const groupedEntries: Record<string, JournalEntry[]> = {};
  
  journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .forEach(entry => {
      const date = new Date(entry.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!groupedEntries[monthYear]) {
        groupedEntries[monthYear] = [];
      }
      
      groupedEntries[monthYear].push(entry);
    });

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-journal">Your Journal</h2>
          <p className="text-muted-foreground">Reflect, remember, and grow</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-journal hover:bg-journal-dark">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MessageSquareText className="mr-2 h-5 w-5 text-journal" />
                {isEditMode ? "Edit Journal Entry" : "Create Journal Entry"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
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
                      value={newEntry.title}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      Content
                    </label>
                    <Textarea
                      id="content"
                      placeholder="Write your thoughts..."
                      rows={10}
                      value={newEntry.content}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, content: e.target.value })
                      }
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="mood" className="text-sm font-medium">
                      How are you feeling today?
                    </label>
                    <Select
                      value={newEntry.mood}
                      onValueChange={(value: "great" | "good" | "neutral" | "bad" | "terrible") =>
                        setNewEntry({ ...newEntry, mood: value })
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
                </TabsContent>
                
                <TabsContent value="templates">
                  <JournalTemplates 
                    onSelectTemplate={applyTemplate}
                    activeTemplate={activeTemplate}
                  />
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEntry} className="bg-journal hover:bg-journal-dark">
                {isEditMode ? "Save Changes" : "Save Entry"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {journalEntries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-journal/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-journal" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your journal is empty</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Start documenting your thoughts, experiences, and reflections.
          </p>
          <Button 
            className="bg-journal hover:bg-journal-dark"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Write Your First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEntries).map(([monthYear, entries]) => (
            <div key={monthYear} className="animate-fade-in">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2 text-journal" />
                <h3 className="text-lg font-semibold">{monthYear}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entries.map((entry) => (
                  <JournalEntryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={deleteJournalEntry}
                    onEdit={handleEditEntry}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
