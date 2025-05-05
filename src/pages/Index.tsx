
import React from "react";
import { AppProvider } from "@/contexts/AppContext";
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
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "habits" && <Habits />}
      {activeTab === "journal" && <Journal />}
      {activeTab === "goals" && <Goals />}
    </div>
  );
};

// This is the Index page that will wrap everything in the AppProvider
const Index: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <MainContent />
      </div>
    </AppProvider>
  );
};

export default Index;
