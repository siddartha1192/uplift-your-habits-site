
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import JournalHeader from "./journal/JournalHeader";
import EmptyJournal from "./journal/EmptyJournal";
import JournalMonthGroup from "./journal/JournalMonthGroup";
import { groupEntriesByMonth } from "@/utils/journalUtils";

const Journal: React.FC = () => {
  const { journalEntries, deleteJournalEntry } = useAppContext();
  const navigate = useNavigate();

  // Group entries by month for display
  const groupedEntries = groupEntriesByMonth(journalEntries);
  
  console.log("Current journal entries:", journalEntries);

  // Handle edit action
  const handleEditEntry = (entry) => {
    navigate(`/journal/entry/${entry.id}`);
  };

  // Create new journal entry
  const handleNewEntry = () => {
    navigate('/journal/entry/new');
  };

  return (
    <div className="p-4 md:p-6">
      <JournalHeader onNewEntry={handleNewEntry} />

      {journalEntries.length === 0 ? (
        <EmptyJournal onNewEntry={handleNewEntry} />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEntries).map(([monthYear, entries]) => (
            <JournalMonthGroup
              key={monthYear}
              monthYear={monthYear}
              entries={entries}
              onDeleteEntry={deleteJournalEntry}
              onEditEntry={handleEditEntry}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
