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
  | "section.secondaryInitiatives"
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
  | "kr.deleteConfirmBody"
  | "kr.delete"
  // OKR
  | "okr.customer"
  | "okr.delete"
  | "okr.deleteConfirm"
  | "okr.deleteConfirmBody"
  | "okr.noKeyResults"
  | "okr.addKeyResult"
  | "okr.addOkrSet"
  // initiative
  | "initiative.header"
  | "initiative.none"
  | "initiative.new"
  | "initiative.add"
  | "initiative.delete"
  | "initiative.secondary"
  | "initiative.secondaryFrom"
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
  | "initiatives.form.secondaryKrs"
  | "initiatives.form.addSecondaryKr"
  | "initiatives.form.noSecondaryKrs"
  | "initiatives.form.removeSecondaryKr"
  | "initiatives.form.searchKr"
  | "initiative.link"
  | "initiative.linkDialog.title"
  | "initiative.linkDialog.description"
  | "initiative.linkDialog.search"
  | "initiative.linkDialog.empty"
  | "initiative.linkDialog.role.none"
  | "initiative.linkDialog.role.secondary"
  | "initiative.linkDialog.role.primary"
  | "initiative.linkDialog.primaryHint"
  | "initiative.linkDialog.primaryLocked"
  | "initiative.unlinkSecondary"
  | "initiative.createInPortfolio"
  | "initiative.linksUpdated"
  | "initiatives.view.label"
  | "initiatives.view.board"
  | "initiatives.view.volunteer"
  | "volunteer.openLead"
  | "volunteer.group.lead"
  | "volunteer.group.helpers"
  | "volunteer.group.skill"
  | "volunteer.group.unscoped"
  | "volunteer.blocked"
  | "volunteer.parked"
  | "volunteer.blockedEmpty"
  | "volunteer.parkedEmpty"
  | "volunteer.lastUpdated"
  | "volunteer.scopeMissing"
  | "volunteer.noReason"
  | "volunteer.empty"
  | "volunteer.groupEmpty"
  | "initiative.availability.open"
  | "initiative.availability.blocked"
  | "initiative.availability.parked"
  | "initiative.commitment.one_off"
  | "initiative.commitment.recurring"
  | "initiative.commitment.workstream"
  | "initiative.helpNeeded.lead"
  | "initiative.helpNeeded.helpers"
  | "initiative.helpNeeded.skill"
  | "initiatives.form.availability"
  | "initiatives.form.blockedReason"
  | "initiatives.form.blockedReasonPlaceholder"
  | "initiatives.form.commitment"
  | "initiatives.form.helpNeeded"
  | "initiatives.form.skillNote"
  | "initiatives.form.skillNotePlaceholder"
  | "initiatives.form.unspecified"
  | "initiatives.form.helpersOwnerHint"
  | "initiatives.form.availabilityHint"



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
  | "lang.switcher"
  | "banner.baselining"
  | "scorecard.title"
  | "scorecard.instrument"
  | "scorecard.baseline"
  | "scorecard.current"
  | "scorecard.of"
  | "kr.baseline2026"
  | "kr.current"
  | "kr.target2027"
  | "kr.baselinePending"
  | "kr.asAt"
  | "kr.neverUpdated"
  | "kr.stale"
  | "kr.measure"
  | "kr.instrument"
  | "kr.instrumentMissing"
  | "kr.notMeasurable"
  | "kr.progress"
  | "kr.type"
  | "kr.type.metric"
  | "kr.type.milestone"
  | "kr.milestoneStatus"
  | "kr.milestone.not_started"
  | "kr.milestone.in_progress"
  | "kr.milestone.done"
  | "kr.milestoneDue"
  | "kr.originalTarget"
  | "kr.baselineLocked"
  | "kr.baselineLockedHint"
  | "kr.measurePlaceholder"
  | "kr.instrumentPlaceholder"
  // board report
  | "report.nav"
  | "report.eyebrow"
  | "report.title"
  | "report.subtitle"
  | "report.generated"
  | "report.download"
  | "report.summary.objectives"
  | "report.summary.keyResults"
  | "report.summary.metric"
  | "report.summary.milestone"
  | "report.summary.initiatives"
  | "report.readiness.title"
  | "report.readiness.context"
  | "report.readiness.axis"
  | "report.byObjective.title"
  | "report.byObjective.total"
  | "report.byObjective.instrument"
  | "report.byObjective.baseline"
  | "report.portfolio.title"
  | "report.portfolio.gap"
  | "report.portfolio.noGap"
  | "report.sfa.title"
  | "report.sfa.legend"
  | "report.sfa.pillar"
  | "report.sfa.how"
  | "report.table.kr"
  | "report.table.keyResult"
  | "report.table.baseline"
  | "report.table.target"
  | "report.table.lead"
  | "report.meta.steward"
  | "report.meta.focus"
  | "report.objective.footer"
  | "report.open.title"
  | "report.open.noInstrument"
  | "report.open.noBaseline"
  | "report.open.noLead"
  | "report.open.noInitiatives"
  | "report.open.none"
  | "report.provenance"
  | "report.value.pending"
  | "report.value.afterBaseline"
  | "report.value.notDefined"
  | "report.value.unassigned"
  | "report.kr.milestone"
  | "report.kr.due";



const en: Record<StringKey, string> = {
  "hero.eyebrow": "THE SWITZERLAND CHAPTER OF ICF · OKR DASHBOARD",
  "hero.title": "2026-2027 Objectives and Keyresults with Global Alignment",
  "hero.subtitle":
    "One inspiring, customer-centric objective per strategic pillar — aligned to the ICF Global Strategic Plan 2026–2029 and the Arbon board retreat, 1 June 2026.",
  "hero.pillarTitle": "ICF Strategic Focus Areas (SFAs) 2026-2029",
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
  "section.secondaryInitiatives": "Secondary Initiatives",
  "section.alignmentTitle": "Global alignment analysis",
  "section.alignmentIntro":
    "How each ICFS pillar contributes to the three ICF Global 2026–2029 focus areas.",
  "section.alignmentPrimary": "= primary contribution,",
  "section.alignmentSecondary": "= secondary contribution.",
  "section.alignmentCycleHint": "Click a dot cell to cycle none → secondary → primary.",
  "section.alignmentPillar": "ICFS pillar",
  "section.alignmentHow": "How it contributes",
  "section.okrSets": "OKR Sets -\u00a0The Switzerland Chapter of ICF",
  "kr.count.one": "initiative",
  "kr.count.other": "initiatives",
  "kr.noDescription": "No description",
  "kr.target": "Target",
  "kr.lead": "Lead",
  "kr.openDetails": "Open details →",
  "kr.number": "KR number",
  "kr.detailDescription": "Owned outcome and the projects that deliver it.",
  "kr.deleteConfirm": "Delete this key result and its initiatives?",
  "kr.deleteConfirmBody": "This will permanently delete the key result and its initiatives. This action cannot be undone.",
  "kr.delete": "Delete key result",
  "okr.customer": "Customer:",
  "okr.delete": "Delete OKR set",
  "okr.deleteConfirm": "Delete OKR set",
  "okr.deleteConfirmBody": "Deleting this OKR set also deletes its key results and initiatives. This action cannot be undone.",
  "okr.noKeyResults": "No key results yet.",
  "okr.addKeyResult": "+ Add key result",
  "okr.addOkrSet": "Add OKR set",
  "initiative.header": "Initiative",
  "initiative.none": "No initiatives yet.",
  "initiative.new": "New project or initiative…",
  "initiative.add": "Add",
  "initiative.delete": "Delete initiative",
  "initiative.secondary": "Secondary",
  "initiative.secondaryFrom": "Secondary — primary on OKR {n}, KR {kr}",
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
  "initiatives.editTitle": "Edit initiative",
  "initiatives.editDescription": "Update the initiative details or remove it.",
  "initiatives.updated": "Initiative updated",
  "initiatives.deleted": "Initiative deleted",
  "initiatives.delete": "Delete initiative",
  "initiatives.deleteConfirmTitle": "Delete this initiative?",
  "initiatives.deleteConfirmBody": "This action cannot be undone.",
  "initiatives.open": "Open initiative",
  "initiatives.form.secondaryKrs": "Secondary Key Results",
  "initiatives.form.addSecondaryKr": "Add Key Result",
  "initiatives.form.noSecondaryKrs": "No secondary Key Results yet.",
  "initiatives.form.removeSecondaryKr": "Remove",
  "initiatives.form.searchKr": "Search Key Results…",
  "initiative.link": "Link initiatives",
  "initiative.linkDialog.title": "Link initiatives to this KR",
  "initiative.linkDialog.description": "Choose which portfolio initiatives contribute to this key result. Create new initiatives from the Portfolio.",
  "initiative.linkDialog.search": "Search initiatives…",
  "initiative.linkDialog.empty": "No initiatives in the portfolio yet.",
  "initiative.linkDialog.role.none": "None",
  "initiative.linkDialog.role.secondary": "Secondary",
  "initiative.linkDialog.role.primary": "Primary",
  "initiative.linkDialog.primaryHint": "Setting an initiative as Primary moves it here from its current KR.",
  "initiative.linkDialog.primaryLocked": "Change the primary link in the target KR's dialog.",
  "initiative.unlinkSecondary": "Remove secondary link",
  "initiative.createInPortfolio": "New initiatives are created in the Portfolio.",
  "initiative.linksUpdated": "Links updated",
  "initiatives.view.label": "View",
  "initiatives.view.board": "Board view",
  "initiatives.view.volunteer": "Volunteer view",
  "volunteer.openLead": "{n} initiatives are open and looking for someone.",
  "volunteer.group.lead": "Needs a lead",
  "volunteer.group.helpers": "Needs helpers",
  "volunteer.group.skill": "Needs a specific skill",
  "volunteer.group.unscoped": "Not yet scoped",
  "volunteer.blocked": "Blocked",
  "volunteer.parked": "Parked",
  "volunteer.blockedEmpty": "Nothing is blocked.",
  "volunteer.parkedEmpty": "Nothing is parked.",
  "volunteer.lastUpdated": "Last updated {date}",
  "volunteer.scopeMissing": "Scope not specified",
  "volunteer.noReason": "Reason not given",
  "volunteer.empty": "Nothing is open right now.",
  "volunteer.groupEmpty": "Nothing here",
  "initiative.availability.open": "Open",
  "initiative.availability.blocked": "Blocked",
  "initiative.availability.parked": "Parked",
  "initiative.commitment.one_off": "One-off, a few hours",
  "initiative.commitment.recurring": "Recurring, a few hours a month",
  "initiative.commitment.workstream": "Workstream, leads it over months",
  "initiative.helpNeeded.lead": "Needs a lead",
  "initiative.helpNeeded.helpers": "Needs helpers alongside the lead",
  "initiative.helpNeeded.skill": "Needs a specific skill",
  "initiatives.form.availability": "Availability",
  "initiatives.form.blockedReason": "What is it waiting on?",
  "initiatives.form.blockedReasonPlaceholder": "e.g. waiting on a board decision",
  "initiatives.form.commitment": "Commitment",
  "initiatives.form.helpNeeded": "Help needed",
  "initiatives.form.skillNote": "Which skill?",
  "initiatives.form.skillNotePlaceholder": "e.g. graphic design, legal review",
  "initiatives.form.unspecified": "Not specified",
  "initiatives.form.helpersOwnerHint": "Helpers join a lead. Consider naming an owner first.",
  "initiatives.form.availabilityHint": "Availability applies while the initiative is planned.",


  "common.cancel": "Cancel",
  "common.create": "Create",
  "common.creating": "Creating…",
  "common.save": "Save",
  "common.saving": "Saving…",
  "common.delete": "Delete",
  "common.deleting": "Deleting…",
  "lang.switcher": "Language",
  "banner.baselining":
    "2026 is a baselining year. 2027 is the execution year. All baselines are due 30.11.2026.",
  "scorecard.title": "2026 measurement status",
  "scorecard.instrument": "Instrument defined",
  "scorecard.baseline": "Baseline recorded",
  "scorecard.current": "Current value with a date",
  "scorecard.of": "of {total} key results",
  "kr.baseline2026": "Baseline 2026",
  "kr.current": "Current",
  "kr.target2027": "Target 2027",
  "kr.baselinePending": "Baseline pending",
  "kr.asAt": "as at {date}",
  "kr.neverUpdated": "never updated",
  "kr.stale": "stale",
  "kr.measure": "Measure",
  "kr.instrument": "Instrument",
  "kr.instrumentMissing": "Instrument not defined",
  "kr.notMeasurable": "not yet measurable",
  "kr.progress": "Progress",
  "kr.type": "Type",
  "kr.type.metric": "Metric",
  "kr.type.milestone": "Milestone",
  "kr.milestoneStatus": "Milestone status",
  "kr.milestone.not_started": "Not started",
  "kr.milestone.in_progress": "In progress",
  "kr.milestone.done": "Done",
  "kr.milestoneDue": "Due",
  "kr.originalTarget": "Original 2026 target (from source document)",
  "kr.baselineLocked": "Baseline locked",
  "kr.baselineLockedHint": "Freeze the 2026 baseline once it is agreed.",
  "kr.measurePlaceholder": "What exactly is counted?",
  "kr.instrumentPlaceholder": "e.g. Annual Membership Survey",

  // board report
  "report.nav": "Report",
  "report.eyebrow": "THE SWITZERLAND CHAPTER OF ICF · BOARD REPORT",
  "report.title": "OKR board report 2026–2027",
  "report.subtitle": "A printable snapshot of objectives, key results, measurement readiness and the initiative portfolio.",
  "report.generated": "Generated from the ICFS OKR dashboard on {date} at {time}. The dashboard is the system of record. This document is a snapshot and is superseded by the dashboard whenever the two disagree.",
  "report.download": "Download PDF",
  "report.summary.objectives": "Objectives",
  "report.summary.keyResults": "Key results",
  "report.summary.metric": "Metric key results",
  "report.summary.milestone": "Milestone key results",
  "report.summary.initiatives": "Initiatives",
  "report.readiness.title": "Measurement readiness",
  "report.readiness.context": "2026 is a baselining year. This report shows how much of the measurement system exists, not how far execution has progressed — progress figures would read zero by design. Baselines are due 30.11.2026.",
  "report.readiness.axis": "count of {total} metric key results",
  "report.byObjective.title": "Readiness by objective",
  "report.byObjective.total": "Metric key results",
  "report.byObjective.instrument": "With instrument",
  "report.byObjective.baseline": "With baseline",
  "report.portfolio.title": "Initiative portfolio by objective",
  "report.portfolio.gap": "{count} key results have no initiative: {list}",
  "report.portfolio.noGap": "Every key result has at least one initiative.",
  "report.sfa.title": "Strategic focus area contribution",
  "report.sfa.legend": "Filled = primary contribution · Outline = secondary contribution · Dash = none",
  "report.sfa.pillar": "ICFS pillar",
  "report.sfa.how": "How it contributes",
  "report.table.kr": "KR",
  "report.table.keyResult": "Key result",
  "report.table.baseline": "Baseline 2026",
  "report.table.target": "Target 2027",
  "report.table.lead": "Lead",
  "report.meta.steward": "Steward",
  "report.meta.focus": "Strategic focus areas",
  "report.objective.footer": "{initiatives} initiatives · {gap} key results without an initiative",
  "report.open.title": "Open items",
  "report.open.noInstrument": "Key results without an instrument",
  "report.open.noBaseline": "Metric key results without a 2026 baseline",
  "report.open.noLead": "Key results without a lead",
  "report.open.noInitiatives": "Key results without an initiative",
  "report.open.none": "None",
  "report.provenance": "Generated on {date} at {time} · Source: {url}",
  "report.value.pending": "Pending",
  "report.value.afterBaseline": "Set after baseline",
  "report.value.notDefined": "Not yet defined",
  "report.value.unassigned": "Unassigned",
  "report.kr.milestone": "Milestone",
  "report.kr.due": "Due {date}",


};

const de: Record<StringKey, string> = {
  "hero.eyebrow": "DAS SCHWEIZER CHAPTER DER ICF · OKR-DASHBOARD",
  "hero.title": "Objectives und Key Results 2026-2027 mit globaler Ausrichtung",
  "hero.subtitle":
    "Ein inspirierendes, kundenorientiertes Ziel pro strategischer Säule — abgestimmt auf den ICF Global Strategic Plan 2026–2029 und die Vorstandsklausur in Arbon, 1. Juni 2026.",
  "hero.pillarTitle": "ICF Strategic Focus Areas (SFAs) 2026-2029",
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
  "section.secondaryInitiatives": "Sekundäre Initiativen",
  "section.alignmentTitle": "Analyse der globalen Ausrichtung",
  "section.alignmentIntro":
    "Wie jede ICFS-Säule zu den drei Schwerpunktbereichen von ICF Global 2026–2029 beiträgt.",
  "section.alignmentPrimary": "= primärer Beitrag,",
  "section.alignmentSecondary": "= sekundärer Beitrag.",
  "section.alignmentCycleHint":
    "Klicke auf eine Punktzelle, um zwischen kein → sekundär → primär zu wechseln.",
  "section.alignmentPillar": "ICFS-Säule",
  "section.alignmentHow": "Wie sie beiträgt",
  "section.okrSets": "OKR-Sets -\u00a0Das Schweizer Chapter der ICF",
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
  "kr.deleteConfirmBody": "Das Key Result und seine Initiativen werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
  "kr.delete": "Key Result löschen",
  "okr.customer": "Kunde:",
  "okr.delete": "OKR-Set löschen",
  "okr.deleteConfirm": "OKR-Set löschen",
  "okr.deleteConfirmBody": "Mit dem OKR-Set werden auch seine Key Results und Initiativen gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
  "okr.noKeyResults": "Noch keine Key Results.",
  "okr.addKeyResult": "+ Key Result hinzufügen",
  "okr.addOkrSet": "OKR-Set hinzufügen",
  "initiative.header": "Initiative",
  "initiative.none": "Noch keine Initiativen.",
  "initiative.new": "Neues Projekt oder Initiative…",
  "initiative.add": "Hinzufügen",
  "initiative.delete": "Initiative löschen",
  "initiative.secondary": "Sekundär",
  "initiative.secondaryFrom": "Sekundär — primär bei OKR {n}, KR {kr}",
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
  "initiatives.editTitle": "Initiative bearbeiten",
  "initiatives.editDescription": "Details der Initiative aktualisieren oder entfernen.",
  "initiatives.updated": "Initiative aktualisiert",
  "initiatives.deleted": "Initiative gelöscht",
  "initiatives.delete": "Initiative löschen",
  "initiatives.deleteConfirmTitle": "Diese Initiative löschen?",
  "initiatives.deleteConfirmBody": "Diese Aktion kann nicht rückgängig gemacht werden.",
  "initiatives.open": "Initiative öffnen",
  "initiatives.form.secondaryKrs": "Sekundäre Key Results",
  "initiatives.form.addSecondaryKr": "Key Result hinzufügen",
  "initiatives.form.noSecondaryKrs": "Noch keine sekundären Key Results.",
  "initiatives.form.removeSecondaryKr": "Entfernen",
  "initiatives.form.searchKr": "Key Results suchen…",
  "initiative.link": "Initiativen verknüpfen",
  "initiative.linkDialog.title": "Initiativen mit diesem KR verknüpfen",
  "initiative.linkDialog.description": "Wähle, welche Portfolio-Initiativen zu diesem Key Result beitragen. Neue Initiativen werden im Portfolio erstellt.",
  "initiative.linkDialog.search": "Initiativen suchen…",
  "initiative.linkDialog.empty": "Noch keine Initiativen im Portfolio.",
  "initiative.linkDialog.role.none": "Keine",
  "initiative.linkDialog.role.secondary": "Sekundär",
  "initiative.linkDialog.role.primary": "Primär",
  "initiative.linkDialog.primaryHint": "Wird eine Initiative als Primär gesetzt, wechselt sie von ihrem bisherigen KR hierher.",
  "initiative.linkDialog.primaryLocked": "Ändere die primäre Verknüpfung im Dialog des Ziel-KRs.",
  "initiative.unlinkSecondary": "Sekundäre Verknüpfung entfernen",
  "initiative.createInPortfolio": "Neue Initiativen werden im Portfolio erstellt.",
  "initiative.linksUpdated": "Verknüpfungen aktualisiert",
  "initiatives.view.label": "Ansicht",
  "initiatives.view.board": "Vorstandsansicht",
  "initiatives.view.volunteer": "Freiwilligenansicht",
  "volunteer.openLead": "{n} Initiativen sind offen und suchen jemanden.",
  "volunteer.group.lead": "Braucht eine Leitung",
  "volunteer.group.helpers": "Braucht Mitwirkende",
  "volunteer.group.skill": "Braucht eine bestimmte Kompetenz",
  "volunteer.group.unscoped": "Noch nicht definiert",
  "volunteer.blocked": "Blockiert",
  "volunteer.parked": "Zur\u00fcckgestellt",
  "volunteer.blockedEmpty": "Nichts ist blockiert.",
  "volunteer.parkedEmpty": "Nichts ist zur\u00fcckgestellt.",
  "volunteer.lastUpdated": "Zuletzt aktualisiert {date}",
  "volunteer.scopeMissing": "Umfang nicht angegeben",
  "volunteer.noReason": "Grund nicht angegeben",
  "volunteer.empty": "Derzeit ist nichts offen.",
  "volunteer.groupEmpty": "Nichts vorhanden",
  "initiative.availability.open": "Offen",
  "initiative.availability.blocked": "Blockiert",
  "initiative.availability.parked": "Zur\u00fcckgestellt",
  "initiative.commitment.one_off": "Einmalig, einige Stunden",
  "initiative.commitment.recurring": "Wiederkehrend, einige Stunden pro Monat",
  "initiative.commitment.workstream": "Arbeitsstrang, Leitung \u00fcber Monate",
  "initiative.helpNeeded.lead": "Braucht eine Leitung",
  "initiative.helpNeeded.helpers": "Braucht Mitwirkende an der Seite der Leitung",
  "initiative.helpNeeded.skill": "Braucht eine bestimmte Kompetenz",
  "initiatives.form.availability": "Verf\u00fcgbarkeit",
  "initiatives.form.blockedReason": "Worauf wartet die Initiative?",
  "initiatives.form.blockedReasonPlaceholder": "z. B. wartet auf einen Vorstandsentscheid",
  "initiatives.form.commitment": "Aufwand",
  "initiatives.form.helpNeeded": "Ben\u00f6tigte Unterst\u00fctzung",
  "initiatives.form.skillNote": "Welche Kompetenz?",
  "initiatives.form.skillNotePlaceholder": "z. B. Grafikdesign, juristische Pr\u00fcfung",
  "initiatives.form.unspecified": "Nicht angegeben",
  "initiatives.form.helpersOwnerHint": "Mitwirkende unterst\u00fctzen eine Leitung. Bitte zuerst eine verantwortliche Person eintragen.",
  "initiatives.form.availabilityHint": "Die Verf\u00fcgbarkeit gilt, solange die Initiative geplant ist.",


  "common.cancel": "Abbrechen",
  "common.create": "Erstellen",
  "common.creating": "Wird erstellt…",
  "common.save": "Speichern",
  "common.saving": "Wird gespeichert…",
  "common.delete": "Löschen",
  "common.deleting": "Wird gelöscht…",
  "lang.switcher": "Sprache",
  "banner.baselining":
    "2026 ist ein Baseline-Jahr. 2027 ist das Umsetzungsjahr. Alle Baselines sind bis 30.11.2026 fällig.",
  "scorecard.title": "Messstand 2026",
  "scorecard.instrument": "Instrument definiert",
  "scorecard.baseline": "Baseline erfasst",
  "scorecard.current": "Aktueller Wert mit Datum",
  "scorecard.of": "von {total} Key Results",
  "kr.baseline2026": "Baseline 2026",
  "kr.current": "Aktuell",
  "kr.target2027": "Ziel 2027",
  "kr.baselinePending": "Baseline ausstehend",
  "kr.asAt": "Stand {date}",
  "kr.neverUpdated": "nie aktualisiert",
  "kr.stale": "veraltet",
  "kr.measure": "Messgrösse",
  "kr.instrument": "Instrument",
  "kr.instrumentMissing": "Instrument nicht definiert",
  "kr.notMeasurable": "noch nicht messbar",
  "kr.progress": "Fortschritt",
  "kr.type": "Typ",
  "kr.type.metric": "Kennzahl",
  "kr.type.milestone": "Meilenstein",
  "kr.milestoneStatus": "Meilenstein-Status",
  "kr.milestone.not_started": "Nicht begonnen",
  "kr.milestone.in_progress": "In Arbeit",
  "kr.milestone.done": "Erledigt",
  "kr.milestoneDue": "Fällig",
  "kr.originalTarget": "Ursprüngliches Ziel 2026 (aus dem Quelldokument)",
  "kr.baselineLocked": "Baseline gesperrt",
  "kr.baselineLockedHint": "Die Baseline 2026 fixieren, sobald sie abgestimmt ist.",
  "kr.measurePlaceholder": "Was genau wird gezählt?",
  "kr.instrumentPlaceholder": "z. B. jährliche Mitgliederbefragung",

  // board report
  "report.nav": "Bericht",
  "report.eyebrow": "DAS SCHWEIZER CHAPTER DER ICF · VORSTANDSBERICHT",
  "report.title": "OKR-Vorstandsbericht 2026–2027",
  "report.subtitle": "Eine druckbare Momentaufnahme von Zielen, Key Results, Messbereitschaft und Initiativenportfolio.",
  "report.generated": "Erstellt aus dem ICFS-OKR-Dashboard am {date} um {time}. Das Dashboard ist die massgebliche Quelle. Dieses Dokument ist eine Momentaufnahme und wird durch das Dashboard ersetzt, sobald beide voneinander abweichen.",
  "report.download": "PDF herunterladen",
  "report.summary.objectives": "Ziele",
  "report.summary.keyResults": "Key Results",
  "report.summary.metric": "Metrische Key Results",
  "report.summary.milestone": "Milestone-Key-Results",
  "report.summary.initiatives": "Initiativen",
  "report.readiness.title": "Messbereitschaft",
  "report.readiness.context": "2026 ist ein Baselining-Jahr. Dieser Bericht zeigt, wie weit das Messsystem aufgebaut ist, nicht den Umsetzungsfortschritt — Fortschrittswerte wären bewusst null. Baselines sind bis 30.11.2026 fällig.",
  "report.readiness.axis": "Anzahl von {total} metrischen Key Results",
  "report.byObjective.title": "Bereitschaft nach Ziel",
  "report.byObjective.total": "Metrische Key Results",
  "report.byObjective.instrument": "Mit Instrument",
  "report.byObjective.baseline": "Mit Baseline",
  "report.portfolio.title": "Initiativenportfolio nach Ziel",
  "report.portfolio.gap": "{count} Key Results ohne Initiative: {list}",
  "report.portfolio.noGap": "Jedes Key Result hat mindestens eine Initiative.",
  "report.sfa.title": "Beitrag zu den strategischen Fokusbereichen",
  "report.sfa.legend": "Gefüllt = primärer Beitrag · Kontur = sekundärer Beitrag · Strich = keiner",
  "report.sfa.pillar": "ICFS-Säule",
  "report.sfa.how": "Wie sie beiträgt",
  "report.table.kr": "KR",
  "report.table.keyResult": "Key Result",
  "report.table.baseline": "Baseline 2026",
  "report.table.target": "Ziel 2027",
  "report.table.lead": "Lead",
  "report.meta.steward": "Steward",
  "report.meta.focus": "Strategische Fokusbereiche",
  "report.objective.footer": "{initiatives} Initiativen · {gap} Key Results ohne Initiative",
  "report.open.title": "Offene Punkte",
  "report.open.noInstrument": "Key Results ohne Instrument",
  "report.open.noBaseline": "Metrische Key Results ohne Baseline 2026",
  "report.open.noLead": "Key Results ohne Lead",
  "report.open.noInitiatives": "Key Results ohne Initiative",
  "report.open.none": "Keine",
  "report.provenance": "Erstellt am {date} um {time} · Quelle: {url}",
  "report.value.pending": "Ausstehend",
  "report.value.afterBaseline": "Wird nach der Baseline festgelegt",
  "report.value.notDefined": "Noch nicht definiert",
  "report.value.unassigned": "Nicht zugewiesen",
  "report.kr.milestone": "Milestone",
  "report.kr.due": "Fällig {date}",


};

const fr: Record<StringKey, string> = {
  "hero.eyebrow": "LE CHAPITRE SUISSE DE L'ICF · TABLEAU DE BORD OKR",
  "hero.title": "Objectifs et key results 2026-2027 avec alignement global",
  "hero.subtitle":
    "Un objectif inspirant et centré sur le client par pilier stratégique — aligné sur l'ICF Global Strategic Plan 2026–2029 et la retraite du conseil d'Arbon du 1er juin 2026.",
  "hero.pillarTitle": "Axes stratégiques de l'ICF (SFAs) 2026-2029",
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
  "section.secondaryInitiatives": "Initiatives secondaires",
  "section.alignmentTitle": "Analyse de l'alignement global",
  "section.alignmentIntro":
    "Comment chaque pilier ICFS contribue aux trois axes d'ICF Global 2026–2029.",
  "section.alignmentPrimary": "= contribution principale,",
  "section.alignmentSecondary": "= contribution secondaire.",
  "section.alignmentCycleHint":
    "Cliquez sur une cellule de point pour alterner aucun → secondaire → principal.",
  "section.alignmentPillar": "Pilier ICFS",
  "section.alignmentHow": "Comment il contribue",
  "section.okrSets": "OKR Sets -\u00a0Le Chapitre Suisse de l'ICF",
  "kr.count.one": "initiative",
  "kr.count.other": "initiatives",
  "kr.noDescription": "Aucune description",
  "kr.target": "Cible",
  "kr.lead": "Responsable",
  "kr.openDetails": "Voir les détails →",
  "kr.number": "Numéro KR",
  "kr.detailDescription": "Résultat piloté et projets qui le livrent.",
  "kr.deleteConfirm": "Supprimer ce résultat clé et ses initiatives ?",
  "kr.deleteConfirmBody": "Le résultat clé et ses initiatives seront définitivement supprimés. Cette action est irréversible.",
  "kr.delete": "Supprimer le résultat clé",
  "okr.customer": "Client :",
  "okr.delete": "Supprimer l'ensemble OKR",
  "okr.deleteConfirm": "Supprimer l'ensemble OKR",
  "okr.deleteConfirmBody": "La suppression de l'ensemble OKR supprime aussi ses résultats clés et ses initiatives. Cette action est irréversible.",
  "okr.noKeyResults": "Aucun résultat clé pour le moment.",
  "okr.addKeyResult": "+ Ajouter un résultat clé",
  "okr.addOkrSet": "Ajouter un ensemble OKR",
  "initiative.header": "Initiative",
  "initiative.none": "Aucune initiative pour le moment.",
  "initiative.new": "Nouveau projet ou initiative…",
  "initiative.add": "Ajouter",
  "initiative.delete": "Supprimer l'initiative",
  "initiative.secondary": "Secondaire",
  "initiative.secondaryFrom": "Secondaire — primaire sur OKR {n}, KR {kr}",
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
  "initiatives.editTitle": "Modifier l'initiative",
  "initiatives.editDescription": "Mettez à jour les détails ou supprimez l'initiative.",
  "initiatives.updated": "Initiative mise à jour",
  "initiatives.deleted": "Initiative supprimée",
  "initiatives.delete": "Supprimer l'initiative",
  "initiatives.deleteConfirmTitle": "Supprimer cette initiative ?",
  "initiatives.deleteConfirmBody": "Cette action est irréversible.",
  "initiatives.open": "Ouvrir l'initiative",
  "initiatives.form.secondaryKrs": "Résultats clés secondaires",
  "initiatives.form.addSecondaryKr": "Ajouter un résultat clé",
  "initiatives.form.noSecondaryKrs": "Aucun résultat clé secondaire.",
  "initiatives.form.removeSecondaryKr": "Retirer",
  "initiatives.form.searchKr": "Rechercher des résultats clés…",
  "initiative.link": "Lier des initiatives",
  "initiative.linkDialog.title": "Lier des initiatives à ce KR",
  "initiative.linkDialog.description": "Choisissez quelles initiatives du portefeuille contribuent à ce résultat clé. Les nouvelles initiatives se créent dans le Portefeuille.",
  "initiative.linkDialog.search": "Rechercher des initiatives…",
  "initiative.linkDialog.empty": "Aucune initiative dans le portefeuille.",
  "initiative.linkDialog.role.none": "Aucun",
  "initiative.linkDialog.role.secondary": "Secondaire",
  "initiative.linkDialog.role.primary": "Principal",
  "initiative.linkDialog.primaryHint": "Définir une initiative comme Principale la déplace ici depuis son KR actuel.",
  "initiative.linkDialog.primaryLocked": "Modifiez le lien principal dans le dialogue du KR cible.",
  "initiative.unlinkSecondary": "Retirer le lien secondaire",
  "initiative.createInPortfolio": "Les nouvelles initiatives se créent dans le Portefeuille.",
  "initiative.linksUpdated": "Liens mis à jour",
  "initiatives.view.label": "Vue",
  "initiatives.view.board": "Vue comit\u00e9",
  "initiatives.view.volunteer": "Vue b\u00e9n\u00e9vole",
  "volunteer.openLead": "{n} initiatives sont ouvertes et cherchent quelqu'un.",
  "volunteer.group.lead": "Cherche une personne responsable",
  "volunteer.group.helpers": "Cherche des renforts",
  "volunteer.group.skill": "Cherche une comp\u00e9tence sp\u00e9cifique",
  "volunteer.group.unscoped": "Pas encore cadr\u00e9",
  "volunteer.blocked": "Bloqu\u00e9",
  "volunteer.parked": "Report\u00e9",
  "volunteer.blockedEmpty": "Rien n'est bloqu\u00e9.",
  "volunteer.parkedEmpty": "Rien n'est report\u00e9.",
  "volunteer.lastUpdated": "Derni\u00e8re mise \u00e0 jour {date}",
  "volunteer.scopeMissing": "Cadrage non pr\u00e9cis\u00e9",
  "volunteer.noReason": "Raison non indiqu\u00e9e",
  "volunteer.empty": "Rien n'est ouvert pour le moment.",
  "volunteer.groupEmpty": "Rien ici",
  "initiative.availability.open": "Ouvert",
  "initiative.availability.blocked": "Bloqu\u00e9",
  "initiative.availability.parked": "Report\u00e9",
  "initiative.commitment.one_off": "Ponctuel, quelques heures",
  "initiative.commitment.recurring": "R\u00e9current, quelques heures par mois",
  "initiative.commitment.workstream": "Chantier, pilotage sur plusieurs mois",
  "initiative.helpNeeded.lead": "Cherche une personne responsable",
  "initiative.helpNeeded.helpers": "Cherche des renforts aux c\u00f4t\u00e9s de la personne responsable",
  "initiative.helpNeeded.skill": "Cherche une comp\u00e9tence sp\u00e9cifique",
  "initiatives.form.availability": "Disponibilit\u00e9",
  "initiatives.form.blockedReason": "Qu'est-ce qui bloque ?",
  "initiatives.form.blockedReasonPlaceholder": "p. ex. en attente d'une d\u00e9cision du comit\u00e9",
  "initiatives.form.commitment": "Engagement",
  "initiatives.form.helpNeeded": "Aide recherch\u00e9e",
  "initiatives.form.skillNote": "Quelle comp\u00e9tence ?",
  "initiatives.form.skillNotePlaceholder": "p. ex. graphisme, relecture juridique",
  "initiatives.form.unspecified": "Non pr\u00e9cis\u00e9",
  "initiatives.form.helpersOwnerHint": "Les renforts rejoignent une personne responsable. Indiquez-en une d'abord.",
  "initiatives.form.availabilityHint": "La disponibilit\u00e9 s'applique tant que l'initiative est planifi\u00e9e.",


  "common.cancel": "Annuler",
  "common.create": "Créer",
  "common.creating": "Création…",
  "common.save": "Enregistrer",
  "common.saving": "Enregistrement…",
  "common.delete": "Supprimer",
  "common.deleting": "Suppression…",
  "lang.switcher": "Langue",
  "banner.baselining":
    "2026 est une année de référence. 2027 est l'année d'exécution. Toutes les valeurs de référence sont attendues pour le 30.11.2026.",
  "scorecard.title": "État de la mesure 2026",
  "scorecard.instrument": "Instrument défini",
  "scorecard.baseline": "Référence enregistrée",
  "scorecard.current": "Valeur actuelle datée",
  "scorecard.of": "sur {total} résultats clés",
  "kr.baseline2026": "Référence 2026",
  "kr.current": "Actuel",
  "kr.target2027": "Cible 2027",
  "kr.baselinePending": "Référence en attente",
  "kr.asAt": "au {date}",
  "kr.neverUpdated": "jamais mis à jour",
  "kr.stale": "obsolète",
  "kr.measure": "Mesure",
  "kr.instrument": "Instrument",
  "kr.instrumentMissing": "Instrument non défini",
  "kr.notMeasurable": "pas encore mesurable",
  "kr.progress": "Progression",
  "kr.type": "Type",
  "kr.type.metric": "Métrique",
  "kr.type.milestone": "Jalon",
  "kr.milestoneStatus": "Statut du jalon",
  "kr.milestone.not_started": "Non commencé",
  "kr.milestone.in_progress": "En cours",
  "kr.milestone.done": "Terminé",
  "kr.milestoneDue": "Échéance",
  "kr.originalTarget": "Cible 2026 d'origine (du document source)",
  "kr.baselineLocked": "Référence verrouillée",
  "kr.baselineLockedHint": "Figer la référence 2026 une fois qu'elle est validée.",
  "kr.measurePlaceholder": "Que compte-t-on exactement ?",
  "kr.instrumentPlaceholder": "p. ex. Enquête annuelle auprès des membres",

  // board report
  "report.nav": "Rapport",
  "report.eyebrow": "LE CHAPITRE SUISSE DE L'ICF · RAPPORT AU COMITÉ",
  "report.title": "Rapport OKR au comité 2026–2027",
  "report.subtitle": "Un instantané imprimable des objectifs, des key results, de la maturité de mesure et du portefeuille d'initiatives.",
  "report.generated": "Généré depuis le tableau de bord OKR ICFS le {date} à {time}. Le tableau de bord fait foi. Ce document est un instantané et est remplacé par le tableau de bord en cas de divergence.",
  "report.download": "Télécharger le PDF",
  "report.summary.objectives": "Objectifs",
  "report.summary.keyResults": "Key results",
  "report.summary.metric": "Key results métriques",
  "report.summary.milestone": "Key results jalons",
  "report.summary.initiatives": "Initiatives",
  "report.readiness.title": "Maturité de la mesure",
  "report.readiness.context": "2026 est une année de référence. Ce rapport montre l'état du système de mesure, et non l'avancement de l'exécution — les taux d'avancement seraient nuls par construction. Les références sont dues au 30.11.2026.",
  "report.readiness.axis": "nombre sur {total} key results métriques",
  "report.byObjective.title": "Maturité par objectif",
  "report.byObjective.total": "Key results métriques",
  "report.byObjective.instrument": "Avec instrument",
  "report.byObjective.baseline": "Avec référence",
  "report.portfolio.title": "Portefeuille d'initiatives par objectif",
  "report.portfolio.gap": "{count} key results sans initiative : {list}",
  "report.portfolio.noGap": "Chaque key result a au moins une initiative.",
  "report.sfa.title": "Contribution aux axes stratégiques",
  "report.sfa.legend": "Plein = contribution principale · Contour = contribution secondaire · Tiret = aucune",
  "report.sfa.pillar": "Pilier ICFS",
  "report.sfa.how": "Comment il contribue",
  "report.table.kr": "KR",
  "report.table.keyResult": "Key result",
  "report.table.baseline": "Référence 2026",
  "report.table.target": "Cible 2027",
  "report.table.lead": "Responsable",
  "report.meta.steward": "Steward",
  "report.meta.focus": "Axes stratégiques",
  "report.objective.footer": "{initiatives} initiatives · {gap} key results sans initiative",
  "report.open.title": "Points ouverts",
  "report.open.noInstrument": "Key results sans instrument",
  "report.open.noBaseline": "Key results métriques sans référence 2026",
  "report.open.noLead": "Key results sans responsable",
  "report.open.noInitiatives": "Key results sans initiative",
  "report.open.none": "Aucun",
  "report.provenance": "Généré le {date} à {time} · Source : {url}",
  "report.value.pending": "En attente",
  "report.value.afterBaseline": "Défini après la référence",
  "report.value.notDefined": "Pas encore défini",
  "report.value.unassigned": "Non attribué",
  "report.kr.milestone": "Jalon",
  "report.kr.due": "Échéance {date}",


};

const it: Record<StringKey, string> = {
  "hero.eyebrow": "IL CHAPTER SVIZZERO DI ICF · DASHBOARD OKR",
  "hero.title": "Obiettivi e key result 2026-2027 con allineamento globale",
  "hero.subtitle":
    "Un obiettivo ispiratore e centrato sul cliente per pilastro strategico — allineato all'ICF Global Strategic Plan 2026–2029 e al ritiro del board di Arbon del 1° giugno 2026.",
  "hero.pillarTitle": "Aree di focus strategiche ICF (SFAs) 2026-2029",
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
  "section.secondaryInitiatives": "Iniziative secondarie",
  "section.alignmentTitle": "Analisi dell'allineamento globale",
  "section.alignmentIntro":
    "Come ogni pilastro ICFS contribuisce alle tre aree di focus di ICF Global 2026–2029.",
  "section.alignmentPrimary": "= contributo primario,",
  "section.alignmentSecondary": "= contributo secondario.",
  "section.alignmentCycleHint":
    "Clicca su una cella di punto per alternare nessuno → secondario → primario.",
  "section.alignmentPillar": "Pilastro ICFS",
  "section.alignmentHow": "Come contribuisce",
  "section.okrSets": "OKR Sets -\u00a0Il Chapter Svizzero di ICF",
  "kr.count.one": "iniziativa",
  "kr.count.other": "iniziative",
  "kr.noDescription": "Nessuna descrizione",
  "kr.target": "Target",
  "kr.lead": "Responsabile",
  "kr.openDetails": "Apri dettagli →",
  "kr.number": "Numero KR",
  "kr.detailDescription": "Risultato di cui si è responsabili e i progetti che lo realizzano.",
  "kr.deleteConfirm": "Eliminare questo risultato chiave e le sue iniziative?",
  "kr.deleteConfirmBody": "Il risultato chiave e le sue iniziative verranno eliminati definitivamente. Questa azione non può essere annullata.",
  "kr.delete": "Elimina risultato chiave",
  "okr.customer": "Cliente:",
  "okr.delete": "Elimina set OKR",
  "okr.deleteConfirm": "Elimina set OKR",
  "okr.deleteConfirmBody": "Eliminando il set OKR vengono eliminati anche i suoi risultati chiave e le sue iniziative. Questa azione non può essere annullata.",
  "okr.noKeyResults": "Nessun risultato chiave ancora.",
  "okr.addKeyResult": "+ Aggiungi risultato chiave",
  "okr.addOkrSet": "Aggiungi set OKR",
  "initiative.header": "Iniziativa",
  "initiative.none": "Ancora nessuna iniziativa.",
  "initiative.new": "Nuovo progetto o iniziativa…",
  "initiative.add": "Aggiungi",
  "initiative.delete": "Elimina iniziativa",
  "initiative.secondary": "Secondaria",
  "initiative.secondaryFrom": "Secondaria — primaria su OKR {n}, KR {kr}",
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
  "initiatives.editTitle": "Modifica iniziativa",
  "initiatives.editDescription": "Aggiorna i dettagli dell'iniziativa o eliminala.",
  "initiatives.updated": "Iniziativa aggiornata",
  "initiatives.deleted": "Iniziativa eliminata",
  "initiatives.delete": "Elimina iniziativa",
  "initiatives.deleteConfirmTitle": "Eliminare questa iniziativa?",
  "initiatives.deleteConfirmBody": "Questa azione non può essere annullata.",
  "initiatives.open": "Apri iniziativa",
  "initiatives.form.secondaryKrs": "Risultati chiave secondari",
  "initiatives.form.addSecondaryKr": "Aggiungi risultato chiave",
  "initiatives.form.noSecondaryKrs": "Nessun risultato chiave secondario.",
  "initiatives.form.removeSecondaryKr": "Rimuovi",
  "initiatives.form.searchKr": "Cerca risultati chiave…",
  "initiative.link": "Collega iniziative",
  "initiative.linkDialog.title": "Collega iniziative a questo KR",
  "initiative.linkDialog.description": "Scegli quali iniziative del portfolio contribuiscono a questo risultato chiave. Le nuove iniziative si creano nel Portfolio.",
  "initiative.linkDialog.search": "Cerca iniziative…",
  "initiative.linkDialog.empty": "Nessuna iniziativa nel portfolio.",
  "initiative.linkDialog.role.none": "Nessuno",
  "initiative.linkDialog.role.secondary": "Secondaria",
  "initiative.linkDialog.role.primary": "Primaria",
  "initiative.linkDialog.primaryHint": "Impostare un'iniziativa come Primaria la sposta qui dal suo KR attuale.",
  "initiative.linkDialog.primaryLocked": "Modifica il collegamento primario nel dialogo del KR di destinazione.",
  "initiative.unlinkSecondary": "Rimuovi collegamento secondario",
  "initiative.createInPortfolio": "Le nuove iniziative si creano nel Portfolio.",
  "initiative.linksUpdated": "Collegamenti aggiornati",
  "initiatives.view.label": "Vista",
  "initiatives.view.board": "Vista consiglio",
  "initiatives.view.volunteer": "Vista volontari",
  "volunteer.openLead": "{n} iniziative sono aperte e cercano una persona.",
  "volunteer.group.lead": "Cerca una persona responsabile",
  "volunteer.group.helpers": "Cerca collaboratori",
  "volunteer.group.skill": "Cerca una competenza specifica",
  "volunteer.group.unscoped": "Non ancora definito",
  "volunteer.blocked": "Bloccate",
  "volunteer.parked": "Rinviate",
  "volunteer.blockedEmpty": "Nulla \u00e8 bloccato.",
  "volunteer.parkedEmpty": "Nulla \u00e8 rinviato.",
  "volunteer.lastUpdated": "Ultimo aggiornamento {date}",
  "volunteer.scopeMissing": "Ambito non specificato",
  "volunteer.noReason": "Motivo non indicato",
  "volunteer.empty": "Al momento non c'\u00e8 nulla di aperto.",
  "volunteer.groupEmpty": "Nessun elemento",
  "initiative.availability.open": "Aperta",
  "initiative.availability.blocked": "Bloccata",
  "initiative.availability.parked": "Rinviata",
  "initiative.commitment.one_off": "Una tantum, poche ore",
  "initiative.commitment.recurring": "Ricorrente, poche ore al mese",
  "initiative.commitment.workstream": "Filone di lavoro, guida per mesi",
  "initiative.helpNeeded.lead": "Cerca una persona responsabile",
  "initiative.helpNeeded.helpers": "Cerca collaboratori accanto alla persona responsabile",
  "initiative.helpNeeded.skill": "Cerca una competenza specifica",
  "initiatives.form.availability": "Disponibilit\u00e0",
  "initiatives.form.blockedReason": "Che cosa si sta aspettando?",
  "initiatives.form.blockedReasonPlaceholder": "p. es. in attesa di una decisione del consiglio",
  "initiatives.form.commitment": "Impegno",
  "initiatives.form.helpNeeded": "Aiuto richiesto",
  "initiatives.form.skillNote": "Quale competenza?",
  "initiatives.form.skillNotePlaceholder": "p. es. grafica, revisione legale",
  "initiatives.form.unspecified": "Non specificato",
  "initiatives.form.helpersOwnerHint": "I collaboratori affiancano una persona responsabile. Indicane una prima.",
  "initiatives.form.availabilityHint": "La disponibilit\u00e0 vale finch\u00e9 l'iniziativa \u00e8 pianificata.",


  "common.cancel": "Annulla",
  "common.create": "Crea",
  "common.creating": "Creazione…",
  "common.save": "Salva",
  "common.saving": "Salvataggio…",
  "common.delete": "Elimina",
  "common.deleting": "Eliminazione…",
  "lang.switcher": "Lingua",
  "banner.baselining":
    "Il 2026 è l'anno di definizione delle baseline. Il 2027 è l'anno di esecuzione. Tutte le baseline sono attese entro il 30.11.2026.",
  "scorecard.title": "Stato di misurazione 2026",
  "scorecard.instrument": "Strumento definito",
  "scorecard.baseline": "Baseline registrata",
  "scorecard.current": "Valore attuale con data",
  "scorecard.of": "di {total} key result",
  "kr.baseline2026": "Baseline 2026",
  "kr.current": "Attuale",
  "kr.target2027": "Obiettivo 2027",
  "kr.baselinePending": "Baseline in attesa",
  "kr.asAt": "al {date}",
  "kr.neverUpdated": "mai aggiornato",
  "kr.stale": "non aggiornato",
  "kr.measure": "Misura",
  "kr.instrument": "Strumento",
  "kr.instrumentMissing": "Strumento non definito",
  "kr.notMeasurable": "non ancora misurabile",
  "kr.progress": "Avanzamento",
  "kr.type": "Tipo",
  "kr.type.metric": "Metrica",
  "kr.type.milestone": "Milestone",
  "kr.milestoneStatus": "Stato della milestone",
  "kr.milestone.not_started": "Non iniziata",
  "kr.milestone.in_progress": "In corso",
  "kr.milestone.done": "Completata",
  "kr.milestoneDue": "Scadenza",
  "kr.originalTarget": "Obiettivo originale 2026 (dal documento di origine)",
  "kr.baselineLocked": "Baseline bloccata",
  "kr.baselineLockedHint": "Blocca la baseline 2026 una volta concordata.",
  "kr.measurePlaceholder": "Che cosa viene esattamente conteggiato?",
  "kr.instrumentPlaceholder": "es. Sondaggio annuale dei membri",

  // board report
  "report.nav": "Rapporto",
  "report.eyebrow": "IL CHAPTER SVIZZERO DI ICF · RAPPORTO AL CONSIGLIO",
  "report.title": "Rapporto OKR al consiglio 2026–2027",
  "report.subtitle": "Un'istantanea stampabile di obiettivi, key result, maturità della misurazione e portafoglio di iniziative.",
  "report.generated": "Generato dalla dashboard OKR ICFS il {date} alle {time}. La dashboard è la fonte ufficiale. Questo documento è un'istantanea ed è superato dalla dashboard in caso di divergenza.",
  "report.download": "Scarica PDF",
  "report.summary.objectives": "Obiettivi",
  "report.summary.keyResults": "Key result",
  "report.summary.metric": "Key result metrici",
  "report.summary.milestone": "Key result milestone",
  "report.summary.initiatives": "Iniziative",
  "report.readiness.title": "Maturità della misurazione",
  "report.readiness.context": "Il 2026 è un anno di baseline. Questo rapporto mostra quanto del sistema di misurazione esiste, non l'avanzamento dell'esecuzione — le percentuali sarebbero pari a zero per costruzione. Le baseline sono attese entro il 30.11.2026.",
  "report.readiness.axis": "conteggio su {total} key result metrici",
  "report.byObjective.title": "Maturità per obiettivo",
  "report.byObjective.total": "Key result metrici",
  "report.byObjective.instrument": "Con strumento",
  "report.byObjective.baseline": "Con baseline",
  "report.portfolio.title": "Portafoglio di iniziative per obiettivo",
  "report.portfolio.gap": "{count} key result senza iniziativa: {list}",
  "report.portfolio.noGap": "Ogni key result ha almeno un'iniziativa.",
  "report.sfa.title": "Contributo alle aree strategiche",
  "report.sfa.legend": "Pieno = contributo primario · Contorno = contributo secondario · Trattino = nessuno",
  "report.sfa.pillar": "Pilastro ICFS",
  "report.sfa.how": "Come contribuisce",
  "report.table.kr": "KR",
  "report.table.keyResult": "Key result",
  "report.table.baseline": "Baseline 2026",
  "report.table.target": "Target 2027",
  "report.table.lead": "Lead",
  "report.meta.steward": "Steward",
  "report.meta.focus": "Aree strategiche",
  "report.objective.footer": "{initiatives} iniziative · {gap} key result senza iniziativa",
  "report.open.title": "Punti aperti",
  "report.open.noInstrument": "Key result senza strumento",
  "report.open.noBaseline": "Key result metrici senza baseline 2026",
  "report.open.noLead": "Key result senza lead",
  "report.open.noInitiatives": "Key result senza iniziativa",
  "report.open.none": "Nessuno",
  "report.provenance": "Generato il {date} alle {time} · Fonte: {url}",
  "report.value.pending": "In attesa",
  "report.value.afterBaseline": "Definito dopo la baseline",
  "report.value.notDefined": "Non ancora definito",
  "report.value.unassigned": "Non assegnato",
  "report.kr.milestone": "Milestone",
  "report.kr.due": "Scadenza {date}",


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
