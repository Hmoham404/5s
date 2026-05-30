import { useState } from "react";
import {
  Download,
  Calendar,
  User,
  CheckCircle,
  MapPin,
  PenTool,
  Award
} from "lucide-react";
import { useAudit } from "../context/AuditContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Report() {
  const { zones, actions, audits } = useAudit();
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || "");
  const [isExporting, setIsExporting] = useState(false);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  // Find the last audit log for this zone
  const zoneAudits = audits.filter((a) => a.zoneId === selectedZoneId);
  const lastAuditLog = zoneAudits[0] || null; // Audits list is pre-sorted with latest first

  // Actions for this zone
  const zoneActions = actions.filter((a) => a.zoneId === selectedZoneId);

  // Default values if no audit completed yet
  const auditorName = lastAuditLog?.auditor || "Auditeur Qualité Interne";
  const auditDate = lastAuditLog?.date || selectedZone?.lastAuditDate || new Date().toISOString().split("T")[0];
  const auditScore = selectedZone?.score || 50;

  const pilierLabels = [
    { key: "sort", name: "Trier (Sort)", desc: "Éliminer les objets inutiles" },
    { key: "setInOrder", name: "Ranger (Set in Order)", desc: "Définir un emplacement identifié" },
    { key: "shine", name: "Nettoyer (Shine)", desc: "Assurer la propreté et inspecter" },
    { key: "standardize", name: "Standardiser (Standardize)", desc: "Formaliser les bonnes pratiques" },
    { key: "sustain", name: "Maintenir (Sustain)", desc: "Suivre et pérenniser les standards" }
  ];

  const handleExportPDF = async () => {
    const reportElem = document.getElementById("pdf-report-content");
    if (!reportElem) return;

    setIsExporting(true);
    
    try {
      // Use html2canvas to capture the element as a high quality image
      const canvas = await html2canvas(reportElem, {
        scale: 2, // High resolution scaling
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Calculate image height based on width ratio
      const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add to PDF page by page if content exceeds A4 height
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const safeZoneName = (selectedZone?.name || "zone").replace(/[^a-z0-9]/gi, "_").toLowerCase();
      pdf.save(`Rapport_5S_MYC_${safeZoneName}_${auditDate}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF", error);
      alert("Une erreur s'est produite lors de la génération du PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Rapports d'Audit PDF</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Générez des rapports officiels au format A4 prêts pour l'impression pour chacun de vos audits de zone.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-red-500 focus:outline-none transition-all font-bold"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:bg-slate-400 transition cursor-pointer shadow-md shadow-red-600/10"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? "Génération..." : "Exporter en PDF"}</span>
          </button>
        </div>
      </div>

      {/* Main printable paper container (A4 layout in browser) */}
      <div className="flex justify-center bg-slate-100/40 p-4 border border-slate-200/50 rounded-2xl overflow-x-auto">
        {/* Absolute A4 element styling */}
        <div
          id="pdf-report-content"
          className="pdf-container shadow-lg border border-slate-200 rounded-lg text-slate-800 text-xs shrink-0 select-text"
        >
          {/* A4 Content Wrapper */}
          <div className="space-y-7">
            {/* 1. Header with brand colors */}
            <div className="flex items-center justify-between border-b-4 border-red-600 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                  <img
                    src="/logo MYC.jpeg"
                    alt="MYC Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-base font-extrabold tracking-tight text-slate-900 uppercase">MYC Innovation</h1>
                  <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block">Monastir, Tunisie</span>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">Rapport d'Audit 5S</h2>
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Usage Interne</span>
              </div>
            </div>

            {/* 2. Metadata details block */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-150 text-[11px] font-semibold text-slate-600">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Zone auditée</span>
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <MapPin className="h-3.5 w-3.5 text-red-600" />
                  <span>{selectedZone?.name}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Auditeur</span>
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>{auditorName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Date d'audit</span>
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>{auditDate}</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Score Global</span>
                <span className={`inline-block rounded px-2.5 py-0.5 text-sm font-extrabold text-white mt-0.5 ${
                  auditScore < 50 ? "bg-red-500" : auditScore <= 75 ? "bg-amber-500" : "bg-emerald-500"
                }`}>
                  {auditScore}%
                </span>
              </div>
            </div>

            {/* 3. Description sentence */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1">
                <Award className="h-4 w-4 text-slate-500" />
                <span>Synthèse de conformité</span>
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Cet audit 5S s'inscrit dans le cadre de la démarche d'excellence opérationnelle et de lean manufacturing de la société **MYC Innovation Monastir**. Il permet d'évaluer les piliers fondamentaux de la propreté, du rangement, de la sécurité et de la standardisation de la zone **{selectedZone?.name}**.
              </p>
            </div>

            {/* 4. Score breakdown by Pilier */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                Scores détaillés par Pilier (sur 5)
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-slate-900 text-slate-100 font-bold uppercase tracking-wider">
                      <th className="p-2.5">N°</th>
                      <th className="p-2.5">Pilier 5S</th>
                      <th className="p-2.5">Description opérationnelle</th>
                      <th className="p-2.5 text-center">Score</th>
                      <th className="p-2.5 w-44">Jauge de conformité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pilierLabels.map((p, idx) => {
                      const score = selectedZone?.scoresByPilier[p.key] || 0.0;
                      const percent = (score / 5) * 100;
                      
                      let barColor = "bg-emerald-500";
                      if (percent < 50) barColor = "bg-red-500";
                      else if (percent <= 75) barColor = "bg-amber-500";

                      return (
                        <tr key={p.key} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-2.5 font-bold text-slate-800">{p.name}</td>
                          <td className="p-2.5 font-medium text-slate-500">{p.desc}</td>
                          <td className="p-2.5 text-center font-bold text-slate-800">{score.toFixed(1)} / 5</td>
                          <td className="p-2.5">
                            <div className="h-2 w-full bg-slate-150 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Detected Deviations & Corrective actions */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                Écarts & Plan d'Action Corrective associé
              </h3>
              
              {zoneActions.length > 0 ? (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-slate-900 text-slate-100 font-bold uppercase tracking-wider">
                        <th className="p-2.5 w-10 text-center">ID</th>
                        <th className="p-2.5">Écart constaté</th>
                        <th className="p-2.5">Action corrective définie</th>
                        <th className="p-2.5 w-24">Département</th>
                        <th className="p-2.5 w-20">Échéance</th>
                        <th className="p-2.5 w-18 text-center">Priorité</th>
                        <th className="p-2.5 w-18 text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {zoneActions.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 text-center font-bold text-slate-400">#{act.id}</td>
                          <td className="p-2.5 font-bold text-slate-800 leading-snug">{act.deviation}</td>
                          <td className="p-2.5 font-medium text-slate-600 leading-snug">{act.action}</td>
                          <td className="p-2.5 font-semibold text-slate-500">{act.manager}</td>
                          <td className="p-2.5 font-medium text-slate-500">{act.dueDate}</td>
                          <td className="p-2.5 text-center">
                            <span className={`inline-block rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase ${
                              act.priority === "Critique" || act.priority === "Haute"
                                ? "bg-red-500 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {act.priority}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="font-extrabold uppercase text-[8px]">
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg bg-emerald-50/40 border border-emerald-100 p-4 text-center text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>Aucun écart critique relevé sur cette zone. Standard de conformité 100% respecté.</span>
                </div>
              )}
            </div>

            {/* 6. Signatures blocks */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-[10px] font-bold text-slate-500">
              <div className="border-t border-dashed border-slate-300 pt-3 space-y-8">
                <span>Signature de l'auditeur</span>
                <div className="h-10 text-slate-300 font-normal italic flex items-end">
                  <PenTool className="h-3.5 w-3.5 mr-1" />
                  <span>{auditorName}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-3 space-y-8 text-right">
                <span>Signature du responsable de zone ({selectedZone?.manager.split(" ")[1] || "Responsable"})</span>
                <div className="h-10 text-slate-300 font-normal italic flex items-end justify-end">
                  <span>Approbation pour action</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
