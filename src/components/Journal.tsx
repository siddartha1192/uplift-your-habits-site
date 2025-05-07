
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext, JournalEntry } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Calendar } from "lucide-react";
import { JournalEntryCard } from "./JournalEntryCard";

const Journal: React.FC = () => {
  const { journalEntries, deleteJournalEntry } = useAppContext();
  const navigate = useNavigate();

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

  // Handle edit action
  const handleEditEntry = (entry: JournalEntry) => {
    navigate(`/journal/entry/${entry.id}`);
  };

  // Create new journal entry
  const handleNewEntry = () => {
    navigate('/journal/entry/new');
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-journal">Your Journal</h2>
          <p className="text-muted-foreground">Reflect, remember, and grow</p>
        </div>
        <Button 
          className="bg-journal hover:bg-journal-dark"
          onClick={handleNewEntry}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Entry
        </Button>
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
            onClick={handleNewEntry}
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
