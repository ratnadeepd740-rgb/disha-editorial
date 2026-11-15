import React, { useState, useEffect, useMemo, useRef } from "react";

const DEFAULT_GEMINI_API_KEY = "";

const BUCKET_TYPES = [
  {
    id: "Dream",
    label: "Dream",
    badgeClass: "bg-[#194236] text-white",
    borderClass: "border-[#194236]",
    desc: "High-reach flagship institutes (<3% acceptance)"
  },
  {
    id: "Target",
    label: "Target",
    badgeClass: "bg-[#A67C46] text-white",
    borderClass: "border-[#A67C46]",
    desc: "Core high-ROI matches aligned with your preparation"
  },
  {
    id: "Wildcard",
    label: "Wildcard",
    badgeClass: "bg-[#2E5A4C] text-white",
    borderClass: "border-[#2E5A4C]",
    desc: "High-upside cross-domain pivots (IPMAT, CLAT, UCEED)"
  },
  {
    id: "Backup",
    label: "Backup",
    badgeClass: "bg-[#6C7A74] text-white",
    borderClass: "border-[#6C7A74]",
    desc: "High-probability safety nets (CUET, State CETs)"
  }
];

const EXAM_METADATA_ENRICHMENT = {
  "jee-main-adv": {
    prepSynergy: "Core JEE PCM Anchor (100% Baseline)",
    avgTotalFeeLakhs: 10,
    avgEntrySalaryLakhs: 22,
    avgMidSalaryLakhs: 45,
    defaultBucket: "Dream",
    examMonth: "Jan & Apr (Main) · May (Adv)"
  },
  "bitsat": {
    prepSynergy: "88% JEE PCM Overlap + Speed English/LR",
    avgTotalFeeLakhs: 26,
    avgEntrySalaryLakhs: 21,
    avgMidSalaryLakhs: 42,
    defaultBucket: "Target",
    examMonth: "May (Session 1) & June (Session 2)"
  },
  "iiith-ugee": {
    prepSynergy: "75% JEE PCM + REAP Linguistics/Logic",
    avgTotalFeeLakhs: 19,
    avgEntrySalaryLakhs: 28,
    avgMidSalaryLakhs: 55,
    defaultBucket: "Dream",
    examMonth: "May (CBT) + June (Interview)"
  },
  "viteee-cets": {
    prepSynergy: "95% NCERT + JEE Main Speed Overlap",
    avgTotalFeeLakhs: 12,
    avgEntrySalaryLakhs: 10,
    avgMidSalaryLakhs: 24,
    defaultBucket: "Backup",
    examMonth: "April – May"
  },
  "nata-jee-arch": {
    prepSynergy: "50% PCM Math + 50% Live Sketching & 3D Aptitude",
    avgTotalFeeLakhs: 8,
    avgEntrySalaryLakhs: 7,
    avgMidSalaryLakhs: 17,
    defaultBucket: "Wildcard",
    examMonth: "Jan & Apr (JEE Paper 2) · Apr–Jun (NATA)"
  },
  "isi-cmi": {
    prepSynergy: "Olympiad / Proof-Writing Math Beyond JEE",
    avgTotalFeeLakhs: 2,
    avgEntrySalaryLakhs: 24,
    avgMidSalaryLakhs: 54,
    defaultBucket: "Dream",
    examMonth: "May (Second Week)"
  },
  "imu-cet": {
    prepSynergy: "80% Class 12 PCM + Shipping Company Sponsorship",
    avgTotalFeeLakhs: 13,
    avgEntrySalaryLakhs: 11,
    avgMidSalaryLakhs: 34,
    defaultBucket: "Target",
    examMonth: "June (CBT) + Sponsorship Interviews"
  },
  "dgca-cpl-pilot": {
    prepSynergy: "Class 12 Physics/Math + Aviation Psychometrics",
    avgTotalFeeLakhs: 75,
    avgEntrySalaryLakhs: 24,
    avgMidSalaryLakhs: 45,
    defaultBucket: "Wildcard",
    examMonth: "Rolling Airline Cadet Selections"
  },
  "nda-navy-af-tes": {
    prepSynergy: "NCERT PCM Math + GAT GK/English + 5-Day SSB",
    avgTotalFeeLakhs: 1,
    avgEntrySalaryLakhs: 13,
    avgMidSalaryLakhs: 20,
    defaultBucket: "Target",
    examMonth: "April (NDA-1 Written) + Summer SSB"
  },
  "neet-ug": {
    prepSynergy: "100% NCERT PCB Line-by-Line Mastery",
    avgTotalFeeLakhs: 3,
    avgEntrySalaryLakhs: 11,
    avgMidSalaryLakhs: 22,
    defaultBucket: "Dream",
    examMonth: "May (First Sunday)"
  },
  "aiims-nursing-paramedical": {
    prepSynergy: "95% NEET PCB Overlap + Basic GK",
    avgTotalFeeLakhs: 1,
    avgEntrySalaryLakhs: 9,
    avgMidSalaryLakhs: 24,
    defaultBucket: "Target",
    examMonth: "June (First/Second Week)"
  },
  "bpharm-pharmd-bpt": {
    prepSynergy: "95% Board & State CET PCB Overlap",
    avgTotalFeeLakhs: 6,
    avgEntrySalaryLakhs: 6.5,
    avgMidSalaryLakhs: 16,
    defaultBucket: "Backup",
    examMonth: "April – May (State CETs / CUET)"
  },
  "icar-aieea": {
    prepSynergy: "100% CUET-UG NCERT Science Domain Overlap",
    avgTotalFeeLakhs: 2,
    avgEntrySalaryLakhs: 8.5,
    avgMidSalaryLakhs: 20,
    defaultBucket: "Backup",
    examMonth: "May (via CUET-UG)"
  },
  "iiser-iat": {
    prepSynergy: "85% JEE/NEET Concept Depth Across PCMB",
    avgTotalFeeLakhs: 5,
    avgEntrySalaryLakhs: 14,
    avgMidSalaryLakhs: 32,
    defaultBucket: "Target",
    examMonth: "May (Last Week)"
  },
  "nest-niser": {
    prepSynergy: "85% IAT/JEE/NEET Conceptual Research Depth",
    avgTotalFeeLakhs: 1.5,
    avgEntrySalaryLakhs: 14,
    avgMidSalaryLakhs: 28,
    defaultBucket: "Target",
    examMonth: "June (First Week)"
  },
  "iist-isro": {
    prepSynergy: "100% JEE Advanced Rank Based (Zero Extra Exam)",
    avgTotalFeeLakhs: 4,
    avgEntrySalaryLakhs: 14,
    avgMidSalaryLakhs: 30,
    defaultBucket: "Dream",
    examMonth: "May–June (via JEE Advanced)"
  },
  "cuet-science-biotech": {
    prepSynergy: "100% Class 12 NCERT Board Syllabus Aligned",
    avgTotalFeeLakhs: 1,
    avgEntrySalaryLakhs: 7.5,
    avgMidSalaryLakhs: 20,
    defaultBucket: "Backup",
    examMonth: "May (Mid-to-Late May)"
  },
  "ipmat-jipmat": {
    prepSynergy: "Separate Class 10/11 Quant + Verbal RC Prep",
    avgTotalFeeLakhs: 35,
    avgEntrySalaryLakhs: 24,
    avgMidSalaryLakhs: 46,
    defaultBucket: "Wildcard",
    examMonth: "May (Second/Third Week)"
  },
  "npat-set-cuet-mgmt": {
    prepSynergy: "Class 12 Math + Speed Quantitative & Logical Aptitude",
    avgTotalFeeLakhs: 8,
    avgEntrySalaryLakhs: 14,
    avgMidSalaryLakhs: 38,
    defaultBucket: "Target",
    examMonth: "May (CUET / NPAT / SET)"
  },
  "clat-ailet": {
    prepSynergy: "Reading Comprehension, Legal Logic & Current Affairs",
    avgTotalFeeLakhs: 16,
    avgEntrySalaryLakhs: 18,
    avgMidSalaryLakhs: 40,
    defaultBucket: "Wildcard",
    examMonth: "December (Prior to Boards)"
  },
  "uceed-nid": {
    prepSynergy: "Visual-Spatial Logic + Live Product Sketching",
    avgTotalFeeLakhs: 12,
    avgEntrySalaryLakhs: 18,
    avgMidSalaryLakhs: 38,
    defaultBucket: "Wildcard",
    examMonth: "January (Prelims) · Apr (Studio)"
  },
  "nift-bdes": {
    prepSynergy: "Creative Sketching + General Ability + 3D Model Test",
    avgTotalFeeLakhs: 13,
    avgEntrySalaryLakhs: 8,
    avgMidSalaryLakhs: 18,
    defaultBucket: "Wildcard",
    examMonth: "February (Written) · Apr (Situation Test)"
  },
  "nchmct-jee": {
    prepSynergy: "Low Prep Friction: English, Service Aptitude & Basic LR",
    avgTotalFeeLakhs: 4,
    avgEntrySalaryLakhs: 6.5,
    avgMidSalaryLakhs: 18,
    defaultBucket: "Backup",
    examMonth: "May (Second Week)"
  },
  "upsc-nda-army": {
    prepSynergy: "Class 12 Math + General Studies + 5-Day SSB",
    avgTotalFeeLakhs: 1,
    avgEntrySalaryLakhs: 13,
    avgMidSalaryLakhs: 20,
    defaultBucket: "Wildcard",
    examMonth: "April (Written) + Summer SSB"
  },
  "ashoka-krea-flame": {
    prepSynergy: "Holistic Essays, Critical Thinking Test & Interview",
    avgTotalFeeLakhs: 36,
    avgEntrySalaryLakhs: 14,
    avgMidSalaryLakhs: 34,
    defaultBucket: "Wildcard",
    examMonth: "Nov / Jan / Apr / May Rounds"
  },
  "sat-act-global": {
    prepSynergy: "Class 10 Math + Evidence-Based Reading + Extracurricular SOPs",
    avgTotalFeeLakhs: 68,
    avgEntrySalaryLakhs: 65,
    avgMidSalaryLakhs: 115,
    defaultBucket: "Dream",
    examMonth: "Aug / Oct / Dec / Mar / May"
  }
};

const EXAM_CALENDAR_TIMELINE = [
  {
    id: "cal-dec-jan",
    month: "December – January",
    phaseLabel: "Early-Bird & Session 1 Window",
    clashRisk: "Moderate — Pre-Board Practical Overlap",
    clashTone: "amber",
    schedulingAdvice: "Treat January exams (JEE Main Session 1, UCEED/NID Prelims) as your first live benchmark before Board practicals begin.",
    events: [
      { examId: "clat-ailet", title: "CLAT & AILET", window: "First & Second Sunday of December", type: "Final Exam" },
      { examId: "uceed-nid", title: "NID DAT Prelims & UCEED (IIT Bombay)", window: "First & Third Sunday of January", type: "Final Exam" },
      { examId: "jee-main-adv", title: "JEE Main (Session 1)", window: "Last Week of January", type: "Session 1 CBT" },
      { examId: "ashoka-krea-flame", title: "Ashoka / Krea / FLAME Round 2", window: "January Application & AAT Window", type: "Holistic Round" }
    ]
  },
  {
    id: "cal-feb-mar",
    month: "February – March",
    phaseLabel: "Class 12 Board Examination Window",
    clashRisk: "Board Priority — Protect 75% Eligibility Bar",
    clashTone: "emerald",
    schedulingAdvice: "Focus 85% of your energy on NCERT Class 12 Boards—every NCERT chapter directly fuels CUET-UG, NEET-UG, IAT, and JEE Main.",
    events: [
      { examId: "nift-bdes", title: "NIFT Stage 1 Written Exam", window: "Second Week of February", type: "Written Exam" },
      { examId: "sat-act-global", title: "Digital SAT Spring Testing", window: "Mid-March Weekend", type: "Global Test" },
      { examId: "cuet-science-biotech", title: "CUET-UG, NEET-UG & IPMAT Registrations", window: "February – March Deadlines", type: "Registration Alert" }
    ]
  },
  {
    id: "cal-apr",
    month: "April",
    phaseLabel: "Engineering & Defence Sprint",
    clashRisk: "High — Back-to-Back CBT Dates",
    clashTone: "amber",
    schedulingAdvice: "Avoid booking VITEEE/MET slots on the same 48-hour window as MHT-CET/KCET; keep 2 buffer days for travel recovery.",
    events: [
      { examId: "jee-main-adv", title: "JEE Main (Session 2)", window: "First & Second Week of April", type: "Final CBT" },
      { examId: "nda-navy-af-tes", title: "UPSC NDA & NA (I) Written Exam", window: "Third Sunday of April", type: "Written Exam" },
      { examId: "upsc-nda-army", title: "UPSC NDA Army Wing Written", window: "Third Sunday of April", type: "Written Exam" },
      { examId: "viteee-cets", title: "VITEEE, Manipal MET & MHT-CET / KCET", window: "Mid-to-Late April", type: "Slot Booking CBT" },
      { examId: "nata-jee-arch", title: "JEE Paper 2 (B.Arch) & NATA Attempt 1", window: "April Weekends", type: "Studio & CBT" }
    ]
  },
  {
    id: "cal-may",
    month: "May (Peak Crunch Month)",
    phaseLabel: "The Super-Clash Month (Medical, IIT, IIM, Research & CUET)",
    clashRisk: "CRITICAL CLASH ZONE — 7 Major Exams in 25 Days",
    clashTone: "red",
    schedulingAdvice: "May is where burnout peaks: NEET (Week 1), ISI/COMEDK (Week 2), JEE Adv + IPMAT + CUET (Weeks 3–4), and IISER IAT (Week 4). Pre-select your top 3–4 exams now.",
    events: [
      { examId: "neet-ug", title: "NEET-UG (Pen & Paper)", window: "First Sunday of May", type: "National Exam" },
      { examId: "isi-cmi", title: "ISI Admission Test & CMI Entrance", window: "Second Sunday of May", type: "Proof & MCQ" },
      { examId: "nchmct-jee", title: "NCHMCT JEE (IHM Hospitality)", window: "Second Week of May", type: "CBT Exam" },
      { examId: "iiith-ugee", title: "IIIT-H UGEE (SUPR + REAP)", window: "First/Second Week of May", type: "Research CBT" },
      { examId: "jee-main-adv", title: "JEE Advanced (Paper 1 & Paper 2)", window: "Third/Fourth Sunday of May", type: "6-Hour Marathon" },
      { examId: "ipmat-jipmat", title: "IPMAT Rohtak, IPMAT Indore & JIPMAT", window: "Mid-to-Late May", type: "Aptitude CBT" },
      { examId: "bitsat", title: "BITSAT Session 1", window: "Third/Fourth Week of May", type: "Slot CBT" },
      { examId: "cuet-science-biotech", title: "CUET-UG (Science, Agri & DU BMS/Econ)", window: "Mid-to-Late May", type: "Multi-Shift Test" },
      { examId: "npat-set-cuet-mgmt", title: "NMIMS NPAT & Symbiosis SET", window: "May Testing Window", type: "Management CBT" },
      { examId: "bpharm-pharmd-bpt", title: "State Pharmacy / BPT CETs", window: "May Window", type: "State CBT" },
      { examId: "icar-aieea", title: "ICAR AIEEA (via CUET-UG)", window: "Mid-to-Late May", type: "Domain Test" },
      { examId: "iiser-iat", title: "IISER Aptitude Test (IAT)", window: "Last Sunday of May", type: "PCMB CBT" }
    ]
  },
  {
    id: "cal-jun",
    month: "June",
    phaseLabel: "Research Finals, Second Attempts & Counselling",
    clashRisk: "Moderate — Interview & JoSAA/MCC Prep",
    clashTone: "emerald",
    schedulingAdvice: "Use June for NEST, BITSAT Session 2 improvement, AIIMS Nursing/Paramedical, IPMAT interviews, and JoSAA/MCC preference list locking.",
    events: [
      { examId: "nest-niser", title: "NEST (NISER & UM-DAE CEBS)", window: "First Week of June", type: "Research CBT" },
      { examId: "aiims-nursing-paramedical", title: "AIIMS B.Sc. Nursing & Paramedical", window: "First/Second Week of June", type: "CBT Exam" },
      { examId: "imu-cet", title: "IMU-CET (Merchant Navy)", window: "Second Week of June", type: "Maritime CBT" },
      { examId: "bitsat", title: "BITSAT Session 2", window: "Third/Fourth Week of June", type: "Second Attempt" },
      { examId: "iist-isro", title: "IIST Space Counselling & JoSAA Round 1", window: "Mid-to-Late June", type: "Counselling" },
      { examId: "dgca-cpl-pilot", title: "DGCA Class 2/1 Medicals & Cadet Assessments", window: "June – July Intake", type: "Selection Board" }
    ]
  }
];

const TRAIT_KEYS = [
  "Analytical & Tech",
  "Clinical & Healthcare",
  "Pure Science & Research",
  "Management & Strategy",
  "Design & Spatial Creativity",
  "Law, Policy & Defence"
];

const ARCHETYPE_MAP = {
  "Analytical & Tech": {
    title: "The Systems & Quantitative Architect",
    tagline: "First-principles problem solver drawn to code, mathematics, engineering systems, and scalable technology.",
    advice: "Prioritize programs with high peer density, open-source or research labs, and strong quantitative rigor over generic degree labels."
  },
  "Clinical & Healthcare": {
    title: "The Clinical & Life-Science Healer",
    tagline: "Empathetic, resilient, and calm under pressure—motivated by human biology, patient outcomes, and applied medicine.",
    advice: "Look beyond single-exam tunnel vision; compare clinical hours, residency bottlenecks, and allied healthcare specializations."
  },
  "Pure Science & Research": {
    title: "The Frontier Discovery Scientist",
    tagline: "Driven by deep curiosity into how nature, molecules, space, and fundamental laws operate at the edge of knowledge.",
    advice: "Seek integrated BS-MS research environments with early lab access, funded internships, and strong global PhD placement records."
  },
  "Management & Strategy": {
    title: "The Venture & Enterprise Strategist",
    tagline: "Drawn to leadership, capital allocation, organizational economics, and turning ideas into high-leverage businesses.",
    advice: "Combine your quantitative Class 12 Science edge with early exposure to finance, management programs, or tech-product leadership."
  },
  "Design & Spatial Creativity": {
    title: "The Human-Centered Spatial Creator",
    tagline: "Visual, empathetic, and inventive—bridging aesthetics, ergonomics, user experience, and physical or digital craft.",
    advice: "Build a tangible portfolio early; top design and architecture studios reward original problem framing far more than rote memorization."
  },
  "Law, Policy & Defence": {
    title: "The Constitutional & Strategic Commander",
    tagline: "Articulate, principled, and mission-oriented—thriving in high-stakes governance, corporate law, public policy, or uniformed service.",
    advice: "Your analytical Science training is a rare superpower in corporate IP law, public policy, and technical defence cadres."
  }
};

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    type: "stream",
    eyebrow: "QUESTION 01 OF 07 · ACADEMIC FOUNDATION",
    prompt: "Which Class 12 Science subject combination are you pursuing?",
    subtext: "Your stream automatically calibrates exam eligibility across engineering, medical, research, and open-to-all pathways.",
    options: [
      {
        id: "PCMB",
        label: "PCMB (Physics, Chemistry, Mathematics & Biology)",
        detail: "Maximum eligibility across Engineering, Medicine, Pure Research, and Interdisciplinary degrees.",
        weights: {}
      },
      {
        id: "PCM",
        label: "PCM (Physics, Chemistry & Mathematics)",
        detail: "Eligible for Engineering, Architecture, Quantitative Math, Space, Aviation, Navy/AF, and Open-to-All exams.",
        weights: {}
      },
      {
        id: "PCB",
        label: "PCB (Physics, Chemistry & Biology)",
        detail: "Eligible for Medicine, Allied Health, Pharmacy, Agriculture, Pure Research, and Open-to-All exams.",
        weights: {}
      }
    ]
  },
  {
    id: "q2",
    type: "scenario",
    eyebrow: "QUESTION 02 OF 07 · PROBLEM SOLVING",
    prompt: "Your school lab receives a grant to solve a local city problem. Which role do you naturally claim?",
    subtext: "Pick the task you would genuinely enjoy spending four weekends working on.",
    options: [
      {
        id: "q2a",
        label: "Build a sensor algorithm and data dashboard to predict traffic or air-quality spikes",
        detail: "Coding, modeling, and quantitative optimization",
        weights: { "Analytical & Tech": 3, "Pure Science & Research": 1 }
      },
      {
        id: "q2b",
        label: "Study public health patterns and design a rapid screening protocol for neighborhood clinics",
        detail: "Diagnostics, biology, and direct human wellbeing",
        weights: { "Clinical & Healthcare": 3, "Pure Science & Research": 1 }
      },
      {
        id: "q2c",
        label: "Redesign the physical device casing and mobile interface so elderly citizens use it effortlessly",
        detail: "Industrial ergonomics, aesthetics, and user experience",
        weights: { "Design & Spatial Creativity": 3, "Analytical & Tech": 1 }
      },
      {
        id: "q2d",
        label: "Pitch municipal officials, structure the project budget, and draft compliance guidelines",
        detail: "Strategy, institutional negotiation, and governance",
        weights: { "Management & Strategy": 2, "Law, Policy & Defence": 2 }
      }
    ]
  },
  {
    id: "q3",
    type: "scenario",
    eyebrow: "QUESTION 03 OF 07 · INTELLECTUAL CURIOSITY",
    prompt: "It is Sunday afternoon with zero exam pressure. Which long-form documentary or essay pulls you in?",
    subtext: "Notice what holds your attention when nobody is grading you.",
    options: [
      {
        id: "q3a",
        label: "How quantum computing, cryptography, or rocket propulsion systems are engineered from scratch",
        detail: "Deep-tech hardware and mathematical elegance",
        weights: { "Analytical & Tech": 2, "Pure Science & Research": 2 }
      },
      {
        id: "q3b",
        label: "Inside a trauma surgery unit or how CRISPR gene therapies cure rare genetic disorders",
        detail: "Clinical medicine and cellular breakthroughs",
        weights: { "Clinical & Healthcare": 3, "Pure Science & Research": 1 }
      },
      {
        id: "q3c",
        label: "How a startup scaled from a dorm room to a global brand, or how central banks manage crises",
        detail: "Markets, unit economics, and business strategy",
        weights: { "Management & Strategy": 3, "Law, Policy & Defence": 1 }
      },
      {
        id: "q3d",
        label: "Landmark Supreme Court constitutional battles, geopolitics, or naval/air force operations",
        detail: "Public leadership, law, and strategic command",
        weights: { "Law, Policy & Defence": 3, "Management & Strategy": 1 }
      }
    ]
  },
  {
    id: "q4",
    type: "scenario",
    eyebrow: "QUESTION 04 OF 07 · WORK ENVIRONMENT",
    prompt: "Fast-forward 8 years to your ideal Tuesday morning at age 25. Where do you see yourself?",
    subtext: "Be honest about your energy levels, pace, and daily environment.",
    options: [
      {
        id: "q4a",
        label: "Whiteboarding system architecture with a fast-moving product or quantitative tech team",
        detail: "High-leverage digital or engineering execution",
        weights: { "Analytical & Tech": 3, "Management & Strategy": 1 }
      },
      {
        id: "q4b",
        label: "Doing hospital rounds, consulting patients, or leading clinical rehabilitation protocols",
        detail: "High-trust healthcare practice and service",
        weights: { "Clinical & Healthcare": 3 }
      },
      {
        id: "q4c",
        label: "Running experiments in a national research institute, observatory, or biotech wet lab",
        detail: "Deep inquiry, publications, and scientific discovery",
        weights: { "Pure Science & Research": 3, "Clinical & Healthcare": 1 }
      },
      {
        id: "q4d",
        label: "Sketching spatial blueprints, crafting digital products, or directing a creative studio",
        detail: "Visual storytelling, form, and functional design",
        weights: { "Design & Spatial Creativity": 3 }
      }
    ]
  },
  {
    id: "q5",
    type: "scenario",
    eyebrow: "QUESTION 05 OF 07 · NATURAL STRENGTHS",
    prompt: "When friends come to you for help before a major school event or exam, what do they rely on you for?",
    subtext: "Your peers often spot your natural edge before you do.",
    options: [
      {
        id: "q5a",
        label: "Breaking down complex numerical problems or debugging logic step-by-step",
        detail: "Structured analytical clarity",
        weights: { "Analytical & Tech": 2, "Pure Science & Research": 2 }
      },
      {
        id: "q5b",
        label: "Staying calm during emergencies, comforting stressed peers, and organizing care",
        detail: "Composure and human empathy",
        weights: { "Clinical & Healthcare": 2, "Law, Policy & Defence": 1 }
      },
      {
        id: "q5c",
        label: "Negotiating sponsorships, managing team conflict, and making decisive calls",
        detail: "Executive presence and commercial instinct",
        weights: { "Management & Strategy": 3, "Law, Policy & Defence": 1 }
      },
      {
        id: "q5d",
        label: "Debating both sides persuasively, writing sharp arguments, or enforcing fair rules",
        detail: "Rhetoric, structured reasoning, and conviction",
        weights: { "Law, Policy & Defence": 3 }
      }
    ]
  },
  {
    id: "q6",
    type: "scenario",
    eyebrow: "QUESTION 06 OF 07 · RISK & REWARD",
    prompt: "How do you feel about long academic runways versus early industry entry?",
    subtext: "Career trajectories in India differ sharply in degree duration and payback period.",
    options: [
      {
        id: "q6a",
        label: "I want strong technical employability within 4 years, with optional MBA/MS pivots later",
        detail: "Fast ROI and optionality",
        weights: { "Analytical & Tech": 2, "Management & Strategy": 2 }
      },
      {
        id: "q6b",
        label: "I am comfortable with 5–8 years of rigorous clinical training for lifelong medical authority",
        detail: "Deep clinical mastery and long-term prestige",
        weights: { "Clinical & Healthcare": 3 }
      },
      {
        id: "q6c",
        label: "I am excited by a 5-year integrated research or management track with top cohort mentorship",
        detail: "Structured dual-degree depth",
        weights: { "Pure Science & Research": 2, "Management & Strategy": 2 }
      },
      {
        id: "q6d",
        label: "I want a portfolio-driven, courtroom, or uniformed leadership path outside standard STEM",
        detail: "Distinctive non-traditional excellence",
        weights: { "Design & Spatial Creativity": 2, "Law, Policy & Defence": 2 }
      }
    ]
  },
  {
    id: "q7",
    type: "scenario",
    eyebrow: "QUESTION 07 OF 07 · CORE MOTIVATION",
    prompt: "Which headline about your future self would make you proudest at age 30?",
    subtext: "Choose the impact that resonates most deeply.",
    options: [
      {
        id: "q7a",
        label: "Architected critical AI, clean-energy, or space systems used by millions daily",
        detail: "Technological and scientific scale",
        weights: { "Analytical & Tech": 2, "Pure Science & Research": 2 }
      },
      {
        id: "q7b",
        label: "Led clinical breakthroughs or transformed patient healthcare access across India",
        detail: "Direct life-saving and clinical impact",
        weights: { "Clinical & Healthcare": 3 }
      },
      {
        id: "q7c",
        label: "Built a high-growth company or led strategy at a premier global institution",
        detail: "Economic and organizational leadership",
        weights: { "Management & Strategy": 3 }
      },
      {
        id: "q7d",
        label: "Won landmark legal/policy reforms, commanded elite forces, or designed iconic products",
        detail: "Cultural, civic, or design legacy",
        weights: { "Design & Spatial Creativity": 2, "Law, Policy & Defence": 2 }
      }
    ]
  }
];

const EXAMS_DATA = [
  {
    id: "jee-main-adv",
    name: "JEE Main & Advanced",
    streamCategory: "PCM",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Engineering & Tech",
    conductingBody: "NTA (Main) & Rotating IIT (Advanced)",
    degree: "B.Tech / B.E. / Dual Degree (B.Tech + M.Tech)",
    roiBadge: "Exceptional ROI",
    roiTone: "emerald",
    summary: "India's flagship engineering entrance for admission to the 23 IITs, 31 NITs, IIITs, and premier GFTIs.",
    traits: {
      "Analytical & Tech": 98,
      "Clinical & Healthcare": 5,
      "Pure Science & Research": 74,
      "Management & Strategy": 56,
      "Design & Spatial Creativity": 42,
      "Law, Policy & Defence": 15
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with Physics, Chemistry & Mathematics (75% aggregate for GEN/OBC or 65% for SC/ST in boards for IITs/NITs).",
      pattern: "JEE Main: 75 questions (300 marks, 3 hrs, CBT). JEE Advanced: Two mandatory 3-hr papers testing multi-concept analytical depth.",
      conductingBody: "National Testing Agency (Main) & IIT Joint Admission Board (Advanced)",
      targetScore: "JEE Main 2025 Cutoffs: 99.3+ %ile (~205+ pts) for top NIT CSE; Qualifying Cutoff: GEN 93.10%ile, OBC 79.43%ile, SC 61.15%ile, ST 47.90%ile."
    },
    campusReality: {
      degreeAwarded: "4-Year B.Tech or 5-Year Integrated Dual Degree (B.Tech + M.Tech)",
      topColleges: "IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur, NIT Trichy, NIT Surathkal, IIIT Allahabad",
      feesVsRoi: "INR 8.5–11 Lakhs total 4-year tuition/hostel at IITs & NITs (with income-based fee waivers) vs INR 16–30 LPA median starting packages."
    },
    timeline: {
      years0to2: "Software Development Engineer (SDE-1), Quant Trader/Researcher, Core Semiconductor/EV Engineer, or Data Scientist (INR 15–35 LPA).",
      years3to6: "Senior Tech Lead, Product Manager, IIM/Global MBA pivot, or funded MS/PhD at Stanford, MIT, or ETH Zurich (INR 30–68 LPA).",
      years7to10Plus: "Principal Engineer, VP of Engineering, Quant Desk Head, Deep-Tech Founder, or Venture Capital Partner (INR 75 LPA – INR 2 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Moderate to Intense (Best in established product tech & R&D; demanding in quant finance and early-stage startups)",
      stressLevel: "High Exam & Peer Pressure",
      whoThrives: "Students who genuinely love mathematical problem-solving, building scalable systems, and thriving in hyper-competitive peer cohorts.",
      whoShouldAvoid: "Students who dislike abstract calculus/physics or are preparing solely out of coaching inertia."
    }
  },
  {
    id: "bitsat",
    name: "BITSAT (Pilani, Goa & Hyderabad)",
    streamCategory: "PCM",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Engineering & Tech",
    conductingBody: "Birla Institute of Technology & Science (BITS Pilani)",
    degree: "B.E. (Hons.) / M.Sc. + B.E. Dual Degree",
    roiBadge: "Strong Private ROI",
    roiTone: "emerald",
    summary: "Speed-and-accuracy computer test for BITS campuses known for zero-attendance flexibility, Practice School internships, and startup culture.",
    traits: {
      "Analytical & Tech": 94,
      "Clinical & Healthcare": 8,
      "Pure Science & Research": 68,
      "Management & Strategy": 72,
      "Design & Spatial Creativity": 40,
      "Law, Policy & Defence": 15
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with PCM, minimum 75% aggregate in PCM and 60% in each individual subject (Pure Merit — No SC/ST reservation).",
      pattern: "130 MCQs in 3 hours (Physics, Chemistry, Maths, English & Logical Reasoning) + 12 bonus questions if finished early.",
      conductingBody: "BITS Pilani Admissions Division",
      targetScore: "Latest Official Cutoffs (/390): Pilani CSE 304–327, MnC 295–312, ECE 285–298; Goa CSE 274–301; Hyd CSE 270–298; M.Sc. Econ 231–251."
    },
    campusReality: {
      degreeAwarded: "4-Year B.E. (Hons.) or 5-Year Integrated M.Sc. (Econ/Math/Physics) + B.E. Dual Degree",
      topColleges: "BITS Pilani (Pilani Campus), BITS Pilani K.K. Birla Goa Campus, BITS Pilani Hyderabad Campus",
      feesVsRoi: "INR 24–28 Lakhs total 4-year cost (merit-cum-need scholarships cover 15%–100% tuition) vs INR 18–30 LPA placements in tech/finance."
    },
    timeline: {
      years0to2: "SDE-1, Investment Banking/FinTech Analyst, Product Analyst, or Core Electronics Engineer via 6-month Practice School-2 (INR 15–28 LPA).",
      years3to6: "Product Manager, Senior Software Architect, SaaS Founder, or top Global/IIM MBA admit (INR 28–60 LPA).",
      years7to10Plus: "Startup Founder (BITS has one of India's highest unicorn founder ratios), Engineering Director, or Partner (INR 70 LPA – INR 1.8 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Balanced & Autonomous (Zero-attendance policy rewards self-directed builders and entrepreneurs)",
      stressLevel: "Moderate-High (Fast exam pacing + higher tuition investment)",
      whoThrives: "Self-starters who want autonomy, entrepreneurial exposure, and strong industry internships without rigid rote attendance.",
      whoShouldAvoid: "Students who struggle with high-speed accuracy or whose families cannot comfortably finance private tuition without heavy loans."
    }
  },
  {
    id: "iiith-ugee",
    name: "IIIT-H UGEE (Dual Degree Research)",
    streamCategory: "PCM",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Engineering & Tech",
    conductingBody: "IIIT Hyderabad",
    degree: "B.Tech + Master of Science (MS) by Research (5-Year)",
    roiBadge: "Elite AI/CS ROI",
    roiTone: "emerald",
    summary: "Specialized entrance combining speed (SUPR) and analytical linguistics/logic (REAP) plus interview for India's top AI & CS research campus.",
    traits: {
      "Analytical & Tech": 99,
      "Clinical & Healthcare": 5,
      "Pure Science & Research": 88,
      "Management & Strategy": 45,
      "Design & Spatial Creativity": 48,
      "Law, Policy & Defence": 15
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with Physics, Chemistry & Mathematics (no rigid 75% board cutoff required to sit for UGEE).",
      pattern: "Two CBT sections: SUPR (60 mins subject proficiency) + REAP (120 mins research aptitude, logic & linguistics), followed by faculty interview.",
      conductingBody: "International Institute of Information Technology, Hyderabad",
      targetScore: "Top ~250 shortlisted in SUPR+REAP combined score, followed by strong conceptual clarity in the 1-on-1 faculty interview."
    },
    campusReality: {
      degreeAwarded: "5-Year Dual Degree: B.Tech in CSE/ECE + MS by Research (Computational Linguistics, AI, Robotics, or CS)",
      topColleges: "IIIT Hyderabad (Gachibowli Campus)",
      feesVsRoi: "INR 18–20 Lakhs total 5-year tuition/hostel vs INR 26–36 LPA average CSE/AI research placements (comparable to top-3 IITs)."
    },
    timeline: {
      years0to2: "Applied AI/ML Research Engineer, Systems Engineer, or Robotics Developer at global AI labs and Big Tech (INR 22–40 LPA).",
      years3to6: "Senior Research Scientist, PhD Fellow at Carnegie Mellon/Stanford/UIUC, or AI Infrastructure Lead (INR 40–80 LPA).",
      years7to10Plus: "Principal AI Scientist, Deep-Tech Founder, or Head of Research at global frontier AI labs (INR 90 LPA – INR 2.5 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Intense Academic & Coding Culture (Heavy project and thesis workload from Year 2 onwards)",
      stressLevel: "High Academic Rigor",
      whoThrives: "Deep coders, AI/math enthusiasts, and students who prefer building software and publishing papers over large campus fests.",
      whoShouldAvoid: "Students looking for a relaxed college lifestyle or wanting non-CS core branches."
    }
  },
  {
    id: "viteee-cets",
    name: "VITEEE / MET / COMEDK & State CETs",
    streamCategory: "PCM",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Engineering & Tech",
    conductingBody: "VIT, Manipal, COMEDK, MHT-CET, WBJEE & KCET Boards",
    degree: "B.Tech / B.E. (CSE, AI/DS, ECE, Core Engineering)",
    roiBadge: "Smart Target ROI",
    roiTone: "amber",
    summary: "Essential high-value target exams unlocking top state government colleges (COEP, VJTI, Jadavpur, RVCE) and premier private universities.",
    traits: {
      "Analytical & Tech": 88,
      "Clinical & Healthcare": 5,
      "Pure Science & Research": 52,
      "Management & Strategy": 62,
      "Design & Spatial Creativity": 40,
      "Law, Policy & Defence": 15
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with PCM (minimum 45%–60% depending on state/university; domicile benefits apply in MHT-CET, WBJEE, KCET).",
      pattern: "Speed-focused NCERT/State-board level MCQs without negative marking in MHT-CET/KCET/VITEEE; speed is decisive.",
      conductingBody: "State CET Cells & Private University Examination Boards",
      targetScore: "99+ percentile in MHT-CET (COEP/VJTI), Top 500 rank in WBJEE (Jadavpur Univ), or Top 1,000 in COMEDK (RVCE/BMSCE)."
    },
    campusReality: {
      degreeAwarded: "4-Year B.Tech / B.E.",
      topColleges: "Jadavpur University, COEP Pune, VJTI Mumbai, RVCE Bengaluru, Manipal (MIT), VIT Vellore, SSN Chennai",
      feesVsRoi: "INR 1–6 Lakhs total at State Govt colleges (Jadavpur/COEP/VJTI — unbeatable ROI!) or INR 14–22 Lakhs at Manipal/VIT vs INR 8–18 LPA."
    },
    timeline: {
      years0to2: "Software Developer, Cloud/DevOps Engineer, Embedded Systems Engineer, or Business Analyst (INR 7–16 LPA; INR 15+ LPA in top CS).",
      years3to6: "Senior Engineer, Tech Consultant, or MBA (CAT/GMAT) / MS in US/Europe pivot (INR 18–38 LPA).",
      years7to10Plus: "Engineering Manager, Solutions Architect, Product Director, or IT Services/SaaS Leader (INR 40–90 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Balanced (Depends heavily on self-driven coding, hackathons, and internship hustle outside syllabus)",
      stressLevel: "Low-Moderate Exam Stress",
      whoThrives: "Pragmatic builders who use high-ROI state colleges or tech-hub cities (Bengaluru/Pune/Mumbai) to launch strong tech careers.",
      whoShouldAvoid: "Students who rely passively on campus brand alone without building personal coding or project portfolios."
    }
  },
  {
    id: "nata-jee-arch",
    name: "NATA & JEE Main Paper 2 (B.Arch)",
    streamCategory: "PCM",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Design & Architecture",
    conductingBody: "Council of Architecture (NATA) & NTA (JEE Paper 2A)",
    degree: "B.Arch (5-Year Bachelor of Architecture)",
    roiBadge: "Creative Studio ROI",
    roiTone: "amber",
    summary: "Gateway to SPA Delhi/Bhopal/Vijayawada, IIT Kharagpur/Roorkee B.Arch, and CEPT Ahmedabad for sustainable urban and spatial design.",
    traits: {
      "Analytical & Tech": 62,
      "Clinical & Healthcare": 5,
      "Pure Science & Research": 35,
      "Management & Strategy": 58,
      "Design & Spatial Creativity": 97,
      "Law, Policy & Defence": 25
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with Physics, Chemistry & Mathematics (minimum 50% aggregate in PCM and overall boards).",
      pattern: "Tests Mathematics, General Aptitude (3D spatial visualization), and live Drawing/Composition skills (offline sketching + CBT).",
      conductingBody: "Council of Architecture (COA) & National Testing Agency (NTA)",
      targetScore: "145+ / 200 in NATA or 98.5+ percentile in JEE Paper 2A for SPA Delhi, CEPT Ahmedabad, and NIT Trichy/Calicut."
    },
    campusReality: {
      degreeAwarded: "5-Year Bachelor of Architecture (B.Arch) with COA Registration",
      topColleges: "SPA Delhi, IIT Kharagpur, IIT Roorkee, CEPT Ahmedabad, NIT Trichy, Sir J.J. College of Architecture Mumbai",
      feesVsRoi: "INR 4–12 Lakhs at SPAs/NITs/IITs (INR 16L at CEPT) vs INR 5–9 LPA starting studio salaries (grows sharply post-Masters/own practice)."
    },
    timeline: {
      years0to2: "Junior Architect, Urban Design Associate, BIM/Computational Design Specialist, or Interior Spatial Designer (INR 5–9 LPA).",
      years3to6: "Project Architect, M.Arch / Urban Planning / Real Estate Finance pivot, or UX/Spatial Computing Designer (INR 12–24 LPA).",
      years7to10Plus: "Principal Architect (own design studio), Urban Infrastructure Consultant, or Real Estate Development Head (INR 25–75 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Demanding Studio Hours (Late-night model making in college and client deadlines in early practice)",
      stressLevel: "Moderate Exam / High Studio Workload",
      whoThrives: "Visual thinkers who love sketching, built environments, sustainability, and seeing physical spaces come alive.",
      whoShouldAvoid: "Students expecting immediate high starting corporate salaries right after graduation without patience for craft mastery."
    }
  },
  {
    id: "isi-cmi",
    name: "ISI & CMI Entrance (B.Stat / B.Math)",
    streamCategory: "PCM",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Pure Research & Space",
    conductingBody: "Indian Statistical Institute & Chennai Mathematical Institute",
    degree: "B.Stat (Hons.) / B.Math (Hons.) / B.Sc. Math & CS",
    roiBadge: "Zero-Fee Quant ROI",
    roiTone: "emerald",
    summary: "Olympiad-level mathematics entrance for India's premier statistics, data science, and quantitative finance powerhouses.",
    traits: {
      "Analytical & Tech": 99,
      "Clinical & Healthcare": 5,
      "Pure Science & Research": 96,
      "Management & Strategy": 64,
      "Design & Spatial Creativity": 25,
      "Law, Policy & Defence": 10
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with Mathematics and English (INMO/RMO awardees often receive direct interview waivers).",
      pattern: "Two-part written exam: Part A (Objective MCQ Mathematics) + Part B (Subjective proof-writing & Olympiad-style problem solving).",
      conductingBody: "ISI Kolkata/Bengaluru & Chennai Mathematical Institute",
      targetScore: "Top ~120 nationwide across subjective proof evaluation; requires deep comfort with combinatorics, number theory, and calculus."
    },
    campusReality: {
      degreeAwarded: "3-Year B.Stat (Hons.) / B.Math (Hons.) at ISI or B.Sc. (Hons.) Mathematics & Computer Science at CMI",
      topColleges: "ISI Kolkata (B.Stat), ISI Bengaluru (B.Math), Chennai Mathematical Institute (CMI)",
      feesVsRoi: "Zero tuition fees + monthly stipend at ISI (INR 6–9L total at CMI) vs INR 20–32 LPA median placements after M.Stat/M.Sc."
    },
    timeline: {
      years0to2: "Typically followed by 2-year M.Stat/M.Sc. at ISI/CMI or direct Data Scientist / Quantitative Analyst roles (INR 18–32 LPA).",
      years3to6: "Quantitative Researcher at global hedge funds, Senior ML Scientist, or PhD Fellow at Princeton/Harvard/Oxford (INR 35–85 LPA).",
      years7to10Plus: "Managing Director in Quant Finance, Chief Data Scientist, or Tenured Mathematics/Statistics Professor (INR 90 LPA – INR 3 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Intellectual & Focused (Small, tight-knit cohorts of ~60 students with intense mathematical depth)",
      stressLevel: "Extreme Conceptual Depth",
      whoThrives: "Pure math lovers and Olympiad solvers who relish writing rigorous mathematical proofs over memorizing formulas.",
      whoShouldAvoid: "Students who prefer applied engineering hardware or large conventional campus social scenes."
    }
  },
  {
    id: "imu-cet",
    name: "IMU-CET & Merchant Navy Sponsorship",
    streamCategory: "PCM",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Defence, Aviation & Maritime",
    conductingBody: "Indian Maritime University (Ministry of Ports & Shipping)",
    degree: "B.Sc. Nautical Science / B.Tech Marine Engineering / DNS",
    roiBadge: "Tax-Free Global ROI",
    roiTone: "emerald",
    summary: "Direct gateway to seafaring officer careers on international cargo, LNG, and cruise vessels with rapid tax-free dollar earnings.",
    traits: {
      "Analytical & Tech": 78,
      "Clinical & Healthcare": 10,
      "Pure Science & Research": 35,
      "Management & Strategy": 68,
      "Design & Spatial Creativity": 25,
      "Law, Policy & Defence": 84
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with PCM (minimum 60% aggregate in PCM and 50% in English) + strict DG Shipping medical & 6/6 eyesight standards.",
      pattern: "200 MCQs in 3 hours covering Physics, Chemistry, Mathematics, English, General Knowledge & Aptitude; always secure company sponsorship first.",
      conductingBody: "Indian Maritime University (IMU) & Shipping Line Sponsorship Boards",
      targetScore: "Top 1,500 AIR in IMU-CET + sponsorship selection from Anglo-Eastern, Fleet Management, Synergy, or Great Eastern."
    },
    campusReality: {
      degreeAwarded: "3-Year B.Sc. Nautical Science, 4-Year B.Tech Marine Engineering, or 1-Year Diploma in Nautical Science (DNS)",
      topColleges: "Tolani Maritime Institute (TMI), Anglo-Eastern Maritime Academy, IMU Navi Mumbai (TS Chanakya), IMU Kolkata (DMET)",
      feesVsRoi: "INR 8–18 Lakhs total cadet training fees vs INR 8–14 LPA starting Junior Officer pay (NRI tax-free status after 183 days at sea)."
    },
    timeline: {
      years0to2: "Deck Cadet / Junior Marine Engineer completing sea-time and Competency (CoC) exams (INR 6–15 LPA tax-free).",
      years3to6: "Second Officer / Third Engineer progressing to Chief Officer / Second Engineer on global vessels (INR 24–48 LPA tax-free).",
      years7to10Plus: "Master Mariner (Captain) / Chief Engineer (INR 65 LPA – INR 1.1 Cr tax-free) or onshore Fleet Manager / Maritime Arbitrator."
    },
    lifestyleVerdict: {
      workLifeBalance: "Rotational (4–6 months continuous at sea followed by 3–4 months completely free paid vacation ashore)",
      stressLevel: "High Operational Responsibility",
      whoThrives: "Adventurous, disciplined, mentally resilient individuals who want rapid financial independence and global travel.",
      whoShouldAvoid: "Students prone to seasickness, homesickness during long voyages, or needing daily urban social life."
    }
  },
  {
    id: "dgca-cpl-pilot",
    name: "DGCA CPL / Airline Cadet Pilot Program",
    streamCategory: "PCM",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Defence, Aviation & Maritime",
    conductingBody: "DGCA India & Airline Cadet FTOs (IndiGo, Air India)",
    degree: "Commercial Pilot License (CPL) + Multi-Engine & Type Rating",
    roiBadge: "High-Capital / High-Pay",
    roiTone: "amber",
    summary: "Structured flight-training pathway to become a commercial airline First Officer and Captain amid India's massive aircraft fleet expansion.",
    traits: {
      "Analytical & Tech": 80,
      "Clinical & Healthcare": 10,
      "Pure Science & Research": 30,
      "Management & Strategy": 62,
      "Design & Spatial Creativity": 35,
      "Law, Policy & Defence": 82
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with Physics & Mathematics (51%+ marks) + DGCA Class 1 Medical Fitness clearance.",
      pattern: "Airline Cadet selection (COMPASS/CUT-E psychometric & simulator tests + interview) + 6 DGCA theory exams + 200 hours flying.",
      conductingBody: "Directorate General of Civil Aviation (DGCA) & Airline Partner FTOs",
      targetScore: "Pass all 6 DGCA papers (70%+ each) + clear Airline Cadet selection (IndiGo Cadet / Air India Cadet) for conditional LOI."
    },
    campusReality: {
      degreeAwarded: "Commercial Pilot License (CPL) + Instrument Rating + A320 / B737 Type Rating (18–24 months training)",
      topColleges: "IndiGo Cadet Pilot Program (CAE/Chimes/Garuda), Air India Cadet Program, IGRUA Amethi, NFTI Gondia",
      feesVsRoi: "INR 55–95 Lakhs upfront capital investment (Cadet Programs cost INR 85–95L) vs INR 18–30 LPA starting Junior First Officer pay."
    },
    timeline: {
      years0to2: "Junior First Officer / First Officer flying domestic & regional routes on Airbus A320 or Boeing 737 (INR 18–32 LPA).",
      years3to6: "Senior First Officer accumulating 2,500+ flying hours and preparing for ATPL command upgrade (INR 36–55 LPA).",
      years7to10Plus: "Airline Captain / Type Rating Instructor (TRI) / Examiner flying wide-body international routes (INR 75 LPA – INR 1.4 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Roster-Driven (Fixed monthly flying caps of ~80–90 hrs, irregular circadian hours, zero office desk work)",
      stressLevel: "High Training Cost / Safety Precision",
      whoThrives: "Calm, checklist-driven decision-makers with high spatial awareness and family financial backing for flight training.",
      whoShouldAvoid: "Students who cannot afford INR 60–95L without crippling debt or who have disqualifying vision/medical conditions."
    }
  },
  {
    id: "nda-navy-af-tes",
    name: "UPSC NDA (Navy & Air Force) & Army TES",
    streamCategory: "PCM",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Defence, Aviation & Maritime",
    conductingBody: "Union Public Service Commission (UPSC) & Indian Army",
    degree: "B.Tech (INA Ezhimala / CME / MCTE / MCEME) + Officer Commission",
    roiBadge: "Zero-Fee Prestige",
    roiTone: "emerald",
    summary: "Become a Commissioned Gazetted Officer in the Indian Air Force, Indian Navy, or Indian Army Technical Corps straight after Class 12.",
    traits: {
      "Analytical & Tech": 82,
      "Clinical & Healthcare": 15,
      "Pure Science & Research": 42,
      "Management & Strategy": 78,
      "Design & Spatial Creativity": 30,
      "Law, Policy & Defence": 98
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with PCM (unmarried candidates aged 16.5–19.5 yrs; JEE Main score required for Army 10+2 TES & Navy B.Tech).",
      pattern: "NDA: Written Exam (Maths 300 + GAT 600 marks) + 5-day SSB Psychological/GTO/Interview + CPSS (for Flying) + Medicals.",
      conductingBody: "UPSC (NDA & NA) & Directorate General of Recruiting (Indian Army/Navy)",
      targetScore: "365–385+ / 900 in UPSC NDA Written (with 25% sectional cutoff) + 710+ / 1800 Final (Written + SSB); Top 2.5L JEE Main rank for Army TES."
    },
    campusReality: {
      degreeAwarded: "4-Year B.Tech Degree (JNU / AICTE accredited) + Permanent Commission as Sub-Lieutenant / Flying Officer / Lieutenant",
      topColleges: "National Defence Academy (Khadakwasla), Indian Naval Academy (Ezhimala), Air Force Academy (Dundigal), CME Pune",
      feesVsRoi: "100% Government funded (Zero fees + monthly cadet stipend) vs INR 11–14 LPA starting CTC plus housing, medical, and lifelong pension."
    },
    timeline: {
      years0to2: "Lieutenant / Sub-Lieutenant / Flying Officer leading technical squadrons, warships, or fighter/transport aircraft (INR 11–15 LPA + perks).",
      years3to6: "Captain / Major / Lieutenant Commander / Squadron Leader commanding specialized engineering or operational units (INR 16–24 LPA + perks).",
      years7to10Plus: "Lieutenant Colonel / Wing Commander / Commander and higher military command or DRDO/Defence Tech leadership (INR 28–45 LPA + perks)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Mission-First & Regimental (Unmatched camaraderie, adventure, and social respect; frequent postings across India)",
      stressLevel: "High Physical & SSB Selection Rigor",
      whoThrives: "Patriotic, physically active, emotionally resilient leaders who value honor, discipline, and service above corporate paychecks.",
      whoShouldAvoid: "Students seeking remote/corporate desk jobs, fixed city residence, or purely monetary maximization."
    }
  },
  {
    id: "neet-ug",
    name: "NEET-UG (MBBS, BDS, BAMS, BHMS & BVSc)",
    streamCategory: "PCB",
    eligibleStreams: ["PCMB", "PCB"],
    domain: "Medicine & Allied Health",
    conductingBody: "National Testing Agency (NTA) & NMC / MCC",
    degree: "MBBS / BDS / BAMS / BHMS / B.V.Sc. & A.H.",
    roiBadge: "High Clinical Authority",
    roiTone: "emerald",
    summary: "India's single national medical entrance for 1.1+ lakh MBBS seats across AIIMS, JIPMER, state GMCs, and allied medical councils.",
    traits: {
      "Analytical & Tech": 52,
      "Clinical & Healthcare": 99,
      "Pure Science & Research": 74,
      "Management & Strategy": 45,
      "Design & Spatial Creativity": 25,
      "Law, Policy & Defence": 25
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with Physics, Chemistry & Biology/Biotechnology (minimum 50% PCB for GEN, 40% for OBC/SC/ST; minimum age 17 years).",
      pattern: "180 compulsory MCQs (720 marks, 3 hrs, pen-and-paper): Biology (360), Physics (180), Chemistry (180) based strictly on NCERT.",
      conductingBody: "National Testing Agency (NTA)",
      targetScore: "AIIMS/Top GMC: 675–705 (GEN), 665+ (OBC), 615+ (SC), 590+ (ST); AIQ Govt MBBS Closing: 525–652 (GEN/OBC), 439–553 (SC), 425–527 (ST)."
    },
    campusReality: {
      degreeAwarded: "5.5-Year MBBS (4.5 yrs academics + 1 yr compulsory rotating internship) or BDS / BAMS / BVSc",
      topColleges: "AIIMS New Delhi, VMMC & Safdarjung, MAMC Delhi, JIPMER Puducherry, KGMU Lucknow, CMC Vellore, Seth GS Mumbai",
      feesVsRoi: "INR 50,000 – INR 4 Lakhs total in Govt Medical Colleges (INR 65L–1.1 Cr in Private Deemed!) vs INR 9–14 LPA post-MBBS Junior Resident pay."
    },
    timeline: {
      years0to2: "Junior Resident Doctor / Medical Officer while preparing for NEET-PG / INI-CET residency (INR 9–14 LPA).",
      years3to6: "MD/MS Residency (Radiology, Dermatology, Medicine, Surgery, Pediatrics) earning stipend + emerging specialist pay (INR 14–32 LPA).",
      years7to10Plus: "DM/MCh Super-Specialist, Senior Hospital Consultant, or Independent Clinic/Diagnostic Owner (INR 40 LPA – INR 1.5 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Demanding & Long Runway (8–11 years of study/residency before peak earnings, followed by immense respect & stability)",
      stressLevel: "Extreme Exam Competition (24L+ applicants)",
      whoThrives: "Deeply empathetic, resilient students with high stamina who genuinely love clinical patient care and human biology.",
      whoShouldAvoid: "Students chasing quick 4-year money or unwilling to take private loans if Govt MBBS cutoff is missed."
    }
  },
  {
    id: "aiims-nursing-paramedical",
    name: "AIIMS B.Sc. Nursing & Paramedical",
    streamCategory: "PCB",
    eligibleStreams: ["PCMB", "PCB"],
    domain: "Medicine & Allied Health",
    conductingBody: "AIIMS New Delhi (Examination Section)",
    degree: "B.Sc. (Hons.) Nursing / B.Sc. Optometry, Radiology & OT Tech",
    roiBadge: "High Global Demand ROI",
    roiTone: "emerald",
    summary: "High-value clinical healthcare programs at AIIMS campuses leading to prestigious Nursing Officer (NORCET) or global healthcare careers.",
    traits: {
      "Analytical & Tech": 48,
      "Clinical & Healthcare": 95,
      "Pure Science & Research": 58,
      "Management & Strategy": 45,
      "Design & Spatial Creativity": 25,
      "Law, Policy & Defence": 25
    },
    blueprint: {
      eligibleStreamsText: "Class 12 Science with any 3 of Physics, Chemistry, Mathematics, Biology (60% aggregate for GEN/OBC; 55% for SC/ST/PwD).",
      pattern: "60 MCQs in 3 hours (240 marks): 15 questions each from Physics, Chemistry, Mathematics, and Biology (attempt all 4 sections).",
      conductingBody: "Indian Institutes of Science Education and Research (IISER)",
      targetScore: "Out of 240: IISc 205+ (GEN) / 155+ (SC); IISER Pune 150–160 (GEN), 130+ (OBC), 95+ (SC), 80+ (ST); Berhampur/Tirupati 110+ (GEN), 65+ (SC/ST)."
    },
    campusReality: {
      degreeAwarded: "4-Year B.Sc. (Hons.) Nursing or 3–4 Year B.Sc. Paramedical (Radiology, Optometry, Operation Theatre Tech)",
      topColleges: "AIIMS New Delhi, AIIMS Jodhpur, AIIMS Bhubaneswar, AIIMS Rishikesh, PGIMER Chandigarh, CMC Vellore",
      feesVsRoi: "Under INR 15,000 total fees at AIIMS (virtually free + monthly stipend) vs INR 8.5–11 LPA starting AIIMS Nursing Officer (NORCET) pay."
    },
    timeline: {
      years0to2: "Nursing Officer (Group B Gazetted level via AIIMS NORCET) or Clinical Radiology/Cardiac Technologist (INR 6–11 LPA).",
      years3to6: "Senior Nursing Officer, M.Sc. Critical Care Specialist, or International Registered Nurse in UK (NHS)/Germany/Australia (INR 14–45 LPA).",
      years7to10Plus: "Chief Nursing Superintendent, Hospital Operations Director, or Senior Global Healthcare Specialist (INR 22–65 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Shift-Based Clinical Care (Structured 8-hour hospital shifts with strong job security and high international mobility)",
      stressLevel: "Moderate Exam / Hands-on Clinical Care",
      whoThrives: "Compassionate, practical students seeking zero-debt clinical careers with fast employability in India or abroad.",
      whoShouldAvoid: "Students uncomfortable with hospital wards, patient care shifts, or clinical procedures."
    }
  },
  {
    id: "bpharm-pharmd-bpt",
    name: "State B.Pharm / Pharm.D / BPT (Physiotherapy)",
    streamCategory: "PCB",
    eligibleStreams: ["PCMB", "PCB"],
    domain: "Medicine & Allied Health",
    conductingBody: "State CET Cells (MHT-CET, KCET, WBJEE) & University Boards",
    degree: "B.Pharm (4-Yr) / Pharm.D (6-Yr) / BPT Physiotherapy (4.5-Yr)",
    roiBadge: "Steady Healthcare ROI",
    roiTone: "amber",
    summary: "Practical healthcare pathways into pharmaceutical R&D, regulatory affairs, sports rehabilitation, and independent physiotherapy clinics.",
    traits: {
      "Analytical & Tech": 55,
      "Clinical & Healthcare": 88,
      "Pure Science & Research": 72,
      "Management & Strategy": 62,
      "Design & Spatial Creativity": 30,
      "Law, Policy & Defence": 20
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams (PCMB, PCM, PCB, Commerce, Arts) with minimum 60% in Class 10 & 12 (55% for SC/ST/PwD).",
      pattern: "IPMAT Indore: Quantitative Ability (MCQ + Short Answer) + Verbal Ability (120 mins, 360 marks) + Personal Interview.",
      conductingBody: "IIM Indore, IIM Rohtak, and NTA (for IIM Jammu & IIM Bodh Gaya)",
      targetScore: "IPMAT Indore (/360): GEN 178–205, OBC 126–145, SC 92–110, ST 68–85; IIM Rohtak (/480): GEN 381, OBC 297, SC 230, ST 138."
    },
    campusReality: {
      degreeAwarded: "4-Year B.Pharm, 6-Year Doctor of Pharmacy (Pharm.D), or 4.5-Year Bachelor of Physiotherapy (BPT)",
      topColleges: "ICT Mumbai, Jamia Hamdard, Manipal College of Pharmaceutical Sciences, NIPER (for M.Pharm), Seth GS / CMC Vellore (BPT)",
      feesVsRoi: "INR 2–8 Lakhs total fees vs INR 4.5–8 LPA starting roles (scales strongly after NIPER M.Pharm, Pharma MBA, or own sports/ortho clinic)."
    },
    timeline: {
      years0to2: "Clinical Pharmacist, Pharmacovigilance Associate, Formulation Analyst, or Hospital/Sports Physiotherapist (INR 4.5–8 LPA).",
      years3to6: "M.Pharm (NIPER), MBA in Pharmaceutical Management, MPT Sports Rehab, or Clinical Research Lead (INR 12–24 LPA).",
      years7to10Plus: "Regulatory Affairs Director, Pharma R&D Head, or Multi-Center Physiotherapy & Rehab Clinic Founder (INR 25–60 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Balanced & Predictable (Regular pharma corporate hours or flexible appointment-based physiotherapy practice)",
      stressLevel: "Low-Moderate Exam Pressure",
      whoThrives: "PCB students interested in drug chemistry, rehabilitation biomechanics, or healthcare business without NEET drop-year stress.",
      whoShouldAvoid: "Students expecting immediate INR 15+ LPA corporate packages directly after an undergraduate B.Pharm/BPT without specialization."
    }
  },
  {
    id: "icar-aieea",
    name: "ICAR AIEEA / CUET (Agriculture & Food Tech)",
    streamCategory: "PCB",
    eligibleStreams: ["PCMB", "PCB"],
    domain: "Pure Research & Space",
    conductingBody: "NTA & Indian Council of Agricultural Research (ICAR)",
    degree: "B.Sc. (Hons.) Agriculture / Forestry / B.Tech Food & Dairy Tech",
    roiBadge: "Agri-Tech & Govt ROI",
    roiTone: "emerald",
    summary: "Gateway to India's top Agricultural Universities (IARI, PAU, GBPUAT) for agri-biotech, food science, banking, and civil/forest services.",
    traits: {
      "Analytical & Tech": 56,
      "Clinical & Healthcare": 45,
      "Pure Science & Research": 84,
      "Management & Strategy": 66,
      "Design & Spatial Creativity": 30,
      "Law, Policy & Defence": 52
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams (PCMB, PCM, PCB, Commerce, Arts) with minimum 45% aggregate (40% for SC/ST; no upper age limit).",
      pattern: "Comprehension-based 120 MCQs in 2 hours covering English, Current Affairs/GK, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.",
      conductingBody: "Consortium of National Law Universities (CLAT) & NLU Delhi (AILET)",
      targetScore: "CLAT (/120): Top 3 NLUs GEN 95–98, OBC 88–93, SC 78–85, ST 72–80; Tier-2/3 NLUs GEN 76–86, OBC 68–78, SC 58–68, ST 52–62."
    },
    campusReality: {
      degreeAwarded: "4-Year Professional B.Sc. (Hons.) Agriculture / Horticulture / Forestry or B.Tech Food Technology",
      topColleges: "IARI New Delhi, PAU Ludhiana, GBPUAT Pantnagar, TNAU Coimbatore, UAS Bengaluru, NDRI Karnal",
      feesVsRoi: "INR 80,000 – INR 2.5 Lakhs total 4-year government fees vs INR 6–11 LPA in Agri-Business, Food Tech, or NABARD/IBPS AFO."
    },
    timeline: {
      years0to2: "Agri-Tech Product Specialist, Food Quality Scientist, NABARD/Bank Agriculture Officer, or Seed/Biotech R&D Associate (INR 6–11 LPA).",
      years3to6: "MBA in Food & Agribusiness (IIM Ahmedabad FABM / IRMA), M.Sc./PhD in Plant Genetics, or Indian Forest Service (IFoS) (INR 15–30 LPA).",
      years7to10Plus: "Agri-Enterprise VP, Global Food Supply Chain Head, Principal ICAR Scientist, or Senior Civil/Forest Officer (INR 30–70 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Balanced & Grounded (Blend of field/lab science, policy, and high-growth agri-business opportunities)",
      stressLevel: "Moderate Competition",
      whoThrives: "Biology lovers who enjoy applied environmental science, food innovation, and strong feeder pathways to IIM-A FABM or UPSC IFoS.",
      whoShouldAvoid: "Students strictly wanting urban hospital clinical settings or pure software development."
    }
  },
  {
    id: "iiser-iat",
    name: "IISER Aptitude Test (IAT — BS-MS & IISc)",
    streamCategory: "PCMB / Both Science",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Pure Research & Space",
    conductingBody: "IISER Joint Admissions Committee & IISc Bengaluru",
    degree: "5-Year BS-MS Dual Degree / 4-Year B.S. Research (IISc)",
    roiBadge: "Premier Research ROI",
    roiTone: "emerald",
    summary: "India's premier pure-science entrance for IISERs, IISc Bengaluru, and IIT Madras BS Medical Sciences—open equally to PCM, PCB, and PCMB.",
    traits: {
      "Analytical & Tech": 84,
      "Clinical & Healthcare": 58,
      "Pure Science & Research": 99,
      "Management & Strategy": 35,
      "Design & Spatial Creativity": 35,
      "Law, Policy & Defence": 15
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams (PCMB, PCM, PCB, Commerce, Arts; note IIT Guwahati/Hyderabad B.Des require PCM).",
      pattern: "UCEED: Part A (200 marks CBT spatial/visual logic) + Part B (100 marks live sketching). NID DAT: Prelims + Studio Test & Portfolio Interview.",
      conductingBody: "IIT Bombay (UCEED Office) & NID Admissions Cell",
      targetScore: "UCEED (/300): IIT Bombay/Delhi GEN 165–185 (Rank ≤41), OBC 145+, SC 115+, ST 100+; Part-A Qualifying: GEN ~70, OBC ~63, SC/ST ~35."
    },
    campusReality: {
      degreeAwarded: "5-Year Integrated BS-MS Dual Degree (Physics, Chemistry, Biology, Math, Earth/Data Sciences) or 4-Year B.S. at IISc",
      topColleges: "IISc Bengaluru, IISER Pune, IISER Kolkata, IISER Mohali, IISER Bhopal, IISER Thiruvananthapuram, IIT Madras",
      feesVsRoi: "INR 4–6 Lakhs total 5-year fees (INSPIRE/KVPY-equivalent fellowships available) with world-class lab infrastructure and global PhD admits."
    },
    timeline: {
      years0to2: "Fully funded PhD Fellows at Max Planck, MIT, Harvard, Cambridge, or R&D Data/Biotech Scientists in industry (INR 10–22 LPA / global stipends).",
      years3to6: "Postdoctoral Researcher, Computational Biologist, Quantum/Materials Scientist, or Pharma R&D Lead (INR 22–48 LPA).",
      years7to10Plus: "University Professor, Principal Investigator, Deep-Tech Biotech/Quantum Founder, or Chief Scientific Officer (INR 45 LPA – INR 1.3 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Intellectual & Self-Directed (High academic freedom, funded summer research abroad, and minimal corporate bureaucracy)",
      stressLevel: "Moderate-High Conceptual Rigor",
      whoThrives: "True science enthusiasts who ask 'why' behind every equation or cell pathway and aspire to global scientific leadership.",
      whoShouldAvoid: "Students seeking immediate high-paying campus placements right after graduation without pursuing research or specialized R&D."
    }
  },
  {
    id: "nest-niser",
    name: "NEST (NISER Bhubaneswar & UM-DAE CEBS)",
    streamCategory: "PCMB / Both Science",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Pure Research & Space",
    conductingBody: "Department of Atomic Energy (DAE), Govt. of India",
    degree: "5-Year Integrated M.Sc. (Physics, Chemistry, Bio, Math)",
    roiBadge: "DISHA Scholarship ROI",
    roiTone: "emerald",
    summary: "Direct gateway to Department of Atomic Energy research institutes offering INR 60,000/yr DISHA scholarships and BARC scientist interviews.",
    traits: {
      "Analytical & Tech": 82,
      "Clinical & Healthcare": 52,
      "Pure Science & Research": 98,
      "Management & Strategy": 30,
      "Design & Spatial Creativity": 30,
      "Law, Policy & Defence": 25
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams for the Army Wing of NDA (unmarried candidates aged 16.5–19.5 years; Pure Merit selection).",
      pattern: "UPSC Written Exam (Mathematics 300 + General Ability Test 600 marks) + 5-Day Services Selection Board (SSB) + Medical Board.",
      conductingBody: "Union Public Service Commission (UPSC) & Ministry of Defence",
      targetScore: "365–385+ / 900 in NDA Written (minimum 25% in Math & GAT) + 710+ / 1800 Final (Written + SSB)."
    },
    campusReality: {
      degreeAwarded: "5-Year Integrated M.Sc. in Biological, Chemical, Mathematical, or Physical Sciences",
      topColleges: "NISER Bhubaneswar (Jatni Campus), UM-DAE Centre for Excellence in Basic Sciences (Mumbai)",
      feesVsRoi: "INR 1.5 Lakhs total 5-year fees fully offset by INR 60,000/year DISHA scholarship + INR 20,000/year summer internship grant."
    },
    timeline: {
      years0to2: "Direct BARC Scientific Officer interview pathway (for high CGPA) or funded PhD at top US/European/Indian labs (INR 11–18 LPA).",
      years3to6: "Senior Scientific Officer (DAE/BARC/TIFR), Nuclear/Quantum Researcher, or Biotech R&D Scientist (INR 20–38 LPA).",
      years7to10Plus: "Senior Principal Scientist, National Lab Division Head, or Academic Faculty (INR 38–85 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Scholarly & Calm (Close mentorship by active DAE scientists and zero financial burden on parents)",
      stressLevel: "High Conceptual Exam Standard",
      whoThrives: "Deeply curious PCB or PCM students who want to master 3 science subjects without financial stress and pursue frontier science.",
      whoShouldAvoid: "Students focused on corporate sales, finance, or fast-track commercial management roles."
    }
  },
  {
    id: "iist-isro",
    name: "IIST (ISRO Space & Aerospace Engineering)",
    streamCategory: "PCMB / Both Science",
    eligibleStreams: ["PCMB", "PCM"],
    domain: "Pure Research & Space",
    conductingBody: "Indian Institute of Space Science & Technology (via JEE Adv)",
    degree: "B.Tech Aerospace / Avionics / Dual Degree Engineering Physics",
    roiBadge: "Direct ISRO Pathway",
    roiTone: "emerald",
    summary: "Asia's first Space University in Thiruvananthapuram offering direct absorption pathways as Scientist/Engineer 'SC' at ISRO centers.",
    traits: {
      "Analytical & Tech": 94,
      "Clinical & Healthcare": 5,
      "Pure Science & Research": 92,
      "Management & Strategy": 45,
      "Design & Spatial Creativity": 48,
      "Law, Policy & Defence": 55
    },
    blueprint: {
      eligibleStreamsText: "Class 12 with PCM (75% aggregate) + valid JEE Advanced score (requires Mathematics & Physics in Class 12).",
      pattern: "Admissions via dedicated IIST counseling rank list based on JEE Advanced marks (no separate written exam).",
      conductingBody: "IIST Thiruvananthapuram (Department of Space, Govt. of India)",
      targetScore: "JEE Advanced rank roughly within Top 8,000–12,000 (varies by year) + 7.5+ CGPA in college for ISRO absorption eligibility."
    },
    campusReality: {
      degreeAwarded: "4-Year B.Tech in Aerospace Engineering / Electronics & Communication (Avionics) or 5-Year Dual Degree Engineering Physics",
      topColleges: "Indian Institute of Space Science and Technology (IIST), Valiamala, Thiruvananthapuram",
      feesVsRoi: "Merit-based fee waivers (full tuition/hostel waiver for top JEE Advanced rankers) vs direct ISRO Scientist 'SC' or space-tech startup roles."
    },
    timeline: {
      years0to2: "ISRO Scientist/Engineer 'SC' (VSSC, URSC, SAC) or Private Space-Tech Propulsion/Satellite Engineer (INR 11–18 LPA).",
      years3to6: "Mission Systems Lead, Satellite Payload Architect, or MS/PhD in Aerospace at Caltech/MIT/TU Delft (INR 20–42 LPA).",
      years7to10Plus: "ISRO Project Director / Senior Space Scientist or Chief Technology Officer at commercial space ventures (INR 38–95 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Mission-Driven & Focused (Deep engineering satisfaction contributing directly to Chandrayaan, Gaganyaan, and Aditya missions)",
      stressLevel: "High JEE Advanced Entry Bar",
      whoThrives: "Space, propulsion, orbital mechanics, and satellite electronics enthusiasts dreaming of building rockets and spacecraft.",
      whoShouldAvoid: "Students without Class 12 Mathematics or those looking for pure software/consumer internet roles."
    }
  },
  {
    id: "cuet-science-biotech",
    name: "CUET-UG Science, Biotech & Forensics",
    streamCategory: "PCMB / Both Science",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Pure Research & Space",
    conductingBody: "NTA (Central & State Universities — DU, BHU, NFSU)",
    degree: "B.Sc. (Hons.) Biotechnology / Forensic Science / Life Sciences",
    roiBadge: "High-Access Govt ROI",
    roiTone: "emerald",
    summary: "Single entrance unlocking St. Stephen's, Hindu, Miranda House, BHU, and National Forensic Sciences University (NFSU).",
    traits: {
      "Analytical & Tech": 68,
      "Clinical & Healthcare": 72,
      "Pure Science & Research": 88,
      "Management & Strategy": 54,
      "Design & Spatial Creativity": 32,
      "Law, Policy & Defence": 48
    },
    blueprint: {
      eligibleStreamsText: "Class 12 Science (PCM, PCB, or PCMB) with minimum 50%–60% depending on university and honors major.",
      pattern: "CBT domain-specific tests (Physics, Chemistry, Biology/Maths + English) aligned strictly to Class 12 NCERT syllabus.",
      conductingBody: "National Testing Agency (NTA)",
      targetScore: "740+ / 800 (or 98+ percentile across 3 science domains + English) for North Campus DU (Hindu, Miranda, Hansraj) & BHU."
    },
    campusReality: {
      degreeAwarded: "3-Year or 4-Year B.Sc. (Hons.) in Biotechnology, Microbiology, Forensic Science, Biochemistry, Physics, or Statistics",
      topColleges: "Hindu College, Miranda House, St. Stephen's, Hansraj College (DU), Banaras Hindu University (BHU), NFSU Gandhinagar",
      feesVsRoi: "INR 30,000 – INR 1.2 Lakhs total 3-year fees at DU/BHU vs INR 6–12 LPA starting roles (massive springboard for CAT MBA or M.Sc.)."
    },
    timeline: {
      years0to2: "Biotech Lab Analyst, Forensic Examiner (NFSU), Data/Research Associate, or preparing for IIT-JAM / GAT-B / CAT (INR 5–10 LPA).",
      years3to6: "M.Sc. from IITs/TIFR/NCBS, IIM MBA (DU North Campus has huge IIM representation), or Clinical Genetics Specialist (INR 15–32 LPA).",
      years7to10Plus: "Biotech Product Lead, Forensic Lab Director, Management Consultant, or Academic Researcher (INR 32–80 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Balanced & Vibrant (Rich campus societies, low fee burden, and high flexibility to pivot into research, UPSC, or MBA)",
      stressLevel: "Moderate Board-Aligned Exam",
      whoThrives: "Science students who want top central university exposure, low fees, and freedom to choose between research, forensics, or MBA.",
      whoShouldAvoid: "Students expecting high-paying campus engineering placements directly after a 3-year general B.Sc. without post-graduation."
    }
  },
  {
    id: "ipmat-jipmat",
    name: "IPMAT (IIM Indore, Rohtak, Ranchi) & JIPMAT",
    streamCategory: "Open to All Streams",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Management & Business",
    conductingBody: "IIM Indore, IIM Rohtak & NTA (JIPMAT for Jammu/Bodh Gaya)",
    degree: "5-Year Integrated Programme in Management (IPM: BBA + MBA)",
    roiBadge: "Direct IIM Brand ROI",
    roiTone: "emerald",
    summary: "Enter an IIM straight after Class 12 without taking CAT—combining liberal foundation studies with an elite IIM MBA.",
    traits: {
      "Analytical & Tech": 76,
      "Clinical & Healthcare": 15,
      "Pure Science & Research": 28,
      "Management & Strategy": 98,
      "Design & Spatial Creativity": 48,
      "Law, Policy & Defence": 52
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams (PCMB, PCM, PCB, Commerce, Arts) with minimum 60% in Class 10 & 12.",
      pattern: "IPMAT Indore: Quantitative Ability (MCQ + Short Answer) + Verbal Ability (120 mins) + Personal Interview. Science students excel in Quant.",
      conductingBody: "IIM Indore, IIM Rohtak, and NTA (for IIM Jammu & IIM Bodh Gaya)",
      targetScore: "190+ / 360 in IPMAT Indore + strong Personal Interview; 310+ / 400 in JIPMAT."
    },
    campusReality: {
      degreeAwarded: "5-Year Integrated BBA + MBA (with optional exit after 3 years with a BBA degree)",
      topColleges: "IIM Indore, IIM Rohtak, IIM Ranchi, IIM Jammu, IIM Bodh Gaya, IIFT Kakinada",
      feesVsRoi: "INR 32–38 Lakhs total 5-year tuition/hostel vs INR 22–30 LPA average final MBA placements at IIM Indore/Ranchi."
    },
    timeline: {
      years0to2: "Management Consultant (MBB/Big 4), Investment Banking Analyst, Product Manager, or Brand Manager (INR 18–30 LPA).",
      years3to6: "Engagement Manager, Senior Product Manager, Venture Capital Associate, or Strategy Lead (INR 32–65 LPA).",
      years7to10Plus: "Consulting Partner, Chief Marketing/Strategy Officer, Private Equity Principal, or Funded Startup Founder (INR 75 LPA – INR 2 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Fast-Paced & Corporate (Case competitions, live corporate projects, and leadership networking from Year 1)",
      stressLevel: "Moderate-High Competition + Higher Fee Outlay",
      whoThrives: "Articulate Science students with strong quantitative aptitude who love business strategy, finance, and leadership over lab/code work.",
      whoShouldAvoid: "Students who dislike public speaking, corporate case-study pressure, or taking education loans for management tuition."
    }
  },
  {
    id: "npat-set-cuet-mgmt",
    name: "NPAT / SET / CUET-UG (DU BMS, BBA-FIA & Econ)",
    streamCategory: "Open to All Streams",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Management & Business",
    conductingBody: "NMIMS (NPAT), Symbiosis (SET) & NTA CUET (SSCBS, SRCC)",
    degree: "BMS / BBA (FIA) / B.A. (Hons.) Economics / B.Com (Hons.)",
    roiBadge: "Unbeatable SSCBS ROI",
    roiTone: "emerald",
    summary: "Premier undergraduate finance, economics, and management degrees at Shaheed Sukhdev (SSCBS), SRCC, NMIMS Mumbai, and Symbiosis Pune.",
    traits: {
      "Analytical & Tech": 78,
      "Clinical & Healthcare": 10,
      "Pure Science & Research": 32,
      "Management & Strategy": 96,
      "Design & Spatial Creativity": 42,
      "Law, Policy & Defence": 45
    },
    blueprint: {
      eligibleStreamsText: "Open to all streams (note: DU BMS, BBA-FIA, and B.A. Economics Hons require Mathematics/Applied Math in Class 12).",
      pattern: "CUET-UG (English + Mathematics + General Test) for SSCBS/DU; NPAT & SET test Quantitative Reasoning, Verbal, and Logical Aptitude.",
      conductingBody: "NTA (CUET), SVKM's NMIMS (NPAT), and Symbiosis International University (SET)",
      targetScore: "560+ / 650 in CUET combination for SSCBS Delhi; Top 1,200 merit rank in NPAT for NMIMS Mumbai."
    },
    campusReality: {
      degreeAwarded: "3-Year or 4-Year BMS / BBA (Financial Investment Analysis) / B.A. (Hons.) Economics",
      topColleges: "Shaheed Sukhdev College of Business Studies (SSCBS DU), SRCC, St. Stephen's (Econ), NMIMS Mumbai, Symbiosis Pune (SCMS)",
      feesVsRoi: "INR 90,000 total 3-year fees at SSCBS DU (INR 11–14L at NMIMS/Symbiosis) vs INR 11–22 LPA starting consulting/finance packages."
    },
    timeline: {
      years0to2: "Analyst at McKinsey/BCG/Bain, Goldman Sachs, Blackstone, or FinTech Product Analyst (INR 10–22 LPA).",
      years3to6: "IIM A/B/C MBA, Wharton/INSEAD MBA, CFA Charterholder, or Private Equity Associate (INR 28–60 LPA).",
      years7to10Plus: "Investment Director, Strategy Partner, CFO, or FinTech Founder (INR 70 LPA – INR 2 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "High-Energy Metro Campus Life (Located in Delhi/Mumbai/Pune financial hubs with intense internship culture)",
      stressLevel: "Moderate Exam / High Campus Hustle",
      whoThrives: "PCM/PCMB students who enjoy numbers, markets, and consulting and want a 3-year launchpad before an elite MBA.",
      whoShouldAvoid: "PCB students without Class 12 Mathematics (who should target IPMAT or BBA programs that do not mandate Class 12 Math)."
    }
  },
  {
    id: "clat-ailet",
    name: "CLAT & AILET (5-Year Integrated LLB at NLUs)",
    streamCategory: "Open to All Streams",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Law & Policy",
    conductingBody: "Consortium of NLUs (CLAT) & NLU Delhi (AILET)",
    degree: "B.A. LL.B. (Hons.) / B.Sc. LL.B. / BBA LL.B. (5-Year)",
    roiBadge: "Top Law Firm ROI",
    roiTone: "emerald",
    summary: "Entrance to NLSIU Bengaluru, NALSAR Hyderabad, NLU Delhi, and NUJS Kolkata for corporate law, tech/IP law, and litigation.",
    traits: {
      "Analytical & Tech": 62,
      "Clinical & Healthcare": 15,
      "Pure Science & Research": 32,
      "Management & Strategy": 76,
      "Design & Spatial Creativity": 35,
      "Law, Policy & Defence": 99
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams (PCMB, PCM, PCB, Commerce, Arts) with minimum 45% aggregate (no upper age limit).",
      pattern: "Comprehension-based 120 MCQs in 2 hours covering English, Current Affairs/GK, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.",
      conductingBody: "Consortium of National Law Universities (CLAT) & NLU Delhi (AILET)",
      targetScore: "95+ / 120 in CLAT (Top 100 AIR for NLSIU Bengaluru; Top 450 AIR for NALSAR, WBNUJS, NLU Jodhpur); Top 80 AIR in AILET."
    },
    campusReality: {
      degreeAwarded: "5-Year Integrated B.A. LL.B. (Hons.) or B.Sc. LL.B. (Tech/Health Law focus at select NLUs)",
      topColleges: "NLSIU Bengaluru, NALSAR Hyderabad, NLU Delhi, WBNUJS Kolkata, NLU Jodhpur, GNLU Gandhinagar",
      feesVsRoi: "INR 14–18 Lakhs total 5-year NLU fees vs INR 16–22 LPA starting Day-Zero Tier-1 Corporate Law Firm salaries."
    },
    timeline: {
      years0to2: "Corporate M&A / Capital Markets Associate at CAM/SAM/Khaitan/Trilegal, or Judicial Clerkship (INR 15–22 LPA).",
      years3to6: "Senior Associate, Tech/AI & Patent Law Specialist (huge edge for Science grads!), or Oxford BCL / Harvard LLM (INR 28–55 LPA).",
      years7to10Plus: "Equity Law Firm Partner, General Counsel (GC) of a Unicorn/MNC, or Senior Counsel at High Court/Supreme Court (INR 75 LPA – INR 2.5 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "High Intensity in Corporate M&A (Long deal hours rewarded by steep salary jumps; broader autonomy in policy/litigation)",
      stressLevel: "Moderate Reading-Intensive Exam",
      whoThrives: "Avid readers, sharp debaters, and Science students who want to dominate Tech, Patent, Pharma, or Corporate Law.",
      whoShouldAvoid: "Students who dislike heavy reading comprehension, dense legal drafting, or long hours during corporate deals."
    }
  },
  {
    id: "uceed-nid",
    name: "UCEED & NID DAT (Product, UX & Industrial Design)",
    streamCategory: "Open to All Streams",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Design & Architecture",
    conductingBody: "IIT Bombay (UCEED) & National Institute of Design (NID)",
    degree: "B.Des (Bachelor of Design — UX/UI, Product, Mobility)",
    roiBadge: "High Tech-Design ROI",
    roiTone: "emerald",
    summary: "Premier design entrances for IIT Bombay, IIT Delhi, IIT Guwahati, IIT Hyderabad, and NID Ahmedabad—open to all streams.",
    traits: {
      "Analytical & Tech": 74,
      "Clinical & Healthcare": 20,
      "Pure Science & Research": 35,
      "Management & Strategy": 64,
      "Design & Spatial Creativity": 99,
      "Law, Policy & Defence": 20
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams (PCMB, PCM, PCB, Commerce, Arts; note IIT Guwahati/Hyderabad B.Des prefer PCM).",
      pattern: "UCEED: Part A (200 marks CBT spatial/visual logic) + Part B (100 marks live sketching). NID DAT: Prelims + Studio Test & Portfolio Interview.",
      conductingBody: "IIT Bombay (UCEED Office) & NID Admissions Cell",
      targetScore: "Top 120 AIR in UCEED for IIT Bombay / IIT Delhi B.Des; Top 100 AIR in NID DAT Mains for NID Ahmedabad."
    },
    campusReality: {
      degreeAwarded: "4-Year Bachelor of Design (B.Des) in Interaction/UX Design, Industrial Design, Mobility, or Communication Design",
      topColleges: "IDC School of Design (IIT Bombay), IIT Delhi, IIT Guwahati, IIT Hyderabad, NID Ahmedabad, NID Bengaluru",
      feesVsRoi: "INR 9–15 Lakhs total 4-year fees vs INR 14–26 LPA median starting packages at Google, Microsoft, Apple, Atlassian, and design studios."
    },
    timeline: {
      years0to2: "Product Designer (UX/UI), Industrial/Hardware Designer, Design Technologist, or AR/VR Interaction Designer (INR 12–26 LPA).",
      years3to6: "Senior Product Designer, Design Systems Lead, or Human-Computer Interaction (HCI) Masters abroad (INR 26–52 LPA).",
      years7to10Plus: "VP of Design, Principal Product Designer, or Founder of a consumer hardware/digital design studio (INR 55 LPA – INR 1.5 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Creative & Collaborative (Studio-driven learning with zero rote memorization and high tech-industry demand)",
      stressLevel: "Moderate Exam / Portfolio-Driven",
      whoThrives: "Visual observers, empathetic problem-solvers, and Science students who love bridging human psychology, aesthetics, and technology.",
      whoShouldAvoid: "Students who prefer purely formulaic textbook answers over open-ended creative iteration."
    }
  },
  {
    id: "nift-bdes",
    name: "NIFT Entrance Exam (Fashion & Lifestyle Design)",
    streamCategory: "Open to All Streams",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Design & Architecture",
    conductingBody: "National Testing Agency (NTA) for NIFT Campuses",
    degree: "B.Des (Fashion, Accessory, Textile, Communication) / B.F.Tech",
    roiBadge: "Creative Brand ROI",
    roiTone: "amber",
    summary: "India's apex design and apparel technology institute (NIFT Delhi, Mumbai, Bengaluru) for luxury brands, retail UX, and fashion tech.",
    traits: {
      "Analytical & Tech": 48,
      "Clinical & Healthcare": 10,
      "Pure Science & Research": 22,
      "Management & Strategy": 72,
      "Design & Spatial Creativity": 96,
      "Law, Policy & Defence": 20
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams for B.Des (B.F.Tech Apparel Production requires Class 12 with PCM).",
      pattern: "Stage 1: CAT (Creative Ability Test — sketching/ideation) + GAT (General Ability Test). Stage 2: Hands-on 3D Situation Test.",
      conductingBody: "National Testing Agency (NTA) & NIFT Head Office",
      targetScore: "Common Merit Rank (CMR) under 350 for NIFT New Delhi, NIFT Mumbai, and NIFT Bengaluru."
    },
    campusReality: {
      degreeAwarded: "4-Year Bachelor of Design (B.Des) or Bachelor of Fashion Technology (B.F.Tech)",
      topColleges: "NIFT New Delhi, NIFT Mumbai, NIFT Bengaluru, NIFT Gandhinagar, NIFT Hyderabad",
      feesVsRoi: "INR 12–14 Lakhs total 4-year fees vs INR 5.5–10 LPA starting roles in luxury retail, D2C brands, and visual/UI design."
    },
    timeline: {
      years0to2: "Fashion/Accessory Designer, UI/Visual Brand Designer, Merchandising Planner, or Apparel Tech Engineer (INR 5.5–10 LPA).",
      years3to6: "Creative Lead, D2C Brand Category Head, or Masters at Parsons / Royal College of Art / Polimoda (INR 12–25 LPA).",
      years7to10Plus: "Creative Director, Luxury Retail VP, or Independent D2C Lifestyle Label Founder (INR 28–80 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Expressive & Trend-Driven (Hands-on prototyping, runway/brand showcases, and fast retail cycles)",
      stressLevel: "Moderate Exam / High Creative Output",
      whoThrives: "Expressive visual storytellers with strong aesthetic instincts and interest in consumer lifestyle or D2C brands.",
      whoShouldAvoid: "Students expecting immediate tier-1 tech salaries or disinterested in visual craft and consumer trends."
    }
  },
  {
    id: "nchmct-jee",
    name: "NCHMCT JEE (Hospitality & Luxury Management)",
    streamCategory: "Open to All Streams",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Management & Business",
    conductingBody: "NTA & National Council for Hotel Management (IHMs)",
    degree: "B.Sc. in Hospitality & Hotel Administration (3-Year)",
    roiBadge: "Global Hospitality ROI",
    roiTone: "amber",
    summary: "Gateway to IHM Pusa (Delhi), IHM Mumbai, and IHM Bengaluru for luxury hotel chains (Taj, Oberoi), aviation hospitality, and facility management.",
    traits: {
      "Analytical & Tech": 45,
      "Clinical & Healthcare": 25,
      "Pure Science & Research": 20,
      "Management & Strategy": 86,
      "Design & Spatial Creativity": 64,
      "Law, Policy & Defence": 35
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams (PCMB, PCM, PCB, Commerce, Arts) with English as a compulsory subject.",
      pattern: "200 MCQs in 3 hours covering Numerical Ability, Reasoning, General Knowledge, English, and Aptitude for Service Sector.",
      conductingBody: "National Testing Agency (NTA) & Ministry of Tourism",
      targetScore: "Top 500 All-India Rank for IHM Pusa (New Delhi), IHM Mumbai, and IHM Bengaluru."
    },
    campusReality: {
      degreeAwarded: "3-Year B.Sc. in Hospitality & Hotel Administration (with Management Trainee fast-tracks at Taj/Oberoi/Marriott)",
      topColleges: "IHM Pusa (New Delhi), IHM Mumbai, IHM Bengaluru, IHM Hyderabad, WGSHA Manipal",
      feesVsRoi: "INR 3.5–4.5 Lakhs total 3-year central IHM fees vs INR 4.5–8.5 LPA Management Trainee roles (plus rapid international cruise/resort mobility)."
    },
    timeline: {
      years0to2: "Management Trainee (OCLD/Taj/ITC), Guest Relations Executive, or Corporate Workplace Operations Lead (INR 4.5–8.5 LPA).",
      years3to6: "Rooms Division / F&B Manager, Luxury Retail Operations Manager, or International Resort Manager in Dubai/Maldives/Europe (INR 12–26 LPA).",
      years7to10Plus: "Hotel General Manager (GM), VP of Hospitality Operations, or Cloud-Kitchen / F&B Chain Founder (INR 30–75 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "People-Centric & Dynamic (Active floor leadership, global travel opportunities, and shift-based hospitality operations)",
      stressLevel: "Low-Moderate Exam Pressure",
      whoThrives: "Charismatic, organized, people-first communicators who enjoy luxury service operations and international mobility.",
      whoShouldAvoid: "Students who prefer quiet solo desk work or rigid Monday-to-Friday 9-to-5 schedules."
    }
  },
  {
    id: "upsc-nda-army",
    name: "UPSC NDA (Army Wing — Open to All Streams)",
    streamCategory: "Open to All Streams",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Defence, Aviation & Maritime",
    conductingBody: "Union Public Service Commission (UPSC) & SSB",
    degree: "B.A. / B.Sc. (JNU Degree at NDA Khadakwasla) + Army Officer",
    roiBadge: "Zero-Fee Officer ROI",
    roiTone: "emerald",
    summary: "Open to PCB, PCM, PCMB, Commerce, and Arts students to train at NDA Khadakwasla and IMA Dehradun as an Indian Army Commissioned Officer.",
    traits: {
      "Analytical & Tech": 62,
      "Clinical & Healthcare": 25,
      "Pure Science & Research": 32,
      "Management & Strategy": 80,
      "Design & Spatial Creativity": 25,
      "Law, Policy & Defence": 99
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams for the Army Wing of NDA (unmarried candidates aged 16.5–19.5 years).",
      pattern: "UPSC Written Exam (Mathematics 300 + General Ability Test 600 marks) + 5-Day Services Selection Board (SSB) + Medical Board.",
      conductingBody: "Union Public Service Commission (UPSC) & Ministry of Defence",
      targetScore: "400+ / 900 in NDA Written + SSB Recommendation (note: Class 12 Math paper is mandatory in the NDA written exam)."
    },
    campusReality: {
      degreeAwarded: "3-Year B.A. / B.Sc. / B.Sc. Computer Science (JNU Degree at NDA) + 1 Year at IMA Dehradun -> Lieutenant",
      topColleges: "National Defence Academy (NDA Khadakwasla, Pune) & Indian Military Academy (IMA Dehradun)",
      feesVsRoi: "100% Government funded (Zero fees + monthly stipend) vs INR 11–14 LPA starting CTC plus housing, rations, medical, and lifelong pension."
    },
    timeline: {
      years0to2: "Lieutenant leading an Infantry, Armoured, Artillery, or Special Forces platoon across diverse Indian terrains (INR 11–15 LPA + perks).",
      years3to6: "Captain / Major commanding companies, UN peacekeeping deployments, or Staff College specialization (INR 16–24 LPA + perks).",
      years7to10Plus: "Lieutenant Colonel / Colonel commanding a battalion, Defence Attaché abroad, or post-retirement corporate security/ops VP (INR 28–50 LPA+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Adventure, Duty & Brotherhood (Unmatched leadership responsibility at age 21; frequent transfers and field tenures)",
      stressLevel: "High SSB & Physical Selection Bar",
      whoThrives: "Courageous, team-oriented PCB/PCMB/PCM youth seeking an extraordinary life of outdoor leadership and national service.",
      whoShouldAvoid: "Students who dislike physical fitness training, strict hierarchy, or remote field postings."
    }
  },
  {
    id: "ashoka-krea-flame",
    name: "Ashoka / Krea / FLAME (Liberal Arts & Sciences)",
    streamCategory: "Open to All Streams",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Law & Policy",
    conductingBody: "Ashoka University, Krea University & FLAME Admissions",
    degree: "B.A. / B.Sc. (Hons.) Interdisciplinary (CS + Econ / Bio + Policy)",
    roiBadge: "Global Ivy-Feeder ROI",
    roiTone: "amber",
    summary: "Holistic US-style interdisciplinary universities allowing Science students to combine Computer Science or Biology with Economics, Policy, or Psychology.",
    traits: {
      "Analytical & Tech": 72,
      "Clinical & Healthcare": 38,
      "Pure Science & Research": 74,
      "Management & Strategy": 82,
      "Design & Spatial Creativity": 66,
      "Law, Policy & Defence": 88
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams; evaluated holistically on Class 10/12 marks, personal essays, On-the-Spot Essay, Aptitude Test, and Interview.",
      pattern: "Holistic admissions (AAT at Ashoka, Krea Immersive Case, FLAME FEAT) with early-decision rounds starting October–January.",
      conductingBody: "Ashoka University (Sonipat), Krea University (Sri City), FLAME University (Pune)",
      targetScore: "Strong academic consistency + thoughtful personal essays + sharp performance in the faculty panel interview."
    },
    campusReality: {
      degreeAwarded: "4-Year B.Sc. (Hons.) or B.A. (Hons.) with Interdisciplinary Majors/Minors (e.g., CS & Entrepreneurship, Biology & Public Health)",
      topColleges: "Ashoka University, Krea University, FLAME University, Azim Premji University, Shiv Nadar University",
      feesVsRoi: "INR 32–44 Lakhs total 4-year residential cost (need-based financial aid up to 100% available) vs INR 10–18 LPA consulting/policy/tech roles."
    },
    timeline: {
      years0to2: "Strategy Consultant (BCG/Bain/Dalberg), Public Policy Fellow, Product Analyst, or Research Assistant (INR 10–18 LPA).",
      years3to6: "Masters/PhD at Oxford, Cambridge, LSE, Yale, or Columbia (Ashoka/Krea have top Ivy/Oxbridge placement rates) (INR 24–50 LPA).",
      years7to10Plus: "Public Policy Think-Tank Director, Venture Investor, Social Enterprise Founder, or Corporate Strategy Head (INR 45 LPA – INR 1.3 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Intellectual & Seminar-Driven (Small discussion classes, world-renowned faculty, and freedom to explore before declaring a major)",
      stressLevel: "Low Rote Stress / Holistic Portfolio",
      whoThrives: "Multidimensional Science students who don't want to be boxed into one rigid silo and aspire to global grad schools or policy/consulting.",
      whoShouldAvoid: "Families unwilling to pay private residential fees if they do not qualify for need-based financial aid."
    }
  },
  {
    id: "sat-act-global",
    name: "SAT / ACT (Global Universities — US, UK, SG)",
    streamCategory: "Open to All Streams",
    eligibleStreams: ["PCMB", "PCM", "PCB"],
    domain: "Management & Business",
    conductingBody: "College Board (Digital SAT) & ACT Inc.",
    degree: "B.S. / B.A. at Global Universities (NUS, NTU, US Ivies, UK)",
    roiBadge: "Global Career ROI",
    roiTone: "amber",
    summary: "Standardized entrance for undergraduate degrees in the US, Singapore (NUS/NTU), Canada, and Europe—rewarding Science students with strong profiles.",
    traits: {
      "Analytical & Tech": 84,
      "Clinical & Healthcare": 45,
      "Pure Science & Research": 78,
      "Management & Strategy": 86,
      "Design & Spatial Creativity": 62,
      "Law, Policy & Defence": 58
    },
    blueprint: {
      eligibleStreamsText: "Open to ALL Class 12 streams; requires Class 9–12 transcripts, extracurricular/research profile, SOP essays, and teacher LORs.",
      pattern: "Digital SAT: 2 hrs 14 mins adaptive test (Reading & Writing 800 + Math 800 = 1600 total); Indian Science students routinely score 780–800 in Math.",
      conductingBody: "College Board (Digital SAT) & ACT Inc.",
      targetScore: "1500+ / 1600 on Digital SAT (790+ Math) for top-30 US universities, NUS/NTU Singapore, or merit scholarships."
    },
    campusReality: {
      degreeAwarded: "4-Year B.S. / B.A. (Flexible double majors in CS, Bioengineering, Economics, Data Science, or Neuroscience)",
      topColleges: "NUS & NTU Singapore, UC Berkeley, Georgia Tech, UIUC, Cornell, University of Toronto, Imperial/UCL (UK)",
      feesVsRoi: "INR 45 Lakhs – INR 2.4 Cr total (Singapore MOE Tuition Grant & US need-blind aid cut costs sharply) vs USD 85k–140k starting global salaries."
    },
    timeline: {
      years0to2: "Software Engineer, Quant Analyst, Bio-Research Associate, or Strategy Analyst in US/Singapore/London (USD 85k–145k / INR 70L–1.2 Cr).",
      years3to6: "Senior Tech/Product Lead, MD/PhD Candidate, or Global Venture/Finance Associate (USD 140k–240k).",
      years7to10Plus: "Global Tech Director, AI/Biotech Founder, or International Fund Partner (USD 250k+ / INR 2 Cr+)."
    },
    lifestyleVerdict: {
      workLifeBalance: "Global & Flexible (Unmatched interdisciplinary lab/campus resources alongside visa and currency-outlay planning)",
      stressLevel: "Holistic Profile & Financial Planning",
      whoThrives: "Self-driven students with strong Class 9–12 academics, research/Olympiad spikes, and either scholarship eligibility or family funding.",
      whoShouldAvoid: "Students starting preparation late in Class 12 without financial planning or extracurricular documentation."
    }
  }
];

const STREAM_FILTERS = ["All", "PCMB", "PCM", "PCB", "Open to All Streams"];

const DOMAIN_FILTERS = [
  "All Domains",
  "Engineering & Tech",
  "Medicine & Allied Health",
  "Pure Research & Space",
  "Management & Business",
  "Law & Policy",
  "Design & Architecture",
  "Defence, Aviation & Maritime"
];

function safeStorageGet(key, fallback) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const val = window.localStorage.getItem(key);
      return val !== null ? val : fallback;
    }
  } catch (err) {
    return fallback;
  }
  return fallback;
}

function safeStorageSet(key, value) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (err) {
    // Ignore storage quota or sandbox restrictions
  }
}

function computeQuizResults(answers, selectedStream) {
  const rawTotals = {
    "Analytical & Tech": 2,
    "Clinical & Healthcare": 2,
    "Pure Science & Research": 2,
    "Management & Strategy": 2,
    "Design & Spatial Creativity": 2,
    "Law, Policy & Defence": 2
  };

  QUIZ_QUESTIONS.forEach((q) => {
    if (q.type === "scenario") {
      const chosenId = answers[q.id];
      const option = q.options.find((o) => o.id === chosenId);
      if (option && option.weights) {
        Object.keys(option.weights).forEach((trait) => {
          rawTotals[trait] = (rawTotals[trait] || 0) + option.weights[trait];
        });
      }
    }
  });

  const maxRaw = Math.max(...Object.values(rawTotals), 1);
  const percentages = {};
  TRAIT_KEYS.forEach((trait) => {
    const scaled = Math.round(28 + (rawTotals[trait] / maxRaw) * 68);
    percentages[trait] = Math.min(98, Math.max(25, scaled));
  });

  const sortedTraits = [...TRAIT_KEYS].sort((a, b) => percentages[b] - percentages[a]);
  const primaryTrait = sortedTraits[0];
  const secondaryTrait = sortedTraits[1];
  const archetype = ARCHETYPE_MAP[primaryTrait] || ARCHETYPE_MAP["Analytical & Tech"];

  const enrichedExams = EXAMS_DATA.map((e) => ({
    ...e,
    ...(EXAM_METADATA_ENRICHMENT[e.id] || {
      prepSynergy: "NCERT + Aptitude Aligned",
      avgTotalFeeLakhs: 10,
      avgEntrySalaryLakhs: 12,
      avgMidSalaryLakhs: 28,
      defaultBucket: "Target",
      examMonth: "May"
    })
  }));

  const eligibleExams = enrichedExams.filter((exam) =>
    exam.eligibleStreams.includes(selectedStream)
  );

  const scoredExams = eligibleExams
    .map((exam) => {
      let weightedSum = 0;
      let userNorm = 0;
      TRAIT_KEYS.forEach((trait) => {
        const uScore = percentages[trait] / 100;
        const eScore = (exam.traits[trait] || 0) / 100;
        weightedSum += uScore * eScore;
        userNorm += uScore;
      });
      const baseAlignment = userNorm > 0 ? (weightedSum / userNorm) * 100 : 70;
      const primaryBoost = ((exam.traits[primaryTrait] || 0) / 100) * 14;
      const secondaryBoost = ((exam.traits[secondaryTrait] || 0) / 100) * 7;
      const fitScore = Math.min(99, Math.max(62, Math.round(baseAlignment * 0.88 + primaryBoost + secondaryBoost)));
      return {
        ...exam,
        fitScore
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore);

  return {
    stream: selectedStream,
    percentages,
    sortedTraits,
    primaryTrait,
    secondaryTrait,
    archetype,
    topMatches: scoredExams.slice(0, 6)
  };
}

function generateConversationalFallback(promptText, context) {
  const cleaned = (promptText || "").trim();
  const lower = cleaned.toLowerCase();
  const stream = context.studentStream || "PCMB";
  const quiz = context.quizResults;
  const portfolioExams = context.portfolioExams || [];

  const isGreetingOrShort =
    /^(hi+|hey+|hello+|namaste|hola|yo|sup|good\s*(morning|afternoon|evening)|help|hlo|kii?|what's up|whats up|how are you)[!.,?\s]*$/i.test(
      cleaned
    ) || cleaned.split(/\s+/).length <= 3;

  if (isGreetingOrShort && !lower.includes("roi") && !lower.includes("neet") && !lower.includes("jee") && !lower.includes("ipmat")) {
    const archetypeNote = quiz
      ? "I can see you are in **" + stream + "** and your quiz points toward **" + quiz.archetype.title + "**."
      : "I see you have selected **" + stream + "** as your Class 12 stream.";
    return (
      "Hey there! Glad you reached out. " +
      archetypeNote +
      " Tell me honestly—what is the biggest thing stressing you out right now? Are you torn between two exams, worried about syllabus burnout, or trying to figure out a realistic backup plan with your parents?"
    );
  }

  const eligiblePool = EXAMS_DATA.map((e) => ({
    ...e,
    ...(EXAM_METADATA_ENRICHMENT[e.id] || {})
  })).filter((e) => e.eligibleStreams.includes(stream));

  const rankedPool = quiz && quiz.topMatches && quiz.topMatches.length > 0 ? quiz.topMatches : eligiblePool;

  if (lower.includes("4-bucket") || lower.includes("4-exam") || lower.includes("portfolio")) {
    const dream = rankedPool[0] || eligiblePool[0];
    const target = rankedPool[1] || eligiblePool[1] || dream;
    const wildcard =
      eligiblePool.find((e) => e.streamCategory === "Open to All Streams" && e.id !== dream.id && e.id !== target.id) ||
      rankedPool[2] ||
      dream;
    const backup =
      eligiblePool.find(
        (e) =>
          (e.id.includes("cuet") || e.id.includes("viteee") || e.id.includes("bpharm") || e.id.includes("icar")) &&
          e.id !== dream.id &&
          e.id !== target.id
      ) ||
      rankedPool[3] ||
      target;

    return (
      "Here is a balanced **4-Bucket Portfolio** tailored for your **" +
      stream +
      "** profile" +
      (quiz ? " (" + quiz.archetype.title + ")" : "") +
      ":\n\n" +
      "- **1. Dream Bucket — " +
      dream.name +
      ":** " +
      dream.summary +
      " Target benchmark: " +
      dream.blueprint.targetScore +
      "\n" +
      "- **2. Target Bucket — " +
      target.name +
      ":** High-ROI core target (" +
      target.roiBadge +
      "). Prep synergy: " +
      (target.prepSynergy || "High NCERT overlap") +
      ".\n" +
      "- **3. Wildcard Pivot — " +
      wildcard.name +
      ":** Unlocks cross-domain upside (" +
      wildcard.degree +
      ") so your entire future does not hinge on one exam pattern.\n" +
      "- **4. Safety Backup — " +
      backup.name +
      ":** Board-aligned safety net securing top central/state university ROI (" +
      backup.campusReality.topColleges.split(",")[0] +
      ").\n\nWhich of these four buckets feels weakest in your current preparation?"
    );
  }

  if (lower.includes("burnt out by neet") || lower.includes("pcb") || lower.includes("neet")) {
    return (
      "I hear you completely—NEET-UG's 24-lakh applicant bottleneck can feel overwhelming, and you do **not** need to trap yourself in endless drop years to build a high-earning career with PCB:\n\n" +
      "- **1. IISER Aptitude Test (IAT) & NEST:** Enter IISER Pune/Kolkata or NISER Bhubaneswar for a 5-year BS-MS in Biology, Computational Genetics, or Data Science—minimal fees (INR 60k/yr scholarship at NISER) and global PhD/R&D trajectories.\n" +
      "- **2. IPMAT (IIM Indore/Rohtak/Ranchi) & CLAT (NLUs):** Open to PCB students with zero Biology burnout. IIM IPM delivers INR 22–30 LPA MBA placements, while NLUs place science grads into INR 16–22 LPA corporate & biotech-patent law.\n" +
      "- **3. UCEED / NID DAT (B.Des Product & UX Design):** IIT Bombay/Delhi and NID welcome PCB students; UX/Product Designers start at INR 14–26 LPA in tech.\n" +
      "- **4. AIIMS B.Sc. Nursing / Paramedical & CUET Forensics (NFSU):** Virtually free education at AIIMS with INR 8.5–11 LPA Nursing Officer pay or rapid UK/Germany clinical mobility.\n\nAre you leaning more toward staying in life sciences/research, or pivoting completely into management, design, or law?"
    );
  }

  if (lower.includes("ipmat") || lower.includes("compare") || lower.includes("roi")) {
    return (
      "Let's compare the real 10-Year ROI and cashflow across **IPMAT (5-Year IIM)**, **Engineering (IIT/NIT/BITS)**, and **Medicine (MBBS + MD/MS)**:\n\n" +
      "- **Upfront Tuition Outlay (Years 1–5):** Govt Engineering (INR 8–11L) and Govt MBBS (INR 1–4L) are low-cost, whereas IIM IPMAT (INR 32–38L) or Private MBBS (INR 70L+) require education loan planning.\n" +
      "- **Early Career Cashflow (Age 21–24):** Engineers start earning at age 21–22 (INR 15–30 LPA) and IPMAT graduates exit with an IIM MBA at age 22–23 (INR 22–30 LPA). Meanwhile, MBBS doctors are completing internship and preparing for NEET-PG (INR 9–14 LPA resident stipends).\n" +
      "- **10-Year Peak (Age 28–32):** Tech/Quant leaders and IIM IPM alumni hit INR 45 LPA – INR 1.5 Cr+ in product, finance, or consulting by age 28. Specialist doctors (MD/MS) hit that inflection around age 30–32 with unmatched lifelong clinical authority.\n\nWould you like me to calculate the education loan break-even timeline for any specific college?"
    );
  }

  const focusExam =
    portfolioExams.length > 0
      ? portfolioExams[0]
      : rankedPool[0];

  return (
    "That is an important question to unpack for a **" +
    stream +
    "** student. Looking at your profile" +
    (quiz ? " (**" + quiz.archetype.title + "**)" : "") +
    ", here is how I would think about your next move:\n\n" +
    "- **Anchor Option — " +
    focusExam.name +
    ":** " +
    focusExam.summary +
    " (" +
    focusExam.campusReality.feesVsRoi +
    ")\n" +
    "- **10-Year Progression:** Starts with " +
    focusExam.timeline.years0to2 +
    " and scales by Years 7–10+ to " +
    focusExam.timeline.years7to10Plus +
    "\n\nTell me a bit more about your current mock scores or budget constraints—what part of this decision feels hardest right now?"
  );
}

function renderInlineBold(text) {
  const parts = text.split("**");
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return (
        <strong key={idx} className="font-semibold text-[#16382E]">
          {part}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function renderFormattedText(text) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={index} className="h-2" />;
    }
    if (trimmed === "---" || trimmed === "***") {
      return <hr key={index} className="my-3 border-[#E2DDD0]" />;
    }
    if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      const headingContent = trimmed.replace(/^#{1,3}\s+/, "");
      return (
        <h4
          key={index}
          className="mt-3.5 mb-1.5 font-serif-editorial text-[16px] sm:text-[17px] font-semibold leading-snug text-[#16382E] border-b border-[#E2DDD0]/70 pb-1"
        >
          {renderInlineBold(headingContent)}
        </h4>
      );
    }
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      return (
        <div key={index} className="flex items-start gap-2.5 pl-0.5 my-1.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#194236]/10 text-[11px] font-bold text-[#16382E]">
            {numberedMatch[1]}
          </span>
          <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-[#2C3632]">
            {renderInlineBold(numberedMatch[2])}
          </p>
        </div>
      );
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      const content = trimmed.slice(2);
      return (
        <div key={index} className="flex items-start gap-2.5 pl-1 my-1.5">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#A67C46] shrink-0" />
          <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-[#2C3632]">
            {renderInlineBold(content)}
          </p>
        </div>
      );
    }
    return (
      <p key={index} className="text-[14px] sm:text-[14.5px] leading-relaxed text-[#2C3632] my-1">
        {renderInlineBold(trimmed)}
      </p>
    );
  });
}

const COUNSELLOR_PROMPT_CHIPS = [
  "Build my 4-Bucket Portfolio (Dream + Target + Wildcard + Backup)",
  "I am a PCB student burnt out by NEET—what are my best high-paying options?",
  "Compare IPMAT vs Engineering/Medicine ROI over 10 years"
];

const CATEGORY_OPTIONS = [
  { id: "GEN", label: "General (UR)", shortLabel: "GEN" },
  { id: "OBC", label: "OBC-NCL / EWS", shortLabel: "OBC/EWS" },
  { id: "SC", label: "Scheduled Caste (SC)", shortLabel: "SC" },
  { id: "ST", label: "Scheduled Tribe (ST)", shortLabel: "ST" }
];

const BOARDS_CUTOFF_TABS = [
  {
    id: "national-gates",
    label: "IIT / NIT / BITS Gates",
    metricType: "auto",
    branches: [
      {
        name: "BITS Pilani Direct Board Topper",
        fullName: "BITS Pilani Direct Admission (Board Rank 1)",
        cutoff: 99,
        cutoffsByCat: { GEN: 99, OBC: 99, SC: 99, ST: 99 },
        basis: "PCM"
      },
      {
        name: "JAC Delhi / Top Private Aid",
        fullName: "JAC Delhi & Private Merit Scholarship Bracket",
        cutoff: 95,
        cutoffsByCat: { GEN: 95, OBC: 92, SC: 85, ST: 82 },
        basis: "PCM"
      },
      {
        name: "IISc Bengaluru Safe Board Bar",
        fullName: "IISc Bengaluru & Top Research Safe Board %",
        cutoff: 85,
        cutoffsByCat: { GEN: 85, OBC: 80, SC: 70, ST: 65 },
        basis: "Overall"
      },
      {
        name: "BITSAT Eligibility Gate (PCM)",
        fullName: "BITSAT Mandatory 75% PCM (+60% each, All Categories)",
        cutoff: 75,
        cutoffsByCat: { GEN: 75, OBC: 75, SC: 75, ST: 75 },
        basis: "PCM"
      },
      {
        name: "JEE Main & Adv (IIT/NIT/IIIT)",
        fullName: "JoSAA Official Board Criteria (75% GEN/OBC, 65% SC/ST)",
        cutoff: 75,
        cutoffsByCat: { GEN: 75, OBC: 75, SC: 65, ST: 65 },
        basis: "Overall"
      },
      {
        name: "IIST ISRO Space B.Tech Gate",
        fullName: "IIST Thiruvananthapuram Board Criteria (75% GEN/OBC, 65% SC/ST)",
        cutoff: 75,
        cutoffsByCat: { GEN: 75, OBC: 75, SC: 65, ST: 65 },
        basis: "PCM"
      },
      {
        name: "Army TES / Navy B.Tech SSB",
        fullName: "Indian Army 10+2 TES & Navy B.Tech 60% PCM Gate",
        cutoff: 60,
        cutoffsByCat: { GEN: 60, OBC: 60, SC: 60, ST: 60 },
        basis: "PCM"
      },
      {
        name: "IMU-CET Merchant Navy Gate",
        fullName: "IMU-CET & Shipping Sponsorship (60% PCM, 55% SC/ST)",
        cutoff: 60,
        cutoffsByCat: { GEN: 60, OBC: 60, SC: 55, ST: 55 },
        basis: "PCM"
      },
      {
        name: "IISER IAT & NEST Minimum Gate",
        fullName: "IISER BS-MS & NISER Official Gate (60% GEN/OBC, 55% SC/ST)",
        cutoff: 60,
        cutoffsByCat: { GEN: 60, OBC: 60, SC: 55, ST: 55 },
        basis: "Overall"
      },
      {
        name: "NEET-UG MBBS / AIIMS Gate",
        fullName: "NEET-UG NMC PCB Aggregate Gate (50% GEN, 40% OBC/SC/ST)",
        cutoff: 50,
        cutoffsByCat: { GEN: 50, OBC: 40, SC: 40, ST: 40 },
        basis: "PCM"
      }
    ]
  },
  {
    id: "merit-admissions",
    label: "Merit Colleges (TNEA / DU)",
    metricType: "auto",
    branches: [
      {
        name: "CEG Anna Univ CS (TNEA)",
        fullName: "College of Engineering Guindy CSE (12th PCM Cutoff)",
        cutoff: 99,
        cutoffsByCat: { GEN: 99, OBC: 98, SC: 93, ST: 91 },
        basis: "PCM"
      },
      {
        name: "MIT Chromepet / PSG Tech CS",
        fullName: "MIT Chennai & PSG Coimbatore CSE (Board Cutoff)",
        cutoff: 97,
        cutoffsByCat: { GEN: 97, OBC: 95.5, SC: 89, ST: 86 },
        basis: "PCM"
      },
      {
        name: "SSN Chennai / Thiagarajar CS",
        fullName: "SSN College of Engineering Merit Quota",
        cutoff: 95,
        cutoffsByCat: { GEN: 95, OBC: 93, SC: 84, ST: 80 },
        basis: "PCM"
      },
      {
        name: "St. Xavier's Mumbai / Kolkata",
        fullName: "St. Xavier's Autonomous B.Sc. / Data Science Merit",
        cutoff: 93,
        cutoffsByCat: { GEN: 93, OBC: 90, SC: 82, ST: 78 },
        basis: "Overall"
      },
      {
        name: "Fergusson Pune / Loyola B.Sc.",
        fullName: "Fergusson College Pune & Loyola Chennai Merit Cut",
        cutoff: 90,
        cutoffsByCat: { GEN: 90, OBC: 86, SC: 76, ST: 72 },
        basis: "Overall"
      },
      {
        name: "VIT / Manipal 10+2 Merit Aid",
        fullName: "Private Univ Board Topper Scholarship Bracket",
        cutoff: 88,
        cutoffsByCat: { GEN: 88, OBC: 88, SC: 85, ST: 85 },
        basis: "PCM"
      },
      {
        name: "IIM Indore / Rohtak PI Weight",
        fullName: "IPMAT Academic Consistency Safe Benchmark",
        cutoff: 85,
        cutoffsByCat: { GEN: 85, OBC: 80, SC: 72, ST: 68 },
        basis: "Overall"
      },
      {
        name: "Ashoka / Krea Holistic Safe",
        fullName: "Liberal Arts & Sciences Academic Transcript Bar",
        cutoff: 82,
        cutoffsByCat: { GEN: 82, OBC: 80, SC: 75, ST: 75 },
        basis: "Overall"
      },
      {
        name: "VITEEE / MET / COMEDK Gate",
        fullName: "Private Engg PCM Eligibility (60% GEN, 50% SC/ST)",
        cutoff: 60,
        cutoffsByCat: { GEN: 60, OBC: 55, SC: 50, ST: 50 },
        basis: "PCM"
      },
      {
        name: "NATA / JEE Arch Board Gate",
        fullName: "Council of Architecture Pass Gate (50% GEN, 45% SC/ST)",
        cutoff: 50,
        cutoffsByCat: { GEN: 50, OBC: 45, SC: 45, ST: 45 },
        basis: "PCM"
      }
    ]
  },
  {
    id: "global-scholarships",
    label: "Global & Scholarships",
    metricType: "auto",
    branches: [
      {
        name: "NUS / NTU Singapore Direct",
        fullName: "National Univ of Singapore & NTU CBSE/ISC Cutoff",
        cutoff: 97,
        cutoffsByCat: { GEN: 97, OBC: 97, SC: 97, ST: 97 },
        basis: "Overall"
      },
      {
        name: "Imperial / UCL / Oxford STEM",
        fullName: "UK Russell Group A*A*A Equivalent Board Requirement",
        cutoff: 95,
        cutoffsByCat: { GEN: 95, OBC: 95, SC: 95, ST: 95 },
        basis: "PCM"
      },
      {
        name: "Univ of Toronto / Waterloo CS",
        fullName: "Canada Tier-1 Co-op CS Class 12 Board Requirement",
        cutoff: 93,
        cutoffsByCat: { GEN: 93, OBC: 93, SC: 93, ST: 93 },
        basis: "PCM"
      },
      {
        name: "INSPIRE SHE Scholarship Cut",
        fullName: "DST INSPIRE Top 1% Board Cutoff (~INR 80k/yr)",
        cutoff: 94,
        cutoffsByCat: { GEN: 94, OBC: 92, SC: 86, ST: 82 },
        basis: "Overall"
      },
      {
        name: "National SC/ST Top-Class Aid",
        fullName: "Central Sector Top-Class Education Scholarship Gate",
        cutoff: 80,
        cutoffsByCat: { GEN: 85, OBC: 80, SC: 65, ST: 60 },
        basis: "Overall"
      },
      {
        name: "TU Munich / ETH Global Track",
        fullName: "European Technical Universities Board Benchmark",
        cutoff: 90,
        cutoffsByCat: { GEN: 90, OBC: 90, SC: 90, ST: 90 },
        basis: "PCM"
      },
      {
        name: "US Top-30 Holistic Transcript",
        fullName: "US Ivy / UC Berkeley Class 12 Transcript Benchmark",
        cutoff: 90,
        cutoffsByCat: { GEN: 90, OBC: 90, SC: 90, ST: 90 },
        basis: "Overall"
      },
      {
        name: "UNSW / Univ of Melbourne STEM",
        fullName: "Australia Go8 Direct Entry Class 12 Percentage",
        cutoff: 85,
        cutoffsByCat: { GEN: 85, OBC: 85, SC: 85, ST: 85 },
        basis: "Overall"
      },
      {
        name: "DGCA Commercial Pilot Gate",
        fullName: "DGCA CPL Class 12 Physics & Maths 51%+ Requirement",
        cutoff: 51,
        cutoffsByCat: { GEN: 51, OBC: 51, SC: 51, ST: 51 },
        basis: "PCM"
      },
      {
        name: "CLAT / AILET / NCHMCT Gate",
        fullName: "NLUs & IHM Board Eligibility (45% GEN/OBC, 40% SC/ST)",
        cutoff: 45,
        cutoffsByCat: { GEN: 45, OBC: 45, SC: 40, ST: 40 },
        basis: "Overall"
      }
    ]
  }
];

const SPECIFIC_PREDICTOR_CONFIGS = {
  "bitsat": {
    title: "BITSAT Score & B.E. Branch Predictor",
    subtitle: "Verified against latest BITS Pilani, Goa & Hyderabad official score cutoffs (+3 correct, -1 wrong, 390 base / 426 with bonus).",
    hasCategoryReservation: false,
    reservationNote: "Pure Merit Admission — BITS Pilani has no SC/ST/OBC reservation; cutoffs apply equally to all categories.",
    maxQuestions: 130,
    correctMarks: 3,
    wrongMarks: 1,
    maxBaseScore: 390,
    scaleMax: 430,
    borderlineMargin: 10,
    unitLabel: "pts",
    optionTypeLabel: "Branches",
    defaultAttempted: 115,
    defaultAccuracy: 85,
    bonusConfig: {
      label: "Attempt 12 Bonus Questions (+36 max marks)",
      subtextUnlock: "Unlocked! Toggle switch to simulate bonus section",
      subtextLocked: "Attempt all 130 main questions (or toggle directly) to simulate +36 bonus marks",
      bonusQuestions: 12
    },
    tabs: [
      {
        id: "pilani",
        label: "Pilani",
        branches: [
          { name: "Computer Science", fullName: "B.E. Computer Science (Pilani · 2024: 327 | 2025: 304)", cutoff: 315 },
          { name: "Math & Computing", fullName: "B.E. Mathematics & Computing (Pilani · Official: 295–312)", cutoff: 302 },
          { name: "Electronics & Comm.", fullName: "B.E. Electronics & Communication (Pilani · Official: 285–298)", cutoff: 290 },
          { name: "Electrical & Elec.", fullName: "B.E. Electrical & Electronics (Pilani · Official: 260–280)", cutoff: 268 },
          { name: "Electronics & Instr.", fullName: "B.E. Electronics & Instrumentation (Pilani · Official: 250–270)", cutoff: 258 },
          { name: "M.Sc. Economics Dual", fullName: "M.Sc. Economics + B.E. Dual Degree (Pilani · Official: 251–262)", cutoff: 254 },
          { name: "Mechanical Eng.", fullName: "B.E. Mechanical Engineering (Pilani · Official: 235–254)", cutoff: 242 },
          { name: "Chemical Eng.", fullName: "B.E. Chemical Engineering (Pilani · Official: 210–232)", cutoff: 218 },
          { name: "Manufacturing Eng.", fullName: "B.E. Manufacturing Engineering (Pilani · Official: 211–226)", cutoff: 215 },
          { name: "Civil / Env. Eng.", fullName: "B.E. Civil & Environmental Eng. (Pilani · Official: 203–222)", cutoff: 206 }
        ]
      },
      {
        id: "goa",
        label: "Goa",
        branches: [
          { name: "Computer Science", fullName: "B.E. Computer Science (Goa · 2024: 301 | 2025: 274)", cutoff: 286 },
          { name: "Math & Computing", fullName: "B.E. Mathematics & Computing (Goa · Official: 268–286)", cutoff: 276 },
          { name: "Elec. & Computer", fullName: "B.E. Electronics & Computer Eng. (Goa · Official: 262–278)", cutoff: 268 },
          { name: "Electronics & Comm.", fullName: "B.E. Electronics & Communication (Goa · Official: 255–272)", cutoff: 262 },
          { name: "Electrical & Elec.", fullName: "B.E. Electrical & Electronics (Goa · Official: 243–258)", cutoff: 248 },
          { name: "M.Sc. Economics Dual", fullName: "M.Sc. Economics + B.E. Dual Degree (Goa · Official: 237–248)", cutoff: 240 },
          { name: "Electronics & Instr.", fullName: "B.E. Electronics & Instrumentation (Goa · Official: 234–246)", cutoff: 238 },
          { name: "Mechanical Eng.", fullName: "B.E. Mechanical Engineering (Goa · Official: 223–236)", cutoff: 226 },
          { name: "M.Sc. Math / Semicon", fullName: "M.Sc. Mathematics / Semiconductor Dual (Goa · Official: 216–225)", cutoff: 220 },
          { name: "Chemical / Bio Dual", fullName: "B.E. Chemical & M.Sc. Bio Dual (Goa · Official: 203–206)", cutoff: 205 }
        ]
      },
      {
        id: "hyderabad",
        label: "Hyderabad",
        branches: [
          { name: "Computer Science", fullName: "B.E. Computer Science (Hyderabad · 2024: 298 | 2025: 270)", cutoff: 282 },
          { name: "Math & Computing", fullName: "B.E. Mathematics & Computing (Hyderabad · Official: 266–282)", cutoff: 272 },
          { name: "Electronics & Comm.", fullName: "B.E. Electronics & Communication (Hyderabad · Official: 256–268)", cutoff: 260 },
          { name: "Electrical & Elec.", fullName: "B.E. Electrical & Electronics (Hyderabad · Official: 239–254)", cutoff: 245 },
          { name: "Electronics & Instr.", fullName: "B.E. Electronics & Instrumentation (Hyderabad · Official: 232–242)", cutoff: 235 },
          { name: "M.Sc. Economics Dual", fullName: "M.Sc. Economics + B.E. Dual (Hyderabad · Official: 231–240)", cutoff: 234 },
          { name: "Mechanical Eng.", fullName: "B.E. Mechanical Engineering (Hyderabad · Official: 214–228)", cutoff: 220 },
          { name: "M.Sc. Math / Physics", fullName: "M.Sc. Mathematics & Physics Dual (Hyderabad · Official: 209–212)", cutoff: 210 },
          { name: "Chemical / Civil Eng.", fullName: "B.E. Chemical & Civil Engineering (Hyderabad · Official: 203–205)", cutoff: 204 },
          { name: "B.Pharm / Env. Eng.", fullName: "B.Pharm & B.E. Environmental (Hyderabad · Official: 151–181)", cutoff: 168 }
        ]
      }
    ]
  },
  "jee-main-adv": {
    title: "JEE Main Score & NIT / IIIT / IIT Qualifier Predictor",
    subtitle: "Verified 2025 NTA & JoSAA cutoffs (+4 correct, -1 wrong, 300 max) with GEN, OBC-NCL/EWS, SC, and ST merit relaxation.",
    hasCategoryReservation: true,
    reservationNote: "2025 Official Qualifying %ile: GEN 93.10%ile (~112 pts) · EWS/OBC 79.4–80.3%ile (~78 pts) · SC 61.15%ile (~52 pts) · ST 47.90%ile (~40 pts)",
    maxQuestions: 75,
    correctMarks: 4,
    wrongMarks: 1,
    maxBaseScore: 300,
    scaleMax: 300,
    borderlineMargin: 10,
    unitLabel: "pts",
    optionTypeLabel: "Institutes",
    defaultAttempted: 56,
    defaultAccuracy: 84,
    bonusConfig: {
      label: "Tough Shift Percentile Normalization Boost (+12 marks eqv.)",
      subtextUnlock: "Simulating tougher paper percentile normalization boost",
      subtextLocked: "Toggle to simulate tough shift percentile normalization (+12 pts)",
      flatBoost: 12
    },
    tabs: [
      {
        id: "top-nits",
        label: "Top NITs (CSE/ECE)",
        branches: [
          { name: "NIT Trichy CSE", fullName: "NIT Tiruchirappalli CSE (~99.85%ile GEN)", cutoff: 246, cutoffsByCat: { GEN: 246, OBC: 224, SC: 168, ST: 148 } },
          { name: "NIT Surathkal CSE", fullName: "NIT Karnataka Surathkal CSE (~99.78%ile GEN)", cutoff: 236, cutoffsByCat: { GEN: 236, OBC: 214, SC: 158, ST: 138 } },
          { name: "NIT Warangal CSE", fullName: "NIT Warangal Computer Science (~99.70%ile GEN)", cutoff: 228, cutoffsByCat: { GEN: 228, OBC: 206, SC: 150, ST: 132 } },
          { name: "NIT Trichy ECE", fullName: "NIT Tiruchirappalli Electronics & Comm.", cutoff: 212, cutoffsByCat: { GEN: 212, OBC: 190, SC: 138, ST: 120 } },
          { name: "MNNIT Allahabad CSE", fullName: "MNNIT Allahabad Computer Science", cutoff: 206, cutoffsByCat: { GEN: 206, OBC: 184, SC: 132, ST: 115 } },
          { name: "MNIT Jaipur / Rourkela CS", fullName: "MNIT Jaipur & NIT Rourkela CSE", cutoff: 196, cutoffsByCat: { GEN: 196, OBC: 175, SC: 125, ST: 108 } },
          { name: "VNIT Nagpur / Calicut CS", fullName: "VNIT Nagpur & NIT Calicut CSE", cutoff: 184, cutoffsByCat: { GEN: 184, OBC: 164, SC: 116, ST: 100 } },
          { name: "NIT Trichy / Surathkal Mech", fullName: "Top 3 NIT Mechanical / Chemical Eng.", cutoff: 166, cutoffsByCat: { GEN: 166, OBC: 146, SC: 102, ST: 86 } },
          { name: "Mid-NIT Circuital (ECE/EE)", fullName: "NIT Bhopal / Jalandhar / Silchar / Agartala ECE & CS", cutoff: 148, cutoffsByCat: { GEN: 148, OBC: 128, SC: 88, ST: 72 } },
          { name: "JEE Advanced Cutoff Gate", fullName: "NTA 2025 Official JEE Advanced Qualifying Score", cutoff: 112, cutoffsByCat: { GEN: 112, OBC: 78, SC: 52, ST: 40 } }
        ]
      },
      {
        id: "iiits-dtu",
        label: "IIITs & DTU / NSUT",
        branches: [
          { name: "IIIT Hyderabad CSE", fullName: "IIIT Hyderabad B.Tech CSE (Pure JEE Main Mode)", cutoff: 254, cutoffsByCat: { GEN: 254, OBC: 254, SC: 254, ST: 254 } },
          { name: "IIIT Allahabad IT / AI", fullName: "IIIT Allahabad Information Technology", cutoff: 216, cutoffsByCat: { GEN: 216, OBC: 192, SC: 138, ST: 118 } },
          { name: "IIIT Bangalore iMTech CS", fullName: "IIIT Bangalore Integrated M.Tech CSE", cutoff: 210, cutoffsByCat: { GEN: 210, OBC: 210, SC: 210, ST: 210 } },
          { name: "DTU / NSUT Delhi CSE", fullName: "Delhi Technological Univ & NSUT CSE (JAC)", cutoff: 202, cutoffsByCat: { GEN: 202, OBC: 172, SC: 118, ST: 96 } },
          { name: "IIIT Delhi CS + AI", fullName: "IIIT Delhi Computer Science & AI", cutoff: 192, cutoffsByCat: { GEN: 192, OBC: 164, SC: 110, ST: 90 } },
          { name: "IIIT Gwalior IT + MBA", fullName: "ABV-IIIT Gwalior 5-Yr Integrated IT", cutoff: 176, cutoffsByCat: { GEN: 176, OBC: 154, SC: 105, ST: 88 } },
          { name: "DTU / NSUT ECE & M&C", fullName: "DTU & NSUT Mathematics & Computing / ECE", cutoff: 170, cutoffsByCat: { GEN: 170, OBC: 144, SC: 96, ST: 78 } },
          { name: "IIIT Lucknow CS & AI", fullName: "IIIT Lucknow Computer Science & AI", cutoff: 164, cutoffsByCat: { GEN: 164, OBC: 142, SC: 95, ST: 78 } },
          { name: "IIIT Jabalpur / Kancheepuram", fullName: "IIITDM Jabalpur & Kancheepuram CSE", cutoff: 146, cutoffsByCat: { GEN: 146, OBC: 126, SC: 84, ST: 68 } },
          { name: "PEC Chandigarh / BIT Mesra", fullName: "PEC Chandigarh & BIT Mesra Core Branches", cutoff: 130, cutoffsByCat: { GEN: 130, OBC: 112, SC: 74, ST: 58 } }
        ]
      },
      {
        id: "iit-adv-eqv",
        label: "IIT Target Readiness",
        branches: [
          { name: "Old IIT CSE / MnC Zone", fullName: "Top 5 IIT CSE / MnC Readiness Benchmark", cutoff: 260, cutoffsByCat: { GEN: 260, OBC: 235, SC: 182, ST: 162 } },
          { name: "Top 7 IIT Electrical / ECE", fullName: "IIT Bombay/Delhi/Madras/Kanpur EE Zone", cutoff: 232, cutoffsByCat: { GEN: 232, OBC: 208, SC: 158, ST: 138 } },
          { name: "2nd-Gen IIT CSE (Hyd/BHU)", fullName: "IIT Hyderabad, IIT BHU & IIT Indore CSE", cutoff: 220, cutoffsByCat: { GEN: 220, OBC: 196, SC: 146, ST: 128 } },
          { name: "Old IIT Mechanical / Aero", fullName: "Top 7 IIT Mechanical, Aerospace & Chemical", cutoff: 202, cutoffsByCat: { GEN: 202, OBC: 178, SC: 130, ST: 112 } },
          { name: "2nd-Gen IIT Circuital", fullName: "IIT Roorkee/Guwahati/BHU/Ropar ECE & EE", cutoff: 188, cutoffsByCat: { GEN: 188, OBC: 166, SC: 120, ST: 102 } },
          { name: "IISc / IIST Space Readiness", fullName: "IISc B.Tech & IIST Aerospace Target Bar", cutoff: 178, cutoffsByCat: { GEN: 178, OBC: 156, SC: 112, ST: 95 } },
          { name: "3rd-Gen IIT CSE", fullName: "IIT Dharwad, Tirupati, Goa & Bhilai CSE", cutoff: 164, cutoffsByCat: { GEN: 164, OBC: 144, SC: 102, ST: 86 } },
          { name: "Old IIT Civil / Metallurgy", fullName: "Top 7 IIT Civil, Biotech & Material Science", cutoff: 150, cutoffsByCat: { GEN: 150, OBC: 130, SC: 90, ST: 75 } },
          { name: "3rd-Gen IIT Core Branches", fullName: "New IIT Mechanical / Electrical / Civil", cutoff: 136, cutoffsByCat: { GEN: 136, OBC: 116, SC: 78, ST: 64 } },
          { name: "JEE Advanced Safe Qualifier", fullName: "Safe Margin Above JEE Adv Qualifying Cut", cutoff: 118, cutoffsByCat: { GEN: 118, OBC: 84, SC: 58, ST: 45 } }
        ]
      }
    ]
  },
  "neet-ug": {
    title: "NEET-UG Score & Medical College Cutoff Predictor",
    subtitle: "Verified against latest MCC AIQ & State GMC MBBS/BDS/BAMS cutoffs (+4 correct, -1 wrong, 720 max) across GEN, OBC/EWS, SC, and ST.",
    hasCategoryReservation: true,
    reservationNote: "Includes latest MCC All-India Quota (AIQ) & State GMC relaxations across UR, OBC/EWS, SC (15%), and ST (7.5%).",
    maxQuestions: 180,
    correctMarks: 4,
    wrongMarks: 1,
    maxBaseScore: 720,
    scaleMax: 720,
    borderlineMargin: 15,
    unitLabel: "pts",
    optionTypeLabel: "Colleges",
    defaultAttempted: 165,
    defaultAccuracy: 88,
    bonusConfig: {
      label: "NCERT Biology 360/360 Revision Boost (+20 pts)",
      subtextUnlock: "Simulating zero-error NCERT Biology line-by-line mastery",
      subtextLocked: "Toggle to simulate +20 marks from full Biology accuracy",
      flatBoost: 20
    },
    tabs: [
      {
        id: "aiims-central",
        label: "AIIMS & Central",
        branches: [
          { name: "AIIMS New Delhi MBBS", fullName: "All India Institute of Medical Sciences, New Delhi", cutoff: 700, cutoffsByCat: { GEN: 700, OBC: 690, SC: 645, ST: 620 } },
          { name: "VMMC & MAMC New Delhi", fullName: "Vardhman Mahavir & Maulana Azad Medical College", cutoff: 688, cutoffsByCat: { GEN: 688, OBC: 676, SC: 620, ST: 590 } },
          { name: "JIPMER Puducherry / AIIMS-J", fullName: "JIPMER Puducherry & AIIMS Jodhpur MBBS", cutoff: 678, cutoffsByCat: { GEN: 678, OBC: 668, SC: 602, ST: 572 } },
          { name: "AIIMS Bhubaneswar / Bhopal", fullName: "AIIMS Bhubaneswar & AIIMS Bhopal MBBS", cutoff: 670, cutoffsByCat: { GEN: 670, OBC: 660, SC: 590, ST: 560 } },
          { name: "IMS BHU Varanasi / KGMU", fullName: "IMS BHU Varanasi & KGMU Lucknow (AIQ)", cutoff: 662, cutoffsByCat: { GEN: 662, OBC: 652, SC: 578, ST: 548 } },
          { name: "AIIMS Rishikesh / Raipur", fullName: "AIIMS Rishikesh, Raipur & Nagpur MBBS", cutoff: 652, cutoffsByCat: { GEN: 652, OBC: 642, SC: 562, ST: 532 } },
          { name: "AFMC Pune MBBS", fullName: "Armed Forces Medical College Pune (+ ToELR)", cutoff: 640, cutoffsByCat: { GEN: 640, OBC: 640, SC: 555, ST: 530 } },
          { name: "Newer AIIMS (Kalyani/Guwahati)", fullName: "AIIMS Kalyani, Guwahati, Rajkot & Deoghar", cutoff: 625, cutoffsByCat: { GEN: 625, OBC: 616, SC: 528, ST: 495 } },
          { name: "ESIC Medical Colleges (AIQ)", fullName: "ESIC Faridabad, Bengaluru & Hyderabad MBBS", cutoff: 610, cutoffsByCat: { GEN: 610, OBC: 600, SC: 505, ST: 472 } },
          { name: "AIQ Govt MBBS Closing Cut", fullName: "15% All-India Quota Last Govt MBBS Seat (2025/2024 Avg)", cutoff: 585, cutoffsByCat: { GEN: 585, OBC: 580, SC: 485, ST: 460 } }
        ]
      },
      {
        id: "state-gmc",
        label: "State Quota GMCs",
        branches: [
          { name: "Seth GS (KEM) Mumbai", fullName: "Seth GS Medical College & KEM Hospital Mumbai", cutoff: 665, cutoffsByCat: { GEN: 665, OBC: 650, SC: 575, ST: 515 } },
          { name: "SMS Jaipur / BJMC Ahmedabad", fullName: "SMS Medical College Jaipur & BJMC Ahmedabad", cutoff: 655, cutoffsByCat: { GEN: 655, OBC: 644, SC: 562, ST: 510 } },
          { name: "MMC Chennai / BMC Bengaluru", fullName: "Madras Medical College & Bangalore Medical College", cutoff: 648, cutoffsByCat: { GEN: 648, OBC: 636, SC: 550, ST: 502 } },
          { name: "IPGMER / MCK Kolkata", fullName: "Medical College Kolkata & SSKM Hospital", cutoff: 638, cutoffsByCat: { GEN: 638, OBC: 622, SC: 535, ST: 480 } },
          { name: "Top Tier-2 City State GMCs", fullName: "Govt Medical Colleges in Pune, Nagpur, Mysore, Indore", cutoff: 605, cutoffsByCat: { GEN: 605, OBC: 595, SC: 495, ST: 455 } },
          { name: "State Quota Safe GMC Cut", fullName: "85% State Quota Govt MBBS Safe Closing Score", cutoff: 565, cutoffsByCat: { GEN: 565, OBC: 555, SC: 455, ST: 425 } },
          { name: "NE / Low-Cutoff State GMCs", fullName: "Agartala GMC, Assam, HP, MP & Karnataka State GMCs", cutoff: 535, cutoffsByCat: { GEN: 535, OBC: 525, SC: 435, ST: 400 } },
          { name: "Semi-Govt / Society MBBS", fullName: "Govt-Aided & State Society Medical Colleges", cutoff: 520, cutoffsByCat: { GEN: 520, OBC: 510, SC: 420, ST: 385 } },
          { name: "Top KMC Manipal / Deemed", fullName: "Kasturba Medical College Manipal (Merit Seat)", cutoff: 510, cutoffsByCat: { GEN: 510, OBC: 510, SC: 510, ST: 510 } },
          { name: "BAMS / BVSc Veterinary Govt", fullName: "BHU/NIA Govt BAMS & IVRI Govt Veterinary (BVSc)", cutoff: 490, cutoffsByCat: { GEN: 490, OBC: 480, SC: 395, ST: 365 } }
        ]
      },
      {
        id: "allied-medical",
        label: "BDS / BAMS / Vet / Nursing",
        branches: [
          { name: "MAIDS Delhi / Nair BDS", fullName: "Top Central & Metro Govt Dental Colleges (BDS)", cutoff: 565, cutoffsByCat: { GEN: 565, OBC: 552, SC: 460, ST: 430 } },
          { name: "IVRI Bareilly / TANUVAS Vet", fullName: "Premier Govt Veterinary Colleges (B.V.Sc. & A.H.)", cutoff: 530, cutoffsByCat: { GEN: 530, OBC: 518, SC: 425, ST: 395 } },
          { name: "AIQ Govt BDS Closing Cut", fullName: "All-India Quota Govt Dental Surgery Closing (2025)", cutoff: 505, cutoffsByCat: { GEN: 505, OBC: 500, SC: 410, ST: 380 } },
          { name: "NIA Jaipur / BHU BAMS", fullName: "National Institute of Ayurveda & BHU BAMS", cutoff: 495, cutoffsByCat: { GEN: 495, OBC: 485, SC: 395, ST: 365 } },
          { name: "AIQ B.Sc. Nursing (NEET)", fullName: "Central B.Sc. (Hons.) Nursing via NEET Score (2025)", cutoff: 470, cutoffsByCat: { GEN: 470, OBC: 465, SC: 382, ST: 355 } },
          { name: "State Govt BAMS Colleges", fullName: "Government Ayurvedic Medical Colleges", cutoff: 445, cutoffsByCat: { GEN: 445, OBC: 435, SC: 355, ST: 325 } },
          { name: "NIH Kolkata / Govt BHMS", fullName: "National Institute of Homoeopathy & Govt BHMS", cutoff: 410, cutoffsByCat: { GEN: 410, OBC: 398, SC: 325, ST: 295 } },
          { name: "Govt Physiotherapy (BPT)", fullName: "KEM / Seth GS / Pt. DDU Govt BPT Seats", cutoff: 390, cutoffsByCat: { GEN: 390, OBC: 375, SC: 305, ST: 275 } },
          { name: "Private MBBS Management Cut", fullName: "Private Medical College State Management Quota", cutoff: 340, cutoffsByCat: { GEN: 340, OBC: 330, SC: 260, ST: 240 } },
          { name: "NEET-UG Qualifying Cutoff", fullName: "NMC Official Qualifying Cutoff Score", cutoff: 162, cutoffsByCat: { GEN: 162, OBC: 127, SC: 127, ST: 127 } }
        ]
      }
    ]
  },
  "iiser-iat": {
    title: "IISER Aptitude Test (IAT) Score & Campus Predictor",
    subtitle: "Verified 2024–2025 IAT cutoffs (+4 correct, -1 wrong, 240 max) for IISc Bengaluru, IIT Madras, and all 7 IISERs across GEN, OBC, SC, and ST.",
    hasCategoryReservation: true,
    reservationNote: "Official IAT Reservation: GEN, OBC-NCL (27%), SC (15%), ST (7.5%). Board gate is 60% for GEN/OBC and 55% for SC/ST.",
    maxQuestions: 60,
    correctMarks: 4,
    wrongMarks: 1,
    maxBaseScore: 240,
    scaleMax: 240,
    borderlineMargin: 8,
    unitLabel: "pts",
    optionTypeLabel: "Campuses",
    defaultAttempted: 44,
    defaultAccuracy: 84,
    bonusConfig: {
      label: "Attempt 4th Subject Section (+20 net marks)",
      subtextUnlock: "Simulating 5 extra correct questions in your 4th Bio/Math section",
      subtextLocked: "Toggle to simulate attempting 5 high-accuracy questions in your 4th subject",
      flatBoost: 20
    },
    tabs: [
      {
        id: "flagship-research",
        label: "IISc & Top IISERs",
        branches: [
          { name: "IISc Bengaluru B.S.", fullName: "Indian Institute of Science Bengaluru (4-Yr BS)", cutoff: 205, cutoffsByCat: { GEN: 205, OBC: 185, SC: 155, ST: 138 } },
          { name: "IIT Madras BS Medical Sci.", fullName: "IIT Madras BS in Medical Sciences & Engineering", cutoff: 188, cutoffsByCat: { GEN: 188, OBC: 170, SC: 140, ST: 122 } },
          { name: "IISER Pune BS-MS", fullName: "IISER Pune 5-Year BS-MS Dual Degree", cutoff: 156, cutoffsByCat: { GEN: 156, OBC: 136, SC: 102, ST: 84 } },
          { name: "IISER Kolkata BS-MS", fullName: "IISER Kolkata 5-Year BS-MS Dual Degree", cutoff: 142, cutoffsByCat: { GEN: 142, OBC: 122, SC: 92, ST: 76 } },
          { name: "IISER Bhopal B.Tech DS/Eng", fullName: "IISER Bhopal 4-Yr B.Tech Engineering & Data Science", cutoff: 140, cutoffsByCat: { GEN: 140, OBC: 120, SC: 90, ST: 75 } },
          { name: "IISER Mohali BS-MS", fullName: "IISER Mohali 5-Year BS-MS Dual Degree", cutoff: 128, cutoffsByCat: { GEN: 128, OBC: 110, SC: 82, ST: 68 } },
          { name: "IISER Bhopal BS-MS", fullName: "IISER Bhopal 5-Year BS-MS Natural Sciences", cutoff: 124, cutoffsByCat: { GEN: 124, OBC: 106, SC: 78, ST: 65 } },
          { name: "IISER Thiruvananthapuram", fullName: "IISER TVM 5-Year BS-MS Dual Degree", cutoff: 118, cutoffsByCat: { GEN: 118, OBC: 100, SC: 74, ST: 62 } },
          { name: "IISER Tirupati BS-MS", fullName: "IISER Tirupati 5-Year BS-MS Dual Degree", cutoff: 112, cutoffsByCat: { GEN: 112, OBC: 94, SC: 68, ST: 56 } },
          { name: "IISER Berhampur BS-MS", fullName: "IISER Berhampur 5-Year BS-MS Closing Cutoff", cutoff: 106, cutoffsByCat: { GEN: 106, OBC: 88, SC: 64, ST: 52 } }
        ]
      },
      {
        id: "round-closing",
        label: "Final Round Cutoffs",
        branches: [
          { name: "IISc Bengaluru (Last Round)", fullName: "IISc Bengaluru Final Counselling Round Cut", cutoff: 194, cutoffsByCat: { GEN: 194, OBC: 175, SC: 145, ST: 128 } },
          { name: "IISER Pune (Last Round)", fullName: "IISER Pune Final Round Closing Score", cutoff: 144, cutoffsByCat: { GEN: 144, OBC: 124, SC: 92, ST: 75 } },
          { name: "IISER Kolkata (Last Round)", fullName: "IISER Kolkata Final Round Closing Score", cutoff: 130, cutoffsByCat: { GEN: 130, OBC: 112, SC: 82, ST: 68 } },
          { name: "IISER Bhopal Econ (4-Yr BS)", fullName: "IISER Bhopal B.S. Economic Sciences", cutoff: 125, cutoffsByCat: { GEN: 125, OBC: 108, SC: 78, ST: 64 } },
          { name: "IISER Mohali (Last Round)", fullName: "IISER Mohali Final Round Closing Score", cutoff: 118, cutoffsByCat: { GEN: 118, OBC: 100, SC: 72, ST: 60 } },
          { name: "IISER Bhopal (Last Round)", fullName: "IISER Bhopal Final Round Closing Score", cutoff: 115, cutoffsByCat: { GEN: 115, OBC: 98, SC: 70, ST: 58 } },
          { name: "IISER TVM (Last Round)", fullName: "IISER Thiruvananthapuram Final Round Cut", cutoff: 110, cutoffsByCat: { GEN: 110, OBC: 92, SC: 65, ST: 54 } },
          { name: "IISER Tirupati (Last Round)", fullName: "IISER Tirupati Final Round Closing Score", cutoff: 104, cutoffsByCat: { GEN: 104, OBC: 86, SC: 60, ST: 50 } },
          { name: "IISER Berhampur (Last Round)", fullName: "IISER Berhampur Final Spot Round Cut", cutoff: 98, cutoffsByCat: { GEN: 98, OBC: 82, SC: 56, ST: 46 } },
          { name: "INSPIRE Fellowship Safe Bar", fullName: "Safe IAT Score for INSPIRE Scholarship", cutoff: 125, cutoffsByCat: { GEN: 125, OBC: 110, SC: 85, ST: 75 } }
        ]
      },
      {
        id: "major-tracks",
        label: "Major Selection Bar",
        branches: [
          { name: "Data Science & AI Major", fullName: "IISER Kolkata/Bhopal/Pune Data Science Major", cutoff: 148, cutoffsByCat: { GEN: 148, OBC: 128, SC: 96, ST: 80 } },
          { name: "Physics & Astrophysics", fullName: "IISER Pune/Kolkata Theoretical & Astro Physics", cutoff: 140, cutoffsByCat: { GEN: 140, OBC: 120, SC: 90, ST: 74 } },
          { name: "Computational Biology", fullName: "IISER Pune/Mohali Genetics & Comp. Biology", cutoff: 132, cutoffsByCat: { GEN: 132, OBC: 114, SC: 84, ST: 70 } },
          { name: "Mathematics & Quant Sci.", fullName: "IISER Kolkata/Mohali Pure & Applied Math", cutoff: 128, cutoffsByCat: { GEN: 128, OBC: 110, SC: 80, ST: 66 } },
          { name: "Economic & Stat Sciences", fullName: "IISER Bhopal & Tirupati Economic Sciences", cutoff: 126, cutoffsByCat: { GEN: 126, OBC: 108, SC: 78, ST: 64 } },
          { name: "Chemical & Material Sci.", fullName: "IISER Organic, Quantum & Materials Chemistry", cutoff: 118, cutoffsByCat: { GEN: 118, OBC: 100, SC: 72, ST: 60 } },
          { name: "Biological Sciences Core", fullName: "All IISERs Molecular & Cellular Biology", cutoff: 112, cutoffsByCat: { GEN: 112, OBC: 95, SC: 68, ST: 56 } },
          { name: "Earth & Climate Sciences", fullName: "IISER Kolkata/Pune Earth & Planetary Sciences", cutoff: 106, cutoffsByCat: { GEN: 106, OBC: 88, SC: 62, ST: 52 } },
          { name: "IACS Kolkata / IIEST Track", fullName: "IACS Integrated BS-MS via IAT Score", cutoff: 136, cutoffsByCat: { GEN: 136, OBC: 118, SC: 88, ST: 72 } },
          { name: "BS-MS General Entry Gate", fullName: "Minimum Score for Any IISER Seat", cutoff: 98, cutoffsByCat: { GEN: 98, OBC: 82, SC: 56, ST: 46 } }
        ]
      }
    ]
  },
  "ipmat-jipmat": {
    title: "IPMAT (IIM Indore / Rohtak / Ranchi) Score Predictor",
    subtitle: "Verified 2024–2025 IIM cutoffs (+4 correct, -1 wrong, 360 max) across GEN, NC-OBC/EWS, SC, and ST categories.",
    hasCategoryReservation: true,
    reservationNote: "Official IIM Reservation: GEN, EWS (10%), NC-OBC (27%), SC (15%), ST (7.5%).",
    maxQuestions: 90,
    correctMarks: 4,
    wrongMarks: 1,
    maxBaseScore: 360,
    scaleMax: 360,
    borderlineMargin: 12,
    unitLabel: "pts",
    optionTypeLabel: "IIM Campuses",
    defaultAttempted: 62,
    defaultAccuracy: 82,
    bonusConfig: {
      label: "Short-Answer Quant Zero-Negative Boost (+16 pts)",
      subtextUnlock: "Simulating 4 correct Short Answer (SA) questions with 0 negative marking",
      subtextLocked: "Toggle to simulate +16 marks from Short-Answer Quant section",
      flatBoost: 16
    },
    tabs: [
      {
        id: "iim-indore-ranchi",
        label: "IIM Indore & Ranchi",
        branches: [
          { name: "IIM Indore Safe Conversion", fullName: "IIM Indore 5-Yr IPM Final Convert Safe Score", cutoff: 206, cutoffsByCat: { GEN: 206, OBC: 152, SC: 114, ST: 86 } },
          { name: "IIM Ranchi Safe Conversion", fullName: "IIM Ranchi IPM Final Convert Safe Score", cutoff: 192, cutoffsByCat: { GEN: 192, OBC: 142, SC: 105, ST: 78 } },
          { name: "IIM Indore PI Shortlist Cut", fullName: "IIM Indore Official PI Cutoff (GEN ~176, OBC ~126, SC ~90)", cutoff: 176, cutoffsByCat: { GEN: 176, OBC: 126, SC: 90, ST: 65 } },
          { name: "IIM Ranchi PI Shortlist Cut", fullName: "IIM Ranchi Personal Interview Qualifying Cut", cutoff: 168, cutoffsByCat: { GEN: 168, OBC: 120, SC: 84, ST: 60 } },
          { name: "IIFT Kakinada IPM", fullName: "Indian Institute of Foreign Trade 5-Yr IPM", cutoff: 160, cutoffsByCat: { GEN: 160, OBC: 116, SC: 80, ST: 58 } },
          { name: "IIM Amritsar / Shillong IPM", fullName: "New IIM Integrated Management Programs", cutoff: 154, cutoffsByCat: { GEN: 154, OBC: 112, SC: 76, ST: 55 } },
          { name: "IIM Sirmaur BMS", fullName: "IIM Sirmaur 4-Year Bachelor of Management", cutoff: 144, cutoffsByCat: { GEN: 144, OBC: 104, SC: 70, ST: 50 } },
          { name: "NALSAR Hyderabad IPM", fullName: "NALSAR DoMS 5-Year BBA+MBA via IPMAT", cutoff: 138, cutoffsByCat: { GEN: 138, OBC: 102, SC: 72, ST: 55 } },
          { name: "NIRMA / TAPMI IPM", fullName: "Nirma Univ & TAPMI 5-Yr BBA-MBA (Merit)", cutoff: 128, cutoffsByCat: { GEN: 128, OBC: 128, SC: 128, ST: 128 } },
          { name: "IFMR Krea / Alliance IPM", fullName: "IFMR GSB Krea University 5-Yr BBA-MBA", cutoff: 116, cutoffsByCat: { GEN: 116, OBC: 116, SC: 116, ST: 116 } }
        ]
      },
      {
        id: "rohtak-jipmat",
        label: "Rohtak, Jammu & BG",
        branches: [
          { name: "IIM Rohtak Safe Convert", fullName: "IIM Rohtak IPM Scaled Safe Score (2025 Cut: 381/480)", cutoff: 285, cutoffsByCat: { GEN: 285, OBC: 223, SC: 172, ST: 104 } },
          { name: "IIM Jammu Safe Convert", fullName: "IIM Jammu 5-Yr IPM (JIPMAT Scaled Eqv.)", cutoff: 262, cutoffsByCat: { GEN: 262, OBC: 215, SC: 165, ST: 120 } },
          { name: "IIM Bodh Gaya Safe Convert", fullName: "IIM Bodh Gaya 5-Yr IPM (JIPMAT Scaled Eqv.)", cutoff: 252, cutoffsByCat: { GEN: 252, OBC: 205, SC: 155, ST: 112 } },
          { name: "IIM Rohtak PI Call Cut", fullName: "IIM Rohtak Official PI Shortlist (Scaled to /360)", cutoff: 268, cutoffsByCat: { GEN: 268, OBC: 208, SC: 160, ST: 98 } },
          { name: "JIPMAT Jammu PI Cut", fullName: "IIM Jammu JIPMAT Qualifying Cutoff", cutoff: 245, cutoffsByCat: { GEN: 245, OBC: 198, SC: 148, ST: 105 } },
          { name: "JIPMAT Bodh Gaya Cut", fullName: "IIM Bodh Gaya JIPMAT Qualifying Cutoff", cutoff: 238, cutoffsByCat: { GEN: 238, OBC: 190, SC: 140, ST: 98 } },
          { name: "Verbal Ability Sectional Safe", fullName: "Safe Combined Score Ensuring VA Sectional Clear", cutoff: 170, cutoffsByCat: { GEN: 170, OBC: 122, SC: 88, ST: 64 } },
          { name: "Quant MCQ Sectional Safe", fullName: "Safe Combined Score Ensuring QA MCQ Clear", cutoff: 175, cutoffsByCat: { GEN: 175, OBC: 125, SC: 90, ST: 65 } },
          { name: "Quant SA Sectional Safe", fullName: "Safe Combined Score Ensuring QA SA Clear", cutoff: 165, cutoffsByCat: { GEN: 165, OBC: 118, SC: 84, ST: 60 } },
          { name: "Partner B-School Safe Cut", fullName: "Baseline Score for Partner B-School Calls", cutoff: 110, cutoffsByCat: { GEN: 110, OBC: 95, SC: 75, ST: 60 } }
        ]
      },
      {
        id: "science-advantage",
        label: "Science Student Edge",
        branches: [
          { name: "IIM Indore Top 50 Merit", fullName: "Top 50 Rank in IIM Indore IPM (High Quant)", cutoff: 228, cutoffsByCat: { GEN: 228, OBC: 178, SC: 138, ST: 108 } },
          { name: "IIM Indore General Merit", fullName: "IIM Indore Offer Zone", cutoff: 202, cutoffsByCat: { GEN: 202, OBC: 148, SC: 110, ST: 82 } },
          { name: "IIM Ranchi Offer Zone", fullName: "IIM Ranchi Offer Zone", cutoff: 188, cutoffsByCat: { GEN: 188, OBC: 138, SC: 102, ST: 76 } },
          { name: "SSCBS DU BMS Equivalent", fullName: "Equivalent Prep Readiness for SSCBS DU BMS", cutoff: 196, cutoffsByCat: { GEN: 196, OBC: 158, SC: 122, ST: 98 } },
          { name: "IIM Indore PI Borderline", fullName: "IIM Indore Borderline Call (Strong PI Needed)", cutoff: 176, cutoffsByCat: { GEN: 176, OBC: 126, SC: 90, ST: 65 } },
          { name: "IIFT Kakinada Safe Offer", fullName: "IIFT Kakinada Integrated Management Offer", cutoff: 160, cutoffsByCat: { GEN: 160, OBC: 116, SC: 80, ST: 58 } },
          { name: "NMIMS NPAT Top 500 Eqv.", fullName: "Readiness Equivalent for NMIMS Mumbai BBA", cutoff: 150, cutoffsByCat: { GEN: 150, OBC: 150, SC: 150, ST: 150 } },
          { name: "Symbiosis SET Pune Eqv.", fullName: "Readiness Equivalent for SCMS Pune BBA", cutoff: 140, cutoffsByCat: { GEN: 140, OBC: 140, SC: 115, ST: 100 } },
          { name: "Christ Univ / St. Xavier's", fullName: "Top Metro BBA/BMS Honours Readiness", cutoff: 125, cutoffsByCat: { GEN: 125, OBC: 115, SC: 98, ST: 88 } },
          { name: "Backup BBA Honours Safe", fullName: "Assured Private University BBA+MBA Seat", cutoff: 105, cutoffsByCat: { GEN: 105, OBC: 95, SC: 75, ST: 65 } }
        ]
      }
    ]
  },
  "clat-ailet": {
    title: "CLAT & AILET Score & NLU Cutoff Predictor",
    subtitle: "Verified 2025 Consortium NLU cutoffs (+1 correct, -0.25 wrong, 120 max) across GEN, OBC, SC, and ST categories.",
    hasCategoryReservation: true,
    reservationNote: "Official NLU Reservation: GEN, OBC-NCL, SC, ST, plus State Domicile benefits at respective NLUs.",
    maxQuestions: 120,
    correctMarks: 1,
    wrongMarks: 0.25,
    maxBaseScore: 120,
    scaleMax: 120,
    borderlineMargin: 4,
    unitLabel: "pts",
    optionTypeLabel: "NLUs",
    defaultAttempted: 106,
    defaultAccuracy: 84,
    bonusConfig: {
      label: "GK & Legal Current Affairs Revision Boost (+6 pts)",
      subtextUnlock: "Simulating +6 net marks from Legal & GK passage accuracy",
      subtextLocked: "Toggle to simulate +6 marks from Legal & Current Affairs mastery",
      flatBoost: 6
    },
    tabs: [
      {
        id: "tier1-nlus",
        label: "Tier-1 NLUs",
        branches: [
          { name: "NLSIU Bengaluru", fullName: "National Law School of India University, Bengaluru (AIR ≤102 GEN)", cutoff: 97, cutoffsByCat: { GEN: 97, OBC: 89, SC: 79, ST: 73 } },
          { name: "NALSAR Hyderabad", fullName: "NALSAR University of Law, Hyderabad (AIR ≤159 GEN)", cutoff: 95, cutoffsByCat: { GEN: 95, OBC: 87, SC: 76, ST: 70 } },
          { name: "NLU Delhi (AILET Eqv.)", fullName: "National Law University Delhi (Top 80 AIR)", cutoff: 95, cutoffsByCat: { GEN: 95, OBC: 86, SC: 75, ST: 69 } },
          { name: "WBNUJS Kolkata", fullName: "West Bengal National Univ of Juridical Sciences (AIR ≤300)", cutoff: 92, cutoffsByCat: { GEN: 92, OBC: 83, SC: 72, ST: 66 } },
          { name: "NLU Jodhpur", fullName: "National Law University, Jodhpur", cutoff: 90, cutoffsByCat: { GEN: 90, OBC: 81, SC: 70, ST: 64 } },
          { name: "GNLU Gandhinagar", fullName: "Gujarat National Law University, Gandhinagar", cutoff: 88, cutoffsByCat: { GEN: 88, OBC: 79, SC: 68, ST: 62 } },
          { name: "NLIU Bhopal (B.Sc. LLB)", fullName: "NLIU Bhopal Cyber Security B.Sc. LL.B. & BA LLB", cutoff: 86, cutoffsByCat: { GEN: 86, OBC: 77, SC: 66, ST: 60 } },
          { name: "MNLU Mumbai", fullName: "Maharashtra National Law University, Mumbai", cutoff: 85, cutoffsByCat: { GEN: 85, OBC: 76, SC: 65, ST: 59 } },
          { name: "RMNLU Lucknow", fullName: "Dr. Ram Manohar Lohiya National Law Univ", cutoff: 83, cutoffsByCat: { GEN: 83, OBC: 74, SC: 63, ST: 57 } },
          { name: "HNLU Raipur", fullName: "Hidayatullah National Law University, Raipur", cutoff: 81, cutoffsByCat: { GEN: 81, OBC: 72, SC: 61, ST: 55 } }
        ]
      },
      {
        id: "tier2-nlus",
        label: "Tier-2 & Tech Law",
        branches: [
          { name: "NLU Odisha (Cuttack)", fullName: "National Law University Odisha (AIR ≤1013 GEN)", cutoff: 80, cutoffsByCat: { GEN: 80, OBC: 71, SC: 60, ST: 54 } },
          { name: "RGNUL Patiala", fullName: "Rajiv Gandhi National University of Law, Punjab", cutoff: 79, cutoffsByCat: { GEN: 79, OBC: 70, SC: 59, ST: 53 } },
          { name: "NUALS Kochi", fullName: "National Univ of Advanced Legal Studies, Kochi", cutoff: 77, cutoffsByCat: { GEN: 77, OBC: 68, SC: 57, ST: 51 } },
          { name: "CNLU Patna", fullName: "Chanakya National Law University, Patna", cutoff: 75, cutoffsByCat: { GEN: 75, OBC: 67, SC: 55, ST: 49 } },
          { name: "MNLU Nagpur / Aurangabad", fullName: "Maharashtra National Law Univ Nagpur", cutoff: 73, cutoffsByCat: { GEN: 73, OBC: 65, SC: 54, ST: 48 } },
          { name: "NUSRL Ranchi", fullName: "National Univ of Study & Research in Law", cutoff: 72, cutoffsByCat: { GEN: 72, OBC: 64, SC: 53, ST: 47 } },
          { name: "DSNLU Visakhapatnam", fullName: "Damodaram Sanjivayya National Law Univ", cutoff: 71, cutoffsByCat: { GEN: 71, OBC: 63, SC: 52, ST: 46 } },
          { name: "TNNLU Tiruchirappalli", fullName: "Tamil Nadu National Law University", cutoff: 70, cutoffsByCat: { GEN: 70, OBC: 62, SC: 51, ST: 45 } },
          { name: "HPNLU Shimla / DNLU", fullName: "Himachal Pradesh & Dharmashastra NLU Jabalpur", cutoff: 68, cutoffsByCat: { GEN: 68, OBC: 60, SC: 49, ST: 43 } },
          { name: "NLU Tripura / Prayagraj", fullName: "NLU Tripura (Agartala) & RPNLU Prayagraj Closing Cut", cutoff: 65, cutoffsByCat: { GEN: 65, OBC: 57, SC: 46, ST: 40 } }
        ]
      },
      {
        id: "corporate-private",
        label: "Symbiosis / Jindal / DU",
        branches: [
          { name: "Faculty of Law DU (5-Yr)", fullName: "University of Delhi 5-Year Integrated LLB via CLAT", cutoff: 86, cutoffsByCat: { GEN: 86, OBC: 78, SC: 66, ST: 60 } },
          { name: "JGLS Sonipat Merit Schlr.", fullName: "Jindal Global Law School Scholarship Bracket", cutoff: 84, cutoffsByCat: { GEN: 84, OBC: 84, SC: 84, ST: 84 } },
          { name: "SLS Pune (SLAT Eqv.)", fullName: "Symbiosis Law School Pune Readiness Bar", cutoff: 82, cutoffsByCat: { GEN: 82, OBC: 82, SC: 68, ST: 62 } },
          { name: "GLC Mumbai / ILS Pune", fullName: "MHCET Law GLC Mumbai & ILS Pune Readiness", cutoff: 80, cutoffsByCat: { GEN: 80, OBC: 73, SC: 64, ST: 56 } },
          { name: "Nirma Univ Law Ahmedabad", fullName: "Institute of Law Nirma University via CLAT", cutoff: 73, cutoffsByCat: { GEN: 73, OBC: 73, SC: 73, ST: 73 } },
          { name: "NMIMS Kirit P. Mehta Law", fullName: "NMIMS Mumbai 5-Year BA/BBA LLB via CLAT", cutoff: 70, cutoffsByCat: { GEN: 70, OBC: 70, SC: 70, ST: 70 } },
          { name: "SLS Noida / Hyderabad", fullName: "Symbiosis Law School Noida & Hyderabad", cutoff: 68, cutoffsByCat: { GEN: 68, OBC: 68, SC: 56, ST: 50 } },
          { name: "Christ University Law BLR", fullName: "School of Law Christ University Bengaluru", cutoff: 65, cutoffsByCat: { GEN: 65, OBC: 65, SC: 65, ST: 65 } },
          { name: "UPES Dehradun Patent Law", fullName: "UPES B.Tech/B.Sc. Energy & Patent Law", cutoff: 60, cutoffsByCat: { GEN: 60, OBC: 60, SC: 60, ST: 60 } },
          { name: "Private Law College Safe", fullName: "Assured Private Integrated Law Admission", cutoff: 55, cutoffsByCat: { GEN: 55, OBC: 50, SC: 42, ST: 38 } }
        ]
      }
    ]
  }
};

const PURE_MERIT_EXAMS = new Set([
  "bitsat",
  "iiith-ugee",
  "nda-navy-af-tes",
  "upsc-nda-army",
  "dgca-cpl-pilot",
  "ashoka-krea-flame",
  "sat-act-global"
]);

function buildPredictorProfileForExam(examId) {
  if (SPECIFIC_PREDICTOR_CONFIGS[examId]) {
    return SPECIFIC_PREDICTOR_CONFIGS[examId];
  }

  const examObj = EXAMS_DATA.find((e) => e.id === examId) || EXAMS_DATA[0];
  const hasReservation = !PURE_MERIT_EXAMS.has(examId);
  const topCollegesArr = examObj.campusReality.topColleges
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const c1 = topCollegesArr[0] || "Flagship Campus 1";
  const c2 = topCollegesArr[1] || "Premier Campus 2";
  const c3 = topCollegesArr[2] || "Premier Campus 3";
  const c4 = topCollegesArr[3] || "Core Institute 4";

  const presets = {
    "iiith-ugee": { q: 100, c: 2, w: 0.5, max: 200, defA: 78, defAcc: 84, unit: "pts", topRatio: 0.78 },
    "viteee-cets": { q: 125, c: 1, w: 0, max: 125, defA: 108, defAcc: 82, unit: "pts", topRatio: 0.86 },
    "nata-jee-arch": { q: 100, c: 2, w: 0, max: 200, defA: 82, defAcc: 84, unit: "pts", topRatio: 0.78 },
    "isi-cmi": { q: 60, c: 4, w: 1, max: 240, defA: 45, defAcc: 84, unit: "pts", topRatio: 0.76 },
    "imu-cet": { q: 200, c: 1, w: 0.25, max: 200, defA: 155, defAcc: 82, unit: "pts", topRatio: 0.78 },
    "dgca-cpl-pilot": { q: 100, c: 1, w: 0, max: 100, defA: 84, defAcc: 88, unit: "pts", topRatio: 0.85 },
    "nda-navy-af-tes": { q: 150, c: 6, w: 2, max: 900, defA: 90, defAcc: 78, unit: "pts", topRatio: 0.54 },
    "aiims-nursing-paramedical": { q: 100, c: 1, w: 0.33, max: 100, defA: 84, defAcc: 85, unit: "pts", topRatio: 0.78 },
    "bpharm-pharmd-bpt": { q: 150, c: 1, w: 0, max: 150, defA: 126, defAcc: 84, unit: "pts", topRatio: 0.86 },
    "icar-aieea": { q: 150, c: 4, w: 1, max: 600, defA: 122, defAcc: 84, unit: "pts", topRatio: 0.84 },
    "nest-niser": { q: 60, c: 3, w: 1, max: 180, defA: 44, defAcc: 84, unit: "pts", topRatio: 0.72 },
    "iist-isro": { q: 90, c: 4, w: 1, max: 360, defA: 52, defAcc: 80, unit: "pts", topRatio: 0.58 },
    "cuet-science-biotech": { q: 160, c: 5, w: 1, max: 800, defA: 145, defAcc: 88, unit: "pts", topRatio: 0.93 },
    "npat-set-cuet-mgmt": { q: 130, c: 5, w: 1, max: 650, defA: 114, defAcc: 86, unit: "pts", topRatio: 0.89 },
    "uceed-nid": { q: 75, c: 4, w: 1, max: 300, defA: 52, defAcc: 80, unit: "pts", topRatio: 0.64 },
    "nift-bdes": { q: 100, c: 1, w: 0.25, max: 100, defA: 82, defAcc: 84, unit: "pts", topRatio: 0.80 },
    "nchmct-jee": { q: 200, c: 4, w: 1, max: 800, defA: 150, defAcc: 82, unit: "pts", topRatio: 0.76 },
    "upsc-nda-army": { q: 150, c: 6, w: 2, max: 900, defA: 88, defAcc: 78, unit: "pts", topRatio: 0.52 },
    "ashoka-krea-flame": { q: 100, c: 1, w: 0, max: 100, defA: 84, defAcc: 88, unit: "pts", topRatio: 0.86 },
    "sat-act-global": { q: 100, c: 16, w: 0, max: 1600, defA: 94, defAcc: 95, unit: "pts", topRatio: 0.96 }
  };

  const p = presets[examId] || { q: 100, c: 4, w: 1, max: 400, defA: 78, defAcc: 84, unit: "pts", topRatio: 0.82 };
  const m = p.max;
  const tr = p.topRatio || 0.82;

  const withCats = (genScore) => {
    if (!hasReservation) {
      return { GEN: genScore, OBC: genScore, SC: genScore, ST: genScore };
    }
    return {
      GEN: genScore,
      OBC: Math.max(Math.round(m * 0.2), Math.round(genScore * 0.90)),
      SC: Math.max(Math.round(m * 0.15), Math.round(genScore * 0.74)),
      ST: Math.max(Math.round(m * 0.12), Math.round(genScore * 0.65))
    };
  };

  const makeBranches = (multiplier) => {
    const steps = [1.0, 0.95, 0.91, 0.86, 0.82, 0.78, 0.74, 0.69, 0.64, 0.58];
    const labels = [
      { name: c1.slice(0, 22), fullName: c1 + " — Flagship Program" },
      { name: c2.slice(0, 22), fullName: c2 + " — Top Honours Track" },
      { name: c3.slice(0, 22), fullName: c3 + " — Core Specialization" },
      { name: c4.slice(0, 22), fullName: c4 + " — Primary Intake" },
      { name: "Tier-1 Spec. Track A", fullName: examObj.degree + " — Specialization Track A" },
      { name: "Tier-1 Spec. Track B", fullName: examObj.degree + " — Specialization Track B" },
      { name: "Premier Campus Round 2", fullName: c1 + " / " + c2 + " — Round 2 Closing" },
      { name: "Regional / State Flagship", fullName: "Top Regional Govt / Autonomous Partner Seat" },
      { name: "Interdisciplinary Dual", fullName: examObj.domain + " Interdisciplinary Program" },
      { name: "Safe Qualifying Cutoff", fullName: examObj.name + " Official Qualifying / Call Cutoff" }
    ];

    return labels.map((item, idx) => {
      let baseCut = Math.round(m * tr * steps[idx] * multiplier);
      if ((examId === "nda-navy-af-tes" || examId === "upsc-nda-army") && idx === 9) {
        baseCut = Math.round(375 * multiplier); // Official UPSC NDA written cutoff ~365-385 / 900
      }
      if (examId === "uceed-nid" && idx === 9) {
        baseCut = Math.round(70 * multiplier); // UCEED Part A Qualifying ~70 GEN, ~63 OBC, ~35 SC/ST
      }
      return {
        name: item.name,
        fullName: item.fullName,
        cutoff: baseCut,
        cutoffsByCat: withCats(baseCut)
      };
    });
  };

  return {
    title: examObj.name + " Score & Cutoff Predictor",
    subtitle:
      "Verified 2025/2026 pattern (+" +
      p.c +
      " correct" +
      (p.w > 0 ? ", -" + p.w + " wrong" : ", no negative marking") +
      ", " +
      p.max +
      " max) against safe target cutoffs across campuses and categories.",
    hasCategoryReservation: hasReservation,
    reservationNote: hasReservation
      ? "Constitutional reservation merit active: switch between GEN, OBC-NCL/EWS, SC, and ST to view category-adjusted cutoffs."
      : "Pure Open Merit Exam — identical merit cutoffs apply across all categories.",
    maxQuestions: p.q,
    correctMarks: p.c,
    wrongMarks: p.w,
    maxBaseScore: p.max,
    scaleMax: p.max,
    borderlineMargin: Math.max(3, Math.round(p.max * 0.03)),
    unitLabel: p.unit,
    optionTypeLabel: "Options",
    defaultAttempted: p.defA,
    defaultAccuracy: p.defAcc,
    bonusConfig: {
      label: "Include Stage-2 Interview / Studio / Revision Boost (+" + Math.round(p.max * 0.05) + " pts)",
      subtextUnlock: "Simulating strong Stage-2 / revision bonus advantage",
      subtextLocked: "Toggle to simulate +" + Math.round(p.max * 0.05) + " bonus points",
      flatBoost: Math.round(p.max * 0.05)
    },
    tabs: [
      { id: "round-1", label: "Flagship / Round 1", branches: makeBranches(1.0) },
      { id: "round-3", label: "Round 3 Cutoffs", branches: makeBranches(0.93) },
      { id: "spot-round", label: "Spot / Extended", branches: makeBranches(0.87) }
    ]
  };
}

function InteractiveScorePredictor({
  examId,
  onSelectExamId,
  studentStream,
  showExamSelector = true,
  onAskAi
}) {
  const isBoards = examId === "boards-12";
  const profile = useMemo(() => {
    if (isBoards) return null;
    return buildPredictorProfileForExam(examId);
  }, [examId, isBoards]);

  const [activeTabId, setActiveTabId] = useState("pilani");
  const [selectedCategory, setSelectedCategory] = useState("GEN");
  const [attempted, setAttempted] = useState(115);
  const [accuracy, setAccuracy] = useState(85);
  const [bonusEnabled, setBonusEnabled] = useState(false);
  const [hoveredBranchIdx, setHoveredBranchIdx] = useState(null);

  // Class 12 Boards 5-Subject State
  const [boardScores, setBoardScores] = useState({
    physics: 88,
    chemistry: 90,
    mathOrBio: 92,
    english: 91,
    fifthSubject: 94
  });
  const [boardPracticalBoost, setBoardPracticalBoost] = useState(false);

  useEffect(() => {
    if (isBoards) {
      setActiveTabId(BOARDS_CUTOFF_TABS[0].id);
      setHoveredBranchIdx(null);
    } else if (profile) {
      setActiveTabId(profile.tabs[0].id);
      setAttempted(profile.defaultAttempted);
      setAccuracy(profile.defaultAccuracy);
      setBonusEnabled(false);
      setHoveredBranchIdx(null);
    }
  }, [examId, isBoards, profile]);

  const boardsCalc = useMemo(() => {
    const boost = boardPracticalBoost ? 2 : 0;
    const p = Math.min(100, boardScores.physics + boost);
    const c = Math.min(100, boardScores.chemistry + boost);
    const mb = Math.min(100, boardScores.mathOrBio + boost);
    const e = Math.min(100, boardScores.english + boost);
    const f = Math.min(100, boardScores.fifthSubject + boost);

    const overallPct = Number(((p + c + mb + e + f) / 5).toFixed(1));
    const corePct = Number(((p + c + mb) / 3).toFixed(1));
    const minCoreSub = Math.min(p, c, mb);
    return { p, c, mb, e, f, overallPct, corePct, minCoreSub };
  }, [boardScores, boardPracticalBoost]);

  const examCalc = useMemo(() => {
    if (isBoards || !profile) return null;
    const correctCount = Math.round((attempted * accuracy) / 100);
    const wrongCount = Math.max(0, attempted - correctCount);
    const positivePts = Number((correctCount * profile.correctMarks).toFixed(1));
    const negativePts = Number((wrongCount * profile.wrongMarks).toFixed(1));

    let bonusPts = 0;
    let bonusCorrect = 0;
    let bonusWrong = 0;
    if (bonusEnabled && profile.bonusConfig) {
      if (profile.bonusConfig.bonusQuestions) {
        const bQ = profile.bonusConfig.bonusQuestions;
        bonusCorrect = Math.round((bQ * accuracy) / 100);
        bonusWrong = Math.max(0, bQ - bonusCorrect);
        bonusPts = Math.max(
          0,
          Number((bonusCorrect * profile.correctMarks - bonusWrong * profile.wrongMarks).toFixed(1))
        );
      } else if (profile.bonusConfig.flatBoost) {
        bonusPts = profile.bonusConfig.flatBoost;
      }
    }

    const totalCorrect = correctCount + bonusCorrect;
    const totalWrong = wrongCount + bonusWrong;
    const totalPosPts = Number((positivePts + (bonusCorrect * profile.correctMarks || bonusPts)).toFixed(1));
    const totalNegPts = Number((negativePts + bonusWrong * profile.wrongMarks).toFixed(1));
    const rawNet = positivePts - negativePts + bonusPts;
    const maxCap =
      profile.bonusConfig && profile.bonusConfig.bonusQuestions && bonusEnabled
        ? profile.maxBaseScore + profile.bonusConfig.bonusQuestions * profile.correctMarks
        : profile.maxBaseScore;
    const netScore = Math.max(0, Math.min(maxCap, Math.round(rawNet)));

    return {
      correctCount: totalCorrect,
      wrongCount: totalWrong,
      positivePts: Math.round(totalPosPts),
      negativePts: Math.round(totalNegPts),
      netScore,
      maxCap
    };
  }, [isBoards, profile, attempted, accuracy, bonusEnabled]);

  const currentTabObj = useMemo(() => {
    if (isBoards) {
      return BOARDS_CUTOFF_TABS.find((t) => t.id === activeTabId) || BOARDS_CUTOFF_TABS[0];
    }
    if (!profile) return null;
    return profile.tabs.find((t) => t.id === activeTabId) || profile.tabs[0];
  }, [isBoards, profile, activeTabId]);

  const activeScore = isBoards ? boardsCalc.overallPct : examCalc ? examCalc.netScore : 0;
  const activeScaleMax = isBoards ? 100 : profile ? profile.scaleMax : 430;
  const activeBorderline = isBoards ? 3 : profile ? profile.borderlineMargin : 10;
  const hasReservationSupport = isBoards || (profile && profile.hasCategoryReservation);

  const evaluatedBranches = useMemo(() => {
    if (!currentTabObj) return [];
    return currentTabObj.branches.map((b) => {
      const compareScore =
        isBoards && b.basis === "PCM" ? boardsCalc.corePct : activeScore;
      const effectiveCutoff =
        b.cutoffsByCat && b.cutoffsByCat[selectedCategory] !== undefined
          ? b.cutoffsByCat[selectedCategory]
          : b.cutoff;
      const margin = Number((compareScore - effectiveCutoff).toFixed(1));
      let status = "out";
      if (margin >= 0) {
        status = "eligible";
      } else if (Math.abs(margin) <= activeBorderline) {
        status = "borderline";
      }
      return {
        ...b,
        effectiveCutoff,
        compareScore,
        margin,
        status
      };
    });
  }, [currentTabObj, isBoards, boardsCalc, activeScore, activeBorderline, selectedCategory]);

  const eligibleBranches = useMemo(
    () => evaluatedBranches.filter((b) => b.status === "eligible"),
    [evaluatedBranches]
  );

  const topEligibleBranch =
    eligibleBranches.length > 0
      ? eligibleBranches.reduce(
          (best, cur) => (cur.effectiveCutoff > best.effectiveCutoff ? cur : best),
          eligibleBranches[0]
        )
      : null;

  const scoreLinePct = Math.min(98, Math.max(2, (activeScore / activeScaleMax) * 100));
  const josaaBarTarget = selectedCategory === "SC" || selectedCategory === "ST" ? 65 : 75;

  return (
    <div className="rounded-3xl bg-[#F3EFE6] p-5 sm:p-8 text-[#16382E] shadow-md border border-[#D8D0C0]">
      {/* Optional Exam & Boards Switcher Strip */}
      {showExamSelector && (
        <div className="mb-6 pb-5 border-b border-[#DED7C8]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#A67C46]">
                INTERACTIVE SCORE & CUTOFF SIMULATOR (26 EXAMS + CLASS 12 BOARDS)
              </span>
              <p className="mt-0.5 text-xs text-[#4A5550]">
                Select Class 12 Boards or any of the 26 Entrance Exams to simulate live 2025/2026 cutoffs:
              </p>
            </div>

            <select
              value={examId}
              onChange={(e) => onSelectExamId && onSelectExamId(e.target.value)}
              className="rounded-xl border border-[#D5CFC0] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#16382E] shadow-2xs focus:border-[#16382E] focus:outline-none cursor-pointer"
            >
              <option value="boards-12">🎓 Class 12 Boards (75% / 65% SC-ST & Merit Gatekeeper)</option>
              {EXAMS_DATA.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.streamCategory})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Popular Exam Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {[
              { id: "bitsat", label: "BITSAT" },
              { id: "boards-12", label: "Class 12 Boards %" },
              { id: "jee-main-adv", label: "JEE Main & Adv" },
              { id: "neet-ug", label: "NEET-UG" },
              { id: "iiser-iat", label: "IISER IAT" },
              { id: "ipmat-jipmat", label: "IPMAT (IIM)" },
              { id: "clat-ailet", label: "CLAT / AILET" },
              { id: "cuet-science-biotech", label: "CUET-UG" },
              { id: "uceed-nid", label: "UCEED / NID" },
              { id: "nda-navy-af-tes", label: "UPSC NDA" }
            ].map((pill) => {
              const active = examId === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onSelectExamId && onSelectExamId(pill.id)}
                  className={
                    "rounded-full px-3.5 py-1 text-[11px] font-semibold transition-all cursor-pointer " +
                    (active
                      ? "bg-[#194236] text-white font-bold shadow-xs"
                      : "bg-white text-[#4A5550] border border-[#E2DDD0] hover:border-[#A67C46] hover:text-[#16382E]")
                  }
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Predictor Title, Subtitle & Category Merit Selector */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="font-serif-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#16382E]">
            {isBoards
              ? "Class 12 Boards Score & Eligibility Gatekeeper Predictor"
              : profile.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#4A5550]">
            {isBoards
              ? "Simulate subject-wise Class 12 Board marks against 75% (65% SC/ST) IIT/NIT gates, TNEA/DU merit cutoffs, and global universities."
              : profile.subtitle}
          </p>
        </div>

        {/* Category Merit Selector (GEN / OBC-EWS / SC / ST) */}
        <div className="shrink-0 rounded-2xl border border-[#E2DDD0] bg-white p-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-1.5 px-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A67C46]">
              Merit Category:
            </span>
            <span className="text-[10px] font-semibold text-[#4A5550]">
              {hasReservationSupport ? "SC / ST / OBC Active" : "Pure Open Merit"}
            </span>
          </div>
          <div className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-[#F9F7F1] p-1 border border-[#E2DDD0]">
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelectedCat = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={
                    "rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer " +
                    (isSelectedCat
                      ? "bg-[#194236] text-white shadow-2xs"
                      : "text-[#4A5550] hover:text-[#16382E]")
                  }
                >
                  {cat.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Reservation Info Banner */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E2DDD0] bg-white/80 px-3.5 py-2 text-xs text-[#4A5550]">
        <span>
          <strong className="text-[#16382E]">
            {hasReservationSupport
              ? "Category Cutoff Mode (" + selectedCategory + "): "
              : "Merit Policy Notice: "}
          </strong>
          {isBoards
            ? "JoSAA IIT/NIT/IIIT & IIST board requirement is 75% for GEN/OBC and 65% for SC/ST; NEET PCB gate is 50% GEN and 40% OBC/SC/ST."
            : profile.reservationNote}
        </span>
      </div>

      {/* 3-Column Top Summary Strip (Editorial Ivory & Botanical Styling) */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3 rounded-2xl bg-white p-4 sm:p-5 border border-[#E2DDD0] shadow-2xs">
        {/* Col 1: Predicted Net Score */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A67C46]">
            {isBoards ? "Predicted Overall Board %" : "Predicted Net Score"}
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-[#16382E]">
              {isBoards ? boardsCalc.overallPct + "%" : examCalc.netScore}
            </span>
            <span className="text-sm font-medium text-[#6C7A74]">
              / {isBoards ? "100%" : examCalc.maxCap}
            </span>
          </div>
        </div>

        {/* Col 2: Answer Breakdown */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A67C46]">
            {isBoards ? "Core Science (PCM/PCB) Aggregate" : "Answer Breakdown"}
          </p>
          {isBoards ? (
            <>
              <p className="mt-1 text-lg sm:text-xl font-bold text-[#16382E]">
                {boardsCalc.corePct}% Core · Min Sub: {boardsCalc.minCoreSub}
              </p>
              <p className="mt-0.5 text-xs text-[#4A5550]">
                {boardsCalc.overallPct >= josaaBarTarget
                  ? "✓ Clears JoSAA " + josaaBarTarget + "% (" + selectedCategory + ") Gate"
                  : "⚠️ Below JoSAA " + josaaBarTarget + "% (" + selectedCategory + ") Gate"}
              </p>
            </>
          ) : (
            <>
              <p className="mt-1 text-lg sm:text-xl font-bold text-[#16382E]">
                {examCalc.correctCount} Correct · {examCalc.wrongCount} Wrong
              </p>
              <p className="mt-0.5 text-xs text-[#4A5550]">
                +{examCalc.positivePts} pts · -{examCalc.negativePts} pts
              </p>
            </>
          )}
        </div>

        {/* Col 3: Eligible Branches / Gates */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A67C46]">
            Eligible {isBoards ? "Gates" : profile.optionTypeLabel} ({currentTabObj.label} ·{" "}
            {hasReservationSupport ? selectedCategory : "Merit"})
          </p>
          <p className="mt-1 text-lg sm:text-xl font-bold text-[#194236]">
            {eligibleBranches.length} of {evaluatedBranches.length}{" "}
            {isBoards ? "Gates" : profile.optionTypeLabel}
          </p>
          <p className="mt-0.5 text-xs text-[#4A5550] truncate">
            Top: {topEligibleBranch ? topEligibleBranch.fullName : "None in this tab yet"}
          </p>
        </div>
      </div>

      {/* Horizontal Cutoff Comparison Card */}
      <div className="mt-4 rounded-2xl bg-white p-4 sm:p-6 border border-[#E2DDD0] shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-serif-editorial text-lg sm:text-xl font-medium text-[#16382E]">
              {isBoards
                ? "Board Cutoff & Gatekeeper Comparison (" + selectedCategory + ")"
                : "Branch & Campus Cutoff Comparison (" +
                  (hasReservationSupport ? selectedCategory + " Merit" : "Open Merit") +
                  ")"}
            </h4>
            <p className="text-xs text-[#4A5550]">
              Vertical dashed line marks your calculated score ({activeScore}{" "}
              {isBoards ? "%" : profile.unitLabel})
            </p>
          </div>

          {/* Campus / Tier Pill Switcher */}
          <div className="inline-flex flex-wrap items-center rounded-full bg-[#F9F7F1] p-1 border border-[#E2DDD0]">
            {(isBoards ? BOARDS_CUTOFF_TABS : profile.tabs).map((tab) => {
              const isTabActive = currentTabObj.id === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={
                    "rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer " +
                    (isTabActive
                      ? "bg-[#194236] text-white shadow-2xs"
                      : "text-[#4A5550] hover:text-[#16382E]")
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Area with Moving Vertical Dashed Line */}
        <div className="mt-7 relative">
          <div className="space-y-2.5">
            {evaluatedBranches.map((branch, idx) => {
              const widthPct = Math.min(
                96,
                Math.max(8, (branch.effectiveCutoff / activeScaleMax) * 100)
              );
              let barColorClass = "bg-[#C4BEB0]"; // Out of reach warm stone
              if (branch.status === "eligible") {
                barColorClass = "bg-[#1E6B4E]"; // Eligible botanical emerald
              } else if (branch.status === "borderline") {
                barColorClass = "bg-[#C88A32]"; // Borderline brushed ochre
              }

              const isHovered = hoveredBranchIdx === idx;
              const marginSign = branch.margin >= 0 ? "+" : "";
              const statusText =
                branch.status === "eligible"
                  ? "above cutoff (Eligible)"
                  : branch.status === "borderline"
                  ? "(Borderline)"
                  : "(Out of reach)";

              return (
                <div
                  key={branch.name + "-" + idx}
                  onMouseEnter={() => setHoveredBranchIdx(idx)}
                  onMouseLeave={() => setHoveredBranchIdx(null)}
                  className="group relative flex items-center gap-3 py-0.5"
                >
                  {/* Left Branch Label */}
                  <div className="w-32 sm:w-44 shrink-0 text-right pr-2">
                    <span className="text-xs sm:text-[13px] font-medium text-[#2C3632] group-hover:text-[#16382E] group-hover:font-semibold transition-all truncate block">
                      {branch.name}
                    </span>
                  </div>

                  {/* Bar Track */}
                  <div className="relative flex-1 h-6 flex items-center rounded-r-full bg-[#F9F7F1]/70">
                    <div
                      className={
                        "h-5 rounded-r-full transition-all duration-300 " +
                        barColorClass +
                        (isHovered ? " brightness-105 ring-2 ring-[#16382E]/30" : "")
                      }
                      style={{ width: widthPct + "%" }}
                    />
                    <span className="ml-2 text-xs font-bold text-[#16382E] shrink-0">
                      {branch.effectiveCutoff}
                      {isBoards ? "%" : ""}
                    </span>

                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div className="absolute left-6 -top-12 z-30 pointer-events-none rounded-xl border border-[#A67C46]/50 bg-[#16382E] px-3.5 py-2 text-xs text-white shadow-xl whitespace-nowrap">
                        <p className="font-bold text-white">
                          {branch.fullName}{" "}
                          {hasReservationSupport ? "(" + selectedCategory + ")" : ""}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#E2E8E4]">
                          <span
                            className={
                              "inline-block h-2.5 w-2.5 rounded-xs " +
                              (branch.status === "eligible"
                                ? "bg-[#34D399]"
                                : branch.status === "borderline"
                                ? "bg-[#FBBF24]"
                                : "bg-[#9CA3AF]")
                            }
                          />
                          <span>
                            Safe Cutoff: {branch.effectiveCutoff}
                            {isBoards ? "%" : " pts"} | Your Margin: {marginSign}
                            {branch.margin}
                            {isBoards ? "%" : " pts"} {statusText}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical Dashed Score Line Overlay */}
          <div className="pointer-events-none absolute inset-y-0 left-32 sm:left-44 right-0">
            <div
              className="absolute top-0 bottom-0 border-l-2 border-dashed border-[#16382E] transition-all duration-300"
              style={{ left: scoreLinePct + "%" }}
            >
              <div className="absolute -top-6 -translate-x-1/2 rounded-full bg-[#16382E] px-3 py-0.5 text-[11px] font-bold text-white shadow-md whitespace-nowrap">
                Your Score: {activeScore}
                {isBoards ? "%" : ""}
              </div>
            </div>
          </div>

          {/* X-Axis Scale Row */}
          <div className="mt-4 flex items-center justify-between pl-32 sm:pl-44 text-[11px] font-semibold text-[#6C7A74]">
            <span>0</span>
            <span>{Math.round(activeScaleMax / 2)}</span>
            <span>{activeScaleMax}</span>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-[#E2DDD0] pt-4 text-xs font-medium text-[#4A5550]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#1E6B4E]" />
            <span>Eligible (Score ≥ {selectedCategory} Cutoff)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#C88A32]" />
            <span>
              Borderline (Within {activeBorderline} {isBoards ? "%" : "pts"})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#C4BEB0]" />
            <span>
              Out of Reach (&gt;{activeBorderline} {isBoards ? "%" : "pts"} gap)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Sliders & Bonus Toggle Card */}
      <div className="mt-4 rounded-2xl bg-white p-4 sm:p-6 border border-[#E2DDD0] shadow-2xs">
        {isBoards ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#16382E] mb-1.5">
                  <span>Physics (out of 100)</span>
                  <span className="rounded-md bg-[#F9F7F1] px-2 py-0.5 text-[#16382E] font-bold border border-[#E2DDD0]">
                    {boardScores.physics}
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={boardScores.physics}
                  onChange={(e) =>
                    setBoardScores((s) => ({ ...s, physics: Number(e.target.value) }))
                  }
                  className="w-full accent-[#194236] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#16382E] mb-1.5">
                  <span>Chemistry (out of 100)</span>
                  <span className="rounded-md bg-[#F9F7F1] px-2 py-0.5 text-[#16382E] font-bold border border-[#E2DDD0]">
                    {boardScores.chemistry}
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={boardScores.chemistry}
                  onChange={(e) =>
                    setBoardScores((s) => ({ ...s, chemistry: Number(e.target.value) }))
                  }
                  className="w-full accent-[#194236] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#16382E] mb-1.5">
                  <span>{studentStream === "PCB" ? "Biology" : "Mathematics"} (out of 100)</span>
                  <span className="rounded-md bg-[#F9F7F1] px-2 py-0.5 text-[#16382E] font-bold border border-[#E2DDD0]">
                    {boardScores.mathOrBio}
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={boardScores.mathOrBio}
                  onChange={(e) =>
                    setBoardScores((s) => ({ ...s, mathOrBio: Number(e.target.value) }))
                  }
                  className="w-full accent-[#194236] cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-[#E2DDD0]">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#16382E] mb-1.5">
                  <span>English Core (out of 100)</span>
                  <span className="rounded-md bg-[#F9F7F1] px-2 py-0.5 text-[#16382E] font-bold border border-[#E2DDD0]">
                    {boardScores.english}
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={boardScores.english}
                  onChange={(e) =>
                    setBoardScores((s) => ({ ...s, english: Number(e.target.value) }))
                  }
                  className="w-full accent-[#194236] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#16382E] mb-1.5">
                  <span>5th Elective / CS / PE / Bio (out of 100)</span>
                  <span className="rounded-md bg-[#F9F7F1] px-2 py-0.5 text-[#16382E] font-bold border border-[#E2DDD0]">
                    {boardScores.fifthSubject}
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={boardScores.fifthSubject}
                  onChange={(e) =>
                    setBoardScores((s) => ({ ...s, fifthSubject: Number(e.target.value) }))
                  }
                  className="w-full accent-[#194236] cursor-pointer"
                />
              </div>
            </div>

            {/* Practical Full Marks Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E2DDD0]">
              <button
                type="button"
                onClick={() => setBoardPracticalBoost((b) => !b)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className={
                    "relative h-6 w-11 rounded-full transition-colors " +
                    (boardPracticalBoost ? "bg-[#1E6B4E]" : "bg-[#C4BEB0]")
                  }
                >
                  <span
                    className={
                      "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-transform " +
                      (boardPracticalBoost ? "translate-x-5" : "translate-x-0")
                    }
                  />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#16382E]">
                    Simulate 30/30 Lab Practical & Internal Assessment Boost (+2% aggregate)
                  </p>
                  <p className="text-[11px] text-[#4A5550]">
                    Full practical marks often push borderline students past the 75% (GEN/OBC) or 65% (SC/ST) JoSAA bar
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Slider 1: Main Questions Attempted */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-[#16382E]">
                    Main Questions Attempted (max {profile.maxQuestions})
                  </span>
                  <span className="rounded-lg border border-[#E2DDD0] bg-[#F9F7F1] px-3 py-1 text-sm font-bold text-[#16382E]">
                    {attempted}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAttempted((a) => Math.max(10, a - 1))}
                    className="text-sm font-bold text-[#4A5550] hover:text-[#16382E] px-1.5 cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min="10"
                    max={profile.maxQuestions}
                    value={attempted}
                    onChange={(e) => setAttempted(Number(e.target.value))}
                    className="w-full accent-[#194236] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setAttempted((a) => Math.min(profile.maxQuestions, a + 1))}
                    className="text-sm font-bold text-[#4A5550] hover:text-[#16382E] px-1.5 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Slider 2: Overall Accuracy (%) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-[#16382E]">
                    Overall Accuracy (%)
                  </span>
                  <span className="rounded-lg border border-[#E2DDD0] bg-[#F9F7F1] px-3 py-1 text-sm font-bold text-[#16382E]">
                    {accuracy}%
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAccuracy((acc) => Math.max(30, acc - 1))}
                    className="text-sm font-bold text-[#4A5550] hover:text-[#16382E] px-1.5 cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={accuracy}
                    onChange={(e) => setAccuracy(Number(e.target.value))}
                    className="w-full accent-[#194236] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setAccuracy((acc) => Math.min(100, acc + 1))}
                    className="text-sm font-bold text-[#4A5550] hover:text-[#16382E] px-1.5 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bonus Section Toggle Switch */}
            {profile.bonusConfig && (
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#E2DDD0] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      examId === "bitsat" &&
                      !bonusEnabled &&
                      attempted < profile.maxQuestions
                    ) {
                      setAttempted(profile.maxQuestions);
                    }
                    setBonusEnabled((b) => !b);
                  }}
                  className="flex items-center gap-3 text-left cursor-pointer"
                >
                  <div
                    className={
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors " +
                      (bonusEnabled ? "bg-[#1E6B4E]" : "bg-[#C4BEB0]")
                    }
                  >
                    <span
                      className={
                        "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-transform " +
                        (bonusEnabled ? "translate-x-5" : "translate-x-0")
                      }
                    />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-[#16382E]">
                      {profile.bonusConfig.label}
                    </p>
                    <p className="text-[11px] text-[#4A5550]">
                      {attempted >= profile.maxQuestions || bonusEnabled
                        ? profile.bonusConfig.subtextUnlock
                        : profile.bonusConfig.subtextLocked}
                    </p>
                  </div>
                </button>

                {onAskAi && (
                  <button
                    type="button"
                    onClick={() =>
                      onAskAi(
                        "In the Disha Score Predictor for " +
                          profile.title +
                          " (" +
                          selectedCategory +
                          " category), my simulated score is " +
                          activeScore +
                          " (" +
                          attempted +
                          " questions attempted at " +
                          accuracy +
                          "% accuracy), making me eligible for " +
                          eligibleBranches.length +
                          " of " +
                          evaluatedBranches.length +
                          " options in " +
                          currentTabObj.label +
                          ". How can I improve my accuracy and question selection to jump to the next cutoff tier?"
                      )
                    }
                    className="shrink-0 rounded-full bg-[#194236] px-4 py-2 text-xs font-bold text-white hover:bg-[#123027] transition-colors cursor-pointer"
                  >
                    Analyze Score with Gemini 2.5 →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DropYearSimulator({ defaultTier1Pay = 22, examName = "JEE / NEET / Target", onAskAi }) {
  const [tier2StartCtc, setTier2StartCtc] = useState(9);
  const [tier1TargetCtc, setTier1TargetCtc] = useState(defaultTier1Pay);
  const [dropCrackProb, setDropCrackProb] = useState(35);
  const [upskillStrategy, setUpskillStrategy] = useState("switch-yr3");
  const [dropCoachingCostLakhs, setDropCoachingCostLakhs] = useState(2.5);

  useEffect(() => {
    if (defaultTier1Pay) {
      setTier1TargetCtc(Math.min(45, Math.max(12, defaultTier1Pay)));
    }
  }, [defaultTier1Pay]);

  const simulation = useMemo(() => {
    // 10-Year Timeline after Class 12 (Years 1 to 10; Ages 18 to 28)
    // Path A: Join Tier-2 College Now (4 yrs college, earns in Years 5, 6, 7, 8, 9, 10 -> 6 earning years)
    // Path B: Take 1 Drop Year (1 yr coaching + 4 yrs college, earns in Years 6, 7, 8, 9, 10 -> 5 earning years)
    const years = [];
    let cumPathA = -10; // ~10L tuition over 4 yrs
    let cumPathBSuccess = -(10 + dropCoachingCostLakhs); // tuition + drop coaching cost

    for (let yr = 1; yr <= 10; yr++) {
      const age = 17 + yr;
      let payA = 0;
      let payB = 0;

      // Path A earning years: Yr 5 to Yr 10 (Job Years 1 to 6)
      if (yr >= 5) {
        const jobYrA = yr - 4;
        if (upskillStrategy === "switch-yr3") {
          // Product/Tech switch in Job Year 3 gives 45% jump
          const mult = jobYrA >= 3 ? 1.45 * Math.pow(1.14, jobYrA - 1) : Math.pow(1.12, jobYrA - 1);
          payA = Number((tier2StartCtc * mult).toFixed(1));
        } else if (upskillStrategy === "masters-gate-cat") {
          // Works Yr 5, takes Masters in Yr 6-7, re-enters at Tier-1 pay in Yr 8-10
          if (yr === 5) payA = tier2StartCtc;
          else if (yr === 6 || yr === 7) payA = -4; // Masters tuition net of stipend
          else payA = Number((tier1TargetCtc * 1.15 * Math.pow(1.15, yr - 8)).toFixed(1));
        } else {
          // Organic 13% annual growth
          payA = Number((tier2StartCtc * Math.pow(1.13, jobYrA - 1)).toFixed(1));
        }
      }

      // Path B (Successful Drop) earning years: Yr 6 to Yr 10 (Job Years 1 to 5)
      if (yr >= 6) {
        const jobYrB = yr - 5;
        payB = Number((tier1TargetCtc * Math.pow(1.14, jobYrB - 1)).toFixed(1));
      }

      cumPathA = Number((cumPathA + payA).toFixed(1));
      cumPathBSuccess = Number((cumPathBSuccess + payB).toFixed(1));

      years.push({
        yr,
        age,
        payA,
        payB,
        cumPathA,
        cumPathBSuccess
      });
    }

    const total10YrPathA = years[9].cumPathA;
    const total10YrPathBSuccess = years[9].cumPathBSuccess;
    // Expected Value of Drop Year = (Prob * Success) + ((1 - Prob) * Delayed Path A)
    const delayedPathATotal = Number((total10YrPathA - years[9].payA - dropCoachingCostLakhs).toFixed(1));
    const expectedValueDrop = Number(
      (
        (dropCrackProb / 100) * total10YrPathBSuccess +
        ((100 - dropCrackProb) / 100) * delayedPathATotal
      ).toFixed(1)
    );

    const late20sLostYearCost = years[9].payA; // What 1 lost year at age 27-28 actually costs
    const breakEvenRow = years.find((r) => r.yr >= 6 && r.cumPathBSuccess >= r.cumPathA);
    const breakEvenAge = breakEvenRow ? "Age " + breakEvenRow.age + " (Yr " + breakEvenRow.yr + ")" : "Beyond Age 28 (>10 Yrs)";

    let verdictTitle = "Join Now + Upskill Wins on Risk-Adjusted 10-Yr Wealth";
    let verdictTone = "emerald";
    if (expectedValueDrop > total10YrPathA + 8 && dropCrackProb >= 45) {
      verdictTitle = "Drop Year Mathematically Justified (High Target Gap & High Probability)";
      verdictTone = "amber";
    }

    return {
      years,
      total10YrPathA,
      total10YrPathBSuccess,
      expectedValueDrop,
      late20sLostYearCost,
      breakEvenAge,
      verdictTitle,
      verdictTone
    };
  }, [tier2StartCtc, tier1TargetCtc, dropCrackProb, upskillStrategy, dropCoachingCostLakhs]);

  const maxCumBar = Math.max(
    ...simulation.years.map((y) => Math.max(Math.abs(y.cumPathA), Math.abs(y.cumPathBSuccess))),
    40
  );

  return (
    <div className="rounded-3xl border border-[#E2DDD0] bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E2DDD0] pb-5">
        <div>
          <p className="eyebrow-tracked text-[#A67C46]">
            10-YEAR COMPOUNDING & OPPORTUNITY COST ENGINE
          </p>
          <h3 className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-medium text-[#16382E]">
            &ldquo;Take a Drop Year vs. Join Now&rdquo;{" "}
            <span className="italic text-[#A67C46]">10-Year Simulator.</span>
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#4A5550]">
            A drop year doesn&apos;t cost your Year-1 starting salary—it costs 1 year of{" "}
            <strong className="text-[#16382E]">peak Age-27 compounding</strong>. Compare both paths
            objectively:
          </p>
        </div>

        <span
          className={
            "self-start sm:self-auto rounded-full px-4 py-1.5 text-xs font-bold " +
            (simulation.verdictTone === "emerald"
              ? "bg-[#194236] text-white"
              : "bg-[#A67C46] text-white")
          }
        >
          {simulation.verdictTitle}
        </span>
      </div>

      {/* Interactive Controls Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E2DDD0] bg-[#F9F7F1] p-4">
          <div className="flex justify-between text-xs font-bold text-[#16382E]">
            <span>Path A: Current College CTC</span>
            <span>₹{tier2StartCtc} LPA</span>
          </div>
          <input
            type="range"
            min="4"
            max="20"
            step="1"
            value={tier2StartCtc}
            onChange={(e) => setTier2StartCtc(Number(e.target.value))}
            className="mt-2.5 w-full accent-[#194236] cursor-pointer"
          />
          <p className="mt-1 text-[11px] text-[#4A5550]">
            Tier-2 / State CET / Private seat in hand now
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2DDD0] bg-[#F9F7F1] p-4">
          <div className="flex justify-between text-xs font-bold text-[#16382E]">
            <span>Path B: Drop Target CTC</span>
            <span>₹{tier1TargetCtc} LPA</span>
          </div>
          <input
            type="range"
            min="12"
            max="45"
            step="1"
            value={tier1TargetCtc}
            onChange={(e) => setTier1TargetCtc(Number(e.target.value))}
            className="mt-2.5 w-full accent-[#A67C46] cursor-pointer"
          />
          <p className="mt-1 text-[11px] text-[#4A5550]">
            Expected starting pay if Drop Year succeeds ({examName})
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2DDD0] bg-[#F9F7F1] p-4">
          <div className="flex justify-between text-xs font-bold text-[#16382E]">
            <span>Drop Success Probability</span>
            <span>{dropCrackProb}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="85"
            step="5"
            value={dropCrackProb}
            onChange={(e) => setDropCrackProb(Number(e.target.value))}
            className="mt-2.5 w-full accent-[#194236] cursor-pointer"
          />
          <p className="mt-1 text-[11px] text-[#4A5550]">
            Realistic odds of jumping to Tier-1 next year
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2DDD0] bg-[#F9F7F1] p-4">
          <label className="block text-xs font-bold text-[#16382E] mb-1.5">
            Path A Upskill / Pivot Strategy
          </label>
          <select
            value={upskillStrategy}
            onChange={(e) => setUpskillStrategy(e.target.value)}
            className="w-full rounded-xl border border-[#E2DDD0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#16382E] focus:border-[#16382E] focus:outline-none cursor-pointer"
          >
            <option value="switch-yr3">Off-Campus Product Switch in Yr 3 (+45%)</option>
            <option value="masters-gate-cat">GATE / CAT / MS Pivot After Degree</option>
            <option value="organic">Steady Organic Growth (13% p.a.)</option>
          </select>
          <p className="mt-1.5 text-[11px] text-[#4A5550]">
            How you use the 1-year headstart in Path A
          </p>
        </div>
      </div>

      {/* 4 Key KPI Summary Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#194236]/25 bg-[#194236]/[0.05] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#194236]">
            Path A: Join Now (10-Yr Net)
          </p>
          <p className="mt-1 font-serif-editorial text-2xl font-semibold text-[#16382E]">
            ₹{simulation.total10YrPathA} Lakhs
          </p>
          <p className="mt-0.5 text-[11px] text-[#4A5550]">
            6 full earning years by Age 27 (Zero year lost)
          </p>
        </div>

        <div className="rounded-2xl border border-[#A67C46]/35 bg-[#A67C46]/10 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#87602F]">
            Path B: Drop Year (If Cracked)
          </p>
          <p className="mt-1 font-serif-editorial text-2xl font-semibold text-[#16382E]">
            ₹{simulation.total10YrPathBSuccess} Lakhs
          </p>
          <p className="mt-0.5 text-[11px] text-[#4A5550]">
            5 earning years by Age 27 (100% success case)
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2DDD0] bg-[#F9F7F1] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">
            Probability-Adjusted Drop EV
          </p>
          <p className="mt-1 font-serif-editorial text-2xl font-semibold text-[#16382E]">
            ₹{simulation.expectedValueDrop} Lakhs
          </p>
          <p className="mt-0.5 text-[11px] text-[#4A5550]">
            Weighted for {dropCrackProb}% crack odds
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2DDD0] bg-[#F9F7F1] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">
            Drop Break-Even Age
          </p>
          <p className="mt-1 font-serif-editorial text-xl sm:text-2xl font-semibold text-[#16382E]">
            {simulation.breakEvenAge}
          </p>
          <p className="mt-0.5 text-[11px] text-[#4A5550]">
            1-Yr Delay costs ~₹{simulation.late20sLostYearCost}L at Age 27
          </p>
        </div>
      </div>

      {/* Visual Year-by-Year Cumulative Wealth Comparison Bars (Years 4 to 10) */}
      <div className="mt-6 rounded-2xl border border-[#D8D0C0] bg-[#F3EFE6] p-5 text-[#16382E]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#A67C46]">
              YEAR-BY-YEAR CUMULATIVE EARNINGS TRAJECTORY (AGE 21 TO AGE 27)
            </p>
            <p className="text-xs text-[#4A5550]">
              Comparing Path A (Join Now + Upskill) vs Path B (Drop Year Success) net cumulative cashflow
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#16382E]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E6B4E]" />
              Path A: Join Now
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C88A32]" />
              Path B: Drop Year
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {simulation.years.slice(3).map((row) => {
            const pctA = Math.max(4, Math.min(100, (Math.max(0, row.cumPathA) / maxCumBar) * 100));
            const pctB = Math.max(4, Math.min(100, (Math.max(0, row.cumPathBSuccess) / maxCumBar) * 100));
            return (
              <div key={row.yr} className="grid grid-cols-12 items-center gap-3 text-xs">
                <div className="col-span-3 sm:col-span-2 text-[#16382E] font-bold">
                  Yr {row.yr} (Age {row.age})
                </div>
                <div className="col-span-9 sm:col-span-10 space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3.5 rounded-r-full bg-[#1E6B4E] transition-all duration-300"
                      style={{ width: pctA + "%" }}
                    />
                    <span className="text-[11px] font-bold text-[#1E6B4E]">
                      ₹{row.cumPathA}L (Annual: ₹{row.payA}L)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3.5 rounded-r-full bg-[#C88A32] transition-all duration-300"
                      style={{ width: pctB + "%" }}
                    />
                    <span className="text-[11px] font-bold text-[#9A6519]">
                      ₹{row.cumPathBSuccess}L (Annual: ₹{row.payB}L)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {onAskAi && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2DDD0]">
          <p className="text-xs text-[#4A5550]">
            Unsure whether your mock scores justify a drop year or if you should join your current
            college offer?
          </p>
          <button
            type="button"
            onClick={() =>
              onAskAi(
                "Help me decide between taking a Drop Year vs Joining Now. My current college option offers ~INR " +
                  tier2StartCtc +
                  " LPA starting pay, while my drop-year target offers ~INR " +
                  tier1TargetCtc +
                  " LPA with an estimated " +
                  dropCrackProb +
                  "% success probability. Give me a brutally honest recommendation."
              )
            }
            className="rounded-full bg-[#194236] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#123027] cursor-pointer"
          >
            Debate Drop vs. Join Now with Gemini 2.5 Pro →
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [studentStream, setStudentStream] = useState("PCMB");
  const [quizAnswers, setQuizAnswers] = useState({ q1: "PCMB" });
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [streamFilter, setStreamFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All Domains");

  // 4-Bucket Portfolio State: { examId, bucket: "Dream" | "Target" | "Wildcard" | "Backup" }
  const [portfolioItems, setPortfolioItems] = useState([
    { examId: "jee-main-adv", bucket: "Dream" },
    { examId: "iiser-iat", bucket: "Target" },
    { examId: "ipmat-jipmat", bucket: "Wildcard" },
    { examId: "cuet-science-biotech", bucket: "Backup" }
  ]);

  // Side-by-Side Comparator State (Up to 3 exam IDs)
  const [compareIds, setCompareIds] = useState(["jee-main-adv", "iiser-iat", "ipmat-jipmat"]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Calendar Filter State
  const [calendarOnlyPortfolio, setCalendarOnlyPortfolio] = useState(false);

  // Active Modals
  const [activeTrajectoryExam, setActiveTrajectoryExam] = useState(null);
  const [trajectoryModalTab, setTrajectoryModalTab] = useState("trajectory");
  const [studioPredictorExamId, setStudioPredictorExamId] = useState("bitsat");
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);
  const [isFamilyDossierOpen, setIsFamilyDossierOpen] = useState(false);

  // Education Loan & Break-Even Calculator State inside Trajectory Modal
  const [loanAmountLakhs, setLoanAmountLakhs] = useState(12);
  const [loanInterestRate, setLoanInterestRate] = useState(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState(7);

  // Live Gemini 2.5 AI Career Counsellor State
  const [isCounsellorOpen, setIsCounsellorOpen] = useState(false);
  const [isCounsellorWide, setIsCounsellorWide] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-pro");
  const [customApiKey, setCustomApiKey] = useState(() =>
    safeStorageGet("disha_gemini_api_key", DEFAULT_GEMINI_API_KEY)
  );
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showQuickPromptsBar, setShowQuickPromptsBar] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiNotice, setApiNotice] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      role: "assistant",
      modelUsed: "gemini-2.5-pro",
      isFallback: false,
      text: "Hi! I am your Disha AI Career Mentor. Whether you want to just chat about exam stress, figure out a backup plan, or compare 10-year salaries across PCM, PCB, and PCMB—I'm here. What is on your mind today?"
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    safeStorageSet("disha_gemini_api_key", customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    if (activeTrajectoryExam) {
      const defaultFee = activeTrajectoryExam.avgTotalFeeLakhs || 10;
      setLoanAmountLakhs(Math.min(80, Math.max(1, defaultFee)));
      setLoanInterestRate(8.5);
      setLoanTenureYears(7);
    }
  }, [activeTrajectoryExam]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveTrajectoryExam(null);
        setIsShortlistModalOpen(false);
        setIsCompareModalOpen(false);
        setIsFamilyDossierOpen(false);
        setIsCounsellorOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isCounsellorOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isCounsellorOpen, isGenerating]);

  const enrichedExamsData = useMemo(() => {
    return EXAMS_DATA.map((exam) => ({
      ...exam,
      ...(EXAM_METADATA_ENRICHMENT[exam.id] || {
        prepSynergy: "NCERT + Aptitude Aligned",
        avgTotalFeeLakhs: 10,
        avgEntrySalaryLakhs: 12,
        avgMidSalaryLakhs: 28,
        defaultBucket: "Target",
        examMonth: "May"
      })
    }));
  }, []);

  const quizResults = useMemo(() => {
    if (!quizCompleted) return null;
    return computeQuizResults(quizAnswers, studentStream);
  }, [quizCompleted, quizAnswers, studentStream]);

  const shortlistedIds = useMemo(
    () => portfolioItems.map((item) => item.examId),
    [portfolioItems]
  );

  const portfolioExams = useMemo(() => {
    return portfolioItems
      .map((item) => {
        const exam = enrichedExamsData.find((e) => e.id === item.examId);
        if (!exam) return null;
        return { ...exam, bucket: item.bucket };
      })
      .filter(Boolean);
  }, [portfolioItems, enrichedExamsData]);

  const compareExamsList = useMemo(() => {
    return compareIds
      .map((id) => enrichedExamsData.find((e) => e.id === id))
      .filter(Boolean);
  }, [compareIds, enrichedExamsData]);

  const portfolioDiagnostics = useMemo(() => {
    const counts = { Dream: 0, Target: 0, Wildcard: 0, Backup: 0 };
    portfolioExams.forEach((e) => {
      counts[e.bucket] = (counts[e.bucket] || 0) + 1;
    });
    const total = portfolioExams.length;
    if (total === 0) {
      return {
        status: "empty",
        tone: "amber",
        title: "Empty Exam Portfolio",
        message: "Add 3 to 5 exams across Dream, Target, Wildcard, and Backup buckets to build a resilient Class 12 plan."
      };
    }
    if (counts.Dream > 0 && counts.Backup === 0 && counts.Target === 0) {
      return {
        status: "top-heavy",
        tone: "red",
        title: "High-Risk Top-Heavy Portfolio Alert",
        message: "You have only shortlisted ultra-competitive Dream exams (<2% acceptance) with zero Target or Backup safety nets. Add a State CET, CUET-UG, or IAT/NISER target."
      };
    }
    if (counts.Backup === 0) {
      return {
        status: "no-backup",
        tone: "amber",
        title: "Missing Safety Backup Bucket",
        message: "Strong Dream/Target selection, but you lack a high-acceptance Backup exam (such as CUET-UG or State CET) to protect against single-day exam variance."
      };
    }
    if (counts.Dream >= 1 && counts.Target >= 1 && counts.Backup >= 1) {
      return {
        status: "balanced",
        tone: "emerald",
        title: "Well-Balanced 4-Bucket Strategy",
        message: "Your portfolio combines high-ceiling Dream reach, realistic core Targets, and a dependable Backup safety net."
      };
    }
    return {
      status: "developing",
      tone: "amber",
      title: "Developing Portfolio Strategy",
      message: "Aim for at least 1 Dream, 1–2 Target, 1 Wildcard pivot, and 1 Backup exam for complete peace of mind."
    };
  }, [portfolioExams]);

  const loanCalculation = useMemo(() => {
    if (!activeTrajectoryExam) return null;
    const principal = loanAmountLakhs * 100000;
    const monthlyRate = loanInterestRate / 12 / 100;
    const months = loanTenureYears * 12;
    const emi =
      monthlyRate > 0
        ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
        : principal / months;
    const totalRepaymentLakhs = (emi * months) / 100000;
    const totalInterestLakhs = Math.max(0, totalRepaymentLakhs - loanAmountLakhs);

    const entryAnnualLakhs = activeTrajectoryExam.avgEntrySalaryLakhs || 10;
    const midAnnualLakhs = activeTrajectoryExam.avgMidSalaryLakhs || 22;
    const estMonthlyTakeHome = (entryAnnualLakhs * 100000 * 0.78) / 12;
    const emiBurdenPct = estMonthlyTakeHome > 0 ? Math.round((emi / estMonthlyTakeHome) * 100) : 0;

    const avgAnnualSavingsLakhs = (entryAnnualLakhs * 0.35 + midAnnualLakhs * 0.4) / 2;
    const breakEvenYears =
      avgAnnualSavingsLakhs > 0
        ? Math.max(0.5, Number((totalRepaymentLakhs / avgAnnualSavingsLakhs).toFixed(1)))
        : 5.0;

    let verdictLabel = "Fast Payback (< 2.5 Yrs)";
    let verdictTone = "emerald";
    if (emiBurdenPct > 45 || breakEvenYears > 4.5) {
      verdictLabel = "High Debt Load — Target Scholarship / Govt Quota";
      verdictTone = "red";
    } else if (emiBurdenPct > 25 || breakEvenYears > 2.5) {
      verdictLabel = "Moderate EMI Load — Manageable Post-Grad Cashflow";
      verdictTone = "amber";
    }

    return {
      emi: Math.round(emi),
      totalRepaymentLakhs: totalRepaymentLakhs.toFixed(1),
      totalInterestLakhs: totalInterestLakhs.toFixed(1),
      emiBurdenPct,
      breakEvenYears,
      verdictLabel,
      verdictTone
    };
  }, [activeTrajectoryExam, loanAmountLakhs, loanInterestRate, loanTenureYears]);

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrichedExamsData.filter((exam) => {
      const matchesStream = streamFilter === "All" || exam.streamCategory === streamFilter;
      const matchesDomain = domainFilter === "All Domains" || exam.domain === domainFilter;
      const matchesSearch =
        !q ||
        exam.name.toLowerCase().includes(q) ||
        exam.degree.toLowerCase().includes(q) ||
        exam.conductingBody.toLowerCase().includes(q) ||
        exam.domain.toLowerCase().includes(q) ||
        exam.prepSynergy.toLowerCase().includes(q) ||
        exam.summary.toLowerCase().includes(q);
      return matchesStream && matchesDomain && matchesSearch;
    });
  }, [searchQuery, streamFilter, domainFilter, enrichedExamsData]);

  const getExamBucket = (examId) => {
    const found = portfolioItems.find((item) => item.examId === examId);
    return found ? found.bucket : null;
  };

  const setExamBucket = (examId, bucket) => {
    setPortfolioItems((prev) => {
      const exists = prev.find((item) => item.examId === examId);
      if (exists && exists.bucket === bucket) {
        return prev;
      }
      if (exists) {
        return prev.map((item) => (item.examId === examId ? { ...item, bucket } : item));
      }
      return [...prev, { examId, bucket }];
    });
  };

  const toggleShortlist = (examId, preferredBucket) => {
    setPortfolioItems((prev) => {
      const exists = prev.find((item) => item.examId === examId);
      if (exists) {
        return prev.filter((item) => item.examId !== examId);
      }
      const examObj = enrichedExamsData.find((e) => e.id === examId);
      const bucketToUse = preferredBucket || (examObj ? examObj.defaultBucket : "Target");
      return [...prev, { examId, bucket: bucketToUse }];
    });
  };

  const toggleCompareExam = (examId) => {
    setCompareIds((prev) => {
      if (prev.includes(examId)) {
        return prev.filter((id) => id !== examId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), examId];
      }
      return [...prev, examId];
    });
  };

  const handleStreamChange = (newStream) => {
    setStudentStream(newStream);
    setQuizAnswers((prev) => ({ ...prev, q1: newStream }));
  };

  const handleSelectQuizOption = (questionId, optionId) => {
    if (questionId === "q1") {
      setStudentStream(optionId);
    }
    const updatedAnswers = { ...quizAnswers, [questionId]: optionId };
    setQuizAnswers(updatedAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizCompleted(false);
    setCurrentStep(0);
    setQuizAnswers({ q1: studentStream });
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const buildSystemInstruction = () => {
    const portfolioStr =
      portfolioExams.length > 0
        ? portfolioExams
            .map((e) => e.bucket + ": " + e.name + " (" + e.degree + ", Fee ~INR " + e.avgTotalFeeLakhs + "L)")
            .join("; ")
        : "None added yet";

    let quizSummary = "Student has not taken the 7-question psychometric quiz yet.";
    if (quizResults) {
      const scoresStr = TRAIT_KEYS.map(
        (t) => t + ": " + quizResults.percentages[t] + "%"
      ).join(", ");
      const topMatchesStr = quizResults.topMatches
        .map((m) => m.name + " (" + m.fitScore + "% fit)")
        .join(", ");
      quizSummary =
        "Primary Archetype: " +
        quizResults.archetype.title +
        ". Trait Scores: [" +
        scoresStr +
        "]. Top Stream-Matched Exams: [" +
        topMatchesStr +
        "].";
    }

    return (
      "You are the Lead AI Career Mentor at Disha Editorial—a warm, genuine, empathetic, and data-driven Indian career counsellor for Class 12 Science students. " +
      "Student Context -> Active Stream: " +
      studentStream +
      ". " +
      quizSummary +
      " Student's 4-Bucket Portfolio: [" +
      portfolioStr +
      "]. " +
      "CRITICAL CONVERSATIONAL BEHAVIOR RULES: " +
      "1. Match the student's message length and tone! If the student simply says 'hi', 'hello', 'hey', or a short casual greeting/check-in, DO NOT dump a long pre-written essay or rigid bulleted report. Respond naturally and warmly in 2 to 3 short sentences—greet them, casually acknowledge their stream (" +
      studentStream +
      "), and genuinely ask what specific problem, exam stress, parent pressure, or career confusion is on their mind right now. " +
      "2. When the student asks a substantive career or exam question, give realistic, candid, structured guidance referencing Indian college fees (INR Lakhs), competition ratios, syllabus overlap, and 10-year career progression (Years 0-2, Years 3-6, Years 7-10+). " +
      "3. Strictly respect Class 12 stream eligibility (never recommend PCM-only exams like JEE/BITSAT/ISI to a PCB student, and never recommend PCB-only exams like NEET to a PCM student)."
    );
  };

  const sendMessageToCounsellor = async (overrideText, forceModel) => {
    const textToSend = (overrideText !== undefined ? overrideText : chatInput).trim();
    if (!textToSend || isGenerating) return;

    const modelToUse = forceModel || selectedModel;
    if (forceModel && forceModel !== selectedModel) {
      setSelectedModel(forceModel);
    }

    // Auto-collapse settings and prompt popover so the chat viewport stays spacious
    setShowApiSettings(false);
    setShowQuickPromptsBar(false);

    const userMsg = {
      id: "u-" + Date.now(),
      role: "user",
      text: textToSend
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (overrideText === undefined) {
      setChatInput("");
    }
    setApiNotice("");
    setIsGenerating(true);

    const apiKey = "";
    const activeApiKey = (customApiKey || "").trim() || apiKey;

    const historyContents = nextMessages
      .filter((m) => m.id !== "welcome-msg")
      .slice(-10)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

    const payload = {
      systemInstruction: {
        parts: [{ text: buildSystemInstruction() }]
      },
      contents: historyContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1100
      }
    };

    const candidateModels = [
      modelToUse,
      modelToUse === "gemini-2.5-pro" ? "gemini-2.5-flash" : "gemini-2.5-pro",
      "gemini-3-flash-preview"
    ];

    let replyText = "";
    let resolvedModelLabel = modelToUse;

    for (let i = 0; i < candidateModels.length; i++) {
      const currentCandidate = candidateModels[i];
      try {
        const apiUrl =
          "https://generativelanguage.googleapis.com/v1beta/models/" +
          encodeURIComponent(currentCandidate) +
          ":generateContent?key=" +
          encodeURIComponent(activeApiKey);

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const extracted =
            data &&
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] &&
            data.candidates[0].content.parts[0].text
              ? data.candidates[0].content.parts[0].text
              : "";
          if (extracted) {
            replyText = extracted;
            resolvedModelLabel = modelToUse;
            break;
          }
        }
      } catch (err) {
        // Continue to next candidate model
      }
    }

    if (replyText) {
      setMessages((prev) => [
        ...prev,
        {
          id: "a-" + Date.now(),
          role: "assistant",
          modelUsed: resolvedModelLabel,
          isFallback: false,
          text: replyText
        }
      ]);
    } else {
      const conversationalReply = generateConversationalFallback(textToSend, {
        studentStream,
        quizResults,
        portfolioExams
      });
      setMessages((prev) => [
        ...prev,
        {
          id: "a-" + Date.now(),
          role: "assistant",
          modelUsed: modelToUse,
          isFallback: true,
          text: conversationalReply
        }
      ]);
    }

    setIsGenerating(false);
  };

  const openCounsellorWithPrompt = (promptText, preferredModel) => {
    setIsCounsellorOpen(true);
    setActiveTrajectoryExam(null);
    setIsShortlistModalOpen(false);
    setIsCompareModalOpen(false);
    setIsFamilyDossierOpen(false);
    setTimeout(() => {
      sendMessageToCounsellor(promptText, preferredModel || "gemini-2.5-pro");
    }, 120);
  };

  const resetCounsellorChat = () => {
    setApiNotice("");
    setShowQuickPromptsBar(false);
    setMessages([
      {
        id: "welcome-msg",
        role: "assistant",
        modelUsed: selectedModel,
        isFallback: false,
        text: "Hi! I am your Disha AI Career Mentor. Whether you want to just chat about exam stress, figure out a backup plan, or compare 10-year salaries across PCM, PCB, and PCMB—I'm here. What is on your mind today?"
      }
    ]);
  };

  return (
    <div className="min-h-screen disha-ivory-canvas text-[#16382E] antialiased selection:bg-[#16382E] selection:text-white pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #F9F7F1;
          color: #16382E;
        }

        .font-serif-editorial {
          font-family: 'Playfair Display', Georgia, serif;
        }

        .font-sans-editorial {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .disha-ivory-canvas {
          background-color: #F9F7F1;
          background-image: radial-gradient(#DCD6C8 1.25px, transparent 1.25px);
          background-size: 22px 22px;
        }

        .eyebrow-tracked {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        @keyframes dishaPopupEntrance {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.95);
          }
          70% {
            opacity: 1;
            transform: translateY(-3px) scale(1.015);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .disha-popup-card {
          animation: dishaPopupEntrance 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
          transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.28s ease,
                      border-color 0.25s ease;
        }

        .disha-popup-card:hover {
          transform: translateY(-7px) scale(1.025);
          box-shadow: 0 18px 34px -10px rgba(22, 56, 46, 0.14);
          border-color: #A67C46;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-family-dossier,
          #printable-family-dossier * {
            visibility: visible;
          }
          #printable-family-dossier {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #FFFFFF !important;
            color: #16382E !important;
            box-shadow: none !important;
            border: none !important;
            padding: 16px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* STICKY EDITORIAL HEADER */}
      <header className="sticky top-0 z-30 border-b border-[#E2DDD0] bg-[#F9F7F1]/92 backdrop-blur-md no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#16382E]/15 bg-white shadow-xs transition-transform group-hover:scale-105">
              <svg
                className="h-5 w-5 text-[#16382E]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <div>
              <span className="font-serif-editorial text-xl font-semibold tracking-tight text-[#16382E]">
                Disha <span className="italic font-normal text-[#A67C46]">Editorial</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium uppercase tracking-[0.14em] text-[#4A5550]">
                Class 12 Science Trajectory Atlas
              </span>
            </div>
          </a>

          <nav className="hidden xl:flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection("interest-quiz")}
              className="text-xs font-semibold text-[#4A5550] transition-colors hover:text-[#16382E] cursor-pointer"
            >
              Aptitude Quiz
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("score-predictor-studio")}
              className="text-xs font-semibold text-[#16382E] transition-colors hover:text-[#A67C46] cursor-pointer flex items-center gap-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              Score & Cutoff Predictor
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("exam-encyclopedia")}
              className="text-xs font-semibold text-[#4A5550] transition-colors hover:text-[#16382E] cursor-pointer"
            >
              26-Exam Atlas
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("drop-year-simulator")}
              className="text-xs font-semibold text-[#4A5550] transition-colors hover:text-[#16382E] cursor-pointer"
            >
              Drop Year vs. Join Now
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("portfolio-board")}
              className="text-xs font-semibold text-[#4A5550] transition-colors hover:text-[#16382E] cursor-pointer"
            >
              4-Bucket Portfolio ({portfolioItems.length})
            </button>
            <div className="h-4 w-px bg-[#E2DDD0]" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2DDD0] bg-white px-3 py-1 text-xs font-semibold text-[#16382E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A67C46]" />
              Stream: {studentStream}
            </span>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setIsFamilyDossierOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E2DDD0] bg-white px-3 py-2 text-xs font-semibold text-[#16382E] transition-colors hover:border-[#A67C46] cursor-pointer"
              title="Open Printable Parent & Family Dossier"
            >
              <svg
                className="h-3.5 w-3.5 text-[#A67C46]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect width="12" height="8" x="6" y="14" />
              </svg>
              <span className="hidden md:inline">Family Dossier</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E2DDD0] bg-white px-3 py-2 text-xs font-semibold text-[#16382E] transition-colors hover:border-[#A67C46] cursor-pointer"
              title="Compare up to 3 exams side-by-side"
            >
              <span className="hidden sm:inline">Compare</span>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F9F7F1] px-1.5 text-[11px] font-bold text-[#16382E] border border-[#E2DDD0]">
                {compareIds.length}/3
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsShortlistModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E2DDD0] bg-white px-3 py-2 text-xs font-semibold text-[#16382E] transition-colors hover:border-[#A67C46] cursor-pointer"
              title="Manage your 4-Bucket Portfolio"
            >
              <span className="hidden sm:inline">Portfolio</span>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F9F7F1] px-1.5 text-[11px] font-bold text-[#16382E] border border-[#E2DDD0]">
                {portfolioItems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsCounsellorOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#194236] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#123027] cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-[#5CE6A0] animate-pulse" />
              <span>AI Mentor</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="top" className="relative overflow-hidden border-b border-[#E2DDD0]/80 no-print">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span
                className="inline-block bg-[#A67C46]"
                style={{ width: "24px", height: "1.5px" }}
              />
              <span className="eyebrow-tracked text-[#A67C46]">
                — AI CAREER COUNSELLING FOR CLASS 12 PCMB, PCM & PCB
              </span>
            </div>

            <h1 className="font-serif-editorial text-4xl font-medium leading-[1.12] tracking-tight text-[#16382E] sm:text-5xl lg:text-[62px]">
              A clearer way to{" "}
              <span className="italic text-[#A67C46]">shape your future.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-[16px] sm:text-[17px] leading-[1.7] text-[#4A5550]">
              Cut through coaching noise with stream-smart exam discovery, side-by-side 10-year ROI
              & loan break-even simulators, a 4-bucket portfolio builder, and live conversational
              mentoring powered by{" "}
              <span className="font-semibold text-[#16382E]">Gemini 2.5 Pro & Flash</span>.
            </p>

            {/* Primary Pill CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => scrollToSection("interest-quiz")}
                className="inline-flex items-center justify-center rounded-full bg-[#194236] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#123027] cursor-pointer"
              >
                Take the Interest Quiz →
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("exam-encyclopedia")}
                className="inline-flex items-center justify-center rounded-full border border-[#16382E]/25 bg-white px-7 py-3.5 text-sm font-semibold text-[#16382E] transition-all hover:border-[#16382E] hover:bg-[#F9F7F1] cursor-pointer"
              >
                Explore All Exams
              </button>
              <button
                type="button"
                onClick={() => setIsCounsellorOpen(true)}
                className="inline-flex items-center gap-2 justify-center rounded-full border border-[#A67C46]/50 bg-[#A67C46]/10 px-6 py-3.5 text-sm font-semibold text-[#16382E] transition-all hover:bg-[#A67C46] hover:text-white cursor-pointer"
              >
                <span>Open AI Mentor</span>
              </button>
            </div>

            {/* Quick Active Stream Context Bar */}
            <div className="mt-10 rounded-2xl border border-[#E2DDD0] bg-white/95 p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow-tracked text-[#A67C46]">ACTIVE STUDENT STREAM CONTEXT</p>
                  <p className="mt-1 text-xs sm:text-sm text-[#4A5550]">
                    Syncs across your Aptitude Quiz, 4-Bucket Portfolio, and live Gemini 2.5 Mentor.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {["PCMB", "PCM", "PCB"].map((streamOption) => {
                    const isActive = studentStream === streamOption;
                    return (
                      <button
                        key={streamOption}
                        type="button"
                        onClick={() => handleStreamChange(streamOption)}
                        className={
                          "rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer " +
                          (isActive
                            ? "bg-[#194236] text-white shadow-xs"
                            : "border border-[#E2DDD0] bg-[#F9F7F1] text-[#16382E] hover:border-[#A67C46]")
                        }
                      >
                        {streamOption}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Key Pillars Strip (Unified Warm White Aesthetics + Popup Animations) */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              onClick={() => scrollToSection("score-predictor-studio")}
              style={{ animationDelay: "40ms" }}
              className="group disha-popup-card rounded-2xl border border-[#E2DDD0] bg-white p-5 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow-tracked text-[#A67C46]">01 · 26 EXAMS + BOARDS</p>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F9F7F1] text-xs font-bold text-[#16382E] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#194236] group-hover:text-white">
                  ↗
                </span>
              </div>
              <p className="mt-2 font-serif-editorial text-lg font-medium text-[#16382E]">
                Interactive Score Predictor
              </p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#4A5550]">
                Simulate accuracy, negative marking & bonus questions against live GEN/OBC/SC/ST
                cutoffs across all 26 exams + Boards.
              </p>
            </div>

            <div
              onClick={() => scrollToSection("drop-year-simulator")}
              style={{ animationDelay: "130ms" }}
              className="group disha-popup-card rounded-2xl border border-[#E2DDD0] bg-white p-5 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow-tracked text-[#A67C46]">02 · DROP VS. JOIN NOW</p>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F9F7F1] text-xs font-bold text-[#16382E] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#194236] group-hover:text-white">
                  ↗
                </span>
              </div>
              <p className="mt-2 font-serif-editorial text-lg font-medium text-[#16382E]">
                10-Year Wealth Simulator
              </p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#4A5550]">
                Compare taking a drop year vs. joining a Tier-2 college now + GATE/CAT/Product
                pivots over 10 years.
              </p>
            </div>

            <div
              onClick={() => setIsCompareModalOpen(true)}
              style={{ animationDelay: "220ms" }}
              className="group disha-popup-card rounded-2xl border border-[#E2DDD0] bg-white p-5 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow-tracked text-[#A67C46]">03 · 3-EXAM COMPARATOR</p>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F9F7F1] text-xs font-bold text-[#16382E] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#194236] group-hover:text-white">
                  ↗
                </span>
              </div>
              <p className="mt-2 font-serif-editorial text-lg font-medium text-[#16382E]">
                Side-by-Side ROI Matrix
              </p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#4A5550]">
                Compare up to 3 exams across syllabus overlap, 5-year tuition, Year 1–10 pay, and
                burnout risk.
              </p>
            </div>

            <div
              onClick={() => setIsFamilyDossierOpen(true)}
              style={{ animationDelay: "310ms" }}
              className="group disha-popup-card rounded-2xl border border-[#E2DDD0] bg-white p-5 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow-tracked text-[#A67C46]">04 · PARENT DOSSIER</p>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F9F7F1] text-xs font-bold text-[#16382E] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#194236] group-hover:text-white">
                  ↗
                </span>
              </div>
              <p className="mt-2 font-serif-editorial text-lg font-medium text-[#16382E]">
                Printable Family Report
              </p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#4A5550]">
                Export a clean, data-backed PDF summary of your quiz archetype, fees, and 10-year
                trajectories for parents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: INTERACTIVE 7-QUESTION STUDENT INTEREST & APTITUDE QUIZ */}
      <section id="interest-quiz" className="py-16 sm:py-20 border-b border-[#E2DDD0]/80 no-print">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="inline-block bg-[#A67C46]"
                  style={{ width: "24px", height: "1.5px" }}
                />
                <span className="eyebrow-tracked text-[#A67C46]">
                  PSYCHOMETRIC & STREAM CALIBRATION
                </span>
              </div>
              <h2 className="font-serif-editorial text-3xl font-medium text-[#16382E] sm:text-4xl">
                7-Question Aptitude &{" "}
                <span className="italic text-[#A67C46]">Trajectory Quiz.</span>
              </h2>
            </div>

            {quizCompleted && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFamilyDossierOpen(true)}
                  className="rounded-full border border-[#A67C46] bg-[#A67C46]/10 px-4 py-2 text-xs font-semibold text-[#16382E] transition-colors hover:bg-[#A67C46] hover:text-white cursor-pointer"
                >
                  Print Family Dossier 🖨️
                </button>
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="rounded-full border border-[#E2DDD0] bg-white px-4 py-2 text-xs font-semibold text-[#16382E] transition-colors hover:border-[#16382E] cursor-pointer"
                >
                  Retake Quiz ↺
                </button>
              </div>
            )}
          </div>

          {!quizCompleted ? (
            <div className="rounded-3xl border border-[#E2DDD0] bg-white p-6 sm:p-10 shadow-xs">
              {/* Step Progress Bar */}
              <div className="mb-7">
                <div className="flex items-center justify-between text-xs font-semibold text-[#4A5550] mb-2">
                  <span>{QUIZ_QUESTIONS[currentStep].eyebrow}</span>
                  <span>
                    {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F9F7F1] border border-[#E2DDD0]">
                  <div
                    className="h-full rounded-full bg-[#194236] transition-all duration-300"
                    style={{
                      width: Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100) + "%"
                    }}
                  />
                </div>
              </div>

              <h3 className="font-serif-editorial text-2xl sm:text-[28px] font-medium leading-snug text-[#16382E]">
                {QUIZ_QUESTIONS[currentStep].prompt}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#4A5550]">
                {QUIZ_QUESTIONS[currentStep].subtext}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3.5">
                {QUIZ_QUESTIONS[currentStep].options.map((option) => {
                  const isSelected = quizAnswers[QUIZ_QUESTIONS[currentStep].id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        handleSelectQuizOption(QUIZ_QUESTIONS[currentStep].id, option.id)
                      }
                      className={
                        "group flex w-full items-start justify-between gap-4 rounded-2xl border p-4 sm:p-5 text-left transition-all cursor-pointer " +
                        (isSelected
                          ? "border-[#16382E] bg-[#16382E]/[0.04]"
                          : "border-[#E2DDD0] bg-[#F9F7F1]/50 hover:border-[#A67C46] hover:bg-white")
                      }
                    >
                      <div>
                        <p className="text-[15px] sm:text-base font-semibold text-[#16382E] group-hover:text-[#123027]">
                          {option.label}
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-[#4A5550]">{option.detail}</p>
                      </div>
                      <span
                        className={
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors " +
                          (isSelected
                            ? "border-[#16382E] bg-[#16382E] text-white"
                            : "border-[#D5CFC0] bg-white text-[#4A5550] group-hover:border-[#A67C46]")
                        }
                      >
                        →
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quiz Footer Controls */}
              <div className="mt-7 flex items-center justify-between border-t border-[#E2DDD0] pt-5">
                <button
                  type="button"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                  className={
                    "rounded-full px-4 py-2 text-xs font-semibold transition-colors " +
                    (currentStep === 0
                      ? "text-[#A0A8A4] cursor-not-allowed"
                      : "border border-[#E2DDD0] bg-[#F9F7F1] text-[#16382E] hover:border-[#16382E] cursor-pointer")
                  }
                >
                  ← Previous Question
                </button>

                <div className="flex items-center gap-1.5">
                  {QUIZ_QUESTIONS.map((q, idx) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentStep(idx)}
                      aria-label={"Jump to question " + (idx + 1)}
                      className={
                        "h-2.5 rounded-full transition-all cursor-pointer " +
                        (idx === currentStep
                          ? "w-6 bg-[#194236]"
                          : quizAnswers[q.id]
                          ? "w-2.5 bg-[#A67C46]"
                          : "w-2.5 bg-[#E2DDD0]")
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            quizResults && (
              <div className="space-y-8">
                {/* Archetype & Horizontal 6-Trait Bar Chart */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Primary Archetype Card */}
                  <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-[#E2DDD0] bg-[#16382E] p-6 sm:p-8 text-white shadow-sm">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-full bg-[#A67C46] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                          STREAM: {quizResults.stream}
                        </span>
                        <span className="text-xs text-[#D6DDD9]">Primary Archetype</span>
                      </div>

                      <h3 className="mt-5 font-serif-editorial text-2xl sm:text-3xl font-medium leading-tight text-white">
                        {quizResults.archetype.title}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-[#E2E8E4]">
                        {quizResults.archetype.tagline}
                      </p>

                      <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4">
                        <p className="eyebrow-tracked text-[#E6C594]">COUNSELLOR VERDICT</p>
                        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-white/95">
                          {quizResults.archetype.advice}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openCounsellorWithPrompt(
                          "I just completed the Disha Aptitude Quiz for my " +
                            quizResults.stream +
                            " stream. My primary archetype is " +
                            quizResults.archetype.title +
                            ". Please analyze my 6 trait scores and Top 6 matched exams, and recommend how I should prioritize my preparation.",
                          "gemini-2.5-pro"
                        )
                      }
                      className="mt-6 w-full rounded-full bg-[#A67C46] px-5 py-3.5 text-center text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#916B3A] cursor-pointer"
                    >
                      Discuss My Results with Gemini 2.5 Pro →
                    </button>
                  </div>

                  {/* Horizontal 6-Trait Bar Chart */}
                  <div className="lg:col-span-7 rounded-3xl border border-[#E2DDD0] bg-white p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="eyebrow-tracked text-[#A67C46]">6-DIMENSION APTITUDE PROFILE</p>
                        <h4 className="mt-1 font-serif-editorial text-xl font-medium text-[#16382E]">
                          Your Psychometric Trait Distribution
                        </h4>
                      </div>
                      <span className="rounded-full border border-[#E2DDD0] bg-[#F9F7F1] px-3 py-1 text-xs font-semibold text-[#16382E]">
                        Top: {quizResults.primaryTrait}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {quizResults.sortedTraits.map((trait, index) => {
                        const pct = quizResults.percentages[trait];
                        const isTop = index === 0;
                        return (
                          <div key={trait}>
                            <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                              <span
                                className={
                                  "font-semibold " +
                                  (isTop ? "text-[#16382E]" : "text-[#4A5550]")
                                }
                              >
                                {trait}
                              </span>
                              <span className="font-bold text-[#16382E]">{pct}%</span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-[#F9F7F1] border border-[#E2DDD0]">
                              <div
                                className={
                                  "h-full rounded-full transition-all duration-500 " +
                                  (isTop
                                    ? "bg-[#194236]"
                                    : index === 1
                                    ? "bg-[#A67C46]"
                                    : "bg-[#6C8279]")
                                }
                                style={{ width: pct + "%" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Top 6 Stream-Matched Exams */}
                <div className="rounded-3xl border border-[#E2DDD0] bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                      <p className="eyebrow-tracked text-[#A67C46]">
                        ELIGIBILITY-VERIFIED FOR {quizResults.stream}
                      </p>
                      <h4 className="mt-1 font-serif-editorial text-2xl font-medium text-[#16382E]">
                        Your Top 6 Matched Entrance Pathways
                      </h4>
                    </div>
                    <p className="text-xs text-[#4A5550]">
                      Strictly filtered for {quizResults.stream} eligibility + top Open-to-All fits
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quizResults.topMatches.map((exam, idx) => {
                      const currentBucket = getExamBucket(exam.id);
                      const isCompared = compareIds.includes(exam.id);
                      return (
                        <div
                          key={exam.id}
                          className="flex flex-col justify-between rounded-2xl border border-[#E2DDD0] bg-[#F9F7F1]/70 p-5 transition-all hover:border-[#A67C46] hover:bg-white"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="rounded-full bg-[#194236] px-3 py-1 text-[11px] font-bold text-white">
                                #{idx + 1} · {exam.fitScore}% Fit
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleCompareExam(exam.id)}
                                  className={
                                    "rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors cursor-pointer " +
                                    (isCompared
                                      ? "border-[#194236] bg-[#194236] text-white"
                                      : "border-[#E2DDD0] bg-white text-[#4A5550] hover:border-[#16382E]")
                                  }
                                >
                                  {isCompared ? "Comparing ✓" : "+ Compare"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleShortlist(exam.id)}
                                  className={
                                    "rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors cursor-pointer " +
                                    (currentBucket
                                      ? "border-[#A67C46] bg-[#A67C46] text-white"
                                      : "border-[#E2DDD0] bg-white text-[#16382E] hover:border-[#A67C46]")
                                  }
                                >
                                  {currentBucket ? currentBucket + " ★" : "+ Portfolio"}
                                </button>
                              </div>
                            </div>

                            <h5 className="mt-3.5 font-serif-editorial text-lg font-medium text-[#16382E]">
                              {exam.name}
                            </h5>
                            <p className="mt-1 text-xs font-semibold text-[#A67C46]">
                              {exam.degree}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-[#4A5550]">
                              {exam.summary}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-[#E2DDD0] grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setTrajectoryModalTab("predictor");
                                setActiveTrajectoryExam(exam);
                              }}
                              className="rounded-full border border-[#16382E]/25 bg-white px-3 py-2 text-center text-xs font-semibold text-[#16382E] transition-colors hover:border-[#16382E] cursor-pointer"
                            >
                              🎯 Predictor
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTrajectoryModalTab("trajectory");
                                setActiveTrajectoryExam(exam);
                              }}
                              className="rounded-full bg-[#194236] px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-[#123027] cursor-pointer"
                            >
                              10-Yr Path →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* SECTION 1.5: VISUAL INTERACTIVE SCORE & BRANCH/COLLEGE CUTOFF PREDICTOR STUDIO (ALL 26 EXAMS + BOARDS) */}
      <section
        id="score-predictor-studio"
        className="py-16 sm:py-20 border-b border-[#E2DDD0]/80 no-print"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="inline-block bg-[#A67C46]"
                  style={{ width: "24px", height: "1.5px" }}
                />
                <span className="eyebrow-tracked text-[#A67C46]">
                  LIVE ACCURACY, NEGATIVE MARKING & CUTOFF ENGINE
                </span>
              </div>
              <h2 className="font-serif-editorial text-3xl font-medium text-[#16382E] sm:text-4xl">
                Interactive Score &{" "}
                <span className="italic text-[#A67C46]">Cutoff Predictor Studio.</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#4A5550]">
                Test how question attempts, accuracy %, and bonus sections move your live score line
                across all <strong>26 Entrance Exams</strong> and{" "}
                <strong>Class 12 Board Eligibility Gates</strong> (including{" "}
                <strong>GEN, OBC-NCL, SC & ST</strong> merit cutoffs).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setStudioPredictorExamId((prev) =>
                    prev === "boards-12" ? "bitsat" : "boards-12"
                  )
                }
                className={
                  "rounded-full px-4 py-2.5 text-xs font-bold transition-all cursor-pointer " +
                  (studioPredictorExamId === "boards-12"
                    ? "bg-[#194236] text-white shadow-xs"
                    : "border border-[#E2DDD0] bg-white text-[#16382E] hover:border-[#A67C46]")
                }
              >
                🎓 Class 12 Boards Gatekeeper
              </button>
            </div>
          </div>

          <InteractiveScorePredictor
            examId={studioPredictorExamId}
            onSelectExamId={setStudioPredictorExamId}
            studentStream={studentStream}
            showExamSelector={true}
            onAskAi={(promptText) => openCounsellorWithPrompt(promptText, "gemini-2.5-pro")}
          />
        </div>
      </section>

      {/* SECTION 2: COMPLETE EXAM ENCYCLOPEDIA & 10-YEAR LIFE TRAJECTORY EXPLORER */}
      <section id="exam-encyclopedia" className="py-16 sm:py-20 border-b border-[#E2DDD0]/80 no-print">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="inline-block bg-[#A67C46]"
                  style={{ width: "24px", height: "1.5px" }}
                />
                <span className="eyebrow-tracked text-[#A67C46]">
                  26 VERIFIED INDIAN & GLOBAL PATHWAYS
                </span>
              </div>
              <h2 className="font-serif-editorial text-3xl font-medium text-[#16382E] sm:text-4xl">
                Exam Encyclopedia &{" "}
                <span className="italic text-[#A67C46]">10-Year Trajectory Explorer.</span>
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5550]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search JEE, NEET, IAT, IPMAT, CLAT..."
                className="w-full rounded-full border border-[#E2DDD0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#16382E] placeholder-[#7A847F] focus:border-[#16382E] focus:outline-none"
              />
            </div>
          </div>

          {/* Filter Pills Container */}
          <div className="mt-8 space-y-3 rounded-2xl border border-[#E2DDD0] bg-white p-4 sm:p-5 shadow-xs">
            {/* Stream Filter Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#4A5550]">
                Stream:
              </span>
              {STREAM_FILTERS.map((sPill) => {
                const active = streamFilter === sPill;
                return (
                  <button
                    key={sPill}
                    type="button"
                    onClick={() => setStreamFilter(sPill)}
                    className={
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer " +
                      (active
                        ? "bg-[#194236] text-white"
                        : "border border-[#E2DDD0] bg-[#F9F7F1] text-[#16382E] hover:border-[#A67C46]")
                    }
                  >
                    {sPill}
                  </button>
                );
              })}
            </div>

            {/* Domain Filter Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2DDD0]/70">
              <span className="mr-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#4A5550]">
                Domain:
              </span>
              {DOMAIN_FILTERS.map((dPill) => {
                const active = domainFilter === dPill;
                return (
                  <button
                    key={dPill}
                    type="button"
                    onClick={() => setDomainFilter(dPill)}
                    className={
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer " +
                      (active
                        ? "bg-[#A67C46] text-white"
                        : "border border-[#E2DDD0] bg-white text-[#4A5550] hover:border-[#16382E] hover:text-[#16382E]")
                    }
                  >
                    {dPill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count & Reset */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#4A5550]">
            <span>
              Showing <strong className="text-[#16382E]">{filteredExams.length}</strong> of{" "}
              {enrichedExamsData.length} entrance pathways · Click{" "}
              <strong className="text-[#16382E]">+ Compare</strong> on up to 3 cards for side-by-side ROI matrix
            </span>
            {(streamFilter !== "All" || domainFilter !== "All Domains" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setStreamFilter("All");
                  setDomainFilter("All Domains");
                  setSearchQuery("");
                }}
                className="font-semibold text-[#A67C46] hover:underline cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Exam Cards Grid */}
          {filteredExams.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-[#E2DDD0] bg-white p-12 text-center">
              <p className="font-serif-editorial text-2xl text-[#16382E]">
                No matching exams in this filter combination.
              </p>
              <p className="mt-2 text-sm text-[#4A5550]">
                Try resetting the Domain or Stream pill to explore all 26 career trajectories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStreamFilter("All");
                  setDomainFilter("All Domains");
                  setSearchQuery("");
                }}
                className="mt-5 rounded-full bg-[#194236] px-6 py-2.5 text-xs font-semibold text-white cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredExams.map((exam) => {
                const activeBucket = getExamBucket(exam.id);
                const isCompared = compareIds.includes(exam.id);
                return (
                  <article
                    key={exam.id}
                    className="group flex flex-col justify-between rounded-2xl border border-[#E2DDD0] bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#A67C46] hover:shadow-md"
                  >
                    <div>
                      {/* Top Tags + Compare & Bucket Actions */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-[#16382E]/8 px-2.5 py-1 text-[11px] font-bold text-[#16382E]">
                            {exam.streamCategory}
                          </span>
                          <span className="rounded-full border border-[#E2DDD0] bg-[#F9F7F1] px-2.5 py-1 text-[11px] font-medium text-[#4A5550]">
                            {exam.domain}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleCompareExam(exam.id)}
                          className={
                            "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer shrink-0 " +
                            (isCompared
                              ? "border-[#194236] bg-[#194236] text-white"
                              : "border-[#E2DDD0] bg-[#F9F7F1] text-[#4A5550] hover:border-[#16382E] hover:text-[#16382E]")
                          }
                        >
                          {isCompared ? "Comparing ✓" : "+ Compare"}
                        </button>
                      </div>

                      {/* Exam Title & Degree */}
                      <h3 className="mt-4 font-serif-editorial text-xl font-medium leading-snug text-[#16382E]">
                        {exam.name}
                      </h3>
                      <p className="mt-1.5 text-xs font-semibold text-[#A67C46]">{exam.degree}</p>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#4A5550]">{exam.summary}</p>

                      {/* Syllabus Overlap & Prep Synergy Indicator */}
                      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-lg border border-[#E2DDD0] bg-[#F9F7F1] px-2.5 py-1 text-[11px] font-semibold text-[#16382E]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#A67C46]" />
                          {exam.prepSynergy}
                        </span>
                      </div>

                      {/* 4-Bucket Quick Selector Pills */}
                      <div className="mt-4 pt-3 border-t border-[#E2DDD0]/60">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#4A5550] mb-1.5">
                          <span>Assign Portfolio Bucket:</span>
                          {activeBucket && (
                            <button
                              type="button"
                              onClick={() => toggleShortlist(exam.id)}
                              className="text-red-700 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {BUCKET_TYPES.map((b) => {
                            const isSelectedBucket = activeBucket === b.id;
                            return (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => setExamBucket(exam.id, b.id)}
                                className={
                                  "rounded-lg py-1 text-[10px] font-bold transition-all cursor-pointer border " +
                                  (isSelectedBucket
                                    ? b.badgeClass + " border-transparent shadow-2xs"
                                    : "border-[#E2DDD0] bg-[#F9F7F1]/70 text-[#4A5550] hover:border-[#A67C46] hover:text-[#16382E]")
                                }
                              >
                                {b.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 pt-4 border-t border-[#E2DDD0]/80">
                      <div className="mb-3 flex items-center justify-between text-xs">
                        <span className="text-[#4A5550] truncate max-w-[60%]">
                          Est. Fee: ~₹{exam.avgTotalFeeLakhs}L · Yr-1: ~₹{exam.avgEntrySalaryLakhs}L
                        </span>
                        <span
                          className={
                            "rounded-full px-2.5 py-0.5 text-[11px] font-bold " +
                            (exam.roiTone === "emerald"
                              ? "bg-[#194236]/10 text-[#194236]"
                              : "bg-[#A67C46]/15 text-[#87602F]")
                          }
                        >
                          {exam.roiBadge}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTrajectoryModalTab("predictor");
                            setActiveTrajectoryExam(exam);
                          }}
                          className="rounded-full border border-[#16382E]/25 bg-[#F9F7F1] px-3 py-2.5 text-xs font-semibold text-[#16382E] transition-colors hover:border-[#16382E] hover:bg-white cursor-pointer"
                        >
                          🎯 Score Predictor
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTrajectoryModalTab("trajectory");
                            setActiveTrajectoryExam(exam);
                          }}
                          className="rounded-full bg-[#194236] px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#123027] cursor-pointer"
                        >
                          10-Yr Trajectory →
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2.5: "TAKE A DROP YEAR VS. JOIN NOW" 10-YEAR WEALTH & TRAJECTORY SIMULATOR */}
      <section
        id="drop-year-simulator"
        className="py-16 sm:py-20 border-b border-[#E2DDD0]/80 no-print"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DropYearSimulator
            defaultTier1Pay={studentStream === "PCB" ? 18 : 24}
            examName={studentStream === "PCB" ? "AIIMS / Govt MBBS / IISER" : "IIT / NIT / BITS / IISER"}
            onAskAi={(promptText) => openCounsellorWithPrompt(promptText, "gemini-2.5-pro")}
          />
        </div>
      </section>

      {/* SECTION 3: STRUCTURED 4-BUCKET PORTFOLIO BOARD (DREAM / TARGET / WILDCARD / BACKUP) */}
      <section id="portfolio-board" className="py-16 sm:py-20 border-b border-[#E2DDD0]/80 no-print">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="inline-block bg-[#A67C46]"
                  style={{ width: "24px", height: "1.5px" }}
                />
                <span className="eyebrow-tracked text-[#A67C46]">
                  STRATEGIC RISK MANAGEMENT
                </span>
              </div>
              <h2 className="font-serif-editorial text-3xl font-medium text-[#16382E] sm:text-4xl">
                Your 4-Bucket{" "}
                <span className="italic text-[#A67C46]">Exam Portfolio Board.</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsFamilyDossierOpen(true)}
                className="rounded-full border border-[#16382E]/25 bg-white px-5 py-2.5 text-xs font-semibold text-[#16382E] hover:border-[#16382E] cursor-pointer"
              >
                Export Printable Family Dossier 🖨️
              </button>
              <button
                type="button"
                onClick={() =>
                  openCounsellorWithPrompt(
                    "Audit my current 4-Bucket Exam Portfolio (" +
                      (portfolioExams.map((e) => e.bucket + ": " + e.name).join(", ") || "empty") +
                      ") for my " +
                      studentStream +
                      " stream. Is it realistic, or do I have blind spots?",
                    "gemini-2.5-pro"
                  )
                }
                className="rounded-full bg-[#194236] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#123027] cursor-pointer"
              >
                Audit Portfolio with Gemini 2.5 Pro →
              </button>
            </div>
          </div>

          {/* Automatic Portfolio Risk & Balance Alert Banner */}
          <div
            className={
              "mt-6 rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 " +
              (portfolioDiagnostics.tone === "red"
                ? "border-red-300 bg-red-50/90 text-red-950"
                : portfolioDiagnostics.tone === "emerald"
                ? "border-[#194236]/30 bg-[#194236]/8 text-[#16382E]"
                : "border-[#A67C46]/40 bg-[#A67C46]/10 text-[#16382E]")
            }
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {portfolioDiagnostics.title}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed">
                {portfolioDiagnostics.message}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#16382E] border border-[#E2DDD0]">
              {portfolioExams.length} Exams Active
            </span>
          </div>

          {/* 4 Columns: Dream, Target, Wildcard, Backup */}
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BUCKET_TYPES.map((bucket) => {
              const itemsInBucket = portfolioExams.filter((e) => e.bucket === bucket.id);
              return (
                <div
                  key={bucket.id}
                  className="flex flex-col rounded-2xl border border-[#E2DDD0] bg-white p-5 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-[#E2DDD0] pb-3">
                    <div>
                      <span
                        className={
                          "inline-block rounded-full px-3 py-0.5 text-[11px] font-bold " +
                          bucket.badgeClass
                        }
                      >
                        {bucket.label}
                      </span>
                      <p className="mt-1.5 text-[11px] text-[#4A5550]">{bucket.desc}</p>
                    </div>
                    <span className="text-sm font-bold text-[#16382E]">{itemsInBucket.length}</span>
                  </div>

                  <div className="mt-4 flex-1 space-y-3">
                    {itemsInBucket.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#E2DDD0] bg-[#F9F7F1]/50 p-4 text-center">
                        <p className="text-xs text-[#4A5550]">
                          No {bucket.label} exams selected yet. Click <strong>{bucket.label}</strong>{" "}
                          on any exam card above.
                        </p>
                      </div>
                    ) : (
                      itemsInBucket.map((exam) => (
                        <div
                          key={exam.id}
                          className="rounded-xl border border-[#E2DDD0] bg-[#F9F7F1]/70 p-3.5 transition-all hover:border-[#A67C46]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p
                              onClick={() => setActiveTrajectoryExam(exam)}
                              className="font-serif-editorial text-base font-medium text-[#16382E] hover:underline cursor-pointer"
                            >
                              {exam.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => toggleShortlist(exam.id)}
                              className="text-xs text-[#4A5550] hover:text-red-700 cursor-pointer"
                              title="Remove from portfolio"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="mt-0.5 text-[11px] font-medium text-[#A67C46]">
                            {exam.degree}
                          </p>
                          <p className="mt-1.5 text-[11px] text-[#4A5550]">
                            Fee: ~₹{exam.avgTotalFeeLakhs}L · Entry: ~₹{exam.avgEntrySalaryLakhs} LPA
                          </p>
                          <div className="mt-2.5 flex items-center gap-1">
                            {BUCKET_TYPES.filter((b) => b.id !== bucket.id).map((otherB) => (
                              <button
                                key={otherB.id}
                                type="button"
                                onClick={() => setExamBucket(exam.id, otherB.id)}
                                className="rounded-md border border-[#E2DDD0] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#4A5550] hover:border-[#16382E] hover:text-[#16382E] cursor-pointer"
                              >
                                → {otherB.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: JAN–JUNE EXAM SEASON TIMELINE & CLASH DETECTOR */}
      <section id="exam-calendar" className="py-16 sm:py-20 no-print">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="inline-block bg-[#A67C46]"
                  style={{ width: "24px", height: "1.5px" }}
                />
                <span className="eyebrow-tracked text-[#A67C46]">
                  DECISION & SCHEDULING ROADMAP
                </span>
              </div>
              <h2 className="font-serif-editorial text-3xl font-medium text-[#16382E] sm:text-4xl">
                Jan–June Exam Calendar &{" "}
                <span className="italic text-[#A67C46]">Clash Detector.</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCalendarOnlyPortfolio((v) => !v)}
                className={
                  "rounded-full border px-4 py-2 text-xs font-semibold transition-all cursor-pointer " +
                  (calendarOnlyPortfolio
                    ? "border-[#194236] bg-[#194236] text-white"
                    : "border-[#E2DDD0] bg-white text-[#16382E] hover:border-[#A67C46]")
                }
              >
                {calendarOnlyPortfolio
                  ? "Showing Only My Portfolio Exams ✓"
                  : "Filter: Show Only My Portfolio Exams"}
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {EXAM_CALENDAR_TIMELINE.map((monthBlock) => {
              const visibleEvents = calendarOnlyPortfolio
                ? monthBlock.events.filter((ev) => shortlistedIds.includes(ev.examId))
                : monthBlock.events;

              if (calendarOnlyPortfolio && visibleEvents.length === 0) {
                return null;
              }

              const portfolioClashCount = monthBlock.events.filter((ev) =>
                shortlistedIds.includes(ev.examId)
              ).length;

              return (
                <div
                  key={monthBlock.id}
                  className="rounded-3xl border border-[#E2DDD0] bg-white p-6 sm:p-7 shadow-xs"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E2DDD0] pb-4">
                    <div>
                      <span className="eyebrow-tracked text-[#A67C46]">
                        {monthBlock.phaseLabel}
                      </span>
                      <h3 className="mt-1 font-serif-editorial text-2xl font-medium text-[#16382E]">
                        {monthBlock.month}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {portfolioClashCount >= 2 && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-900 border border-red-300">
                          ⚠️ {portfolioClashCount} Portfolio Exams Collide This Month
                        </span>
                      )}
                      <span
                        className={
                          "rounded-full px-3 py-1 text-xs font-bold " +
                          (monthBlock.clashTone === "red"
                            ? "bg-red-900 text-white"
                            : monthBlock.clashTone === "amber"
                            ? "bg-[#A67C46]/20 text-[#7A5628]"
                            : "bg-[#194236]/12 text-[#194236]")
                        }
                      >
                        {monthBlock.clashRisk}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-[#4A5550]">
                    <strong className="text-[#16382E]">Counsellor Pacing Advice:</strong>{" "}
                    {monthBlock.schedulingAdvice}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleEvents.map((ev, i) => {
                      const inPortfolio = getExamBucket(ev.examId);
                      const fullExam = enrichedExamsData.find((e) => e.id === ev.examId);
                      return (
                        <div
                          key={ev.examId + "-" + i}
                          onClick={() => fullExam && setActiveTrajectoryExam(fullExam)}
                          className={
                            "rounded-2xl border p-4 transition-all cursor-pointer " +
                            (inPortfolio
                              ? "border-[#194236] bg-[#194236]/[0.04]"
                              : "border-[#E2DDD0] bg-[#F9F7F1]/60 hover:border-[#A67C46] hover:bg-white")
                          }
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C46]">
                              {ev.type}
                            </span>
                            {inPortfolio && (
                              <span className="rounded-full bg-[#194236] px-2 py-0.5 text-[10px] font-bold text-white">
                                In Portfolio: {inPortfolio}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 font-serif-editorial text-base font-medium text-[#16382E]">
                            {ev.title}
                          </p>
                          <p className="mt-1 text-xs font-medium text-[#4A5550]">{ev.window}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLOATING BOTTOM COMPARISON DOCK */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 w-[94%] max-w-3xl -translate-x-1/2 rounded-2xl border border-[#16382E]/20 bg-[#16382E] px-4 py-3 text-white shadow-xl no-print">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E6C594]">
                Comparator ({compareExamsList.length}/3):
              </span>
              {compareExamsList.map((cExam) => (
                <span
                  key={cExam.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white"
                >
                  <span className="truncate max-w-[130px]">{cExam.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleCompareExam(cExam.id)}
                    className="text-white/70 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="text-xs text-white/75 hover:text-white px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="rounded-full bg-[#A67C46] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#916B3A] cursor-pointer"
              >
                Compare Side-by-Side →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDITORIAL FOOTER */}
      <footer className="border-t border-[#E2DDD0] bg-white/80 py-10 no-print">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif-editorial text-lg font-semibold text-[#16382E]">
              Disha <span className="italic font-normal text-[#A67C46]">Editorial</span>
            </p>
            <p className="text-xs text-[#4A5550]">
              Built for Class 12 PCMB, PCM & PCB Students · Interactive Score Predictor, 10-Yr
              Trajectories & Gemini 2.5 Mentor
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("score-predictor-studio")}
              className="rounded-full border border-[#16382E]/25 bg-white px-4 py-2 text-xs font-semibold text-[#16382E] hover:border-[#16382E] cursor-pointer"
            >
              Score Predictor Studio 🎯
            </button>
            <button
              type="button"
              onClick={() => setIsFamilyDossierOpen(true)}
              className="rounded-full border border-[#16382E]/25 bg-white px-4 py-2 text-xs font-semibold text-[#16382E] hover:border-[#16382E] cursor-pointer"
            >
              Family Dossier (Print / PDF) 🖨️
            </button>
            <button
              type="button"
              onClick={() => setIsCounsellorOpen(true)}
              className="rounded-full bg-[#194236] px-5 py-2 text-xs font-semibold text-white hover:bg-[#123027] cursor-pointer"
            >
              Consult Gemini 2.5 Mentor →
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: 10-YEAR LIFE TRAJECTORY + SCORE PREDICTOR + DROP SIMULATOR + LOAN EMI */}
      {activeTrajectoryExam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#16382E]/60 p-3 sm:p-6 backdrop-blur-xs no-print"
          onClick={() => setActiveTrajectoryExam(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#E2DDD0] bg-[#F9F7F1] p-5 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E2DDD0] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#194236] px-3 py-1 text-[11px] font-bold text-white">
                    {activeTrajectoryExam.streamCategory}
                  </span>
                  <span className="rounded-full border border-[#E2DDD0] bg-white px-3 py-1 text-[11px] font-semibold text-[#A67C46]">
                    {activeTrajectoryExam.domain}
                  </span>
                  <span className="rounded-full bg-[#A67C46]/15 px-3 py-1 text-[11px] font-bold text-[#87602F]">
                    {activeTrajectoryExam.roiBadge}
                  </span>
                </div>

                <h3 className="mt-3 font-serif-editorial text-2xl sm:text-3xl font-medium text-[#16382E]">
                  {activeTrajectoryExam.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#4A5550]">
                  {activeTrajectoryExam.degree} ·{" "}
                  <span className="text-[#A67C46] font-semibold">
                    {activeTrajectoryExam.prepSynergy}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTrajectoryExam(null)}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E2DDD0] bg-white text-[#16382E] hover:border-[#16382E] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Interactive View Switcher Tabs */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-[#E2DDD0] pb-4">
              <button
                type="button"
                onClick={() => setTrajectoryModalTab("trajectory")}
                className={
                  "rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer " +
                  (trajectoryModalTab === "trajectory"
                    ? "bg-[#194236] text-white shadow-xs"
                    : "border border-[#E2DDD0] bg-white text-[#16382E] hover:border-[#A67C46]")
                }
              >
                📊 10-Year Trajectory & Loan EMI
              </button>
              <button
                type="button"
                onClick={() => setTrajectoryModalTab("predictor")}
                className={
                  "rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer " +
                  (trajectoryModalTab === "predictor"
                    ? "bg-[#111315] text-[#22C55E] border border-[#22C55E] shadow-xs"
                    : "border border-[#E2DDD0] bg-white text-[#16382E] hover:border-[#A67C46]")
                }
              >
                🎯 Score & Branch Cutoff Predictor
              </button>
              <button
                type="button"
                onClick={() => setTrajectoryModalTab("drop-sim")}
                className={
                  "rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer " +
                  (trajectoryModalTab === "drop-sim"
                    ? "bg-[#A67C46] text-white shadow-xs"
                    : "border border-[#E2DDD0] bg-white text-[#16382E] hover:border-[#A67C46]")
                }
              >
                ⏳ Drop Year vs. Join Now Simulator
              </button>
            </div>

            {trajectoryModalTab === "predictor" ? (
              <div className="mt-6">
                <InteractiveScorePredictor
                  examId={activeTrajectoryExam.id}
                  onSelectExamId={(newId) => {
                    if (newId === "boards-12") {
                      setActiveTrajectoryExam(null);
                      setStudioPredictorExamId("boards-12");
                      scrollToSection("score-predictor-studio");
                    } else {
                      const nextExam = enrichedExamsData.find((e) => e.id === newId);
                      if (nextExam) setActiveTrajectoryExam(nextExam);
                    }
                  }}
                  studentStream={studentStream}
                  showExamSelector={false}
                  onAskAi={(promptText) => openCounsellorWithPrompt(promptText, "gemini-2.5-pro")}
                />
              </div>
            ) : trajectoryModalTab === "drop-sim" ? (
              <div className="mt-6">
                <DropYearSimulator
                  defaultTier1Pay={activeTrajectoryExam.avgEntrySalaryLakhs || 22}
                  examName={activeTrajectoryExam.name}
                  onAskAi={(promptText) => openCounsellorWithPrompt(promptText, "gemini-2.5-pro")}
                />
              </div>
            ) : (
            /* 5 Structured Trajectory Sections (Including Loan & ROI Simulator) */
            <div className="mt-6 space-y-5">
              {/* 1. Exam Blueprint */}
              <div className="rounded-2xl border border-[#E2DDD0] bg-white p-5">
                <p className="eyebrow-tracked text-[#A67C46]">01 · EXAM BLUEPRINT & SYNERGY</p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                  <div className="rounded-xl bg-[#F9F7F1] p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">
                      Eligible Streams
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-[#16382E]">
                      {activeTrajectoryExam.blueprint.eligibleStreamsText}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F9F7F1] p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">
                      Conducting Body & Window
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-[#16382E]">
                      {activeTrajectoryExam.blueprint.conductingBody} ({activeTrajectoryExam.examMonth})
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F9F7F1] p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">
                      Exam Pattern
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-[#2C3632]">
                      {activeTrajectoryExam.blueprint.pattern}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F9F7F1] p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5550]">
                      Target Score / Percentile
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-[#194236]">
                      {activeTrajectoryExam.blueprint.targetScore}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Years 1–5 (Degree & Campus Reality) */}
              <div className="rounded-2xl border border-[#E2DDD0] bg-white p-5">
                <p className="eyebrow-tracked text-[#A67C46]">
                  02 · YEARS 1–5 (DEGREE & CAMPUS REALITY)
                </p>
                <div className="mt-3 space-y-2.5 text-sm">
                  <p className="text-[#2C3632]">
                    <strong className="text-[#16382E]">Degree Awarded:</strong>{" "}
                    {activeTrajectoryExam.campusReality.degreeAwarded}
                  </p>
                  <p className="text-[#2C3632]">
                    <strong className="text-[#16382E]">Premier Institutions:</strong>{" "}
                    {activeTrajectoryExam.campusReality.topColleges}
                  </p>
                  <div className="rounded-xl border border-[#A67C46]/30 bg-[#A67C46]/8 p-3.5 text-xs sm:text-sm text-[#16382E]">
                    <strong>Approximate Fees vs. ROI:</strong>{" "}
                    {activeTrajectoryExam.campusReality.feesVsRoi}
                  </div>
                </div>
              </div>

              {/* 3. 10-Year Career & Salary Timeline */}
              <div className="rounded-2xl border border-[#E2DDD0] bg-white p-5">
                <p className="eyebrow-tracked text-[#A67C46]">
                  03 · 10-YEAR CAREER & SALARY TIMELINE
                </p>
                <div className="mt-4 space-y-4 border-l-2 border-[#A67C46] pl-4">
                  <div>
                    <span className="inline-block rounded-full bg-[#194236] px-2.5 py-0.5 text-[11px] font-bold text-white">
                      Years 0–2 · Launchpad
                    </span>
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#2C3632]">
                      {activeTrajectoryExam.timeline.years0to2}
                    </p>
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-[#A67C46] px-2.5 py-0.5 text-[11px] font-bold text-white">
                      Years 3–6 · Acceleration & Pivots
                    </span>
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#2C3632]">
                      {activeTrajectoryExam.timeline.years3to6}
                    </p>
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-[#16382E]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#16382E]">
                      Years 7–10+ · Leadership Ceiling
                    </span>
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#2C3632]">
                      {activeTrajectoryExam.timeline.years7to10Plus}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Interactive Education Loan & ROI Break-Even Simulator */}
              {loanCalculation && (
                <div className="rounded-2xl border border-[#E2DDD0] bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="eyebrow-tracked text-[#A67C46]">
                      04 · INTERACTIVE EDUCATION LOAN & ROI BREAK-EVEN SIMULATOR
                    </p>
                    <span
                      className={
                        "rounded-full px-3 py-0.5 text-[11px] font-bold " +
                        (loanCalculation.verdictTone === "red"
                          ? "bg-red-100 text-red-900"
                          : loanCalculation.verdictTone === "amber"
                          ? "bg-[#A67C46]/20 text-[#7A5628]"
                          : "bg-[#194236]/12 text-[#194236]")
                      }
                    >
                      {loanCalculation.verdictLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-[#F9F7F1] p-3.5">
                      <div className="flex justify-between text-xs font-semibold text-[#16382E]">
                        <span>Loan / Fee Amount</span>
                        <span>₹{loanAmountLakhs} Lakhs</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="80"
                        step="1"
                        value={loanAmountLakhs}
                        onChange={(e) => setLoanAmountLakhs(Number(e.target.value))}
                        className="mt-2 w-full accent-[#194236] cursor-pointer"
                      />
                      <p className="mt-1 text-[10px] text-[#4A5550]">
                        Default anchored to ~₹{activeTrajectoryExam.avgTotalFeeLakhs}L typical cost
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F9F7F1] p-3.5">
                      <div className="flex justify-between text-xs font-semibold text-[#16382E]">
                        <span>Interest Rate (% p.a.)</span>
                        <span>{loanInterestRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="6.5"
                        max="12"
                        step="0.5"
                        value={loanInterestRate}
                        onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                        className="mt-2 w-full accent-[#194236] cursor-pointer"
                      />
                      <p className="mt-1 text-[10px] text-[#4A5550]">
                        SBI Scholar / Vidyalakshmi range: 7.5%–10.5%
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F9F7F1] p-3.5">
                      <div className="flex justify-between text-xs font-semibold text-[#16382E]">
                        <span>Repayment Tenure</span>
                        <span>{loanTenureYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="15"
                        step="1"
                        value={loanTenureYears}
                        onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                        className="mt-2 w-full accent-[#194236] cursor-pointer"
                      />
                      <p className="mt-1 text-[10px] text-[#4A5550]">
                        Post-moratorium EMI period (3–15 yrs)
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-[#E2DDD0] p-3 text-center">
                      <p className="text-[10px] font-bold uppercase text-[#4A5550]">Monthly EMI</p>
                      <p className="mt-1 font-serif-editorial text-lg font-semibold text-[#16382E]">
                        ₹{loanCalculation.emi.toLocaleString("en-IN")}/mo
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#E2DDD0] p-3 text-center">
                      <p className="text-[10px] font-bold uppercase text-[#4A5550]">
                        Total Repayment
                      </p>
                      <p className="mt-1 font-serif-editorial text-lg font-semibold text-[#16382E]">
                        ₹{loanCalculation.totalRepaymentLakhs}L
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#E2DDD0] p-3 text-center">
                      <p className="text-[10px] font-bold uppercase text-[#4A5550]">
                        Yr-1 EMI Burden
                      </p>
                      <p className="mt-1 font-serif-editorial text-lg font-semibold text-[#16382E]">
                        {loanCalculation.emiBurdenPct}% of pay
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#E2DDD0] p-3 text-center">
                      <p className="text-[10px] font-bold uppercase text-[#4A5550]">
                        ROI Break-Even
                      </p>
                      <p className="mt-1 font-serif-editorial text-lg font-semibold text-[#194236]">
                        ~{loanCalculation.breakEvenYears} Years
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Honest Lifestyle Verdict */}
              <div className="rounded-2xl border border-[#E2DDD0] bg-[#16382E] p-5 text-white">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="eyebrow-tracked text-[#E6C594]">05 · HONEST LIFESTYLE VERDICT</p>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white">
                    {activeTrajectoryExam.lifestyleVerdict.stressLevel}
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-[#E2E8E4]">
                  <strong className="text-white">Work-Life Balance:</strong>{" "}
                  {activeTrajectoryExam.lifestyleVerdict.workLifeBalance}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs sm:text-sm">
                  <div className="rounded-xl bg-white/10 p-3.5">
                    <p className="font-bold text-[#9CE2B5]">Who Thrives Here</p>
                    <p className="mt-1 text-white/90">
                      {activeTrajectoryExam.lifestyleVerdict.whoThrives}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3.5">
                    <p className="font-bold text-[#F5B8A8]">Who Should Avoid It</p>
                    <p className="mt-1 text-white/90">
                      {activeTrajectoryExam.lifestyleVerdict.whoShouldAvoid}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Modal Footer Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2DDD0] pt-5">
              <div className="flex flex-wrap items-center gap-1.5">
                {BUCKET_TYPES.map((b) => {
                  const isCurrent = getExamBucket(activeTrajectoryExam.id) === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setExamBucket(activeTrajectoryExam.id, b.id)}
                      className={
                        "rounded-full px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer border " +
                        (isCurrent
                          ? b.badgeClass + " border-transparent"
                          : "border-[#E2DDD0] bg-white text-[#16382E] hover:border-[#A67C46]")
                      }
                    >
                      {isCurrent ? b.label + " Bucket ✓" : "+ " + b.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() =>
                  openCounsellorWithPrompt(
                    "Give me an honest, personalized evaluation of " +
                      activeTrajectoryExam.name +
                      " (" +
                      activeTrajectoryExam.degree +
                      ") for my " +
                      studentStream +
                      " profile. Compare its 10-year ROI, competition level, and backup options.",
                    "gemini-2.5-pro"
                  )
                }
                className="rounded-full bg-[#194236] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#123027] cursor-pointer"
              >
                Ask Gemini 2.5 Pro About This Trajectory →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SIDE-BY-SIDE 3-EXAM TRAJECTORY COMPARATOR MODAL */}
      {isCompareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#16382E]/60 p-3 sm:p-6 backdrop-blur-xs no-print"
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-[#E2DDD0] bg-[#F9F7F1] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2DDD0] pb-4">
              <div>
                <p className="eyebrow-tracked text-[#A67C46]">SIDE-BY-SIDE DECISION MATRIX</p>
                <h3 className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-medium text-[#16382E]">
                  10-Year ROI & Trajectory Comparator ({compareExamsList.length}/3)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2DDD0] bg-white text-[#16382E] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {compareExamsList.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#4A5550]">
                  Select up to 3 exams using the <strong>+ Compare</strong> button on any exam card.
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#E2DDD0]">
                      <th className="w-44 py-3 pr-4 font-bold uppercase tracking-wider text-[#4A5550] text-[11px]">
                        Dimension
                      </th>
                      {compareExamsList.map((exam) => (
                        <th key={exam.id} className="py-3 px-4 align-top">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="rounded-full bg-[#194236] px-2.5 py-0.5 text-[10px] font-bold text-white">
                                {exam.streamCategory}
                              </span>
                              <p className="mt-1.5 font-serif-editorial text-lg font-medium text-[#16382E]">
                                {exam.name}
                              </p>
                              <p className="text-xs font-medium text-[#A67C46]">{exam.degree}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleCompareExam(exam.id)}
                              className="text-xs text-[#4A5550] hover:text-red-700 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD0]">
                    <tr className="bg-white/70">
                      <td className="py-3.5 pr-4 font-semibold text-[#16382E]">
                        Prep Synergy & Overlap
                      </td>
                      {compareExamsList.map((exam) => (
                        <td key={exam.id} className="py-3.5 px-4 font-medium text-[#194236]">
                          {exam.prepSynergy}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-[#16382E]">
                        Target Score / Cutoff
                      </td>
                      {compareExamsList.map((exam) => (
                        <td key={exam.id} className="py-3.5 px-4 text-[#2C3632]">
                          {exam.blueprint.targetScore}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-white/70">
                      <td className="py-3.5 pr-4 font-semibold text-[#16382E]">
                        Total Tuition Outlay
                      </td>
                      {compareExamsList.map((exam) => (
                        <td key={exam.id} className="py-3.5 px-4">
                          <span className="font-bold text-[#16382E]">
                            ~₹{exam.avgTotalFeeLakhs} Lakhs
                          </span>
                          <p className="mt-1 text-xs text-[#4A5550]">
                            {exam.campusReality.feesVsRoi}
                          </p>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-[#16382E]">
                        Years 0–2 Entry Pay
                      </td>
                      {compareExamsList.map((exam) => (
                        <td key={exam.id} className="py-3.5 px-4 text-[#2C3632]">
                          <span className="inline-block rounded-full bg-[#194236]/10 px-2.5 py-0.5 text-xs font-bold text-[#194236] mb-1">
                            ~₹{exam.avgEntrySalaryLakhs} LPA Median
                          </span>
                          <p className="text-xs">{exam.timeline.years0to2}</p>
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-white/70">
                      <td className="py-3.5 pr-4 font-semibold text-[#16382E]">
                        Years 3–6 Mid-Career
                      </td>
                      {compareExamsList.map((exam) => (
                        <td key={exam.id} className="py-3.5 px-4 text-[#2C3632]">
                          <span className="inline-block rounded-full bg-[#A67C46]/15 px-2.5 py-0.5 text-xs font-bold text-[#87602F] mb-1">
                            ~₹{exam.avgMidSalaryLakhs} LPA Mid-Career
                          </span>
                          <p className="text-xs">{exam.timeline.years3to6}</p>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-[#16382E]">
                        Years 7–10+ Ceiling
                      </td>
                      {compareExamsList.map((exam) => (
                        <td key={exam.id} className="py-3.5 px-4 text-xs text-[#2C3632]">
                          {exam.timeline.years7to10Plus}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-white/70">
                      <td className="py-3.5 pr-4 font-semibold text-[#16382E]">
                        Work-Life & Stress Verdict
                      </td>
                      {compareExamsList.map((exam) => (
                        <td key={exam.id} className="py-3.5 px-4 text-xs text-[#2C3632]">
                          <span className="font-bold text-[#16382E]">
                            {exam.lifestyleVerdict.stressLevel}:
                          </span>{" "}
                          {exam.lifestyleVerdict.workLifeBalance}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2DDD0] pt-4">
              <span className="text-xs text-[#4A5550]">
                Want a custom head-to-head breakdown for your {studentStream} profile?
              </span>
              <button
                type="button"
                onClick={() =>
                  openCounsellorWithPrompt(
                    "Compare " +
                      compareExamsList.map((e) => e.name).join(" vs ") +
                      " for my " +
                      studentStream +
                      " profile across 10-year ROI, college fees, syllabus overlap, and work-life balance. Which one should be my primary target?",
                    "gemini-2.5-pro"
                  )
                }
                className="rounded-full bg-[#194236] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#123027] cursor-pointer"
              >
                Ask Gemini 2.5 Pro to Compare These {compareExamsList.length} Exams →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SHORTLISTED 4-BUCKET PORTFOLIO MODAL */}
      {isShortlistModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#16382E]/60 p-4 backdrop-blur-xs no-print"
          onClick={() => setIsShortlistModalOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#E2DDD0] bg-[#F9F7F1] p-6 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2DDD0] pb-4">
              <div>
                <p className="eyebrow-tracked text-[#A67C46]">YOUR 4-BUCKET EXAM PORTFOLIO</p>
                <h3 className="mt-1 font-serif-editorial text-2xl font-medium text-[#16382E]">
                  Saved Pathways ({portfolioExams.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShortlistModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2DDD0] bg-white text-[#16382E] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-[#E2DDD0] bg-white p-3.5 text-xs text-[#16382E]">
              <strong>{portfolioDiagnostics.title}:</strong> {portfolioDiagnostics.message}
            </div>

            {portfolioExams.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-[#4A5550]">
                  You haven&apos;t added any exams yet. Assign Dream, Target, Wildcard, or Backup on
                  any exam card.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {portfolioExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#E2DDD0] bg-white p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#194236] px-2.5 py-0.5 text-[10px] font-bold text-white">
                          {exam.bucket}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C46]">
                          {exam.streamCategory} · ~₹{exam.avgTotalFeeLakhs}L Fee
                        </span>
                      </div>
                      <p className="mt-1 font-serif-editorial text-base font-medium text-[#16382E]">
                        {exam.name}
                      </p>
                      <p className="text-xs text-[#4A5550]">{exam.degree}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {BUCKET_TYPES.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setExamBucket(exam.id, b.id)}
                          className={
                            "rounded-full px-2.5 py-1 text-[10px] font-bold cursor-pointer border " +
                            (exam.bucket === b.id
                              ? b.badgeClass + " border-transparent"
                              : "border-[#E2DDD0] bg-[#F9F7F1] text-[#4A5550]")
                          }
                        >
                          {b.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => toggleShortlist(exam.id)}
                        className="rounded-full bg-[#F9F7F1] px-2.5 py-1 text-xs font-semibold text-[#4A5550] hover:text-red-700 cursor-pointer"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2DDD0] pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsShortlistModalOpen(false);
                  setIsFamilyDossierOpen(true);
                }}
                className="rounded-full border border-[#16382E]/25 bg-white px-4 py-2.5 text-xs font-semibold text-[#16382E] cursor-pointer"
              >
                Open Printable Family Dossier 🖨️
              </button>
              <button
                type="button"
                onClick={() =>
                  openCounsellorWithPrompt(
                    "Audit my current 4-Bucket Portfolio (" +
                      (portfolioExams.map((e) => e.bucket + ": " + e.name).join(", ") || "none yet") +
                      ") for my " +
                      studentStream +
                      " stream. Tell me if my portfolio is well-balanced across Dream, Target, Wildcard, and Backup options.",
                    "gemini-2.5-pro"
                  )
                }
                className="rounded-full bg-[#194236] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#123027] cursor-pointer"
              >
                Analyze My Portfolio with Gemini 2.5 Pro →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PARENT-READY PRINTABLE FAMILY DOSSIER */}
      {isFamilyDossierOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#16382E]/60 p-3 sm:p-6 backdrop-blur-xs"
          onClick={() => setIsFamilyDossierOpen(false)}
        >
          <div
            id="printable-family-dossier"
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#E2DDD0] bg-white p-6 sm:p-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2DDD0] pb-6">
              <div>
                <p className="eyebrow-tracked text-[#A67C46]">
                  DISHA EDITORIAL · EXECUTIVE FAMILY DISCUSSION REPORT
                </p>
                <h3 className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-medium text-[#16382E]">
                  Class 12 Career & 10-Year ROI Family Dossier
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#4A5550]">
                  Prepared for Parent-Student Alignment · Active Academic Stream:{" "}
                  <strong className="text-[#16382E]">{studentStream}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-full bg-[#194236] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#123027] cursor-pointer"
                >
                  Print / Save as PDF 🖨️
                </button>
                <button
                  type="button"
                  onClick={() => setIsFamilyDossierOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2DDD0] bg-[#F9F7F1] text-[#16382E] cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Section A: Psychometric & Stream Summary */}
            <div className="mt-6 rounded-2xl border border-[#E2DDD0] bg-[#F9F7F1]/70 p-5">
              <p className="eyebrow-tracked text-[#A67C46]">
                01 · STUDENT APTITUDE & ARCHETYPE SUMMARY
              </p>
              {quizResults ? (
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="font-serif-editorial text-xl font-medium text-[#16382E]">
                      {quizResults.archetype.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#4A5550]">
                      {quizResults.archetype.tagline}
                    </p>
                    <p className="mt-2 text-xs font-medium text-[#16382E]">
                      {quizResults.archetype.advice}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {quizResults.sortedTraits.map((t) => (
                      <div key={t} className="flex items-center justify-between text-xs">
                        <span className="text-[#4A5550]">{t}</span>
                        <span className="font-bold text-[#16382E]">
                          {quizResults.percentages[t]}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs text-[#4A5550]">
                   Academic Stream selected: <strong>{studentStream}</strong>. Complete the
                  7-question Aptitude Quiz on the main page to populate full psychometric scores in
                  this printout.
                </p>
              )}
            </div>

            {/* Section B: 4-Bucket Exam Portfolio & Financial Table */}
            <div className="mt-6">
              <p className="eyebrow-tracked text-[#A67C46]">
                02 · SHORTLISTED 4-BUCKET EXAM PORTFOLIO & 10-YEAR ROI
              </p>
              <p className="mt-1 text-xs text-[#4A5550]">
                {portfolioDiagnostics.title} — {portfolioDiagnostics.message}
              </p>

              <div className="mt-4 space-y-3">
                {portfolioExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="rounded-2xl border border-[#E2DDD0] bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="rounded-full bg-[#194236] px-2.5 py-0.5 text-[10px] font-bold text-white">
                          {exam.bucket} Bucket
                        </span>
                        <h5 className="mt-1 font-serif-editorial text-lg font-medium text-[#16382E]">
                          {exam.name} — <span className="text-sm text-[#A67C46]">{exam.degree}</span>
                        </h5>
                      </div>
                      <span className="text-xs font-bold text-[#16382E]">
                        Est. 4/5-Yr Fee: ~₹{exam.avgTotalFeeLakhs}L · Entry Pay: ~₹
                        {exam.avgEntrySalaryLakhs} LPA
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[#2C3632]">
                      <strong>Top Colleges & ROI Reality:</strong> {exam.campusReality.topColleges} —{" "}
                      {exam.campusReality.feesVsRoi}
                    </p>
                    <p className="mt-1 text-xs text-[#4A5550]">
                      <strong>10-Year Progression:</strong> Yr 0–2: {exam.timeline.years0to2} | Yr
                      7–10+: {exam.timeline.years7to10Plus}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: Parent Discussion Checklist */}
            <div className="mt-6 rounded-2xl border border-[#E2DDD0] bg-[#F9F7F1]/70 p-5">
              <p className="eyebrow-tracked text-[#A67C46]">
                03 · RECOMMENDED FAMILY DISCUSSION CHECKLIST
              </p>
              <ul className="mt-2.5 space-y-1.5 text-xs text-[#2C3632]">
                <li>
                  • <strong>Financial Ceiling:</strong> Agree on a comfortable family tuition budget
                  before April–June counselling rounds begin.
                </li>
                <li>
                  • <strong>Zero Single-Exam Trap:</strong> Ensure applications are submitted for at
                  least 1 Wildcard (IPMAT/CLAT/UCEED/IAT) and 1 Backup (CUET-UG / State CET).
                </li>
                <li>
                  • <strong>May Exam Pacing:</strong> Map out travel and rest days between the First
                  Sunday of May (NEET) through Late May (JEE Adv, IPMAT, CUET, IAT).
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER DRAWER: LIVE GEMINI 2.5 AI CAREER COUNSELLOR (gemini-2.5-pro & gemini-2.5-flash) */}
      {isCounsellorOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#16382E]/50 backdrop-blur-xs no-print"
          onClick={() => setIsCounsellorOpen(false)}
        >
          <aside
            className={
              "flex h-screen w-full flex-col overflow-hidden border-l border-[#E2DDD0] bg-[#F9F7F1] shadow-2xl transition-all duration-300 " +
              (isCounsellorWide ? "max-w-5xl" : "max-w-xl")
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* Compact Single-Row Top Header */}
            <div className="shrink-0 border-b border-[#E2DDD0] bg-white px-4 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <h3 className="font-serif-editorial text-lg font-medium text-[#16382E]">
                    Disha <span className="italic text-[#A67C46]">Gemini 2.5</span>
                  </h3>

                  {/* Inline Compact Model Pill Switcher */}
                  <div className="inline-flex items-center rounded-full border border-[#E2DDD0] bg-[#F9F7F1] p-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedModel("gemini-2.5-pro")}
                      title="Deep Trajectory & Strategy Mode (gemini-2.5-pro)"
                      className={
                        "rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer " +
                        (selectedModel === "gemini-2.5-pro"
                          ? "bg-[#194236] text-white shadow-2xs"
                          : "text-[#4A5550] hover:text-[#16382E]")
                      }
                    >
                      2.5 Pro
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel("gemini-2.5-flash")}
                      title="Instant Q&A Mode (gemini-2.5-flash)"
                      className={
                        "rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer " +
                        (selectedModel === "gemini-2.5-flash"
                          ? "bg-[#194236] text-white shadow-2xs"
                          : "text-[#4A5550] hover:text-[#16382E]")
                      }
                    >
                      2.5 Flash
                    </button>
                  </div>
                </div>

                {/* Right Utility Controls: Key, Expand/Wide, Reset, Close */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowApiSettings((s) => !s)}
                    className={
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer " +
                      (showApiSettings
                        ? "border-[#16382E] bg-[#16382E] text-white"
                        : customApiKey.trim()
                        ? "border-[#194236]/30 bg-[#194236]/10 text-[#194236]"
                        : "border-[#E2DDD0] bg-[#F9F7F1] text-[#4A5550] hover:border-[#A67C46]")
                    }
                    title="Configure Google AI Studio API Key"
                  >
                    {customApiKey.trim() ? "Key ✓" : "API Key"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCounsellorWide((w) => !w)}
                    className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#E2DDD0] bg-[#F9F7F1] px-2.5 py-1 text-[11px] font-semibold text-[#16382E] transition-colors hover:border-[#A67C46] cursor-pointer"
                    title={isCounsellorWide ? "Switch to compact drawer" : "Expand to wide reading view"}
                  >
                    <span>{isCounsellorWide ? "Compact ⤡" : "Expand ⤢"}</span>
                  </button>

                  {messages.length > 1 && (
                    <button
                      type="button"
                      onClick={resetCounsellorChat}
                      className="rounded-full border border-[#E2DDD0] bg-[#F9F7F1] px-2.5 py-1 text-[11px] font-semibold text-[#4A5550] transition-colors hover:border-[#16382E] hover:text-[#16382E] cursor-pointer"
                      title="Reset Conversation"
                    >
                      Reset
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsCounsellorOpen(false)}
                    aria-label="Close AI Counsellor"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E2DDD0] bg-[#F9F7F1] text-xs text-[#16382E] hover:border-[#16382E] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Collapsible API Key Drawer (Only visible when clicked, auto-closes on Done or Send) */}
              {showApiSettings && (
                <div className="mt-2.5 rounded-xl border border-[#E2DDD0] bg-[#F9F7F1] p-3">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-[#16382E]">
                      Google AI Studio Key ({selectedModel})
                    </span>
                    <a
                      href="https://aistudio.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#A67C46] underline"
                    >
                      Get free key at aistudio.google.com ↗
                    </a>
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="Paste AIzaSy... key (saved in browser)"
                      className="flex-1 rounded-lg border border-[#E2DDD0] bg-white px-2.5 py-1.5 text-xs text-[#16382E] focus:border-[#16382E] focus:outline-none"
                    />
                    {customApiKey && (
                      <button
                        type="button"
                        onClick={() => setCustomApiKey("")}
                        className="rounded-lg border border-[#E2DDD0] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#4A5550] hover:text-red-700 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowApiSettings(false)}
                      className="rounded-lg bg-[#194236] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#123027] cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Single-Line Ultra-Slim Context Strip */}
            <div className="shrink-0 flex items-center justify-between gap-2 border-b border-[#E2DDD0] bg-[#F9F7F1]/90 px-4 py-1.5 text-[11px] text-[#4A5550] overflow-x-auto">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="rounded-full bg-white border border-[#E2DDD0] px-2 py-0.5 font-semibold text-[#16382E]">
                  Stream: {studentStream}
                </span>
                <span className="rounded-full bg-white border border-[#E2DDD0] px-2 py-0.5 font-semibold text-[#16382E]">
                  Quiz: {quizResults ? quizResults.archetype.title : "Not taken"}
                </span>
                <span className="rounded-full bg-white border border-[#E2DDD0] px-2 py-0.5 font-semibold text-[#16382E]">
                  Portfolio: {portfolioItems.length} exams
                </span>
              </div>
              <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-[#A67C46] whitespace-nowrap">
                {selectedModel === "gemini-2.5-pro" ? "Deep Strategy Mode" : "Instant Q&A Mode"}
              </span>
            </div>

            {/* SPACIOUS SCROLLABLE CHAT CONTAINER (Occupies 80%+ of Drawer Height) */}
            <div className="flex-1 min-h-0 space-y-4 overflow-y-auto px-4 sm:px-6 py-4">
              {apiNotice && (
                <div className="rounded-xl border border-[#A67C46]/40 bg-[#A67C46]/10 p-3 text-xs text-[#6B4A21]">
                  {apiNotice}
                </div>
              )}

              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={"flex flex-col " + (isUser ? "items-end" : "items-start")}
                  >
                    {!isUser && (
                      <div className="mb-1 ml-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C46]">
                          {msg.modelUsed}
                        </span>
                        {msg.isFallback && (
                          <span className="rounded-full bg-[#A67C46]/15 px-2 py-0.2 text-[9px] font-semibold text-[#87602F]">
                            Smart Profile Engine
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      className={
                        "rounded-2xl px-4 py-3.5 shadow-2xs " +
                        (isUser
                          ? "max-w-[85%] bg-[#194236] text-white text-sm leading-relaxed"
                          : "max-w-[96%] border border-[#E2DDD0] bg-white text-[#16382E]")
                      }
                    >
                      {isUser ? msg.text : renderFormattedText(msg.text)}
                    </div>
                  </div>
                );
              })}

              {/* Starter Prompt Cards INSIDE Scrollable Feed (Scrolls away naturally with chat) */}
              {messages.length <= 2 && !isGenerating && (
                <div className="rounded-2xl border border-[#E2DDD0] bg-white/80 p-3.5 shadow-2xs">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A67C46]">
                    Suggested Starting Topics (Or type &quot;Hi&quot; below)
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {COUNSELLOR_PROMPT_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => sendMessageToCounsellor(chip)}
                        disabled={isGenerating}
                        className="rounded-xl border border-[#E2DDD0] bg-[#F9F7F1]/70 px-3 py-2 text-left text-xs font-medium text-[#16382E] transition-colors hover:border-[#A67C46] hover:bg-white cursor-pointer"
                      >
                        {chip} →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="flex items-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-[#E2DDD0] bg-white px-4 py-3 text-xs font-medium text-[#4A5550] shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-[#A67C46] animate-ping" />
                    <span>{selectedModel} is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Optional Collapsible Quick-Prompts Bar Above Composer */}
            {showQuickPromptsBar && (
              <div className="shrink-0 border-t border-[#E2DDD0] bg-[#F9F7F1] px-4 py-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C46]">
                    Quick Strategic Prompts
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQuickPromptsBar(false)}
                    className="text-[11px] font-semibold text-[#4A5550] hover:text-[#16382E] cursor-pointer"
                  >
                    Hide ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COUNSELLOR_PROMPT_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => sendMessageToCounsellor(chip)}
                      disabled={isGenerating}
                      className="rounded-full border border-[#E2DDD0] bg-white px-3 py-1 text-left text-[11px] font-medium text-[#16382E] transition-colors hover:border-[#A67C46] cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Compact Chat Composer Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessageToCounsellor();
              }}
              className="shrink-0 border-t border-[#E2DDD0] bg-white px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickPromptsBar((prev) => !prev)}
                  title="Toggle Quick Prompt Ideas"
                  className={
                    "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer " +
                    (showQuickPromptsBar
                      ? "border-[#A67C46] bg-[#A67C46] text-white"
                      : "border-[#E2DDD0] bg-[#F9F7F1] text-[#16382E] hover:border-[#A67C46]")
                  }
                >
                  ✨ Prompts
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={"Say hi or ask " + selectedModel + " anything..."}
                  className="flex-1 rounded-full border border-[#E2DDD0] bg-[#F9F7F1] px-4 py-2 text-sm text-[#16382E] placeholder-[#7A847F] focus:border-[#16382E] focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isGenerating}
                  className={
                    "shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold text-white transition-all " +
                    (!chatInput.trim() || isGenerating
                      ? "bg-[#194236]/40 cursor-not-allowed"
                      : "bg-[#194236] hover:bg-[#123027] cursor-pointer")
                  }
                >
                  Send →
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
