import React, { createContext, useContext, useState, useEffect } from "react";
import { initialZones, initialActions, checklist5S, historicalData } from "../data/mockData";

const AuditContext = createContext();

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error("useAudit must be used within an AuditProvider");
  }
  return context;
};

export const AuditProvider = ({ children }) => {
  // Load initial states from localStorage if they exist
  const [zones, setZones] = useState(() => {
    const local = localStorage.getItem("myc_5s_zones");
    if (local) {
      const parsed = JSON.parse(local);
      // Always sync manager field from initialZones so any update is reflected immediately
      return parsed.map((z) => {
        const init = initialZones.find((iz) => iz.id === z.id);
        return init ? { ...z, manager: init.manager } : z;
      });
    }
    return initialZones;
  });

  const [actions, setActions] = useState(() => {
    const local = localStorage.getItem("myc_5s_actions");
    return local ? JSON.parse(local) : initialActions;
  });

  const [audits, setAudits] = useState(() => {
    const local = localStorage.getItem("myc_5s_audits");
    return local ? JSON.parse(local) : [];
  });

  const [history, setHistory] = useState(() => {
    const local = localStorage.getItem("myc_5s_history");
    return local ? JSON.parse(local) : historicalData;
  });

  // Keep localStorage updated when states change
  useEffect(() => {
    localStorage.setItem("myc_5s_zones", JSON.stringify(zones));
  }, [zones]);

  useEffect(() => {
    localStorage.setItem("myc_5s_actions", JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem("myc_5s_audits", JSON.stringify(audits));
  }, [audits]);

  useEffect(() => {
    localStorage.setItem("myc_5s_history", JSON.stringify(history));
  }, [history]);

  // Check actions for late status based on current date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    let updated = false;
    const nextActions = actions.map((act) => {
      if (act.status !== "Clôturé" && act.status !== "En retard" && act.dueDate < today) {
        updated = true;
        return { ...act, status: "En retard" };
      }
      return act;
    });
    if (updated) {
      setActions(nextActions);
    }
  }, []);

  // Calculate dynamic KPIs
  const globalScore = Math.round(
    zones.reduce((sum, zone) => sum + zone.score, 0) / zones.length
  );

  const zonesAudited = zones.filter((z) => z.lastAuditDate).length;

  const actionsKPI = {
    total: actions.length,
    open: actions.filter((a) => a.status === "Ouvert").length,
    inProgress: actions.filter((a) => a.status === "En cours").length,
    closed: actions.filter((a) => a.status === "Clôturé").length,
    overdue: actions.filter((a) => a.status === "En retard").length,
  };

  // Find best and critical zones
  const sortedZones = [...zones].sort((a, b) => b.score - a.score);
  const bestZone = sortedZones[0];
  const criticalZone = sortedZones[sortedZones.length - 1];

  // Helper to submit a new audit
  const submitAudit = (auditForm) => {
    const {
      zoneId,
      auditor,
      date,
      answers, // Object like { question_id: score_0_to_5 }
      comment,
      deviation,
      proposedAction,
      priority,
      actionResponsible,
      dueDate,
    } = auditForm;

    // 1. Calculate scores by pilier
    const pilierScores = {
      Sort: { sum: 0, count: 0 },
      "Set in order": { sum: 0, count: 0 },
      Shine: { sum: 0, count: 0 },
      Standardize: { sum: 0, count: 0 },
      Sustain: { sum: 0, count: 0 },
    };

    checklist5S.forEach((q) => {
      const score = Number(answers[q.id]) || 0;
      const pilier = q.pilier;
      if (pilierScores[pilier]) {
        pilierScores[pilier].sum += score;
        pilierScores[pilier].count += 1;
      }
    });

    const calculatedPiliers = {};
    let totalScore = 0;
    let maxTotalScore = 0;

    Object.keys(pilierScores).forEach((pilier) => {
      const { sum, count } = pilierScores[pilier];
      calculatedPiliers[pilier] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
      totalScore += sum;
      maxTotalScore += count * 5;
    });

    // Score global in % for this audit
    const finalPercent = Math.round((totalScore / maxTotalScore) * 100);

    // 2. Update zones state
    const targetZone = zones.find((z) => z.id === zoneId);
    if (!targetZone) return;

    const updatedZones = zones.map((z) => {
      if (z.id === zoneId) {
        return {
          ...z,
          score: finalPercent,
          lastAuditDate: date,
          scoresByPilier: {
            sort: calculatedPiliers["Sort"],
            setInOrder: calculatedPiliers["Set in order"],
            shine: calculatedPiliers["Shine"],
            standardize: calculatedPiliers["Standardize"],
            sustain: calculatedPiliers["Sustain"],
          },
        };
      }
      return z;
    });
    setZones(updatedZones);

    // 3. If action is proposed, create a corrective action
    let newActionId = null;
    if (deviation && proposedAction) {
      newActionId = actions.length > 0 ? Math.max(...actions.map((a) => a.id)) + 1 : 1;
      const newAction = {
        id: newActionId,
        zoneId: targetZone.id,
        zoneName: targetZone.name,
        deviation,
        action: proposedAction,
        manager: actionResponsible || "Non assigné",
        priority: priority || "Moyenne",
        dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "Ouvert",
        progress: 0,
      };
      setActions((prev) => [newAction, ...prev]);

      // Update the zone open actions count
      const index = updatedZones.findIndex((z) => z.id === zoneId);
      if (index !== -1) {
        updatedZones[index].openActionsCount += 1;
        setZones([...updatedZones]);
      }
    }

    // 4. Save audit log
    const newAudit = {
      id: audits.length + 1,
      zoneId,
      zoneName: targetZone.name,
      auditor,
      date,
      score: finalPercent,
      scoresByPilier: calculatedPiliers,
      answers,
      comment,
      deviation,
      proposedAction,
      actionId: newActionId,
    };
    setAudits((prev) => [newAudit, ...prev]);

    // 5. Append/update monthly score history if current month matches
    // For demonstration, let's recalculate the history based on this new global score
    const newGlobalScore = Math.round(
      updatedZones.reduce((sum, zone) => sum + zone.score, 0) / updatedZones.length
    );
    
    // Update or append last element in history
    const updatedHistory = [...history];
    if (updatedHistory.length > 0) {
      updatedHistory[updatedHistory.length - 1].score = newGlobalScore;
    }
    setHistory(updatedHistory);

    return newAudit;
  };

  // Helper to update action corrective status or details
  const updateActionStatus = (actionId, status, progress) => {
    const nextActions = actions.map((act) => {
      if (act.id === actionId) {
        let finalProgress = progress;
        let finalStatus = status;

        if (status === "Clôturé") {
          finalProgress = 100;
        } else if (progress === 100) {
          finalStatus = "Clôturé";
        } else if (progress > 0 && progress < 100 && status === "Ouvert") {
          finalStatus = "En cours";
        }

        // Adjust openActionsCount in zones if it changed from non-closed to closed, or vice versa
        if (act.status !== "Clôturé" && finalStatus === "Clôturé") {
          setZones((prevZones) =>
            prevZones.map((z) =>
              z.id === act.zoneId ? { ...z, openActionsCount: Math.max(0, z.openActionsCount - 1) } : z
            )
          );
        } else if (act.status === "Clôturé" && finalStatus !== "Clôturé") {
          setZones((prevZones) =>
            prevZones.map((z) =>
              z.id === act.zoneId ? { ...z, openActionsCount: z.openActionsCount + 1 } : z
            )
          );
        }

        return { ...act, status: finalStatus, progress: finalProgress };
      }
      return act;
    });
    setActions(nextActions);
  };

  // Helper to add custom action
  const addAction = (actionData) => {
    const targetZone = zones.find((z) => z.id === actionData.zoneId);
    if (!targetZone) return;

    const newId = actions.length > 0 ? Math.max(...actions.map((a) => a.id)) + 1 : 1;
    const newAction = {
      id: newId,
      zoneId: actionData.zoneId,
      zoneName: targetZone.name,
      deviation: actionData.deviation,
      action: actionData.action,
      manager: actionData.manager,
      priority: actionData.priority,
      dueDate: actionData.dueDate,
      status: "Ouvert",
      progress: 0,
    };

    setActions((prev) => [newAction, ...prev]);

    // Update zone action count
    setZones((prevZones) =>
      prevZones.map((z) =>
        z.id === actionData.zoneId ? { ...z, openActionsCount: z.openActionsCount + 1 } : z
      )
    );
  };

  // Reset demo data to factory defaults
  const resetToDefault = () => {
    localStorage.removeItem("myc_5s_zones");
    localStorage.removeItem("myc_5s_actions");
    localStorage.removeItem("myc_5s_audits");
    localStorage.removeItem("myc_5s_history");
    setZones(initialZones);
    setActions(initialActions);
    setAudits([]);
    setHistory(historicalData);
  };

  return (
    <AuditContext.Provider
      value={{
        zones,
        actions,
        audits,
        history,
        globalScore,
        zonesAudited,
        actionsKPI,
        bestZone,
        criticalZone,
        submitAudit,
        updateActionStatus,
        addAction,
        resetToDefault,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};
