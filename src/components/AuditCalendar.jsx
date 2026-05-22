import React, { useState } from "react";
import { useAudit } from "../context/AuditContext";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  User,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  // Monday = 0
  let d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}

const ZONE_COLORS = {
  "injection": "bg-blue-500",
  "soudure": "bg-orange-500",
  "metallisation": "bg-purple-500",
  "assemblage": "bg-cyan-500",
  "packaging": "bg-pink-500",
  "magasin_matiere": "bg-amber-500",
  "magasin_produit_fini": "bg-yellow-500",
  "qualite": "bg-emerald-500",
  "maintenance": "bg-red-500",
  "administration": "bg-indigo-500",
  "bureaux": "bg-teal-500",
  "dossiers_reseau_qualite": "bg-rose-500",
};

export default function AuditCalendar({ setCurrentTab, setSelectedZoneId }) {
  const { zones } = useAudit();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("myc_5s_calendar");
    if (saved) return JSON.parse(saved);
    // Pre-fill with last audit dates from zones
    return zones
      .filter(z => z.lastAuditDate)
      .map((z, i) => ({
        id: i + 1,
        date: z.lastAuditDate,
        zoneId: z.id,
        zoneName: z.name,
        time: "09:00",
        auditor: "DG Sami Ladjimi",
        note: `Audit 5S — ${z.name}`,
        done: true,
      }));
  });

  const [form, setForm] = useState({
    zoneId: zones[0]?.id || "",
    time: "09:00",
    auditor: "DG Sami Ladjimi",
    note: "",
  });

  const saveEvents = (next) => {
    setEvents(next);
    localStorage.setItem("myc_5s_calendar", JSON.stringify(next));
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const getDateStr = (day) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getEventsForDay = (day) => {
    const ds = getDateStr(day);
    return events.filter(e => e.date === ds);
  };

  const handleAddEvent = () => {
    if (!selectedDay || !form.zoneId) return;
    const zone = zones.find(z => z.id === form.zoneId);
    const newEvent = {
      id: Date.now(),
      date: getDateStr(selectedDay),
      zoneId: form.zoneId,
      zoneName: zone?.name || form.zoneId,
      time: form.time,
      auditor: form.auditor,
      note: form.note || `Audit 5S — ${zone?.name}`,
      done: false,
    };
    saveEvents([...events, newEvent]);
    setShowForm(false);
    setForm({ zoneId: zones[0]?.id || "", time: "09:00", auditor: "DG Sami Ladjimi", note: "" });
  };

  const handleDelete = (id) => {
    saveEvents(events.filter(e => e.id !== id));
  };

  const handleToggleDone = (id) => {
    saveEvents(events.map(e => e.id === id ? { ...e, done: !e.done } : e));
  };

  const handleLaunchAudit = (zoneId) => {
    setSelectedZoneId(zoneId);
    setCurrentTab("audit");
  };

  const todayStr = today.toISOString().split("T")[0];
  const upcomingEvents = events
    .filter(e => e.date >= todayStr && !e.done)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-red-600" />
            Calendrier des Audits 5S
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Planifiez et suivez les audits de chacune des 12 zones — MYC Innovation Monastir
          </p>
        </div>
        {selectedDay && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/20 hover:bg-red-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Planifier un audit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Month Nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={prevMonth}
              className="h-8 w-8 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <h3 className="font-extrabold text-slate-900 text-lg">
              {MONTHS_FR[viewMonth]} {viewYear}
            </h3>
            <button
              onClick={nextMonth}
              className="h-8 w-8 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {DAYS_FR.map(d => (
              <div key={d} className="text-center py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7">
            {/* Empty leading cells */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 border-b border-r border-slate-50" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayStr = getDateStr(day);
              const dayEvents = getEventsForDay(day);
              const isToday = dayStr === todayStr;
              const isSelected = selectedDay === day;
              const isPast = dayStr < todayStr;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-20 border-b border-r border-slate-100 p-1.5 cursor-pointer transition-all duration-150 flex flex-col ${
                    isSelected
                      ? "bg-red-50 border-red-100"
                      : isToday
                      ? "bg-amber-50/50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-red-600 text-white"
                        : isSelected
                        ? "bg-red-100 text-red-700"
                        : isPast
                        ? "text-slate-300"
                        : "text-slate-700"
                    }`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 rounded px-1">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate ${
                          ev.done ? "opacity-50 line-through" : ""
                        } ${ZONE_COLORS[ev.zoneId] || "bg-slate-400"} text-white`}
                      >
                        {ev.zoneName}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-slate-400 pl-1">+{dayEvents.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Selected Day Events */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedDay
                  ? `${selectedDay} ${MONTHS_FR[viewMonth]} ${viewYear}`
                  : "Sélectionnez un jour"}
              </h4>
              {selectedDay && (
                <button
                  onClick={() => setShowForm(true)}
                  className="h-7 w-7 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {!selectedDay && (
                <p className="p-5 text-sm text-slate-400 text-center">
                  Cliquez sur une date pour voir ou planifier des audits.
                </p>
              )}
              {selectedDay && selectedDayEvents.length === 0 && (
                <div className="p-5 text-center">
                  <CalendarIcon className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Aucun audit planifié ce jour.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    + Planifier un audit
                  </button>
                </div>
              )}
              {selectedDayEvents.map(ev => (
                <div key={ev.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${ZONE_COLORS[ev.zoneId] || "bg-slate-400"}`} />
                      <span className={`text-sm font-bold text-slate-800 ${ev.done ? "line-through opacity-50" : ""}`}>
                        {ev.zoneName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleDone(ev.id)}
                        className={`h-6 w-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                          ev.done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                        }`}
                        title={ev.done ? "Marquer comme non fait" : "Marquer comme fait"}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="h-6 w-6 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ev.time}</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{ev.auditor}</span>
                  </div>
                  {ev.note && <p className="text-[11px] text-slate-500 italic">{ev.note}</p>}
                  {!ev.done && (
                    <button
                      onClick={() => handleLaunchAudit(ev.zoneId)}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
                    >
                      → Lancer cet audit maintenant
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Audits */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h4 className="font-bold text-slate-900 text-sm">Audits à venir</h4>
            </div>
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {upcomingEvents.length === 0 && (
                <p className="p-5 text-sm text-slate-400 text-center">
                  Aucun audit planifié prochainement.
                </p>
              )}
              {upcomingEvents.map(ev => (
                <div key={ev.id} className="px-5 py-3 flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-xl ${ZONE_COLORS[ev.zoneId] || "bg-slate-400"} flex items-center justify-center shrink-0`}>
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{ev.zoneName}</p>
                    <p className="text-[10px] text-slate-400">{ev.date} à {ev.time}</p>
                  </div>
                  <button
                    onClick={() => handleLaunchAudit(ev.zoneId)}
                    className="text-[10px] font-bold text-red-600 hover:text-red-700 cursor-pointer whitespace-nowrap"
                  >
                    Auditer →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                Planifier un Audit — {selectedDay} {MONTHS_FR[viewMonth]} {viewYear}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 transition cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Zone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Zone à auditer *</label>
                <select
                  value={form.zoneId}
                  onChange={e => setForm(f => ({ ...f, zoneId: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name} (Score actuel: {z.score}%)</option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Heure</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Auditeur</label>
                  <input
                    type="text"
                    value={form.auditor}
                    onChange={e => setForm(f => ({ ...f, auditor: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  />
                </div>
              </div>

              {/* Note */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Note / Objet</label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="Ex: Audit trimestriel — vérification nettoyage..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
