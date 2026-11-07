# GRANTLY – Unified Scholarship Discovery & Management Platform

> **Your Future Deserves Funding. Find It Here.**  
> A unified scholarship discovery and management platform that simplifies how students discover, evaluate, apply for, and track scholarships.

[![Built with React](https://img.shields.io/badge/Frontend-React%2019%20+%20TypeScript-blue.svg)](https://react.dev/)
[![Styling with Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-emerald.svg)](https://tailwindcss.com/)
[![Icons](https://img.shields.io/badge/Icons-Lucide%20React-teal.svg)](https://lucide.dev/)
[![Charts](https://img.shields.io/badge/Charts-Recharts-indigo.svg)](https://recharts.org/)

---

## 🌟 Product Vision & Problem Solved

Scholarship information is scattered across hundreds of disorganized websites, official eligibility criteria are dense and confusing, application deadlines are easily missed, and managing multiple active applications on spreadsheets causes student burnout.

**GRANTLY** turns this chaotic process into a structured, confident journey:

$$\text{Discover} \longrightarrow \text{Check Eligibility} \longrightarrow \text{Compare} \longrightarrow \text{Apply} \longrightarrow \text{Track} \longrightarrow \text{Succeed}$$

Designed with the aesthetic and responsiveness of a high-growth EdTech SaaS platform, GRANTLY empowers undergraduate, postgraduate, merit-based, need-based, and international aspirants.

---

## 🚀 Core Features & Differentiators

### 1. 🎯 Rule-Based Smart Eligibility Matching Engine
- **No random percentages**: Match calculations are derived directly from mathematical evaluation of:
  - **Educational Level**: UG, PG, High School, Diploma
  - **Academic Cutoffs**: CGPA out of 10.0 or percentage equivalence
  - **Socio-Economic Thresholds**: Annual family income ceilings (e.g. ₹2.5 LPA NSP cutoffs vs ₹8.0 LPA OBC-NCL limits)
  - **Categorical Quotas & Special Domains**: State domicile, female/diversity reservation, specific branch matches.
- Transparent natural language explanations with itemized checkmarks ($\checkmark$ / $\times$) for each rule.
- **What-If Simulator**: Real-time interactive sliders allowing students to simulate how raising their CGPA or updating income brackets unlocks new grants.

### 2. ⚡ Scholarship Opportunity Score (Algorithmic Ranking)
Composites three distinct vectors into a normalized 0–100 ranking:
$$\text{Opportunity Score} = (0.50 \times \text{Eligibility Fit}) + (0.30 \times \text{Funding Value}) + (0.20 \times \text{Urgency Feasibility})$$

### 3. 📂 Missing Document Detector & Secure Vault
- Secure client-side Document Vault storing Aadhaar, Income certificates, Caste certificates, marksheets, bonafide letters, bank passbooks, and passports.
- **Cross-Referencing Radar**: Scans every tracked scholarship in "Interested" or "Preparing" stages and automatically identifies missing or expiring certificates before application deadlines.

### 4. 📊 Financial Impact Overview
- High-visibility analytics dashboard breaking down:
  - **Total Potential Funding** unlocked across eligible schemes.
  - **In-Progress Applied Funding** awaiting review.
  - **Awarded / Disbursed Grants** (verified via DBT).

### 5. 📋 Visual Kanban Application Tracker
- 7 distinct lifecycle stages:
  1. `Interested`
  2. `Preparing`
  3. `Applied`
  4. `Under Review`
  5. `Shortlisted`
  6. `Approved` (with celebratory confetti particle effects!)
  7. `Rejected`
- Interactive card status updates, personal notes, and official portal application reference tracking numbers.

### 6. ⚖️ 4-Way Scholarship Comparison Matrix
- Side-by-side evaluation of funding amounts, academic merit cutoffs, income limits, eligible course years, benefits, and required document checklists.

### 7. 📅 Deadline Calendar & Urgent Reminders
- Visual monthly calendar (November/December 2026) with color-coded deadlines, filterable by tracked opportunities and closing within $\le 7$ days.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom branding (`emerald-600` primary, deep navy typography)
- **Visualizations**: Recharts for application stage pipelines
- **Icons**: Lucide React
- **Celebration**: Canvas-Confetti
- **Testing**: Built-in automated test suite verifying rule engine criteria

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Run Automated Engine Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🧪 Verified Demo Personas

GRANTLY comes pre-seeded with 3 realistic student personas switchable in 1-click via the top navigation bar or settings:
1. **Priya Sharma** – B.Tech Computer Science (3rd Year), CGPA 8.8, Family Income ₹3.2 LPA, OBC, Female (Pune, Maharashtra).
2. **Rahul Verma** – M.Sc Biotechnology (1st Year), CGPA 7.6, Family Income ₹1.8 LPA, SC, Male (New Delhi).
3. **Ananya Sen** – B.A. Economics (2nd Year), CGPA 9.2, Family Income ₹6.5 LPA, General, Female (Kolkata).

---

## 📜 Disclaimer

GRANTLY is an independent discovery platform. All sample scholarship opportunities reference public Indian central/state government portals (e.g. National Scholarship Portal, AICTE, DST INSPIRE, MahaDBT) and corporate CSR programs (Tata Trusts, Reliance Foundation, Infosys Foundation). Direct official source links are cited for every grant.
