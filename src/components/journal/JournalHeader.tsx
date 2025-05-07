
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JournalHeaderProps {
  onNewEntry: () => void;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({ onNewEntry }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-journal">Your Journal</h2>
        <p className="text-muted-foreground">Reflect, remember, and grow</p>
      </div>
      <Button 
        className="bg-journal hover:bg-journal-dark"
        onClick={onNewEntry}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        New Entry
      </Button>
    </div>
  );
};

export default JournalHeader;
