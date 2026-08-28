import type { Locale } from "./i18n-shared";
import type { Pillar } from "./okr-schemas";

export type StringKey =
  // get involved (volunteer entry page)
  | "involve.panel.title"
  | "involve.panel.empty"
  | "involve.nav"
  | "involve.eyebrow"
  | "involve.title"
  | "involve.subtitle"
  | "involve.cta.start"
  | "involve.cta.browse"
  | "involve.stat.objectives"
  | "involve.stat.open"
  | "involve.stat.teams"
  | "involve.step"
  | "involve.of"
  | "involve.journeyTitle"
  | "involve.restart"
  | "involve.back"
  | "involve.q1.title"
  | "involve.q1.objective"
  | "involve.q1.help"
  | "involve.q1.any"
  | "involve.q1.anyHelp"
  | "involve.q2.title"
  | "involve.q2.help"
  | "involve.time.small"
  | "involve.time.smallHelp"
  | "involve.time.medium"
  | "involve.time.mediumHelp"
  | "involve.time.any"
  | "involve.time.anyHelp"
  | "involve.q3.title"
  | "involve.q3.help"
  | "involve.help.lead"
  | "involve.help.leadHelp"
  | "involve.help.helpers"
  | "involve.help.helpersHelp"
  | "involve.help.skill"
  | "involve.help.skillHelp"
  | "involve.help.any"
  | "involve.help.anyHelp"
  | "involve.results.title"
  | "involve.results.count"
  | "involve.results.empty"
  | "involve.results.showAll"
  | "involve.match.why"
  | "involve.interest.cta"
  | "involve.interest.intro"
  | "involve.interest.name"
  | "involve.interest.email"
  | "involve.interest.message"
  | "involve.interest.submit"
  | "involve.interest.sending"
  | "involve.interest.success"
  | "involve.interest.error"
  | "involve.interest.privacy"
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
  | "kr.section.definition"
  | "kr.parentObjective"
  | "kr.section.measurement"
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
  | "nav.more"
  | "access.readonly.title"
  | "access.readonly.body"
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
  | "initiative.open"
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
  | "work.kind.candidate"
  | "work.kind.simple_task"
  | "work.kind.initiative"
  | "work.kinds.candidate"
  | "work.kinds.simple_task"
  | "work.kinds.initiative"
  | "work.filterKind"
  | "work.filterAllKinds"
  | "work.filterTeam"
  | "work.filterAllTeams"
  | "work.noTeam"
  | "work.team"
  | "work.size"
  | "work.size.small"
  | "work.size.medium"
  | "work.new"
  | "work.newIdea"
  | "work.newTask"
  | "work.newInitiative"
  | "work.promote"
  | "work.promoted"
  | "work.open"
  | "work.empty"
  | "work.emptyStatus"
  | "work.idea"
  | "work.whyNow"
  | "work.proposedOwner"
  | "work.phase"
  | "work.phaseNumber"
  | "work.phaseType"
  | "work.phaseType.delivery"
  | "work.phaseType.discovery"
  | "work.startDate"
  | "work.endDate"
  | "work.aspiration"
  | "work.bet"
  | "work.betAction"
  | "work.betChange"
  | "work.betQuestion"
  | "work.confidence"
  | "work.confidence.pretty_confident"
  | "work.confidence.worth_testing"
  | "work.confidence.wild_card"
  | "work.signals"
  | "work.signal.name"
  | "work.signal.evidence"
  | "work.evidence.see"
  | "work.evidence.hear"
  | "work.evidence.measure"
  | "work.signal.howNoticed"
  | "work.signal.startingPoint"
  | "work.signal.direction"
  | "work.direction.up"
  | "work.direction.down"
  | "work.addSignal"
  | "work.noSignals"
  | "work.milestones"
  | "work.milestone.title"
  | "work.milestone.owner"
  | "work.milestone.due"
  | "work.addMilestone"
  | "work.noMilestones"
  | "work.learning"
  | "work.learning.date"
  | "work.learning.author"
  | "work.learning.decision"
  | "work.decision.growing"
  | "work.decision.tweak"
  | "work.decision.surprise"
  | "work.decision.let_go"
  | "work.learning.whatHappened"
  | "work.learning.signalsTelling"
  | "work.learning.surprisedUs"
  | "work.learning.proudOf"
  | "work.learning.doNext"
  | "work.learning.nextMove"
  | "work.addLearning"
  | "work.noLearning"
  | "work.latestLearning"
  | "work.lead"
  | "work.supportNeeded"
  | "work.outOfScope"
  | "work.learningCheckpoint"
  | "work.strategicContext"
  | "work.back"
  | "work.notFound"
  | "work.section.plan"
  | "work.section.people"
  | "work.section.volunteering"
  | "work.saved"
  | "work.count"
  | "work.lookingForPeople"
  | "work.editPlan"
  | "work.form.kind"
  | "work.form.team"
  | "work.form.unassigned"
  | "work.deleteEntry"
  | "journey.add"
  | "journey.title"
  | "journey.subtitle"
  | "journey.step"
  | "journey.of"
  | "journey.next"
  | "journey.back"
  | "journey.skip"
  | "journey.finish"
  | "journey.creating"
  | "journey.step.kind"
  | "journey.step.kindHelp"
  | "journey.kindDesc.candidate"
  | "journey.kindDesc.simple_task"
  | "journey.kindDesc.initiative"
  | "journey.step.context"
  | "journey.step.contextHelp"
  | "journey.secondaryKrs"
  | "journey.secondaryKrsHelp"
  | "journey.noSecondaryKrs"
  | "journey.step.work"
  | "journey.step.workHelp"
  | "journey.step.aspiration"
  | "journey.step.aspirationHelp"
  | "journey.step.bet"
  | "journey.step.betHelp"
  | "journey.step.signals"
  | "journey.step.signalsHelp"
  | "journey.step.milestones"
  | "journey.step.milestonesHelp"
  | "journey.step.review"
  | "journey.step.reviewHelp"
  | "journey.needTitle"
  | "journey.needKr"
  | "journey.suggest"
  | "journey.suggesting"
  | "journey.suggestFailed"
  | "journey.suggestions"
  | "journey.useThis"
  | "journey.dismiss"
  | "journey.discardTitle"
  | "journey.discardBody"
  | "journey.discardConfirm"
  | "journey.childFailed"
  | "journey.reviewNothing"
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
  | "playground.wizard.confirm.title"
  | "playground.wizard.confirm.body"
  | "playground.wizard.confirm.continue"
  | "playground.wizard.confirm.cancel"
  | "playground.wizard.generate"
  | "playground.wizard.generating"
  | "playground.ai.option"
  | "playground.ai.error.unavailable"
  | "playground.ai.error.rateLimited"
  | "playground.ai.error.invalid"
  | "playground.ai.retry"
  | "playground.ai.fallback"
  | "playground.ai.fallbackNote"
  | "playground.ai.nextQuestions"
  | "playground.card.warnings"
  | "playground.meta.measurement"
  | "playground.meta.baseline"
  | "playground.meta.target"
  | "playground.meta.instrument"
  | "playground.meta.owner"
  | "playground.meta.effort"
  | "playground.meta.timing"
  | "playground.baseline.known"
  | "playground.baseline.pending"
  | "playground.baseline.exploratory"
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
  | "playground.chain.summary.eyebrow"
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
  | "playground.chain.confirm.new.title"
  | "playground.chain.confirm.new.body"
  | "playground.chain.confirm.new.continue"
  | "playground.chain.confirm.new.cancel"
  | "playground.chain.note.objToKr"
  | "playground.chain.note.krToInit"
  | "playground.chain.note.review"
  | "playground.chain.wizard.objective"
  | "playground.chain.wizard.kr"
  | "playground.chain.wizard.initiative"
  | "playground.chain.limit.kr"
  | "playground.chain.limit.krReached"
  | "playground.chain.limit.init"
  | "playground.chain.limit.initReached"
  | "playground.chain.initFor"
  | "playground.chain.handoff.title"
  | "playground.chain.handoff.body"
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
  | "assistant.eyebrow"
  | "assistant.description"
  | "assistant.title.objective"
  | "assistant.title.kr"
  | "assistant.title.initiative"
  | "assistant.footer"
  | "assistant.cta.create"
  | "assistant.cta.measurable"
  | "assistant.cta.initiatives"
  | "assistant.ctx.set"
  | "assistant.ctx.kr"
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
  | "report.kr.due"
  | "agent.title"
  | "agent.subtitle"
  | "agent.open"
  | "agent.close"
  | "agent.placeholder"
  | "agent.startOver"
  | "agent.disclaimer"
  | "agent.greeting"
  | "agent.s1"
  | "agent.s2"
  | "agent.s3"
  | "agent.error"
  | "agent.ctx.home.greeting"
  | "agent.ctx.home.s1"
  | "agent.ctx.home.s2"
  | "agent.ctx.home.s3"
  | "agent.ctx.okrs.greeting"
  | "agent.ctx.okrs.s1"
  | "agent.ctx.okrs.s2"
  | "agent.ctx.okrs.s3"
  | "agent.ctx.initiatives.greeting"
  | "agent.ctx.initiatives.s1"
  | "agent.ctx.initiatives.s2"
  | "agent.ctx.initiatives.s3"
  | "agent.ctx.playground.greeting"
  | "agent.ctx.playground.s1"
  | "agent.ctx.playground.s2"
  | "agent.ctx.playground.s3"
  | "agent.ctx.report.greeting"
  | "agent.ctx.report.s1"
  | "agent.ctx.report.s2"
  | "agent.ctx.report.s3"
  | "agent.thinking";

const en: Record<StringKey, string> = {
  "involve.panel.title": "Volunteer interest",
  "involve.panel.empty": "No one has expressed interest in this work yet.",
  "involve.nav": "Get involved",
  "involve.eyebrow": "THE SWITZERLAND CHAPTER OF ICF · GET INVOLVED",
  "involve.title": "Find where you fit in the chapter",
  "involve.subtitle":
    "Three short questions, and we will show you the open work that matches your interests, your time and your skills.",
  "involve.cta.start": "Start the three questions",
  "involve.cta.browse": "Browse all work",
  "involve.stat.objectives": "Objectives",
  "involve.stat.open": "Open for volunteers",
  "involve.stat.teams": "Teams",
  "involve.step": "Question",
  "involve.of": "of",
  "involve.journeyTitle": "Where would you see yourself?",
  "involve.restart": "Start again",
  "involve.back": "Back",
  "involve.q1.title": "Which objective speaks to you?",
  "involve.q1.help": "Pick the objective you would most like to move forward.",
  "involve.q1.any": "I am open",
  "involve.q1.anyHelp": "Show me work across all objectives.",
  "involve.q1.objective": "Objective",
  "involve.q2.title": "How much time can you give?",
  "involve.q2.help": "Be honest — small contributions matter.",
  "involve.time.small": "A one-off contribution",
  "involve.time.smallHelp": "A single task with a clear end.",
  "involve.time.medium": "A regular commitment",
  "involve.time.mediumHelp": "Recurring work or a longer workstream.",
  "involve.time.any": "Either works",
  "involve.time.anyHelp": "Show me both.",
  "involve.q3.title": "How would you like to help?",
  "involve.q3.help": "There is room for leading, supporting and specialist input.",
  "involve.help.lead": "Lead something",
  "involve.help.leadHelp": "Take ownership of a piece of work.",
  "involve.help.helpers": "Help a team",
  "involve.help.helpersHelp": "Join others who are already moving.",
  "involve.help.skill": "Bring a specific skill",
  "involve.help.skillHelp": "Contribute expertise where it is missing.",
  "involve.help.any": "Show me everything",
  "involve.help.anyHelp": "I will decide once I see the work.",
  "involve.results.title": "Work that fits you",
  "involve.results.count": "matches",
  "involve.results.empty": "Nothing is open for volunteers right now. Please check back soon.",
  "involve.results.showAll": "Show all matches",
  "involve.match.why": "Why this fits:",
  "involve.interest.cta": "Express interest",
  "involve.interest.intro": "Leave your details and the steward of this work will get back to you.",
  "involve.interest.name": "Your name",
  "involve.interest.email": "Email",
  "involve.interest.message": "Anything you would like to add (optional)",
  "involve.interest.submit": "Send my interest",
  "involve.interest.sending": "Sending…",
  "involve.interest.success": "Thank you. Your interest has been passed on to the chapter.",
  "involve.interest.error": "Your interest could not be sent. Please try again.",
  "involve.interest.privacy": "We only use your details to contact you about this work.",
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

  "kr.section.definition": "Definition",
  "kr.parentObjective": "Parent objective",
  "kr.section.measurement": "Measurement",
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
  "nav.more": "More",
  "access.readonly.title": "You are signed in with view-only access",
  "access.readonly.body": "Editing rights are managed in the ICF Switzerland member area. Ask an admin to add you as an Editor there, then sign in again.",
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
  "initiative.open": "Open initiative",
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
  "playground.wizard.confirm.title": "Start again?",
  "playground.wizard.confirm.body":
    "This clears your current drafts and answers and returns to the first question. This cannot be undone.",
  "playground.wizard.confirm.continue": "Start again",
  "playground.wizard.confirm.cancel": "Keep drafts",
  "playground.wizard.generate": "Generate practice drafts",
  "playground.wizard.generating": "Drafting suggestions…",
  "playground.ai.option": "Option",
  "playground.ai.error.unavailable":
    "Drafting is unavailable right now. You can keep writing your own draft below, or try again in a moment.",
  "playground.ai.error.rateLimited":
    "Too many drafting requests from this device. Please wait a few minutes, or keep writing your own draft below.",
  "playground.ai.error.invalid":
    "The suggestion came back unusable. Try again, or keep writing your own draft below.",
  "playground.ai.retry": "Try again",
  "playground.ai.fallback": "Continue with example drafts",
  "playground.ai.fallbackNote":
    "Example drafts are illustrative patterns, not AI suggestions. Edit them freely.",
  "playground.ai.nextQuestions": "Questions to ask next",
  "playground.card.warnings": "Watch for",
  "playground.meta.measurement": "Measurement",
  "playground.meta.baseline": "Baseline",
  "playground.meta.target": "Target suggestion",
  "playground.meta.instrument": "Instrument suggestion",
  "playground.meta.owner": "Suggested owner role",
  "playground.meta.effort": "Effort",
  "playground.meta.timing": "Timing / dependencies",
  "playground.baseline.known": "Known \u2014 stated by you",
  "playground.baseline.pending": "Pending \u2014 still to be established",
  "playground.baseline.exploratory": "Exploratory \u2014 the right measure is unclear",
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
  "playground.chain.summary.eyebrow": "Review summary",
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
    "Removing this Key Result will also remove the Initiatives you selected for it. Continue?",
  "playground.chain.confirm.continue": "Continue",
  "playground.chain.confirm.cancel": "Keep current selection",
  "playground.chain.confirm.new.title": "Start a new chain?",
  "playground.chain.confirm.new.body":
    "Starting a new chain will clear the Objective, Key Results and Initiatives you have built. This cannot be undone. Continue?",
  "playground.chain.confirm.new.continue": "Start new chain",
  "playground.chain.confirm.new.cancel": "Keep this chain",
  "playground.chain.note.objToKr":
    "Key Results make success on this Objective observable and measurable.",
  "playground.chain.note.krToInit":
    "Initiatives are possible work that may move this Key Result; they are not success measures themselves.",
  "playground.chain.note.review":
    "A useful OKR chain connects a meaningful change, evidence of progress, and focused work.",
  "playground.chain.wizard.objective": "Objective step",
  "playground.chain.wizard.kr": "Key Result step",
  "playground.chain.wizard.initiative": "Initiative step",
  "playground.chain.limit.kr": "Choose up to 3 Key Results for this Objective",
  "playground.chain.limit.krReached":
    "You have reached 3 Key Results. Deselect one to choose another.",
  "playground.chain.limit.init": "Choose up to 3 Initiatives for this Key Result",
  "playground.chain.limit.initReached":
    "You have reached 3 Initiatives for this Key Result. Deselect one to choose another.",
  "playground.chain.initFor": "Initiatives for",
  "playground.chain.handoff.title": "Nothing here reaches the live dashboard",
  "playground.chain.handoff.body":
    "This practice chain — the Objective, its Key Results and their Initiatives — is never copied into live OKR data. Signing in only keeps the chain in your browser for this session so you can re-enter it by hand in the dashboard.",
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
  "assistant.eyebrow": "OKR Assistant",
  "assistant.description":
    "Guided drafting with quality checks. Nothing is saved to the dashboard in this stage.",
  "assistant.title.objective": "Drafting an Objective",
  "assistant.title.kr": "Making a Key Result measurable",
  "assistant.title.initiative": "Ideating Initiatives",
  "assistant.footer": "Draft insertion will be enabled in the next stage.",
  "assistant.cta.create": "Create with Assistant",
  "assistant.cta.measurable": "Make this measurable",
  "assistant.cta.initiatives": "Ideate initiatives",
  "assistant.ctx.set": "OKR Set",
  "assistant.ctx.kr": "KR",
  "work.kind.candidate": "Idea",
  "work.kind.simple_task": "Simple task",
  "work.kind.initiative": "Initiative",
  "work.kinds.candidate": "Ideas",
  "work.kinds.simple_task": "Simple tasks",
  "work.kinds.initiative": "Initiatives",
  "work.filterKind": "Type of work",
  "work.filterAllKinds": "All types",
  "work.filterTeam": "Team",
  "work.filterAllTeams": "All teams",
  "work.noTeam": "No team yet",
  "work.team": "Team",
  "work.size": "Size",
  "work.size.small": "Small",
  "work.size.medium": "Medium",
  "work.new": "+ New work",
  "work.newIdea": "Capture an idea",
  "work.newTask": "Start a simple task",
  "work.newInitiative": "Start an initiative",
  "work.promote": "Change type",
  "work.promoted": "Type updated",
  "work.open": "Open the one-pager",
  "work.empty": "No work matches these filters.",
  "work.emptyStatus": "Nothing here yet",
  "work.idea": "The idea",
  "work.whyNow": "Why now",
  "work.proposedOwner": "Proposed owner",
  "work.phase": "90-day leg",
  "work.phaseNumber": "Leg",
  "work.phaseType": "Focus of this leg",
  "work.phaseType.delivery": "Delivery",
  "work.phaseType.discovery": "Discovery",
  "work.startDate": "Start date",
  "work.endDate": "End date",
  "work.aspiration": "Our aspiration",
  "work.bet": "Our bet",
  "work.betAction": "If we…",
  "work.betChange": "…then we expect…",
  "work.betQuestion": "…and we will learn…",
  "work.confidence": "Confidence",
  "work.confidence.pretty_confident": "Pretty confident",
  "work.confidence.worth_testing": "Worth testing",
  "work.confidence.wild_card": "Wild card",
  "work.signals": "Signals we watch",
  "work.signal.name": "Signal",
  "work.signal.evidence": "Evidence",
  "work.evidence.see": "We would see",
  "work.evidence.hear": "We would hear",
  "work.evidence.measure": "We would measure",
  "work.signal.howNoticed": "How we notice it",
  "work.signal.startingPoint": "Starting point",
  "work.signal.direction": "Direction",
  "work.direction.up": "Going up",
  "work.direction.down": "Going down",
  "work.addSignal": "Add a signal",
  "work.noSignals": "No signals yet.",
  "work.milestones": "Milestones",
  "work.milestone.title": "Milestone",
  "work.milestone.owner": "Owner",
  "work.milestone.due": "Due",
  "work.addMilestone": "Add a milestone",
  "work.noMilestones": "No milestones yet.",
  "work.learning": "Learning check-ins",
  "work.learning.date": "Date",
  "work.learning.author": "Written by",
  "work.learning.decision": "Where this stands",
  "work.decision.growing": "This is growing",
  "work.decision.tweak": "Worth a tweak",
  "work.decision.surprise": "A surprise",
  "work.decision.let_go": "Time to let go",
  "work.learning.whatHappened": "What happened",
  "work.learning.signalsTelling": "What the signals tell us",
  "work.learning.surprisedUs": "What surprised us",
  "work.learning.proudOf": "What we are proud of",
  "work.learning.doNext": "What we do next",
  "work.learning.nextMove": "Next move",
  "work.addLearning": "Add a check-in",
  "work.noLearning": "No check-ins yet.",
  "work.latestLearning": "Latest check-in",
  "work.lead": "Project lead",
  "work.supportNeeded": "Support needed from the chapter",
  "work.outOfScope": "Deliberately out of scope",
  "work.learningCheckpoint": "Next learning checkpoint",
  "work.strategicContext": "Strategic context",
  "work.back": "Back to the portfolio",
  "work.notFound": "This piece of work no longer exists.",
  "work.section.plan": "Plan",
  "work.section.people": "People",
  "work.section.volunteering": "Volunteering",
  "work.saved": "Saved",
  "work.count": "Pieces of work",
  "work.lookingForPeople": "Looking for people",
  "work.editPlan": "Edit the plan",
  "work.form.kind": "Type of work",
  "work.form.team": "Team",
  "work.form.unassigned": "Not assigned",
  "work.deleteEntry": "Remove",
  "journey.add": "Add work",
  "journey.title": "Create a piece of work",
  "journey.subtitle":
    "A short guided journey: pick the type of work, place it in the strategy, then frame it as far as you want to go today.",
  "journey.step": "Step",
  "journey.of": "of",
  "journey.next": "Next",
  "journey.back": "Back",
  "journey.skip": "Skip this step",
  "journey.finish": "Create",
  "journey.creating": "Creating\u2026",
  "journey.step.kind": "What kind of work is this?",
  "journey.step.kindHelp": "Pick the lightest form that fits. You can change the type later.",
  "journey.kindDesc.candidate": "A captured thought \u2014 no dates, no commitments.",
  "journey.kindDesc.simple_task": "Committed work with an owner and dates.",
  "journey.kindDesc.initiative": "A 90-day leg with signals, a bet and milestones.",
  "journey.step.context": "Where does it belong?",
  "journey.step.contextHelp": "Connect the work to the objective and key result it serves.",
  "journey.secondaryKrs": "Also contributes to",
  "journey.secondaryKrsHelp": "Optional \u2014 other key results this work supports.",
  "journey.noSecondaryKrs": "No other key results selected.",
  "journey.step.work": "The work itself",
  "journey.step.workHelp": "Give it a clear title and say who carries it.",
  "journey.step.aspiration": "Aspiration and the 90-day leg",
  "journey.step.aspirationHelp": "What are we reaching for, and over which period?",
  "journey.step.bet": "Our bet",
  "journey.step.betHelp": "Say what you will try, what you expect, and what you will learn.",
  "journey.step.signals": "Signals we watch",
  "journey.step.signalsHelp":
    "How will we notice that something is shifting? You can add these later.",
  "journey.step.milestones": "Milestones",
  "journey.step.milestonesHelp": "A few dated markers along the way. You can add these later.",
  "journey.step.review": "Review and create",
  "journey.step.reviewHelp": "Check the framing, then create the work.",
  "journey.needTitle": "Add a title to continue.",
  "journey.needKr": "Choose a key result to continue.",
  "journey.suggest": "Suggest with the assistant",
  "journey.suggesting": "Asking the assistant\u2026",
  "journey.suggestFailed": "The assistant is unavailable right now.",
  "journey.suggestions": "Assistant suggestions",
  "journey.useThis": "Use this",
  "journey.dismiss": "Dismiss",
  "journey.discardTitle": "Discard this work?",
  "journey.discardBody":
    "You have not created it yet. Everything captured in this journey will be lost.",
  "journey.discardConfirm": "Discard",
  "journey.childFailed": "The work was created, but some signals or milestones could not be saved.",
  "journey.reviewNothing": "Nothing captured yet.",
  "agent.title": "Aspira",
  "agent.subtitle": "Your OKR companion — ask or draft together",
  "agent.open": "Open Aspira",
  "agent.close": "Close",
  "agent.placeholder": "Ask a question…",
  "agent.startOver": "Start over",
  "agent.disclaimer": "Read-only guide. Nothing is saved.",
  "agent.greeting": "Hi, I'm Aspira! I can explain how our objectives, key results and initiatives fit together — or help you draft one.",
  "agent.s1": "How does a key result differ from an initiative?",
  "agent.s2": "What is objective 2 about?",
  "agent.s3": "Help me draft an initiative",
  "agent.error": "Something went wrong. Please try again.",
  "agent.thinking": "Thinking…",
  "agent.ctx.home.greeting": "Hi, I'm Aspira! Looking for a place to contribute? Tell me what interests you and I'll point you to the work behind it.",
  "agent.ctx.home.s1": "Where could I help as a volunteer?",
  "agent.ctx.home.s2": "What is the chapter working on right now?",
  "agent.ctx.home.s3": "Explain what an objective is, simply",
  "agent.ctx.okrs.greeting": "Hi, I'm Aspira! I can walk you through any objective or key result on this page — or help you draft a new one.",
  "agent.ctx.okrs.s1": "Summarise objective 2 for me",
  "agent.ctx.okrs.s2": "How is this objective measured?",
  "agent.ctx.okrs.s3": "How does a key result differ from an initiative?",
  "agent.ctx.initiatives.greeting": "Hi, I'm Aspira! Ask me about any initiative in the portfolio, or let's shape a new one together.",
  "agent.ctx.initiatives.s1": "Which initiatives are in progress?",
  "agent.ctx.initiatives.s2": "Which key result does this work support?",
  "agent.ctx.initiatives.s3": "Help me draft an initiative",
  "agent.ctx.playground.greeting": "Hi, I'm Aspira! This is a safe sandbox — let's practise writing an objective and key results together.",
  "agent.ctx.playground.s1": "Help me draft an objective",
  "agent.ctx.playground.s2": "What makes a key result measurable?",
  "agent.ctx.playground.s3": "Check my draft for quality",
  "agent.ctx.report.greeting": "Hi, I'm Aspira! I can help you read this report — progress, gaps, and what the numbers mean.",
  "agent.ctx.report.s1": "Where are we behind?",
  "agent.ctx.report.s2": "Which key results have no baseline?",
  "agent.ctx.report.s3": "Summarise progress for the board",
};

const de: Record<StringKey, string> = {
  "involve.panel.title": "Interesse von Freiwilligen",
  "involve.panel.empty": "Bisher hat niemand Interesse an dieser Arbeit gemeldet.",
  "involve.nav": "Mitmachen",
  "involve.eyebrow": "THE SWITZERLAND CHAPTER OF ICF · MITMACHEN",
  "involve.title": "Finde deinen Platz im Chapter",
  "involve.subtitle":
    "Drei kurze Fragen, und wir zeigen dir die offene Arbeit, die zu deinen Interessen, deiner Zeit und deinen Fähigkeiten passt.",
  "involve.cta.start": "Die drei Fragen starten",
  "involve.cta.browse": "Alle Arbeiten ansehen",
  "involve.stat.objectives": "Objectives",
  "involve.stat.open": "Offen für Freiwillige",
  "involve.stat.teams": "Teams",
  "involve.step": "Frage",
  "involve.of": "von",
  "involve.journeyTitle": "Wo würdest du dich sehen?",
  "involve.restart": "Neu starten",
  "involve.back": "Zurück",
  "involve.q1.title": "Welches Ziel spricht dich an?",
  "involve.q1.help": "Wähle das Ziel, das du am liebsten voranbringen möchtest.",
  "involve.q1.any": "Ich bin offen",
  "involve.q1.anyHelp": "Zeig mir Arbeit aus allen Zielen.",
  "involve.q1.objective": "Ziel",
  "involve.q2.title": "Wie viel Zeit kannst du einbringen?",
  "involve.q2.help": "Sei ehrlich — auch kleine Beiträge zählen.",
  "involve.time.small": "Ein einmaliger Beitrag",
  "involve.time.smallHelp": "Eine einzelne Aufgabe mit klarem Ende.",
  "involve.time.medium": "Ein regelmässiges Engagement",
  "involve.time.mediumHelp": "Wiederkehrende Arbeit oder ein längerer Workstream.",
  "involve.time.any": "Beides möglich",
  "involve.time.anyHelp": "Zeig mir beides.",
  "involve.q3.title": "Wie möchtest du helfen?",
  "involve.q3.help": "Es gibt Platz zum Führen, Unterstützen und für Fachwissen.",
  "involve.help.lead": "Etwas leiten",
  "involve.help.leadHelp": "Verantwortung für ein Arbeitspaket übernehmen.",
  "involve.help.helpers": "Ein Team unterstützen",
  "involve.help.helpersHelp": "Dich anderen anschliessen, die schon dran sind.",
  "involve.help.skill": "Eine bestimmte Fähigkeit einbringen",
  "involve.help.skillHelp": "Fachwissen dort einbringen, wo es fehlt.",
  "involve.help.any": "Zeig mir alles",
  "involve.help.anyHelp": "Ich entscheide, wenn ich die Arbeit sehe.",
  "involve.results.title": "Arbeit, die zu dir passt",
  "involve.results.count": "Treffer",
  "involve.results.empty": "Zurzeit ist nichts für Freiwillige offen. Schau bald wieder vorbei.",
  "involve.results.showAll": "Alle Treffer anzeigen",
  "involve.match.why": "Warum das passt:",
  "involve.interest.cta": "Interesse melden",
  "involve.interest.intro":
    "Hinterlasse deine Angaben, und der Steward dieser Arbeit meldet sich bei dir.",
  "involve.interest.name": "Dein Name",
  "involve.interest.email": "E-Mail",
  "involve.interest.message": "Was du noch ergänzen möchtest (optional)",
  "involve.interest.submit": "Interesse senden",
  "involve.interest.sending": "Wird gesendet…",
  "involve.interest.success": "Danke. Dein Interesse wurde ans Chapter weitergeleitet.",
  "involve.interest.error":
    "Dein Interesse konnte nicht gesendet werden. Bitte versuche es erneut.",
  "involve.interest.privacy":
    "Wir nutzen deine Angaben nur, um dich zu dieser Arbeit zu kontaktieren.",
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

  "kr.section.definition": "Definition",
  "kr.parentObjective": "Übergeordnetes Objective",
  "kr.section.measurement": "Messung",
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
  "nav.more": "Mehr",
  "access.readonly.title": "Sie sind mit reinem Lesezugriff angemeldet",
  "access.readonly.body": "Bearbeitungsrechte werden im Mitgliederbereich von ICF Schweiz verwaltet. Bitten Sie eine Administratorin oder einen Administrator, Sie dort als Editor zu erfassen, und melden Sie sich danach erneut an.",
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
  "initiative.open": "Initiative öffnen",
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
  "playground.wizard.confirm.title": "Neu beginnen?",
  "playground.wizard.confirm.body":
    "Damit werden Ihre aktuellen Entwürfe und Antworten gelöscht und zur ersten Frage zurückgekehrt. Dieser Vorgang kann nicht rückgängig gemacht werden.",
  "playground.wizard.confirm.continue": "Neu beginnen",
  "playground.wizard.confirm.cancel": "Entwürfe behalten",
  "playground.wizard.generate": "Übungsentwürfe erzeugen",
  "playground.wizard.generating": "Vorschläge werden entworfen…",
  "playground.ai.option": "Option",
  "playground.ai.error.unavailable":
    "Die Entwurfshilfe ist im Moment nicht verf\u00fcgbar. Sie k\u00f6nnen unten selbst weiterschreiben oder es gleich nochmals versuchen.",
  "playground.ai.error.rateLimited":
    "Zu viele Anfragen von diesem Ger\u00e4t. Bitte warten Sie einige Minuten oder schreiben Sie unten selbst weiter.",
  "playground.ai.error.invalid":
    "Der Vorschlag war unbrauchbar. Versuchen Sie es nochmals oder schreiben Sie unten selbst weiter.",
  "playground.ai.retry": "Nochmals versuchen",
  "playground.ai.fallback": "Mit Beispielentw\u00fcrfen weiterarbeiten",
  "playground.ai.fallbackNote":
    "Beispielentw\u00fcrfe sind Musterformulierungen, keine KI-Vorschl\u00e4ge. Sie k\u00f6nnen sie frei bearbeiten.",
  "playground.ai.nextQuestions": "N\u00e4chste Fragen",
  "playground.card.warnings": "Achten Sie auf",
  "playground.meta.measurement": "Messung",
  "playground.meta.baseline": "Ausgangswert",
  "playground.meta.target": "Zielvorschlag",
  "playground.meta.instrument": "Vorschlag zur Erhebung",
  "playground.meta.owner": "Vorgeschlagene Rolle",
  "playground.meta.effort": "Aufwand",
  "playground.meta.timing": "Zeitpunkt / Abh\u00e4ngigkeiten",
  "playground.baseline.known": "Bekannt \u2014 von Ihnen genannt",
  "playground.baseline.pending": "Offen \u2014 noch zu erheben",
  "playground.baseline.exploratory": "Explorativ \u2014 die passende Messgr\u00f6sse ist unklar",
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
  "playground.chain.summary.eyebrow": "Zusammenfassung",
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
    "Wenn du dieses Key Result entfernst, werden auch die dafür gewählten Initiativen entfernt. Fortfahren?",
  "playground.chain.confirm.continue": "Fortfahren",
  "playground.chain.confirm.cancel": "Aktuelle Auswahl behalten",
  "playground.chain.confirm.new.title": "Neue Kette starten?",
  "playground.chain.confirm.new.body":
    "Wenn du eine neue Kette startest, werden das Objective, die Key Results und Initiativen gelöscht, die du erstellt hast. Das kann nicht rückgängig gemacht werden. Fortfahren?",
  "playground.chain.confirm.new.continue": "Neue Kette starten",
  "playground.chain.confirm.new.cancel": "Diese Kette behalten",
  "playground.chain.note.objToKr":
    "Key Results machen den Erfolg dieses Objectives sichtbar und messbar.",
  "playground.chain.note.krToInit":
    "Initiativen sind mögliche Arbeit, die dieses Key Result bewegen kann; sie sind selbst keine Erfolgsmessung.",
  "playground.chain.note.review":
    "Eine nützliche OKR-Kette verbindet eine bedeutsame Veränderung, Belege für Fortschritt und fokussierte Arbeit.",
  "playground.chain.wizard.objective": "Objective-Schritt",
  "playground.chain.wizard.kr": "Key-Result-Schritt",
  "playground.chain.wizard.initiative": "Initiativen-Schritt",
  "playground.chain.limit.kr": "Wähle bis zu 3 Key Results für dieses Objective",
  "playground.chain.limit.krReached":
    "Du hast 3 Key Results erreicht. Hebe eine Auswahl auf, um eine andere zu wählen.",
  "playground.chain.limit.init": "Wähle bis zu 3 Initiativen für dieses Key Result",
  "playground.chain.limit.initReached":
    "Du hast 3 Initiativen für dieses Key Result erreicht. Hebe eine Auswahl auf, um eine andere zu wählen.",
  "playground.chain.initFor": "Initiativen für",
  "playground.chain.handoff.title": "Nichts davon gelangt ins Live-Dashboard",
  "playground.chain.handoff.body":
    "Diese Übungskette — das Objective, seine Key Results und deren Initiativen — wird nie in die Live-OKR-Daten übernommen. Die Anmeldung behält die Kette nur für diese Sitzung im Browser, damit du sie im Dashboard manuell erfassen kannst.",
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
  "assistant.eyebrow": "OKR-Assistent",
  "assistant.description":
    "Geführtes Entwerfen mit Qualitätsprüfungen. In dieser Stufe wird nichts im Dashboard gespeichert.",
  "assistant.title.objective": "Objective entwerfen",
  "assistant.title.kr": "Key Result messbar machen",
  "assistant.title.initiative": "Initiativen entwickeln",
  "assistant.footer": "Das Einfügen von Entwürfen wird in der nächsten Stufe aktiviert.",
  "assistant.cta.create": "Mit Assistent erstellen",
  "assistant.cta.measurable": "Messbar machen",
  "assistant.cta.initiatives": "Initiativen entwickeln",
  "assistant.ctx.set": "OKR-Set",
  "assistant.ctx.kr": "KR",
  "work.kind.candidate": "Idee",
  "work.kind.simple_task": "Einfache Aufgabe",
  "work.kind.initiative": "Initiative",
  "work.kinds.candidate": "Ideen",
  "work.kinds.simple_task": "Einfache Aufgaben",
  "work.kinds.initiative": "Initiativen",
  "work.filterKind": "Art der Arbeit",
  "work.filterAllKinds": "Alle Arten",
  "work.filterTeam": "Team",
  "work.filterAllTeams": "Alle Teams",
  "work.noTeam": "Noch kein Team",
  "work.team": "Team",
  "work.size": "Umfang",
  "work.size.small": "Klein",
  "work.size.medium": "Mittel",
  "work.new": "+ Neue Arbeit",
  "work.newIdea": "Idee festhalten",
  "work.newTask": "Einfache Aufgabe starten",
  "work.newInitiative": "Initiative starten",
  "work.promote": "Typ ändern",
  "work.promoted": "Typ aktualisiert",
  "work.open": "One-Pager öffnen",
  "work.empty": "Keine Arbeit entspricht diesen Filtern.",
  "work.emptyStatus": "Noch nichts hier",
  "work.idea": "Die Idee",
  "work.whyNow": "Warum jetzt",
  "work.proposedOwner": "Vorgeschlagene Verantwortung",
  "work.phase": "90-Tage-Etappe",
  "work.phaseNumber": "Etappe",
  "work.phaseType": "Fokus dieser Etappe",
  "work.phaseType.delivery": "Umsetzung",
  "work.phaseType.discovery": "Erkundung",
  "work.startDate": "Startdatum",
  "work.endDate": "Enddatum",
  "work.aspiration": "Unser Anspruch",
  "work.bet": "Unsere Wette",
  "work.betAction": "Wenn wir…",
  "work.betChange": "…dann erwarten wir…",
  "work.betQuestion": "…und wir lernen…",
  "work.confidence": "Zuversicht",
  "work.confidence.pretty_confident": "Ziemlich zuversichtlich",
  "work.confidence.worth_testing": "Einen Test wert",
  "work.confidence.wild_card": "Wagnis",
  "work.signals": "Signale, die wir beobachten",
  "work.signal.name": "Signal",
  "work.signal.evidence": "Evidenz",
  "work.evidence.see": "Wir würden sehen",
  "work.evidence.hear": "Wir würden hören",
  "work.evidence.measure": "Wir würden messen",
  "work.signal.howNoticed": "Wie wir es bemerken",
  "work.signal.startingPoint": "Ausgangspunkt",
  "work.signal.direction": "Richtung",
  "work.direction.up": "Steigend",
  "work.direction.down": "Sinkend",
  "work.addSignal": "Signal hinzufügen",
  "work.noSignals": "Noch keine Signale.",
  "work.milestones": "Meilensteine",
  "work.milestone.title": "Meilenstein",
  "work.milestone.owner": "Verantwortung",
  "work.milestone.due": "Fällig",
  "work.addMilestone": "Meilenstein hinzufügen",
  "work.noMilestones": "Noch keine Meilensteine.",
  "work.learning": "Lern-Check-ins",
  "work.learning.date": "Datum",
  "work.learning.author": "Verfasst von",
  "work.learning.decision": "Wo das steht",
  "work.decision.growing": "Das wächst",
  "work.decision.tweak": "Nachjustieren",
  "work.decision.surprise": "Eine Überraschung",
  "work.decision.let_go": "Zeit loszulassen",
  "work.learning.whatHappened": "Was ist passiert",
  "work.learning.signalsTelling": "Was die Signale sagen",
  "work.learning.surprisedUs": "Was uns überrascht hat",
  "work.learning.proudOf": "Worauf wir stolz sind",
  "work.learning.doNext": "Was wir als Nächstes tun",
  "work.learning.nextMove": "Nächster Schritt",
  "work.addLearning": "Check-in hinzufügen",
  "work.noLearning": "Noch keine Check-ins.",
  "work.latestLearning": "Letztes Check-in",
  "work.lead": "Projektleitung",
  "work.supportNeeded": "Unterstützung durch das Chapter",
  "work.outOfScope": "Bewusst nicht im Umfang",
  "work.learningCheckpoint": "Nächster Lernpunkt",
  "work.strategicContext": "Strategischer Kontext",
  "work.back": "Zurück zum Portfolio",
  "work.notFound": "Diese Arbeit existiert nicht mehr.",
  "work.section.plan": "Plan",
  "work.section.people": "Menschen",
  "work.section.volunteering": "Freiwilligenarbeit",
  "work.saved": "Gespeichert",
  "work.count": "Arbeiten",
  "work.lookingForPeople": "Sucht Menschen",
  "work.editPlan": "Plan bearbeiten",
  "work.form.kind": "Art der Arbeit",
  "work.form.team": "Team",
  "work.form.unassigned": "Nicht zugewiesen",
  "work.deleteEntry": "Entfernen",
  "journey.add": "Arbeit hinzuf\u00fcgen",
  "journey.title": "Eine Arbeit erstellen",
  "journey.subtitle":
    "Ein kurzer gef\u00fchrter Ablauf: Art der Arbeit w\u00e4hlen, in der Strategie verorten und so weit ausformulieren, wie du heute kommst.",
  "journey.step": "Schritt",
  "journey.of": "von",
  "journey.next": "Weiter",
  "journey.back": "Zur\u00fcck",
  "journey.skip": "Schritt \u00fcberspringen",
  "journey.finish": "Erstellen",
  "journey.creating": "Wird erstellt\u2026",
  "journey.step.kind": "Um welche Art von Arbeit geht es?",
  "journey.step.kindHelp":
    "W\u00e4hle die leichteste passende Form. Die Art l\u00e4sst sich sp\u00e4ter \u00e4ndern.",
  "journey.kindDesc.candidate":
    "Ein festgehaltener Gedanke \u2014 keine Termine, keine Verpflichtung.",
  "journey.kindDesc.simple_task": "Verbindliche Arbeit mit Verantwortung und Terminen.",
  "journey.kindDesc.initiative": "Eine 90-Tage-Etappe mit Signalen, einer Wette und Meilensteinen.",
  "journey.step.context": "Wo geh\u00f6rt das hin?",
  "journey.step.contextHelp": "Verbinde die Arbeit mit dem Ziel und dem Key Result, dem sie dient.",
  "journey.secondaryKrs": "Zahlt zus\u00e4tzlich ein auf",
  "journey.secondaryKrsHelp":
    "Optional \u2014 weitere Key Results, die diese Arbeit unterst\u00fctzt.",
  "journey.noSecondaryKrs": "Keine weiteren Key Results gew\u00e4hlt.",
  "journey.step.work": "Die Arbeit selbst",
  "journey.step.workHelp": "Gib ihr einen klaren Titel und benenne, wer sie tr\u00e4gt.",
  "journey.step.aspiration": "Anspruch und 90-Tage-Etappe",
  "journey.step.aspirationHelp": "Wonach streben wir, und in welchem Zeitraum?",
  "journey.step.bet": "Unsere Wette",
  "journey.step.betHelp":
    "Beschreibe, was ihr versucht, was ihr erwartet und was ihr lernen wollt.",
  "journey.step.signals": "Signale, die wir beobachten",
  "journey.step.signalsHelp":
    "Woran merken wir, dass sich etwas bewegt? Das l\u00e4sst sich auch sp\u00e4ter erg\u00e4nzen.",
  "journey.step.milestones": "Meilensteine",
  "journey.step.milestonesHelp":
    "Ein paar datierte Marken unterwegs. Das l\u00e4sst sich auch sp\u00e4ter erg\u00e4nzen.",
  "journey.step.review": "Pr\u00fcfen und erstellen",
  "journey.step.reviewHelp": "Pr\u00fcfe die Rahmung und erstelle die Arbeit.",
  "journey.needTitle": "Bitte einen Titel angeben.",
  "journey.needKr": "Bitte ein Key Result w\u00e4hlen.",
  "journey.suggest": "Mit dem Assistenten vorschlagen",
  "journey.suggesting": "Assistent wird gefragt\u2026",
  "journey.suggestFailed": "Der Assistent ist gerade nicht verf\u00fcgbar.",
  "journey.suggestions": "Vorschl\u00e4ge des Assistenten",
  "journey.useThis": "\u00dcbernehmen",
  "journey.dismiss": "Verwerfen",
  "journey.discardTitle": "Diese Arbeit verwerfen?",
  "journey.discardBody": "Sie wurde noch nicht erstellt. Alles aus diesem Ablauf geht verloren.",
  "journey.discardConfirm": "Verwerfen",
  "journey.childFailed":
    "Die Arbeit wurde erstellt, aber einzelne Signale oder Meilensteine konnten nicht gespeichert werden.",
  "journey.reviewNothing": "Noch nichts erfasst.",
  "agent.title": "Aspira",
  "agent.subtitle": "Deine OKR-Begleitung – fragen oder gemeinsam entwerfen",
  "agent.open": "Aspira öffnen",
  "agent.close": "Schliessen",
  "agent.placeholder": "Frage stellen…",
  "agent.startOver": "Neu beginnen",
  "agent.disclaimer": "Nur Beratung. Es wird nichts gespeichert.",
  "agent.greeting": "Hallo, ich bin Aspira! Ich erkläre, wie Objectives, Key Results und Initiativen zusammenspielen – oder helfe beim Entwurf.",
  "agent.s1": "Worin unterscheidet sich ein Key Result von einer Initiative?",
  "agent.s2": "Worum geht es bei Objective 2?",
  "agent.s3": "Hilf mir, eine Initiative zu entwerfen",
  "agent.error": "Etwas ist schiefgelaufen. Bitte nochmals versuchen.",
  "agent.thinking": "Denkt nach…",
  "agent.ctx.home.greeting": "Hallo, ich bin Aspira! Auf der Suche nach einem Beitrag? Sag mir, was dich interessiert, und ich zeige dir die passende Arbeit.",
  "agent.ctx.home.s1": "Wo könnte ich als Freiwillige:r helfen?",
  "agent.ctx.home.s2": "Woran arbeitet das Chapter gerade?",
  "agent.ctx.home.s3": "Erkläre mir einfach, was ein Objective ist",
  "agent.ctx.okrs.greeting": "Hallo, ich bin Aspira! Ich erkläre dir jedes Objective oder Key Result auf dieser Seite – oder helfe beim Entwurf.",
  "agent.ctx.okrs.s1": "Fasse Objective 2 zusammen",
  "agent.ctx.okrs.s2": "Wie wird dieses Objective gemessen?",
  "agent.ctx.okrs.s3": "Wie unterscheidet sich ein Key Result von einer Initiative?",
  "agent.ctx.initiatives.greeting": "Hallo, ich bin Aspira! Frag mich zu jeder Initiative im Portfolio – oder gestalten wir gemeinsam eine neue.",
  "agent.ctx.initiatives.s1": "Welche Initiativen laufen gerade?",
  "agent.ctx.initiatives.s2": "Auf welches Key Result zahlt diese Arbeit ein?",
  "agent.ctx.initiatives.s3": "Hilf mir, eine Initiative zu entwerfen",
  "agent.ctx.playground.greeting": "Hallo, ich bin Aspira! Das hier ist ein sicherer Übungsraum – üben wir gemeinsam Objective und Key Results.",
  "agent.ctx.playground.s1": "Hilf mir, ein Objective zu entwerfen",
  "agent.ctx.playground.s2": "Was macht ein Key Result messbar?",
  "agent.ctx.playground.s3": "Prüfe die Qualität meines Entwurfs",
  "agent.ctx.report.greeting": "Hallo, ich bin Aspira! Ich helfe dir, diesen Bericht zu lesen: Fortschritt, Lücken und was die Zahlen bedeuten.",
  "agent.ctx.report.s1": "Wo liegen wir zurück?",
  "agent.ctx.report.s2": "Welche Key Results haben keine Baseline?",
  "agent.ctx.report.s3": "Fasse den Fortschritt für den Vorstand zusammen",
};

const fr: Record<StringKey, string> = {
  "involve.panel.title": "Intérêt des bénévoles",
  "involve.panel.empty": "Personne n\u2019a encore manifesté d\u2019intérêt pour ce travail.",
  "involve.nav": "Participer",
  "involve.eyebrow": "THE SWITZERLAND CHAPTER OF ICF · PARTICIPER",
  "involve.title": "Trouvez votre place dans le chapitre",
  "involve.subtitle":
    "Trois questions courtes, et nous vous montrons les travaux ouverts qui correspondent à vos intérêts, votre temps et vos compétences.",
  "involve.cta.start": "Commencer les trois questions",
  "involve.cta.browse": "Voir tous les travaux",
  "involve.stat.objectives": "Objectifs",
  "involve.stat.open": "Ouverts aux bénévoles",
  "involve.stat.teams": "Équipes",
  "involve.step": "Question",
  "involve.of": "sur",
  "involve.journeyTitle": "Où vous verriez-vous ?",
  "involve.restart": "Recommencer",
  "involve.back": "Retour",
  "involve.q1.title": "Quel objectif vous parle ?",
  "involve.q1.help": "Choisissez l'objectif que vous aimeriez le plus faire avancer.",
  "involve.q1.any": "Je suis ouvert·e",
  "involve.q1.anyHelp": "Montrez-moi les travaux de tous les objectifs.",
  "involve.q1.objective": "Objectif",
  "involve.q2.title": "Combien de temps pouvez-vous donner ?",
  "involve.q2.help": "Soyez honnête — les petites contributions comptent.",
  "involve.time.small": "Une contribution ponctuelle",
  "involve.time.smallHelp": "Une tâche unique avec une fin claire.",
  "involve.time.medium": "Un engagement régulier",
  "involve.time.mediumHelp": "Un travail récurrent ou un chantier plus long.",
  "involve.time.any": "Les deux conviennent",
  "involve.time.anyHelp": "Montrez-moi les deux.",
  "involve.q3.title": "Comment souhaitez-vous aider ?",
  "involve.q3.help": "Il y a de la place pour diriger, soutenir et apporter une expertise.",
  "involve.help.lead": "Diriger quelque chose",
  "involve.help.leadHelp": "Prendre la responsabilité d'un travail.",
  "involve.help.helpers": "Aider une équipe",
  "involve.help.helpersHelp": "Rejoindre celles et ceux qui avancent déjà.",
  "involve.help.skill": "Apporter une compétence précise",
  "involve.help.skillHelp": "Contribuer là où l'expertise manque.",
  "involve.help.any": "Montrez-moi tout",
  "involve.help.anyHelp": "Je déciderai en voyant les travaux.",
  "involve.results.title": "Des travaux qui vous correspondent",
  "involve.results.count": "correspondances",
  "involve.results.empty": "Rien n'est ouvert aux bénévoles pour l'instant. Revenez bientôt.",
  "involve.results.showAll": "Afficher toutes les correspondances",
  "involve.match.why": "Pourquoi cela correspond :",
  "involve.interest.cta": "Manifester son intérêt",
  "involve.interest.intro":
    "Laissez vos coordonnées et le steward de ce travail vous recontactera.",
  "involve.interest.name": "Votre nom",
  "involve.interest.email": "E-mail",
  "involve.interest.message": "Ce que vous souhaitez ajouter (facultatif)",
  "involve.interest.submit": "Envoyer mon intérêt",
  "involve.interest.sending": "Envoi…",
  "involve.interest.success": "Merci. Votre intérêt a été transmis au chapitre.",
  "involve.interest.error": "Votre intérêt n'a pas pu être envoyé. Veuillez réessayer.",
  "involve.interest.privacy":
    "Nous utilisons vos coordonnées uniquement pour vous contacter au sujet de ce travail.",
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

  "kr.section.definition": "Définition",
  "kr.parentObjective": "Objectif parent",
  "kr.section.measurement": "Mesure",
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
  "nav.more": "Plus",
  "access.readonly.title": "Vous êtes connecté avec un accès en lecture seule",
  "access.readonly.body": "Les droits de modification sont gérés dans l’espace membres d’ICF Suisse. Demandez à un administrateur de vous ajouter comme éditeur, puis reconnectez-vous.",
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
  "initiative.open": "Ouvrir l'initiative",
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
  "playground.wizard.confirm.title": "Recommencer ?",
  "playground.wizard.confirm.body":
    "Cela efface vos brouillons et réponses actuels et revient à la première question. Cette action ne peut pas être annulée.",
  "playground.wizard.confirm.continue": "Recommencer",
  "playground.wizard.confirm.cancel": "Conserver les brouillons",
  "playground.wizard.generate": "Générer des brouillons d'exercice",
  "playground.wizard.generating": "Rédaction des suggestions…",
  "playground.ai.option": "Option",
  "playground.ai.error.unavailable":
    "L'aide \u00e0 la r\u00e9daction est indisponible pour le moment. Vous pouvez continuer \u00e0 \u00e9crire vous-m\u00eame ci-dessous ou r\u00e9essayer.",
  "playground.ai.error.rateLimited":
    "Trop de demandes depuis cet appareil. Patientez quelques minutes ou continuez \u00e0 \u00e9crire vous-m\u00eame ci-dessous.",
  "playground.ai.error.invalid":
    "La suggestion re\u00e7ue est inutilisable. R\u00e9essayez ou continuez \u00e0 \u00e9crire vous-m\u00eame ci-dessous.",
  "playground.ai.retry": "R\u00e9essayer",
  "playground.ai.fallback": "Continuer avec des exemples",
  "playground.ai.fallbackNote":
    "Les exemples sont des mod\u00e8les de formulation, pas des suggestions IA. Modifiez-les librement.",
  "playground.ai.nextQuestions": "Questions \u00e0 poser ensuite",
  "playground.card.warnings": "\u00c0 surveiller",
  "playground.meta.measurement": "Mesure",
  "playground.meta.baseline": "Valeur de d\u00e9part",
  "playground.meta.target": "Cible sugg\u00e9r\u00e9e",
  "playground.meta.instrument": "Instrument sugg\u00e9r\u00e9",
  "playground.meta.owner": "R\u00f4le responsable sugg\u00e9r\u00e9",
  "playground.meta.effort": "Effort",
  "playground.meta.timing": "Calendrier / d\u00e9pendances",
  "playground.baseline.known": "Connue \u2014 indiqu\u00e9e par vous",
  "playground.baseline.pending": "\u00c0 \u00e9tablir",
  "playground.baseline.exploratory":
    "Exploratoire \u2014 la bonne mesure reste \u00e0 d\u00e9finir",
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
  "playground.chain.summary.eyebrow": "Résumé de révision",
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
    "Retirer ce Key Result supprimera aussi les initiatives que vous avez choisies pour lui. Continuer ?",
  "playground.chain.confirm.continue": "Continuer",
  "playground.chain.confirm.cancel": "Conserver la sélection actuelle",
  "playground.chain.confirm.new.title": "Démarrer une nouvelle chaîne ?",
  "playground.chain.confirm.new.body":
    "Démarrer une nouvelle chaîne effacera l’Objective, les Key Results et les Initiatives que vous avez construits. Cela ne peut pas être annulé. Continuer ?",
  "playground.chain.confirm.new.continue": "Démarrer une nouvelle chaîne",
  "playground.chain.confirm.new.cancel": "Conserver cette chaîne",
  "playground.chain.note.objToKr":
    "Les Key Results rendent le succès de cet Objective observable et mesurable.",
  "playground.chain.note.krToInit":
    "Les Initiatives sont des travaux possibles qui peuvent faire avancer ce Key Result ; elles ne sont pas des mesures de succès.",
  "playground.chain.note.review":
    "Une chaîne OKR utile relie un changement significatif, des preuves de progrès et un travail ciblé.",
  "playground.chain.wizard.objective": "Étape Objective",
  "playground.chain.wizard.kr": "Étape Key Result",
  "playground.chain.wizard.initiative": "Étape Initiative",
  "playground.chain.limit.kr": "Choisissez jusqu’à 3 Key Results pour cet Objective",
  "playground.chain.limit.krReached":
    "Vous avez atteint 3 Key Results. Désélectionnez-en un pour en choisir un autre.",
  "playground.chain.limit.init": "Choisissez jusqu’à 3 initiatives pour ce Key Result",
  "playground.chain.limit.initReached":
    "Vous avez atteint 3 initiatives pour ce Key Result. Désélectionnez-en une pour en choisir une autre.",
  "playground.chain.initFor": "Initiatives pour",
  "playground.chain.handoff.title": "Rien ici n’atteint le tableau de bord réel",
  "playground.chain.handoff.body":
    "Cette chaîne d’entraînement — l’Objective, ses Key Results et leurs initiatives — n’est jamais copiée dans les données OKR réelles. La connexion conserve uniquement la chaîne dans votre navigateur pour cette session, afin de la ressaisir manuellement dans le tableau de bord.",
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
  "assistant.eyebrow": "Assistant OKR",
  "assistant.description":
    "Rédaction guidée avec contrôles de qualité. À ce stade, rien n’est enregistré dans le tableau de bord.",
  "assistant.title.objective": "Rédiger un Objective",
  "assistant.title.kr": "Rendre un Key Result mesurable",
  "assistant.title.initiative": "Imaginer des Initiatives",
  "assistant.footer": "L’insertion des brouillons sera activée à la prochaine étape.",
  "assistant.cta.create": "Créer avec l’assistant",
  "assistant.cta.measurable": "Rendre mesurable",
  "assistant.cta.initiatives": "Imaginer des initiatives",
  "assistant.ctx.set": "OKR Set",
  "assistant.ctx.kr": "KR",
  "work.kind.candidate": "Idée",
  "work.kind.simple_task": "Tâche simple",
  "work.kind.initiative": "Initiative",
  "work.kinds.candidate": "Idées",
  "work.kinds.simple_task": "Tâches simples",
  "work.kinds.initiative": "Initiatives",
  "work.filterKind": "Type de travail",
  "work.filterAllKinds": "Tous les types",
  "work.filterTeam": "Équipe",
  "work.filterAllTeams": "Toutes les équipes",
  "work.noTeam": "Pas encore d'équipe",
  "work.team": "Équipe",
  "work.size": "Ampleur",
  "work.size.small": "Petit",
  "work.size.medium": "Moyen",
  "work.new": "+ Nouveau travail",
  "work.newIdea": "Noter une idée",
  "work.newTask": "Lancer une tâche simple",
  "work.newInitiative": "Lancer une initiative",
  "work.promote": "Changer de type",
  "work.promoted": "Type mis à jour",
  "work.open": "Ouvrir le résumé",
  "work.empty": "Aucun travail ne correspond à ces filtres.",
  "work.emptyStatus": "Rien pour l'instant",
  "work.idea": "L'idée",
  "work.whyNow": "Pourquoi maintenant",
  "work.proposedOwner": "Responsable proposé",
  "work.phase": "Étape de 90 jours",
  "work.phaseNumber": "Étape",
  "work.phaseType": "Focus de cette étape",
  "work.phaseType.delivery": "Réalisation",
  "work.phaseType.discovery": "Exploration",
  "work.startDate": "Date de début",
  "work.endDate": "Date de fin",
  "work.aspiration": "Notre ambition",
  "work.bet": "Notre pari",
  "work.betAction": "Si nous…",
  "work.betChange": "…alors nous attendons…",
  "work.betQuestion": "…et nous apprendrons…",
  "work.confidence": "Confiance",
  "work.confidence.pretty_confident": "Plutôt confiants",
  "work.confidence.worth_testing": "Vaut un test",
  "work.confidence.wild_card": "Pari risqué",
  "work.signals": "Signaux observés",
  "work.signal.name": "Signal",
  "work.signal.evidence": "Indice",
  "work.evidence.see": "Nous verrions",
  "work.evidence.hear": "Nous entendrions",
  "work.evidence.measure": "Nous mesurerions",
  "work.signal.howNoticed": "Comment nous le remarquons",
  "work.signal.startingPoint": "Point de départ",
  "work.signal.direction": "Direction",
  "work.direction.up": "En hausse",
  "work.direction.down": "En baisse",
  "work.addSignal": "Ajouter un signal",
  "work.noSignals": "Aucun signal pour l'instant.",
  "work.milestones": "Jalons",
  "work.milestone.title": "Jalon",
  "work.milestone.owner": "Responsable",
  "work.milestone.due": "Échéance",
  "work.addMilestone": "Ajouter un jalon",
  "work.noMilestones": "Aucun jalon pour l'instant.",
  "work.learning": "Points d'apprentissage",
  "work.learning.date": "Date",
  "work.learning.author": "Rédigé par",
  "work.learning.decision": "Où cela en est",
  "work.decision.growing": "Cela prend de l'ampleur",
  "work.decision.tweak": "À ajuster",
  "work.decision.surprise": "Une surprise",
  "work.decision.let_go": "Il est temps d'arrêter",
  "work.learning.whatHappened": "Ce qui s'est passé",
  "work.learning.signalsTelling": "Ce que disent les signaux",
  "work.learning.surprisedUs": "Ce qui nous a surpris",
  "work.learning.proudOf": "Ce dont nous sommes fiers",
  "work.learning.doNext": "Ce que nous faisons ensuite",
  "work.learning.nextMove": "Prochaine étape",
  "work.addLearning": "Ajouter un point",
  "work.noLearning": "Aucun point pour l'instant.",
  "work.latestLearning": "Dernier point",
  "work.lead": "Responsable du projet",
  "work.supportNeeded": "Soutien attendu du chapitre",
  "work.outOfScope": "Volontairement hors périmètre",
  "work.learningCheckpoint": "Prochain point d'apprentissage",
  "work.strategicContext": "Contexte stratégique",
  "work.back": "Retour au portefeuille",
  "work.notFound": "Ce travail n'existe plus.",
  "work.section.plan": "Plan",
  "work.section.people": "Personnes",
  "work.section.volunteering": "Bénévolat",
  "work.saved": "Enregistré",
  "work.count": "Travaux",
  "work.lookingForPeople": "Cherche des personnes",
  "work.editPlan": "Modifier le plan",
  "work.form.kind": "Type de travail",
  "work.form.team": "Équipe",
  "work.form.unassigned": "Non attribué",
  "work.deleteEntry": "Supprimer",
  "journey.add": "Ajouter un travail",
  "journey.title": "Cr\u00e9er un travail",
  "journey.subtitle":
    "Un parcours guid\u00e9 court : choisir le type de travail, le rattacher \u00e0 la strat\u00e9gie, puis le cadrer aussi loin que possible aujourd'hui.",
  "journey.step": "\u00c9tape",
  "journey.of": "sur",
  "journey.next": "Suivant",
  "journey.back": "Retour",
  "journey.skip": "Passer cette \u00e9tape",
  "journey.finish": "Cr\u00e9er",
  "journey.creating": "Cr\u00e9ation\u2026",
  "journey.step.kind": "De quel type de travail s'agit-il ?",
  "journey.step.kindHelp":
    "Choisissez la forme la plus l\u00e9g\u00e8re qui convient. Le type peut \u00eatre modifi\u00e9 plus tard.",
  "journey.kindDesc.candidate": "Une id\u00e9e not\u00e9e \u2014 sans dates ni engagement.",
  "journey.kindDesc.simple_task":
    "Un travail engag\u00e9, avec une personne responsable et des dates.",
  "journey.kindDesc.initiative": "Une \u00e9tape de 90 jours avec signaux, pari et jalons.",
  "journey.step.context": "O\u00f9 cela se rattache-t-il ?",
  "journey.step.contextHelp": "Reliez le travail \u00e0 l'objectif et au key result qu'il sert.",
  "journey.secondaryKrs": "Contribue aussi \u00e0",
  "journey.secondaryKrsHelp": "Facultatif \u2014 autres key results soutenus par ce travail.",
  "journey.noSecondaryKrs": "Aucun autre key result s\u00e9lectionn\u00e9.",
  "journey.step.work": "Le travail lui-m\u00eame",
  "journey.step.workHelp": "Donnez-lui un titre clair et indiquez qui le porte.",
  "journey.step.aspiration": "Ambition et \u00e9tape de 90 jours",
  "journey.step.aspirationHelp": "Vers quoi tendons-nous, et sur quelle p\u00e9riode ?",
  "journey.step.bet": "Notre pari",
  "journey.step.betHelp":
    "Dites ce que vous allez essayer, ce que vous attendez et ce que vous allez apprendre.",
  "journey.step.signals": "Signaux observ\u00e9s",
  "journey.step.signalsHelp":
    "Comment verrons-nous que quelque chose bouge ? Vous pouvez les ajouter plus tard.",
  "journey.step.milestones": "Jalons",
  "journey.step.milestonesHelp":
    "Quelques rep\u00e8res dat\u00e9s en chemin. Vous pouvez les ajouter plus tard.",
  "journey.step.review": "V\u00e9rifier et cr\u00e9er",
  "journey.step.reviewHelp": "V\u00e9rifiez le cadrage, puis cr\u00e9ez le travail.",
  "journey.needTitle": "Ajoutez un titre pour continuer.",
  "journey.needKr": "Choisissez un key result pour continuer.",
  "journey.suggest": "Proposer avec l'assistant",
  "journey.suggesting": "Consultation de l'assistant\u2026",
  "journey.suggestFailed": "L'assistant n'est pas disponible pour le moment.",
  "journey.suggestions": "Suggestions de l'assistant",
  "journey.useThis": "Utiliser",
  "journey.dismiss": "Ignorer",
  "journey.discardTitle": "Abandonner ce travail ?",
  "journey.discardBody": "Il n'est pas encore cr\u00e9\u00e9. Tout ce parcours sera perdu.",
  "journey.discardConfirm": "Abandonner",
  "journey.childFailed":
    "Le travail a \u00e9t\u00e9 cr\u00e9\u00e9, mais certains signaux ou jalons n'ont pas pu \u00eatre enregistr\u00e9s.",
  "journey.reviewNothing": "Rien de saisi pour l'instant.",
  "agent.title": "Aspira",
  "agent.subtitle": "Votre compagnon OKR — poser une question ou rédiger ensemble",
  "agent.open": "Ouvrir Aspira",
  "agent.close": "Fermer",
  "agent.placeholder": "Poser une question…",
  "agent.startOver": "Recommencer",
  "agent.disclaimer": "Guide en lecture seule. Rien n'est enregistré.",
  "agent.greeting": "Bonjour, je suis Aspira ! Je peux expliquer comment s'articulent objectifs, résultats clés et initiatives, ou vous aider à en rédiger un.",
  "agent.s1": "Quelle est la différence entre un résultat clé et une initiative ?",
  "agent.s2": "De quoi parle l'objectif 2 ?",
  "agent.s3": "Aidez-moi à rédiger une initiative",
  "agent.error": "Une erreur est survenue. Merci de réessayer.",
  "agent.thinking": "Réflexion…",
  "agent.ctx.home.greeting": "Bonjour, je suis Aspira ! Vous cherchez où contribuer ? Dites-moi ce qui vous intéresse et je vous montre le travail correspondant.",
  "agent.ctx.home.s1": "Où pourrais-je aider comme bénévole ?",
  "agent.ctx.home.s2": "Sur quoi le chapitre travaille-t-il ?",
  "agent.ctx.home.s3": "Expliquez simplement ce qu'est un objectif",
  "agent.ctx.okrs.greeting": "Bonjour, je suis Aspira ! Je peux vous expliquer chaque objectif ou résultat clé de cette page, ou vous aider à en rédiger un.",
  "agent.ctx.okrs.s1": "Résumez l'objectif 2",
  "agent.ctx.okrs.s2": "Comment cet objectif est-il mesuré ?",
  "agent.ctx.okrs.s3": "Quelle différence entre résultat clé et initiative ?",
  "agent.ctx.initiatives.greeting": "Bonjour, je suis Aspira ! Posez-moi une question sur une initiative du portefeuille, ou créons-en une ensemble.",
  "agent.ctx.initiatives.s1": "Quelles initiatives sont en cours ?",
  "agent.ctx.initiatives.s2": "Quel résultat clé ce travail soutient-il ?",
  "agent.ctx.initiatives.s3": "Aidez-moi à rédiger une initiative",
  "agent.ctx.playground.greeting": "Bonjour, je suis Aspira ! Ceci est un bac à sable : entraînons-nous à rédiger un objectif et ses résultats clés.",
  "agent.ctx.playground.s1": "Aidez-moi à rédiger un objectif",
  "agent.ctx.playground.s2": "Qu'est-ce qui rend un résultat clé mesurable ?",
  "agent.ctx.playground.s3": "Vérifiez la qualité de mon brouillon",
  "agent.ctx.report.greeting": "Bonjour, je suis Aspira ! Je peux vous aider à lire ce rapport : progrès, écarts et sens des chiffres.",
  "agent.ctx.report.s1": "Où sommes-nous en retard ?",
  "agent.ctx.report.s2": "Quels résultats clés n'ont pas de référence ?",
  "agent.ctx.report.s3": "Résumez les progrès pour le comité",
};

const it: Record<StringKey, string> = {
  "involve.panel.title": "Interesse dei volontari",
  "involve.panel.empty": "Nessuno ha ancora manifestato interesse per questo lavoro.",
  "involve.nav": "Partecipa",
  "involve.eyebrow": "THE SWITZERLAND CHAPTER OF ICF · PARTECIPA",
  "involve.title": "Trova il tuo posto nel chapter",
  "involve.subtitle":
    "Tre brevi domande e ti mostriamo il lavoro aperto che corrisponde ai tuoi interessi, al tuo tempo e alle tue competenze.",
  "involve.cta.start": "Inizia le tre domande",
  "involve.cta.browse": "Vedi tutti i lavori",
  "involve.stat.objectives": "Obiettivi",
  "involve.stat.open": "Aperti ai volontari",
  "involve.stat.teams": "Team",
  "involve.step": "Domanda",
  "involve.of": "di",
  "involve.journeyTitle": "Dove ti vedresti?",
  "involve.restart": "Ricomincia",
  "involve.back": "Indietro",
  "involve.q1.title": "Quale obiettivo ti ispira?",
  "involve.q1.help": "Scegli l'obiettivo che vorresti far avanzare di più.",
  "involve.q1.any": "Sono aperto/a",
  "involve.q1.anyHelp": "Mostrami lavori di tutti gli obiettivi.",
  "involve.q1.objective": "Obiettivo",
  "involve.q2.title": "Quanto tempo puoi dedicare?",
  "involve.q2.help": "Sii sincero/a: anche i piccoli contributi contano.",
  "involve.time.small": "Un contributo una tantum",
  "involve.time.smallHelp": "Un singolo compito con una fine chiara.",
  "involve.time.medium": "Un impegno regolare",
  "involve.time.mediumHelp": "Lavoro ricorrente o un percorso più lungo.",
  "involve.time.any": "Vanno bene entrambi",
  "involve.time.anyHelp": "Mostrami entrambi.",
  "involve.q3.title": "Come vorresti contribuire?",
  "involve.q3.help": "C'è spazio per guidare, sostenere e portare competenze.",
  "involve.help.lead": "Guidare qualcosa",
  "involve.help.leadHelp": "Assumere la responsabilità di un lavoro.",
  "involve.help.helpers": "Aiutare un team",
  "involve.help.helpersHelp": "Unirti a chi è già in movimento.",
  "involve.help.skill": "Portare una competenza specifica",
  "involve.help.skillHelp": "Contribuire dove manca l'esperienza.",
  "involve.help.any": "Mostrami tutto",
  "involve.help.anyHelp": "Deciderò quando vedrò i lavori.",
  "involve.results.title": "Lavori adatti a te",
  "involve.results.count": "corrispondenze",
  "involve.results.empty": "Al momento non c'è nulla di aperto ai volontari. Torna presto.",
  "involve.results.showAll": "Mostra tutte le corrispondenze",
  "involve.match.why": "Perché è adatto:",
  "involve.interest.cta": "Manifesta interesse",
  "involve.interest.intro": "Lascia i tuoi dati e lo steward di questo lavoro ti ricontatterà.",
  "involve.interest.name": "Il tuo nome",
  "involve.interest.email": "E-mail",
  "involve.interest.message": "Qualcosa da aggiungere (facoltativo)",
  "involve.interest.submit": "Invia il mio interesse",
  "involve.interest.sending": "Invio…",
  "involve.interest.success": "Grazie. Il tuo interesse è stato trasmesso al chapter.",
  "involve.interest.error": "Non è stato possibile inviare il tuo interesse. Riprova.",
  "involve.interest.privacy": "Usiamo i tuoi dati solo per contattarti riguardo a questo lavoro.",
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

  "kr.section.definition": "Definizione",
  "kr.parentObjective": "Obiettivo di riferimento",
  "kr.section.measurement": "Misurazione",
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
  "nav.more": "Altro",
  "access.readonly.title": "Hai effettuato l’accesso in sola lettura",
  "access.readonly.body": "I diritti di modifica sono gestiti nell’area soci di ICF Svizzera. Chiedi a un amministratore di aggiungerti come editor e poi accedi di nuovo.",
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
  "initiative.open": "Apri iniziativa",
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
  "playground.wizard.confirm.title": "Ricominciare?",
  "playground.wizard.confirm.body":
    "Questo cancella le bozze e le risposte attuali e torna alla prima domanda. L'operazione non può essere annullata.",
  "playground.wizard.confirm.continue": "Ricomincia",
  "playground.wizard.confirm.cancel": "Mantieni le bozze",
  "playground.wizard.generate": "Genera bozze di esercitazione",
  "playground.wizard.generating": "Sto preparando i suggerimenti…",
  "playground.ai.option": "Opzione",
  "playground.ai.error.unavailable":
    "La generazione di bozze non \u00e8 disponibile in questo momento. Pu\u00f2 continuare a scrivere qui sotto o riprovare fra poco.",
  "playground.ai.error.rateLimited":
    "Troppe richieste da questo dispositivo. Attenda alcuni minuti oppure continui a scrivere qui sotto.",
  "playground.ai.error.invalid":
    "Il suggerimento ricevuto non \u00e8 utilizzabile. Riprovi oppure continui a scrivere qui sotto.",
  "playground.ai.retry": "Riprova",
  "playground.ai.fallback": "Continua con bozze di esempio",
  "playground.ai.fallbackNote":
    "Le bozze di esempio sono modelli illustrativi, non suggerimenti AI. Pu\u00f2 modificarle liberamente.",
  "playground.ai.nextQuestions": "Domande successive",
  "playground.card.warnings": "Da tenere d'occhio",
  "playground.meta.measurement": "Misurazione",
  "playground.meta.baseline": "Valore di partenza",
  "playground.meta.target": "Target suggerito",
  "playground.meta.instrument": "Strumento suggerito",
  "playground.meta.owner": "Ruolo responsabile suggerito",
  "playground.meta.effort": "Impegno",
  "playground.meta.timing": "Tempistica / dipendenze",
  "playground.baseline.known": "Noto \u2014 indicato da lei",
  "playground.baseline.pending": "Da rilevare",
  "playground.baseline.exploratory": "Esplorativo \u2014 la misura giusta non \u00e8 chiara",
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
  "playground.chain.summary.eyebrow": "Riepilogo di revisione",
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
    "Rimuovendo questo Key Result verranno rimosse anche le iniziative scelte per esso. Continuare?",
  "playground.chain.confirm.continue": "Continua",
  "playground.chain.confirm.cancel": "Mantieni la selezione attuale",
  "playground.chain.confirm.new.title": "Avviare una nuova catena?",
  "playground.chain.confirm.new.body":
    "Avviando una nuova catena verranno cancellati l’Objective, i Key Result e le Iniziative che hai costruito. Non può essere annullato. Continuare?",
  "playground.chain.confirm.new.continue": "Avvia una nuova catena",
  "playground.chain.confirm.new.cancel": "Mantieni questa catena",
  "playground.chain.note.objToKr":
    "I Key Result rendono osservabile e misurabile il successo di questo Objective.",
  "playground.chain.note.krToInit":
    "Le Iniziative sono possibili attività che possono far avanzare questo Key Result; non sono di per sé misure di successo.",
  "playground.chain.note.review":
    "Una catena OKR utile collega un cambiamento significativo, prove di progresso e lavoro mirato.",
  "playground.chain.wizard.objective": "Passaggio Objective",
  "playground.chain.wizard.kr": "Passaggio Key Result",
  "playground.chain.wizard.initiative": "Passaggio Iniziativa",
  "playground.chain.limit.kr": "Scegli fino a 3 Key Result per questo Objective",
  "playground.chain.limit.krReached":
    "Hai raggiunto 3 Key Result. Deseleziona un elemento per sceglierne un altro.",
  "playground.chain.limit.init": "Scegli fino a 3 iniziative per questo Key Result",
  "playground.chain.limit.initReached":
    "Hai raggiunto 3 iniziative per questo Key Result. Deseleziona un elemento per sceglierne un altro.",
  "playground.chain.initFor": "Iniziative per",
  "playground.chain.handoff.title": "Nulla di questo raggiunge la dashboard reale",
  "playground.chain.handoff.body":
    "Questa catena di esercitazione — l’Objective, i suoi Key Result e le relative iniziative — non viene mai copiata nei dati OKR reali. L’accesso conserva la catena solo nel browser per questa sessione, così puoi reinserirla manualmente nella dashboard.",
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
  "assistant.eyebrow": "Assistente OKR",
  "assistant.description":
    "Stesura guidata con controlli di qualità. In questa fase nulla viene salvato nella dashboard.",
  "assistant.title.objective": "Redigere un Objective",
  "assistant.title.kr": "Rendere misurabile un Key Result",
  "assistant.title.initiative": "Ideare Initiatives",
  "assistant.footer": "L’inserimento delle bozze sarà attivato nella fase successiva.",
  "assistant.cta.create": "Crea con l’assistente",
  "assistant.cta.measurable": "Rendi misurabile",
  "assistant.cta.initiatives": "Idea iniziative",
  "assistant.ctx.set": "OKR Set",
  "assistant.ctx.kr": "KR",
  "work.kind.candidate": "Idea",
  "work.kind.simple_task": "Compito semplice",
  "work.kind.initiative": "Iniziativa",
  "work.kinds.candidate": "Idee",
  "work.kinds.simple_task": "Compiti semplici",
  "work.kinds.initiative": "Iniziative",
  "work.filterKind": "Tipo di lavoro",
  "work.filterAllKinds": "Tutti i tipi",
  "work.filterTeam": "Team",
  "work.filterAllTeams": "Tutti i team",
  "work.noTeam": "Nessun team",
  "work.team": "Team",
  "work.size": "Dimensione",
  "work.size.small": "Piccolo",
  "work.size.medium": "Medio",
  "work.new": "+ Nuovo lavoro",
  "work.newIdea": "Annota un'idea",
  "work.newTask": "Avvia un compito semplice",
  "work.newInitiative": "Avvia un'iniziativa",
  "work.promote": "Cambia tipo",
  "work.promoted": "Tipo aggiornato",
  "work.open": "Apri la scheda",
  "work.empty": "Nessun lavoro corrisponde a questi filtri.",
  "work.emptyStatus": "Ancora nulla",
  "work.idea": "L'idea",
  "work.whyNow": "Perché ora",
  "work.proposedOwner": "Responsabile proposto",
  "work.phase": "Tappa di 90 giorni",
  "work.phaseNumber": "Tappa",
  "work.phaseType": "Focus di questa tappa",
  "work.phaseType.delivery": "Realizzazione",
  "work.phaseType.discovery": "Esplorazione",
  "work.startDate": "Data d'inizio",
  "work.endDate": "Data di fine",
  "work.aspiration": "La nostra aspirazione",
  "work.bet": "La nostra scommessa",
  "work.betAction": "Se noi…",
  "work.betChange": "…allora ci aspettiamo…",
  "work.betQuestion": "…e impareremo…",
  "work.confidence": "Fiducia",
  "work.confidence.pretty_confident": "Abbastanza fiduciosi",
  "work.confidence.worth_testing": "Vale la pena testare",
  "work.confidence.wild_card": "Scommessa azzardata",
  "work.signals": "Segnali che osserviamo",
  "work.signal.name": "Segnale",
  "work.signal.evidence": "Evidenza",
  "work.evidence.see": "Vedremmo",
  "work.evidence.hear": "Sentiremmo",
  "work.evidence.measure": "Misureremmo",
  "work.signal.howNoticed": "Come lo notiamo",
  "work.signal.startingPoint": "Punto di partenza",
  "work.signal.direction": "Direzione",
  "work.direction.up": "In aumento",
  "work.direction.down": "In calo",
  "work.addSignal": "Aggiungi un segnale",
  "work.noSignals": "Nessun segnale finora.",
  "work.milestones": "Traguardi",
  "work.milestone.title": "Traguardo",
  "work.milestone.owner": "Responsabile",
  "work.milestone.due": "Scadenza",
  "work.addMilestone": "Aggiungi un traguardo",
  "work.noMilestones": "Nessun traguardo finora.",
  "work.learning": "Momenti di apprendimento",
  "work.learning.date": "Data",
  "work.learning.author": "Scritto da",
  "work.learning.decision": "A che punto siamo",
  "work.decision.growing": "Sta crescendo",
  "work.decision.tweak": "Da correggere",
  "work.decision.surprise": "Una sorpresa",
  "work.decision.let_go": "È ora di lasciar andare",
  "work.learning.whatHappened": "Cosa è successo",
  "work.learning.signalsTelling": "Cosa dicono i segnali",
  "work.learning.surprisedUs": "Cosa ci ha sorpreso",
  "work.learning.proudOf": "Di cosa siamo fieri",
  "work.learning.doNext": "Cosa faremo dopo",
  "work.learning.nextMove": "Prossima mossa",
  "work.addLearning": "Aggiungi un momento",
  "work.noLearning": "Nessun momento finora.",
  "work.latestLearning": "Ultimo momento",
  "work.lead": "Responsabile del progetto",
  "work.supportNeeded": "Supporto richiesto al chapter",
  "work.outOfScope": "Volutamente fuori ambito",
  "work.learningCheckpoint": "Prossimo punto di apprendimento",
  "work.strategicContext": "Contesto strategico",
  "work.back": "Torna al portfolio",
  "work.notFound": "Questo lavoro non esiste più.",
  "work.section.plan": "Piano",
  "work.section.people": "Persone",
  "work.section.volunteering": "Volontariato",
  "work.saved": "Salvato",
  "work.count": "Lavori",
  "work.lookingForPeople": "Cerca persone",
  "work.editPlan": "Modifica il piano",
  "work.form.kind": "Tipo di lavoro",
  "work.form.team": "Team",
  "work.form.unassigned": "Non assegnato",
  "work.deleteEntry": "Rimuovi",
  "journey.add": "Aggiungi lavoro",
  "journey.title": "Creare un lavoro",
  "journey.subtitle":
    "Un percorso guidato breve: scegliere il tipo di lavoro, collocarlo nella strategia e definirlo fin dove si riesce oggi.",
  "journey.step": "Passo",
  "journey.of": "di",
  "journey.next": "Avanti",
  "journey.back": "Indietro",
  "journey.skip": "Salta questo passo",
  "journey.finish": "Crea",
  "journey.creating": "Creazione\u2026",
  "journey.step.kind": "Di che tipo di lavoro si tratta?",
  "journey.step.kindHelp":
    "Scegli la forma pi\u00f9 leggera adatta. Il tipo si pu\u00f2 cambiare pi\u00f9 tardi.",
  "journey.kindDesc.candidate": "Un pensiero annotato \u2014 senza date n\u00e9 impegni.",
  "journey.kindDesc.simple_task": "Lavoro impegnato, con una persona responsabile e delle date.",
  "journey.kindDesc.initiative": "Una tappa di 90 giorni con segnali, una scommessa e traguardi.",
  "journey.step.context": "Dove si colloca?",
  "journey.step.contextHelp": "Collega il lavoro all'obiettivo e al key result che serve.",
  "journey.secondaryKrs": "Contribuisce anche a",
  "journey.secondaryKrsHelp": "Facoltativo \u2014 altri key result sostenuti da questo lavoro.",
  "journey.noSecondaryKrs": "Nessun altro key result selezionato.",
  "journey.step.work": "Il lavoro in s\u00e9",
  "journey.step.workHelp": "Dagli un titolo chiaro e indica chi lo porta avanti.",
  "journey.step.aspiration": "Aspirazione e tappa di 90 giorni",
  "journey.step.aspirationHelp": "A cosa puntiamo e in quale periodo?",
  "journey.step.bet": "La nostra scommessa",
  "journey.step.betHelp": "Indica cosa proverete, cosa vi aspettate e cosa imparerete.",
  "journey.step.signals": "Segnali che osserviamo",
  "journey.step.signalsHelp":
    "Come noteremo che qualcosa si muove? Si possono aggiungere anche pi\u00f9 tardi.",
  "journey.step.milestones": "Traguardi",
  "journey.step.milestonesHelp":
    "Alcuni riferimenti con data lungo il percorso. Si possono aggiungere anche pi\u00f9 tardi.",
  "journey.step.review": "Verifica e crea",
  "journey.step.reviewHelp": "Controlla l'impostazione e crea il lavoro.",
  "journey.needTitle": "Aggiungi un titolo per continuare.",
  "journey.needKr": "Scegli un key result per continuare.",
  "journey.suggest": "Proponi con l'assistente",
  "journey.suggesting": "Richiesta all'assistente\u2026",
  "journey.suggestFailed": "L'assistente non \u00e8 disponibile al momento.",
  "journey.suggestions": "Suggerimenti dell'assistente",
  "journey.useThis": "Usa questo",
  "journey.dismiss": "Ignora",
  "journey.discardTitle": "Scartare questo lavoro?",
  "journey.discardBody":
    "Non \u00e8 ancora stato creato. Tutto quello inserito in questo percorso andr\u00e0 perso.",
  "journey.discardConfirm": "Scarta",
  "journey.childFailed":
    "Il lavoro \u00e8 stato creato, ma alcuni segnali o traguardi non sono stati salvati.",
  "journey.reviewNothing": "Ancora nulla inserito.",
  "agent.title": "Aspira",
  "agent.subtitle": "Il tuo compagno OKR — chiedi o crea insieme",
  "agent.open": "Apri Aspira",
  "agent.close": "Chiudi",
  "agent.placeholder": "Fai una domanda…",
  "agent.startOver": "Ricomincia",
  "agent.disclaimer": "Guida in sola lettura. Non viene salvato nulla.",
  "agent.greeting": "Ciao, sono Aspira! Posso spiegare come si collegano obiettivi, risultati chiave e iniziative, oppure aiutarti a redigerne uno.",
  "agent.s1": "Che differenza c'è tra un risultato chiave e un'iniziativa?",
  "agent.s2": "Di cosa tratta l'obiettivo 2?",
  "agent.s3": "Aiutami a redigere un'iniziativa",
  "agent.error": "Qualcosa è andato storto. Riprova.",
  "agent.thinking": "Sto pensando…",
  "agent.ctx.home.greeting": "Ciao, sono Aspira! Cerchi dove contribuire? Dimmi cosa ti interessa e ti mostro il lavoro collegato.",
  "agent.ctx.home.s1": "Dove potrei aiutare come volontario?",
  "agent.ctx.home.s2": "A cosa sta lavorando il chapter?",
  "agent.ctx.home.s3": "Spiegami in modo semplice cos'è un obiettivo",
  "agent.ctx.okrs.greeting": "Ciao, sono Aspira! Posso spiegarti ogni obiettivo o risultato chiave di questa pagina, o aiutarti a redigerne uno.",
  "agent.ctx.okrs.s1": "Riassumi l'obiettivo 2",
  "agent.ctx.okrs.s2": "Come si misura questo obiettivo?",
  "agent.ctx.okrs.s3": "Che differenza c'è tra risultato chiave e iniziativa?",
  "agent.ctx.initiatives.greeting": "Ciao, sono Aspira! Chiedimi di qualsiasi iniziativa del portafoglio, oppure creiamone una insieme.",
  "agent.ctx.initiatives.s1": "Quali iniziative sono in corso?",
  "agent.ctx.initiatives.s2": "Quale risultato chiave sostiene questo lavoro?",
  "agent.ctx.initiatives.s3": "Aiutami a redigere un'iniziativa",
  "agent.ctx.playground.greeting": "Ciao, sono Aspira! Questo è uno spazio di prova: esercitiamoci a scrivere un obiettivo e i risultati chiave.",
  "agent.ctx.playground.s1": "Aiutami a redigere un obiettivo",
  "agent.ctx.playground.s2": "Cosa rende misurabile un risultato chiave?",
  "agent.ctx.playground.s3": "Controlla la qualità della mia bozza",
  "agent.ctx.report.greeting": "Ciao, sono Aspira! Posso aiutarti a leggere questo report: progressi, lacune e significato dei numeri.",
  "agent.ctx.report.s1": "Dove siamo indietro?",
  "agent.ctx.report.s2": "Quali risultati chiave non hanno una baseline?",
  "agent.ctx.report.s3": "Riassumi i progressi per il board",
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
