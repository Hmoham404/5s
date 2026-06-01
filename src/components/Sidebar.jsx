import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  Grid,
  Home,
  LayoutDashboard,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { useTranslation } from "../context/TranslationContext";

export default function Sidebar({ currentTab, setCurrentTab }) {
  const { resetToDefault, zones } = useAudit();
  const { t, formatDate } = useTranslation();

  const menuItems = [
    { id: "welcome", label: t("sidebar.menu.welcome"), icon: Home },
    { id: "dashboard", label: t("sidebar.menu.dashboard"), icon: LayoutDashboard },
    { id: "zones", label: t("sidebar.menu.zones"), icon: Grid },
    { id: "calendar", label: t("sidebar.menu.calendar"), icon: CalendarDays },
    { id: "audit", label: t("sidebar.menu.audit"), icon: ClipboardCheck },
    { id: "report", label: t("sidebar.menu.report"), icon: FileText },
  ];

  const lastAudit = zones
    .map((zone) => zone.lastAuditDate)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  const handleReset = () => {
    if (window.confirm(t("sidebar.resetConfirm"))) {
      resetToDefault();
      localStorage.removeItem("myc_5s_calendar");
      alert(t("sidebar.resetSuccess"));
      window.location.reload();
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-100">
      <div className="flex flex-col border-b border-slate-800/80 p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
            <img src="/logo MYC.jpeg" alt="MYC Logo" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold leading-tight tracking-tight text-white">MYC Innovation</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
              {t("sidebar.location")}
            </p>
          </div>
        </div>

        <div className="relative h-20 w-full overflow-hidden rounded-xl shadow-lg">
          <img src="/17_18_24.png" alt="MYC Building" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-white">{t("sidebar.system")}</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-red-600 font-semibold text-white shadow-md shadow-red-600/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span className="truncate">{item.label}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-slate-800/80 p-4">
        <div className="rounded-xl border border-slate-800/50 bg-slate-900/60 p-3 text-xs">
          <div className="font-medium text-slate-500">{t("sidebar.lastAudit")}</div>
          <div className="mt-0.5 font-bold text-slate-300">
            {lastAudit ? formatDate(lastAudit) : t("sidebar.none")}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-transparent py-2.5 text-xs font-semibold text-slate-400 transition-all duration-200 hover:border-red-900/50 hover:bg-slate-900 hover:text-red-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{t("sidebar.reset")}</span>
        </button>

        <div className="text-center text-[10px] text-slate-600">© {new Date().getFullYear()} MYC Innovation Monastir</div>
      </div>
    </aside>
  );
}
