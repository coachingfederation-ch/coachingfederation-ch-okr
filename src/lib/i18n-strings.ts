import type { Locale } from "./i18n-shared";
import type { Pillar } from "./okr-schemas";

export type StringKey =
  // header / hero
  | "hero.eyebrow"
  | "hero.title"
  | "hero.subtitle"
  | "hero.pillarTitle"
  | "section.okrSets"
  | "hero.addOkrSet"
  | "auth.signInToEdit"
  | "auth.signOut"
  | "auth.editorAccess"
  | "auth.pageTitle"
  | "auth.pageSubtitle"
  | "auth.continueWithGoogle"
  | "auth.pleaseWait"
  | "auth.back"
  // sections
  | "section.objective"
  | "section.globalAlignment"
  | "section.keyResults"
  | "section.relatedInitiatives"
  | "section.alignmentTitle"
  | "section.alignmentIntro"
  | "section.alignmentPrimary"
  | "section.alignmentSecondary"
  | "section.alignmentCycleHint"
  | "section.alignmentPillar"
  | "section.alignmentHow"
  | "section.okrSets"
  // KR card
  | "kr.count.one"
  | "kr.count.other"
  | "kr.noDescription"
  | "kr.target"
  | "kr.lead"
  | "kr.openDetails"
  | "kr.number"
  | "kr.detailDescription"
  | "kr.deleteConfirm"
  | "kr.delete"
  // OKR
  | "okr.customer"
  | "okr.delete"
  | "okr.deleteConfirm"
  | "okr.noKeyResults"
  | "okr.addKeyResult"
  | "okr.addOkrSet"
  // initiative
  | "initiative.header"
  | "initiative.none"
  | "initiative.new"
  | "initiative.add"
  | "initiative.delete"
  // pillars
  | "pillar.SG.name"
  | "pillar.OE.name"
  | "pillar.CE.name"
  // nav
  | "nav.okrs"
  | "nav.initiatives"
  // initiative portfolio (kanban)
  | "initiatives.title"
  | "initiatives.subtitle"
  | "initiatives.filterAllOkrs"
  | "initiatives.filterAllKrs"
  | "initiatives.filterOkr"
  | "initiatives.filterKr"
  | "initiatives.owner"
  | "initiatives.description"
  | "initiatives.status"
  | "initiatives.emptyColumn"
  | "initiatives.addOwner"
  | "initiatives.addDescription"
  | "initiatives.status.planned"
  | "initiatives.status.in_progress"
  | "initiatives.status.done"
  | "initiatives.status.canceled"
  | "initiatives.new"
  | "initiatives.newTitle"
  | "initiatives.form.kr"
  | "initiatives.form.selectKr"
  | "initiatives.form.title"
  | "initiatives.form.titlePlaceholder"
  | "initiatives.form.owner"
  | "initiatives.form.ownerPlaceholder"
  | "initiatives.form.description"
  | "initiatives.form.descriptionPlaceholder"
  | "initiatives.form.status"
  | "initiatives.created"
  | "initiatives.editTitle"
  | "initiatives.editDescription"
  | "initiatives.updated"
  | "initiatives.deleted"
  | "initiatives.delete"
  | "initiatives.deleteConfirmTitle"
  | "initiatives.deleteConfirmBody"
  | "initiatives.open"
  | "common.cancel"
  | "common.create"
  | "common.creating"
  | "common.save"
  | "common.saving"
  | "common.delete"
  | "common.deleting"
  // misc
  | "tag.add"
  | "tag.remove"
  | "tag.none"
  | "common.loading"
  | "common.editValue"
  | "common.saveFailed"
  | "lang.switcher";


const en: Record<StringKey, string> = {
  "hero.eyebrow": "ICF Switzerland · OKR Dashboard",
  "hero.title": "2026 OKRs with Global Alignment",
  "hero.subtitle":
    "One inspiring, customer-centric objective per strategic pillar — aligned to the ICF Global Strategic Plan 2026–2029 and the Arbon board retreat, 1 June 2026.",
  "hero.pillarTitle": "ICF Strategic Focus Areas (SFAs) 2026",
  "hero.addOkrSet": "Add OKR set",
  "auth.signInToEdit": "Sign in to edit",
  "auth.signOut": "Sign out",
  "auth.editorAccess": "ICFS · Editor access",
  "auth.pageTitle": "Sign in to edit",
  "auth.pageSubtitle":
    "Anyone can view the dashboard. Sign in with your @coachingfederation.ch Google account to enable inline editing.",
  "auth.continueWithGoogle": "Continue with Google",
  "auth.pleaseWait": "Please wait…",
  "auth.back": "← Back to dashboard",
  "section.objective": "Objective",
  "section.globalAlignment": "Global alignment",
  "section.keyResults": "Key results",
  "section.relatedInitiatives": "Related projects & initiatives",
  "section.alignmentTitle": "Global alignment analysis",
  "section.alignmentIntro":
    "How each ICFS pillar contributes to the three ICF Global 2026–2029 focus areas.",
  "section.alignmentPrimary": "= primary contribution,",
  "section.alignmentSecondary": "= secondary contribution.",
  "section.alignmentCycleHint": "Click a dot cell to cycle none → secondary → primary.",
  "section.alignmentPillar": "ICFS pillar",
  "section.alignmentHow": "How it contributes",
  "section.okrSets": "ICF Switzerland OKR Sets",
  "kr.count.one": "initiative",
  "kr.count.other": "initiatives",
  "kr.noDescription": "No description",
  "kr.target": "Target",
  "kr.lead": "Lead",
  "kr.openDetails": "Open details →",
  "kr.number": "KR number",
  "kr.detailDescription": "Owned outcome and the projects that deliver it.",
  "kr.deleteConfirm": "Delete this key result and its initiatives?",
  "kr.delete": "Delete key result",
  "okr.customer": "Customer:",
  "okr.delete": "Delete OKR set",
  "okr.deleteConfirm": "Delete OKR set",
  "okr.noKeyResults": "No key results yet.",
  "okr.addKeyResult": "+ Add key result",
  "okr.addOkrSet": "Add OKR set",
  "initiative.header": "Initiative",
  "initiative.none": "No initiatives yet.",
  "initiative.new": "New project or initiative…",
  "initiative.add": "Add",
  "initiative.delete": "Delete initiative",
  "pillar.SG.name": "Sustainable Growth & Impact",
  "pillar.OE.name": "Org. Development & Excellence",
  "pillar.CE.name": "Coaching Excellence & Value",
  "tag.add": "Add tag",
  "tag.remove": "Remove",
  "tag.none": "No tags",
  "common.loading": "Loading…",
  "common.editValue": "Edit value",
  "common.saveFailed": "Save failed",
  "nav.okrs": "OKRs",
  "nav.initiatives": "Initiative Portfolio",
  "initiatives.title": "Initiative Portfolio",
  "initiatives.subtitle": "All initiatives across every OKR, grouped by status.",
  "initiatives.filterAllOkrs": "All OKRs",
  "initiatives.filterAllKrs": "All Key Results",
  "initiatives.filterOkr": "OKR",
  "initiatives.filterKr": "Key Result",
  "initiatives.owner": "Owner",
  "initiatives.description": "Description",
  "initiatives.status": "Status",
  "initiatives.emptyColumn": "No initiatives",
  "initiatives.addOwner": "Add owner…",
  "initiatives.addDescription": "Add a description…",
  "initiatives.status.planned": "Planned",
  "initiatives.status.in_progress": "In Progress",
  "initiatives.status.done": "Done",
  "initiatives.status.canceled": "Canceled",
  "initiatives.new": "+ New initiative",
  "initiatives.newTitle": "New initiative",
  "initiatives.form.kr": "Key Result",
  "initiatives.form.selectKr": "Select a Key Result",
  "initiatives.form.title": "Title",
  "initiatives.form.titlePlaceholder": "What is the initiative?",
  "initiatives.form.owner": "Owner",
  "initiatives.form.ownerPlaceholder": "Who owns it?",
  "initiatives.form.description": "Description",
  "initiatives.form.descriptionPlaceholder": "Add more context (optional)",
  "initiatives.form.status": "Status",
  "initiatives.created": "Initiative created",
  "common.cancel": "Cancel",
  "common.create": "Create",
  "common.creating": "Creating…",
  "lang.switcher": "Language",

};

const de: Record<StringKey, string> = {
  "hero.eyebrow": "ICF Schweiz · OKR-Dashboard",
  "hero.title": "OKRs 2026 mit globaler Ausrichtung",
  "hero.subtitle":
    "Ein inspirierendes, kundenorientiertes Ziel pro strategischer Säule — abgestimmt auf den ICF Global Strategic Plan 2026–2029 und die Vorstandsklausur in Arbon, 1. Juni 2026.",
  "hero.pillarTitle": "ICF Strategic Focus Areas (SFAs) 2026",
  "hero.addOkrSet": "OKR-Set hinzufügen",
  "auth.signInToEdit": "Anmelden zum Bearbeiten",
  "auth.signOut": "Abmelden",
  "auth.editorAccess": "ICFS · Redaktionszugang",
  "auth.pageTitle": "Anmelden zum Bearbeiten",
  "auth.pageSubtitle":
    "Das Dashboard ist öffentlich einsehbar. Melde dich mit deinem @coachingfederation.ch-Google-Konto an, um inline zu bearbeiten.",
  "auth.continueWithGoogle": "Mit Google fortfahren",
  "auth.pleaseWait": "Bitte warten…",
  "auth.back": "← Zurück zum Dashboard",
  "section.objective": "Objective",
  "section.globalAlignment": "Globale Ausrichtung",
  "section.keyResults": "Key Results",
  "section.relatedInitiatives": "Zugehörige Projekte & Initiativen",
  "section.alignmentTitle": "Analyse der globalen Ausrichtung",
  "section.alignmentIntro":
    "Wie jede ICFS-Säule zu den drei Schwerpunktbereichen von ICF Global 2026–2029 beiträgt.",
  "section.alignmentPrimary": "= primärer Beitrag,",
  "section.alignmentSecondary": "= sekundärer Beitrag.",
  "section.alignmentCycleHint":
    "Klicke auf eine Punktzelle, um zwischen kein → sekundär → primär zu wechseln.",
  "section.alignmentPillar": "ICFS-Säule",
  "section.alignmentHow": "Wie sie beiträgt",
  "section.okrSets": "ICF Switzerland OKR Sets",
  "kr.count.one": "Initiative",
  "kr.count.other": "Initiativen",
  "kr.noDescription": "Keine Beschreibung",
  "kr.target": "Ziel",
  "kr.lead": "Verantwortlich",
  "kr.openDetails": "Details öffnen →",
  "kr.number": "KR-Nummer",
  "kr.detailDescription":
    "Verantwortetes Ergebnis und die Projekte, die es liefern.",
  "kr.deleteConfirm": "Dieses Key Result und seine Initiativen löschen?",
  "kr.delete": "Key Result löschen",
  "okr.customer": "Kunde:",
  "okr.delete": "OKR-Set löschen",
  "okr.deleteConfirm": "OKR-Set löschen",
  "okr.noKeyResults": "Noch keine Key Results.",
  "okr.addKeyResult": "+ Key Result hinzufügen",
  "okr.addOkrSet": "OKR-Set hinzufügen",
  "initiative.header": "Initiative",
  "initiative.none": "Noch keine Initiativen.",
  "initiative.new": "Neues Projekt oder Initiative…",
  "initiative.add": "Hinzufügen",
  "initiative.delete": "Initiative löschen",
  "pillar.SG.name": "Nachhaltiges Wachstum & Wirkung",
  "pillar.OE.name": "Organisationsentwicklung & Exzellenz",
  "pillar.CE.name": "Coaching-Exzellenz & Mehrwert",
  "tag.add": "Tag hinzufügen",
  "tag.remove": "Entfernen",
  "tag.none": "Keine Tags",
  "common.loading": "Wird geladen…",
  "common.editValue": "Wert bearbeiten",
  "common.saveFailed": "Speichern fehlgeschlagen",
  "nav.okrs": "OKRs",
  "nav.initiatives": "Initiativen-Portfolio",
  "initiatives.title": "Initiativen-Portfolio",
  "initiatives.subtitle": "Alle Initiativen über alle OKRs hinweg, nach Status gruppiert.",
  "initiatives.filterAllOkrs": "Alle OKRs",
  "initiatives.filterAllKrs": "Alle Key Results",
  "initiatives.filterOkr": "OKR",
  "initiatives.filterKr": "Key Result",
  "initiatives.owner": "Verantwortlich",
  "initiatives.description": "Beschreibung",
  "initiatives.status": "Status",
  "initiatives.emptyColumn": "Keine Initiativen",
  "initiatives.addOwner": "Verantwortliche/n hinzufügen…",
  "initiatives.addDescription": "Beschreibung hinzufügen…",
  "initiatives.status.planned": "Geplant",
  "initiatives.status.in_progress": "In Arbeit",
  "initiatives.status.done": "Erledigt",
  "initiatives.status.canceled": "Abgebrochen",
  "initiatives.new": "+ Neue Initiative",
  "initiatives.newTitle": "Neue Initiative",
  "initiatives.form.kr": "Key Result",
  "initiatives.form.selectKr": "Key Result auswählen",
  "initiatives.form.title": "Titel",
  "initiatives.form.titlePlaceholder": "Worum geht die Initiative?",
  "initiatives.form.owner": "Verantwortlich",
  "initiatives.form.ownerPlaceholder": "Wer ist verantwortlich?",
  "initiatives.form.description": "Beschreibung",
  "initiatives.form.descriptionPlaceholder": "Mehr Kontext (optional)",
  "initiatives.form.status": "Status",
  "initiatives.created": "Initiative erstellt",
  "common.cancel": "Abbrechen",
  "common.create": "Erstellen",
  "common.creating": "Wird erstellt…",
  "lang.switcher": "Sprache",

};

const fr: Record<StringKey, string> = {
  "hero.eyebrow": "ICF Suisse · Tableau de bord OKR",
  "hero.title": "OKR 2026 avec alignement global",
  "hero.subtitle":
    "Un objectif inspirant et centré sur le client par pilier stratégique — aligné sur l'ICF Global Strategic Plan 2026–2029 et la retraite du conseil d'Arbon du 1er juin 2026.",
  "hero.pillarTitle": "Zones stratégiques de focus de l'ICF (SFAs) 2026",
  "hero.addOkrSet": "Ajouter un ensemble OKR",
  "auth.signInToEdit": "Se connecter pour éditer",
  "auth.signOut": "Se déconnecter",
  "auth.editorAccess": "ICFS · Accès éditeur",
  "auth.pageTitle": "Se connecter pour éditer",
  "auth.pageSubtitle":
    "Tout le monde peut consulter le tableau de bord. Connectez-vous avec votre compte Google @coachingfederation.ch pour activer l'édition en ligne.",
  "auth.continueWithGoogle": "Continuer avec Google",
  "auth.pleaseWait": "Veuillez patienter…",
  "auth.back": "← Retour au tableau de bord",
  "section.objective": "Objectif",
  "section.globalAlignment": "Alignement global",
  "section.keyResults": "Résultats clés",
  "section.relatedInitiatives": "Projets & initiatives associés",
  "section.alignmentTitle": "Analyse de l'alignement global",
  "section.alignmentIntro":
    "Comment chaque pilier ICFS contribue aux trois axes d'ICF Global 2026–2029.",
  "section.alignmentPrimary": "= contribution principale,",
  "section.alignmentSecondary": "= contribution secondaire.",
  "section.alignmentCycleHint":
    "Cliquez sur une cellule de point pour alterner aucun → secondaire → principal.",
  "section.alignmentPillar": "Pilier ICFS",
  "section.alignmentHow": "Comment il contribue",
  "section.okrSets": "OKR Sets ICF Suisse",
  "kr.count.one": "initiative",
  "kr.count.other": "initiatives",
  "kr.noDescription": "Aucune description",
  "kr.target": "Cible",
  "kr.lead": "Responsable",
  "kr.openDetails": "Voir les détails →",
  "kr.number": "Numéro KR",
  "kr.detailDescription": "Résultat piloté et projets qui le livrent.",
  "kr.deleteConfirm": "Supprimer ce résultat clé et ses initiatives ?",
  "kr.delete": "Supprimer le résultat clé",
  "okr.customer": "Client :",
  "okr.delete": "Supprimer l'ensemble OKR",
  "okr.deleteConfirm": "Supprimer l'ensemble OKR",
  "okr.noKeyResults": "Aucun résultat clé pour le moment.",
  "okr.addKeyResult": "+ Ajouter un résultat clé",
  "okr.addOkrSet": "Ajouter un ensemble OKR",
  "initiative.header": "Initiative",
  "initiative.none": "Aucune initiative pour le moment.",
  "initiative.new": "Nouveau projet ou initiative…",
  "initiative.add": "Ajouter",
  "initiative.delete": "Supprimer l'initiative",
  "pillar.SG.name": "Croissance durable & impact",
  "pillar.OE.name": "Développement organisationnel & excellence",
  "pillar.CE.name": "Excellence du coaching & valeur",
  "tag.add": "Ajouter une étiquette",
  "tag.remove": "Retirer",
  "tag.none": "Aucune étiquette",
  "common.loading": "Chargement…",
  "common.editValue": "Modifier la valeur",
  "common.saveFailed": "Échec de l'enregistrement",
  "nav.okrs": "OKR",
  "nav.initiatives": "Portefeuille d'initiatives",
  "initiatives.title": "Portefeuille d'initiatives",
  "initiatives.subtitle": "Toutes les initiatives, tous OKR confondus, regroupées par statut.",
  "initiatives.filterAllOkrs": "Tous les OKR",
  "initiatives.filterAllKrs": "Tous les résultats clés",
  "initiatives.filterOkr": "OKR",
  "initiatives.filterKr": "Résultat clé",
  "initiatives.owner": "Responsable",
  "initiatives.description": "Description",
  "initiatives.status": "Statut",
  "initiatives.emptyColumn": "Aucune initiative",
  "initiatives.addOwner": "Ajouter un responsable…",
  "initiatives.addDescription": "Ajouter une description…",
  "initiatives.status.planned": "Planifiée",
  "initiatives.status.in_progress": "En cours",
  "initiatives.status.done": "Terminée",
  "initiatives.status.canceled": "Annulée",
  "initiatives.new": "+ Nouvelle initiative",
  "initiatives.newTitle": "Nouvelle initiative",
  "initiatives.form.kr": "Résultat clé",
  "initiatives.form.selectKr": "Sélectionner un résultat clé",
  "initiatives.form.title": "Titre",
  "initiatives.form.titlePlaceholder": "Quelle est l'initiative ?",
  "initiatives.form.owner": "Responsable",
  "initiatives.form.ownerPlaceholder": "Qui en est responsable ?",
  "initiatives.form.description": "Description",
  "initiatives.form.descriptionPlaceholder": "Ajouter du contexte (facultatif)",
  "initiatives.form.status": "Statut",
  "initiatives.created": "Initiative créée",
  "common.cancel": "Annuler",
  "common.create": "Créer",
  "common.creating": "Création…",
  "lang.switcher": "Langue",

};

const it: Record<StringKey, string> = {
  "hero.eyebrow": "ICF Svizzera · Dashboard OKR",
  "hero.title": "OKR 2026 con allineamento globale",
  "hero.subtitle":
    "Un obiettivo ispiratore e centrato sul cliente per pilastro strategico — allineato all'ICF Global Strategic Plan 2026–2029 e al ritiro del board di Arbon del 1° giugno 2026.",
  "hero.pillarTitle": "Aree di focus strategiche ICF (SFAs) 2026",
  "hero.addOkrSet": "Aggiungi set OKR",
  "auth.signInToEdit": "Accedi per modificare",
  "auth.signOut": "Esci",
  "auth.editorAccess": "ICFS · Accesso editor",
  "auth.pageTitle": "Accedi per modificare",
  "auth.pageSubtitle":
    "Chiunque può consultare la dashboard. Accedi con il tuo account Google @coachingfederation.ch per abilitare la modifica in linea.",
  "auth.continueWithGoogle": "Continua con Google",
  "auth.pleaseWait": "Attendere…",
  "auth.back": "← Torna alla dashboard",
  "section.objective": "Obiettivo",
  "section.globalAlignment": "Allineamento globale",
  "section.keyResults": "Risultati chiave",
  "section.relatedInitiatives": "Progetti e iniziative correlati",
  "section.alignmentTitle": "Analisi dell'allineamento globale",
  "section.alignmentIntro":
    "Come ogni pilastro ICFS contribuisce alle tre aree di focus di ICF Global 2026–2029.",
  "section.alignmentPrimary": "= contributo primario,",
  "section.alignmentSecondary": "= contributo secondario.",
  "section.alignmentCycleHint":
    "Clicca su una cella di punto per alternare nessuno → secondario → primario.",
  "section.alignmentPillar": "Pilastro ICFS",
  "section.alignmentHow": "Come contribuisce",
  "section.okrSets": "OKR Sets ICF Svizzera",
  "kr.count.one": "iniziativa",
  "kr.count.other": "iniziative",
  "kr.noDescription": "Nessuna descrizione",
  "kr.target": "Target",
  "kr.lead": "Responsabile",
  "kr.openDetails": "Apri dettagli →",
  "kr.number": "Numero KR",
  "kr.detailDescription": "Risultato di cui si è responsabili e i progetti che lo realizzano.",
  "kr.deleteConfirm": "Eliminare questo risultato chiave e le sue iniziative?",
  "kr.delete": "Elimina risultato chiave",
  "okr.customer": "Cliente:",
  "okr.delete": "Elimina set OKR",
  "okr.deleteConfirm": "Elimina set OKR",
  "okr.noKeyResults": "Nessun risultato chiave ancora.",
  "okr.addKeyResult": "+ Aggiungi risultato chiave",
  "okr.addOkrSet": "Aggiungi set OKR",
  "initiative.header": "Iniziativa",
  "initiative.none": "Ancora nessuna iniziativa.",
  "initiative.new": "Nuovo progetto o iniziativa…",
  "initiative.add": "Aggiungi",
  "initiative.delete": "Elimina iniziativa",
  "pillar.SG.name": "Crescita sostenibile & impatto",
  "pillar.OE.name": "Sviluppo organizzativo & eccellenza",
  "pillar.CE.name": "Eccellenza del coaching & valore",
  "tag.add": "Aggiungi tag",
  "tag.remove": "Rimuovi",
  "tag.none": "Nessun tag",
  "common.loading": "Caricamento…",
  "common.editValue": "Modifica valore",
  "common.saveFailed": "Salvataggio non riuscito",
  "nav.okrs": "OKR",
  "nav.initiatives": "Portfolio iniziative",
  "initiatives.title": "Portfolio iniziative",
  "initiatives.subtitle": "Tutte le iniziative di tutti gli OKR, raggruppate per stato.",
  "initiatives.filterAllOkrs": "Tutti gli OKR",
  "initiatives.filterAllKrs": "Tutti i risultati chiave",
  "initiatives.filterOkr": "OKR",
  "initiatives.filterKr": "Risultato chiave",
  "initiatives.owner": "Responsabile",
  "initiatives.description": "Descrizione",
  "initiatives.status": "Stato",
  "initiatives.emptyColumn": "Nessuna iniziativa",
  "initiatives.addOwner": "Aggiungi responsabile…",
  "initiatives.addDescription": "Aggiungi una descrizione…",
  "initiatives.status.planned": "Pianificata",
  "initiatives.status.in_progress": "In corso",
  "initiatives.status.done": "Completata",
  "initiatives.status.canceled": "Annullata",
  "initiatives.new": "+ Nuova iniziativa",
  "initiatives.newTitle": "Nuova iniziativa",
  "initiatives.form.kr": "Risultato chiave",
  "initiatives.form.selectKr": "Seleziona un risultato chiave",
  "initiatives.form.title": "Titolo",
  "initiatives.form.titlePlaceholder": "Qual è l'iniziativa?",
  "initiatives.form.owner": "Responsabile",
  "initiatives.form.ownerPlaceholder": "Chi è responsabile?",
  "initiatives.form.description": "Descrizione",
  "initiatives.form.descriptionPlaceholder": "Aggiungi contesto (opzionale)",
  "initiatives.form.status": "Stato",
  "initiatives.created": "Iniziativa creata",
  "common.cancel": "Annulla",
  "common.create": "Crea",
  "common.creating": "Creazione…",
  "lang.switcher": "Lingua",

};

export const STRINGS: Record<Locale, Record<StringKey, string>> = {
  en,
  de,
  fr,
  it,
};

export function pillarName(locale: Locale, code: Pillar): string {
  return STRINGS[locale][`pillar.${code}.name` as StringKey];
}
