# Module 05 — Gemini in Classroom & Building Gems

**Time:** 90 minutes
**Prerequisite:** Modules 01–04
**Artifact produced:** A working custom Gem

---

## Why this module exists

Two things converge here.

**Gemini in Classroom** is free across all Workspace for Education editions and carries
30+ teacher capabilities — so it is available to SPPS regardless of how the licensing
questions resolve, which makes it the safest high-value module in the series.

**Gems** are custom, reusable AI assistants that can be loaded with a teacher's actual
unit plans, pacing guides, rubrics, and anchor texts. They are the **highest-leverage
and least-taught feature in the entire Google education stack.** Almost no intro course
covers them. This is where a teacher stops re-explaining their context every single time
and starts having an assistant that already knows their course.

Everything from Modules 02–04 comes together here: the prompt library becomes a Gem's
instructions, and the notebook materials become its knowledge.

## Objectives

By the end, participants can:

1. Use Gemini in Classroom for planning, differentiation, and feedback
2. Explain exactly what the AI-suggested feedback feature does and where the teacher's
   judgment must stay
3. **Build a Gem** loaded with their real curriculum materials
4. State the age and language limits and their equity implications

## What you need enabled ⚠️

- **Gemini in Classroom:** free on all Education editions — but **English-only** and
  **requires users 18+** in domain settings. Staff-facing.
- **Gems:** confirm availability on the SPPS edition before promising the second half.
  If Gems are unavailable, the fallback is a "context block" — a saved prompt preamble in
  the participant's Doc library that they paste each session. Clunkier, same concept,
  and it preserves the learning objective.

---

## Facilitator script

### 1. Gemini in Classroom tour (20 min)

From the Classroom sidebar, tools built for teacher tasks: lesson plans, quizzes,
rubrics, vocabulary lists, reading comprehension questions, and differentiated
assignments — generated with awareness of actual class context.

Demo, in a real course:

- Generate a **rubric** for an existing assignment
- Generate **comprehension questions** for an assigned text
- Generate a **differentiated version** of a real assignment at three levels

The advantage over the standalone Gemini app: it already has course context, so less
has to be typed as Context each time.

### 2. AI-suggested feedback — handle carefully (20 min)

When adding a private comment on an assignment, "Help me write" prompts Gemini to draft
feedback tailored to the student's work, grade level, and a teacher-selected focus area.

This is the most *time-saving* and most *ethically loaded* feature in the module. Teach
both halves together.

**Demo it** on a sample piece of work (never a real identifiable student's, in a training
session).

**Then run the discussion, and give it real time.** Ask the room directly:

> A student gets feedback on their essay. It is warm, specific, well-structured — and
> the teacher did not write it. Is that okay?

Let the room actually disagree. There are honest positions on both sides and a
facilitator who forecloses this loses credibility for the rest of the series.

Then offer the framing that has held up in practice:

> **Feedback is a relationship, not a text output.** The draft can carry the structure —
> what the rubric says, what the mechanical issues are, what the next step is. The parts
> that say *I know you, I saw what you tried, here is what I want for you* have to be
> yours. A student can tell the difference, and being unable to tell is worse.

Practical rule: **use it for the scaffolding, write the relationship yourself.** And
never send AI-drafted feedback unread — the fluency of the draft is exactly what makes
an inaccuracy about a specific child hard to catch.

### 3. Building a Gem (30 min)

The centerpiece. A Gem is a saved, reusable assistant with persistent instructions and
uploaded knowledge — so the teacher's context lives in the tool instead of being retyped.

**Build one live, from a participant's real course.** Structure:

```
GEM NAME: 9th Grade English — Unit 3 Assistant

INSTRUCTIONS:
  You are an experienced 9th-grade English teacher's assistant.
  You help me plan, differentiate, and assess for Unit 3.
  My class: 28 students, 9 receiving ELL support, reading levels
    roughly grades 6-11. iPads 1:1.
  Always align to the standards in the uploaded standards document.
  Offer three tiers of difficulty unless I say otherwise.
  Use plain language. Never invent a standard code — if you are unsure,
    say so and cite the source document.
  Never use a student's name; refer to "Student A," "Student B."

KNOWLEDGE (uploaded):
  - Unit 3 pacing guide
  - Course standards document
  - My rubric template
  - Anchor texts
```

Make the payoff explicit: **everything above the line no longer has to be typed.** The
Context section from Module 02 — the part participants found most tedious — is now
permanent. This is the moment the series' earlier work pays off, so name it.

Note the useful anti-hallucination instruction: *never invent a standard code.* Building
verification behavior into the Gem's instructions is a genuinely advanced move and
participants can do it on day one.

### 4. Build (20 min)

---

## Hands-on block

Each participant builds **one Gem for a course or role they hold**, tests it with three
real requests, and refines the instructions based on what came back wrong.

**The refinement loop is the actual skill.** First-draft Gems are always too vague.
Teach the diagnostic: when a Gem's output is wrong, ask *"what did it not know, or what
did I not tell it to do?"* — then add that line to the instructions. Two rounds of this
in-session is the difference between a Gem that gets used and one that gets abandoned.

Non-teaching equivalents:
- **Administrator:** a Gem loaded with district policy documents and communication norms
- **Counselor:** a Gem for drafting resource guidance, loaded with program documentation
- **Coach / specialist:** a Gem loaded with the instructional framework used in coaching

## The artifact — a working Gem

Participants leave with a Gem in their account and a written record:

```
GEM: [name]                    FOR: [course / role]
INSTRUCTIONS: [pasted]
KNOWLEDGE UPLOADED: [list — all de-identified]
TESTED WITH: 1. ___ 2. ___ 3. ___
REFINEMENTS MADE: ______
REVIEW STEP BEFORE ANYTHING REACHES A STUDENT: ______
```

## Pitfalls

**The age and language limits — do not soften these.** Gemini in Classroom is 18+ and
English-only. In a district serving substantial Hmong, Spanish, Somali, and Karen
speaking communities, an English-only tool has an obvious equity problem: it accelerates
work for staff serving English-dominant families faster than for staff serving everyone
else.

Say it plainly rather than letting participants discover it. Then be useful about it:
NotebookLM and the standalone Gemini app have broader language capability, so
family-facing multilingual work routes through those. And translated output for families
**must be reviewed by a fluent human** before it is sent — machine translation of
sensitive school communication fails in ways monolingual staff cannot detect.

**Student data in Gem knowledge.** Same rule as Module 04, higher stakes because Gem
knowledge is *persistent* — an IEP uploaded to a Gem stays there. State it, and check
uploads during the hands-on block.

**Vague Gems.** "You are a helpful teaching assistant" is useless. The value is entirely
in specificity. Push participants to write instructions only *they* could have written.

**Set-and-forget.** A Gem built for Unit 3 is wrong for Unit 7. Teach the maintenance
habit: revisit at each unit boundary.

**Over-automation of feedback.** Watch for the participant who wants to run their whole
grading queue through suggested feedback. Return to §2.

## Check for understanding

1. What does a Gem let you stop doing every time you sit down to plan?
2. Your Gem produces a lesson citing a standard code that does not exist. What went
   wrong, and what line do you add to prevent it?
3. A colleague wants to use Gemini in Classroom with 8th graders. What do you tell them?

*Expected: (3) it requires users 18+ in domain settings — it is a teacher tool, not a
student tool. Route student-facing work through Module 07's approaches.*

## iPad notes

- Confirm the Classroom sidebar's Gemini entry point on the **iPad Classroom app** — it
  differs from web, and may be under an overflow menu. Screenshot it fresh each cycle.
- Gem creation with file uploads is substantially easier on a MacBook. **Recommend staff
  build Gems on a laptop and use them on iPad.** This is a genuinely useful piece of
  practical advice that no Google documentation gives, precisely because Google does not
  assume this device profile.
- If a teacher will have students interact with anything built here, they must test on a
  student iPad. Staff MacBook ≠ student iPad.
