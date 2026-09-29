# StudySpark — AI Study Buddy & Quiz Generator

**StudySpark** is a modern full-stack web application built for students and lifelong learners. It converts lecture notes and PDF documents into interactive, high-retention quizzes powered by AI.

---

## Features

- 📄 **PDF & Text Extraction**: Server-side parsing of uploaded PDF lecture notes or plain text files.
- ⚡ **AI-Powered Quiz Generation**: Creates Multiple Choice Questions (MCQs) and Short-Answer questions with explanations, topic tags, and sample answers.
- 🎯 **Interactive Quiz Environment**: Accessible keyboard shortcuts (`A/B/C/D` or `1-4`), live timer, visual progress bar, and question status grid.
- 📊 **Rich Score Analytics**: Radial score meters, stats breakdown, topic mastery progress, and AI-generated study recommendations.
- 🔍 **Detailed Answer Review**: In-depth explanations for every question highlighting correct vs. student answers.
- 🛡️ **Zero-Config Demo Mode**: Works immediately out-of-the-box with realistic sample lecture notes without requiring an API key.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router with React 18 & TypeScript)
- **Styling**: Tailwind CSS with custom color palette & micro-animations
- **Icons**: Lucide React
- **PDF Extraction**: `pdf-parse` (Node.js buffer parsing)
- **LLM Engine**: `@google/generative-ai` (Google Gemini API) with structured JSON schemas
- **Storage**: Browser LocalStorage for persistent recent quizzes & test results

---

## Environment Variables

Copy `.env.example` to `.env.local` to configure live LLM access:

```bash
cp .env.example .env.local
```

### Supported Variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `LLM_API_KEY` | Google Gemini API key for live quiz generation | None (Triggers Demo Mode) |
| `GEMINI_API_KEY` | Alternative key alias | None |
| `LLM_MODEL` | Preferred Gemini model variant | `gemini-1.5-flash` |

> **Note**: If `LLM_API_KEY` is omitted or invalid, StudySpark automatically defaults to **Demo Mode** so all features remain 100% operational for judges and testing.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

### 1. PDF Text Extraction
1. File uploaded via multipart form data (`POST /api/generate-quiz`).
2. Server reads binary buffer using `pdf-parse`.
3. Normalizes whitespace, removes null control bytes, and truncates text smartly at ~12,000 characters to keep LLM context light and accurate.

### 2. Quiz Generation Pipeline
1. Construct structured prompt enforcing strict JSON output schema.
2. Request `numberOfQuestions`, `difficulty`, `questionTypes`, and optional `focusTopic`.
3. Validate output JSON against TypeScript interfaces (`MCQQuestion` / `ShortAnswerQuestion`).
4. Fall back seamlessly to deterministic demo quiz if API key is unconfigured.

### 3. Automated Scoring & Evaluation
- **MCQ Questions**: Automated exact-match scoring.
- **Short Answer Questions**: Graded via `POST /api/evaluate-answer` using LLM semantic comparison or keyword similarity fallback.
- **AI Study Insight**: Rule-based & LLM synthesized performance summary highlighting weak topic areas.

---

## Judge Demonstration Flow (2–3 Min Hackathon Demo)

1. **Dashboard**: Click **"Try Demo"** or **"Create a Quiz"**.
2. **Upload**: Select sample file or configure question options (10 Questions, Medium Difficulty).
3. **Processing**: Observe the animated 5-step extraction & AI analysis pipeline.
4. **Quiz Interface**: Test interactive answer selection with keyboard shortcuts (`A`, `B`, `C`, `D`).
5. **Results**: View the circular percentage meter, topic breakdown, and **AI Study Insight**.
6. **Review**: Click **"Review Answers"** to see detailed explanations for every correct and incorrect answer.

---

## License

MIT License. Built for hackathons & student productivity.
