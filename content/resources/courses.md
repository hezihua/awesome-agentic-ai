> **繁體中文** | [简体中文](./courses.zh-Hans.md) | [English](./courses.en.md)

# 線上 AI Agent 課程（帶證書對照）

> [← 回主路線 README](../README.md)

> 📌 **這份是 reference catalog，不是排名。** 本 repo 是動手做的學習路線，**不取代**結構化線上課程——下面這些課程可當作平行的影片／互動式入門對照。想動手做 → 回 [stages](../README.md)；想先查用語 → [`resources/glossary.md`](glossary.md)。本頁只收**會發證書**的課程。

> ⚠️ **先讀這段，再往下看。** 完成證書（Certificate of Completion）證明的是**你參與並完成了課程**，不是 mastery，也**不等於** accredited 學歷或學分。雇主看的順序通常是「內容跟職務相不相關 > 評量嚴不嚴 > 你做出什麼作品 > 機構背書」，證書本身排在後面。把它當成**自主學習的證據 + 維持動機的結構**，不是「拿了證書就能找到工作」。下面「證書」欄只陳述事實，不做價值判斷。

---

## ⚡ 快速選（30 秒挑一門）

- **完全沒方向** → 先做 [Hugging Face — AI Agents Course](https://huggingface.co/learn/agents-course)：🆓 免費、框架中立、證書要過 quiz + 作業才拿得到。本頁最推薦的起點。
- **想免費就拿證書** → Hugging Face、[Weights & Biases — AI Engineering: Agents](https://wandb.ai/site/courses/agents/)、[Anthropic Academy](https://anthropic.skilljar.com/)（Claude / MCP 方向）。
- **想要履歷用的大學／大廠背書（付費）** → [IBM — RAG and Agentic AI（Professional Certificate）](https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai)、[Vanderbilt — AI Agent Developer](https://www.coursera.org/specializations/ai-agents)。
- **想沿一個框架（LangChain / LangGraph）做到底** → [Coursera — Agentic AI Engineering（Edureka）](https://www.coursera.org/specializations/agentic-ai-engineering)。
- **想用中文** → [NVIDIA DLI 中文](https://www.nvidia.cn/training/instructor-led-workshops/building-agentic-ai-applications-with-llms/)（最貼題）、阿里雲 ACA、華為 HCIA-AI。
  > ⚠️ **中文、帶證書、又 agent 專門的課，目前基本都要付費**（NVIDIA DLI / 阿里 / 華為）。想**免費**拿證書，現階段得走上面的英文課（部分有社群字幕）。

**圖例**：🆓 免費（含證書）· 💰 付費 · 🆓→💰 旁聽免費、證書付費。

---

## 怎麼讀這份清單

- **學習價值**（講師可信 + 動手做 + 內容夠新）和**證書價值**是兩條不同的軸。本清單主要照學習價值排，證書當成大量加註的次要信號。
- ⭐ 星等照 [style-guide §2](style-guide.md#2-推薦星等定義)：⭐⭐⭐⭐⭐ 必做 … ⭐ 利基。
- **付費 Professional Certificate / Specialization（IBM、大學）認可度，通常高於免費完成證書**；但兩者都不是學位，Coursera 那種「X% career outcomes」是行銷數字。
- **Agent 領域變化快**：超過 12–18 個月的課，對框架版本（smolagents / LangGraph / MCP）要打 recency 折扣。

---

## 🌍 英文課程

### tier-1（高度可信 + 動手做 + 夠新）

| 課程（連結） | 成本 | 適合誰 | 教什麼 | 證書 |
|---|---|---|---|---|
| [Hugging Face — AI Agents Course](https://huggingface.co/learn/agents-course) ⭐⭐⭐⭐⭐ | 🆓 | 想用免費、框架中立教材動手做的人 | smolagents / LangGraph / LlamaIndex 三家動手 + observability / eval；建並 benchmark 一個 agent | 免費，兩級：Fundamentals（Unit 1 + quiz ≥80%）；Certificate of Completion（再加作業 + 最終挑戰）。HF 直接簽發 |
| [DeepLearning.AI — Agentic AI](https://www.deeplearning.ai/courses/agentic-ai/) ⭐⭐⭐⭐⭐ | 🆓→💰 | 有中階 Python + 基本 LLM/API 概念的開發者 | 四個核心設計模式：reflection、tool use、planning、multi-agent（31 影片 + 8 評量作業） | 旁聽免費（無證書）；證書需付費 Pro（約 $25–30/月）並完成評量。講師 Andrew Ng。中文對照：[`datawhalechina/agentic-ai`](https://github.com/datawhalechina/agentic-ai) |
| [Weights & Biases — AI Engineering: Agents](https://wandb.ai/site/courses/agents/) ⭐⭐⭐⭐ | 🆓 | 想學「會評估、可上線」agent 的開發者 | 與 OpenAI 團隊合作；reasoning model 建 agent、tool/memory/planning、orchestrator-worker 多 agent、用 accuracy/latency/cost 做可複現 eval（約 2 小時） | 免費完成證書（W&B AI Academy 簽發） |
| [IBM — RAG and Agentic AI（Professional Certificate）](https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai) ⭐⭐⭐⭐ | 💰 | 想要大廠 Professional Certificate 的人 | RAG + agentic AI 實作，多課程組成的 Professional Certificate | 付費（Coursera Plus；可申請助學金）。IBM 簽發，認可度高於一般完成證書 |
| [Vanderbilt 大學 — AI Agent Developer](https://www.coursera.org/specializations/ai-agents) ⭐⭐⭐⭐ | 💰 | 想要大學背書、系統性學 agent 開發的人 | 設計、打造、調校 agent 軟體；Python agentic 應用 | 付費（Coursera Plus；可申請助學金）。Vanderbilt 大學 Specialization Certificate |

### tier-2（紮實，但有特定 caveat）

| 課程（連結） | 成本 | 適合誰 | 教什麼 | 證書 |
|---|---|---|---|---|
| [Coursera — Agentic AI Engineering（Edureka）](https://www.coursera.org/specializations/agentic-ai-engineering) ⭐⭐⭐ | 💰 | 想沿 LangChain / LangGraph / MCP 一路做完的人 | 4 課：LangChain 生態、LCEL、ReAct/memory、LangGraph 多 agent、MCP 部署、eval | 付費 Specialization Certificate。caveat：Edureka 是商業培訓機構（非大學/lab），可信度中等；想要更高背書選上面 IBM / Vanderbilt |
| [Anthropic Academy](https://anthropic.skilljar.com/) ⭐⭐⭐⭐ | 🆓 | 在 Claude / MCP stack 上做 agent 的人 | Claude Code、Claude API、MCP、Agent Skills；17 門自學課、5 條學習軌 | 免費官方證書（Skilljar 簽發，含 quiz，email 註冊即可，可加 LinkedIn）。caveat：vendor-specific（Claude/MCP），補充而非取代框架中立的基礎課 |

> 也想了解但未列為主 entry：[LangChain Academy — Intro to LangGraph](https://academy.langchain.com/courses/intro-to-langgraph)（🆓 免費 LangGraph 完成證書，single-vendor）。雲廠商（Google Cloud / AWS）的 agentic 路線多半給 skill badge，跟它們各自的付費**專業認證考試**不是同一回事，別混為一談。

---

## 🀄 中文課程

> **gap-first 事實**：會發證書、又 agent 專門的中文課**目前都要付費**，且多是**大廠 vendor 認證**（綁自家 stack）；**zh-TW 原生 + 帶證書 + agent 專門的幾乎不存在**。想免費拿證書，繁中／簡中學習者現階段通常還是走上面的英文課（Hugging Face / W&B / Anthropic 皆免費）。下面三門以 NVIDIA DLI 中文版最貼題。

### tier-1（高度可信）

| 課程（連結） | 成本 | 適合誰 | 教什麼 | 證書 |
|---|---|---|---|---|
| [NVIDIA DLI — 使用大語言模型建構代理式 AI（中文）](https://www.nvidia.cn/training/instructor-led-workshops/building-agentic-ai-applications-with-llms/) ⭐⭐⭐⭐ | 💰 | 想用中文、跟著動手做 agent 系統的人 | 用 LLM 建 agentic 系統：deep reasoning、檢索、tool 呼叫、多 agent、LangGraph、上線部署考量（8 小時） | 付費（約 ¥3500／人，講師帶領、排程制），含 6 個月雲端 lab。完成測驗後拿 NVIDIA DLI 證書。caveat：價格較高、需排課 |

### tier-2（紮實，但有特定 caveat）

| 課程（連結） | 成本 | 適合誰 | 教什麼 | 證書 |
|---|---|---|---|---|
| [阿里雲 — 大模型 ACA 認證 + 百煉智能體 Clouder](https://edu.aliyun.com/certification) ⭐⭐⭐ | 💰 | 在阿里雲（百煉/通義）stack 上做 agent、想要圈內認可的人 | 大模型工程；Clouder 系列含「基於百煉平台構建智能體應用」模組 | 付費官方認證（需實名）。caveat：認可是 vendor-scoped（綁百煉/通義）、非學術可轉移；zh-Hans 限定 |
| [華為 — HCIA-AI（大模型應用方向）](https://e.huawei.com/cn/talent/cert/) ⭐⭐⭐ | 💰 | 想要華為生態認可、系統性入門的人 | 2026 V1.0 大綱含人工智慧基礎、大模型知識、大模型應用、智算中心方案 | 付費官方認證（考試制）。caveat：認可偏華為生態與大陸就業市場；zh-Hans。HCIP/HCIE 為更深延伸 |

> 其他中文選項以備註處理，不列為主 entry：慕課網「AI Agent 全棧開發工程師」（商業 bootcamp，judge by syllabus、外部認可有限）、教育部「人工智慧課程修讀證書」（官方電子證書、偏綜合素養非 agent 工程）。**不收** cert-mill（無評量、無可信簽發方的泛 AIGC 認證）。

---

## ⚠️ 關於「拿證書」這件事——完整 caveat（請務必照實轉述給讀者）

1. **完成證書不是 accredited 學歷。** 它代表參與和投入，不代表 mastery；跟學分課、學位是兩回事。本清單**絕不**把這些證書講成資格認證。
2. **付費 ≠ 一定被認可，免費 ≠ 一定沒份量。** 大廠／大學的付費 Professional Certificate（IBM、Vanderbilt）認可度通常高些；但免費課也可能評量嚴格（Hugging Face 的證書 gate 在 quiz + 作業 + 挑戰）。看的是簽發方和評量，不是價格。
3. **這些證書實際證明 exposure 與 effort，不是 competence。** 誠實說法是「自主學習的證據」，不是「能打造可上線 agent 的證明」。
4. **證書最有用的場景是 screening，且很少單獨起作用。** 來自可信來源的證書能幫你過初篩，但幾乎不保證 offer，要搭作品集才有效。
5. **你做出的作品，比你拿到的證書更重要。** 雇主要的是你能做事的證據（GitHub repo、deploy 的 agent、開源貢獻）。一門課真正的 payoff 是它逼你做出的 artifact，不是那張 PDF。
6. **別蒐集零散 badge，要往一條連貫的 skill set 走。** 五張不相關的入門證書，遠不如一條展示同一 skill set 的連貫路徑可信——這也是把課程當「roadmap 的步驟」而非「獎盃牆」的理由。
7. **Recency caveat。** Agent 框架與最佳實務汰換很快，舊 cohort 的證書可能代表過時的知識。看課程的 vintage。

---

## 維護備註

- **最後核對：2026-05。** 課程資訊（尤其證書條件、免費／付費）漂移很快——以各課官網為準，stale 的可見地標註而非默默錯誤。
- 加新課的門檻：講師／機構可辨識 + 真的有評量或第一方簽發的證書 + 內容夠新。**不收** cert-mill（marketplace 型完成證書外部認可近乎零）。
- 三語同步：每次增刪／改星等／改證書條件，都要套到 `courses.md` + `courses.en.md` + `courses.zh-Hans.md`。
