
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TemplateOption {
  id: string;
  title: string;
  description: string;
  prompts: string[];
}

interface JournalTemplatesProps {
  onSelectTemplate: (template: { title: string; prompts: string[] }) => void;
  activeTemplate: string | null;
}

export const JournalTemplates: React.FC<JournalTemplatesProps> = ({ 
  onSelectTemplate, 
  activeTemplate 
}) => {
  const templates: TemplateOption[] = [
    {
      id: "daily-reflection",
      title: "Daily Reflection",
      description: "Reflect on your day and track your progress",
      prompts: [
        "What went well today?",
        "What challenges did I face?",
        "What am I grateful for today?",
        "What did I learn today?",
        "What could I have done differently?",
        "What's my intention for tomorrow?"
      ]
    },
    {
      id: "gratitude",
      title: "Gratitude Journal",
      description: "Focus on things you're thankful for",
      prompts: [
        "List 3 things you're grateful for today:",
        "How did these things impact your day?",
        "Who are you grateful for today and why?",
        "What's something about yourself you're grateful for?",
        "What simple pleasure are you grateful for today?"
      ]
    },
    {
      id: "future-self",
      title: "Letter to Future Self",
      description: "Write to your future self",
      prompts: [
        "Dear Future Me,",
        "What I hope you remember about today:",
        "What I'm currently working toward:",
        "What I hope is different by the time you read this:",
        "What I hope never changes:",
        "A promise I want to make to you:"
      ]
    },
    {
      id: "mindfulness",
      title: "Mindfulness Check-in",
      description: "Connect with your present moment experiences",
      prompts: [
        "What emotions am I experiencing right now?",
        "Where do I feel these emotions in my body?",
        "What thoughts are going through my mind?",
        "What can I see, hear, smell, taste, and touch right now?",
        "What do I need most right now?",
        "One thing I can do to care for myself today is:"
      ]
    },
    {
      id: "problem-solving",
      title: "Problem-Solving",
      description: "Work through a current challenge",
      prompts: [
        "What problem or challenge am I facing?",
        "What are the facts about this situation?",
        "What are possible solutions?",
        "What are the pros and cons of each solution?",
        "What's my action plan?",
        "What resources or support do I need?"
      ]
    },
    {
      id: "blank",
      title: "Blank Page",
      description: "Start from scratch",
      prompts: [
        "Write freely about whatever is on your mind..."
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        Select a template to help structure your thoughts:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTemplate === template.title ? 'ring-2 ring-journal' : ''
            }`}
            onClick={() => onSelectTemplate({
              title: template.title,
              prompts: template.prompts
            })}
          >
            <CardContent className="p-4">
              <h4 className="font-medium text-md mb-1">{template.title}</h4>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
