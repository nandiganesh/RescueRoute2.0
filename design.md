# RescueRoute - Restaurant Portal UI/UX Design

## 🎯 CORE OBJECTIVE
Design a mobile-first UI that allows restaurant staff to:
- Report surplus food in under 10 seconds.
- Track pickup status in real time.
- Perform actions with minimum effort and zero confusion.

## ⚠️ DESIGN PRINCIPLES
- **Speed over aesthetics**: Fast utility tool for busy environments.
- **Maximum 1–2 taps per action**: Interactions must be immediate.
- **No long forms / No clutter**: Keep inputs minimal and touch-friendly.
- **Instantly understandable**: Experience should mimic tools from Zomato or Swiggy.

## 📱 SCREEN SPECIFICATIONS
- **Size**: Mobile only (iPhone-like proportions).
- **Format**: Large touch targets, high contrast.

---

## 🧱 SCREENS

### 1. Home Dashboard
**Purpose**: Quick access and status overview.
- Top bar with app logo.
- Primary action button: **“Donate Surplus Food”** (prominent, full-width).
- Active donation status card:
  - Current status (waiting, assigned, pickup, completed).
  - Volunteer name & ETA.
- Small stats section: Meals donated today.

### 2. Quick Donation Screen
**Purpose**: Input in under 10 seconds.
- Food type selector (selectable chips).
- Quantity input (stepper or large numeric input).
- Expiry time selector (quick preset chips: 1h, 2h, 4h).
- Optional photo upload.
- Large, sticky submit button at the bottom.

### 3. Donation Status Screen
- Step progress indicator (posted → assigned → pickup → completed).
- Volunteer details card (name, distance, ETA).
- Live updates.
- Cancel option (only available before pickup).

### 4. Donation History Screen
- List of previous donations.
- Items show: Date, food type, quantity, and status pill.

### 5. Notifications Screen
- List of updates: Volunteer assigned, pickup arriving, delivery completed.

### 6. Profile / Settings Screen
- Restaurant name & address.
- Operating hours.
- Logout button.

---

## 🎨 DESIGN SYSTEM RULES
- **Colors**: Use high-contrast, functional colors. Green for success/submit, subtle grays for backgrounds, dark text for readability.
- **Typography**: Clean, sans-serif font (Inter or Roboto). Large headings, easily scannable labels.
- **Shapes**: Rounded corners for a modern, approachable feel, but kept highly structured.
