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
  | "playground.nav"
  | "playground.title"
  | "playground.intro"
  | "playground.badge"
  | "playground.mode.objective.title"
  | "playground.mode.objective.desc"
  | "playground.mode.kr.title"
  | "playground.mode.kr.desc"
  | "playground.mode.initiative.title"
  | "playground.mode.initiative.desc"
  | "playground.start"
  | "playground.clear"
  | "playground.notSaved"
  | "playground.draftLabel"
  | "playground.wizard.step"
  | "playground.wizard.of"
  | "playground.wizard.hint"
  | "playground.wizard.placeholder"
  | "playground.wizard.back"
  | "playground.wizard.continue"
  | "playground.wizard.restart"
  | "playground.wizard.generate"
  | "playground.wizard.generating"
  | "playground.q.objective.1"
  | "playground.q.objective.2"
  | "playground.q.objective.3"
  | "playground.q.kr.1"
  | "playground.q.kr.2"
  | "playground.q.kr.3"
  | "playground.q.initiative.1"
  | "playground.q.initiative.2"
  | "playground.q.initiative.3"
  | "playground.result.heading"
  | "playground.result.note"
  | "playground.result.tag"
  | "playground.result.objective.a.title"
  | "playground.result.objective.b.title"
  | "playground.result.objective.note.title"
  | "playground.result.objective.note.body"
  | "playground.result.kr.metric.title"
  | "playground.result.kr.milestone.title"
  | "playground.result.kr.note.title"
  | "playground.result.kr.note.body"
  | "playground.result.initiative.a.title"
  | "playground.result.initiative.b.title"
  | "playground.result.initiative.note.title"
  | "playground.result.initiative.note.body"
  | "playground.tpl.for"
  | "playground.tpl.by"
  | "playground.tpl.who"
  | "playground.tpl.byEnd"
  | "playground.tpl.measure"
  | "playground.tpl.evidence"
  | "playground.tpl.supports"
  | "playground.tpl.milestone"
  | "playground.tpl.moves"
  | "playground.tpl.constraints"
  | "playground.tpl.smallStep"
  | "playground.metaTitle"
  | "playground.metaDescription"
  | "playground.card.why"
  | "playground.card.watch"
  | "playground.card.tryAnother"
  | "playground.card.edit"
  | "playground.card.save"
  | "playground.card.cancel"
  | "playground.card.copy"
  | "playground.card.copied"
  | "playground.card.copyFailed"
  | "playground.card.variant"
  | "playground.quality.strong"
  | "playground.quality.usable"
  | "playground.quality.refine"
  | "playground.edu.heading"
  | "playground.edu.objective"
  | "playground.edu.kr"
  | "playground.edu.initiative"
  | "playground.example.heading"
  | "playground.example.weakLabel"
  | "playground.example.weak"
  | "playground.example.feedbackLabel"
  | "playground.example.feedback"
  | "playground.example.improvedLabel"
  | "playground.example.improved"
  | "playground.why.objective-a"
  | "playground.why.objective-b"
  | "playground.why.kr-metric"
  | "playground.why.kr-milestone"
  | "playground.why.initiative-a"
  | "playground.why.initiative-b"
  | "playground.watch.objective-a"
  | "playground.watch.objective-b"
  | "playground.watch.kr-metric"
  | "playground.watch.kr-milestone"
  | "playground.watch.initiative-a"
  | "playground.watch.initiative-b"
  | "playground.check.heading"
  | "playground.check.disclaimer"
  | "playground.check.obj.task.title"
  | "playground.check.obj.task.body"
  | "playground.check.obj.multi.title"
  | "playground.check.obj.multi.body"
  | "playground.check.obj.beneficiary.title"
  | "playground.check.obj.beneficiary.body"
  | "playground.check.kr.activity.title"
  | "playground.check.kr.activity.body"
  | "playground.check.kr.measure.title"
  | "playground.check.kr.measure.body"
  | "playground.check.kr.baseline.title"
  | "playground.check.kr.baseline.body"
  | "playground.check.kr.instrument.title"
  | "playground.check.kr.instrument.body"
  | "playground.check.init.target.title"
  | "playground.check.init.target.body"
  | "playground.check.init.parent.title"
  | "playground.check.init.parent.body"
  | "playground.check.init.owner.title"
  | "playground.check.init.owner.body"
  | "playground.check.ok.title"
  | "playground.check.ok.body"
  | "playground.chain.cta.title"
  | "playground.chain.cta.desc"
  | "playground.chain.cta.start"
  | "playground.chain.cta.resume"
  | "playground.chain.standalone.title"
  | "playground.chain.standalone.desc"
  | "playground.chain.step.objective"
  | "playground.chain.step.kr"
  | "playground.chain.step.initiatives"
  | "playground.chain.step.review"
  | "playground.chain.step.done"
  | "playground.chain.step.current"
  | "playground.chain.step.locked"
  | "playground.chain.use"
  | "playground.chain.selectedObjective"
  | "playground.chain.selectedKr"
  | "playground.chain.includedInitiative"
  | "playground.chain.continueKr"
  | "playground.chain.continueInit"
  | "playground.chain.continueReview"
  | "playground.chain.contextObjective"
  | "playground.chain.contextKr"
  | "playground.chain.summary.heading"
  | "playground.chain.summary.badge"
  | "playground.chain.summary.initiatives"
  | "playground.chain.edit.objective"
  | "playground.chain.edit.kr"
  | "playground.chain.edit.initiatives"
  | "playground.chain.copy"
  | "playground.chain.copied"
  | "playground.chain.copyFailed"
  | "playground.chain.new"
  | "playground.chain.confirm.title"
  | "playground.chain.confirm.objective"
  | "playground.chain.confirm.kr"
  | "playground.chain.confirm.continue"
  | "playground.chain.confirm.cancel"
  | "playground.chain.note.objToKr"
  | "playground.chain.note.krToInit"
  | "playground.chain.note.review"
  | "playground.chain.wizard.objective"
  | "playground.chain.wizard.kr"
  | "playground.chain.wizard.initiative"
  | "playground.handoff.signIn"
  | "playground.handoff.noRights"
  | "playground.handoff.use"
  | "playground.handoff.editorHint"
  | "playground.handoff.openDashboard"
  | "playground.handoff.notSavedNote"
  | "playground.handoff.close"
  | "playground.handoff.restored.title"
  | "playground.handoff.restored.body"
  | "playground.handoff.restored.dismiss"
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
  "kr.deleteConfirmBody":
    "This will permanently delete the key result and its initiatives. This action cannot be undone.",
  "kr.delete": "Delete key result",
  "okr.customer": "Customer:",
  "okr.delete": "Delete OKR set",
  "okr.deleteConfirm": "Delete OKR set",
  "okr.deleteConfirmBody":
    "Deleting this OKR set also deletes its key results and initiatives. This action cannot be undone.",
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
  "initiative.linkDialog.description":
    "Choose which portfolio initiatives contribute to this key result. Create new initiatives from the Portfolio.",
  "initiative.linkDialog.search": "Search initiatives…",
  "initiative.linkDialog.empty": "No initiatives in the portfolio yet.",
  "initiative.linkDialog.role.none": "None",
  "initiative.linkDialog.role.secondary": "Secondary",
  "initiative.linkDialog.role.primary": "Primary",
  "initiative.linkDialog.primaryHint":
    "Setting an initiative as Primary moves it here from its current KR.",
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
  "playground.nav": "OKR Playground",
  "playground.title": "OKR Playground",
  "playground.intro":
    "Explore how Objectives, Key Results, and Initiatives work. Your practice drafts are not saved and do not affect the live ICFS OKR dashboard.",
  "playground.badge": "Practice area · Nothing you do here changes live OKRs",
  "playground.mode.objective.title": "Create an Objective",
  "playground.mode.objective.desc":
    "An objective states, as an outcome, what the chapter wants to achieve for a specific customer.",
  "playground.mode.kr.title": "Create a Key Result",
  "playground.mode.kr.desc":
    "A key result makes progress on an objective measurable, from a baseline towards a target.",
  "playground.mode.initiative.title": "Ideate Initiatives",
  "playground.mode.initiative.desc":
    "An initiative is the concrete piece of work someone takes on to move a key result.",
  "playground.start": "Start exploring",
  "playground.clear": "Clear",
  "playground.notSaved": "Nothing on this page is saved.",
  "playground.draftLabel": "Practice draft",
  "playground.wizard.step": "Step",
  "playground.wizard.of": "of",
  "playground.wizard.hint": "Short and plain language is fine — this is practice.",
  "playground.wizard.placeholder": "Write a sentence or two…",
  "playground.wizard.back": "Back",
  "playground.wizard.continue": "Continue",
  "playground.wizard.restart": "Start again",
  "playground.wizard.generate": "Generate practice drafts",
  "playground.wizard.generating": "Drafting suggestions…",
  "playground.q.objective.1": "What strategic change do you want to create?",
  "playground.q.objective.2": "Who should benefit from that change?",
  "playground.q.objective.3": "What should be different by the end of the period?",
  "playground.q.kr.1": "What Objective does this support?",
  "playground.q.kr.2": "What evidence would show success?",
  "playground.q.kr.3": "How could this be measured or observed?",
  "playground.q.initiative.1": "What Key Result should this help move?",
  "playground.q.initiative.2": "What kind of work could contribute?",
  "playground.q.initiative.3": "What constraints, skills, or capacity matter?",
  "playground.result.heading": "Practice drafts",
  "playground.result.note":
    "These examples are generated locally from your answers. Nothing is saved and no live OKR is affected.",
  "playground.result.tag": "Practice draft",
  "playground.result.objective.a.title": "Outcome-style objective",
  "playground.result.objective.b.title": "End-state phrasing",
  "playground.result.objective.note.title": "What to sharpen",
  "playground.result.objective.note.body":
    "Name one customer group, describe an outcome rather than an activity, and make sure the change is visible by the end of the period.",
  "playground.result.kr.metric.title": "Metric-style key result",
  "playground.result.kr.milestone.title": "Milestone-style key result",
  "playground.result.kr.note.title": "Measurement note",
  "playground.result.kr.note.body":
    "Set a baseline before the target, agree who reads the number, and state how often it is updated.",
  "playground.result.initiative.a.title": "Initiative idea",
  "playground.result.initiative.b.title": "Smaller first step",
  "playground.result.initiative.note.title": "Commitment and help",
  "playground.result.initiative.note.body":
    "Decide whether this is a one-off, recurring or a workstream, and whether it needs a lead, helpers or a specific skill.",
  "playground.tpl.for": "for",
  "playground.tpl.by": "By the end of the period",
  "playground.tpl.who": "Who benefits",
  "playground.tpl.byEnd": "By the end of the period",
  "playground.tpl.measure": "Measured by",
  "playground.tpl.evidence": "Evidence",
  "playground.tpl.supports": "Supports",
  "playground.tpl.milestone": "Milestone",
  "playground.tpl.moves": "moves",
  "playground.tpl.constraints": "Constraints",
  "playground.tpl.smallStep": "First step",
  "playground.metaTitle": "OKR Playground — The Switzerland Chapter of ICF",
  "playground.metaDescription":
    "A public practice area for drafting objectives, key results and initiatives. Nothing is saved and no live data is affected.",
  "report.eyebrow": "THE SWITZERLAND CHAPTER OF ICF · BOARD REPORT",
  "report.title": "OKR board report 2026–2027",
  "report.subtitle":
    "A printable snapshot of objectives, key results, measurement readiness and the initiative portfolio.",
  "report.generated":
    "Generated from the ICFS OKR dashboard on {date} at {time}. The dashboard is the system of record. This document is a snapshot and is superseded by the dashboard whenever the two disagree.",
  "report.download": "Download PDF",
  "report.summary.objectives": "Objectives",
  "report.summary.keyResults": "Key results",
  "report.summary.metric": "Metric key results",
  "report.summary.milestone": "Milestone key results",
  "report.summary.initiatives": "Initiatives",
  "report.readiness.title": "Measurement readiness",
  "report.readiness.context":
    "2026 is a baselining year. This report shows how much of the measurement system exists, not how far execution has progressed — progress figures would read zero by design. Baselines are due 30.11.2026.",
  "report.readiness.axis": "count of {total} metric key results",
  "report.byObjective.title": "Readiness by objective",
  "report.byObjective.total": "Metric key results",
  "report.byObjective.instrument": "With instrument",
  "report.byObjective.baseline": "With baseline",
  "report.portfolio.title": "Initiative portfolio by objective",
  "report.portfolio.gap": "{count} key results have no initiative: {list}",
  "report.portfolio.noGap": "Every key result has at least one initiative.",
  "report.sfa.title": "Strategic focus area contribution",
  "report.sfa.legend":
    "Filled = primary contribution · Outline = secondary contribution · Dash = none",
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

  "playground.card.why": "Why this works",
  "playground.card.watch": "Watch for",
  "playground.card.tryAnother": "Try another version",
  "playground.card.edit": "Edit this draft",
  "playground.card.save": "Apply",
  "playground.card.cancel": "Cancel",
  "playground.card.copy": "Copy draft",
  "playground.card.copied": "Copied",
  "playground.card.copyFailed": "Copy not available",
  "playground.card.variant": "Version",
  "playground.quality.strong": "Strong",
  "playground.quality.usable": "Usable with edits",
  "playground.quality.refine": "Needs refinement",
  "playground.edu.heading": "How these pieces differ",
  "playground.edu.objective": "An Objective describes meaningful change. It is not a task list.",
  "playground.edu.kr":
    "A Key Result describes measurable evidence of progress or success. It is not an activity.",
  "playground.edu.initiative":
    "An Initiative is work that may help move a Key Result. It is not the result itself.",
  "playground.example.heading": "Weak versus improved",
  "playground.example.weakLabel": "Weak",
  "playground.example.weak": "Launch community events",
  "playground.example.feedbackLabel": "Feedback",
  "playground.example.feedback":
    "This describes work, so it is an Initiative rather than a Key Result.",
  "playground.example.improvedLabel": "Improved",
  "playground.example.improved":
    "Increase unique member participation in community events by 25% by year-end.",
  "playground.why.objective-a":
    "It names the change and the people it is for, so the outcome stays clear.",
  "playground.why.objective-b":
    "It describes an end state, which makes progress easier to recognise.",
  "playground.why.kr-metric": "It points to something observable, so progress can be checked.",
  "playground.why.kr-milestone":
    "It fixes a visible step, which helps when no number is available yet.",
  "playground.why.initiative-a": "It links concrete work to the result it is meant to move.",
  "playground.why.initiative-b": "It is small enough to start, which keeps momentum realistic.",
  "playground.watch.objective-a": "Check that this is an outcome and not a list of activities.",
  "playground.watch.objective-b": "Make sure the end state is visible by the end of the period.",
  "playground.watch.kr-metric": "Add a baseline and a target, and agree who reads the number.",
  "playground.watch.kr-milestone":
    "A milestone should still show evidence, not only that work happened.",
  "playground.watch.initiative-a":
    "An initiative is not the result itself; keep the key result separate.",
  "playground.watch.initiative-b": "Name who takes it on, otherwise the step stays an idea.",
  "playground.check.heading": "Quality checks",
  "playground.check.disclaimer":
    "These checks are simple pattern hints, not a verdict. Use your judgement.",
  "playground.check.obj.task.title": "Possible task language",
  "playground.check.obj.task.body":
    "Words such as launch, build, create, run or deliver often describe work. An Objective usually describes the change you want to see.",
  "playground.check.obj.multi.title": "Possibly several changes at once",
  "playground.check.obj.multi.body":
    "This draft seems to join several changes. Consider splitting it so each Objective carries one clear intent.",
  "playground.check.obj.beneficiary.title": "Beneficiary not evident",
  "playground.check.obj.beneficiary.body":
    "No audience or stakeholder is visible. Naming who benefits, as the Customer of this Objective, makes the intent easier to share.",
  "playground.check.kr.activity.title": "Possible activity language",
  "playground.check.kr.activity.body":
    "Words such as launch, create, hold, run, develop, publish or organise usually describe an Initiative. A Key Result describes the evidence of progress.",
  "playground.check.kr.measure.title": "Measurement logic unclear",
  "playground.check.kr.measure.body":
    "No number, percentage, count, score, date, milestone or observable evidence is visible. Consider how progress would be recognised.",
  "playground.check.kr.baseline.title": "Baseline missing",
  "playground.check.kr.baseline.body":
    "No starting point was entered. A Baseline makes the Target meaningful.",
  "playground.check.kr.instrument.title": "Instrument not defined",
  "playground.check.kr.instrument.body":
    "No evidence source or observation method was entered. Naming the Instrument shows where the value will come from.",
  "playground.check.init.target.title": "Looks like a measurable target",
  "playground.check.init.target.body":
    "This reads like a Key Result rather than work. An Initiative describes what will be done to move a Key Result.",
  "playground.check.init.parent.title": "Parent Key Result missing",
  "playground.check.init.parent.body":
    "No Key Result was named. Linking an Initiative to a Key Result keeps the contribution visible.",
  "playground.check.init.owner.title": "Owner or effort not stated",
  "playground.check.init.owner.body":
    "No Steward, role or effort estimate is visible. A rough owner and size make the work easier to plan.",
  "playground.check.ok.title": "No issues detected",
  "playground.check.ok.body":
    "These simple checks found nothing to flag. That is a good sign, not a guarantee of quality.",
  "playground.chain.cta.title": "Build an OKR chain",
  "playground.chain.cta.desc":
    "Start with an Objective, create measurable Key Results, then explore Initiatives that could move them.",
  "playground.chain.cta.start": "Build an OKR chain",
  "playground.chain.cta.resume": "Continue your OKR chain",
  "playground.chain.standalone.title": "Start a standalone exercise",
  "playground.chain.standalone.desc":
    "Practise a single building block on its own, without connecting it to a chain.",
  "playground.chain.step.objective": "Objective",
  "playground.chain.step.kr": "Key Results",
  "playground.chain.step.initiatives": "Initiatives",
  "playground.chain.step.review": "Review",
  "playground.chain.step.done": "Completed",
  "playground.chain.step.current": "Current step",
  "playground.chain.step.locked": "Not available yet",
  "playground.chain.use": "Use for this OKR chain",
  "playground.chain.selectedObjective": "Selected Objective",
  "playground.chain.selectedKr": "Selected Key Result",
  "playground.chain.includedInitiative": "Included Initiative",
  "playground.chain.continueKr": "Create Key Results for this Objective",
  "playground.chain.continueInit": "Ideate Initiatives for this Key Result",
  "playground.chain.continueReview": "Review your practice chain",
  "playground.chain.contextObjective": "Objective",
  "playground.chain.contextKr": "Key Result",
  "playground.chain.summary.heading": "Your practice OKR chain",
  "playground.chain.summary.badge": "Practice chain · Not saved",
  "playground.chain.summary.initiatives": "Included Initiatives",
  "playground.chain.edit.objective": "Edit Objective",
  "playground.chain.edit.kr": "Edit Key Result",
  "playground.chain.edit.initiatives": "Edit Initiatives",
  "playground.chain.copy": "Copy full chain",
  "playground.chain.copied": "Chain copied",
  "playground.chain.copyFailed": "Copy not available",
  "playground.chain.new": "Start a new chain",
  "playground.chain.confirm.title": "Change this selection?",
  "playground.chain.confirm.objective":
    "Changing the Objective will clear the Key Results and Initiatives in this practice chain. Continue?",
  "playground.chain.confirm.kr":
    "Changing the Key Result will clear the Initiatives in this practice chain. Continue?",
  "playground.chain.confirm.continue": "Continue",
  "playground.chain.confirm.cancel": "Keep current selection",
  "playground.chain.note.objToKr":
    "Key Results make success on this Objective observable and measurable.",
  "playground.chain.note.krToInit":
    "Initiatives are possible work that may move this Key Result; they are not success measures themselves.",
  "playground.chain.note.review":
    "A useful OKR chain connects a meaningful change, evidence of progress, and focused work.",
  "playground.chain.wizard.objective": "Objective step",
  "playground.chain.wizard.kr": "Key Result step",
  "playground.chain.wizard.initiative": "Initiative step",
  "playground.handoff.signIn": "Sign in to use this draft in an OKR set",
  "playground.handoff.noRights":
    "You can copy this draft; edit permission is required to use it in a live OKR set",
  "playground.handoff.use": "Use this draft in an OKR set",
  "playground.handoff.editorHint":
    "Choose an OKR Set, Objective, or Key Result from the live dashboard to insert this draft.",
  "playground.handoff.openDashboard": "Open the OKR dashboard",
  "playground.handoff.notSavedNote":
    "Signing in does not save this draft. Nothing here is written to live OKR data.",
  "playground.handoff.close": "Close",
  "playground.handoff.restored.title": "Practice draft kept for this session",
  "playground.handoff.restored.body":
    "This draft was kept in your browser only, so you could find it again after signing in. It is not saved to any OKR set.",
  "playground.handoff.restored.dismiss": "Dismiss",
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
  "kr.detailDescription": "Verantwortetes Ergebnis und die Projekte, die es liefern.",
  "kr.deleteConfirm": "Dieses Key Result und seine Initiativen löschen?",
  "kr.deleteConfirmBody":
    "Das Key Result und seine Initiativen werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
  "kr.delete": "Key Result löschen",
  "okr.customer": "Kunde:",
  "okr.delete": "OKR-Set löschen",
  "okr.deleteConfirm": "OKR-Set löschen",
  "okr.deleteConfirmBody":
    "Mit dem OKR-Set werden auch seine Key Results und Initiativen gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
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
  "initiative.linkDialog.description":
    "Wähle, welche Portfolio-Initiativen zu diesem Key Result beitragen. Neue Initiativen werden im Portfolio erstellt.",
  "initiative.linkDialog.search": "Initiativen suchen…",
  "initiative.linkDialog.empty": "Noch keine Initiativen im Portfolio.",
  "initiative.linkDialog.role.none": "Keine",
  "initiative.linkDialog.role.secondary": "Sekundär",
  "initiative.linkDialog.role.primary": "Primär",
  "initiative.linkDialog.primaryHint":
    "Wird eine Initiative als Primär gesetzt, wechselt sie von ihrem bisherigen KR hierher.",
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
  "initiatives.form.helpersOwnerHint":
    "Mitwirkende unterst\u00fctzen eine Leitung. Bitte zuerst eine verantwortliche Person eintragen.",
  "initiatives.form.availabilityHint":
    "Die Verf\u00fcgbarkeit gilt, solange die Initiative geplant ist.",

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
  "playground.nav": "OKR-Playground",
  "playground.title": "OKR-Playground",
  "playground.intro":
    "Entdecken Sie, wie Objectives, Key Results und Initiativen zusammenspielen. Ihre Übungsentwürfe werden nicht gespeichert und wirken sich nicht auf das ICFS-OKR-Dashboard aus.",
  "playground.badge": "Übungsbereich · Nichts hier verändert die echten OKR",
  "playground.mode.objective.title": "Ein Objective erstellen",
  "playground.mode.objective.desc":
    "Ein Objective beschreibt als Ergebnis, was das Chapter für eine bestimmte Zielgruppe erreichen will.",
  "playground.mode.kr.title": "Ein Key Result erstellen",
  "playground.mode.kr.desc":
    "Ein Key Result macht den Fortschritt eines Objectives messbar, von einem Ausgangswert bis zum Zielwert.",
  "playground.mode.initiative.title": "Initiativen entwickeln",
  "playground.mode.initiative.desc":
    "Eine Initiative ist die konkrete Arbeit, die jemand übernimmt, um ein Key Result voranzubringen.",
  "playground.start": "Jetzt ausprobieren",
  "playground.clear": "Zurücksetzen",
  "playground.notSaved": "Auf dieser Seite wird nichts gespeichert.",
  "playground.draftLabel": "Übungsentwurf",
  "playground.wizard.step": "Schritt",
  "playground.wizard.of": "von",
  "playground.wizard.hint": "Kurz und in einfacher Sprache genügt — das ist eine Übung.",
  "playground.wizard.placeholder": "Schreiben Sie ein bis zwei Sätze…",
  "playground.wizard.back": "Zurück",
  "playground.wizard.continue": "Weiter",
  "playground.wizard.restart": "Neu beginnen",
  "playground.wizard.generate": "Übungsentwürfe erzeugen",
  "playground.wizard.generating": "Vorschläge werden entworfen…",
  "playground.q.objective.1": "Welche strategische Veränderung wollen Sie bewirken?",
  "playground.q.objective.2": "Wer soll von dieser Veränderung profitieren?",
  "playground.q.objective.3": "Was soll am Ende der Periode anders sein?",
  "playground.q.kr.1": "Welches Objective unterstützt dieses Key Result?",
  "playground.q.kr.2": "Welche Belege würden Erfolg zeigen?",
  "playground.q.kr.3": "Wie liesse sich das messen oder beobachten?",
  "playground.q.initiative.1": "Welches Key Result soll diese Initiative voranbringen?",
  "playground.q.initiative.2": "Welche Art von Arbeit könnte dazu beitragen?",
  "playground.q.initiative.3":
    "Welche Rahmenbedingungen, Fähigkeiten oder Kapazitäten sind wichtig?",
  "playground.result.heading": "Übungsentwürfe",
  "playground.result.note":
    "Diese Beispiele entstehen lokal aus Ihren Antworten. Nichts wird gespeichert, echte OKR bleiben unberührt.",
  "playground.result.tag": "Übungsentwurf",
  "playground.result.objective.a.title": "Objective als Ergebnis formuliert",
  "playground.result.objective.b.title": "Formulierung als Zielzustand",
  "playground.result.objective.note.title": "Was noch schärfer werden kann",
  "playground.result.objective.note.body":
    "Nennen Sie eine Zielgruppe, beschreiben Sie ein Ergebnis statt einer Aktivität und stellen Sie sicher, dass die Veränderung bis zum Ende der Periode sichtbar ist.",
  "playground.result.kr.metric.title": "Key Result mit Kennzahl",
  "playground.result.kr.milestone.title": "Key Result als Meilenstein",
  "playground.result.kr.note.title": "Hinweis zur Messung",
  "playground.result.kr.note.body":
    "Legen Sie zuerst einen Ausgangswert fest, klären Sie, wer die Zahl liest, und halten Sie fest, wie oft sie aktualisiert wird.",
  "playground.result.initiative.a.title": "Idee für eine Initiative",
  "playground.result.initiative.b.title": "Kleinerer erster Schritt",
  "playground.result.initiative.note.title": "Aufwand und Unterstützung",
  "playground.result.initiative.note.body":
    "Entscheiden Sie, ob es sich um eine einmalige, wiederkehrende oder laufende Arbeit handelt und ob eine Leitung, Mithilfe oder eine bestimmte Fähigkeit nötig ist.",
  "playground.tpl.for": "für",
  "playground.tpl.by": "Bis zum Ende der Periode",
  "playground.tpl.who": "Zielgruppe",
  "playground.tpl.byEnd": "Bis zum Ende der Periode",
  "playground.tpl.measure": "Gemessen an",
  "playground.tpl.evidence": "Belege",
  "playground.tpl.supports": "Unterstützt",
  "playground.tpl.milestone": "Meilenstein",
  "playground.tpl.moves": "bewegt",
  "playground.tpl.constraints": "Rahmenbedingungen",
  "playground.tpl.smallStep": "Erster Schritt",
  "playground.metaTitle": "OKR-Playground — The Switzerland Chapter of ICF",
  "playground.metaDescription":
    "Ein öffentlicher Übungsbereich für Objectives, Key Results und Initiativen. Nichts wird gespeichert, echte Daten bleiben unberührt.",
  "report.eyebrow": "DAS SCHWEIZER CHAPTER DER ICF · VORSTANDSBERICHT",
  "report.title": "OKR-Vorstandsbericht 2026–2027",
  "report.subtitle":
    "Eine druckbare Momentaufnahme von Zielen, Key Results, Messbereitschaft und Initiativenportfolio.",
  "report.generated":
    "Erstellt aus dem ICFS-OKR-Dashboard am {date} um {time}. Das Dashboard ist die massgebliche Quelle. Dieses Dokument ist eine Momentaufnahme und wird durch das Dashboard ersetzt, sobald beide voneinander abweichen.",
  "report.download": "PDF herunterladen",
  "report.summary.objectives": "Ziele",
  "report.summary.keyResults": "Key Results",
  "report.summary.metric": "Metrische Key Results",
  "report.summary.milestone": "Milestone-Key-Results",
  "report.summary.initiatives": "Initiativen",
  "report.readiness.title": "Messbereitschaft",
  "report.readiness.context":
    "2026 ist ein Baselining-Jahr. Dieser Bericht zeigt, wie weit das Messsystem aufgebaut ist, nicht den Umsetzungsfortschritt — Fortschrittswerte wären bewusst null. Baselines sind bis 30.11.2026 fällig.",
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

  "playground.card.why": "Warum das funktioniert",
  "playground.card.watch": "Worauf zu achten ist",
  "playground.card.tryAnother": "Andere Version zeigen",
  "playground.card.edit": "Entwurf bearbeiten",
  "playground.card.save": "Übernehmen",
  "playground.card.cancel": "Abbrechen",
  "playground.card.copy": "Entwurf kopieren",
  "playground.card.copied": "Kopiert",
  "playground.card.copyFailed": "Kopieren nicht möglich",
  "playground.card.variant": "Version",
  "playground.quality.strong": "Stark",
  "playground.quality.usable": "Mit Anpassungen nutzbar",
  "playground.quality.refine": "Muss geschärft werden",
  "playground.edu.heading": "Wie sich diese Bausteine unterscheiden",
  "playground.edu.objective":
    "Ein Objective beschreibt eine bedeutsame Veränderung. Es ist keine Aufgabenliste.",
  "playground.edu.kr":
    "Ein Key Result beschreibt messbare Belege für Fortschritt oder Erfolg. Es ist keine Aktivität.",
  "playground.edu.initiative":
    "Eine Initiative ist Arbeit, die ein Key Result voranbringen kann. Sie ist nicht das Ergebnis selbst.",
  "playground.example.heading": "Schwach gegenüber verbessert",
  "playground.example.weakLabel": "Schwach",
  "playground.example.weak": "Community-Events durchführen",
  "playground.example.feedbackLabel": "Rückmeldung",
  "playground.example.feedback":
    "Das beschreibt Arbeit und ist damit eine Initiative und kein Key Result.",
  "playground.example.improvedLabel": "Verbessert",
  "playground.example.improved":
    "Die Zahl der teilnehmenden Mitglieder an Community-Events bis Jahresende um 25 % steigern.",
  "playground.why.objective-a":
    "Es benennt die Veränderung und die Zielgruppe, dadurch bleibt das Ergebnis klar.",
  "playground.why.objective-b":
    "Es beschreibt einen Zielzustand, dadurch lässt sich Fortschritt leichter erkennen.",
  "playground.why.kr-metric":
    "Es verweist auf etwas Beobachtbares, dadurch ist Fortschritt überprüfbar.",
  "playground.why.kr-milestone":
    "Es hält einen sichtbaren Schritt fest, was hilft, wenn noch keine Zahl vorliegt.",
  "playground.why.initiative-a":
    "Es verbindet konkrete Arbeit mit dem Ergebnis, das sie bewegen soll.",
  "playground.why.initiative-b": "Es ist klein genug, um zu starten, und bleibt damit realistisch.",
  "playground.watch.objective-a":
    "Prüfen Sie, ob das ein Ergebnis ist und keine Liste von Aktivitäten.",
  "playground.watch.objective-b":
    "Stellen Sie sicher, dass der Zielzustand bis zum Ende der Periode sichtbar ist.",
  "playground.watch.kr-metric":
    "Ergänzen Sie Ausgangswert und Zielwert und klären Sie, wer die Zahl liest.",
  "playground.watch.kr-milestone":
    "Auch ein Meilenstein sollte Belege zeigen, nicht nur, dass gearbeitet wurde.",
  "playground.watch.initiative-a":
    "Eine Initiative ist nicht das Ergebnis selbst; halten Sie das Key Result getrennt.",
  "playground.watch.initiative-b":
    "Benennen Sie, wer das übernimmt, sonst bleibt der Schritt eine Idee.",
  "playground.check.heading": "Qualitätsprüfungen",
  "playground.check.disclaimer":
    "Diese Prüfungen sind einfache Muster-Hinweise, kein Urteil. Nutzen Sie Ihr eigenes Urteilsvermögen.",
  "playground.check.obj.task.title": "Möglicherweise Aufgaben-Sprache",
  "playground.check.obj.task.body":
    "Wörter wie lancieren, aufbauen, erstellen, durchführen oder liefern beschreiben oft Arbeit. Ein Objective beschreibt in der Regel die angestrebte Veränderung.",
  "playground.check.obj.multi.title": "Möglicherweise mehrere Veränderungen zugleich",
  "playground.check.obj.multi.body":
    "Dieser Entwurf verbindet offenbar mehrere Veränderungen. Erwägen Sie eine Aufteilung, damit jedes Objective eine klare Absicht trägt.",
  "playground.check.obj.beneficiary.title": "Zielgruppe nicht erkennbar",
  "playground.check.obj.beneficiary.body":
    "Es ist keine Zielgruppe oder Anspruchsgruppe sichtbar. Wer als Customer profitiert, macht die Absicht leichter vermittelbar.",
  "playground.check.kr.activity.title": "Möglicherweise Aktivitäts-Sprache",
  "playground.check.kr.activity.body":
    "Wörter wie lancieren, erstellen, durchführen, entwickeln, veröffentlichen oder organisieren beschreiben meist eine Initiative. Ein Key Result beschreibt den Beleg für Fortschritt.",
  "playground.check.kr.measure.title": "Messlogik unklar",
  "playground.check.kr.measure.body":
    "Es ist keine Zahl, kein Prozentwert, keine Anzahl, kein Score, kein Datum, kein Meilenstein und kein beobachtbarer Beleg sichtbar. Überlegen Sie, woran Fortschritt erkennbar wäre.",
  "playground.check.kr.baseline.title": "Baseline fehlt",
  "playground.check.kr.baseline.body":
    "Es wurde kein Ausgangspunkt erfasst. Eine Baseline macht das Target aussagekräftig.",
  "playground.check.kr.instrument.title": "Instrument nicht definiert",
  "playground.check.kr.instrument.body":
    "Es wurde keine Belegquelle oder Beobachtungsmethode erfasst. Ein benanntes Instrument zeigt, woher der Wert stammt.",
  "playground.check.init.target.title": "Wirkt wie ein messbares Ziel",
  "playground.check.init.target.body":
    "Das liest sich eher wie ein Key Result als wie Arbeit. Eine Initiative beschreibt, was getan wird, um ein Key Result zu bewegen.",
  "playground.check.init.parent.title": "Übergeordnetes Key Result fehlt",
  "playground.check.init.parent.body":
    "Es wurde kein Key Result genannt. Die Verknüpfung hält den Beitrag der Initiative sichtbar.",
  "playground.check.init.owner.title": "Verantwortung oder Aufwand nicht genannt",
  "playground.check.init.owner.body":
    "Es sind weder Steward oder Rolle noch eine Aufwandsschätzung sichtbar. Eine grobe Zuordnung erleichtert die Planung.",
  "playground.check.ok.title": "Keine Auffälligkeiten gefunden",
  "playground.check.ok.body":
    "Diese einfachen Prüfungen haben nichts markiert. Das ist ein gutes Zeichen, aber keine Qualitätsgarantie.",
  "playground.chain.cta.title": "OKR-Kette aufbauen",
  "playground.chain.cta.desc":
    "Beginne mit einem Objective, formuliere messbare Key Results und erkunde anschliessend Initiativen, die sie bewegen könnten.",
  "playground.chain.cta.start": "OKR-Kette aufbauen",
  "playground.chain.cta.resume": "OKR-Kette fortsetzen",
  "playground.chain.standalone.title": "Einzelübung starten",
  "playground.chain.standalone.desc":
    "Übe einen einzelnen Baustein für sich, ohne ihn mit einer Kette zu verbinden.",
  "playground.chain.step.objective": "Objective",
  "playground.chain.step.kr": "Key Results",
  "playground.chain.step.initiatives": "Initiativen",
  "playground.chain.step.review": "Überblick",
  "playground.chain.step.done": "Abgeschlossen",
  "playground.chain.step.current": "Aktueller Schritt",
  "playground.chain.step.locked": "Noch nicht verfügbar",
  "playground.chain.use": "Für diese OKR-Kette verwenden",
  "playground.chain.selectedObjective": "Ausgewähltes Objective",
  "playground.chain.selectedKr": "Ausgewähltes Key Result",
  "playground.chain.includedInitiative": "Aufgenommene Initiative",
  "playground.chain.continueKr": "Key Results für dieses Objective erstellen",
  "playground.chain.continueInit": "Initiativen für dieses Key Result entwickeln",
  "playground.chain.continueReview": "Übungskette überprüfen",
  "playground.chain.contextObjective": "Objective",
  "playground.chain.contextKr": "Key Result",
  "playground.chain.summary.heading": "Deine OKR-Übungskette",
  "playground.chain.summary.badge": "Übungskette · Nicht gespeichert",
  "playground.chain.summary.initiatives": "Aufgenommene Initiativen",
  "playground.chain.edit.objective": "Objective bearbeiten",
  "playground.chain.edit.kr": "Key Result bearbeiten",
  "playground.chain.edit.initiatives": "Initiativen bearbeiten",
  "playground.chain.copy": "Ganze Kette kopieren",
  "playground.chain.copied": "Kette kopiert",
  "playground.chain.copyFailed": "Kopieren nicht verfügbar",
  "playground.chain.new": "Neue Kette starten",
  "playground.chain.confirm.title": "Auswahl ändern?",
  "playground.chain.confirm.objective":
    "Wenn du das Objective änderst, werden die Key Results und Initiativen dieser Übungskette gelöscht. Fortfahren?",
  "playground.chain.confirm.kr":
    "Wenn du das Key Result änderst, werden die Initiativen dieser Übungskette gelöscht. Fortfahren?",
  "playground.chain.confirm.continue": "Fortfahren",
  "playground.chain.confirm.cancel": "Aktuelle Auswahl behalten",
  "playground.chain.note.objToKr":
    "Key Results machen den Erfolg dieses Objectives sichtbar und messbar.",
  "playground.chain.note.krToInit":
    "Initiativen sind mögliche Arbeit, die dieses Key Result bewegen kann; sie sind selbst keine Erfolgsmessung.",
  "playground.chain.note.review":
    "Eine nützliche OKR-Kette verbindet eine bedeutsame Veränderung, Belege für Fortschritt und fokussierte Arbeit.",
  "playground.chain.wizard.objective": "Objective-Schritt",
  "playground.chain.wizard.kr": "Key-Result-Schritt",
  "playground.chain.wizard.initiative": "Initiativen-Schritt",
  "playground.handoff.signIn": "Anmelden, um diesen Entwurf in einem OKR-Set zu verwenden",
  "playground.handoff.noRights":
    "Du kannst diesen Entwurf kopieren; für die Verwendung in einem Live-OKR-Set ist eine Bearbeitungsberechtigung nötig",
  "playground.handoff.use": "Diesen Entwurf in einem OKR-Set verwenden",
  "playground.handoff.editorHint":
    "Wähle im Live-Dashboard ein OKR-Set, ein Objective oder ein Key Result, um diesen Entwurf einzufügen.",
  "playground.handoff.openDashboard": "OKR-Dashboard öffnen",
  "playground.handoff.notSavedNote":
    "Die Anmeldung speichert diesen Entwurf nicht. Hier wird nichts in die Live-OKR-Daten geschrieben.",
  "playground.handoff.close": "Schliessen",
  "playground.handoff.restored.title": "Übungsentwurf für diese Sitzung behalten",
  "playground.handoff.restored.body":
    "Dieser Entwurf wurde nur in deinem Browser behalten, damit du ihn nach der Anmeldung wiederfindest. Er ist in keinem OKR-Set gespeichert.",
  "playground.handoff.restored.dismiss": "Ausblenden",
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
  "kr.deleteConfirmBody":
    "Le résultat clé et ses initiatives seront définitivement supprimés. Cette action est irréversible.",
  "kr.delete": "Supprimer le résultat clé",
  "okr.customer": "Client :",
  "okr.delete": "Supprimer l'ensemble OKR",
  "okr.deleteConfirm": "Supprimer l'ensemble OKR",
  "okr.deleteConfirmBody":
    "La suppression de l'ensemble OKR supprime aussi ses résultats clés et ses initiatives. Cette action est irréversible.",
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
  "initiative.linkDialog.description":
    "Choisissez quelles initiatives du portefeuille contribuent à ce résultat clé. Les nouvelles initiatives se créent dans le Portefeuille.",
  "initiative.linkDialog.search": "Rechercher des initiatives…",
  "initiative.linkDialog.empty": "Aucune initiative dans le portefeuille.",
  "initiative.linkDialog.role.none": "Aucun",
  "initiative.linkDialog.role.secondary": "Secondaire",
  "initiative.linkDialog.role.primary": "Principal",
  "initiative.linkDialog.primaryHint":
    "Définir une initiative comme Principale la déplace ici depuis son KR actuel.",
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
  "initiative.helpNeeded.helpers":
    "Cherche des renforts aux c\u00f4t\u00e9s de la personne responsable",
  "initiative.helpNeeded.skill": "Cherche une comp\u00e9tence sp\u00e9cifique",
  "initiatives.form.availability": "Disponibilit\u00e9",
  "initiatives.form.blockedReason": "Qu'est-ce qui bloque ?",
  "initiatives.form.blockedReasonPlaceholder":
    "p. ex. en attente d'une d\u00e9cision du comit\u00e9",
  "initiatives.form.commitment": "Engagement",
  "initiatives.form.helpNeeded": "Aide recherch\u00e9e",
  "initiatives.form.skillNote": "Quelle comp\u00e9tence ?",
  "initiatives.form.skillNotePlaceholder": "p. ex. graphisme, relecture juridique",
  "initiatives.form.unspecified": "Non pr\u00e9cis\u00e9",
  "initiatives.form.helpersOwnerHint":
    "Les renforts rejoignent une personne responsable. Indiquez-en une d'abord.",
  "initiatives.form.availabilityHint":
    "La disponibilit\u00e9 s'applique tant que l'initiative est planifi\u00e9e.",

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
  "playground.nav": "Espace d'essai OKR",
  "playground.title": "Espace d'essai OKR",
  "playground.intro":
    "Découvrez comment fonctionnent les objectifs, les résultats clés et les initiatives. Vos brouillons d'exercice ne sont pas enregistrés et n'affectent pas le tableau de bord OKR d'ICFS.",
  "playground.badge": "Espace d'essai · Rien ici ne modifie les OKR réels",
  "playground.mode.objective.title": "Créer un objectif",
  "playground.mode.objective.desc":
    "Un objectif exprime, sous forme de résultat, ce que le chapitre veut atteindre pour un public donné.",
  "playground.mode.kr.title": "Créer un résultat clé",
  "playground.mode.kr.desc":
    "Un résultat clé rend mesurable la progression d'un objectif, d'une valeur de départ vers une cible.",
  "playground.mode.initiative.title": "Imaginer des initiatives",
  "playground.mode.initiative.desc":
    "Une initiative est le travail concret qu'une personne prend en charge pour faire avancer un résultat clé.",
  "playground.start": "Commencer l'exploration",
  "playground.clear": "Effacer",
  "playground.notSaved": "Rien n'est enregistré sur cette page.",
  "playground.draftLabel": "Brouillon d'exercice",
  "playground.wizard.step": "Étape",
  "playground.wizard.of": "sur",
  "playground.wizard.hint": "Une formulation courte et simple suffit — c'est un exercice.",
  "playground.wizard.placeholder": "Écrivez une ou deux phrases…",
  "playground.wizard.back": "Retour",
  "playground.wizard.continue": "Continuer",
  "playground.wizard.restart": "Recommencer",
  "playground.wizard.generate": "Générer des brouillons d'exercice",
  "playground.wizard.generating": "Rédaction des suggestions…",
  "playground.q.objective.1": "Quel changement stratégique voulez-vous créer ?",
  "playground.q.objective.2": "Qui doit bénéficier de ce changement ?",
  "playground.q.objective.3": "Qu'est-ce qui devra être différent à la fin de la période ?",
  "playground.q.kr.1": "Quel objectif ce résultat clé soutient-il ?",
  "playground.q.kr.2": "Quels éléments montreraient la réussite ?",
  "playground.q.kr.3": "Comment cela pourrait-il être mesuré ou observé ?",
  "playground.q.initiative.1": "Quel résultat clé cette initiative doit-elle faire avancer ?",
  "playground.q.initiative.2": "Quel type de travail pourrait y contribuer ?",
  "playground.q.initiative.3": "Quelles contraintes, compétences ou capacités comptent ?",
  "playground.result.heading": "Brouillons d'exercice",
  "playground.result.note":
    "Ces exemples sont générés localement à partir de vos réponses. Rien n'est enregistré et aucun OKR réel n'est modifié.",
  "playground.result.tag": "Brouillon d'exercice",
  "playground.result.objective.a.title": "Objectif formulé comme résultat",
  "playground.result.objective.b.title": "Formulation en état final",
  "playground.result.objective.note.title": "À préciser",
  "playground.result.objective.note.body":
    "Nommez un public, décrivez un résultat plutôt qu'une activité et assurez-vous que le changement soit visible à la fin de la période.",
  "playground.result.kr.metric.title": "Résultat clé chiffré",
  "playground.result.kr.milestone.title": "Résultat clé sous forme de jalon",
  "playground.result.kr.note.title": "Note de mesure",
  "playground.result.kr.note.body":
    "Fixez d'abord une valeur de départ, précisez qui lit le chiffre et à quelle fréquence il est mis à jour.",
  "playground.result.initiative.a.title": "Idée d'initiative",
  "playground.result.initiative.b.title": "Premier pas plus modeste",
  "playground.result.initiative.note.title": "Engagement et soutien",
  "playground.result.initiative.note.body":
    "Déterminez s'il s'agit d'une action ponctuelle, récurrente ou d'un chantier, et s'il faut un responsable, des volontaires ou une compétence précise.",
  "playground.tpl.for": "pour",
  "playground.tpl.by": "D'ici la fin de la période",
  "playground.tpl.who": "Public concerné",
  "playground.tpl.byEnd": "D'ici la fin de la période",
  "playground.tpl.measure": "Mesuré par",
  "playground.tpl.evidence": "Éléments de preuve",
  "playground.tpl.supports": "Soutient",
  "playground.tpl.milestone": "Jalon",
  "playground.tpl.moves": "fait avancer",
  "playground.tpl.constraints": "Contraintes",
  "playground.tpl.smallStep": "Premier pas",
  "playground.metaTitle": "Espace d'essai OKR — The Switzerland Chapter of ICF",
  "playground.metaDescription":
    "Un espace public pour s'exercer à rédiger objectifs, résultats clés et initiatives. Rien n'est enregistré et aucune donnée réelle n'est touchée.",
  "report.eyebrow": "LE CHAPITRE SUISSE DE L'ICF · RAPPORT AU COMITÉ",
  "report.title": "Rapport OKR au comité 2026–2027",
  "report.subtitle":
    "Un instantané imprimable des objectifs, des key results, de la maturité de mesure et du portefeuille d'initiatives.",
  "report.generated":
    "Généré depuis le tableau de bord OKR ICFS le {date} à {time}. Le tableau de bord fait foi. Ce document est un instantané et est remplacé par le tableau de bord en cas de divergence.",
  "report.download": "Télécharger le PDF",
  "report.summary.objectives": "Objectifs",
  "report.summary.keyResults": "Key results",
  "report.summary.metric": "Key results métriques",
  "report.summary.milestone": "Key results jalons",
  "report.summary.initiatives": "Initiatives",
  "report.readiness.title": "Maturité de la mesure",
  "report.readiness.context":
    "2026 est une année de référence. Ce rapport montre l'état du système de mesure, et non l'avancement de l'exécution — les taux d'avancement seraient nuls par construction. Les références sont dues au 30.11.2026.",
  "report.readiness.axis": "nombre sur {total} key results métriques",
  "report.byObjective.title": "Maturité par objectif",
  "report.byObjective.total": "Key results métriques",
  "report.byObjective.instrument": "Avec instrument",
  "report.byObjective.baseline": "Avec référence",
  "report.portfolio.title": "Portefeuille d'initiatives par objectif",
  "report.portfolio.gap": "{count} key results sans initiative : {list}",
  "report.portfolio.noGap": "Chaque key result a au moins une initiative.",
  "report.sfa.title": "Contribution aux axes stratégiques",
  "report.sfa.legend":
    "Plein = contribution principale · Contour = contribution secondaire · Tiret = aucune",
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

  "playground.card.why": "Pourquoi cela fonctionne",
  "playground.card.watch": "À surveiller",
  "playground.card.tryAnother": "Essayer une autre version",
  "playground.card.edit": "Modifier ce brouillon",
  "playground.card.save": "Appliquer",
  "playground.card.cancel": "Annuler",
  "playground.card.copy": "Copier le brouillon",
  "playground.card.copied": "Copié",
  "playground.card.copyFailed": "Copie indisponible",
  "playground.card.variant": "Version",
  "playground.quality.strong": "Solide",
  "playground.quality.usable": "Utilisable après retouches",
  "playground.quality.refine": "À affiner",
  "playground.edu.heading": "En quoi ces éléments diffèrent",
  "playground.edu.objective":
    "Un Objectif décrit un changement significatif. Ce n'est pas une liste de tâches.",
  "playground.edu.kr":
    "Un Résultat clé décrit une preuve mesurable de progrès ou de succès. Ce n'est pas une activité.",
  "playground.edu.initiative":
    "Une Initiative est un travail susceptible de faire avancer un Résultat clé. Ce n'est pas le résultat lui-même.",
  "playground.example.heading": "Faible et amélioré",
  "playground.example.weakLabel": "Faible",
  "playground.example.weak": "Lancer des événements communautaires",
  "playground.example.feedbackLabel": "Retour",
  "playground.example.feedback":
    "Cela décrit un travail : il s'agit donc d'une Initiative et non d'un Résultat clé.",
  "playground.example.improvedLabel": "Amélioré",
  "playground.example.improved":
    "Augmenter de 25 % la participation de membres uniques aux événements communautaires d'ici la fin de l'année.",
  "playground.why.objective-a":
    "Il nomme le changement et les personnes concernées, le résultat reste donc clair.",
  "playground.why.objective-b":
    "Il décrit un état final, ce qui rend le progrès plus facile à reconnaître.",
  "playground.why.kr-metric":
    "Il désigne quelque chose d'observable, le progrès peut donc être vérifié.",
  "playground.why.kr-milestone":
    "Il fixe une étape visible, utile lorsqu'aucun chiffre n'est encore disponible.",
  "playground.why.initiative-a":
    "Il relie un travail concret au résultat qu'il doit faire avancer.",
  "playground.why.initiative-b":
    "Il est assez petit pour démarrer, ce qui garde une dynamique réaliste.",
  "playground.watch.objective-a":
    "Vérifiez qu'il s'agit d'un résultat et non d'une liste d'activités.",
  "playground.watch.objective-b":
    "Assurez-vous que l'état final est visible d'ici la fin de la période.",
  "playground.watch.kr-metric":
    "Ajoutez une valeur de départ et une cible, et convenez de qui lit le chiffre.",
  "playground.watch.kr-milestone":
    "Un jalon doit aussi montrer une preuve, pas seulement qu'un travail a eu lieu.",
  "playground.watch.initiative-a":
    "Une initiative n'est pas le résultat ; gardez le résultat clé distinct.",
  "playground.watch.initiative-b": "Précisez qui s'en charge, sinon l'étape reste une idée.",
  "playground.check.heading": "Contrôles de qualité",
  "playground.check.disclaimer":
    "Ces contrôles sont de simples indices de formulation, pas un verdict. Gardez votre jugement.",
  "playground.check.obj.task.title": "Langage de tâche possible",
  "playground.check.obj.task.body":
    "Des mots comme lancer, construire, créer, réaliser ou livrer décrivent souvent du travail. Un Objective décrit plutôt le changement visé.",
  "playground.check.obj.multi.title": "Plusieurs changements à la fois",
  "playground.check.obj.multi.body":
    "Ce brouillon semble réunir plusieurs changements. Envisagez de le scinder pour que chaque Objective porte une intention claire.",
  "playground.check.obj.beneficiary.title": "Bénéficiaire non identifié",
  "playground.check.obj.beneficiary.body":
    "Aucun public ou groupe d'intérêt n'apparaît. Nommer qui en bénéficie, comme Customer de cet Objective, clarifie l'intention.",
  "playground.check.kr.activity.title": "Langage d'activité possible",
  "playground.check.kr.activity.body":
    "Des mots comme lancer, créer, tenir, réaliser, développer, publier ou organiser décrivent généralement une Initiative. Un Key Result décrit la preuve du progrès.",
  "playground.check.kr.measure.title": "Logique de mesure peu claire",
  "playground.check.kr.measure.body":
    "Aucun nombre, pourcentage, décompte, score, date, jalon ou preuve observable n'apparaît. Réfléchissez à la façon de reconnaître le progrès.",
  "playground.check.kr.baseline.title": "Baseline manquante",
  "playground.check.kr.baseline.body":
    "Aucun point de départ n'a été saisi. Une Baseline donne du sens au Target.",
  "playground.check.kr.instrument.title": "Instrument non défini",
  "playground.check.kr.instrument.body":
    "Aucune source de preuve ni méthode d'observation n'a été saisie. Nommer l'Instrument indique d'où viendra la valeur.",
  "playground.check.init.target.title": "Ressemble à une cible mesurable",
  "playground.check.init.target.body":
    "Cela se lit comme un Key Result plutôt que comme du travail. Une Initiative décrit ce qui sera fait pour faire avancer un Key Result.",
  "playground.check.init.parent.title": "Key Result parent manquant",
  "playground.check.init.parent.body":
    "Aucun Key Result n'a été nommé. Relier l'Initiative à un Key Result rend sa contribution visible.",
  "playground.check.init.owner.title": "Responsable ou effort non indiqué",
  "playground.check.init.owner.body":
    "Aucun Steward, rôle ou estimation d'effort n'apparaît. Une indication approximative facilite la planification.",
  "playground.check.ok.title": "Aucun point signalé",
  "playground.check.ok.body":
    "Ces contrôles simples n'ont rien signalé. C'est bon signe, sans être une garantie de qualité.",
  "playground.chain.cta.title": "Construire une chaîne OKR",
  "playground.chain.cta.desc":
    "Commencez par un Objective, créez des Key Results mesurables, puis explorez les Initiatives qui pourraient les faire avancer.",
  "playground.chain.cta.start": "Construire une chaîne OKR",
  "playground.chain.cta.resume": "Poursuivre votre chaîne OKR",
  "playground.chain.standalone.title": "Démarrer un exercice indépendant",
  "playground.chain.standalone.desc":
    "Entraînez-vous sur un seul élément, sans le relier à une chaîne.",
  "playground.chain.step.objective": "Objective",
  "playground.chain.step.kr": "Key Results",
  "playground.chain.step.initiatives": "Initiatives",
  "playground.chain.step.review": "Synthèse",
  "playground.chain.step.done": "Terminé",
  "playground.chain.step.current": "Étape en cours",
  "playground.chain.step.locked": "Pas encore disponible",
  "playground.chain.use": "Utiliser pour cette chaîne OKR",
  "playground.chain.selectedObjective": "Objective sélectionné",
  "playground.chain.selectedKr": "Key Result sélectionné",
  "playground.chain.includedInitiative": "Initiative retenue",
  "playground.chain.continueKr": "Créer des Key Results pour cet Objective",
  "playground.chain.continueInit": "Imaginer des Initiatives pour ce Key Result",
  "playground.chain.continueReview": "Passer en revue votre chaîne d’entraînement",
  "playground.chain.contextObjective": "Objective",
  "playground.chain.contextKr": "Key Result",
  "playground.chain.summary.heading": "Votre chaîne OKR d’entraînement",
  "playground.chain.summary.badge": "Chaîne d’entraînement · Non enregistrée",
  "playground.chain.summary.initiatives": "Initiatives retenues",
  "playground.chain.edit.objective": "Modifier l’Objective",
  "playground.chain.edit.kr": "Modifier le Key Result",
  "playground.chain.edit.initiatives": "Modifier les Initiatives",
  "playground.chain.copy": "Copier toute la chaîne",
  "playground.chain.copied": "Chaîne copiée",
  "playground.chain.copyFailed": "Copie indisponible",
  "playground.chain.new": "Démarrer une nouvelle chaîne",
  "playground.chain.confirm.title": "Modifier cette sélection ?",
  "playground.chain.confirm.objective":
    "Modifier l’Objective effacera les Key Results et les Initiatives de cette chaîne d’entraînement. Continuer ?",
  "playground.chain.confirm.kr":
    "Modifier le Key Result effacera les Initiatives de cette chaîne d’entraînement. Continuer ?",
  "playground.chain.confirm.continue": "Continuer",
  "playground.chain.confirm.cancel": "Conserver la sélection actuelle",
  "playground.chain.note.objToKr":
    "Les Key Results rendent le succès de cet Objective observable et mesurable.",
  "playground.chain.note.krToInit":
    "Les Initiatives sont des travaux possibles qui peuvent faire avancer ce Key Result ; elles ne sont pas des mesures de succès.",
  "playground.chain.note.review":
    "Une chaîne OKR utile relie un changement significatif, des preuves de progrès et un travail ciblé.",
  "playground.chain.wizard.objective": "Étape Objective",
  "playground.chain.wizard.kr": "Étape Key Result",
  "playground.chain.wizard.initiative": "Étape Initiative",
  "playground.handoff.signIn": "Connectez-vous pour utiliser ce brouillon dans un OKR Set",
  "playground.handoff.noRights":
    "Vous pouvez copier ce brouillon ; une autorisation de modification est requise pour l’utiliser dans un OKR Set actif",
  "playground.handoff.use": "Utiliser ce brouillon dans un OKR Set",
  "playground.handoff.editorHint":
    "Choisissez un OKR Set, un Objective ou un Key Result dans le tableau de bord pour insérer ce brouillon.",
  "playground.handoff.openDashboard": "Ouvrir le tableau de bord OKR",
  "playground.handoff.notSavedNote":
    "La connexion n’enregistre pas ce brouillon. Rien ici n’est écrit dans les données OKR actives.",
  "playground.handoff.close": "Fermer",
  "playground.handoff.restored.title": "Brouillon d’entraînement conservé pour cette session",
  "playground.handoff.restored.body":
    "Ce brouillon a été conservé uniquement dans votre navigateur, afin que vous puissiez le retrouver après la connexion. Il n’est enregistré dans aucun OKR Set.",
  "playground.handoff.restored.dismiss": "Masquer",
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
  "kr.deleteConfirmBody":
    "Il risultato chiave e le sue iniziative verranno eliminati definitivamente. Questa azione non può essere annullata.",
  "kr.delete": "Elimina risultato chiave",
  "okr.customer": "Cliente:",
  "okr.delete": "Elimina set OKR",
  "okr.deleteConfirm": "Elimina set OKR",
  "okr.deleteConfirmBody":
    "Eliminando il set OKR vengono eliminati anche i suoi risultati chiave e le sue iniziative. Questa azione non può essere annullata.",
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
  "initiative.linkDialog.description":
    "Scegli quali iniziative del portfolio contribuiscono a questo risultato chiave. Le nuove iniziative si creano nel Portfolio.",
  "initiative.linkDialog.search": "Cerca iniziative…",
  "initiative.linkDialog.empty": "Nessuna iniziativa nel portfolio.",
  "initiative.linkDialog.role.none": "Nessuno",
  "initiative.linkDialog.role.secondary": "Secondaria",
  "initiative.linkDialog.role.primary": "Primaria",
  "initiative.linkDialog.primaryHint":
    "Impostare un'iniziativa come Primaria la sposta qui dal suo KR attuale.",
  "initiative.linkDialog.primaryLocked":
    "Modifica il collegamento primario nel dialogo del KR di destinazione.",
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
  "initiatives.form.helpersOwnerHint":
    "I collaboratori affiancano una persona responsabile. Indicane una prima.",
  "initiatives.form.availabilityHint":
    "La disponibilit\u00e0 vale finch\u00e9 l'iniziativa \u00e8 pianificata.",

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
  "playground.nav": "Spazio di prova OKR",
  "playground.title": "Spazio di prova OKR",
  "playground.intro":
    "Scopri come funzionano obiettivi, risultati chiave e iniziative. Le tue bozze di esercitazione non vengono salvate e non influiscono sulla dashboard OKR di ICFS.",
  "playground.badge": "Area di prova · Nulla qui modifica gli OKR reali",
  "playground.mode.objective.title": "Creare un obiettivo",
  "playground.mode.objective.desc":
    "Un obiettivo descrive, come risultato, ciò che il chapter vuole ottenere per un pubblico specifico.",
  "playground.mode.kr.title": "Creare un risultato chiave",
  "playground.mode.kr.desc":
    "Un risultato chiave rende misurabile il progresso di un obiettivo, da un valore iniziale a un valore obiettivo.",
  "playground.mode.initiative.title": "Ideare iniziative",
  "playground.mode.initiative.desc":
    "Un'iniziativa è il lavoro concreto che qualcuno assume per far avanzare un risultato chiave.",
  "playground.start": "Inizia a esplorare",
  "playground.clear": "Azzera",
  "playground.notSaved": "Su questa pagina non viene salvato nulla.",
  "playground.draftLabel": "Bozza di esercitazione",
  "playground.wizard.step": "Passo",
  "playground.wizard.of": "di",
  "playground.wizard.hint": "Bastano poche parole semplici — è un'esercitazione.",
  "playground.wizard.placeholder": "Scrivi una o due frasi…",
  "playground.wizard.back": "Indietro",
  "playground.wizard.continue": "Continua",
  "playground.wizard.restart": "Ricomincia",
  "playground.wizard.generate": "Genera bozze di esercitazione",
  "playground.wizard.generating": "Sto preparando i suggerimenti…",
  "playground.q.objective.1": "Quale cambiamento strategico vuoi creare?",
  "playground.q.objective.2": "Chi dovrebbe beneficiare di questo cambiamento?",
  "playground.q.objective.3": "Che cosa dovrà essere diverso alla fine del periodo?",
  "playground.q.kr.1": "Quale obiettivo sostiene questo risultato chiave?",
  "playground.q.kr.2": "Quali elementi mostrerebbero il successo?",
  "playground.q.kr.3": "Come si potrebbe misurare o osservare?",
  "playground.q.initiative.1": "Quale risultato chiave dovrebbe far avanzare?",
  "playground.q.initiative.2": "Che tipo di lavoro potrebbe contribuire?",
  "playground.q.initiative.3": "Quali vincoli, competenze o capacità contano?",
  "playground.result.heading": "Bozze di esercitazione",
  "playground.result.note":
    "Questi esempi sono generati localmente dalle tue risposte. Nulla viene salvato e nessun OKR reale viene modificato.",
  "playground.result.tag": "Bozza di esercitazione",
  "playground.result.objective.a.title": "Obiettivo formulato come risultato",
  "playground.result.objective.b.title": "Formulazione come stato finale",
  "playground.result.objective.note.title": "Che cosa affinare",
  "playground.result.objective.note.body":
    "Indica un pubblico, descrivi un risultato invece di un'attività e assicurati che il cambiamento sia visibile alla fine del periodo.",
  "playground.result.kr.metric.title": "Risultato chiave con metrica",
  "playground.result.kr.milestone.title": "Risultato chiave come traguardo",
  "playground.result.kr.note.title": "Nota sulla misurazione",
  "playground.result.kr.note.body":
    "Definisci prima un valore iniziale, chiarisci chi legge il dato e con quale frequenza viene aggiornato.",
  "playground.result.initiative.a.title": "Idea di iniziativa",
  "playground.result.initiative.b.title": "Primo passo più piccolo",
  "playground.result.initiative.note.title": "Impegno e supporto",
  "playground.result.initiative.note.body":
    "Stabilisci se si tratta di un'attività una tantum, ricorrente o di un filone di lavoro, e se servono una guida, aiutanti o una competenza specifica.",
  "playground.tpl.for": "per",
  "playground.tpl.by": "Entro la fine del periodo",
  "playground.tpl.who": "Pubblico",
  "playground.tpl.byEnd": "Entro la fine del periodo",
  "playground.tpl.measure": "Misurato da",
  "playground.tpl.evidence": "Evidenze",
  "playground.tpl.supports": "Sostiene",
  "playground.tpl.milestone": "Traguardo",
  "playground.tpl.moves": "fa avanzare",
  "playground.tpl.constraints": "Vincoli",
  "playground.tpl.smallStep": "Primo passo",
  "playground.metaTitle": "Spazio di prova OKR — The Switzerland Chapter of ICF",
  "playground.metaDescription":
    "Un'area pubblica per esercitarsi con obiettivi, risultati chiave e iniziative. Nulla viene salvato e nessun dato reale viene modificato.",
  "report.eyebrow": "IL CHAPTER SVIZZERO DI ICF · RAPPORTO AL CONSIGLIO",
  "report.title": "Rapporto OKR al consiglio 2026–2027",
  "report.subtitle":
    "Un'istantanea stampabile di obiettivi, key result, maturità della misurazione e portafoglio di iniziative.",
  "report.generated":
    "Generato dalla dashboard OKR ICFS il {date} alle {time}. La dashboard è la fonte ufficiale. Questo documento è un'istantanea ed è superato dalla dashboard in caso di divergenza.",
  "report.download": "Scarica PDF",
  "report.summary.objectives": "Obiettivi",
  "report.summary.keyResults": "Key result",
  "report.summary.metric": "Key result metrici",
  "report.summary.milestone": "Key result milestone",
  "report.summary.initiatives": "Iniziative",
  "report.readiness.title": "Maturità della misurazione",
  "report.readiness.context":
    "Il 2026 è un anno di baseline. Questo rapporto mostra quanto del sistema di misurazione esiste, non l'avanzamento dell'esecuzione — le percentuali sarebbero pari a zero per costruzione. Le baseline sono attese entro il 30.11.2026.",
  "report.readiness.axis": "conteggio su {total} key result metrici",
  "report.byObjective.title": "Maturità per obiettivo",
  "report.byObjective.total": "Key result metrici",
  "report.byObjective.instrument": "Con strumento",
  "report.byObjective.baseline": "Con baseline",
  "report.portfolio.title": "Portafoglio di iniziative per obiettivo",
  "report.portfolio.gap": "{count} key result senza iniziativa: {list}",
  "report.portfolio.noGap": "Ogni key result ha almeno un'iniziativa.",
  "report.sfa.title": "Contributo alle aree strategiche",
  "report.sfa.legend":
    "Pieno = contributo primario · Contorno = contributo secondario · Trattino = nessuno",
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

  "playground.card.why": "Perché funziona",
  "playground.card.watch": "A cosa fare attenzione",
  "playground.card.tryAnother": "Prova un'altra versione",
  "playground.card.edit": "Modifica questa bozza",
  "playground.card.save": "Applica",
  "playground.card.cancel": "Annulla",
  "playground.card.copy": "Copia la bozza",
  "playground.card.copied": "Copiato",
  "playground.card.copyFailed": "Copia non disponibile",
  "playground.card.variant": "Versione",
  "playground.quality.strong": "Solido",
  "playground.quality.usable": "Utilizzabile con modifiche",
  "playground.quality.refine": "Da affinare",
  "playground.edu.heading": "In cosa differiscono questi elementi",
  "playground.edu.objective":
    "Un Obiettivo descrive un cambiamento significativo. Non è un elenco di attività.",
  "playground.edu.kr":
    "Un Risultato chiave descrive prove misurabili di progresso o successo. Non è un'attività.",
  "playground.edu.initiative":
    "Un'Iniziativa è un lavoro che può contribuire a muovere un Risultato chiave. Non è il risultato stesso.",
  "playground.example.heading": "Debole e migliorato",
  "playground.example.weakLabel": "Debole",
  "playground.example.weak": "Lanciare eventi per la community",
  "playground.example.feedbackLabel": "Riscontro",
  "playground.example.feedback":
    "Questo descrive un lavoro, quindi è un'Iniziativa e non un Risultato chiave.",
  "playground.example.improvedLabel": "Migliorato",
  "playground.example.improved":
    "Aumentare del 25% la partecipazione di membri unici agli eventi della community entro fine anno.",
  "playground.why.objective-a":
    "Nomina il cambiamento e le persone coinvolte, così il risultato resta chiaro.",
  "playground.why.objective-b":
    "Descrive uno stato finale, il che rende il progresso più facile da riconoscere.",
  "playground.why.kr-metric":
    "Indica qualcosa di osservabile, quindi il progresso può essere verificato.",
  "playground.why.kr-milestone":
    "Fissa un passo visibile, utile quando non è ancora disponibile un numero.",
  "playground.why.initiative-a": "Collega un lavoro concreto al risultato che deve muovere.",
  "playground.why.initiative-b":
    "È abbastanza piccolo da iniziare, mantenendo un ritmo realistico.",
  "playground.watch.objective-a": "Verifica che sia un risultato e non un elenco di attività.",
  "playground.watch.objective-b":
    "Assicurati che lo stato finale sia visibile entro la fine del periodo.",
  "playground.watch.kr-metric":
    "Aggiungi un valore di partenza e uno obiettivo, e stabilisci chi legge il numero.",
  "playground.watch.kr-milestone":
    "Anche una milestone deve mostrare prove, non solo che il lavoro è avvenuto.",
  "playground.watch.initiative-a":
    "Un'iniziativa non è il risultato; mantieni distinto il risultato chiave.",
  "playground.watch.initiative-b": "Indica chi se ne occupa, altrimenti il passo resta un'idea.",
  "playground.check.heading": "Controlli di qualità",
  "playground.check.disclaimer":
    "Questi controlli sono semplici indizi di formulazione, non un verdetto. Usa il tuo giudizio.",
  "playground.check.obj.task.title": "Possibile linguaggio da attività",
  "playground.check.obj.task.body":
    "Parole come lanciare, costruire, creare, svolgere o consegnare descrivono spesso lavoro. Un Objective descrive di norma il cambiamento desiderato.",
  "playground.check.obj.multi.title": "Forse più cambiamenti insieme",
  "playground.check.obj.multi.body":
    "Questa bozza sembra unire più cambiamenti. Valuta di suddividerla, così ogni Objective porta un'intenzione chiara.",
  "playground.check.obj.beneficiary.title": "Beneficiario non evidente",
  "playground.check.obj.beneficiary.body":
    "Non è visibile un pubblico o un gruppo di riferimento. Indicare chi ne beneficia, come Customer di questo Objective, rende l'intento più chiaro.",
  "playground.check.kr.activity.title": "Possibile linguaggio da attività",
  "playground.check.kr.activity.body":
    "Parole come lanciare, creare, svolgere, sviluppare, pubblicare o organizzare descrivono di solito un'Initiative. Un Key Result descrive la prova del progresso.",
  "playground.check.kr.measure.title": "Logica di misurazione poco chiara",
  "playground.check.kr.measure.body":
    "Non si vede un numero, una percentuale, un conteggio, un punteggio, una data, una milestone o una prova osservabile. Considera come riconoscere il progresso.",
  "playground.check.kr.baseline.title": "Baseline mancante",
  "playground.check.kr.baseline.body":
    "Non è stato inserito un punto di partenza. Una Baseline rende significativo il Target.",
  "playground.check.kr.instrument.title": "Instrument non definito",
  "playground.check.kr.instrument.body":
    "Non è stata indicata una fonte di prova o un metodo di osservazione. Indicare l'Instrument mostra da dove arriva il valore.",
  "playground.check.init.target.title": "Sembra un obiettivo misurabile",
  "playground.check.init.target.body":
    "Si legge come un Key Result più che come lavoro. Un'Initiative descrive ciò che verrà fatto per muovere un Key Result.",
  "playground.check.init.parent.title": "Key Result di riferimento mancante",
  "playground.check.init.parent.body":
    "Non è stato indicato un Key Result. Collegare l'Initiative a un Key Result rende visibile il contributo.",
  "playground.check.init.owner.title": "Responsabile o impegno non indicati",
  "playground.check.init.owner.body":
    "Non sono visibili uno Steward, un ruolo o una stima dell'impegno. Un'indicazione di massima facilita la pianificazione.",
  "playground.check.ok.title": "Nessun elemento segnalato",
  "playground.check.ok.body":
    "Questi controlli semplici non hanno segnalato nulla. È un buon segno, ma non una garanzia di qualità.",
  "playground.chain.cta.title": "Costruisci una catena OKR",
  "playground.chain.cta.desc":
    "Parti da un Objective, crea Key Result misurabili e poi esplora le Iniziative che potrebbero farli avanzare.",
  "playground.chain.cta.start": "Costruisci una catena OKR",
  "playground.chain.cta.resume": "Continua la tua catena OKR",
  "playground.chain.standalone.title": "Avvia un esercizio autonomo",
  "playground.chain.standalone.desc":
    "Esercitati su un singolo elemento, senza collegarlo a una catena.",
  "playground.chain.step.objective": "Objective",
  "playground.chain.step.kr": "Key Result",
  "playground.chain.step.initiatives": "Iniziative",
  "playground.chain.step.review": "Riepilogo",
  "playground.chain.step.done": "Completato",
  "playground.chain.step.current": "Passaggio attuale",
  "playground.chain.step.locked": "Non ancora disponibile",
  "playground.chain.use": "Usa per questa catena OKR",
  "playground.chain.selectedObjective": "Objective selezionato",
  "playground.chain.selectedKr": "Key Result selezionato",
  "playground.chain.includedInitiative": "Iniziativa inclusa",
  "playground.chain.continueKr": "Crea Key Result per questo Objective",
  "playground.chain.continueInit": "Idea Iniziative per questo Key Result",
  "playground.chain.continueReview": "Rivedi la tua catena di pratica",
  "playground.chain.contextObjective": "Objective",
  "playground.chain.contextKr": "Key Result",
  "playground.chain.summary.heading": "La tua catena OKR di pratica",
  "playground.chain.summary.badge": "Catena di pratica · Non salvata",
  "playground.chain.summary.initiatives": "Iniziative incluse",
  "playground.chain.edit.objective": "Modifica Objective",
  "playground.chain.edit.kr": "Modifica Key Result",
  "playground.chain.edit.initiatives": "Modifica Iniziative",
  "playground.chain.copy": "Copia l’intera catena",
  "playground.chain.copied": "Catena copiata",
  "playground.chain.copyFailed": "Copia non disponibile",
  "playground.chain.new": "Avvia una nuova catena",
  "playground.chain.confirm.title": "Modificare questa selezione?",
  "playground.chain.confirm.objective":
    "Modificando l’Objective verranno cancellati i Key Result e le Iniziative di questa catena di pratica. Continuare?",
  "playground.chain.confirm.kr":
    "Modificando il Key Result verranno cancellate le Iniziative di questa catena di pratica. Continuare?",
  "playground.chain.confirm.continue": "Continua",
  "playground.chain.confirm.cancel": "Mantieni la selezione attuale",
  "playground.chain.note.objToKr":
    "I Key Result rendono osservabile e misurabile il successo di questo Objective.",
  "playground.chain.note.krToInit":
    "Le Iniziative sono possibili attività che possono far avanzare questo Key Result; non sono di per sé misure di successo.",
  "playground.chain.note.review":
    "Una catena OKR utile collega un cambiamento significativo, prove di progresso e lavoro mirato.",
  "playground.chain.wizard.objective": "Passaggio Objective",
  "playground.chain.wizard.kr": "Passaggio Key Result",
  "playground.chain.wizard.initiative": "Passaggio Iniziativa",
  "playground.handoff.signIn": "Accedi per usare questa bozza in un OKR Set",
  "playground.handoff.noRights":
    "Puoi copiare questa bozza; per usarla in un OKR Set attivo serve l’autorizzazione di modifica",
  "playground.handoff.use": "Usa questa bozza in un OKR Set",
  "playground.handoff.editorHint":
    "Scegli un OKR Set, un Objective o un Key Result dalla dashboard attiva per inserire questa bozza.",
  "playground.handoff.openDashboard": "Apri la dashboard OKR",
  "playground.handoff.notSavedNote":
    "L’accesso non salva questa bozza. Nulla qui viene scritto nei dati OKR attivi.",
  "playground.handoff.close": "Chiudi",
  "playground.handoff.restored.title": "Bozza di pratica conservata per questa sessione",
  "playground.handoff.restored.body":
    "Questa bozza è stata conservata solo nel tuo browser, così puoi ritrovarla dopo l’accesso. Non è salvata in alcun OKR Set.",
  "playground.handoff.restored.dismiss": "Nascondi",
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
