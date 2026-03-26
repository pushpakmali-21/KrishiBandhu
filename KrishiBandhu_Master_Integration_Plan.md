# KrishiBandhu — Master Feature Integration & Scaling Plan

**Team:** Tech Titans | **College:** R C Patel Institute of Technology, Shirpur
**Hackathon Host:** K.K. Wagh Institute of Engineering Education & Research, Nashik
**Theme:** Agriculture Technology / Smart Farming
**Problem Statement:** Trusted Farm-to-Market Digital Marketplace with Price Intelligence

---

## 1. Project Context

KrishiBandhu is an AI-powered Farm-to-Market Intelligence Platform designed to close the **market intelligence gap** that forces farmers to accept unfair prices. As the pitch deck frames it: *"Farmers don't lack effort — they lack information."*

### What Exists Today (From Screenshots)

The current working dashboard includes:

- **Crop Analysis** panel with crop switcher (Wheat / Jowar / Cotton)
- **Current Price** card — e.g., ₹2,150/quintal for Wheat
- **7-Day Forecast Peak** card — e.g., ₹2,340
- **Market Volatility** indicator — e.g., 2.5% (Low Risk)
- **AI Recommendation card** — "WAIT" with ML Confidence Score (85%)
- **Price Trend & Forecast** line chart (30-day window)
- **7-Day Demand Heatmap** with High / Medium / Low demand per day
- **Landing page** with Price Forecasting, Smart Recommendations, and Trusted Marketplace feature cards
- **Live Mandi Feed** button and **Nashik Hub** location selector in the header

### What Is Promised but Missing (Gap Summary)

| Feature | Status |
|---|---|
| Trusted Marketplace Tab | ❌ Not built |
| Buyer Trust Score & Verification | ❌ Not built |
| Net-Profit / Logistics Calculator | ⚠️ Partial — price shown, no profit math |
| Voice-First Assistant (Krishi-Vani) | ❌ Not built |
| Multilingual UI (EN / HI / MR) | ❌ Not built |
| Farmer Input Form (yield, quality, urgency) | ❌ Not built |
| Weather-Impact Context Card | ❌ Not built |
| Buyer App Interface | ❌ Not built |
| Live Mandi Feed content | ⚠️ Button exists, feed empty |
| Risk & Volatility Detail View | ⚠️ Score shown, no breakdown |
| Continuous Learning Feedback Loop | ⚠️ Implicit in architecture, no UI |
| SMS Fallback (no-smartphone access) | ❌ Not built |
| Government / e-NAM Integration Badge | ❌ Not built |

---

## 2. System Architecture Overview

Based on the pitch deck, the full system has five layers:

```
External Data                    AI Intelligence Engine
─────────────────                ────────────────────────────────
• Weather API          ──────►  • Price Prediction Model
• Mandi Price API               • Demand Forecast Module
• Demand Trends                 • Trust Score System & Volatility Analysis
• Farmer Inputs                 • Profit Optimization Logic
                                • Explainable & Transparent AI
        │
        ▼
Backend & Data Processing        Farmer App         Buyer App
────────────────────────         ──────────         ─────────────────
• Data Cleaning       ──────►   • Live Price    ►  • Fair Price Range
• Feature Engineering            • 7-Day Forecast   • Farmer Trust Score
• Database Storage               • Sell/Wait Advice  • Logistics Estimate
• Secure API Comms               • Buyer Verify      • Secure Transaction
                                        │
                                        ▼
                               Continuous Learning Loop
                               ────────────────────────
                               • Trust Updates
                               • Model Improvement
                               • Demand Refinement
```

---

## 3. Implementation Roadmap

### Phase 1 — Accessibility & Localization *(Weeks 1–2)*
**Goal:** Break the literacy and language barrier for rural farmers.

#### 1.1 Multilingual UI Toggle
- **Location:** Top-right corner of the navbar
- **Languages:** English / हिन्दी / मराठी
- **Tech:** `react-intl` or `i18next` with translation JSON files
- **Persistence:** Store language preference in `localStorage`
- **Why it matters:** Proves the app is designed for the actual farmer, not just tech-savvy middlemen

#### 1.2 Farmer Input Form Modal
- **Trigger:** "Edit Inputs" button in the Crop Analysis section
- **Fields:**
  - Crop quantity (quintals)
  - Crop quality/grade (A / B / C)
  - Storage condition (Fresh / Stored)
  - Days in storage
  - Selling urgency (Immediate / Within 3 days / Flexible)
  - Optional notes
- **Purpose:** Makes AI recommendations context-aware and personalized

#### 1.3 Voice-Activated Assistant — "Krishi-Vani"
- **UI:** Floating Action Button (microphone icon) on the dashboard
- **Sample voice queries:**
  - "Aaj gehu bechu ya ruku?" → highlights Sell/Wait card
  - "Tell me wheat price" → speaks current price aloud
  - "Show demand forecast" → scrolls to heatmap
- **Tech:** Browser-native `Web Speech API (SpeechRecognition)` + simple intent matcher
- **Voice Output:** Text-to-speech reading of the AI recommendation
- **Languages:** English, Hindi, Marathi phonetic support

---

### Phase 2 — Contextual Intelligence *(Week 2)*
**Goal:** Move farmers from gross price awareness to real take-home profit understanding.

#### 2.1 Weather-Impact Context Card
- **Location:** New card in the dashboard grid, linked to the selected crop
- **Data:** OpenWeatherMap API or IMD API (free tier)
- **Display example:**
  > ⚠️ Rain expected in 2 days. High risk of crop damage. Consider selling early despite lower market price.
- **Why it matters:** Combines weather risk with price advice — something no government portal does

#### 2.2 Net-Profit Calculator Modal
- **Trigger:** Click on the "Current Price" card
- **Farmer inputs in modal:**
  1. Expected Yield (quintals)
  2. Distance to Mandi (km)
- **Calculation logic:**
  ```
  Net Take-Home Profit = (Predicted Price × Yield) − (Freight Cost per KM × Distance)
  Potential Gain if Waiting = (Forecast Peak × Yield) − (same freight) − (storage cost estimate)
  ```
- **Display:** Side-by-side comparison: "Sell Today" vs. "Wait for Peak"
- **Differentiator:** This is what Agmarknet and other government portals do NOT show

#### 2.3 Risk & Volatility Detail View
- **Trigger:** Click on the "Market Volatility" card (currently shows only 2.5%)
- **Expanded view shows:**
  - Historical volatility trend (sparkline chart)
  - Key risk factors (monsoon impact, government procurement, export policy)
  - Mitigation strategies ("Spread sales across 3 days to reduce price risk")

---

### Phase 3 — Trust Ecosystem / Digital Marketplace *(Weeks 3–4)*
**Goal:** Fulfill the "Farm-to-Market" promise by closing the loop between recommendation and actual sale.

#### 3.1 Trusted Marketplace Tab
- **New tab added to dashboard navigation**
- **Sub-sections:**
  ```
  Marketplace
  ├── Browse Buyers
  │   ├── Buyer Name, Location, Trust Score
  │   ├── Verification Badges (KYC, transaction history)
  │   ├── Avg. Purchase Price & Volume
  │   └── "View Profile" → Chat & Negotiate
  ├── My Active Listings
  │   ├── Posted crop offers
  │   ├── Buyer interest / counter-offers
  │   └── Negotiation status
  └── Transaction History
      ├── Past sales
      ├── Actual price vs. AI forecast
      └── Buyer ratings given
  ```

#### 3.2 Buyer Trust Score System
- **Display format:** ★★★★☆ 4.5/5 | 287 Transactions | ✅ KYC Verified
- **Trust factors (mocked for hackathon):**
  - Payment reliability
  - On-time payment rate
  - Farmer review score
  - Dispute history (zero = green)
- **Color coding:**
  - 🟢 Green (4.5+) — Safe to trade
  - 🟡 Yellow (3.5–4.4) — Verify before trading
  - 🔴 Red (< 3.5) — Proceed with caution
- **CTA buttons:** "Initiate Trade" or "Call Buyer" next to high-trust profiles

#### 3.3 Direct Negotiation Interface
- **In-app chat between farmer and buyer**
- **Features:** Real-time price negotiation, message history, agreed-price confirmation, transaction summary PDF

---

### Phase 4 — Buyer App Interface *(Weeks 6–7)*
**Goal:** Build the buyer-side dashboard shown in the system architecture.

#### 4.1 Buyer Dashboard
```
Buyer App
├── Search Crops (filter by crop type, quantity, quality, location)
├── Farmer Profiles
│   ├── Farmer Trust Score
│   ├── Past transaction volume & quality consistency
│   └── "Make Offer" button
├── Fair Price Range
│   ├── Market average for crop
│   ├── Logistics cost estimate
│   ├── Quality-adjusted suggested offer
│   └── AI-recommended offer price
└── Secure Transactions
    ├── Escrow payment option
    ├── Dispute resolution channel
    └── Digital transaction proof
```

#### 4.2 Logistics Integration
- **Logistics Calculator:**
  - Transportation cost per quintal (₹/quintal)
  - Delivery timeline (days)
  - Available logistics partners (mocked list)
  - Insurance option toggle
- **Integration:** Feed logistics cost back into the Farmer's Net-Profit Calculator

---

### Phase 5 — Feedback & Continuous Learning *(Week 8)*
**Goal:** Implement the Continuous Learning Loop described in the system architecture.

#### 5.1 Post-Transaction Feedback Form
- Shown after each completed or skipped trade:
  - "Actual price you received vs. our forecast: ₹__"
  - "Rate this recommendation" (1–5 stars)
  - "Was the buyer trustworthy?" (Yes / No)
  - Optional: "What influenced your decision?"
- **Data is used to:** Retrain price prediction model, update buyer trust scores, refine demand forecasts

#### 5.2 Farmer Performance Dashboard
- **Visible stats:**
  - "Our forecast accuracy: 85%"
  - "Your profit improvement vs. baseline: +12.5%"
  - "AI recommendations followed: 23"
  - "Average profit per sale: ₹2,340"

---

### Phase 6 — Future-Proofing & Pitch Deck Alignments *(Post-Hackathon)*

#### 6.1 SMS Fallback (Concept Demo)
- Small UI section showing how farmers without smartphones receive "Sell / Wait" as a basic SMS alert
- Demonstrates low-tech accessibility in rural areas

#### 6.2 Government Integration Badge
- "Verified by e-NAM" badge on buyer profiles
- Shows how KrishiBandhu integrates with existing government agricultural infrastructure

#### 6.3 Future Product Vision (From Pitch Deck)
- AI-based guidance on *what* crop to grow and *when*
- Loan and micro-credit access based on farmer trust score
- Smart crop insurance using risk prediction models
- Sustainability tracking for climate-friendly farming

---

## 4. Technical Stack & Implementation Details

### Frontend
```
Framework:     React.js (existing)
i18n:          react-intl or i18next (multilingual)
Voice:         Web Speech API — SpeechRecognition + SpeechSynthesis
Weather:       OpenWeatherMap API (free tier)
Charts:        Recharts or Chart.js (existing)
State:         React Context API (language, farmer inputs, auth)

New Components to Build:
  LanguageSwitcher       FarmerInputForm       ProfitCalculatorModal
  WeatherContextCard     MarketplaceTab        BuyerCard
  TrustScoreBadge        VoiceControlFAB       FeedbackModal
  NegotiationChat        PerformanceDashboard  LogisticsCalculator
```

### Backend / APIs
```
New Endpoints:
  POST /api/farmers/{id}/inputs        — Save farmer crop details
  GET  /api/buyers                     — List verified buyers
  GET  /api/buyers/{id}/trust-score    — Fetch trust score
  POST /api/marketplace/chat           — Send negotiation message
  POST /api/transactions/feedback      — Submit post-sale feedback
  POST /api/logistics/estimate         — Get transport cost estimate
  GET  /api/weather/{location}         — Fetch weather context

New Database Tables:
  farmer_inputs          buyer_verification      trust_scores
  transaction_feedback   negotiation_history     logistics_partners
```

### Infrastructure
```
Real-time chat:    Redis message queue or Firebase Realtime DB
Notifications:     Firebase Cloud Messaging or Pusher
File storage:      AWS S3 (for KYC documents)
Voice API:         Web Speech API (browser) or Google Cloud Speech
Deployment:        Cloud (AWS / GCP / Azure) — modular, region-wise
```

---

## 5. Feature Priority Matrix

| Feature | Priority | Effort | Impact | Timeline |
|---|---|---|---|---|
| Language Switcher | HIGH | LOW | HIGH | Week 1 |
| Farmer Input Form | HIGH | MEDIUM | HIGH | Week 1–2 |
| Net-Profit Calculator | HIGH | MEDIUM | CRITICAL | Week 2 |
| Weather Context Card | HIGH | LOW | HIGH | Week 2 |
| Marketplace Tab | HIGH | HIGH | CRITICAL | Week 3–4 |
| Buyer Trust Score | HIGH | MEDIUM | CRITICAL | Week 3–4 |
| Voice Assistant | MEDIUM | MEDIUM | MEDIUM | Week 5 |
| Direct Chat / Negotiation | MEDIUM | MEDIUM | HIGH | Week 4 |
| Buyer App Interface | MEDIUM | HIGH | HIGH | Week 6–7 |
| Logistics Integration | MEDIUM | MEDIUM | MEDIUM | Week 6–7 |
| Feedback Loop UI | LOW | MEDIUM | MEDIUM | Week 8 |
| SMS Fallback Demo | LOW | LOW | HIGH (pitch) | Post-hackathon |
| e-NAM Badge | LOW | LOW | HIGH (pitch) | Post-hackathon |

---

## 6. Proposed Dashboard Layout Redesign

```
Current Layout:
├── Crop Analysis (tabs: Wheat / Jowar / Cotton)
├── WAIT Recommendation card
├── Price Trend & Forecast chart
└── 7-Day Demand Heatmap

Proposed Layout:
Header:
  [🌐 EN | HI | MR]  [🎤 Krishi-Vani]  [📍 Nashik Hub]  [Live Mandi Feed]

Tab Navigation:
  [ Dashboard ]  [ Marketplace ]  [ Live Mandi ]  [ My Profile ]

Dashboard Tab:
  ├── Crop Switcher (Wheat / Jowar / Cotton) + "Edit Inputs" button
  ├── Stats Row: Current Price* | Forecast Peak | Market Volatility* | Weather Alert
  │   (* clickable: Current Price → Profit Calculator, Volatility → Risk Detail)
  ├── WAIT / SELL Recommendation card + Net-Profit summary
  ├── Price Trend & Forecast chart
  └── 7-Day Demand Heatmap

Marketplace Tab:
  ├── Buyer search & filters
  ├── Buyer cards (Trust Score, KYC badge, CTA)
  ├── My Listings & Negotiation status
  └── Transaction History

🎤 Voice FAB (floating, bottom-right, always visible)
```

---

## 7. Why KrishiBandhu Wins

### Empathy-Driven Design
Raw data is useless to a farmer who reads in Marathi and has no internet on harvest day. Every feature here is designed to reduce that gap — translated UI, spoken advice, and SMS fallback.

### Financial Reality
A high mandi price means nothing if transport cost eats the profit. The Net-Profit Calculator with logistics math is the single most grounding feature the platform can offer — and no competitor (including Agmarknet) provides it.

### Trust as Infrastructure
Farmer exploitation by middlemen persists because there is no accountability layer. By scoring buyers on payment history and dispute records, KrishiBandhu makes trust visible and quantifiable — eliminating the farmer's most rational reason to stay with the middleman.

### Continuous Improvement
The feedback loop means the AI gets smarter with every transaction. Forecast accuracy improves, trust scores reflect reality, and demand models sharpen — creating a compounding advantage over time.

---

## 8. Success Metrics

| Metric | Target |
|---|---|
| Farmer satisfaction with achieved price | +10% vs. pre-platform baseline |
| Average time to find a buyer | Reduction from ~3 days to < 1 day |
| Price forecast accuracy | ≥ 85% (maintained + improving) |
| Voice feature adoption | 30% of active users |
| Marketplace buyer engagement | 60% of dashboard users browse at least once |
| Feedback submission rate | > 40% post-transaction |
| Language toggle usage (non-English) | > 50% of rural users |

---

## 9. Immediate Next Steps (Sprint 0)

1. **Today:** Agree on component ownership across the 4-member team
2. **Day 1–2:** Set up i18next, add Hindi + Marathi JSON translation files, wire Language Switcher
3. **Day 2–3:** Build Farmer Input Form modal and persist to state
4. **Day 3–4:** Build Net-Profit Calculator modal with freight logic
5. **Day 4–5:** Integrate OpenWeatherMap, build Weather Context Card
6. **Day 5–7:** Build static Marketplace Tab with mocked buyer cards and Trust Scores
7. **Day 7:** Add Voice FAB with Web Speech API for Sell/Wait intent
8. **Before Demo:** End-to-end flow test in Marathi voice mode

---

*Consolidated Plan — Generated: March 26, 2026*
*Source documents: TechTitans PPT, Dashboard Screenshots (v1 & v2), Implementation_Plan.md, KrishiBandhu_Feature_Integration_Plan.md*
*Team: Tech Titans — Pushpak Mali, Vedant Birpan, Tanvi Mahajan, Rutuja Deshmukh*
