# Module 04 — NotebookLM as Your Grounded Curriculum Library

**Time:** 90 minutes
**Prerequisite:** Modules 01–02
**Artifact produced:** A real course notebook + an Audio Overview

---

## Why this module exists

Every prior module has carried a caveat: *Gemini can be confidently wrong about your
materials.* NotebookLM is the structural answer to that caveat, and it is the tool most
under-used by staff who have already had intro training.

**Source grounding** means NotebookLM answers only from documents you upload. Ask it for
a quiz on Chapter 5 and every question traces back to Chapter 5. That is a categorically
different reliability profile from a general assistant, and it is what makes AI output
safe to put in front of students.

If a participant takes only one module from this series into daily practice, this should
be the one.

## Objectives

By the end, participants can:

1. Explain source grounding and why it changes what AI output can be trusted for
2. Build a notebook from their own curriculum materials
3. Generate study guides, quizzes, discussion questions, and summaries traceable to
   their sources
4. Produce an **Audio Overview** and place it in a real instructional sequence
5. Apply the de-identification rule to source uploads

## What you need enabled ⚠️

NotebookLM (Gemini Notebook) is available to Workspace for Education, with **Education
Plus** granting higher limits, more sources per notebook, and access to the latest
models. Fundamentals-tier access may be more limited. Confirm source and notebook caps
before promising a full-course library.

---

## Facilitator script

### 1. The grounding demo (15 min)

Do not explain source grounding — **show it**, with the same question asked twice.

Ask **Gemini**: *"What are the key themes in the novel my 9th graders are reading?"*
It will answer plausibly and generically, possibly about the wrong edition, possibly
inventing detail.

Now upload the actual unit materials to **NotebookLM** and ask the same question. The
answer comes back grounded, with **citations pointing to the exact passages.**

Click a citation. Watch the room. That click — output that shows its work, in *their*
document — is the moment NotebookLM sells itself. Let the silence sit.

Then name the tradeoff honestly: **NotebookLM will not answer what is not in your
sources.** Ask it something outside the uploads and let it decline. That is the feature,
not a limitation — but participants must understand it or they will think the tool is
broken.

### 2. Building a notebook (20 min)

Demo building a real unit notebook. Sources can include:

- Textbook chapters and readings (PDFs)
- Your own slides, lesson plans, and pacing guides
- Standards documents
- YouTube videos and articles
- Google Docs and Slides from Drive

**The teaching point:** a notebook that combines a textbook chapter, the relevant
standards, and a supporting video becomes a single queryable knowledge base that
*understands your unit as you actually teach it.* Nothing else in the stack does this.

**Then teach the discipline that makes it work: one notebook per unit or course, not one
per question.** The value compounds across a semester. A notebook built in September and
fed all year is worth vastly more in May than a dozen throwaway notebooks. Say this
early; it changes how participants build from the first day.

### 3. What to generate (20 min)

Work through, with participants doing each on their own materials:

- **Study guides** aligned to what was actually taught
- **Quizzes and assessments** where every item traces to a source
- **Discussion questions** at varying depth
- **Glossaries** of unit vocabulary
- **Differentiated versions** of a reading or handout
- **Rubrics** grounded in your stated objectives
- **Family-facing summaries** — what this unit covers, in plain language

### 4. Audio Overviews (20 min)

NotebookLM turns sources into podcast-style episodes with two AI hosts — available in
formats including **deep dive, brief, critique, and debate**. Related **Audio Lessons**
(introduced at BETT 2026) generate podcast-style lessons customizable by grade level,
topic, learning objectives, and conversation style.

Play one, generated live from a participant's materials. It reliably produces the
biggest reaction of the entire series.

Then move immediately from novelty to instructional purpose, or it stays a party trick:

- **The hook** — a 2-minute episode introducing a unit, to build curiosity before heavy
  reading
- **Accessibility** — an audio path through dense text for students who struggle with
  decoding, and for auditory learners
- **Absence recovery** — students who missed a class can listen to the material
- **Family engagement** — a short overview families can listen to on a commute
- **Review** — a "brief" format episode before an assessment
- **Debate format** for genuinely contested material, to model argument structure

**Caveat to state plainly:** the hosts are engaging but they are still generated. Listen
to it fully before assigning it. The conversational, confident delivery makes errors
*harder* to notice than they are in text — the format's charm is exactly what makes
review non-optional.

### 5. Build (15 min)

---

## Hands-on block

Each participant builds **one real notebook for a unit or course they teach this
semester**, uploading their genuine materials, then generates at least three artifacts
from it plus one Audio Overview.

For non-teaching staff, the equivalent is just as strong:

- **Administrators:** a policy notebook — handbooks, board policies, procedures — that
  answers "what is our actual policy on X?" with citations
- **Counselors:** a resource notebook of program documentation and referral pathways
- **Support staff:** a procedures notebook for recurring processes

The administrator use case is worth demoing even to a teacher room. A grounded,
citable policy notebook is one of the most persuasive things in the entire series when
it comes time to talk to a principal or a district leader about value.

## The artifact — a course notebook

```
NOTEBOOK: [unit / course name]
SOURCES UPLOADED: [list]
DE-IDENTIFIED? [confirmed — no student names or IEP details in any source]

GENERATED THIS SESSION:
  1. ______  2. ______  3. ______
AUDIO OVERVIEW: [format used] → [where it goes in my sequence]

WHAT I ADD NEXT: ______
```

## Pitfalls

**Uploading student data.** The most serious risk in this module, and it will happen if
you do not get ahead of it. Participants gathering "my real materials" reach for graded
student work, IEP documents, and rosters.

State the rule before the hands-on block, not after:

> **De-identify before you upload.** Adapt an assignment by uploading the *assignment
> and your accommodation notes* — not the student's IEP, and not their name. Use
> "Student A." A useful check: NotebookLM will flag when something is *not found in
> sources*, which lets you work from documented supports without ever naming a child.

Circulate during the hands-on block and check what is actually being uploaded.
Module 06 formalizes this; here you enforce it.

**Notebook sprawl.** One notebook per question destroys the compounding value. Teach
one-per-unit from the start.

**Audio Overview as toy.** If the session ends at "that's amazing," nothing changes on
Monday. Force the placement question: *where in your sequence does this go, and what
week?*

**Over-trusting grounding.** Grounding reduces hallucination; it does not eliminate
error. NotebookLM can still misread, over-generalize, or draw the wrong emphasis from a
source. Review remains required.

**Garbage in.** A notebook built on a bad scan of a worksheet produces bad output.
Source quality is output quality — check PDFs are actually text, not images.

## Check for understanding

1. Why is NotebookLM more trustworthy than Gemini for generating a quiz on your unit —
   and what does it still get wrong?
2. You want to adapt an assignment for a student with documented accommodations. What
   do you upload, and what do you never upload?

## iPad notes

- Uploading from an iPad means the **Files app** and the **iOS share sheet** rather than
  a desktop file picker. Walk this slowly — it is where iPad participants get stuck, and
  it is entirely absent from Google's own documentation.
- Getting a PDF from email or Drive into a notebook on iPad is a multi-step share-sheet
  operation. **Demo it end to end.** Do not assume it is obvious; it is not.
- Audio Overviews play well on iPad and are genuinely good on student devices — a real
  advantage of the SPPS device profile, worth naming.
- Scanning a paper handout with the **iPad camera** into a PDF, then into a notebook, is
  a strong workflow for staff whose materials are not yet digital. Teach it; it converts
  the "all my stuff is on paper" objection into a five-minute task.
