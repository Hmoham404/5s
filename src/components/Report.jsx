import { useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle,
  Download,
  MapPin,
  PenTool,
  User,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAudit } from "../context/AuditContext";
import { useTranslation } from "../context/TranslationContext";

export default function Report() {
  const { zones, actions, audits } = useAudit();
  const { t, getZoneName, getPillarLabel, getPriorityLabel, getStatusLabel, formatDate } = useTranslation();
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || "");
  const [isExporting, setIsExporting] = useState(false);

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId);
  const zoneAudits = audits.filter((audit) => audit.zoneId === selectedZoneId);
  const lastAuditLog = zoneAudits[0] || null;
  const zoneActions = actions.filter((action) => action.zoneId === selectedZoneId);

  const auditorName = lastAuditLog?.auditor || t("report.auditor");
  const auditDate =
    lastAuditLog?.date ||
    selectedZone?.lastAuditDate ||
    new Date().toISOString().split("T")[0];
  const auditScore = selectedZone?.score || 50;

  const pilierLabels = ["sort", "setInOrder", "shine", "standardize", "sustain"];

  const handleExportPDF = async () => {
    const reportElem = document.getElementById("pdf-report-content");
    if (!reportElem) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportElem, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const safeZoneName = (selectedZone?.name || "zone")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      pdf.save(`Rapport_5S_MYC_${safeZoneName}_${auditDate}.pdf`);
    } catch (error) {
      console.error("PDF generation error", error);
      alert("PDF generation failed.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t("report.title")}</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {t("report.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedZoneId}
            onChange={(event) => setSelectedZoneId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 transition-all focus:border-red-500 focus:outline-none"
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {getZoneName(zone)}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/10 transition hover:bg-red-700 disabled:bg-slate-400"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? t("report.exporting") : t("report.export")}</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto rounded-2xl border border-slate-200/50 bg-slate-100/40 p-4">
        <div
          id="pdf-report-content"
          className="pdf-container shrink-0 select-text rounded-lg border border-slate-200 text-xs text-slate-800 shadow-lg"
        >
          <div className="space-y-7">
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
                  <h1 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
                    MYC Innovation
                  </h1>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-red-600">
                    {t("sidebar.location")}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
                  {t("report.title")}
                </h2>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t("report.internalUse")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-150 bg-slate-50 p-4 text-[11px] font-semibold text-slate-600 md:grid-cols-4">
              <div className="space-y-1">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {t("report.auditedZone")}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <MapPin className="h-3.5 w-3.5 text-red-600" />
                  <span>{getZoneName(selectedZone)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {t("report.auditor")}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>{auditorName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {t("report.auditDate")}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>{formatDate(auditDate)}</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {t("report.globalScore")}
                </span>
                <span
                  className={`mt-0.5 inline-block rounded px-2.5 py-0.5 text-sm font-extrabold text-white ${
                    auditScore < 50
                      ? "bg-red-500"
                      : auditScore <= 75
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                >
                  {auditScore}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="flex items-center gap-1 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Award className="h-4 w-4 text-slate-500" />
                <span>{t("report.summary")}</span>
              </h3>
              <p className="text-[11px] font-medium leading-relaxed text-slate-500">
                {t("report.summaryText", {
                  company: "MYC Innovation Monastir",
                  zone: getZoneName(selectedZone),
                })}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                {t("report.detailedScores")}
              </h3>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-left text-[10px]">
                  <thead>
                    <tr className="bg-slate-900 font-bold uppercase tracking-wider text-slate-100">
                      <th className="p-2.5">No</th>
                      <th className="p-2.5">5S</th>
                      <th className="p-2.5">{t("report.operationalDescription")}</th>
                      <th className="p-2.5 text-center">Score</th>
                      <th className="w-44 p-2.5">{t("report.complianceGauge")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pilierLabels.map((pilier, index) => {
                      const score = selectedZone?.scoresByPilier[pilier] || 0;
                      const percent = (score / 5) * 100;

                      let barColor = "bg-emerald-500";
                      if (percent < 50) barColor = "bg-red-500";
                      else if (percent <= 75) barColor = "bg-amber-500";

                      return (
                        <tr key={pilier} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-bold text-slate-400">{index + 1}</td>
                          <td className="p-2.5 font-bold text-slate-800">{getPillarLabel(pilier, "report")}</td>
                          <td className="p-2.5 font-medium text-slate-500">{getPillarLabel(pilier, "desc")}</td>
                          <td className="p-2.5 text-center font-bold text-slate-800">
                            {score.toFixed(1)} / 5
                          </td>
                          <td className="p-2.5">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full ${barColor}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                {t("report.deviationsPlan")}
              </h3>

              {zoneActions.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full border-collapse text-left text-[10px]">
                    <thead>
                      <tr className="bg-slate-900 font-bold uppercase tracking-wider text-slate-100">
                        <th className="w-10 p-2.5 text-center">ID</th>
                        <th className="p-2.5">{t("actionPlan.deviation")}</th>
                        <th className="p-2.5">{t("actionPlan.action")}</th>
                        <th className="w-24 p-2.5">{t("actionPlan.manager")}</th>
                        <th className="w-20 p-2.5">{t("actionPlan.dueDate")}</th>
                        <th className="w-18 p-2.5 text-center">{t("actionPlan.headers.priority")}</th>
                        <th className="w-18 p-2.5 text-center">{t("actionPlan.headers.status")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {zoneActions.map((action) => (
                        <tr key={action.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 text-center font-bold text-slate-400">#{action.id}</td>
                          <td className="p-2.5 font-bold leading-snug text-slate-800">{action.deviation}</td>
                          <td className="p-2.5 font-medium leading-snug text-slate-600">{action.action}</td>
                          <td className="p-2.5 font-semibold text-slate-500">{action.manager}</td>
                          <td className="p-2.5 font-medium text-slate-500">{formatDate(action.dueDate)}</td>
                          <td className="p-2.5 text-center">
                            <span
                              className={`inline-block rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase ${
                                action.priority === "Critique" || action.priority === "Haute"
                                  ? "bg-red-500 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {getPriorityLabel(action.priority)}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="text-[8px] font-extrabold uppercase">{getStatusLabel(action.status)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/40 p-4 text-center text-[10px] font-bold text-emerald-700">
                  <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
                  <span>{t("report.noDeviation")}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 text-[10px] font-bold text-slate-500">
              <div className="space-y-8 border-t border-dashed border-slate-300 pt-3">
                <span>{t("report.signatureAuditor")}</span>
                <div className="flex h-10 items-end text-slate-300 italic">
                  <PenTool className="mr-1 h-3.5 w-3.5" />
                  <span>{auditorName}</span>
                </div>
              </div>

              <div className="space-y-8 border-t border-dashed border-slate-300 pt-3 text-right">
                <span>
                  {t("report.signatureManager")} ({selectedZone?.manager?.split(" ")[1] || t("common.responsible")})
                </span>
                <div className="flex h-10 items-end justify-end text-slate-300 italic">
                  <span>{t("report.approval")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
