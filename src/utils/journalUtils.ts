
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
 * Returns true if either title or content has text
 */
export const isEntryValidForAutoSave = (entry: Partial<JournalEntry>): boolean => {
  if (!entry) return false;
  return Boolean(
    (entry.title && entry.title.trim().length > 0) || 
    (entry.content && entry.content.trim().length > 0)
  );
};
