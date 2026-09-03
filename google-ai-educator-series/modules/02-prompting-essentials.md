# Module 02 — Prompting Essentials: the PTCF Framework

**Time:** 75 minutes
**Prerequisite:** Module 01
**Artifact produced:** A personal 5-prompt starter library

---

## Why this module exists

Participants have written prompts before. What they have not done is write prompts that
are **reusable** — the intro course teaches you to get one good answer, not to build
something you use every Monday.

This module teaches Google's own four-part structure so that staff stay aligned with
every Google guide and course they read afterwards, then pushes past it into iteration
and reuse, which is where the actual time savings live.

## Objectives

By the end, participants can:

1. Structure a prompt using **Persona, Task, Context, Format (PTCF)**
2. Diagnose *why* a weak output was weak, and fix the prompt rather than retyping it
3. Iterate — treat the first output as a draft to steer, not a verdict
4. Write prompts that are reusable across a semester, not single-use

## What you need enabled

Gemini app access on the SPPS managed account. This module works on any edition that
opens Gemini at all, which makes it a safe one to deliver while licensing questions are
still outstanding.

---

## Facilitator script

### 1. The bad prompt (10 min)

Start with failure, live and unrehearsed. Type, on the screen:

> `write a lesson plan about fractions`

Read the output aloud. It will be plausible, generic, gradeless, standardless,
contextless — and useless. Ask the room what is missing. They will name most of PTCF
themselves, which is a much better way in than presenting the framework cold.

### 2. Teach PTCF (20 min)

Google's four-part structure from *Gemini for Google Workspace: Prompting Guide 101*:

| Part | The question it answers | Example |
|---|---|---|
| **Persona** | Who should Gemini be? | "You are a 6th-grade math teacher in an urban district" |
| **Task** | What exactly should it do? | "Write a 45-minute lesson plan introducing equivalent fractions" |
| **Context** | What does it need to know? | "28 students, 9 receive ELL support, ~1/3 are below grade level on fraction basics. We have iPads 1:1. This follows a unit on factors." |
| **Format** | What should the output look like? | "Give me: objective, materials, a 5-minute warm-up, three differentiated task tiers, and an exit ticket. Use a table for the tiers." |

Now rebuild the bad prompt live, adding one part at a time, showing the output improve
at each step. **Do not skip to the finished prompt** — watching the output change as
*Context* is added is what makes the framework stick.

Emphasize the two parts educators consistently skip:

- **Context is where teachers hold their advantage.** Gemini does not know your students.
  Everything you know about your room — reading levels, what they struggled with last
  week, what happened at the assembly — is context that no generic prompt has. This is
  also exactly where Module 06's privacy line lives: *"describe the class, not the
  child."* Say it here and repeat it in Module 06.
- **Format is where the time savings are.** An output shaped the way you actually need it
  is one you paste and use. An unshaped output is one you spend fifteen minutes
  reformatting, which erases the point.

### 3. Iteration (20 min)

The single largest behavior gap between novice and fluent users: novices retype, fluent
users **steer**.

Teach four follow-up moves, and have participants use each one at least once:

- **Narrow:** "Tier 3 is still too hard. Rewrite it for students reading two years below
  grade level."
- **Extend:** "Now write the exit ticket as four questions, one per tier plus a challenge."
- **Critique:** "What is weak about this lesson plan? What would an instructional coach
  flag?"
- **Reformat:** "Same content, as a one-page handout I can print."

The critique move is consistently the most surprising to participants and the most
useful. Demo it deliberately.

**Also teach the stopping rule:** if three iterations have not gotten you there, the
problem is usually the *Context*, not the phrasing. Go back and add what Gemini could
not have known, rather than rewording the same request a fourth time.

### 4. Verification — non-negotiable (10 min)

Gemini answers from general knowledge and **can be confidently wrong**, particularly
about:

- Specific standards language and numbering
- District policy and local procedure
- Facts about your curriculum, your school, your students
- Citations and sources — which it can fabricate entirely

State the rule flatly:

> **You are the professional. The output is a draft by a fast assistant who has never
> met your students and has no access to your curriculum unless you gave it to them.
> Nothing goes to students, families, or an administrator without your review.**

Then point forward: *"When being right about your own materials matters, there is a
better tool than checking Gemini by hand — that's Module 04."*

### 5. Build the library (15 min)

---

## Hands-on block

Participants write **five PTCF prompts for tasks they genuinely repeat.** Real ones,
from their actual job. Prompt them by role if the room stalls:

*Teachers:* a differentiated task set · a family email home · a rubric for a recurring
assignment type · comprehension questions for an assigned text · a sub plan

*Administrators / support staff:* a staff communication · a meeting agenda from notes ·
a summary of survey responses · a first draft of a family newsletter

Then **pair and test:** each participant runs a partner's prompt in their own account.
If it produces something useful for a person who did not write it, the Context is
explicit enough. If it doesn't, the prompt was leaning on knowledge that stayed in the
author's head. This peer test is the most valuable ten minutes of the module — do not
cut it for time.

## The artifact — 5-prompt starter library

A Google Doc in the participant's own Drive, each entry:

```
PROMPT: [name — e.g. "Weekly family update"]
WHEN I USE IT: [every Friday]

PERSONA: ...
TASK: ...
CONTEXT: ...
FORMAT: ...

MY USUAL FOLLOW-UP: ...
NEVER PUT IN THIS PROMPT: [student names, IEP details, ...]
```

That last line matters — it starts building the privacy habit two modules before the
privacy module formalizes it. These prompts become Gems in Module 05, so this artifact
is load-bearing for the rest of the series.

## Pitfalls

**PTCF as ritual.** Some participants start writing four labeled paragraphs for
"summarize this email." Say explicitly: PTCF is a **diagnostic for when output is bad**,
not a mandatory form. Short tasks take short prompts.

**Politeness bloat.** Educators write unusually courteous prompts. "Please could you
possibly help me" is harmless but crowds out Context. Redirect the effort.

**Accepting first output.** The most expensive habit in the room. If a participant takes
the first answer every time, they are getting a fraction of the value. Watch for it
during the hands-on block and intervene individually.

**Privacy drift during the hands-on block.** Participants working with real material will
reach for real student names. **Circulate and watch for this.** Catching it live, gently,
once, teaches more than Module 06 will.

## Check for understanding

Give the room this weak prompt and have them repair it with PTCF:

> `make a quiz about the water cycle`

*A strong repair specifies grade and course, question count and types, the standard or
unit it must align to, the reading level, accommodations needed, and the output format —
and says nothing that identifies an individual student.*

## iPad notes

- Long prompts are miserable to type on a glass keyboard. Teach **dictation** (the mic
  key) for the Context section — it is faster and gets richer context out of people than
  typing does.
- Teach participants to draft reusable prompts in a **Google Doc** and paste them, rather
  than retyping into the prompt box each time. On iPad this is the difference between a
  prompt library that gets used and one that doesn't.
- Split View (Docs beside Gemini) is worth ten minutes of instruction; most staff have
  never used it and it changes how workable this is on a tablet.
