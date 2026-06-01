import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Calendar, MapPin, Search, SlidersHorizontal, User } from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { useTranslation } from "../context/TranslationContext";

const planDefinitions = [
  {
    id: "plan-injection",
    title: "Usine Injection - plan complet",
    image: "/Injection.png",
    aspectClass: "aspect-[1152/496]",
    zones: [
      { zoneId: "magasin_matiere", x: 29, y: 8, w: 32, h: 18 },
      { zoneId: "injection", x: 27, y: 36, w: 39, h: 42 },
      { zoneId: "maintenance", x: 8, y: 33, w: 12, h: 45 },
      { zoneId: "soudure", x: 30, y: 63, w: 19, h: 18 },
      { zoneId: "qualite", x: 67, y: 11, w: 10, h: 17 },
      { zoneId: "administration", x: 67, y: 30, w: 14, h: 24 },
      { zoneId: "bureaux", x: 67, y: 4, w: 11, h: 6 },
      { zoneId: "dossiers_reseau_qualite", x: 80, y: 76, w: 10, h: 11 },
    ],
  },
  {
    id: "plan-usine-2",
    title: "Usine 2 - plan complet",
    image: "/usine 2.png",
    aspectClass: "aspect-[696/594]",
    zones: [
      { zoneId: "metallisation", x: 35, y: 7, w: 34, h: 18 },
      { zoneId: "assemblage", x: 34, y: 30, w: 28, h: 29 },
      { zoneId: "packaging", x: 36, y: 63, w: 24, h: 10 },
      { zoneId: "magasin_produit_fini", x: 71, y: 66, w: 19, h: 11 },
    ],
  },
];

function getPlanOverlayColors(score, isActive) {
  if (score < 50) {
    return {
      background: isActive ? "rgba(239, 68, 68, 0.78)" : "rgba(239, 68, 68, 0.28)",
      border: "#ef4444",
      text: "#ffffff",
      shadow: "0 16px 30px rgba(239, 68, 68, 0.28)",
    };
  }

  if (score <= 75) {
    return {
      background: isActive ? "rgba(245, 158, 11, 0.8)" : "rgba(245, 158, 11, 0.28)",
      border: "#f59e0b",
      text: "#111827",
      shadow: "0 16px 30px rgba(245, 158, 11, 0.24)",
    };
  }

  return {
    background: isActive ? "rgba(16, 185, 129, 0.8)" : "rgba(16, 185, 129, 0.28)",
    border: "#10b981",
    text: "#ffffff",
    shadow: "0 16px 30px rgba(16, 185, 129, 0.24)",
  };
}

export default function Zones({ setCurrentTab, setSelectedZoneId }) {
  const { zones } = useAudit();
  const { t, getZoneName, getPillarLabel, formatDate } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeZoneId, setActiveZoneId] = useState(zones[0]?.id || "");

  const filteredZones = zones.filter((zone) => {
    const zoneName = getZoneName(zone).toLowerCase();
    const matchesSearch =
      zoneName.includes(searchTerm.toLowerCase()) ||
      zone.manager.toLowerCase().includes(searchTerm.toLowerCase());

    const isCritical = zone.score < 50;
    const isAcceptable = zone.score >= 50 && zone.score <= 75;
    const isExcellent = zone.score > 75;

    if (statusFilter === "critical") return matchesSearch && isCritical;
    if (statusFilter === "acceptable") return matchesSearch && isAcceptable;
    if (statusFilter === "excellent") return matchesSearch && isExcellent;

    return matchesSearch;
  });

  useEffect(() => {
    if (filteredZones.length === 0) return;
    if (!filteredZones.some((zone) => zone.id === activeZoneId)) {
      setActiveZoneId(filteredZones[0].id);
    }
  }, [activeZoneId, filteredZones]);

  const getScoreColorInfo = (score) => {
    if (score < 50) {
      return {
        badge: "bg-red-500 text-white",
        barBg: "bg-red-500",
        shortLabel: t("zones.criticalShort"),
      };
    }
    if (score <= 75) {
      return {
        badge: "bg-amber-500 text-white",
        barBg: "bg-amber-500",
        shortLabel: t("zones.improveShort"),
      };
    }
    return {
      badge: "bg-emerald-500 text-white",
      barBg: "bg-emerald-500",
      shortLabel: t("zones.masteredShort"),
    };
  };

  const handleAuditShortcut = (zoneId) => {
    setSelectedZoneId(zoneId);
    setCurrentTab("audit");
  };

  const activeZone =
    filteredZones.find((zone) => zone.id === activeZoneId) ||
    zones.find((zone) => zone.id === activeZoneId) ||
    filteredZones[0] ||
    zones[0] ||
    null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t("zones.title")}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{t("zones.subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("zones.search")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 pr-2 text-xs font-semibold uppercase text-slate-400">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{t("zones.filter")}</span>
          </div>

          <button
            onClick={() => setStatusFilter("all")}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t("zones.all")} ({zones.length})
          </button>

          <button
            onClick={() => setStatusFilter("excellent")}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === "excellent"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {t("zones.mastered")} ({zones.filter((zone) => zone.score > 75).length})
          </button>

          <button
            onClick={() => setStatusFilter("acceptable")}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === "acceptable"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            {t("zones.improve")} ({zones.filter((zone) => zone.score >= 50 && zone.score <= 75).length})
          </button>

          <button
            onClick={() => setStatusFilter("critical")}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === "critical" ? "bg-red-500 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            {t("zones.critical")} ({zones.filter((zone) => zone.score < 50).length})
          </button>
        </div>
      </div>

      {activeZone && (
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Zones sur plan
              </span>
              <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                {getZoneName(activeZone)}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Analyse des deux images: chaque partie visible du plan recoit une couleur selon le score de sa zone.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                &gt; 75%
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                50 - 75%
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                &lt; 50%
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-6">
            <div className="space-y-6">
            {planDefinitions.map((plan) => (
              <div key={plan.id} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 md:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-black tracking-tight text-slate-900">{plan.title}</h4>
                    <p className="text-sm font-medium text-slate-500">
                      Cliquez sur une zone coloree pour la selectionner.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
                    Image reelle
                  </span>
                </div>

                <div className={`relative overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm ${plan.aspectClass}`}>
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="h-full w-full object-contain bg-white"
                  />

                  <div className="absolute inset-0">
                    {plan.zones.map((area) => {
                      const zone = zones.find((item) => item.id === area.zoneId);
                      if (!zone) return null;

                      const isActive = zone.id === activeZone.id;
                      const overlayColors = getPlanOverlayColors(zone.score, isActive);

                      return (
                        <button
                          key={area.zoneId}
                          type="button"
                          onClick={() => setActiveZoneId(zone.id)}
                          className="absolute rounded-2xl border-2 text-left transition-all duration-200"
                          style={{
                            left: `${area.x}%`,
                            top: `${area.y}%`,
                            width: `${area.w}%`,
                            height: `${area.h}%`,
                            background: overlayColors.background,
                            borderColor: overlayColors.border,
                            color: overlayColors.text,
                            boxShadow: isActive ? overlayColors.shadow : "none",
                            transform: isActive ? "scale(1.02)" : "scale(1)",
                            backdropFilter: "blur(1px)",
                          }}
                          title={getZoneName(zone)}
                        >
                          <span className="absolute left-2 top-2 rounded-full bg-black/25 px-3 py-1.5 text-[12px] font-black uppercase tracking-[0.12em]">
                            {getZoneName(zone)}
                          </span>
                          <span className="absolute bottom-2 right-2 rounded-full bg-black/25 px-3 py-1.5 text-[12px] font-black">
                            {zone.score}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="rounded-[20px] bg-slate-900 p-4 text-white shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                      Zone active
                    </span>
                    <h4 className="mt-1 text-xl font-black leading-tight">{getZoneName(activeZone)}</h4>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-black ${getScoreColorInfo(activeZone.score).badge}`}>
                    {activeZone.score}%
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${getScoreColorInfo(activeZone.score).barBg}`}
                    style={{ width: `${activeZone.score}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{activeZone.manager}</span>
                </div>
              </div>

              <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">{t("zones.lastAudit")}</span>
                    <span className="font-bold text-slate-800">
                      {activeZone.lastAuditDate ? formatDate(activeZone.lastAuditDate) : t("sidebar.none")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">{t("zones.state")}</span>
                    <span className="font-bold text-slate-800">{getScoreColorInfo(activeZone.score).shortLabel}</span>
                  </div>
                </div>
              </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Lecture claire
                </span>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Le premier plan correspond entierement a l'usine Injection: magasin matiere, maintenance, injection, soudure, qualite, administration, bureaux et dossiers qualite.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Le deuxieme plan correspond a l'usine 2: metallisation, assemblage, packaging et magasin produit fini.
                </p>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    Zone selectionnee: {getZoneName(activeZone)} ({activeZone.score}%)
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Les images ont ete agrandies pour mieux voir les parties de l'usine. Les zones actives gardent un contraste plus fort pour etre plus faciles a reperer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredZones.map((zone) => {
          const colorInfo = getScoreColorInfo(zone.score);
          const isActive = zone.id === activeZoneId;

          return (
            <div
              key={zone.id}
              onClick={() => setActiveZoneId(zone.id)}
              className={`flex cursor-pointer flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isActive ? "border-red-300 ring-2 ring-red-100" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-slate-900">{getZoneName(zone)}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <User className="h-3 w-3 shrink-0" />
                      <span className="truncate">{zone.manager}</span>
                    </div>
                  </div>
                  <span className={`inline-flex shrink-0 items-center rounded-lg px-2.5 py-1 text-xs font-extrabold ${colorInfo.badge}`}>
                    {zone.score}%
                  </span>
                </div>

                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${colorInfo.barBg}`} style={{ width: `${zone.score}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span>{t("zones.state")} : {colorInfo.shortLabel}</span>
                    <span>75%</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("zones.pillars")}</span>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: "sort", value: zone.scoresByPilier.sort },
                      { key: "setInOrder", value: zone.scoresByPilier.setInOrder },
                      { key: "shine", value: zone.scoresByPilier.shine },
                      { key: "standardize", value: zone.scoresByPilier.standardize },
                      { key: "sustain", value: zone.scoresByPilier.sustain },
                    ].map((pillar, index) => (
                      <div key={pillar.key} className="flex items-center gap-2">
                        <span className="w-18 truncate text-[10px] font-semibold text-slate-500">
                          {index + 1}. {getPillarLabel(pillar.key)}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${(pillar.value / 5) * 100}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{pillar.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{t("zones.lastAudit")}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">
                    {zone.lastAuditDate ? formatDate(zone.lastAuditDate) : t("sidebar.none")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {zone.openActionsCount > 0 ? (
                    <span className="animate-pulse rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                      {zone.openActionsCount > 1
                        ? t("zones.actionsCountPlural", { count: zone.openActionsCount })
                        : t("zones.actionsCount", { count: zone.openActionsCount })}
                    </span>
                  ) : (
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                      {t("zones.compliant")}
                    </span>
                  )}

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAuditShortcut(zone.id);
                    }}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition-all hover:bg-red-600 hover:text-white"
                    title={t("zones.auditZone")}
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
          <p className="mt-3 text-sm font-semibold">{t("zones.noResult")}</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            {t("zones.resetFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
