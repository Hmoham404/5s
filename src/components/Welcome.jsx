import React, { useEffect, useState } from "react";
import { LayoutDashboard, ChevronRight, ShieldCheck, ClipboardCheck, TrendingUp, Award } from "lucide-react";
import { useAudit } from "../context/AuditContext";

export default function Welcome({ setCurrentTab }) {
  const { globalScore, zonesAudited, actionsKPI } = useAudit();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { label: "Score Global 5S", value: `${globalScore}%`, icon: TrendingUp, color: "text-emerald-400" },
    { label: "Zones Auditées", value: zonesAudited, icon: ShieldCheck, color: "text-sky-400" },
    { label: "Actions Ouvertes", value: actionsKPI.open + actionsKPI.inProgress, icon: ClipboardCheck, color: "text-amber-400" },
    { label: "Actions Clôturées", value: actionsKPI.closed, icon: Award, color: "text-red-400" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* FULL BACKGROUND: MYC building photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/17_18_24.png')" }}
      />
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-red-950/70" />
      {/* Additional bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent" />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Logo MYC */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-red-600/20 blur-2xl scale-150" />
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl">
              <img
                src="/logo MYC.jpeg"
                alt="MYC Logo"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-red-400 text-xs font-bold tracking-[0.4em] uppercase">
              MYC Innovation Monastir
            </p>
          </div>
        </div>

        {/* Main Title */}
        <div className="mb-4 space-y-3">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
            5S Audit
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Dashboard
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Système de pilotage qualité 5S — MYC Innovation Monastir
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent my-8" />

        {/* KPI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 w-full max-w-3xl">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className="flex items-center gap-3 rounded-2xl bg-red-600 hover:bg-red-500 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-red-600/30 transition-all duration-200 hover:scale-105 hover:shadow-red-500/40 cursor-pointer"
          >
            <LayoutDashboard className="h-5 w-5" />
            Accéder au Dashboard
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentTab("audit")}
            className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <ClipboardCheck className="h-5 w-5" />
            Lancer un Audit
          </button>
        </div>

        {/* Bottom info */}
        <div className="mt-12 flex items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Système certifié 5S</span>
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-2">
            <span>MYC Innovation — Monastir, Tunisie</span>
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <div>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
