import React, { useState } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  CheckCircle,
  AlertTriangle,
  Plus,
  Clock,
  User,
  MapPin,
  X,
  Briefcase
} from "lucide-react";
import { useAudit } from "../context/AuditContext";

export default function ActionPlan() {
  const { actions, zones, updateActionStatus, addAction } = useAudit();

  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // State for adding custom action
  const [showAddForm, setShowAddForm] = useState(false);
  const [newZoneId, setNewZoneId] = useState(zones[0]?.id || "");
  const [newDeviation, setNewDeviation] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newManager, setNewManager] = useState("");
  const [newPriority, setNewPriority] = useState("Moyenne");
  const [newDueDate, setNewDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });

  // State for updating progress inline
  const [editingActionId, setEditingActionId] = useState(null);
  const [editStatus, setEditStatus] = useState("Ouvert");
  const [editProgress, setEditProgress] = useState(0);

  // Status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "Clôturé":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "En cours":
        return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
      case "En retard":
        return "bg-red-50 text-red-700 border-red-200";
      default: // Ouvert
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  // Priority badges
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critique":
        return "bg-red-600 text-white";
      case "Haute":
        return "bg-orange-500 text-white";
      case "Moyenne":
        return "bg-slate-200 text-slate-700";
      default: // Faible
        return "bg-slate-100 text-slate-500";
    }
  };

  // Filter actions
  const filteredActions = actions.filter((act) => {
    const matchesSearch =
      act.deviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.zoneName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = zoneFilter === "all" || act.zoneId === zoneFilter;
    const matchesStatus = statusFilter === "all" || act.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || act.priority === priorityFilter;

    return matchesSearch && matchesZone && matchesStatus && matchesPriority;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addAction({
      zoneId: newZoneId,
      deviation: newDeviation,
      action: newAction,
      manager: newManager || "Production",
      priority: newPriority,
      dueDate: newDueDate,
    });
    // Reset form
    setNewDeviation("");
    setNewAction("");
    setNewManager("");
    setShowAddForm(false);
  };

  const handleQuickClose = (id) => {
    updateActionStatus(id, "Clôturé", 100);
  };

  const startEditing = (act) => {
    setEditingActionId(act.id);
    setEditStatus(act.status);
    setEditProgress(act.progress);
  };

  const handleSaveEdit = (id) => {
    updateActionStatus(id, editStatus, editProgress);
    setEditingActionId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Plan d'Action Corrective 5S</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivi, filtration et clôture des actions d'amélioration continue issues des audits.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Nouvelle Action</span>
        </button>
      </div>

      {/* Advanced Filters Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Filtres de recherche</h3>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher écart, action, responsable..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>

          {/* Zone filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none transition-all font-semibold"
          >
            <option value="all">Toutes les Zones</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none transition-all font-semibold"
          >
            <option value="all">Tous les Statuts</option>
            <option value="Ouvert">Ouvert</option>
            <option value="En cours">En cours</option>
            <option value="Clôturé">Clôturé</option>
            <option value="En retard">En retard</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none transition-all font-semibold"
          >
            <option value="all">Toutes les Priorités</option>
            <option value="Faible">Faible</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Haute">Haute</option>
            <option value="Critique">Critique</option>
          </select>
        </div>
      </div>

      {/* Action Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-100 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 w-12 text-center">ID</th>
                <th className="p-4 w-40">Zone</th>
                <th className="p-4 w-64">Écart & Action Corrective</th>
                <th className="p-4 w-28">Responsable</th>
                <th className="p-4 w-24">Priorité</th>
                <th className="p-4 w-28">Échéance</th>
                <th className="p-4 w-28">Statut</th>
                <th className="p-4 w-32">Avancement</th>
                <th className="p-4 w-32 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredActions.map((act) => {
                const isEditing = editingActionId === act.id;
                return (
                  <tr key={act.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* ID */}
                    <td className="p-4 text-center font-bold text-slate-400">#{act.id}</td>

                    {/* Zone */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{act.zoneName}</span>
                      </div>
                    </td>

                    {/* Deviation & Correction */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-start gap-1">
                        <span className="font-semibold text-slate-900 block"><span className="text-red-600 font-bold">Écart:</span> {act.deviation}</span>
                      </div>
                      <div className="text-slate-500 font-medium pl-0.5">
                        <span className="text-emerald-600 font-semibold">Action:</span> {act.action}
                      </div>
                    </td>

                    {/* Manager / Responsable */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{act.manager}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${getPriorityBadge(act.priority)}`}>
                        {act.priority}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className={act.status === "En retard" ? "text-red-600 font-extrabold" : ""}>
                          {act.dueDate}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => {
                            setEditStatus(e.target.value);
                            if (e.target.value === "Clôturé") setEditProgress(100);
                          }}
                          className="rounded border border-slate-350 p-1 text-xs focus:ring-1 focus:ring-red-500"
                        >
                          <option value="Ouvert">Ouvert</option>
                          <option value="En cours">En cours</option>
                          <option value="Clôturé">Clôturé</option>
                          <option value="En retard">En retard</option>
                        </select>
                      ) : (
                        <span className={`inline-block border rounded px-2.5 py-1 text-[10px] font-extrabold uppercase ${getStatusBadge(act.status)}`}>
                          {act.status}
                        </span>
                      )}
                    </td>

                    {/* Progress */}
                    <td className="p-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={editProgress}
                            onChange={(e) => setEditProgress(Number(e.target.value))}
                            className="w-18 accent-red-600 cursor-pointer"
                          />
                          <span className="font-bold text-[10px] min-w-8">{editProgress}%</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                            <span>{act.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                act.status === "Clôturé"
                                  ? "bg-emerald-500"
                                  : act.status === "En retard"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${act.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Actions button */}
                    <td className="p-4 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(act.id)}
                            className="rounded bg-emerald-600 text-white px-2 py-1 font-bold text-[10px] hover:bg-emerald-700 transition shadow-2xs cursor-pointer"
                          >
                            Sauver
                          </button>
                          <button
                            onClick={() => setEditingActionId(null)}
                            className="rounded bg-slate-200 text-slate-600 px-2 py-1 font-bold text-[10px] hover:bg-slate-300 transition cursor-pointer"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => startEditing(act)}
                            className="rounded border border-slate-200 bg-white text-slate-600 px-2 py-1 font-semibold text-[10px] hover:bg-slate-50 transition cursor-pointer"
                          >
                            Éditer
                          </button>
                          
                          {act.status !== "Clôturé" && (
                            <button
                              onClick={() => handleQuickClose(act.id)}
                              className="rounded bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 font-bold text-[10px] hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                              title="Marquer comme clôturée"
                            >
                              Clôturer
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredActions.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <CheckCircle className="h-10 w-10 text-emerald-200" />
            <p className="mt-3 text-sm font-semibold">Aucune action corrective à afficher.</p>
          </div>
        )}
      </div>

      {/* Modal Add custom action form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Nouvelle Action Corrective 5S</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-full p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold">
              {/* Zone Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500">Zone concernée *</label>
                <select
                  required
                  value={newZoneId}
                  onChange={(e) => setNewZoneId(e.target.value)}
                  className="rounded-xl border border-slate-200 p-2.5 focus:border-red-500 focus:outline-none transition font-semibold"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Écart */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500">Écart constaté *</label>
                <textarea
                  required
                  value={newDeviation}
                  onChange={(e) => setNewDeviation(e.target.value)}
                  rows={2}
                  placeholder="Décrivez l'écart constaté..."
                  className="rounded-xl border border-slate-200 p-2.5 focus:border-red-500 focus:outline-none transition font-medium"
                />
              </div>

              {/* Action Correctrice */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500">Action corrective proposée *</label>
                <textarea
                  required
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  rows={2}
                  placeholder="Décrivez l'action corrective..."
                  className="rounded-xl border border-slate-200 p-2.5 focus:border-red-500 focus:outline-none transition font-medium"
                />
              </div>

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                {/* Responsable */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500">Responsable *</label>
                  <input
                    required
                    type="text"
                    value={newManager}
                    onChange={(e) => setNewManager(e.target.value)}
                    placeholder="Ex: Production"
                    className="rounded-xl border border-slate-200 p-2.5 focus:border-red-500 focus:outline-none transition font-medium"
                  />
                </div>

                {/* Priorité */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500">Priorité *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="rounded-xl border border-slate-200 p-2.5 focus:border-red-500 focus:outline-none transition font-semibold"
                  >
                    <option value="Faible">Faible</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                    <option value="Critique">Critique</option>
                  </select>
                </div>

                {/* Due Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500">Date Limite *</label>
                  <input
                    required
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="rounded-xl border border-slate-200 p-2.5 focus:border-red-500 focus:outline-none transition font-semibold"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700 transition shadow-md shadow-red-600/10 cursor-pointer"
                >
                  Enregistrer l'action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
