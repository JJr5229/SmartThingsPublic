# District Research Brief — Saint Paul Public Schools (SPPS)

**Compiled:** September 2026
**Purpose:** Ground the *Beginning Google AI* series in what SPPS actually runs, already
teaches, and is legally bound by — so the curriculum fits the district instead of being
generic Google training.

> **Verification status.** `spps.org` and `services.google.com` are blocked by this
> environment's network egress proxy, so the SPPS pages below could not be opened
> directly. Every SPPS-specific finding here comes from search-engine summaries of those
> pages, not from reading them. **Treat this brief as a research lead, not as verified
> fact.** Before this series is pitched or delivered, confirm the starred (⚠️) items
> directly with SPPS Technology Services. Several of them determine whether entire
> modules are relevant.

---

## 1. What SPPS actually runs

### Devices — the single most important finding

SPPS is **not a Chromebook district.** Reporting on SPPS Technology Services describes
one of the largest and longest-running 1:1 iPad initiatives in the Midwest:

- **~40,000 iPads** for students and staff (1:1)
- **4,000+ MacBooks** for instructional staff

**Why this matters more than anything else in this brief:** essentially all free Google
AI training — Google's own courses, the Google Educator Series, most YouTube PD, most
consultant decks — is written for ChromeOS and desktop Chrome. It assumes a Chromebook,
a Chrome browser, a right-click, an extension, and a keyboard. On an iPad, a large share
of that instruction is wrong or unfollowable: different app surfaces, no Chrome
extensions, Safari/Chrome-on-iOS quirks, sharing via the iOS share sheet, and the
Google apps' mobile UI rather than the web UI.

**This is the commercial wedge for the entire series.** SPPS staff have been handed
Chromebook-shaped training for an iPad district. An iPad-first Google AI curriculum is
something Google's free course does not offer and a generic consultant will not build.

### Platforms

SPPS Technology Services describes supporting, among other things:

- **Google Workspace** ⚠️ *(edition unconfirmed — see §4, this is the critical unknown)*
- **Microsoft Office 365** — SPPS is a genuinely dual-stack district
- Internet/network infrastructure
- Instructional support for all devices, via field technicians, network technicians,
  and instructional support specialists
- **PowerSchool** — used for staff PD registration (course section numbers below)

The dual-stack reality (Google **and** Microsoft) matters: staff will reasonably ask
"why Gemini and not Copilot?" The series has to answer that honestly rather than pretend
Google is the only option. See Module 01.

---

## 2. What SPPS already teaches (the competitive landscape)

SPPS **already runs its own AI professional development.** Courses found in the staff
PD catalog, registered through PowerSchool:

| Course | PowerSchool Section |
|---|---|
| AI Tools: Gemini & Notebook LM | #90819 |
| Generative AI for Educators | #90791 |
| AI Tools: Canva Magic Studio | #90820 |

⚠️ Confirm these are still active for the current year, and get the syllabi.

**Read this honestly: it is both good news and a warning.**

- *Good news:* the district has already decided AI PD is worth paying staff time for.
  Nobody has to be sold on the category. There is a budget line and a delivery channel.
- *Warning:* a "beginning Google AI" course that covers what Gemini is, how to prompt it,
  and what NotebookLM does is **already being offered in-house, for free.** Google gives
  the same content away free (§3). Pitching an intro course means competing with two
  free incumbents, and losing.

The series is therefore designed to start where those courses stop. See "Positioning"
in the series `README.md`.

## 3. What Google gives away free

Anything in this list must **not** be the product — it is the prerequisite.

- **Generative AI for Educators with Gemini** — ~2-hour self-paced course, no cost,
  issues a certificate teachers can submit for PD credit. Covers Gemini, NotebookLM,
  writing and evaluating prompts, and responsible use.
- **Google Educator Series on Teaching with AI** — free.
- **Get Started with Google AI in K-12 Education** — free learning path.
- **Google + ISTE+ASCD partnership** — free Gemini training pledged to ~6 million U.S.
  educators.
- **Gemini in Classroom** — now free to *all* Workspace for Education editions, with
  30+ teacher capabilities.
- Free published guides: *Guide to AI in Education*, *Gemini for Google Workspace
  Prompting Guide 101*, AI literacy guides for teens.

## 4. Licensing — the unknown that reshapes the series ⚠️

**This is the highest-priority question to ask SPPS.** Google's education AI features
are gated by edition, and the answer changes what can even be taught:

| Edition | Gemini access |
|---|---|
| Education Fundamentals | Base tier; most limited Gemini features |
| Education Standard | — |
| Teaching & Learning add-on | Select Gemini in Workspace capabilities, users 18+ |
| Education Plus | Gemini in Docs, Sheets, Slides, Vids, Forms; higher Workspace Studio limits; higher limits, more sources, and latest models in Gemini Notebook (NotebookLM) |
| Google AI Pro for Education | Purchasable add-on to *any* edition; expanded premium models |

As of February 2026, generative AI capabilities in Workspace for Education became
available at no additional cost to educators and students 18+ on **Education Plus or the
Teaching & Learning add-on.**

**Ask SPPS:** which edition, which add-ons, and — separately — **which features are
actually switched on in the Admin console.** Licensed ≠ enabled. A district can hold
Education Plus and have half of it turned off by policy. Teaching a feature staff cannot
open is the fastest way to lose a room.

### Hard constraints to design around

- **Gemini in Classroom is English-only and requires users 18+** in domain settings.
  ⚠️ In a district as linguistically diverse as SPPS — Hmong, Spanish, Somali, Karen
  families — the English-only limit is a real equity issue and must be named, not
  glossed over. It also means **students cannot use Gemini in Classroom**; this is
  staff-facing.

## 5. Privacy, ethics, and the legal frame

### SPPS's own posture

- District administrators and district-level staff **meet regularly** to issue guidance
  on appropriate and responsible use of AI in instruction, school management, and
  systemwide operations. ⚠️ **Find this group.** They are the actual buyer, or the
  gatekeeper. A pitch that routes around them will fail.
- SPPS provides **CIPA-compliant digital citizenship lessons each fall**, covering
  online safety, privacy, and appropriate online behavior, with digital citizenship
  embedded in content-area lessons and PBIS restorative practices year-round.
  **The series should plug into this existing fall cycle rather than propose a parallel
  one.**
- SPPS points students and families to **Google's AI Literacy Guide for Teens** and to
  **Common Sense Media** resources for talking with children about AI.

### Minnesota law

- **Minn. Stat. § 13.32** — Educational Data, under the Minnesota Government Data
  Practices Act (MGDPA). Minnesota's data practices regime is **stricter and broader
  than FERPA alone**, and most national AI-in-education training ignores it completely.
  This is a second real differentiator.
- **Minnesota Department of Education** publishes AI in Education guidance: guiding
  principles, opportunities and challenges, and considerations for districts writing
  their own AI policy. MDE's stated posture is to *begin from existing policy* and
  involve all invested groups — it does not impose a single state mandate.
- MDE guidance names data privacy, security, and content appropriateness as primary
  considerations when adopting new technology.

### Google's contractual commitments (the answer to "is this safe?")

For Workspace for Education, with enterprise-grade data protection:

- Institutional data is **not reviewed by humans** and **not used to train AI models**
- Supports compliance with **FERPA, COPPA, GDPR**
- Certifications: SOC 1/2/3, ISO 9001, ISO/IEC 27001, 27701, 27017, 27018, 42001;
  **FedRAMP High** authorization
- Schools own their data; it is not sold or used for ad targeting
- Admins can set custom data retention rules and see usage in the Admin console

⚠️ **Critical teaching point:** these protections attach to the **managed SPPS account**.
The same staff member using consumer Gemini in a personal Google account gets **none of
them**. Module 06 is built around this single distinction, because it is where districts
actually get hurt.

## 6. Google's own frameworks worth teaching

- **PTCF — Persona, Task, Context, Format.** The four-part prompt structure from
  *Gemini for Google Workspace: Prompting Guide 101*. Google's official framework;
  teaching it means staff stay aligned with every Google doc they later read.
- **Gems** — custom, reusable AI assistants. A teacher can load unit plans, pacing
  guides, rubrics, or anchor texts so the Gem answers from their real curriculum.
  *This is the highest-leverage, least-taught feature in the stack.*
- **NotebookLM source grounding** — answers are restricted to uploaded sources, which
  sharply reduces hallucination and keeps output curriculum-aligned. **Audio Overviews**
  turn sources into podcast-style episodes (deep dive, brief, critique, debate formats).
- **Audio Lessons** (BETT 2026) — podcast-style lessons customizable by grade level,
  topic, objectives, and conversation style.
- **AI-suggested feedback in Classroom** — "Help me write" on private comments drafts
  feedback tailored to the student's work, grade level, and a teacher-chosen focus area.
- **LearnLM** — Google's learning-science-tuned model family, now infused into Gemini.

## 7. What this brief implies for the series

1. **Do not sell an intro course.** SPPS runs one; Google gives one away. Require them
   as prerequisites instead.
2. **Lead with iPad-first.** It is the gap nobody else fills, and it is unavoidable for
   SPPS.
3. **Lead with Minnesota law.** MGDPA § 13.32 is absent from national training.
4. **Confirm licensing before promising features.** ⚠️
5. **Route through the existing district AI guidance group** and the fall digital
   citizenship cycle.
6. **Teach artifacts, not awareness.** Staff should leave with built Gems, NotebookLM
   notebooks, and prompt libraries — things that survive the session.
7. **Be honest about the English-only limit** in a multilingual district.

---

## Sources

SPPS and district context:
- [Technology Services — Saint Paul Public Schools](https://www.spps.org/about/departments/technology-services)
- [Artificial Intelligence — Saint Paul Public Schools](https://www.spps.org/about/departments/technology-services/staff-resources/artificial-intelligence)

Minnesota:
- [Artificial Intelligence in Education — Minnesota Department of Education](https://education.mn.gov/MDE/dse/tech/AI/AIEd/)
- [School Technology — MDE](https://education.mn.gov/MDE/dse/tech/)
- [State Guidance on Generative AI in K-12 — Student Privacy Compass](https://studentprivacycompass.org/state-guidance-on-the-use-of-generative-ai-in-k-12-education/)

Google training and product:
- [Generative AI for Educators with Gemini](https://edu.exceedlms.com/student/path/1787126-generative-ai-for-educators-with-gemini)
- [Generative AI for Educators — Grow with Google](https://grow.google/ai-for-educators/)
- [Google Educator Series on Teaching with AI](https://edu.google.com/intl/ALL_us/learning-center/google-ai-educator-series/)
- [Get Started with Google AI in K12 Education](https://edu.exceedlms.com/student/path/1725537-get-started-with-google-ai-in-k12-education)
- [Generative AI Tool for Teachers & Students](https://edu.google.com/intl/ALL_us/ai-gemini-notebook/)
- [Quickstart Guide to Gemini and Gemini Notebook for Education](https://knowledge.workspace.google.com/admin/getting-started/editions/quickstart-guide-to-gemini-and-gemini-notebook-for-education)
- [Google launches AI literacy training for 6 million U.S. educators](https://blog.google/products-and-platforms/products/education/teacher-ai-literacy-training/)
- [Google's new Gemini and NotebookLM updates for education](https://blog.google/products-and-platforms/products/education/ai-tools-programs-educators/)
- [Transform teaching and learning with updates to Gemini and Google Classroom (BETT 2026)](https://blog.google/products-and-platforms/products/education/bett-2026-gemini-classroom-updates/)
- [Gemini in Google Classroom expanding to users of all ages](https://workspaceupdates.googleblog.com/2026/08/gemini-in-google-classroom-is-expanding-to-users-of-all-ages-with-contextualized-Gemini-starter-prompts-for-students.html)
- [AI-suggested feedback in Google Classroom](https://workspaceupdates.googleblog.com/2026/02/educators-now-get-help-drafting-personalized-guidance-on-written-assignments-with-AI.html)

Prompting and guides:
- [Gemini for Google Workspace: Prompting Guide 101 (PDF)](https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf)
- [Guide to AI in Education (PDF)](https://services.google.com/fh/files/misc/gfe_guide_to_ai_in_education.pdf)
- [Gemini for Education one-pager (PDF)](https://services.google.com/fh/files/misc/gemini_education_onepager.pdf)

Licensing:
- [Compare Editions — Google for Education](https://edu.google.com/intl/ALL_us/workspace-for-education/editions/compare-editions/)
- [Compare Education editions — Workspace Help](https://knowledge.workspace.google.com/admin/getting-started/editions/compare-education-editions)
- [Education Plus Edition](https://edu.google.com/intl/ALL_us/workspace-for-education/editions/education-plus/)
- [Select Gemini in Workspace capabilities for Education Plus and Teaching & Learning](https://workspaceupdates.googleblog.com/2026/02/gemini-in-workspace-education.html)
- [Compare Google AI expansion add-ons — Education](https://support.google.com/a/answer/14700766?hl=en&co=DASHER._Family%3DEducation)

Privacy:
- [Enterprise-grade data protection for Workspace for Education](https://blog.google/products-and-platforms/products/education/gemini-enterprise-grade-data-protection/)
- [Privacy & Security FAQs — Google for Education](https://edu.google.com/intl/ALL_us/our-values/privacy-security/frequently-asked-questions/)
- [Generative AI in Google Workspace Privacy Hub](https://knowledge.workspace.google.com/admin/generative-ai/generative-ai-in-google-workspace-privacy-hub)
- [Gemini Built for Education](https://edu.google.com/intl/ALL_us/gemini-built-for-education-higher-ed/)

AI literacy:
- [Navigating AI in Schools — Common Sense Education](https://www.commonsense.org/education/ai-in-schools)
- [AI Toolkit for School Districts — Common Sense Education](https://www.commonsense.org/education/AI-toolkit-for-school-districts)
- [Teachers' Essential Guide to AI Literacy](https://www.commonsense.org/education/articles/teachers-essential-guide-to-ai-literacy)
