import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  PieChart,
  Cell,
  Pie
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileCheck,
  MapPin,
  Award,
  Sparkles,
  ClipboardList,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { useAudit } from "../context/AuditContext";

export default function Dashboard({ setCurrentTab }) {
  const {
    zones,
    actions,
    history,
    globalScore,
    zonesAudited,
    actionsKPI,
    bestZone,
    criticalZone
  } = useAudit();

  const [selectedHeatmapZone, setSelectedHeatmapZone] = useState(null);

  // Helper to color-code scores
  const getScoreColor = (score) => {
    if (score < 50) return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30";
    if (score <= 75) return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30";
    return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30";
  };

  const getScoreBadgeBg = (score) => {
    if (score < 50) return "bg-red-500";
    if (score <= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getScoreCardBorder = (score) => {
    if (score < 50) return "border-l-4 border-l-red-500";
    if (score <= 75) return "border-l-4 border-l-amber-500";
    return "border-l-4 border-l-emerald-500";
  };

  // Graph Data Preparation
  // A. Bar Chart: Score by Zone
  const barChartData = zones.map((z) => ({
    name: z.name,
    Score: z.score,
    color: z.score < 50 ? "#EF4444" : z.score <= 75 ? "#F59E0B" : "#10B981"
  }));

  // B. Radar Chart: Scores by 5S Pilier
  // Average piliers across all zones
  const aggregatePiliers = () => {
    const totals = { sort: 0, setInOrder: 0, shine: 0, standardize: 0, sustain: 0 };
    zones.forEach((z) => {
      totals.sort += z.scoresByPilier.sort;
      totals.setInOrder += z.scoresByPilier.setInOrder;
      totals.shine += z.scoresByPilier.shine;
      totals.standardize += z.scoresByPilier.standardize;
      totals.sustain += z.scoresByPilier.sustain;
    });

    const numZones = zones.length;
    return [
      { subject: "Trier (Sort)", A: Number((totals.sort / numZones).toFixed(2)), fullMark: 5 },
      { subject: "Ranger (Set in order)", A: Number((totals.setInOrder / numZones).toFixed(2)), fullMark: 5 },
      { subject: "Nettoyer (Shine)", A: Number((totals.shine / numZones).toFixed(2)), fullMark: 5 },
      { subject: "Standardiser (Standardize)", A: Number((totals.standardize / numZones).toFixed(2)), fullMark: 5 },
      { subject: "Maintenir (Sustain)", A: Number((totals.sustain / numZones).toFixed(2)), fullMark: 5 }
    ];
  };

  const radarData = aggregatePiliers();

  // C. Line Chart: History (directly matches context data)
  const lineData = history;

  // D. Donut/Pie Chart: Actions status
  const pieData = [
    { name: "Ouvertes", value: actionsKPI.open, color: "#3B82F6" },
    { name: "En cours", value: actionsKPI.inProgress, color: "#F59E0B" },
    { name: "Clôturées", value: actionsKPI.closed, color: "#10B981" },
    { name: "En retard", value: actionsKPI.overdue, color: "#EF4444" }
  ].filter(item => item.value > 0); // Only display non-zero values

  // Custom cell renderer for Bar chart to color bars individually
  const CustomBarShape = (props) => {
    const { fill, x, y, width, height } = props;
    return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />;
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with MYC building photo */}
      <div className="relative rounded-2xl overflow-hidden h-40 w-full shadow-lg mb-2">
        <img
          src="/17_18_24.png"
          alt="MYC Innovation Monastir"
          className="w-full h-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 gap-5">
          {/* Logo */}
          <div className="h-14 w-14 rounded-xl bg-white shadow-xl overflow-hidden flex items-center justify-center shrink-0">
            <img src="/logo MYC.jpeg" alt="MYC" className="h-11 w-11 object-contain" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
              MYC 5S Audit Dashboard
            </h2>
            <p className="text-slate-300 text-sm mt-0.5 font-medium">
              Pilotage Qualité Industriel 5S · MYC Innovation Monastir
            </p>
          </div>
          {/* Right info */}
          <div className="ml-auto flex items-center gap-3 hidden sm:flex">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium block">Dernière mise à jour</span>
              <span className="text-sm font-bold text-white">
                {zones.map(z => z.lastAuditDate).filter(Boolean).sort().reverse()[0] || "Aujourd'hui"}
              </span>
            </div>
            <button
              onClick={() => setCurrentTab("audit")}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/30 hover:bg-red-500 transition-all duration-200 cursor-pointer"
            >
              <ClipboardList className="h-4 w-4" />
              <span>Nouvel Audit 5S</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
        {/* KPI: Score Global */}
        <div className={`col-span-2 rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${getScoreCardBorder(globalScore)}`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Score Global 5S</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900">{globalScore}%</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${getScoreColor(globalScore)}`}>
                  {globalScore >= 75 ? "Excellent" : globalScore >= 50 ? "Acceptable" : "Critique"}
                </span>
              </div>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${getScoreBadgeBg(globalScore)} shadow-lg shadow-black/5`}>
              <Sparkles className="h-5.5 w-5.5" />
            </div>
          </div>
          {/* Small progress meter */}
          <div className="mt-4.5 space-y-1">
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  globalScore < 50 ? "bg-red-500" : globalScore <= 75 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${globalScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Objectif: &gt;75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* KPI: Zones Auditées */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Zones</span>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">{zonesAudited}</div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Sur {zones.length} zones totales</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* KPI: Actions Ouvertes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</span>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">{actionsKPI.open + actionsKPI.inProgress}</div>
              <p className="text-xs text-slate-400 mt-1 font-medium">{actionsKPI.open} ouvertes | {actionsKPI.inProgress} en cours</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* KPI: En Retard */}
        <div className={`rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${
          actionsKPI.overdue > 0 ? "border-red-200 bg-red-50/40" : "border-slate-200 bg-white"
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">En retard</span>
              <div className={`mt-2 text-3xl font-extrabold ${actionsKPI.overdue > 0 ? "text-red-600" : "text-slate-900"}`}>
                {actionsKPI.overdue}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Date limite dépassée</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              actionsKPI.overdue > 0 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
            }`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* KPI: Meilleure Zone */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md col-span-1">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Zone</span>
              <div className="mt-2 text-base font-bold text-slate-900 truncate" title={bestZone?.name}>
                {bestZone?.name}
              </div>
              <p className="text-xs font-semibold text-emerald-600 mt-1">{bestZone?.score}% score</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* KPI: Zone Critique */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md col-span-1">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Zone Critique</span>
              <div className="mt-2 text-base font-bold text-slate-900 truncate" title={criticalZone?.name}>
                {criticalZone?.name}
              </div>
              <p className="text-xs font-semibold text-red-500 mt-1">{criticalZone?.score}% score</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Visualizations Row 1 */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Bar Chart: Scores by Zone */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-bold text-slate-900">Score 5S par Zone MYC (%)</h3>
            <span className="text-xs font-semibold text-slate-400">Objectif global: &gt; 75%</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.02)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
                          <p className="text-xs font-bold text-slate-900">{data.name}</p>
                          <p className="text-sm font-extrabold mt-1" style={{ color: data.color }}>
                            {data.Score}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Score" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart: Scores by Pilier */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 pb-4">Profil Global 5S par Pilier</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 9, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 9 }} stroke="#94A3B8" />
                <Radar
                  name="Moyenne MYC"
                  dataKey="A"
                  stroke="#E53E3E"
                  fill="#E53E3E"
                  fillOpacity={0.25}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg text-xs">
                          <p className="font-bold text-slate-900">{payload[0].payload.subject}</p>
                          <p className="font-extrabold text-red-600 mt-1">
                            {payload[0].value} / 5
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Heatmap and Line + Donut Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Heatmap Section */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-base font-bold text-slate-900">Cartographie Thermique des Zones (Heatmap)</h3>
              <div className="flex gap-2.5 text-[10px] font-semibold text-slate-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500"/> &gt;75%</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500"/> 50-75%</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-red-500"/> &lt;50%</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 pb-4">
              Cliquez sur une zone pour afficher sa fiche de synthèse en temps réel.
            </p>

            {/* Simple Grid Heatmap */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {zones.map((zone) => {
                const isSelected = selectedHeatmapZone?.id === zone.id;
                let bgClass = "bg-emerald-50 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70";
                let dotColor = "bg-emerald-500";
                
                if (zone.score < 50) {
                  bgClass = "bg-red-50 border-red-200 text-red-950 hover:bg-red-100/70";
                  dotColor = "bg-red-500";
                } else if (zone.score <= 75) {
                  bgClass = "bg-amber-50 border-amber-200 text-amber-950 hover:bg-amber-100/70";
                  dotColor = "bg-amber-500";
                }

                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedHeatmapZone(zone)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative group cursor-pointer ${bgClass} ${
                      isSelected ? "ring-2 ring-red-600 shadow-sm border-transparent" : "shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-bold truncate pr-3 group-hover:text-red-950">{zone.name}</span>
                      <span className="text-xs font-extrabold shrink-0">{zone.score}%</span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[9px] text-slate-500 font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                      <span className="truncate">{zone.manager.split(" ")[1] || "Resp"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic details drawer below the heatmap */}
          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 min-h-[90px]">
            {selectedHeatmapZone ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">{selectedHeatmapZone.name}</h4>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
                      selectedHeatmapZone.score < 50 ? "bg-red-500" : selectedHeatmapZone.score <= 75 ? "bg-amber-500" : "bg-emerald-500"
                    }`}>
                      {selectedHeatmapZone.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-600">Responsable :</span> {selectedHeatmapZone.manager} | 
                    <span className="font-semibold text-slate-600 ml-1.5">Dernier audit :</span> {selectedHeatmapZone.lastAuditDate}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <div className="rounded-lg bg-white px-2.5 py-1 border border-slate-200/50 text-[10px] shadow-2xs">
                    <span className="text-slate-400 font-medium mr-1.5">Trier:</span>
                    <span className="font-bold text-slate-700">{selectedHeatmapZone.scoresByPilier.sort}/5</span>
                  </div>
                  <div className="rounded-lg bg-white px-2.5 py-1 border border-slate-200/50 text-[10px] shadow-2xs">
                    <span className="text-slate-400 font-medium mr-1.5">Ranger:</span>
                    <span className="font-bold text-slate-700">{selectedHeatmapZone.scoresByPilier.setInOrder}/5</span>
                  </div>
                  <div className="rounded-lg bg-white px-2.5 py-1 border border-slate-200/50 text-[10px] shadow-2xs">
                    <span className="text-slate-400 font-medium mr-1.5">Nettoyer:</span>
                    <span className="font-bold text-slate-700">{selectedHeatmapZone.scoresByPilier.shine}/5</span>
                  </div>
                  <div className="rounded-lg bg-white px-2.5 py-1 border border-slate-200/50 text-[10px] shadow-2xs">
                    <span className="text-slate-400 font-medium mr-1.5">Stand.:</span>
                    <span className="font-bold text-slate-700">{selectedHeatmapZone.scoresByPilier.standardize}/5</span>
                  </div>
                  <div className="rounded-lg bg-white px-2.5 py-1 border border-slate-200/50 text-[10px] shadow-2xs">
                    <span className="text-slate-400 font-medium mr-1.5">Maint.:</span>
                    <span className="font-bold text-slate-700">{selectedHeatmapZone.scoresByPilier.sustain}/5</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentTab("zones")}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 shrink-0 cursor-pointer"
                >
                  <span>Détails zone</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400 italic">
                Sélectionnez une zone ci-dessus pour inspecter ses scores par pilier 5S.
              </div>
            )}
          </div>
        </div>

        {/* Line Chart & Donut Chart Side-by-Side (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          {/* C. Line Chart: Evolution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 pb-3">Évolution Mensuelle du Score Global (%)</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-lg text-xs">
                            <span className="font-bold text-slate-700">{payload[0].payload.month} : </span>
                            <span className="font-extrabold text-red-600">{payload[0].value}%</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#E53E3E"
                    strokeWidth={3}
                    dot={{ fill: "#E53E3E", r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* D. Donut Chart: Plan d'action répartition */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-bold text-slate-900 pb-2">Statut des Actions Correctives</h3>
            
            {pieData.length > 0 ? (
              <div className="flex items-center justify-between gap-2 h-36">
                <div className="h-full w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-xl border border-slate-100 bg-white p-2 shadow-lg text-xs font-bold text-slate-800">
                                {payload[0].name}: {payload[0].value}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Custom Legends */}
                <div className="w-1/2 space-y-2">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-500 font-medium">{item.name}</span>
                      </div>
                      <span className="font-extrabold text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-36 items-center justify-center text-xs text-slate-400 italic">
                Aucune action corrective enregistrée.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
