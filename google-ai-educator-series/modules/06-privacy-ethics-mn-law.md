# Module 06 — Privacy, Ethics & Minnesota Law

**Time:** 75 minutes
**Prerequisite:** Modules 01–05
**Artifact produced:** Team data-handling decision rule

---

## Why this module exists

Every prior module has deferred a question to this one. Now it gets answered properly.

This is the module that national AI training does not have. Most of it covers FERPA and
stops. **Minnesota educational data is governed by Minn. Stat. § 13.32 under the
Minnesota Government Data Practices Act**, a broader and stricter regime than FERPA
alone. Staff who have only had national training have an incomplete picture of their
actual obligations.

It is placed sixth rather than first deliberately. Leading with law produces compliance
theater — people nod, retain nothing, and stay afraid. Placed here, participants have
five modules of real practice and genuine questions, and the rules attach to things they
actually do.

## Objectives

By the end, participants can:

1. Explain what the SPPS managed account does and does not protect
2. Identify educational data under Minnesota law before putting anything in a prompt
3. Apply a de-identification rule automatically
4. Locate SPPS's own AI guidance and know who to ask
5. Reason about the ethical questions the law does not settle

## What you need enabled ⚠️

**This module requires district input to deliver responsibly.** Before delivery:

- Obtain SPPS's current AI guidance for staff and students
- Identify the district AI guidance group — SPPS states that administrators and
  district-level staff meet regularly on responsible AI use
- Confirm the district's approved-tools list
- Ideally, **have a district representative co-present or attend this session**

**Say this clearly to participants: this module is professional learning, not legal
advice.** District policy governs. Where this module and SPPS guidance differ, SPPS
guidance wins. A facilitator who blurs that line creates liability for the district and
for themselves.

---

## Facilitator script

### 1. Return to the account boundary (10 min)

Recall Module 01, now with five modules of practice behind it.

On the **SPPS managed account**, with enterprise-grade data protection:
- Data is **not reviewed by humans** and **not used to train AI models**
- Supports **FERPA, COPPA, GDPR** compliance
- SOC 1/2/3, ISO 9001, ISO/IEC 27001/27701/27017/27018/42001, **FedRAMP High**
- The district owns its data — not sold, not used for ad targeting
- Admin-configurable retention; usage visible in the Admin console

On a **personal account**: none of the above.

> **The protection is a property of the account, not the product.**

### 2. Minnesota law — the part nobody taught them (20 min)

**Minn. Stat. § 13.32 — Educational Data**, under the MGDPA.

Teach these as the working points, not as statute recitation:

**The definition is broad.** Educational data is data on individuals maintained by an
educational agency that relates to a student. It is not only grades and test scores —
it includes disciplinary records, health information, attendance, communications about a
student, and staff observations. Much of what a teacher would type into a prompt as
"context" is educational data.

**Minnesota's regime is broader than FERPA.** Data practices obligations attach to
government data generally, with defined classifications and defined rights of access.
Staff cannot assume that FERPA-shaped training from a national vendor covers Minnesota's
requirements.

**MDE's posture.** The Minnesota Department of Education publishes AI in Education
guidance with guiding principles, opportunities and challenges, and considerations for
districts writing their own policy. MDE explicitly directs districts to **begin from
existing policy** and involve all invested groups, and names data privacy, security, and
content appropriateness as primary considerations. There is no single state mandate that
resolves this for staff — **which is exactly why district guidance and this module
matter.**

**The practical translation** — the sentence to repeat until it is automatic:

> **Describe the class, not the child.**

Nearly everything a teacher wants from AI can be obtained by describing the
*instructional situation* rather than the *identified student.*

### 3. The de-identification drill (20 min)

The core skill. Work through real rewrites as a group — this must be practiced, not
explained.

| Instead of | Write |
|---|---|
| "Marcus is reading at a 4th grade level and has ADHD..." | "A 7th grader reading approximately three years below grade level, who benefits from chunked tasks and movement breaks..." |
| "Here is Jasmine's IEP, adapt this assignment" | "Here is the assignment. Adapt it for a student with these documented accommodations: [list the accommodations, not the document]" |
| "Summarize this parent complaint about Ms. Chen" | "Summarize this complaint" [names removed before pasting] |
| [pasting a gradebook export] | "In a class of 28, 9 scored below 70 on the unit assessment. Suggest reteaching approaches." |

**The three-question check, before anything goes in a prompt:**

1. Could a reader identify a specific student from this — including by inference in a
   small program or a small school?
2. Am I pasting a **document** when I could paste a **description**?
3. Am I in my SPPS account?

Note the inference problem explicitly. In a small special education program or a small
school, "the 7th grader who uses a wheelchair and is new this year" identifies a child
as surely as a name does. De-identification is about *identifiability*, not about
deleting names.

**Drill it.** Give participants five realistic scenarios drawn from their own roles and
have them rewrite each. This is the highest-value twenty minutes in the module — do not
shorten it for discussion.

### 4. Ethics the law does not settle (15 min)

Law sets the floor. These are live questions with no settled answer, and the room should
argue them rather than be told:

- **AI-drafted feedback.** Revisit Module 05. Where is the line between assistance and
  substitution?
- **Bias.** These models carry the biases of their training data. What happens when AI
  generates differentiated materials for a class, and the "lower tier" work is
  systematically less interesting? Who notices? Whose students get the worksheets?
- **The equity gap.** Gemini in Classroom is English-only. Staff serving English-dominant
  families get more benefit than staff serving multilingual families. That is an equity
  problem created by a tool adoption decision. What does the district owe here?
- **Disclosure.** Should families be told when AI helped draft a communication about
  their child? When feedback was AI-assisted? What would *you* want to know as a parent?
- **The efficiency trap.** If AI makes it possible to handle more students, more
  paperwork, more caseload — does it improve working conditions, or does it become the
  new baseline expectation? Staff have well-earned instincts here; let them be voiced.

The facilitator's job is to run an honest conversation, not to resolve these. Rooms that
argue these questions use the tools more thoughtfully afterward than rooms that get
answers handed to them.

### 5. Build the decision rule (10 min)

---

## The artifact — team data-handling decision rule

Built **as a team**, not individually. The output should be short enough to post beside
a desk.

```
OUR AI DATA RULE — [team / building / department]

BEFORE I PUT ANYTHING IN AN AI TOOL:
  1. Am I in my SPPS account?                        ☐
  2. Could anyone identify a specific student?       ☐
  3. Am I pasting a document I could describe?       ☐

WE NEVER PUT IN AN AI TOOL:
  - Student names          - IEP / 504 documents
  - Discipline records     - Health information
  - Gradebook exports      - Anything from a student's file

WE DE-IDENTIFY LIKE THIS:
  [team's own worked example]

BEFORE ANYTHING REACHES A STUDENT OR FAMILY:
  [team's named review step]

WHEN WE ARE UNSURE, WE ASK: ______________________
  (district AI guidance contact)

This rule is subordinate to SPPS district policy.
Reviewed: [date]        Next review: [date]
```

## Pitfalls

**Compliance theater.** If the module becomes a list of prohibitions, participants
disengage and quietly do what they were doing. The drill and the ethics discussion are
what make it stick — protect their time.

**Overcorrection.** Some participants will conclude they should not use AI at all. That
is not the goal and it is not the district's position. Counter directly: *"The managed
account and these rules exist so you can use these tools. Describe the class, not the
child, and almost everything you want to do is fine."*

**Facilitator overreach.** Do not give legal advice, do not interpret statute beyond the
practical points above, do not contradict district guidance. Route hard questions to the
district AI guidance group — and have that contact information in the room.

**Stale guidance.** District AI guidance is actively evolving; SPPS's group meets
regularly. Re-obtain current guidance before **every** delivery.

**The already-happened disclosure.** Someone may realize mid-session that they already
put student data in a personal AI account. Handle it as Module 01 did — no
interrogation. Tell the room generally that the right move is to talk to Technology
Services, that this is a common and understandable mistake, and move on. Do not create a
public incident.

## Check for understanding

Give five scenarios; participants decide **allowed / needs de-identification /
never**, and rewrite the middle category:

1. Pasting a full class gradebook export into Gemini to find trends
2. Asking for reteaching strategies for "a class of 28 where a third scored below 70"
3. Uploading a student's IEP to a Gem to generate accommodations
4. Asking Gemini to improve the tone of a family email that names the student
5. Using NotebookLM on your own unit materials to build a study guide

*Expected: 1 = never (identifiable export; describe the distribution instead).
2 = allowed. 3 = never (and persistent in Gem knowledge — describe the accommodations
instead). 4 = needs care — remove the name before pasting, and the substance about the
child must be the teacher's own words. 5 = allowed, provided sources contain no student
data.*

## iPad notes

- The wrong-account risk is highest on iPad, where personal and work accounts are
  routinely both signed in. The avatar check from Module 01 is a **data practices**
  control, not a convenience — frame it that way here.
- Photographing student work with an iPad and uploading it is a fast, natural, and
  **high-risk** workflow. Address it directly: a photo of student work carries the name
  in the corner, the handwriting, and often the whole classroom context. Crop, or do not
  upload.
