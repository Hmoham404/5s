import React, { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Calendar,
  User,
  CheckCircle,
  HelpCircle,
  FileCheck,
  AlertTriangle,
  Info
} from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { checklist5S } from "../data/mockData";

export default function AuditForm({ setCurrentTab, selectedZoneId, setSelectedZoneId }) {
  const { zones, submitAudit } = useAudit();

  const [zoneId, setZoneId] = useState(selectedZoneId || zones[0]?.id || "");
  const [auditor, setAuditor] = useState("DG Sami Ladjimi");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Answers state: key-value of { questionId: score }
  // Initialize all questions with an acceptable rating of 3
  const [answers, setAnswers] = useState(() => {
    const initial = {};
    checklist5S.forEach((q) => {
      initial[q.id] = 3;
    });
    return initial;
  });

  // Action plan states (if deviation detected)
  const [hasDeviation, setHasDeviation] = useState(false);
  const [deviation, setDeviation] = useState("");
  const [proposedAction, setProposedAction] = useState("");
  const [priority, setPriority] = useState("Moyenne");
  const [actionResponsible, setActionResponsible] = useState("Qualité");
  const [dueDate, setDueDate] = useState(() => {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() + 14); // 2 weeks from now
    return dateLimit.toISOString().split("T")[0];
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [lastAuditResult, setLastAuditResult] = useState(null);

  // Sync selectedZoneId from parent if it changes
  useEffect(() => {
    if (selectedZoneId) {
      setZoneId(selectedZoneId);
      // Auto-set standard action responsible based on the zone manager's department
      const selectedZone = zones.find(z => z.id === selectedZoneId);
      if (selectedZone) {
        const match = selectedZone.manager.match(/\(([^)]+)\)/);
        if (match && match[1]) {
          setActionResponsible(match[1]);
        } else {
          setActionResponsible("Qualité");
        }
      }
    }
  }, [selectedZoneId]);

  // Handle changing selected zone
  const handleZoneChange = (id) => {
    setZoneId(id);
    setSelectedZoneId(id);
    const selectedZone = zones.find(z => z.id === id);
    if (selectedZone) {
      const match = selectedZone.manager.match(/\(([^)]+)\)/);
      if (match && match[1]) {
        setActionResponsible(match[1]);
      } else {
        setActionResponsible("Qualité");
      }
    }
  };

  // Notation criteria labels
  const scoresDescriptions = {
    0: "Non appliqué (Zéro effort)",
    1: "Très faible (Début embryonnaire)",
    2: "Partiellement appliqué (Incomplet)",
    3: "Acceptable (Niveau standard requis)",
    4: "Bon niveau (Bien maintenu)",
    5: "Excellent / maîtrisé (Modèle exemplaire)"
  };

  // Notation colors
  const getRatingColor = (val, isSelected) => {
    if (!isSelected) return "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100";
    if (val <= 1) return "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20";
    if (val <= 3) return "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20";
    return "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20";
  };

  const handleScoreChange = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  // Real-time score calculator
  const calculateRealTimeScore = () => {
    let total = 0;
    const maxTotal = checklist5S.length * 5;
    Object.keys(answers).forEach((qId) => {
      total += Number(answers[qId]) || 0;
    });
    return Math.round((total / maxTotal) * 100);
  };

  const realTimePercent = calculateRealTimeScore();

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = {
      zoneId,
      auditor,
      date,
      answers,
      comment: hasDeviation ? `Déviations signalées. ${deviation}` : "R.A.S. Zone propre et conforme aux exigences 5S.",
      deviation: hasDeviation ? deviation : "",
      proposedAction: hasDeviation ? proposedAction : "",
      priority: hasDeviation ? priority : "",
      actionResponsible: hasDeviation ? actionResponsible : "",
      dueDate: hasDeviation ? dueDate : ""
    };

    const newAudit = submitAudit(form);
    setLastAuditResult(newAudit);
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToDashboard = () => {
    setIsSuccess(false);
    setSelectedZoneId(null);
    setCurrentTab("dashboard");
  };

  // Group questions by pilier
  const piliersList = ["Sort", "Set in order", "Shine", "Standardize", "Sustain"];
  const pilierLabels = {
    "Sort": "1. Trier (Sort) — Éliminer l'inutile",
    "Set in order": "2. Ranger (Set in order) — Une place pour chaque chose",
    "Shine": "3. Nettoyer (Shine) — Nettoyage et inspection",
    "Standardize": "4. Standardiser (Standardize) — Définir et respecter les règles",
    "Sustain": "5. Maintenir (Sustain) — Audits et amélioration continue"
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-150 bg-white p-8 shadow-md text-center space-y-6 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto shadow-sm">
          <CheckCircle className="h-9 w-9" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Audit enregistré avec succès !</h2>
          <p className="text-sm text-slate-500">
            Les données de la zone <span className="font-bold text-slate-800">{lastAuditResult?.zoneName}</span> ont été recalculées et intégrées en temps réel.
          </p>
        </div>

        {/* Audit Results summary Card */}
        <div className="rounded-xl bg-slate-50 p-6 border border-slate-100 space-y-4 max-w-md mx-auto text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Score de la zone :</span>
            <span className={`px-3 py-1 rounded-lg text-sm font-extrabold text-white ${
              lastAuditResult?.score < 50 ? "bg-red-500" : lastAuditResult?.score <= 75 ? "bg-amber-500" : "bg-emerald-500"
            }`}>
              {lastAuditResult?.score}%
            </span>
          </div>

          <div className="border-t border-slate-200/60 pt-3 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">Auditeur :</span>
              <span className="font-bold text-slate-800">{lastAuditResult?.auditor}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">Date d'audit :</span>
              <span className="font-bold text-slate-800">{lastAuditResult?.date}</span>
            </div>
            {lastAuditResult?.deviation && (
              <div className="border-t border-slate-200/60 pt-2.5 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-600 uppercase block tracking-wider">Action corrective initiée :</span>
                <p className="text-xs font-bold text-slate-800">{lastAuditResult?.proposedAction}</p>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Responsable: <span className="font-semibold text-slate-800">{lastAuditResult?.actionResponsible || actionResponsible}</span></span>
                  <span className="text-slate-500 font-medium">Priorité: <span className="font-semibold text-red-600">{priority}</span></span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={handleBackToDashboard}
            className="w-full sm:w-auto rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800 cursor-pointer shadow-sm"
          >
            Retour au Dashboard
          </button>
          
          <button
            onClick={() => {
              setIsSuccess(false);
              setAnswers(() => {
                const initial = {};
                checklist5S.forEach((q) => {
                  initial[q.id] = 3;
                });
                return initial;
              });
              setHasDeviation(false);
              setDeviation("");
              setProposedAction("");
            }}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-transparent px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Nouvel audit de zone
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Simuler un Audit 5S Interne</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Saisissez les notes de 0 à 5 pour chacun des 5 piliers de la checklist industrielle 5S.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Metadata Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5">
            Informations d'Audit
          </h3>

          <div className="grid gap-4.5 grid-cols-1 md:grid-cols-3">
            {/* Zone Choice */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Zone à auditer *</label>
              <select
                required
                value={zoneId}
                onChange={(e) => handleZoneChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-semibold"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} (Actuel: {z.score}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Date d'audit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Date de l'audit *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-3 text-sm text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Auditeur */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Nom de l'auditeur *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="text"
                  value={auditor}
                  onChange={(e) => setAuditor(e.target.value)}
                  placeholder="Ex: M. Lassaad"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-3 text-sm text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time score floating visual indicator */}
        <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5 shadow-xs flex items-center justify-between gap-6 border-l-4 border-l-red-600">
          <div className="space-y-0.5">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-red-600" />
              <span>Calculateur de Score en Temps Réel</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Les notes sont automatiquement pondérées sur 5 pour calculer le score final de conformité en %.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Score estimé</span>
            <span className="text-3xl font-extrabold text-red-600 tracking-tight">{realTimePercent}%</span>
          </div>
        </div>

        {/* Step 2: 5S Checklist Questions */}
        <div className="space-y-6">
          {piliersList.map((pilier) => {
            const pilierQuestions = checklist5S.filter((q) => q.pilier === pilier);
            return (
              <div key={pilier} className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                {/* Pilier Header */}
                <div className="bg-slate-900 px-5 py-3.5 text-white">
                  <h4 className="text-sm font-bold tracking-wide">{pilierLabels[pilier]}</h4>
                </div>

                {/* Question List Table */}
                <div className="divide-y divide-slate-100">
                  {pilierQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Question text */}
                      <div className="flex gap-3 md:max-w-xl">
                        <span className="text-xs font-extrabold text-slate-400 bg-slate-100 rounded-md h-6 w-6 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-snug">{q.question}</p>
                          {/* Mini caption based on current score */}
                          <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                            Note actuelle: {answers[q.id]} / 5 — <span className="text-slate-500 font-medium italic">{scoresDescriptions[answers[q.id]]}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Scores buttons 0 to 5 */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {[0, 1, 2, 3, 4, 5].map((val) => {
                          const isSelected = answers[q.id] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleScoreChange(q.id, val)}
                              className={`h-8.5 w-8.5 rounded-full border text-xs font-extrabold transition-all cursor-pointer ${getRatingColor(val, isSelected)}`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step 3: Action plan initiator / Comments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Écarts & Actions Correctives (Optionnel)
            </h3>
            
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDeviation}
                onChange={(e) => setHasDeviation(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 h-4 w-4 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-700">Créer une action corrective ?</span>
            </label>
          </div>

          {hasDeviation ? (
            <div className="space-y-4 animate-slide-down">
              <div className="grid gap-4.5 grid-cols-1 md:grid-cols-2">
                {/* Écart constaté */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Écart constaté *</label>
                  <textarea
                    required={hasDeviation}
                    value={deviation}
                    onChange={(e) => setDeviation(e.target.value)}
                    rows={2}
                    placeholder="Décrivez précisément le problème constaté lors de l'audit..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                  />
                </div>

                {/* Action corrective proposée */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Action corrective proposée *</label>
                  <textarea
                    required={hasDeviation}
                    value={proposedAction}
                    onChange={(e) => setProposedAction(e.target.value)}
                    rows={2}
                    placeholder="Quelle action doit être mise en œuvre pour corriger cet écart ?"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4.5 grid-cols-1 md:grid-cols-3">
                {/* Responsable de l'action */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Département responsable *</label>
                  <input
                    required={hasDeviation}
                    type="text"
                    value={actionResponsible}
                    onChange={(e) => setActionResponsible(e.target.value)}
                    placeholder="Ex: Qualité, Maintenance, Magasinier"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                  />
                </div>

                {/* Priorité */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Priorité *</label>
                  <select
                    required={hasDeviation}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-semibold"
                  >
                    <option value="Faible">Faible</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                    <option value="Critique">Critique</option>
                  </select>
                </div>

                {/* Date limite */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Date limite de résolution *</label>
                  <input
                    required={hasDeviation}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-semibold"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Cochez la case ci-dessus si vous avez identifié des écarts à corriger afin d'alimenter automatiquement le Plan d'Action global.
            </p>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3.5 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => { setSelectedZoneId(null); setCurrentTab("dashboard"); }}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/10 hover:bg-red-700 transition cursor-pointer"
          >
            <ClipboardCheck className="h-4.5 w-4.5" />
            <span>Valider & Enregistrer l'Audit</span>
          </button>
        </div>
      </form>
    </div>
  );
}
