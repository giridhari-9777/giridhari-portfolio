# Giridhari Padhy — Interactive Portfolio Site

An interactive, high-performance static website (pure HTML5/CSS3/Vanilla JS — no build step required) designed with an **"AI Research Laboratory meets 35mm Cinematography HUD"** aesthetic. Showcases Giridhari's dual strengths as an **Agentic AI & RL Researcher** (NIST University & NIT Puducherry) and **Cinematographer & Visual Storyteller** (Creator of *Hidden Bharat with Biki*).

## Key Features

1. **Interactive 5-Signal RL & Oncology RAG Simulator**:
   - Live experimental evaluator for the flagship research project (*"Agentic RAG with a Five-Signal RL Reward for Hallucination-Resistant Oncology QA"* under Dr. Ansuman Mahapatra).
   - Allows visitors to select clinical benchmark queries (NSCLC, FOLFOX/FOLFIRI, BRCA1/2 synthetic lethality) and toggle between 5 evaluated LLM architectures (Mistral 7B, Gemma 3, Qwen 2.5, DeepSeek-R1, Phi-4).
   - Real-time animated decomposition of the 5 reward signals (Safety, Hallucination, Out-of-Context, Embedding Distance, Evidence Grounding) with verifiable literature citations.

2. **Cinematography & Creative Showcase Lightbox**:
   - High-impact visual cards with video preview modals and 35mm camera HUD overlays for *Hidden Bharat with Biki*, the Design & Video Editing Reel, and NIST University PR cinematography.

3. **Interactive Developer/Researcher Terminal (`Cmd+K` / `Ctrl+K`)**:
   - Built-in CLI command palette allowing engineers and recruiters to run commands (`research`, `skills`, `resume`, `contact`, `whoami`, `clear`) or click shortcut chips.

4. **Dynamic Visual Polish & Micro-Interactions**:
   - Harmonic mathematical SVG signal wave continuously rendering live frequency oscillations.
   - Animated rollup counters for key research and production metrics.
   - 1-click clipboard copy for email and phone numbers with floating toast notifications.
   - Skill matrix with domain filter tabs (`AI & RL Systems`, `Creative & Post-Production`, `Engineering & Cloud`, `Languages`).
   - OpenGraph metadata, SVG favicon, and Schema.org JSON-LD structured data.

---

## File Architecture

```
index.html      → All page markup, SEO, OpenGraph metadata, JSON-LD Schema, and modal dialogs
styles.css      → Design system tokens, glassmorphic HUD styling, responsive layout, and animations
script.js       → Waveform physics, RAG simulation engine, command palette, lightbox modal, and copy toasts
assets/
  profile.jpg                    → High-resolution portrait photograph
  Giridhari_Padhy_Resume.pdf     → Downloadable official curriculum vitae
```

---

## Deployment Instructions

### Option A — Drag and Drop (Fastest on Vercel)
1. Navigate to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New… → Project**, then choose **"Deploy from folder"** (or drag the `giridhari-portfolio` directory directly onto the window).
3. Leave all default settings unchanged (Vercel automatically detects a static site).
4. Click **Deploy**. Your live URL will be ready in seconds.

### Option B — Via GitHub
1. Create a repository on GitHub and commit these files.
2. In Vercel, click **Add New… → Project → Import Git Repository** and select the repository.
3. Every subsequent push to GitHub will automatically trigger a new deployment.

### Option C — Local Preview
Open `index.html` directly in any modern browser, or run a lightweight local server:
```bash
# Python 3
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
