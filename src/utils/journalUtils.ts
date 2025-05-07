
import { JournalEntry } from "@/contexts/AppContext";

/**
 * Groups journal entries by month/year
 */
export const groupEntriesByMonth = (entries: JournalEntry[]): Record<string, JournalEntry[]> => {
  const grouped: Record<string, JournalEntry[]> = {};
  
  entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .forEach(entry => {
      const date = new Date(entry.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(entry);
    });
    
  return grouped;
};

/**
 * Checks if entry has enough content to be auto-saved
 */
export const isEntryValidForAutoSave = (entry: Partial<JournalEntry>): boolean => {
  return Boolean(entry.title?.trim() || entry.content?.trim());
};
