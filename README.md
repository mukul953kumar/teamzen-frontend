# 🚀 TeamZen Frontend

React-based frontend for **TeamZen** — A BTech Teammate & Hackathon Finder Platform built with React 18, Vite, Tailwind CSS, and Framer Motion.

## 🔗 Links
- **Frontend Repo**: [teamzen-frontend](https://github.com/mukul953kumar/teamzen-frontend)
- **Live App**: [teamzenconnect.vercel.app](https://teamzenconnect.vercel.app/)
- **Backend Repo**: [teamzen-backend](https://github.com/mukul953kumar/teamzen-backend)
- **Live API**: [teamzen-backend-1.onrender.com/api](https://teamzen-backend-1.onrender.com/api)

---

## 🛠 Tech Stack

| Package / Technology | Purpose |
| -------------------- | ------- |
| React 18 | Core UI Library |
| Vite | Lightning-fast build tool |
| Tailwind CSS | Custom utility-first styling & tokens |
| React Router v6 | Client-side SPA routing |
| React Query | Server state caching & refetching |
| React Hook Form | Form handling & validation |
| Framer Motion | Smooth micro-animations & modal transitions |
| Lucide React | Modern icons system |
| React Hot Toast | Real-time notification toasts |
| Web Audio API | Zero-dependency synthesized audio chimes |

---

## 🌟 Key Features & Recent Enhancements

### 🤖 AI Teammate Compatibility Analysis (`AIMatchModal.jsx`)
- **⚡ 3-Pillar Synergy Score**: Computes **Skill Complementarity (40%)**, **Campus & Academic Fit (30%)**, and **Hackathon Goals (30%)**.
- **💻 Tech Stack Synergy Matrix**: Side-by-side comparison of user stack vs. candidate stack.
- **💡 AI Recommendation**: Automatic role suggestions (e.g. *"Ideal for Backend / ML Lead Architect"*).

### 🖥️ Interactive Mac-Style Product Demo (`InteractiveDemo.jsx`)
- Glassmorphic browser mockup with 🔴 🟡 🟢 dots and 4 interactive preview tabs:
  1. 🔍 **Teammate Finder**: Interactive card preview with glowing match badges.
  2. 🏆 **Team Management**: Real-time team capacity progress tracking (`3/4 Members`).
  3. 💬 **Real-time Chat**: Live interactive group chat message testing.
  4. 🎯 **Project Showcase**: Verified student hackathon winner cards.

### 💬 Rich Team Chat & Code Snippets (`Chat.jsx`)
- **💻 Syntax-Highlighted Code Snippets**: Automatic code block formatting with language tags & 1-click **"Copy Code"** button.
- **✍️ Real-Time Typing Indicator**: Shows active typing status when composing messages.
- **✔✔ Read Checkmarks**: Double checkmarks indicating sent (gray) vs. read (glowing emerald).

### 🏆 Verified Student Badges & Developer Cards (`Profile.jsx` & `UserProfile.jsx`)
- **🎓 Dynamic Verified Badges**:
  - 🎓 `KNIT Verified Student` (Automatic `@knit.ac.in` email verification)
  - ⭐ `Top Contributor` (3+ skills / active profile)
  - ⚡ `Fast Responder` (`🟢 Available` status)
- **📊 Visual Technical Proficiency Matrix Bar Chart**: Categorizes skills into Frontend, Backend, Database/Cloud, and AI/ML domains.
- **💻 GitHub Developer Card**: Live GitHub profile link and 1-click profile view.
- **📩 Help & Direct Email Support**: Direct `mailto:mukul.knit26@gmail.com` trigger and 1-click email copy action.

### 🔐 Terms, Privacy Policy & Mandatory Safety Consent
- Formal English **Terms of Service & Privacy Policy Modal** (`TermsModal.jsx`).
- **Zero Tolerance Policy**: Strict account deletion rule for spam or illegal activity.
- Integrated consent checkbox before **Google OAuth (`@knit.ac.in`)** authentication (`Login.jsx`).

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── images/                 # Static assets & TeamZen logo
├── src/
│   ├── components/
│   │   ├── AIMatchModal.jsx     # AI Compatibility Breakdown Modal
│   │   ├── InteractiveDemo.jsx  # Interactive Product Preview Carousel
│   │   ├── TermsModal.jsx       # Terms of Service & Privacy Policy Modal
│   │   ├── ConsentModal.jsx     # Zero-Tolerance Safety Consent Modal
│   │   ├── Footer.jsx           # Branded footer with logo
│   │   ├── Navbar.jsx           # Single-Auth Log In Navbar
│   │   ├── LoadingSpinner.jsx
│   │   ├── NotificationBell.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx      # Google OAuth state management
│   │   ├── ThemeContext.jsx     # Theme provider
│   │   └── NotificationContext.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx      # Animated count-up hero & sections
│   │   ├── Login.jsx            # Google OAuth + Mandatory Terms Checkbox
│   │   ├── Dashboard.jsx        # Redesigned team & teammate cards
│   │   ├── Profile.jsx          # Skill Matrix, Badges & Help Support
│   │   ├── UserProfile.jsx      # Mobile-responsive candidate profiles
│   │   ├── Projects.jsx
│   │   ├── Achievements.jsx
│   │   ├── Teams.jsx            # Capacity progress bars & recruitment status
│   │   ├── TeammateFinder.jsx   # AI Match score & filters
│   │   ├── TeamInvitations.jsx
│   │   └── Chat.jsx             # Code Snippets & Typing Indicators
│   ├── services/
│   │   ├── authAPI.js           # Axios API client
│   │   └── soundUtils.js        # Web Audio API chime player
│   ├── App.jsx                  # React Router routes setup
│   ├── main.jsx                 # Entry point
│   └── index.css                # Custom CSS tokens & mobile scaling
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- TeamZen backend running on `http://localhost:5000`

### Installation

```bash
git clone https://github.com/mukul953kumar/teamzen-frontend.git
cd teamzen-frontend
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run Locally

```bash
npm run dev       # Start Vite dev server → http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

---

## 📄 Pages & Routes Overview

| Page | Route | Description |
| ---- | ----- | ----------- |
| LandingPage | `/` | Hero section with count-up stats, product demo, features, & FAQ |
| Login | `/login` | Single Google OAuth (`@knit.ac.in`) with mandatory Terms consent |
| Dashboard | `/dashboard` | Redesigned recent teams & recommended teammate cards |
| Profile | `/profile` | Technical proficiency chart, verified badges, & help support |
| UserProfile | `/user/:id` | Mobile-responsive student candidate profile |
| Teams | `/teams` | Create teams, capacity bars (`3/4 Members`), & join requests |
| TeammateFinder | `/find-teammates` | Skill search, ⚡ AI Match breakdown, & invite modal |
| Chat | `/chat` | Code snippets, typing indicators, & read checkmarks |

---

## 📄 License
MIT © TeamZen Development Team
