import React, { useState } from "react";
import {
  Search,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  SlidersHorizontal
} from "lucide-react";
import { useAudit } from "../context/AuditContext";

export default function Zones({ setCurrentTab, setSelectedZoneId }) {
  const { zones } = useAudit();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, critical, acceptable, excellent

  // Filter logic
  const filteredZones = zones.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.manager.toLowerCase().includes(searchTerm.toLowerCase());

    const isCritical = zone.score < 50;
    const isAcceptable = zone.score >= 50 && zone.score <= 75;
    const isExcellent = zone.score > 75;

    if (statusFilter === "critical") return matchesSearch && isCritical;
    if (statusFilter === "acceptable") return matchesSearch && isAcceptable;
    if (statusFilter === "excellent") return matchesSearch && isExcellent;

    return matchesSearch;
  });

  const getScoreColorInfo = (score) => {
    if (score < 50) {
      return {
        bg: "bg-red-50 dark:bg-red-950/10",
        border: "border-red-150 dark:border-red-900/30",
        text: "text-red-600",
        badge: "bg-red-500 text-white",
        barBg: "bg-red-500",
        label: "Critique (&lt;50%)",
        shortLabel: "Critique"
      };
    }
    if (score <= 75) {
      return {
        bg: "bg-amber-50 dark:bg-amber-950/10",
        border: "border-amber-150 dark:border-amber-900/30",
        text: "text-amber-600",
        badge: "bg-amber-500 text-white",
        barBg: "bg-amber-500",
        label: "Amélioration nécessaire (50-75%)",
        shortLabel: "À améliorer"
      };
    }
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/10",
      border: "border-emerald-150 dark:border-emerald-900/30",
      text: "text-emerald-600",
      badge: "bg-emerald-500 text-white",
      barBg: "bg-emerald-500",
      label: "Excellent (&gt;75%)",
      shortLabel: "Maîtrisé"
    };
  };

  const handleAuditShortcut = (zoneId) => {
    setSelectedZoneId(zoneId);
    setCurrentTab("audit");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Scores 5S par Zone MYC</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivi des performances et de l'état d'avancement des 12 zones clés de MYC Innovation.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3.5 md:flex-row md:items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une zone, un responsable..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase pr-2">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filtrer:</span>
          </div>
          
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
              statusFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Toutes ({zones.length})
          </button>
          
          <button
            onClick={() => setStatusFilter("excellent")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
              statusFilter === "excellent"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Maîtrisées (&gt;75%) ({zones.filter(z => z.score > 75).length})
          </button>

          <button
            onClick={() => setStatusFilter("acceptable")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
              statusFilter === "acceptable"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Amélioration (50-75%) ({zones.filter(z => z.score >= 50 && z.score <= 75).length})
          </button>

          <button
            onClick={() => setStatusFilter("critical")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
              statusFilter === "critical"
                ? "bg-red-500 text-white"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            Critiques (&lt;50%) ({zones.filter(z => z.score < 50).length})
          </button>
        </div>
      </div>

      {/* Grid of Zone Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filteredZones.map((zone) => {
          const colorInfo = getScoreColorInfo(zone.score);
          return (
            <div
              key={zone.id}
              className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base tracking-tight">{zone.name}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <User className="h-3 w-3 shrink-0" />
                      <span className="truncate">{zone.manager}</span>
                    </div>
                  </div>
                  <span className={`inline-flex shrink-0 items-center rounded-lg px-2.5 py-1 text-xs font-extrabold ${colorInfo.badge}`}>
                    {zone.score}%
                  </span>
                </div>

                {/* Score Jauge */}
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${colorInfo.barBg}`} style={{ width: `${zone.score}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span>État : {colorInfo.shortLabel}</span>
                    <span>Objectif 75%</span>
                  </div>
                </div>

                {/* 5S Pillars breakdown bar chart inside the card */}
                <div className="mt-5 space-y-2 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scores par Pilier (sur 5)</span>
                  
                  {/* Pilier List */}
                  <div className="space-y-2 text-xs">
                    {/* Pilier 1: Trier */}
                    <div className="flex items-center gap-2">
                      <span className="w-18 text-[10px] text-slate-500 font-semibold truncate">1. Trier</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(zone.scoresByPilier.sort / 5) * 100}%` }} />
                      </div>
                      <span className="font-bold text-slate-700 text-[10px]">{zone.scoresByPilier.sort}</span>
                    </div>

                    {/* Pilier 2: Ranger */}
                    <div className="flex items-center gap-2">
                      <span className="w-18 text-[10px] text-slate-500 font-semibold truncate">2. Ranger</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(zone.scoresByPilier.setInOrder / 5) * 100}%` }} />
                      </div>
                      <span className="font-bold text-slate-700 text-[10px]">{zone.scoresByPilier.setInOrder}</span>
                    </div>

                    {/* Pilier 3: Nettoyer */}
                    <div className="flex items-center gap-2">
                      <span className="w-18 text-[10px] text-slate-500 font-semibold truncate">3. Nettoyer</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(zone.scoresByPilier.shine / 5) * 100}%` }} />
                      </div>
                      <span className="font-bold text-slate-700 text-[10px]">{zone.scoresByPilier.shine}</span>
                    </div>

                    {/* Pilier 4: Standardiser */}
                    <div className="flex items-center gap-2">
                      <span className="w-18 text-[10px] text-slate-500 font-semibold truncate">4. Standard.</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(zone.scoresByPilier.standardize / 5) * 100}%` }} />
                      </div>
                      <span className="font-bold text-slate-700 text-[10px]">{zone.scoresByPilier.standardize}</span>
                    </div>

                    {/* Pilier 5: Maintenir */}
                    <div className="flex items-center gap-2">
                      <span className="w-18 text-[10px] text-slate-500 font-semibold truncate">5. Maintenir</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(zone.scoresByPilier.sustain / 5) * 100}%` }} />
                      </div>
                      <span className="font-bold text-slate-700 text-[10px]">{zone.scoresByPilier.sustain}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="mt-4 border-t border-slate-100 pt-3.5 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>Dernier audit :</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{zone.lastAuditDate || "Non audité"}</span>
                </div>

                <div className="flex items-center gap-2">
                  {zone.openActionsCount > 0 ? (
                    <span className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 text-[10px] font-bold text-amber-700 animate-pulse">
                      {zone.openActionsCount} action{zone.openActionsCount > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                      Conforme
                    </span>
                  )}

                  <button
                    onClick={() => handleAuditShortcut(zone.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                    title="Auditer cette zone"
                  >
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredZones.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
          <AlertCircle className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-semibold">Aucune zone ne correspond à votre recherche ou filtre.</p>
          <button
            onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
