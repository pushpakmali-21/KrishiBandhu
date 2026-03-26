# KrishiBandhu — Build Checklist

> Track your progress step by step. Check off each item as you complete it.

---

## Phase 1 — Localization & Language

- [ ] Install i18next (or react-intl) and set up the translation config
- [ ] Create translation JSON files for English, Hindi, and Marathi — start with all existing UI labels
- [ ] Add Language Switcher dropdown (EN / HI / MR) to top-right navbar
- [ ] Persist selected language to localStorage so it survives page refresh
- [ ] Test every visible text label switches correctly across all 3 languages

---

## Phase 2 — Farmer Input Form

- [ ] Add an "Edit Inputs" button in the Crop Analysis section header
- [ ] Build a modal form with fields: Crop Quantity (quintals), Quality Grade (A/B/C), Storage Condition, Days in Storage, Selling Urgency
- [ ] Wire modal open/close state in React (useState)
- [ ] Save farmer inputs to React Context (or local state) so the dashboard can access them
- [ ] Display a summary of entered inputs as a small badge/tag near the crop selector

---

## Phase 3 — Net-Profit Calculator

- [ ] Make the Current Price card clickable — add a subtle hover state and cursor pointer
- [ ] Build the Profit Calculator modal with two inputs: Expected Yield (qtl) and Distance to Mandi (km)
- [ ] Implement the formula: Net Profit = (Price × Yield) − (Freight Cost/km × Distance)
- [ ] Show side-by-side comparison: "Sell Today" profit vs "Wait for Peak" profit
- [ ] Add a risk note: e.g. "8.8% gain with 2.5% volatility = LOW RISK"

---

## Phase 4 — Weather Context Card

- [ ] Sign up for a free OpenWeatherMap API key
- [ ] Fetch 3-day weather forecast for the selected mandi location (e.g. Nashik Hub)
- [ ] Build a Weather Context Card component that shows temperature + a short actionable message
- [ ] Add crop-weather logic: if rain in 2 days → show "⚠️ Consider selling early" alert
- [ ] Place the card in the dashboard grid next to the Market Volatility card

---

## Phase 5 — Marketplace Tab

- [ ] Add "Marketplace" as a new tab in the dashboard navigation bar
- [ ] Create mock buyer data array (5–8 buyers) with: name, location, trust score, KYC status, avg price, volume
- [ ] Build BuyerCard component showing trust stars, verification badge, and crop price offered
- [ ] Implement color-coded trust levels: Green (4.5+), Yellow (3.5–4.4), Red (<3.5)
- [ ] Add "Initiate Trade" and "Call Buyer" buttons on each high-trust buyer card
- [ ] Add a filter bar: filter buyers by crop type, minimum trust score, and location

---

## Phase 6 — Voice Assistant (Krishi-Vani)

- [ ] Add a floating microphone FAB button (bottom-right corner of dashboard)
- [ ] Implement Web Speech API SpeechRecognition — start/stop on FAB click
- [ ] Write intent-matcher: if transcript includes "bechu"/"sell" → highlight Sell card; "ruku"/"wait" → highlight Wait card
- [ ] Add voice output using SpeechSynthesis to read aloud the current AI recommendation
- [ ] Test mic in Chrome and fallback gracefully if browser does not support Web Speech API

---

## Phase 7 — Volatility Detail & Live Mandi

- [ ] Make the Market Volatility card clickable to open a detail modal
- [ ] Add a historical volatility mini-sparkline chart inside the modal (use mocked data)
- [ ] List 3–4 key risk factors (e.g. monsoon impact, procurement policy, export demand)
- [ ] Populate the Live Mandi Feed with at least mocked recent trade entries (price, volume, time)
- [ ] Add price comparison across 2–3 nearby mandis in the feed

---

## Phase 8 — Polish & Demo Prep

- [ ] Add a "Verified by e-NAM" badge to the Marketplace tab header
- [ ] Add an SMS Fallback concept section: a mockup showing a sample "Sell/Wait" SMS message
- [ ] Do a full end-to-end flow test switching language to Marathi, entering farmer inputs, and using voice
- [ ] Check all modals close correctly, all cards are responsive on mobile width
- [ ] Write a 30-second demo script: Landing Page → Dashboard → Profit Calculator → Marketplace → Voice FAB

---

*KrishiBandhu — Tech Titans | R C Patel Institute of Technology, Shirpur*
*Generated: March 26, 2026*
