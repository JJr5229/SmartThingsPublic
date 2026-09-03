# Module 01 — Foundations & the SPPS Landscape

**Time:** 60 minutes
**Prerequisite:** Google *Generative AI for Educators with Gemini* or SPPS #90791
**Artifact produced:** Personal tool-boundary map

---

## Why this module exists

Participants arrive having completed a free intro course, which means they know what a
large language model is and have written a few prompts. What they almost certainly do
**not** know is which of the tools they have heard about they are actually permitted and
licensed to use at SPPS, on the device in their hand, with student information in the
prompt.

That confusion is the real barrier. Staff either avoid AI entirely out of vague fear, or
use whatever is convenient — often a personal ChatGPT or consumer Gemini account — with
student data in it. This module replaces vague fear with a specific map.

## Objectives

By the end, participants can:

1. Name which Google AI surfaces their SPPS account actually opens, and which it does not
2. State the difference between their **managed SPPS account** and a **personal account**
   in terms of data protection — and explain why it is the whole ballgame
3. Choose correctly between Gemini, NotebookLM, and Gemini in Classroom for a given task
4. Explain to a colleague why the district uses Google AI tools when SPPS also runs
   Microsoft 365

## What you need enabled ⚠️

Confirm before delivery:
- Workspace for Education edition and add-ons
- Which AI features are switched on in the Admin console
- Whether Gemini is enabled for under-18 accounts

If these are unknown, **do not deliver this module.** Its entire value is specificity;
delivered generically it becomes the free course participants already took.

---

## Facilitator script

### 1. The diagnostic (10 min)

Open cold, before any teaching. Ask each participant to write down, privately:

- Which AI tool did you last use for work? In which account?
- Did you put anything about a specific student in it?

Do not collect these or ask anyone to read them aloud — the point is private
recognition, and asking people to confess in a room kills the room. Then ask only for a
show of hands on the second question. In most rooms, hands go up.

Say plainly: *"Nobody is in trouble. Until today nobody drew you the map. That is what
this hour is."*

### 2. The account boundary (15 min)

This is the most important 15 minutes in the series. Everything in Module 06 builds on it.

**Draw two columns on the board.**

| Your SPPS managed account | A personal Google account |
|---|---|
| Data **not** reviewed by humans | No such commitment |
| Data **not** used to train models | May be used to improve the service |
| Supports FERPA / COPPA / GDPR compliance | No education compliance posture |
| SOC 1/2/3, ISO 27001/27701/27017/27018/42001, ISO 9001, FedRAMP High | None of it |
| District owns the data; not sold, no ad targeting | Consumer terms |
| Admin-set retention; usage visible in Admin console | No district visibility |

Then say the sentence the whole series turns on:

> **The protections attach to the account, not to the product.** The same Gemini, the
> same screen, the same prompt — signed in one way it is covered by an agreement the
> district negotiated, signed the other way it is a consumer product and you have just
> disclosed educational data to a third party.

Demonstrate live: show the account switcher, show how easy it is on an iPad to be in the
wrong account without noticing. **On iPad this is genuinely easy to get wrong** — the
account indicator is small, and personal and work accounts are often both signed in on a
staff member's device. Show the specific check: tap the profile avatar, confirm the
`@spps.org` address, every time.

### 3. The three surfaces (20 min)

Participants routinely conflate these. Separate them concretely.

**Gemini (the app / Workspace side panel)** — a general assistant. Best for open-ended
generation, drafting, brainstorming, rewriting, summarizing. It will answer from general
knowledge, which means it *can* be confidently wrong about your curriculum.

**NotebookLM (Gemini Notebook)** — a **source-grounded** research assistant. It answers
only from documents you upload. Best when accuracy against *your* materials matters:
your textbook chapter, your standards document, your syllabus. Dramatically lower
hallucination risk because it is not drawing on general knowledge. Covered in Module 04.

**Gemini in Classroom** — teacher tools embedded in Google Classroom: lesson plans,
quizzes, rubrics, vocabulary lists, comprehension questions, differentiated assignments,
AI-suggested feedback on student work. Free across all Education editions. **English-only
and 18+.** Covered in Module 05.

**The selection rule** — put this on a card participants keep:

> - Need it to be right about **my** materials? → **NotebookLM**
> - Working **inside a Classroom course** with my roster and assignments? → **Gemini in Classroom**
> - Anything else — drafting, thinking, rewriting? → **Gemini**

### 4. Why Google, when SPPS also runs Microsoft? (10 min)

Answer this honestly; participants will ask, and evasion costs credibility.

SPPS is genuinely dual-stack — Technology Services supports both Google Workspace and
Microsoft Office 365. The honest answer is not "Google is better." It is:

- Instruction at SPPS runs through Google Classroom and Google Workspace, so the AI
  that is *embedded where the work already happens* has lower friction
- The district's data protection agreements and admin controls are established here
- Gemini in Classroom is free across all editions, so there is no marginal license cost

And the honest caveat: **for tasks that live in Outlook, Teams, or Excel, Microsoft
Copilot may be the better tool** — if it is licensed and enabled. Tell participants to
check with Technology Services rather than assume. Credibility is worth more than
product loyalty, and staff will trust the rest of the series more because you said this.

### 5. Build the artifact (5 min)

---

## The artifact — personal tool-boundary map

A one-page card each participant completes and keeps:

```
MY SPPS AI MAP

Account I use for work:            ______________@spps.org
How I verify I'm in it:            tap avatar → confirm address

Tools I can open today:
  ☐ Gemini app          ☐ Gemini in Docs/Gmail/Slides
  ☐ NotebookLM          ☐ Gemini in Classroom
  ☐ Other: ____________

Tools I may NOT use for school work:
  ☐ Personal Gemini / ChatGPT / Copilot accounts
  ☐ Anything not on the district's approved list

For a task where accuracy about MY materials matters, I use: ____________
Before I type student information, I ask: ______________________ (Module 06)

My district AI contact: ______________________
```

## Pitfalls

**"I can't find that feature."** The most common failure, and it derails the room. It is
almost always a licensing or admin-toggle difference — see §What you need enabled. Have
the confirmed feature list in hand and be willing to say "that one is not turned on for
us." Never guess.

**Fear spiral.** Naming privacy risk this early can push a cautious room into "so I just
won't use it." Counter explicitly: *"The managed account exists precisely so you can use
these tools. The risk is the personal account, not the work you're here to do."*

**The confession trap.** Do not push anyone to say aloud what they put in ChatGPT. Hands
only. A room that feels investigated stops participating for all eight modules.

**Over-promising.** If you have not confirmed licensing, say so rather than demoing
something they cannot open. Participants forgive uncertainty; they do not forgive
being taught a feature that does not exist for them.

## Check for understanding

Each participant answers, in writing:

1. A colleague pastes a struggling student's writing sample into their personal Gemini
   account to get feedback ideas. Name two things that are wrong here and one thing
   that would make it acceptable.
2. You need a study guide that is accurate to *your* unit's textbook chapter. Which of
   the three surfaces, and why?

*Expected: (1) personal account voids the district's data protections and the content is
educational data on a specific student — moving to the managed SPPS account fixes the
first issue, de-identifying fixes the second, and Module 06 covers both formally.
(2) NotebookLM, because source grounding restricts answers to the uploaded chapter.*

## iPad notes

- The account switcher is the single highest-risk iPad difference. Drill the avatar-tap
  check until it is automatic.
- Google app UIs on iPad differ from the web UI; some side-panel entry points appear in
  a bottom bar or overflow menu instead of a right-hand rail. Demo on an actual iPad,
  mirrored — never demo this module from a laptop only.
- Staff MacBooks and student iPads have different paths for several tools. If the room
  is mixed, pair participants by device rather than trying to narrate two paths at once.
