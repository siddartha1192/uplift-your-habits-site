
import React from "react";
import { Calendar } from "lucide-react";
import { JournalEntry } from "@/contexts/AppContext";
import { JournalEntryCard } from "@/components/JournalEntryCard";

interface JournalMonthGroupProps {
  monthYear: string;
  entries: JournalEntry[];
  onDeleteEntry: (entryId: string) => void;
  onEditEntry: (entry: JournalEntry) => void;
}

export const JournalMonthGroup: React.FC<JournalMonthGroupProps> = ({
  monthYear,
  entries,
  onDeleteEntry,
  onEditEntry
}) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 mr-2 text-journal" />
        <h3 className="text-lg font-semibold">{monthYear}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry) => (
          <JournalEntryCard
            key={entry.id}
            entry={entry}
            onDelete={onDeleteEntry}
            onEdit={onEditEntry}
          />
        ))}
      </div>
    </div>
  );
};

export default JournalMonthGroup;
