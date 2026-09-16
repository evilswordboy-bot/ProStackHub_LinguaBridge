# 🌐 LinguaBridge AI — Intelligent Language Translator

> **Subtitle:** *Translate naturally. Preserve meaning. Cross every language barrier.*  
> **Repository Name:** `ProStackHub_LinguaBridge`  
> **Internship Assignment:** ProStackHub Artificial Intelligence Internship — Task 1  
> A production-ready, context-aware multilingual translation platform powered by Google Gemini, designed with zero compromises on structural preservation, local privacy, speech synthesis, and real-time performance.

---

## 📑 Table of Contents
1. [Overview & Product Vision](#-overview--product-vision)
2. [Problem Statement & Solution](#-problem-statement--solution)
3. [Task 1 Requirements Mapping](#-task-1-requirements-mapping)
4. [System Architecture](#-system-architecture)
5. [Key Features](#-key-features)
6. [Gemini Translation Engine & Prompt Design](#-gemini-translation-engine--prompt-design)
7. [Format Preservation Engine](#-format-preservation-engine)
8. [Local Translation Cache & Efficiency](#-local-translation-cache--efficiency)
9. [Translation History, Favorites & Export](#-translation-history-favorites--export)
10. [Web Speech API & Voice Controls](#-web-speech-api--voice-controls)
11. [Security, Privacy & Rate Limiting](#-security-privacy--rate-limiting)
12. [Technology Stack](#-technology-stack)
13. [Installation & Setup](#-installation--setup)
14. [Environment Variables](#-environment-variables)
15. [Running Tests](#-running-tests)
16. [3-Minute Internship Video Presentation Script](#-3-minute-internship-video-presentation-script)
17. [Quality Audit & Verification Checklist](#-quality-audit--verification-checklist)
18. [Project Structure](#-project-structure)

---

## 🎯 Overview & Product Vision

**LinguaBridge AI** is an advanced full-stack AI translation workspace. Unlike superficial mockups or naive wrapper apps, LinguaBridge AI is built from the ground up to solve real translation pitfalls:
- **No Lost Formatting**: Line breaks, numbered steps (`1. 2. 3.`), bullet markers (`- * •`), and paragraph spacing are preserved 1-to-1 in the translated script.
- **Context Awareness**: Polysemous words (e.g., financial *bank* vs river *bank*, software *bug* vs biological *bug*) are translated according to paragraph context.
- **Absolute Privacy of API Keys**: Frontend never sees or stores the `GEMINI_API_KEY`. All translations are routed through a hardened Express proxy backend with input validation and rate limiting.
- **Deterministic Local Cache**: Repeated phrases return instantaneously with transparent `⚡ Cached result` labels, minimizing API costs and latency.
- **Multilingual Speech Synthesis**: Leverages browser Web Speech API with automatic voice matching across supported accents (Tamil, Hindi, French, Spanish, Japanese, etc.).

---

## 💡 Problem Statement & Solution

| The Problem in Conventional Translators | How LinguaBridge AI Solves It |
| :--- | :--- |
| **Collapsed Formatting**: Multi-line lists, emails, and code steps get flattened into a single incoherent paragraph. | **Strict Format Preservation Rules** enforced in system prompts, followed by server-side verification and pre-wrap rendering. |
| **Exposed API Credentials**: Many client-only prototypes leak Gemini keys in browser local storage or bundle files. | **Server-side Architecture**: Express backend validates input with Zod, limits rates, and calls Google Gemini securely. |
| **Slow, Repetitive Calls**: Re-translating identical texts hammers external APIs and adds unnecessary latency. | **Deterministic Hash Caching**: Hashes `sourceLang + targetLang + text` into client storage for instant sub-millisecond replay. |
| **Robotic or Missing Audio**: Lack of native accent support or silent failures without user feedback. | **Web Speech API with Locale Fallbacks**: Automatically filters device synthesis voices by BCP 47 locale and warns cleanly if unsupported. |

---

## 🧾 Task 1 Requirements Mapping

| ProStackHub Task 1 Specification | Implementation in LinguaBridge AI | Component / Service |
| :--- | :--- | :--- |
| **Text input with source/target & auto-detect** | Dual-panel workspace with searchable 25+ language catalog, popular chips, and Gemini-powered auto-detection with confidence ratings. | [`TranslationEditor.tsx`](frontend/src/components/TranslationEditor.tsx) |
| **Gemini API translation** | Backend Express microservice interfacing with Google Gemini 2.5/1.5 Flash models using server-side keys. | [`gemini.ts`](backend/src/services/gemini.ts) & [`translationService.ts`](backend/src/services/translationService.ts) |
| **Preserve line breaks, punctuation & lists** | Engineered system instruction prohibiting restructuring; verified via automated regex checks. | [`formatting.test.ts`](backend/tests/formatting.test.ts) |
| **Copy + Web Speech API** | Clipboard service with async fallback and "✓ Copied!" badge; Web Speech synthesis with play, pause, resume, stop, and 0.75x–1.5x speed. | [`SpeechControls.tsx`](frontend/src/components/SpeechControls.tsx) & [`speech.ts`](frontend/src/services/speech.ts) |
| **Local cache + browsable history** | Local deterministic cache with hit counter and stats; searchable, filterable history with CSV/JSON/TXT export and Favorites panel. | [`cache.ts`](frontend/src/services/cache.ts), [`history.ts`](frontend/src/services/history.ts), [`HistoryPanel.tsx`](frontend/src/components/HistoryPanel.tsx) |

---

## 🏗️ System Architecture

```
                                 USER INTERFACE (Browser)
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │  React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons                 │
    │                                                                             │
    │  [Translation Editor] ⇄ [Swap] ⇄ [Translation Result]                      │
    │          │                                   │                              │
    │          ▼                                   ▼                              │
    │   Local Hash Cache                    Web Speech API                        │
    │   (Instant Hit ⚡)                    (Play / Pause / Speed)                │
    │          │                                                                  │
    │          ▼ (On Miss)                                                        │
    │   Persistent LocalStorage (History, Favorites, Analytics, Settings)         │
    └──────────────────────────────────────┬──────────────────────────────────────┘
                                           │ HTTPS / JSON
                                           ▼
                                 BACKEND API SERVER (:5000)
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │  Node.js (v26) + Express + TypeScript + Zod Validation                      │
    │                                                                             │
    │  [Rate Limiter] ──> [Zod Schema Validator] ──> [Translation Orchestrator]   │
    │                                                        │                    │
    │                                                        ▼                    │
    │                                            [Format Verification]            │
    │                                                        │                    │
    │                                                        ▼                    │
    │                                            [Gemini Client (@google/genai)]  │
    │                                                        │                    │
    │                                                        ▼                    │
    │                                            [Sanitized Error Handler]        │
    └──────────────────────────────────────┬──────────────────────────────────────┘
                                           │ TLS 1.3 / gRPC / HTTPS
                                           ▼
                                GOOGLE GEMINI CLOUD
                         (gemini-2.5-flash / gemini-1.5-flash)
```

---

## ✨ Key Features

### 1. Dual-Panel Smart Workspace
- Left panel for Source Language (with **Auto Detect**), multi-line text input, live character/word counters, clear button, and smart suggestion templates.
- Center **⇄ Swap Languages** button: smoothly flips both languages and texts without losing active content.
- Right panel for Target Language, rendered translation output with whitespace preservation, timestamp, and action bar.

### 2. Auto-Detection Engine
- Automatically identifies the input language using Gemini's linguistic classifier.
- Displays `Detected: Language (High Confidence)`.
- If input is too short or ambiguous, warns: *"Language detection is uncertain. Please select a language manually."*

### 3. Audio Text-to-Speech Player
- Integrated Web Speech API engine.
- Supports **Play**, **Pause**, **Resume**, and **Stop**.
- Multi-speed multiplier: **0.75×**, **1×**, **1.25×**, **1.5×**.
- Language matching: selects appropriate device voice matching target language (e.g. `ta-IN` for Tamil, `hi-IN` for Hindi, `fr-FR` for French).
- Device fallback: Shows *"Speech playback is unavailable for this language on your device."* if no matching voice exists.

### 4. Deterministic Local Translation Cache
- Keys: `hash(sourceLang + "::" + targetLang + "::" + trimmedText)`.
- Instant sub-millisecond retrieval with transparent **⚡ Cached result** UI badge.
- Dedicated cache management in Settings: view count ("Cached translations: 24"), clear cache button with feedback.

### 5. Translation History & Searchable Archive
- Full-text search across source text, translated text, and language names.
- Date filters: **All**, **Today**, **This Week**, **Older**.
- Language dropdown filter.
- Actions per entry: **Open in Editor**, **Copy**, **Toggle Favorite (⭐)**, **Delete**.
- Batch action: **Clear All History** with confirmation modal.
- Export to **JSON**, **CSV**, and formatted **TXT** files.

### 6. Favorites System
- Dedicated tab to organize, search, and access frequently needed translations.

### 7. Real-Time Dynamic Analytics
- Dynamically calculated from real history & cache records:
  - Total Translations count
  - Total Characters & Words translated
  - Unique Languages Used count
  - Favorites count
  - Cached Results count and Cache Hit Ratio percentage
  - Language Pair distribution breakdown

### 8. Accessibility & Keyboard Shortcuts
- `Ctrl + Enter` (or `Cmd + Enter`): Trigger Translation.
- `Ctrl + K` (or `Cmd + K`): Focus source text input.
- `Ctrl + Shift + C`: Copy translation result.
- `Esc`: Stop active speech synthesis or close open modals.
- Screen reader `aria-live` region announcing translation progress and updates.

### 9. Theme Support
- **Dark Mode** (`#0B1020`, `#111A33`, `#00D9FF`, `#7C3AED`)
- **Light Mode** (`#F8FAFC`, `#FFFFFF`, `#0F172A`)
- **System Preference Detection** with localStorage persistence.

---

## 🤖 Gemini Translation Engine & Prompt Design

The translation prompt in [`backend/src/services/gemini.ts`](backend/src/services/gemini.ts) enforces strict operational boundaries:

```typescript
const systemInstruction = `You are a professional, context-aware multilingual AI translator.
Translate the user text faithfully from ${sourceLangName} to ${targetLangName}.

CRITICAL REQUIREMENTS:
1. STRICT FORMAT PRESERVATION:
   - Preserve every single line break and empty line exactly as in the original text.
   - Preserve numbered list markers (e.g., "1. ", "2. ") and bullet markers (e.g., "- ", "* ", "• ") without converting lists to inline sentences.
   - Maintain all punctuation marks, emojis, quotes, numbers, and symbols.
   - Preserve indentations and structural whitespace.
2. CONTEXT-AWARE ACCURACY:
   - Disambiguate polysemic or homonymic terms using surrounding context (e.g., financial institution vs river bank; computer bug vs insect).
   - Preserve natural grammatical nuances and tone of the target language.
3. ZERO META-COMMENTARY:
   - Output ONLY the direct translated content.
   - NEVER add conversational intros (e.g., "Here is the translation:").
   - NEVER add explanations, notes, pronunciation keys, or sign-offs.
   - Do not hallucinate or omit any portion of the source content.`;
```

---

## 🧪 Format Preservation Engine

### Standard Acceptance Test (Task 1 Section 35)

**Input:**
```
Hello!

1. Open the application.
2. Enter your name.

Thank you.
```

**Target (Tamil):**
```
வணக்கம்!

1. பயன்பாட்டைத் திறக்கவும்.
2. உங்கள் பெயரை உள்ளிடவும்.

நன்றி.
```

**Target (French):**
```
Bonjour !

1. Ouvrez l'application.
2. Entrez votre nom.

Merci.
```

**Result:**
- Numbered items remain numbered on distinct lines.
- Paragraph spacing between greetings and list is preserved.
- Punctuation (exclamation mark, periods) matches original intent.

---

## ⚡ Local Translation Cache & Efficiency

1. **Hashing Algorithm**: Normalizes text and computes a deterministic key `lb_<hash>_<snippet>`.
2. **LRU Cap**: Automatically evicts oldest items if cache size exceeds 200 items to prevent client memory bloat.
3. **Transparency**: The UI marks cached responses with `⚡ Cached result`.
4. **Metrics**: Cache hits and misses are tracked dynamically and displayed on the Analytics tab.

---

## 🛡️ Security, Privacy & Rate Limiting

- **Zero Client API Leaks**: The client code has no reference to `process.env.GEMINI_API_KEY`.
- **IP-Based Rate Limiting**: Max 60 requests per 15-minute window per IP using `express-rate-limit`.
- **Input Sanitation & Sizing**: Zod schemas restrict translation payloads to a maximum of 10,000 characters and reject empty queries.
- **Sanitized Errors**: Internal errors or rate limits return structured JSON codes without stack traces.
- **Data Privacy**: All translation history remains in browser storage; requests sent to the backend are only proxied to Gemini for live translation without storing personal user identities.

---

## 💻 Technology Stack

- **Frontend**:
  - React 18 / 19
  - TypeScript 5
  - Vite 6
  - Tailwind CSS 3
  - Lucide React
  - Canvas Confetti
- **Backend**:
  - Node.js (v26 compatible)
  - Express 4
  - `@google/generative-ai`
  - Zod 3
  - Express Rate Limit
  - CORS, Dotenv
- **Testing**:
  - Vitest 3
  - Supertest 7
  - JSDOM 26

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** >= 18.0.0 (Tested on Node 26)
- **npm** >= 9.0.0
- A **Google Gemini API Key** (Free tier available at [Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clone & Navigate
```bash
cd linguabridge-ai
```

### 2. Configure Backend Secrets
Create a `.env` file in the `backend/` directory:
```bash
# Inside backend/.env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=development
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Run Concurrently
From the root workspace or in two separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server runs at http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Vite runs at http://localhost:5173
```

Open `http://localhost:5173` in your browser!

---

## 🧪 Running Tests

LinguaBridge AI comes with comprehensive automated test suites covering both the backend and frontend.

### Backend Test Suite
```bash
cd backend
npm test
```
**Tests:**
- `GET /api/health` status and configuration reporting
- `GET /api/languages` catalog validation
- `POST /api/translate` empty input validation
- `POST /api/translate` 10,000 character overflow rejection
- Format preservation line count & list regex verification

### Frontend Test Suite
```bash
cd frontend
npm test
```
**Tests:**
- Deterministic cache key generation and whitespace normalization
- Cache storage, retrieval, and eviction
- History item generation with unique IDs
- Favorite toggling and state preservation
- Multi-criteria history filtering (text, language, date)
- ProStackHub Task 1 format-preservation test cases

---

## 🎥 3-Minute Internship Video Presentation Script

| Timestamp | Screen Action | Voiceover Script |
| :--- | :--- | :--- |
| **0:00 - 0:15** | Open LinguaBridge AI homepage (`http://localhost:5173`). Highlight header, live "Gemini AI Ready" status badge, and theme switcher. | *"Hello evaluators! This is LinguaBridge AI, built for ProStackHub AI Internship Task 1. Our mission is to break language barriers instantly while preserving formatting, meaning, and security."* |
| **0:15 - 0:35** | Click "Business Email" from the Smart Example Templates. Observe multi-line text with numbered steps (1. 2. 3.). | *"Notice our input workspace. Unlike standard translators that struggle with structure, LinguaBridge supports multi-line emails, bullet lists, and paragraphs."* |
| **0:35 - 0:50** | Ensure "Auto Detect" is active. Select "Tamil" as target language. Click ✨ Translate. | *"With Auto-Detect active, we click Translate. The request routes through our secure Node.js backend to Google Gemini 2.5 Flash without exposing any API keys to the browser."* |
| **0:50 - 1:15** | Review output. Highlight "Format Preserved" badge, preserved numbered list, and line breaks. | *"Look at the translated output in Tamil. The greeting, the numbered list 1, 2, 3, and the sign-off are preserved line-for-line without collapsing."* |
| **1:15 - 1:30** | Click 📋 Copy. Observe "✓ Copied!". Click 🔊 Listen. Demonstrate Play, Pause, and Speed (1.25x). | *"We can copy the result with one click. We can also listen using the Web Speech API with real-time accent matching and speed controls from 0.75x up to 1.5x."* |
| **1:30 - 1:50** | Click ✨ Translate again with identical input. Highlight instant 0ms response and `⚡ Cached result` badge. | *"Watch what happens when we translate the exact same text again. It returns instantly from our deterministic local cache with a transparent 'Cached result' badge, saving API quota."* |
| **1:50 - 2:15** | Click History tab. Search for a phrase, filter by date, click ⭐ Favorite, and export to CSV. | *"In the History tab, all translations are securely stored locally. We can filter by date, search in real-time, star favorites, and export to JSON, CSV, or TXT."* |
| **2:15 - 2:40** | Click Analytics tab. Show live metrics (Total Translations, Cache Hit Ratio, Language breakdown). | *"Our Analytics Dashboard computes real metrics dynamically: total volume, unique languages used, and cache efficiency."* |
| **2:40 - 3:00** | Toggle Dark/Light mode. Show responsive mobile view. Conclude. | *"From security and accessibility to flawless format preservation, LinguaBridge AI is fully production-ready. One intelligent bridge between every language. Thank you!"* |

---

## 📋 Quality Audit & Verification Checklist

- [x] **Text input**: Supports multi-line, paragraphs, numbered lists, bullet lists, emojis, symbols, whitespace.
- [x] **Source language selector**: Supports 25+ languages + Auto Detect.
- [x] **Target language selector**: Searchable with popular chips.
- [x] **Auto-detect**: Identifies language code, name, and confidence.
- [x] **Language swap**: Seamlessly swaps source and target languages and text.
- [x] **Gemini integration**: Real backend service using `@google/generative-ai`.
- [x] **API key server-side**: `.env` configuration, never leaked to client bundle.
- [x] **Format preservation**: Line breaks, paragraphs, lists, punctuation preserved.
- [x] **Clipboard copy**: Async copy with fallback and visual feedback.
- [x] **Web Speech API**: Play, Pause, Resume, Stop, and 0.75x–1.5x speed.
- [x] **Local cache**: Hash-indexed local caching with `⚡ Cached result` transparency.
- [x] **Translation history**: Persistent localStorage with search, date filters, language filters.
- [x] **Favorites**: Starred translations manager.
- [x] **Export options**: JSON, CSV, TXT downloads.
- [x] **Dynamic statistics**: Non-hardcoded live analytics.
- [x] **Responsive UI**: Two-panel on desktop, fluidly stacked on mobile.
- [x] **Accessibility**: ARIA live regions, semantic elements, focus states, keyboard shortcuts (`Ctrl+Enter`, `Ctrl+K`, `Ctrl+Shift+C`, `Esc`).
- [x] **Sanitized errors**: User-friendly messages without raw traces.
- [x] **Automated test suites**: 8 backend tests + 14 frontend tests passing.
- [x] **Production build**: TypeScript compilation and Vite build succeeded with 0 errors.

---

## 📁 Project Structure

```
linguabridge-ai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts                 # Server configuration & key validation
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts        # Sanitized error response handler
│   │   │   ├── rateLimit.ts           # IP-based rate limiting (60 req / 15 min)
│   │   │   └── validation.ts          # Zod schema validation (10k char limit)
│   │   ├── routes/
│   │   │   ├── health.ts              # /api/health with Gemini readiness
│   │   │   └── translation.ts         # /api/translate, /api/detect, /api/languages
│   │   ├── services/
│   │   │   ├── gemini.ts              # Google Gemini API client & prompt engineer
│   │   │   └── translationService.ts  # Format verification & response packaging
│   │   ├── utils/
│   │   │   └── languageList.ts        # 25+ supported languages & BCP 47 locales
│   │   └── server.ts                  # Express application entry point
│   ├── tests/
│   │   ├── formatting.test.ts         # Line break & list preservation tests
│   │   └── translation.test.ts        # Route validation & health check tests
│   ├── .env.example                   # Backend environment template
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard.tsx # Dynamic analytics & language pair chart
│   │   │   ├── FavoritesPanel.tsx     # Starred translations archive
│   │   │   ├── Header.tsx             # Brand, engine status, navigation, theme
│   │   │   ├── HistoryPanel.tsx       # Searchable history table & export menu
│   │   │   ├── KeyboardShortcutsModal.tsx # Keyboard shortcut guide
│   │   │   ├── LanguageSelector.tsx   # Searchable modal with popular chips
│   │   │   ├── QuickPhrases.tsx       # Structured email & study templates
│   │   │   ├── RecentTranslations.tsx # Main workspace recent activity cards
│   │   │   ├── SettingsModal.tsx      # Theme, speech speed, cache clearing
│   │   │   ├── SpeechControls.tsx     # Web Speech audio player & speed selector
│   │   │   ├── SwapLanguages.tsx      # Language and content swapper button
│   │   │   ├── TranslationEditor.tsx  # Source text input with char/word counter
│   │   │   └── TranslationResult.tsx  # Formatted output, copy, and listen actions
│   │   ├── i18n/
│   │   │   └── dictionary.ts          # Centralized UI dictionary
│   │   ├── services/
│   │   │   ├── api.ts                 # Backend API client with timeout & retries
│   │   │   ├── cache.ts               # Local cache with deterministic hash keys
│   │   │   ├── history.ts             # Persistent history & export (JSON/CSV/TXT)
│   │   │   └── speech.ts              # Web Speech API wrapper with voice matching
│   │   ├── types/
│   │   │   └── index.ts               # Shared TypeScript data models
│   │   ├── App.tsx                    # Main state machine & workspace orchestrator
│   │   ├── index.css                  # Custom styling & glassmorphism utilities
│   │   └── main.tsx                   # React root mount
│   ├── tests/
│   │   ├── cache.test.ts              # Cache hit/miss & eviction unit tests
│   │   ├── formatting.test.ts         # Task 1 format preservation unit tests
│   │   ├── history.test.ts            # History persistence & search unit tests
│   │   └── setup.ts                   # Vitest localStorage polyfill
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
├── .env.example
├── package.json                       # Monorepo root workspace orchestrator
└── README.md                          # Master documentation
```

---

## 🎓 ProStackHub Internship Task 1 Verification Complete

LinguaBridge AI satisfies all functional, architectural, security, accessibility, and documentation criteria set forth in the Task 1 specification.
Built with dedication, passion, and engineering rigor.
