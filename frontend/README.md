# ArogyaTrack Frontend

**Track Health. Connect Care. Stay Well.**

A modern, responsive React 18 single-page application built for community health monitoring, automated predictive risk assessment, and collaborative health worker follow-up.

---

## 🚀 Key Features

* **3 Role-Based Portals:**
  * **Community Member:** Health checks (24 Kaggle clinical indicators), lifestyle logs, My Health Journey timeline, Telugu/English messaging with voice-to-text, and scheduled follow-ups.
  * **Health Worker (ANM / Nurse):** Priority review queue, assigned community member roster, follow-up scheduling and completion, Telugu/English audio-assisted messaging.
  * **District Health Administrator:** High-level district coverage stats, ML model evaluation benchmarks, population risk distribution trends, health worker assignment.
* **Dual-Language Communication:**
  * Instant toggling between English and Telugu (`te-IN`).
  * Quick healthcare phrase templates (diet, hydration, follow-up scheduling).
* **Voice-to-Text Dictation:**
  * Uses the browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
  * Microphone dictation populates an editable text box (never auto-sent, ensuring safety and verification).
* **Responsive Healthcare UI:**
  * Tailwind CSS design system with high-contrast accessibility, accessible cards, and mobile sidebar drawer.
  * Strict adherence to non-diagnostic assistive terminology.

---

## 🛠️ Technology Stack

* **Core Framework:** React 18
* **Build Tool:** Vite 5
* **Routing:** React Router DOM 6
* **Styling:** Tailwind CSS 3, PostCSS, Autoprefixer
* **Icons:** Lucide React
* **HTTP Client:** Axios with JWT interceptors
* **Voice Support:** Web Speech Recognition API

---

## 📁 Directory Structure

```text
frontend/
├── public/
├── src/
│   ├── api/                  # Axios service modules (auth, user, health, ml, admin, etc.)
│   ├── components/           # Reusable UI components
│   │   ├── EmptyState/
│   │   ├── ErrorMessage/
│   │   ├── FollowUpCard/
│   │   ├── Footer/
│   │   ├── HealthForm/       # 24 Kaggle dataset feature input
│   │   ├── LifestyleForm/
│   │   ├── Loading/
│   │   ├── MessageBox/       # Telugu/English + Voice-to-Text
│   │   ├── Navbar/
│   │   ├── NotificationPanel/
│   │   ├── PredictionCard/
│   │   ├── ProtectedRoute/
│   │   ├── Sidebar/
│   │   └── StatCard/
│   ├── context/              # AuthContext (JWT management & session persistence)
│   ├── hooks/                # useVoiceToText hook
│   ├── pages/                # Page views
│   │   ├── admin/            # Dashboard, Members, Nurses, Assessments, Statistics, Trends
│   │   ├── auth/             # Login, Register
│   │   ├── healthWorker/     # Nurse Dashboard, Priority Reviews, Members, Follow-ups
│   │   └── user/             # Member Dashboard, Health Assessment, Journey, Profile
│   ├── App.jsx               # Route definitions and layout shell
│   ├── main.jsx              # Application bootstrap
│   └── index.css             # Tailwind base and custom utilities
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 💻 Local Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `frontend` root:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Generates production-ready static assets in `dist/`.
