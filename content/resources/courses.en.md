> [繁體中文](./courses.md) | [简体中文](./courses.zh-Hans.md) | **English**

# Online AI Agent Courses (Certificate Comparison)

> [← Back to main path README](../README.en.md)

> 📌 **This is a reference catalog, not a ranking.** This repo is a hands-on learning roadmap and **does not replace** structured online courses — the courses below are parallel video / interactive on-ramps. Want to build → back to [stages](../README.en.md); want to look up a term → [`resources/glossary.en.md`](glossary.en.md). This page lists **only courses that grant a certificate**.

> ⚠️ **Read this first.** A Certificate of Completion proves **you participated in and finished the course** — not mastery, and **not** an accredited credential or academic credit. Employers usually weigh things in this order: "is the content relevant to the role > how rigorous is the assessment > what did you actually build > who issued it" — the certificate itself ranks near the bottom. Treat it as **evidence of self-directed learning + a structure to stay motivated**, not as "a certificate gets you hired." The "Certificate" column below states facts only, no value judgment.

---

## ⚡ Quick pick (choose one in 30 seconds)

- **No idea where to start** → do [Hugging Face — AI Agents Course](https://huggingface.co/learn/agents-course) first: 🆓 free, framework-neutral, and the certificate is gated behind a quiz + assignments. The recommended starting point on this page.
- **Want a certificate for free** → Hugging Face, [Weights & Biases — AI Engineering: Agents](https://wandb.ai/site/courses/agents/), [Anthropic Academy](https://anthropic.skilljar.com/) (Claude / MCP focus).
- **Want university / big-vendor backing for your resume (paid)** → [IBM — RAG and Agentic AI (Professional Certificate)](https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai), [Vanderbilt — AI Agent Developer](https://www.coursera.org/specializations/ai-agents).
- **Want to go end-to-end on one framework (LangChain / LangGraph)** → [Coursera — Agentic AI Engineering (Edureka)](https://www.coursera.org/specializations/agentic-ai-engineering).
- **Want a Chinese-language course** → [NVIDIA DLI (Chinese)](https://www.nvidia.cn/training/instructor-led-workshops/building-agentic-ai-applications-with-llms/) (best fit), Alibaba Cloud ACA, Huawei HCIA-AI.
  > ⚠️ **Chinese-language, certificate-granting, agent-specific courses are currently all paid** (NVIDIA DLI / Alibaba / Huawei). To get a certificate **for free**, you currently take the English courses above (some have community subtitles).

**Legend**: 🆓 free (certificate included) · 💰 paid · 🆓→💰 free to audit, paid certificate.

---

## How to read this list

- **Learning value** (credible instructor + hands-on + recent content) and **certificate value** are two different axes. This list is ordered mainly by learning value; the certificate is a heavily-annotated secondary signal.
- ⭐ ratings follow [style-guide §2](style-guide.en.md#2-recommendation-star-definitions): ⭐⭐⭐⭐⭐ must-do … ⭐ niche.
- **A paid Professional Certificate / Specialization (IBM, universities) usually carries more recognition than a free completion certificate** — but neither is a degree, and the "X% career outcomes" figure on Coursera is marketing.
- **The agent field moves fast**: discount the recency of any course older than 12–18 months against current framework versions (smolagents / LangGraph / MCP).

---

## 🌍 English courses

### tier-1 (highly credible + hands-on + recent)

| Course (link) | Cost | Who it's for | What it teaches | Certificate |
|---|---|---|---|---|
| [Hugging Face — AI Agents Course](https://huggingface.co/learn/agents-course) ⭐⭐⭐⭐⭐ | 🆓 | Anyone wanting free, framework-neutral hands-on material | Hands-on with smolagents / LangGraph / LlamaIndex + observability / eval; build and benchmark an agent | Free, two levels: Fundamentals (Unit 1 + quiz ≥80%); Certificate of Completion (plus assignments + a final challenge). Issued directly by Hugging Face |
| [DeepLearning.AI — Agentic AI](https://www.deeplearning.ai/courses/agentic-ai/) ⭐⭐⭐⭐⭐ | 🆓→💰 | Developers with intermediate Python + basic LLM/API concepts | Four core design patterns: reflection, tool use, planning, multi-agent (31 videos + 8 graded assignments) | Free to audit (no certificate); certificate requires paid Pro (~$25–30/mo) plus passing assessments. Instructor: Andrew Ng. Chinese companion: [`datawhalechina/agentic-ai`](https://github.com/datawhalechina/agentic-ai) |
| [Weights & Biases — AI Engineering: Agents](https://wandb.ai/site/courses/agents/) ⭐⭐⭐⭐ | 🆓 | Developers who want agents that are "evaluated and shippable" | Built with the OpenAI team; reasoning models → agents, tool/memory/planning architecture, orchestrator-worker multi-agent, reproducible eval on accuracy/latency/cost (~2 hours) | Free Certificate of Completion (issued by W&B AI Academy) |
| [IBM — RAG and Agentic AI (Professional Certificate)](https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai) ⭐⭐⭐⭐ | 💰 | People who want a big-vendor Professional Certificate | RAG + agentic AI, hands-on, across a multi-course Professional Certificate | Paid (Coursera Plus; financial aid available). Issued by IBM — more recognized than a generic completion certificate |
| [Vanderbilt University — AI Agent Developer](https://www.coursera.org/specializations/ai-agents) ⭐⭐⭐⭐ | 💰 | People who want university backing and a systematic path | Designing, building and refining agent software; Python agentic apps | Paid (Coursera Plus; financial aid available). Vanderbilt University Specialization Certificate |

### tier-2 (solid, with a specific caveat)

| Course (link) | Cost | Who it's for | What it teaches | Certificate |
|---|---|---|---|---|
| [Coursera — Agentic AI Engineering (Edureka)](https://www.coursera.org/specializations/agentic-ai-engineering) ⭐⭐⭐ | 💰 | People who want to go end-to-end on LangChain / LangGraph / MCP | 4 courses: LangChain ecosystem, LCEL, ReAct/memory, LangGraph multi-agent, MCP deployment, eval | Paid Specialization Certificate. Caveat: Edureka is a commercial training provider (not a university/lab), so credibility is moderate; for stronger backing in the same space pick IBM / Vanderbilt above |
| [Anthropic Academy](https://anthropic.skilljar.com/) ⭐⭐⭐⭐ | 🆓 | People building agents on the Claude / MCP stack | Claude Code, Claude API, MCP, Agent Skills; 17 self-paced courses across 5 tracks | Free official certificate (issued via Skilljar, includes a quiz, email sign-up, LinkedIn-shareable). Caveat: vendor-specific (Claude/MCP) — a supplement to, not a replacement for, a framework-neutral foundation course |

> Worth knowing but not listed as a main entry: [LangChain Academy — Intro to LangGraph](https://academy.langchain.com/courses/intro-to-langgraph) (🆓 free LangGraph completion certificate, single-vendor). Cloud vendors (Google Cloud / AWS) mostly issue skill badges for their agentic paths — these are not the same thing as their paid **professional certification exams**; don't conflate the two.

---

## 🀄 Chinese-language courses

> **Gap-first fact**: certificate-granting, agent-specific courses **in Chinese are currently all paid**, and most are **big-vendor certifications** (tied to their own stack); a **zh-TW-native + certificate + agent-specific** course barely exists. To get a certificate for free, Chinese-speaking learners currently still take the English courses above (Hugging Face / W&B / Anthropic are all free). Of the three below, the NVIDIA DLI Chinese course is the best fit.

### tier-1 (highly credible)

| Course (link) | Cost | Who it's for | What it teaches | Certificate |
|---|---|---|---|---|
| [NVIDIA DLI — Building Agentic AI with LLMs (Chinese)](https://www.nvidia.cn/training/instructor-led-workshops/building-agentic-ai-applications-with-llms/) ⭐⭐⭐⭐ | 💰 | People who want to build agent systems hands-on, in Chinese | Building agentic systems with LLMs: deep reasoning, retrieval, tool calling, multi-agent, LangGraph, deployment considerations (8 hours) | Paid (~¥3,500/person, instructor-led, scheduled), includes 6 months of cloud labs. NVIDIA DLI certificate after passing the test. Caveat: relatively expensive and requires scheduling |

### tier-2 (solid, with a specific caveat)

| Course (link) | Cost | Who it's for | What it teaches | Certificate |
|---|---|---|---|---|
| [Alibaba Cloud — LLM ACA Certification + Bailian Agent Clouder](https://edu.aliyun.com/certification) ⭐⭐⭐ | 💰 | People building agents on the Alibaba Cloud (Bailian/Tongyi) stack who want in-ecosystem recognition | LLM engineering; the Clouder series includes a "building agent apps on the Bailian platform" module | Paid official certification (real-name required). Caveat: recognition is vendor-scoped (tied to Bailian/Tongyi), not academically transferable; zh-Hans only |
| [Huawei — HCIA-AI (LLM applications track)](https://e.huawei.com/cn/talent/cert/) ⭐⭐⭐ | 💰 | People who want Huawei-ecosystem recognition and a systematic intro | The 2026 V1.0 syllabus covers AI fundamentals, LLM knowledge, LLM applications, and compute-center solutions | Paid official certification (exam-based). Caveat: recognition skews toward the Huawei ecosystem and the mainland China job market; zh-Hans. HCIP/HCIE are deeper extensions |

> Other Chinese options kept as notes, not main entries: imooc.com "AI Agent Full-Stack Engineer" (a commercial bootcamp — judge by syllabus; limited external recognition); the Ministry of Education "AI course completion certificate" (an official e-certificate, but broad AI literacy rather than agent engineering). **Excluded**: cert-mills (generic AIGC certs with no assessment and no credible issuer).

---

## ⚠️ About "getting a certificate" — the full caveat (please relay this faithfully to readers)

1. **A completion certificate is not an accredited credential.** It reflects participation and effort, not mastery; it is not the same as credit-bearing coursework or a degree. This list **never** presents these certificates as qualifications.
2. **Paid ≠ automatically recognized, free ≠ automatically lightweight.** Big-vendor / university paid Professional Certificates (IBM, Vanderbilt) usually carry more recognition; but free courses can be rigorously assessed too (Hugging Face's certificate is gated behind a quiz + assignments + a challenge). What matters is the issuer and the assessment, not the price.
3. **These certificates demonstrate exposure and effort, not competence.** The honest framing is "evidence of self-directed learning," not "proof you can build a shippable agent."
4. **A certificate is most useful for screening, and rarely works alone.** One from a credible source can help you pass an initial filter, but it almost never guarantees an offer — it only works alongside a portfolio.
5. **What you build matters more than what you collect.** Employers want evidence you can do the work (a GitHub repo, a deployed agent, open-source contributions). A course's real payoff is the artifact it forces you to build, not the PDF.
6. **Don't collect scattered badges — move along one coherent skill set.** Five unrelated intro certificates are far less convincing than one coherent path that demonstrates a single skill set — which is exactly why you should treat courses as "steps in a roadmap," not a trophy wall.
7. **Recency caveat.** Agent frameworks and best practices turn over fast, so an older cohort's certificate may represent stale knowledge. Check the course's vintage.

---

## Maintenance notes

- **Last verified: 2026-05.** Course details (especially certificate terms and free/paid status) drift quickly — treat each course's official page as the source of truth, and flag stale entries visibly rather than letting them silently go wrong.
- Bar for adding a new course: identifiable instructor/institution + a real assessment or a first-party-issued certificate + recent content. **No** cert-mills (marketplace-style completion certificates carry near-zero external recognition).
- Trilingual sync: every add/remove, star change, or certificate-terms change must be applied to `courses.md` + `courses.en.md` + `courses.zh-Hans.md`.
