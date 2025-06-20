# HireAI – Product Feature Overview

## Current Capabilities

### Job-Posting Life-Cycle
* **AI-Generated Job Posts** – `/api/jobs/create` converts a free-form prompt into a fully-structured posting (title, description, skills, salary, etc.) via Google Gemini.
* **Public Apply Link** – each job receives an `apply/{id}` URL with a branded application form (PDF upload, validation, toast feedback).
* **CRUD & Social Syndication**  
  * List / delete endpoints (`/api/jobs`, `/api/jobs/[id]`).  
  * Auto-generated social media posts for LinkedIn, Facebook, Twitter & generic boards (`/api/jobs/generate-social-posts`).

### Candidate Acquisition
* **AI Candidate Search** – recruiter supplies role, location & optional filters → Perplexity fetches real public profiles, Gemini enriches them, rates skills & creates match scores.
* **Interactive Search UI** (`/search`) – animated progress (“Connecting → Searching → Processing → Finalising”), filters, multi-select.
* **Search Pipeline Builder** – selected profiles flow into `/search-pipeline` where personalised outreach emails can be generated & sent in bulk.

### Résumé Intelligence
* **Single Résumé Parser** – `/api/upload-resume` extracts text/links from PDFs then prompts Gemini for a strict JSON analysis (skills, experience, pros/cons, contact, etc.).
* **Multi-Agent Analyzer** – `/api/upload-resume-multi-agent` orchestrates 7 specialised agents (document processor, role matching, skills analysis … final synthesis) with real-time status cards.
* **Chat With Résumé** – `/api/chat-resume` allows ad-hoc Q&A about the analysed résumé.
* **Parser UI** – drag-and-drop multi-file upload, animated progress, expandable cards, per-résumé chat, add-to-pipeline.

### Applicant Management
* **Applicants Board** (`/jobs/[id]/applicants`) – search, filter, sort, bulk select. Saves uploaded resumes to localStorage for offline analysis.
* **AI Ranking** (`/jobs/[id]/ranking`) – re-runs analysis per applicant against job requirements, assigns scores, badges (🥇🥈🥉) and draws animated progress.

### Email Operations
* **Template Generator** – `/api/generate-email` (Groq LLama-3 with Gemini fallback) returns JSON `{subject, body}` tailored to candidate skills & match score.
* **Rich HTML Sender** – `/api/send-email` uses Nodemailer; pretty HTML or plain-text fallback.
* **Pipeline Pages** – `/pipeline` & `/search-pipeline` manage per-candidate drafts, bulk send, copy-to-clipboard.

### Analytics & Reporting
* Animated dashboard (`/analytics`) with overview metrics, email-funnel stats, top-performing jobs, recent activity feed, export & time-range filter.

### Shared Infrastructure
* In-memory `JobStore` & `ApplicationStore` (easy to swap for a real DB).
* Central `lib/google-ai.ts` helper to select Gemini model.
* Robust PDF text + link extraction with `pdf-parse` & regex.
* Environment driven API keys (Google, Groq, Perplexity), SMTP credentials, base URL.

### UX & Visual Polish
* Tailwind + Radix UI components, framer-motion micro-animations, gradients, skeleton loaders, drag-and-drop zones.
* Mobile-responsive hooks (`use-mobile`) and theme provider ready for dark-mode.


## Future Capabilities

### Adding AI Interviews
- First we need to conenct this AI Interview to the Another App