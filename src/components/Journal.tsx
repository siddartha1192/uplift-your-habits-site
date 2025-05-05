
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
import { PlusCircle, BookOpen, Calendar, Trash2, X } from "lucide-react";

const Journal: React.FC = () => {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: undefined as undefined | "great" | "good" | "neutral" | "bad" | "terrible",
  });

  // Create a journal entry
  const handleCreateEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      addJournalEntry(newEntry);
      setNewEntry({
        title: "",
        content: "",
        mood: undefined,
      });
      setIsDialogOpen(false);
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
        <h2 className="text-2xl font-bold">Your Journal</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-journal hover:bg-journal-dark">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
                  rows={6}
                  value={newEntry.content}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, content: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mood" className="text-sm font-medium">
                  Mood (optional)
                </label>
                <Select
                  value={newEntry.mood}
                  onValueChange={(value: "great" | "good" | "neutral" | "bad" | "terrible") =>
                    setNewEntry({ ...newEntry, mood: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How are you feeling?" />
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEntry} className="bg-journal hover:bg-journal-dark">
                Save Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {journalEntries.length === 0 ? (
        <div className="text-center py-12">
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
            <div key={monthYear}>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">{monthYear}</h3>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <JournalEntryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={deleteJournalEntry}
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

interface JournalEntryCardProps {
  entry: JournalEntry;
  onDelete: (entryId: string) => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format date
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  
  // Get mood emoji
  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'great': return '😄';
      case 'good': return '🙂';
      case 'neutral': return '😐';
      case 'bad': return '😕';
      case 'terrible': return '😢';
      default: return '';
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 pb-3 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg flex items-center">
              {entry.title}
              {entry.mood && (
                <span className="ml-2 text-base">{getMoodEmoji(entry.mood)}</span>
              )}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <button 
            onClick={() => onDelete(entry.id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="px-4 pb-4">
          <p className={`text-gray-700 ${!isExpanded && 'line-clamp-3'}`}>
            {entry.content}
          </p>
          {entry.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-journal text-sm mt-2 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Journal;
