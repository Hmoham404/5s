import { useEffect, useState } from "react";
import {
  Award,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { useTranslation } from "../context/TranslationContext";

export default function Welcome({ setCurrentTab }) {
  const { globalScore, zonesAudited, actionsKPI } = useAudit();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: t("welcome.globalScore"), value: `${globalScore}%`, icon: TrendingUp, color: "text-emerald-400" },
    { label: t("welcome.auditedZones"), value: zonesAudited, icon: ShieldCheck, color: "text-sky-400" },
    { label: t("welcome.openActions"), value: actionsKPI.open + actionsKPI.inProgress, icon: ClipboardCheck, color: "text-amber-400" },
    { label: t("welcome.closedActions"), value: actionsKPI.closed, icon: Award, color: "text-red-400" },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/17_18_24.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-red-950/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent" />

      <div
        className={`relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center transition-all duration-1000 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 scale-150 rounded-2xl bg-red-600/20 blur-2xl" />
            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
              <img src="/logo MYC.jpeg" alt="MYC Logo" className="h-16 w-auto object-contain" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-red-400">MYC Innovation Monastir</p>
          </div>
        </div>

        <div className="mb-4 space-y-3">
          <h1 className="text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
            5S Audit
            <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              {t("common.dashboard")}
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-400">{t("welcome.subtitle")}</p>
        </div>

        <div className="my-8 h-0.5 w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

        <div className="mb-10 grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-all duration-300 hover:bg-white/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className={`mx-auto mb-2 h-6 w-6 ${stat.color}`} />
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="mt-1 text-xs font-medium text-slate-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-red-600/30 transition-all duration-200 hover:scale-105 hover:bg-red-500 hover:shadow-red-500/40"
          >
            <LayoutDashboard className="h-5 w-5" />
            {t("welcome.goDashboard")}
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentTab("audit")}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:scale-105 hover:bg-white/20"
          >
            <ClipboardCheck className="h-5 w-5" />
            {t("welcome.startAudit")}
          </button>
        </div>

        <div className="mt-12 flex items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>{t("welcome.certified")}</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <span>MYC Innovation - {t("sidebar.location")}</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
