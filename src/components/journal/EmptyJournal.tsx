
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle } from "lucide-react";

interface EmptyJournalProps {
  onNewEntry: () => void;
}

export const EmptyJournal: React.FC<EmptyJournalProps> = ({ onNewEntry }) => {
  return (
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
        onClick={onNewEntry}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Write Your First Entry
      </Button>
    </div>
  );
};

export default EmptyJournal;
