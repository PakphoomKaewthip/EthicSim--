import type { Topic } from '../types/ethics';

export const KEY = "ethicsim.results.v1";

export const loadResults = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

export const saveResult = (id: string, score: number) => {
  const r = loadResults();
  r[id] = score;
  localStorage.setItem(KEY, JSON.stringify(r));
};

export function archetype(results: Record<string, number>) {
  const done = topics.map(t => results[t.id] ?? 0).filter(v => v > 0);
  const avg = done.length ? done.reduce((a, b) => a + b, 0) / done.length : 0;
  const spread = done.length ? Math.max(...done) - Math.min(...done) : 0;
  if (avg >= 85 && spread <= 20) return { name: "The Steward", blurb: "You weigh user impact before velocity and you bring alternatives, not just objections. Keep pushing for written process so your judgement survives team changes." };
  if (avg >= 70) return { name: "The Pragmatic Guardian", blurb: "You reliably spot the ethical risk and usually find a workable path. Your gap is consistency under deadline pressure." };
  if (avg >= 50) return { name: "The Shipper", blurb: "Delivery instincts are strong, but a few choices traded long-term trust for short-term speed. Revisit consent scope and accountability." };
  return { name: "The Fast Mover", blurb: "You optimise for momentum. Replay the scenarios and read the reasoning panels — most of these dilemmas have a compliant option that still ships." };
}

export const topics: Topic[] = [
  {
    id: "privacy-shield", index: 1, title: "The Privacy Shield",
    tagline: "Personal data, consent, confidentiality and secure handling.",
    axis: "Privacy", short: "Privacy", minutes: 3,
    intro: [
      "Your team ships a fitness app. Growth is flat, and marketing wants 'more signal' from the users you already have.",
      "Every extra field you log is a promise you have to keep. Consent is not a checkbox you win — it is a scope you agree to."
    ],
    scenarios: [
      { kind: "choice", prompt: "Marketing asks you to also store precise GPS traces 'for future features'.", context: "The consent screen only mentions step counts and workout duration.",
        options: [
          { label: "Log it now, ask for consent later", score: 10, principle: "Purpose limitation", feedback: "Collecting beyond the disclosed purpose breaks the consent contract even if the data is never used. ACM 1.6 asks you to collect only what the stated purpose requires." },
          { label: "Store coarse city-level location only, disclosed in the consent screen", score: 85, principle: "Data minimisation", feedback: "Good middle ground: the feature idea survives, the disclosure stays truthful, and the blast radius of a breach shrinks." },
          { label: "Refuse any location work and close the discussion", score: 55, principle: "Professional judgement", feedback: "Defensible but incomplete. Ethical practice includes proposing a compliant alternative, not only blocking." }
        ] },
      { kind: "slider", prompt: "How long should raw workout logs be retained?", context: "Analytics wants forever. Legal says 'as short as is useful'.", minLabel: "30 days", maxLabel: "Indefinitely", ideal: 25, principle: "Retention limits",
        feedback: "Shorter retention with aggregated long-term stats keeps the product insight and drops the liability. Indefinite raw retention is the most common privacy debt in small teams." },
      { kind: "choice", prompt: "A support engineer asks for production DB access to debug one user's issue.", context: "It is 11pm and the customer is angry.",
        options: [
          { label: "Share your own admin credentials for the night", score: 5, principle: "Access control", feedback: "Shared credentials destroy accountability — nothing in the audit log can tell the two of you apart." },
          { label: "Grant scoped, time-limited access to that record with logging", score: 95, principle: "Least privilege", feedback: "Least privilege plus an audit trail solves the urgency without turning one incident into standing access." },
          { label: "Export the user's full row to a shared drive", score: 20, principle: "Confidentiality", feedback: "Copies escape governance. Data that leaves the system of record is data you can no longer delete on request." }
        ] }
    ]
  },
  {
    id: "bug-bounty", index: 2, title: "Bug, Bounty & Liability",
    tagline: "Vulnerabilities, responsible disclosure and software liability.",
    axis: "Responsibility", short: "Liability", minutes: 3,
    intro: [
      "A researcher emails you at 02:00: authentication can be bypassed on your billing endpoint.",
      "Disclosure is a clock, not a debate. How you spend the first 72 hours defines whether users pay for your bug."
    ],
    scenarios: [
      { kind: "choice", prompt: "The report is credible and unpatched. What is your first move?", context: "Your PR team suggests staying quiet until after the launch event.",
        options: [
          { label: "Acknowledge, triage, and set a public disclosure timeline", score: 95, principle: "Responsible disclosure", feedback: "Acknowledging within hours and committing to a timeline keeps the researcher cooperative and users protected." },
          { label: "Ignore the email until after launch", score: 5, principle: "Duty of care", feedback: "Silence converts a fixable defect into negligence. Known and unmitigated is the worst legal posture you can hold." },
          { label: "Threaten legal action for unauthorised testing", score: 10, principle: "Good faith research", feedback: "Chilling good-faith research pushes the next finder toward a marketplace instead of your inbox." }
        ] },
      { kind: "slider", prompt: "How much of the technical detail do you publish with the fix?", context: "Enough for defenders to verify, not enough to hand attackers a script.", minLabel: "Nothing at all", maxLabel: "Full exploit code", ideal: 45, principle: "Proportional transparency",
        feedback: "Publish impact, affected versions and mitigation; delay weaponisable detail until patch adoption is high." },
      { kind: "choice", prompt: "The bug came from a dependency your team never reviewed.", context: "Someone suggests blaming the upstream maintainer in the postmortem.",
        options: [
          { label: "Own the shipped defect and add dependency review to the process", score: 95, principle: "Accountability", feedback: "You shipped it, so you own it. Process change is what turns an incident into an improvement." },
          { label: "Point users to the upstream project", score: 20, principle: "Accountability", feedback: "Users bought your product, not your supply chain. Deflection erodes the trust the fix was meant to restore." }
        ] }
    ]
  },
  {
    id: "unmasking-ai", index: 3, title: "Unmasking AI",
    tagline: "Fairness, bias, transparency and accountable AI development.",
    axis: "AI Ethics", short: "AI Ethics", minutes: 3,
    intro: [
      "Your model screens job applications. It is 8% more accurate than the old rules engine — and it rejects one demographic twice as often.",
      "A model that is accurate on average can still be unfair to everyone who is not the average."
    ],
    scenarios: [
      { kind: "choice", prompt: "Validation shows a large disparity in false-rejection rates across groups.", context: "Launch is in two weeks and the accuracy number is already in the deck.",
        options: [
          { label: "Ship it — overall accuracy improved", score: 5, principle: "Fairness", feedback: "Aggregate accuracy hides distributional harm. NIST AI RMF asks you to measure harms per subgroup, not per dataset." },
          { label: "Hold launch, audit features and re-evaluate per subgroup", score: 95, principle: "Bias mitigation", feedback: "Slipping a date is recoverable; systematically rejecting qualified candidates is not." },
          { label: "Ship with a disclaimer in the docs", score: 25, principle: "Accountability", feedback: "A disclaimer transfers blame, not risk. Documentation is not a control." }
        ] },
      { kind: "slider", prompt: "How much decision authority should the model hold?", context: "From advisory-only ranking to fully automatic rejection.", minLabel: "Advisory only", maxLabel: "Fully automated", ideal: 30, principle: "Human oversight",
        feedback: "High-impact decisions about people need a human in the loop with the power — and the time — to overrule the model." },
      { kind: "choice", prompt: "A rejected applicant asks why.", context: "The model is a gradient-boosted ensemble over 140 features.",
        options: [
          { label: "Say the decision was made by an algorithm", score: 15, principle: "Transparency", feedback: "'The algorithm decided' is not an explanation; it is an evasion of contestability." },
          { label: "Give the main contributing factors and an appeal route", score: 95, principle: "Explainability", feedback: "Meaningful, actionable reasons plus a human appeal path is the practical standard for automated decisions." }
        ] }
    ]
  },
  {
    id: "code-wars-ip", index: 4, title: "Code Wars & IP",
    tagline: "Ownership, licensing, plagiarism, reuse and attribution.",
    axis: "Intellectual Property", short: "IP", minutes: 3,
    intro: [
      "The deadline is Friday. A Stack Overflow answer, a GPL library and an AI assistant are all offering you the same shortcut.",
      "A licence is a contract you accept by copying. Reuse is fine — unlicensed reuse is not."
    ],
    scenarios: [
      { kind: "choice", prompt: "A perfect GPL-licensed module fits your closed-source product.", context: "Nobody outside the team would ever see the imports.",
        options: [
          { label: "Copy it in, remove the licence header", score: 0, principle: "Licence compliance", feedback: "Stripping headers is a copyright violation, not a shortcut. Licences bind you the moment you copy." },
          { label: "Find a permissively licensed equivalent, or isolate it properly", score: 95, principle: "Licence compatibility", feedback: "Choosing a compatible licence or a clean architectural boundary keeps the product shippable and lawful." },
          { label: "Ask legal and wait, blocking the release", score: 60, principle: "Due diligence", feedback: "Consulting legal is right, but a professional brings options to that conversation instead of only a blocker." }
        ] },
      { kind: "slider", prompt: "How much AI-generated code do you accept without review?", context: "Your assistant just produced 300 lines that pass the tests.", minLabel: "None — review every line", maxLabel: "All of it — tests pass", ideal: 15, principle: "AI responsibility",
        feedback: "Generated code can reproduce licensed snippets and subtle defects. You sign your name to it either way, so review it." },
      { kind: "choice", prompt: "A teammate ships a coursework project's code as their own portfolio work.", context: "It was a group project. Three other people wrote most of it.",
        options: [
          { label: "Say nothing — not your problem", score: 20, principle: "Professional integrity", feedback: "Silence normalises misattribution. Credit is the currency of engineering work." },
          { label: "Raise it privately and ask for proper attribution", score: 95, principle: "Attribution", feedback: "A direct, private correction gives the person a path to fix it and protects the contributors." }
        ] }
    ]
  }
];