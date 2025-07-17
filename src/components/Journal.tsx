import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Journal: React.FC = () => {
  const { journalEntries, deleteJournalEntry } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNewEntry = () => {
    navigate("/journal/entry/new");
  };

  const handleEditEntry = (entryId: string) => {
    navigate(`/journal/entry/${entryId}`);
  };

  const handleDeleteEntry = (entryId: string) => {
    deleteJournalEntry(entryId);
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case "great": return "😄";
      case "good": return "🙂";
      case "neutral": return "😐";
      case "bad": return "😕";
      case "terrible": return "😢";
      default: return "";
    }
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Journal</h1>
        <Button onClick={handleNewEntry} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </div>

      {journalEntries.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Calendar className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No journal entries yet</h2>
              <p className="text-muted-foreground">
                Start your journaling journey by creating your first entry.
              </p>
              <Button onClick={handleNewEntry} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create First Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {journalEntries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(entry.date)}
                        {entry.mood && (
                          <span className="flex items-center gap-1">
                            • {getMoodEmoji(entry.mood)} {entry.mood}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEntry(entry.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground line-clamp-3">
                    {entry.content}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default Journal;