# EcoSmart AI - Smart Waste Classification, Segregation & Recovery System

EcoSmart AI is a production-grade, fully responsive **AI Smart Waste Classification, Segregation, Resource Recovery, and Environmental Management System**.

---

## 🌟 Key Features

1. **Multi-Object AI Waste Scanner**:
   - Classifies single and mixed waste streams across 5 standardized categories: **Wet/Organic**, **Dry/Recyclable**, **Biomedical**, **Hazardous**, and **Mixed/E-Waste**.
   - Normalizes object composition percentages so total equals exactly ~100%.
   - Calculates estimated material recovery min/max ranges and evaluates cross-contamination risks.

2. **Strict Safety Priority Hierarchy**:
   - Immediately isolates Biomedical and Hazardous items.
   - Enforces handling order: **Hazardous/Biomedical Alert → PPE Safety → Segregation → Treatment → Recovery**.

3. **Client-Side Media Compression Pipeline**:
   - HTML5 Canvas pipeline targeting ~500KB (admin-configurable).
   - Automatically skips compression if file size is already below target threshold.
   - Displays real-time before/after size stats and reduction percentages.

4. **Dynamic Theme Customization System**:
   - Admin control panel allowing live editing of 11 CSS color variables (`--color-primary`, `--color-background`, etc.).
   - Instant reflection across light, dark, and system modes without rebuilding the application.
   - Curated presets: **Eco Green**, **Ocean Blue**, **Earth**, **Dark Eco**, **Clean Minimal**.

5. **Floating Public AI Chatbot**:
   - Knowledge retrieval with safety guardrails prohibiting dangerous dumping or open burning instructions.
   - Includes typing indicators, suggested questions, timestamps, clear history, and safety banners.

6. **Admin Dashboard (`/admin`)**:
   - **Overview**: Real-time stats cards, category distribution, recent scans log.
   - **Waste Management**: Full CRUD for waste items & categories with properties, image upload via server ImgBB proxy, and confidence thresholds.
   - **Theme Settings**: Color pickers, mode toggles, and live card previews.
   - **Chatbot Control**: Q&A knowledge base entries, match priorities, and safety messages.
   - **Page Manager**: CMS custom page creator & editor with markdown support.
   - **Settings**: Site configurations, maintenance mode toggle, media size limits.
   - **Analytics**: Trend charts, mixed waste frequencies, low confidence rates.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, PostCSS/Autoprefixer, React Router v6, Framer Motion, Lucide React, Recharts.
- **Backend API**: Node.js Vercel Serverless Functions (`/api/*`).
- **Data & Auth**: Firebase Admin SDK (server-side only), Firebase Web Client SDK, Cloud Firestore, ImgBB storage proxy, Google Gemini Vision API.

---

## 🚀 Getting Started Locally

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` for client environment settings:
```bash
cp .env.example .env
```

Copy `.env.server.example` to `.env.server` for Vercel serverless function keys:
```bash
cp .env.server.example .env.server
```

> **Note**: If Firebase or Gemini API keys are not provided upfront, the application runs seamlessly in **Fallback Simulation Mode**, enabling complete testing of all public and admin CRUD features!

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔑 Admin Login Credentials (Demo Mode)

- **Login URL**: `/admin/login` or click **Admin Panel** in header.
- **Demo Email**: `admin@ecosmart.waste`
- **Demo Password**: `admin123password` (or click "Auto-fill Admin Demo Credentials").

---

## ☁️ Deployment to Vercel

1. Push code repository to GitHub/GitLab.
2. Import project into Vercel Dashboard.
3. Configure Environment Variables under Vercel Project Settings:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `IMGBB_API_KEY`
   - `GEMINI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
4. Click **Deploy**. Vercel will automatically host the React frontend and deploy serverless functions under `/api/*`.
