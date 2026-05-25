# TeamZen Frontend

React-based frontend for TeamZen - A BTech Teammate Finder Platform built with Vite, Tailwind CSS, and Framer Motion.

## 🔗 Links
- **Backend Repo**: [teamzen-backend](https://github.com/mukul953kumar/teamzen-backend)
- **Live App**: _Add your Vercel URL here_

---

## 🛠 Tech Stack

| Package | Purpose |
|---------|---------|
| React 18 | UI library |
| Vite | Build tool |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| React Query | Server state management |
| React Hook Form | Form handling |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Hot Toast | Notifications |

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── images/              # Static images
├── src/
│   ├── components/
│   │   ├── Footer.jsx        # Site footer
│   │   ├── Navbar.jsx        # App navbar
│   │   ├── LandingNavbar.jsx # Landing page navbar
│   │   ├── Layout.jsx        # Page layout wrapper
│   │   ├── LoadingSpinner.jsx
│   │   ├── NotificationBell.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx       # Auth state management
│   │   ├── ThemeContext.jsx      # Dark/light theme
│   │   └── NotificationContext.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx       # Home/landing page
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── EmailVerification.jsx
│   │   ├── VerifyCode.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── UserProfile.jsx       # View other user's profile
│   │   ├── Projects.jsx
│   │   ├── Achievements.jsx
│   │   ├── Teams.jsx
│   │   ├── TeamDetail.jsx
│   │   ├── TeammateFinder.jsx    # Search teammates
│   │   ├── TeamInvitations.jsx
│   │   └── Chat.jsx
│   ├── services/
│   │   └── authAPI.js            # Axios API instance + auth calls
│   ├── App.jsx                   # Routes setup
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- TeamZen backend running

### Installation

```bash
git clone https://github.com/mukul953kumar/teamzen-frontend.git
cd teamzen-frontend
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run

```bash
npm run dev       # Development server → http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
```

---

## 📄 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| LandingPage | `/` | Public home page |
| Login | `/login` | User login |
| Signup | `/signup` | User registration |
| ForgotPassword | `/forgot-password` | Request password reset |
| ResetPassword | `/reset-password` | Reset with token |
| EmailVerification | `/verify-email` | Email verification |
| Dashboard | `/dashboard` | User dashboard |
| Profile | `/profile` | Own profile management |
| UserProfile | `/user/:id` | View other user's profile |
| Projects | `/projects` | Manage projects |
| Achievements | `/achievements` | Manage achievements |
| Teams | `/teams` | Browse & create teams |
| TeamDetail | `/teams/:id` | Team details & members |
| TeammateFinder | `/find-teammates` | Search teammates |
| TeamInvitations | `/invitations` | Manage join requests |
| Chat | `/chat` | Team & private chat |

---

## 🎨 Design System

### Color Palette
- Primary: Blue `#0ea5e9`
- Secondary: Purple `#a855f7`
- Dark: Slate `#0f172a`
- Accent: Cyan `#06b6d4`

### UI Features
- Glass morphism effects
- Framer Motion animations
- Gradient backgrounds
- Dark/Light theme toggle
- Fully responsive design

---

## 🔒 Auth Flow

1. User signs up → email verification sent
2. User verifies email → can login
3. JWT token stored in `localStorage`
4. Axios interceptor attaches token to every request
5. On 401 response → auto logout + redirect to `/login`

---

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import `teamzen-frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app/api
   ```
4. Deploy!

---

## 📄 License
MIT
