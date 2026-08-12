import type { StringKey } from "./i18n-strings";
import type { PlaygroundMode } from "./playground-drafts";

/**
 * Deterministic, client-side quality checks for the public /playground.
 *
 * These are lightweight keyword and pattern heuristics — never certainty.
 * All copy is phrased as guidance, and nothing here reads or writes data.
 */

export type CheckTone = "positive" | "amber" | "neutral";

export type QualityCheck = {
  id: string;
  tone: CheckTone;
  titleKey: StringKey;
  bodyKey: StringKey;
};

const norm = (v: string) => ` ${v.toLowerCase().replace(/\s+/g, " ").trim()} `;

const has = (text: string, words: string[]) =>
  words.some((w) => new RegExp(`(^|[^\\p{L}])${w}`, "iu").test(text));

/** Task / activity verbs across the four supported languages. */
const TASK_WORDS = [
  "launch",
  "build",
  "create",
  "run",
  "deliver",
  "hold",
  "develop",
  "publish",
  "organis",
  "organiz",
  "set up",
  "roll out",
  "lancieren",
  "starten",
  "aufbauen",
  "erstellen",
  "durchführen",
  "durchfuehren",
  "liefern",
  "entwickeln",
  "veröffentlichen",
  "veroeffentlichen",
  "organisieren",
  "einführen",
  "lancer",
  "construire",
  "créer",
  "creer",
  "réaliser",
  "realiser",
  "livrer",
  "développer",
  "developper",
  "publier",
  "organiser",
  "tenir",
  "lanciare",
  "costruire",
  "creare",
  "svolgere",
  "consegnare",
  "sviluppare",
  "pubblicare",
  "organizzare",
];

/** Words that point to an audience or beneficiary. */
const BENEFICIARY_WORDS = [
  "member",
  "coach",
  "client",
  "volunteer",
  "board",
  "chapter",
  "partner",
  "student",
  "community",
  "public",
  "sponsor",
  "customer",
  "stakeholder",
  "mitglied",
  "kund",
  "freiwillig",
  "vorstand",
  "gemeinschaft",
  "partner",
  "öffentlichkeit",
  "oeffentlichkeit",
  "membre",
  "bénévole",
  "benevole",
  "comité",
  "comite",
  "communauté",
  "communaute",
  "client",
  "public",
  "membri",
  "volontari",
  "comitato",
  "comunità",
  "comunita",
  "clienti",
  "pubblico",
];

/** Words that suggest measurement or observable evidence. */
const MEASURE_WORDS = [
  "percent",
  "score",
  "count",
  "rate",
  "number",
  "survey",
  "nps",
  "index",
  "milestone",
  "target",
  "baseline",
  "prozent",
  "anzahl",
  "quote",
  "umfrage",
  "kennzahl",
  "meilenstein",
  "zielwert",
  "ausgangswert",
  "pourcentage",
  "nombre",
  "taux",
  "enquête",
  "enquete",
  "jalon",
  "cible",
  "référence",
  "reference",
  "percentuale",
  "numero",
  "tasso",
  "sondaggio",
  "milestone",
  "obiettivo",
  "valore",
];

/** Words that suggest a defined evidence source or observation method. */
const INSTRUMENT_WORDS = [
  "survey",
  "report",
  "dashboard",
  "register",
  "database",
  "list",
  "record",
  "log",
  "feedback",
  "analytics",
  "crm",
  "audit",
  "minutes",
  "umfrage",
  "bericht",
  "register",
  "datenbank",
  "liste",
  "protokoll",
  "auswertung",
  "rückmeldung",
  "rueckmeldung",
  "enquête",
  "enquete",
  "rapport",
  "registre",
  "base de données",
  "base de donnees",
  "liste",
  "compte rendu",
  "sondaggio",
  "rapporto",
  "registro",
  "banca dati",
  "elenco",
  "verbale",
];

/** Words that suggest ownership or effort sizing. */
const OWNER_WORDS = [
  "steward",
  "owner",
  "lead",
  "responsible",
  "volunteer",
  "hour",
  "day",
  "week",
  "month",
  "fte",
  "capacity",
  "effort",
  "verantwortlich",
  "leitung",
  "freiwillig",
  "stunde",
  "tag",
  "woche",
  "monat",
  "kapazität",
  "kapazitaet",
  "aufwand",
  "responsable",
  "pilote",
  "bénévole",
  "benevole",
  "heure",
  "jour",
  "semaine",
  "mois",
  "capacité",
  "capacite",
  "charge",
  "responsabile",
  "referente",
  "volontario",
  "ora",
  "giorno",
  "settimana",
  "mese",
  "capacità",
  "capacita",
  "impegno",
];

const NUMERIC = /\d/;
const DATE_LIKE = /\b(20\d{2}|q[1-4]|\d{1,2}[./-]\d{1,2})\b/i;

/** Rough "several unrelated changes" signal: joined clauses or list separators. */
function looksMultiThreaded(text: string): boolean {
  const joiners = (text.match(/(,| and | und | et | e | & |;|\/)/gi) ?? []).length;
  return joiners >= 2 || text.split(/\s+/).length > 30;
}

/**
 * Runs the checks for one draft statement.
 * `answers` are the three wizard answers, used for the baseline / instrument /
 * parent Key Result / owner notes that cannot be read from the statement alone.
 */
export function runQualityChecks(
  mode: PlaygroundMode,
  statement: string,
  answers: string[] = [],
): QualityCheck[] {
  const text = norm(statement);
  const all = norm([statement, ...answers].join(" "));
  const checks: QualityCheck[] = [];

  if (!statement.trim()) return checks;

  if (mode === "objective") {
    if (has(text, TASK_WORDS)) {
      checks.push({
        id: "obj-task",
        tone: "amber",
        titleKey: "playground.check.obj.task.title",
        bodyKey: "playground.check.obj.task.body",
      });
    }
    if (looksMultiThreaded(text)) {
      checks.push({
        id: "obj-multi",
        tone: "amber",
        titleKey: "playground.check.obj.multi.title",
        bodyKey: "playground.check.obj.multi.body",
      });
    }
    if (!has(all, BENEFICIARY_WORDS)) {
      checks.push({
        id: "obj-beneficiary",
        tone: "neutral",
        titleKey: "playground.check.obj.beneficiary.title",
        bodyKey: "playground.check.obj.beneficiary.body",
      });
    }
  }

  if (mode === "kr") {
    if (has(text, TASK_WORDS)) {
      checks.push({
        id: "kr-activity",
        tone: "amber",
        titleKey: "playground.check.kr.activity.title",
        bodyKey: "playground.check.kr.activity.body",
      });
    }
    const measurable =
      NUMERIC.test(statement) || DATE_LIKE.test(statement) || has(text, MEASURE_WORDS);
    if (!measurable) {
      checks.push({
        id: "kr-measure",
        tone: "amber",
        titleKey: "playground.check.kr.measure.title",
        bodyKey: "playground.check.kr.measure.body",
      });
    }
    const hasBaseline =
      /baseline|ausgangswert|référence|reference|valore di partenza|partenza/i.test(all) ||
      /\bfrom\s+\d|\bvon\s+\d|\bde\s+\d|\bda\s+\d/i.test(all);
    if (!hasBaseline) {
      checks.push({
        id: "kr-baseline",
        tone: "neutral",
        titleKey: "playground.check.kr.baseline.title",
        bodyKey: "playground.check.kr.baseline.body",
      });
    }
    if (!has(all, INSTRUMENT_WORDS)) {
      checks.push({
        id: "kr-instrument",
        tone: "neutral",
        titleKey: "playground.check.kr.instrument.title",
        bodyKey: "playground.check.kr.instrument.body",
      });
    }
  }

  if (mode === "initiative") {
    const looksLikeTarget =
      /\d\s*%/.test(statement) ||
      /(increase|reduce|improve|steiger|erhöh|erhoeh|reduzier|augmenter|réduire|reduire|aumentare|ridurre)/i.test(
        statement,
      );
    if (looksLikeTarget) {
      checks.push({
        id: "init-target",
        tone: "amber",
        titleKey: "playground.check.init.target.title",
        bodyKey: "playground.check.init.target.body",
      });
    }
    const parent = (answers[0] ?? "").trim();
    if (parent.length < 3) {
      checks.push({
        id: "init-parent",
        tone: "neutral",
        titleKey: "playground.check.init.parent.title",
        bodyKey: "playground.check.init.parent.body",
      });
    }
    if (!has(all, OWNER_WORDS)) {
      checks.push({
        id: "init-owner",
        tone: "neutral",
        titleKey: "playground.check.init.owner.title",
        bodyKey: "playground.check.init.owner.body",
      });
    }
  }

  if (checks.length === 0) {
    checks.push({
      id: `${mode}-ok`,
      tone: "positive",
      titleKey: "playground.check.ok.title",
      bodyKey: "playground.check.ok.body",
    });
  }

  return checks;
}
