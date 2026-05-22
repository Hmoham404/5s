import React from "react";
import {
  LayoutDashboard,
  Grid,
  ClipboardCheck,
  ListTodo,
  FileText,
  RotateCcw,
  ShieldCheck,
  CalendarDays,
  Home
} from "lucide-react";
import { useAudit } from "../context/AuditContext";

export default function Sidebar({ currentTab, setCurrentTab }) {
  const { resetToDefault, zones, actionsKPI } = useAudit();

  const menuItems = [
    { id: "welcome", label: "Accueil / Présentation", icon: Home },
    { id: "dashboard", label: "Dashboard principal", icon: LayoutDashboard },
    { id: "zones", label: "Scores par Zone", icon: Grid },
    { id: "calendar", label: "Calendrier des Audits", icon: CalendarDays },
    { id: "audit", label: "Simuler un Audit 5S", icon: ClipboardCheck },
    { id: "actions", label: "Plan d'action", icon: ListTodo },
    { id: "report", label: "Rapport PDF", icon: FileText },
  ];

  // Get last audit date overall
  const lastAudit = zones
    .map(z => z.lastAuditDate)
    .filter(Boolean)
    .sort()
    .reverse()[0] || "Aucun";

  const handleReset = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser toutes les données aux valeurs d'usine ? Toutes vos modifications et nouveaux audits seront effacés.")) {
      resetToDefault();
      localStorage.removeItem("myc_5s_calendar");
      alert("Données réinitialisées avec succès.");
      window.location.reload();
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-100">
      {/* Brand Header with real MYC logo */}
      <div className="flex flex-col p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3 mb-3">
          {/* Real MYC logo */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg overflow-hidden shrink-0">
            <img
              src="/logo MYC.jpeg"
              alt="MYC Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white leading-tight">
              MYC Innovation
            </h1>
            <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase">
              Monastir · Tunisie
            </p>
          </div>
        </div>

        {/* MYC Building thumbnail */}
        <div className="relative rounded-xl overflow-hidden h-20 w-full shadow-lg">
          <img
            src="/17_18_24.png"
            alt="MYC Bâtiment"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-white">Système d'Audit 5S Interne</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20 font-semibold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              )}
              {/* Badge for actions overdue */}
              {item.id === "actions" && actionsKPI.overdue > 0 && !isActive && (
                <span className="ml-auto text-[10px] font-bold bg-red-600 text-white rounded-full px-1.5 py-0.5">
                  {actionsKPI.overdue}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Actions */}
      <div className="border-t border-slate-800/80 p-4 space-y-3">
        <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800/50 text-xs">
          <div className="text-slate-500 font-medium">Dernier audit général :</div>
          <div className="mt-0.5 font-bold text-slate-300">{lastAudit}</div>
        </div>

        <button
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-transparent py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-red-400 hover:border-red-900/50 transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Réinitialiser la Démo</span>
        </button>

        <div className="text-center text-[10px] text-slate-600">
          © {new Date().getFullYear()} MYC Innovation Monastir
        </div>
      </div>
    </aside>
  );
}
