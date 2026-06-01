import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Zones from "./components/Zones";
import AuditForm from "./components/AuditForm";
import Report from "./components/Report";
import Welcome from "./components/Welcome";
import AuditCalendar from "./components/AuditCalendar";
import { AuditProvider } from "./context/AuditContext";
import { TranslationProvider, useTranslation } from "./context/TranslationContext";
import TranslationBar from "./components/TranslationBar";

function MainAppContent() {
  const [currentTab, setCurrentTab] = useState("welcome");
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const { dir } = useTranslation();

  const isFullscreen = currentTab === "welcome";

  const renderContent = () => {
    switch (currentTab) {
      case "welcome":
        return <Welcome setCurrentTab={setCurrentTab} />;
      case "dashboard":
        return <Dashboard setCurrentTab={setCurrentTab} />;
      case "zones":
        return <Zones setCurrentTab={setCurrentTab} setSelectedZoneId={setSelectedZoneId} />;
      case "calendar":
        return (
          <AuditCalendar
            setCurrentTab={setCurrentTab}
            setSelectedZoneId={setSelectedZoneId}
          />
        );
      case "audit":
        return (
          <AuditForm
            setCurrentTab={setCurrentTab}
            selectedZoneId={selectedZoneId}
            setSelectedZoneId={setSelectedZoneId}
          />
        );
      case "report":
        return <Report />;
      default:
        return <Welcome setCurrentTab={setCurrentTab} />;
    }
  };

  if (isFullscreen) {
    // Welcome page: full screen without sidebar margins
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 relative" dir={dir}>
        <TranslationBar />
        {/* Sidebar overlaid on welcome */}
        <div className="fixed inset-y-0 left-0 z-30">
          <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>
        {/* Full screen content — shifted right by sidebar width */}
        <div className="pl-72">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" dir={dir}>
      <TranslationBar />
      {/* Sidebar on the left */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main content body on the right */}
      <main className="pl-72 min-h-screen">
        <div className="container mx-auto max-w-7xl px-8 py-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <AuditProvider>
        <MainAppContent />
      </AuditProvider>
    </TranslationProvider>
  );
}
