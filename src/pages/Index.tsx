import React from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import Habits from "@/components/Habits";
import Journal from "@/components/Journal";
import Goals from "@/components/Goals";
import { useAppContext } from "@/contexts/AppContext";

// This is the component that will conditionally render the active tab
const MainContent: React.FC = () => {
  const { activeTab } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
      {activeTab === "dashboard" && <div className="animate-fade-in"><Dashboard /></div>}
      {activeTab === "habits" && <div className="animate-fade-in"><Habits /></div>}
      {activeTab === "journal" && <div className="animate-fade-in"><Journal /></div>}
      {activeTab === "goals" && <div className="animate-fade-in"><Goals /></div>}
    </div>
  );
};

// This is the Index page - AppProvider is now in App.tsx
const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <MainContent />
    </div>
  );
};

export default Index;