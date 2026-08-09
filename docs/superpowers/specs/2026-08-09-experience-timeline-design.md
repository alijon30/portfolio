# Datatruck Experience — Design

**Date:** 2026-08-09
**Goal:** Represent the Datatruck role on the live homepage.

## Rejected approach: an Experience timeline

The first attempt added a résumé-style `<section id="experience">` to `Home.jsx` listing all
seven roles from `public/resume.pdf` plus Datatruck. It was built, then reverted.

It duplicated the section directly beneath it. "What I Built" already carries role and company
metadata per case study — `Engineering Lead · Stone Brothers International` on HuntME,
`Co-Founder & Lead Engineer` on SimplePrep. The timeline restated both companies immediately
above narratives covering them in far more depth, and with inconsistent titles ("Software
Engineer Lead" vs "Engineering Lead").

Lesson for future sections: check what the adjacent sections already say before adding a
component that summarizes the same facts.

## Decision

Two pieces, deliberately kept apart so neither restates the other.

**1. Datatruck as a case study.** The first "What I Built" entry, ahead of HuntME. No new
section markup — it reuses `work-item`, `work-header`, `work-title`, `work-meta`,
`work-summary`, `work-subheading`, `work-tech`.

**2. A fixed experience rail.** Chronology only, pinned to the left viewport gutter rather
than placed in the content column — an intermediate version that put it in a two-column grid
beside the case studies was built and reverted, because taking column width made it compete
with the narrative it was meant to complement.

Collapsed, the rail is a 2px track with one dot per employer. The track fills top-to-bottom in
proportion to page scroll, reusing the `scrollY / (scrollHeight - innerHeight)` calculation
already in `Layout.jsx`. Hovering or focusing expands it into a labelled timeline over a solid
`--bg-elevated` panel; only then do company, title, and dates appear.

Employers with `current: true` get an accent-filled dot. Consecutive roles at one employer
share a heading via the same adjacency `reduce` as before.

Consequences accepted:

- **The rail is hidden below 1440px.** `.portfolio` is `max-width: 1400px` with
  `clamp(16px, 4vw, 48px)` padding, so page content starts at x=48 until the viewport passes
  1400 and centering margins appear. The collapsed rail ends at x=58. Content only clears it
  above ~1420px. Below the breakpoint the rail is `display: none` rather than overlapping.
- **The Navbar's `#experience` link still goes nowhere useful.** The id now exists, but it is
  on a `position: fixed` element, so following the link scrolls nothing. Pre-existing breakage,
  not fixed here.
- The three roles with no case study (Radical X, USF Honors College, USF EnCoDe Lab) appear in
  the rail but have no narrative anywhere on the page.

`src/components/Experience.jsx` and `src/components/BentoGrid.jsx` remain dead code, untouched.

## Content

Three subsections, chosen because they are what the git history actually shows:

1. **Dispatcher Payroll & Settlements** — the dominant theme across `tms-mono-service` and
   `tms-web`. Settlement aggregation, one-time charges, YTD accrual, statement PDFs.
2. **A Multi-Agent System in Slack** — four Claude agents, from
   `alijonk-30/slack-agent-teams` (private; 314 commits, all the author's, Jul–Aug 2026).

   Initially written up as a single agent, which understated the work. Corrected against the
   repo README: **Atlas** investigates read-only, **Vulcan** drafts and shepherds PRs,
   **Mercury** handles release notes and customer-facing answers, **Falcon** runs personal ops
   and proposals.

   The page leads on the harness rather than the prompts, which is the repo's own framing:
   guarantees — no write tools, SELECT-gated SQL, hardcoded draft mode, human-click execution —
   are enforced in code the model cannot reach. That is the defensible engineering claim; a
   prompt asking an agent to behave is not.
3. **Client Onboarding & Migrations** — pipelines importing clients from legacy TMS platforms.

### Published metrics

From the "Mira → Atlas — Impact & Accuracy Review" artifact and local git history:

| Claim on the page | Source |
|---|---|
| 604 investigations | artifact |
| 91% verified accuracy, up from 55% | artifact |
| ~5 min median diagnosis | artifact |
| 57 tracked defects | artifact |
| 64% throughput increase | artifact |
| ~$100/month operating cost | artifact |
| 2,000+ driver documents migrated | `docs(paragon): mark driver migration complete (2,017 docs live)` |
| Atlas used by 40+ engineers; default for on-call | author, unverified |
| Mercury used by 20+ CS / PM / support staff | author, unverified |
| Investigation time cut from hours to minutes | author; consistent with the artifact's ~5 min median |

The adoption figures are the author's own account. Unlike the rows above them they were not
cross-checked against the artifact or git history, and no source in this repo can confirm them.

**600+ engineering hours saved** is derived, not measured: 604 investigations × one hour of
manual first-pass work each. The page states the assumption inline ("at even one hour saved per
investigation") so the arithmetic is visible rather than asserted. One hour is the floor — the
author describes the old process as taking "hours" — so the claim is deliberately beatable
rather than optimistic. If challenged, the defence is the multiplier, not the count: 604 is
documented in the artifact.

### Deliberately omitted

The source artifact is stamped **"Internal · Engineering Leadership"**. These were left off:

- Third-party vendor names appearing in the sample diagnoses
- Internal ticket identifiers (`DEV-563`, `CASH-326`, `DEV-530`)
- The internal Slack channel name
- The predecessor agent's name and its 36% wrong-answer rate
- Competitor TMS platforms clients were migrated off of
- Team size, total ticket counts, and monorepo commit volume

The two example bugs kept — a tariff paying $0/mile from a duplicate zero-value price row, and
a fuel sync duplicating transactions over `"Diesel"` vs `"Diésel"` — describe generic software
defects with no customer, vendor, or ticket identifier attached.

**Open risk:** publishing operating cost and internal quality metrics from a document marked
internal is the author's call, not a settled question. Flagged to the user.

## Resolved: Stone Brothers end date

`public/resume.pdf` lists Stone Brothers as "Sep 2025 – current" — written before the Datatruck
role existed. That wording was carried into the rail verbatim with `current: true`, which showed
two concurrent present-tense roles and gave Stone Brothers an accent dot alongside Datatruck.

Confirmed by the author on 2026-08-09: the role ended **Feb 2026**, when Datatruck began. The
entry now reads `Sep 2025 – Feb 2026`, and Datatruck is the only `current: true` role.

**The resume PDF still says "current" and now contradicts the site.** It is a binary asset, not
editable here — flagged for the author to regenerate.

## Verification

`npx vite build` succeeds. `Home.jsx` contains four `work-item` articles. No `xp-`,
`EXPERIENCE`, or `experience-timeline` references remain in `Home.jsx` or `index.css`.
