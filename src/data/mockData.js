export const initialZones = [
  {
    id: "injection",
    name: "Injection",
    manager: "DG Sami Ladjimi",
    score: 72,
    lastAuditDate: "2026-05-15",
    openActionsCount: 1,
    scoresByPilier: {
      sort: 3.8,
      setInOrder: 3.6,
      shine: 3.5,
      standardize: 3.7,
      sustain: 3.4
    }
  },
  {
    id: "soudure",
    name: "Soudure",
    manager: "DG Sami Ladjimi",
    score: 64,
    lastAuditDate: "2026-05-12",
    openActionsCount: 0,
    scoresByPilier: {
      sort: 3.2,
      setInOrder: 3.1,
      shine: 3.3,
      standardize: 3.2,
      sustain: 3.2
    }
  },
  {
    id: "metallisation",
    name: "Métallisation",
    manager: "DG Sami Ladjimi",
    score: 58,
    lastAuditDate: "2026-05-10",
    openActionsCount: 0,
    scoresByPilier: {
      sort: 3.0,
      setInOrder: 2.8,
      shine: 3.0,
      standardize: 2.9,
      sustain: 2.8
    }
  },
  {
    id: "assemblage",
    name: "Assemblage",
    manager: "DG Sami Ladjimi",
    score: 70,
    lastAuditDate: "2026-05-18",
    openActionsCount: 0,
    scoresByPilier: {
      sort: 3.6,
      setInOrder: 3.5,
      shine: 3.4,
      standardize: 3.5,
      sustain: 3.5
    }
  },
  {
    id: "packaging",
    name: "Packaging",
    manager: "DG Sami Ladjimi",
    score: 67,
    lastAuditDate: "2026-05-14",
    openActionsCount: 0,
    scoresByPilier: {
      sort: 3.4,
      setInOrder: 3.3,
      shine: 3.4,
      standardize: 3.3,
      sustain: 3.3
    }
  },
  {
    id: "magasin_matiere",
    name: "Magasin matière",
    manager: "DG Sami Ladjimi",
    score: 52,
    lastAuditDate: "2026-05-08",
    openActionsCount: 1,
    scoresByPilier: {
      sort: 2.8,
      setInOrder: 2.5,
      shine: 2.7,
      standardize: 2.5,
      sustain: 2.5
    }
  },
  {
    id: "magasin_produit_fini",
    name: "Magasin produit fini",
    manager: "DG Sami Ladjimi",
    score: 55,
    lastAuditDate: "2026-05-09",
    openActionsCount: 0,
    scoresByPilier: {
      sort: 2.9,
      setInOrder: 2.7,
      shine: 2.8,
      standardize: 2.7,
      sustain: 2.6
    }
  },
  {
    id: "qualite",
    name: "Qualité",
    manager: "DG Sami Ladjimi",
    score: 78,
    lastAuditDate: "2026-05-20",
    openActionsCount: 1,
    scoresByPilier: {
      sort: 4.1,
      setInOrder: 3.9,
      shine: 4.0,
      standardize: 3.8,
      sustain: 3.7
    }
  },
  {
    id: "maintenance",
    name: "Maintenance",
    manager: "DG Sami Ladjimi",
    score: 61,
    lastAuditDate: "2026-05-11",
    openActionsCount: 1,
    scoresByPilier: {
      sort: 3.1,
      setInOrder: 3.0,
      shine: 3.2,
      standardize: 3.0,
      sustain: 2.9
    }
  },
  {
    id: "administration",
    name: "Administration",
    manager: "DG Sami Ladjimi",
    score: 74,
    lastAuditDate: "2026-05-21",
    openActionsCount: 0,
    scoresByPilier: {
      sort: 3.8,
      setInOrder: 3.7,
      shine: 3.7,
      standardize: 3.6,
      sustain: 3.7
    }
  },
  {
    id: "bureaux",
    name: "Bureaux",
    manager: "DG Sami Ladjimi",
    score: 76,
    lastAuditDate: "2026-05-19",
    openActionsCount: 0,
    scoresByPilier: {
      sort: 3.9,
      setInOrder: 3.8,
      shine: 3.8,
      standardize: 3.8,
      sustain: 3.7
    }
  },
  {
    id: "dossiers_reseau_qualite",
    name: "Dossiers réseau qualité",
    manager: "DG Sami Ladjimi",
    score: 49,
    lastAuditDate: "2026-05-16",
    openActionsCount: 1,
    scoresByPilier: {
      sort: 2.5,
      setInOrder: 2.3,
      shine: 2.5,
      standardize: 2.5,
      sustain: 2.4
    }
  }
];

export const initialActions = [
  {
    id: 1,
    zoneId: "dossiers_reseau_qualite",
    zoneName: "Dossiers réseau qualité",
    deviation: "Documents non classés correctement",
    action: "Réorganiser les dossiers par département et version",
    manager: "Qualité",
    priority: "Critique",
    dueDate: "2026-06-05",
    status: "En retard",
    progress: 20
  },
  {
    id: 2,
    zoneId: "magasin_matiere",
    zoneName: "Magasin matière",
    deviation: "Emplacements non identifiés",
    action: "Ajouter étiquettes et codification des zones",
    manager: "Magasinier",
    priority: "Haute",
    dueDate: "2026-06-15",
    status: "En cours",
    progress: 60
  },
  {
    id: 3,
    zoneId: "injection",
    zoneName: "Injection",
    deviation: "Certains outils sans emplacement défini",
    action: "Créer shadow board pour les outils",
    manager: "Production",
    priority: "Moyenne",
    dueDate: "2026-06-25",
    status: "Ouvert",
    progress: 0
  },
  {
    id: 4,
    zoneId: "maintenance",
    zoneName: "Maintenance",
    deviation: "Pièces de rechange non organisées",
    action: "Classer les pièces par famille et criticité",
    manager: "Maintenance",
    priority: "Haute",
    dueDate: "2026-06-20",
    status: "En cours",
    progress: 40
  },
  {
    id: 5,
    zoneId: "qualite",
    zoneName: "Qualité",
    deviation: "Anciennes versions de documents visibles",
    action: "Supprimer ou archiver les versions obsolètes",
    manager: "Qualité",
    priority: "Critique",
    dueDate: "2026-05-30",
    status: "Ouvert",
    progress: 10
  }
];

export const checklist5S = [
  // Sort / Trier
  {
    id: "sort_1",
    pilier: "Sort",
    label: "Sort / Trier",
    question: "Les objets inutiles sont-ils éliminés ?"
  },
  {
    id: "sort_2",
    pilier: "Sort",
    label: "Sort / Trier",
    question: "Les produits non conformes sont-ils séparés ?"
  },
  {
    id: "sort_3",
    pilier: "Sort",
    label: "Sort / Trier",
    question: "Les documents obsolètes sont-ils retirés ?"
  },
  // Set in Order / Ranger
  {
    id: "order_1",
    pilier: "Set in order",
    label: "Set in Order / Ranger",
    question: "Chaque outil a-t-il une place définie ?"
  },
  {
    id: "order_2",
    pilier: "Set in order",
    label: "Set in Order / Ranger",
    question: "Les emplacements sont-ils identifiés ?"
  },
  {
    id: "order_3",
    pilier: "Set in order",
    label: "Set in Order / Ranger",
    question: "Les bacs et produits sont-ils étiquetés ?"
  },
  // Shine / Nettoyer
  {
    id: "shine_1",
    pilier: "Shine",
    label: "Shine / Nettoyer",
    question: "La zone est-elle propre ?"
  },
  {
    id: "shine_2",
    pilier: "Shine",
    label: "Shine / Nettoyer",
    question: "Le sol est-il dégagé ?"
  },
  {
    id: "shine_3",
    pilier: "Shine",
    label: "Shine / Nettoyer",
    question: "Les machines sont-elles propres ?"
  },
  {
    id: "shine_4",
    pilier: "Shine",
    label: "Shine / Nettoyer",
    question: "Les anomalies sont-elles visibles ?"
  },
  // Standardize / Standardiser
  {
    id: "standardize_1",
    pilier: "Standardize",
    label: "Standardize / Standardiser",
    question: "Les standards sont-ils affichés ?"
  },
  {
    id: "standardize_2",
    pilier: "Standardize",
    label: "Standardize / Standardiser",
    question: "Les instructions de travail sont-elles disponibles ?"
  },
  {
    id: "standardize_3",
    pilier: "Standardize",
    label: "Standardize / Standardiser",
    question: "Le marquage au sol est-il respecté ?"
  },
  {
    id: "standardize_4",
    pilier: "Standardize",
    label: "Standardize / Standardiser",
    question: "Les documents utilisés sont-ils à jour ?"
  },
  // Sustain / Maintenir
  {
    id: "sustain_1",
    pilier: "Sustain",
    label: "Sustain / Maintenir",
    question: "Les audits sont-ils réalisés régulièrement ?"
  },
  {
    id: "sustain_2",
    pilier: "Sustain",
    label: "Sustain / Maintenir",
    question: "Les actions correctives sont-elles suivies ?"
  },
  {
    id: "sustain_3",
    pilier: "Sustain",
    label: "Sustain / Maintenir",
    question: "Les responsables respectent-ils les standards ?"
  },
  {
    id: "sustain_4",
    pilier: "Sustain",
    label: "Sustain / Maintenir",
    question: "Les écarts précédents sont-ils clôturés ?"
  }
];

export const historicalData = [
  { month: "Jan", score: 62 },
  { month: "Fév", score: 64 },
  { month: "Mar", score: 65 },
  { month: "Avr", score: 67 },
  { month: "Mai", score: 68 }
];
