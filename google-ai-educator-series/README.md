# Beginning Google AI — an educator series for Saint Paul Public Schools

A hands-on, eight-module professional learning series that takes SPPS staff from
"I finished the free Google course" to "AI is load-bearing in my weekly workflow, and I
can defend every use of it to a parent, a principal, and a data practices request."

Built as a companion to the *Beginning Claude* series, using the same structure:
short modules, one concrete skill each, an artifact built in every session, and no
module that ends without the participant having made something they keep.

---

## Read this first: the positioning problem

Research (`00-district-research-brief.md`) turned up something that changes the shape of
this product, and it is better to confront it up front than to discover it in a pitch
meeting.

**SPPS already teaches beginner Google AI, and Google gives it away free.**

- SPPS runs its own staff PD: *AI Tools: Gemini & Notebook LM* (PowerSchool #90819),
  *Generative AI for Educators* (#90791), *AI Tools: Canva Magic Studio* (#90820).
- Google offers a free ~2-hour *Generative AI for Educators with Gemini* course that
  issues a PD-creditable certificate, plus the Google Educator Series, plus a free
  training pledge to ~6 million U.S. educators through ISTE+ASCD.

A "here's what Gemini is and how to prompt it" course competes with two free incumbents
and loses. So this series **does not sell the intro — it requires it.**

### What this series sells instead

Four things neither the district's intro course nor Google's free training provides:

**1. iPad-first instruction.**
SPPS runs ~40,000 iPads 1:1 and 4,000+ MacBooks. It is not a Chromebook district.
Nearly all Google AI training assumes ChromeOS, desktop Chrome, right-clicks, and
extensions — instruction that is unfollowable on the devices SPPS staff and students
actually hold. Every module here is written and screenshotted for iPad and macOS first.
*This is the core differentiator.*

**2. Minnesota law, not just FERPA.**
National AI training covers FERPA and stops. Minnesota educational data is governed by
**Minn. Stat. § 13.32** under the MGDPA, which is broader and stricter. Module 06 is
built on Minnesota's actual regime and on MDE's AI guidance.

**3. Depth past the demo.**
The free courses stop at "write a prompt, look at the output." This series goes to
**Gems** (custom assistants loaded with a teacher's real pacing guide and rubrics),
grounded NotebookLM course libraries, and repeatable workflows. Gems are the
highest-leverage and least-taught feature in the entire Google education stack.

**4. Artifacts, not awareness.**
Every module ends with a built thing: a Gem, a notebook, a prompt library, a redesigned
assessment, a data-handling decision rule. Awareness evaporates by November. Artifacts
stay in the account.

---

## Before anything is promised: five questions for SPPS Technology Services

Answers reshape the series. Do not skip these. ⚠️

1. **Which Google Workspace for Education edition** does SPPS hold — Fundamentals,
   Standard, Teaching & Learning add-on, or Education Plus? Any Google AI Pro for
   Education add-on?
2. **Which AI features are actually enabled in the Admin console?** Licensed is not the
   same as switched on. This determines what can be taught at all.
3. **Who is the district AI guidance group?** SPPS states that administrators and
   district-level staff meet regularly on responsible AI use. They are the buyer or the
   gatekeeper — a pitch that routes around them fails.
4. **What do the three existing PD courses already cover?** Get the syllabi so this
   series starts where they end instead of repeating them.
5. **Is Gemini enabled for under-18 students,** and what is the district's position on
   the English-only limit in Gemini in Classroom?

Until #1 and #2 are answered, treat every feature claim in the modules as provisional.

---

## The series

| # | Module | Time | Artifact produced |
|---|---|---|---|
| 01 | [Foundations & the SPPS Landscape](modules/01-foundations.md) | 60 min | Personal tool-boundary map |
| 02 | [Prompting Essentials — the PTCF Framework](modules/02-prompting-essentials.md) | 75 min | 5-prompt starter library |
| 03 | [Gemini Across Workspace (iPad-first)](modules/03-gemini-in-workspace.md) | 90 min | Three automated weekly workflows |
| 04 | [NotebookLM as Your Grounded Curriculum Library](modules/04-notebooklm.md) | 90 min | A real course notebook + Audio Overview |
| 05 | [Gemini in Classroom & Building Gems](modules/05-classroom-and-gems.md) | 90 min | A working custom Gem |
| 06 | [Privacy, Ethics & Minnesota Law](modules/06-privacy-ethics-mn-law.md) | 75 min | Team data-handling decision rule |
| 07 | [Teaching Students With and About AI](modules/07-ai-literacy-students.md) | 90 min | A redesigned AI-resilient assessment |
| 08 | [Capstone — Role Tracks & Your Toolkit](modules/08-capstone-role-tracks.md) | 120 min | Published toolkit + peer demo |

**Total:** ~11.5 contact hours. Deliverable as eight weekly sessions, four half-days, or
two full days plus asynchronous work.

### Prerequisites (required, free, not taught here)

Participants complete before Module 01:
- Google's *Generative AI for Educators with Gemini* (~2 hrs, free, certificate), **or**
- SPPS *Generative AI for Educators* (PowerSchool #90791)

Module 01 opens with a diagnostic that assumes this baseline.

---

## Repository contents

```
google-ai-educator-series/
├── README.md                        ← you are here
├── 00-district-research-brief.md    ← what SPPS runs, with sources + open questions
├── modules/                         ← the eight modules
├── facilitation/
│   ├── pilot-plan.md                ← how to run the paid pilot
│   ├── prompt-library.md            ← the reusable PTCF prompt bank
│   └── assessment-and-badging.md    ← how completion is evidenced for PD credit
└── offer/
    └── district-one-pager.md        ← the leave-behind for SPPS
```

## How to use each module

Modules are written for a **facilitator**, not as a handout. Each contains:

- **Objectives** and time budget
- **What you need enabled** — the licensing/admin dependency, stated up front
- **Facilitator script** — the live demo, with what to say
- **Hands-on block** — what participants do with their own real material
- **The artifact** — what they leave with
- **Pitfalls** — where this session goes wrong, and the recovery
- **Check for understanding** — evidence of completion
- **iPad notes** — where the iPad path differs from the desktop path

## A standing caution on currency

Google ships education AI features continuously; several features cited here changed
during 2026 alone. **Re-verify feature availability before each delivery cycle.** Module
content has a shelf life measured in months, not years. `facilitation/pilot-plan.md`
includes a refresh checklist.
