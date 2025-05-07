
import React, { useState } from "react";
import { JournalEntry } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Pencil, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onDelete: (entryId: string) => void;
  onEdit: (entry: JournalEntry) => void;
}

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  onDelete,
  onEdit,
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

  // Get mood color class
  const getMoodColorClass = (mood?: string) => {
    switch (mood) {
      case 'great': return 'bg-green-50 border-l-green-500';
      case 'good': return 'bg-emerald-50 border-l-emerald-500';
      case 'neutral': return 'bg-gray-50 border-l-gray-400';
      case 'bad': return 'bg-amber-50 border-l-amber-500';
      case 'terrible': return 'bg-red-50 border-l-red-500';
      default: return 'bg-blue-50 border-l-blue-400';
    }
  };

  return (
    <Card className={`overflow-hidden shadow-sm hover:shadow transition-shadow border-l-4 ${getMoodColorClass(entry.mood)}`}>
      <CardContent className="p-0">
        <div className="p-4 pb-3 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg flex items-center group-hover:text-journal">
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
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onEdit(entry)}
              className="text-muted-foreground hover:text-journal transition-colors p-1 rounded-full hover:bg-muted"
              aria-label="Edit entry"
            >
              <Pencil className="h-4 w-4" />
            </button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-full hover:bg-muted"
                  aria-label="Delete entry"
                >
                  <X className="h-4 w-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this journal entry? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(entry.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <div className={`prose-sm max-w-none text-gray-700 ${!isExpanded && 'line-clamp-3'}`}>
            {entry.content.split('\n').map((paragraph, index) => (
              <p key={index} className={paragraph.trim() === '' ? 'my-1' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
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
