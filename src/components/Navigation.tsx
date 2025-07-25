
import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { LayoutDashboard, Activity, BookOpen, Target } from "lucide-react";

const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useAppContext();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "habits",
      label: "Habits",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: "journal",
      label: "Journal",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "goals",
      label: "Goals",
      icon: <Target className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b md:px-8 shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-habit to-goal bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer" onClick={() => setActiveTab("dashboard")}>
          Uplift
        </h1>
      </div>
      
      <div className="flex space-x-1 md:space-x-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex items-center px-3 py-2 rounded-md text-sm transition-all duration-300 ${
              activeTab === item.id
                ? "bg-primary/10 text-primary font-medium scale-105"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className={`mr-1.5 transition-transform duration-300 ${activeTab === item.id ? "scale-110" : "scale-100"}`}>{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
