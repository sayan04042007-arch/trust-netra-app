# 🛡️ TrustNetra AI — Web Threat Intelligence & Indic Smishing Defense

[![CI Pipeline](https://github.com/sayan04042007-arch/trust-netra-app/actions/workflows/ci.yml/badge.svg)](https://github.com/sayan04042007-arch/trust-netra-app/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Security: CSP & HSTS](https://img.shields.io/badge/Security-CSP%20%26%20HSTS%20Hardened-green.svg)](https://trustnetra.vercel.app)
[![Tests: 16/16 Passing](https://img.shields.io/badge/Tests-16%2F16%20Passing-brightgreen.svg)](tests/trustnetra.test.js)

> **"Verify before you trust."**  
> An evidence-backed, client-side digital trust intelligence platform protecting Indian citizens against fraudulent websites, rogue Certificate Authorities, and coercive SMS/WhatsApp smishing in 8 regional languages.

---

## 📌 Problem Statement & Regional Fit

In India, **over 800 million citizens** navigate digital banking, utility payments, and college portals every day. Standard security software (like Google Safe Browsing or antivirus tools) exhibits two critical blind spots:
1. **SMS & WhatsApp Smishing Gap:** Generic tools only inspect browser URLs, leaving victims unprotected against urgency-driven banking SMS alerts, fake electricity disconnection notices, and fake lottery lures.
2. **Vernacular Dialect Gap:** Scammers craft phishing messages in Hindi, Bengali, Marathi, Tamil, Telugu, and Hinglish. International NLP models routinely misclassify or ignore these threats.
3. **Academic Portal False Alarms:** Traditional heuristic tools often falsely flag legitimate college portals (`.ac.in`) as suspicious because they contain login and credential submission forms.

**TrustNetra AI solves all three challenges directly inside the browser with 100% on-device privacy.**

---

## 🚀 Key Modules & Capabilities

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TRUSTNETRA AI CORE ARCHITECTURE                   │
├────────────────────────────────┬───────────────────────────────────────┤
│ Module 1: Heuristic Engine     │ Levenshtein Typosquatting & Entropy   │
│ Module 2: TLS & Cert Integrity │ RFC 6962 CT Log Audit & Rogue CA Flag │
│ Module 3: Indic NLP Scanner    │ Multilingual Smishing (8 Scripts)     │
│ Module 4: Academic Guard       │ TLD-Hardened Anti-Bypass Whitelist    │
│ Module 5: Content Security     │ CSP, HSTS, X-Frame-Options Hardening  │
│ Module 6: Automated Suite      │ Deterministic CI Testing (16 Tests)   │
└────────────────────────────────┴───────────────────────────────────────┘
```

### 1. Indic Smishing Detection (Module 3)
- **8 Regional Scripts:** Real-time identification of Hindi (देवनागरी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Urdu (اردو), and Hinglish.
- **Predatory Heuristics:** Detects fake bank helpline traps (pairing bank names with 10-digit mobile numbers) and unauthorized *"forward this SMS"* instructions.

### 2. TLD-Hardened Academic Guard (Module 4)
- Hardened domain verification ensuring `.ac.in` and `.gov.in` institutional portals score **96%+ Verified Safe**.
- **Adversarial Anti-Bypass:** Prevents crafted attacks such as `sbi-phishing.ac.in.evil.com` from spoofing academic immunity by requiring strict root TLD termination.

### 3. High-Assurance Privacy Model
- **Zero Remote Telemetry:** All inspections run 100% client-side via deterministic heuristics and regex tokenization. No browsing history or personal SMS messages leave the user's device.

---

## 🧪 Automated Testing & CI/CD Pipeline

TrustNetra AI includes a comprehensive automated test suite verifying every security boundary:

```bash
# Clone the repository
git clone https://github.com/sayan04042007-arch/trust-netra-app.git
cd trust-netra-app

# Run the automated test suite
node tests/trustnetra.test.js
```

### Test Coverage Highlights
- ✅ **Academic Whitelist:** `adamasknowledgecity.ac.in/student/login` ➔ **96% (Green)**
- ✅ **Government Root:** `incometax.gov.in` ➔ **96%+ (Green)**
- ✅ **Phishing Detection:** `sbi-online-kyc-update.xyz/login` ➔ **12% (Critical Red)**
- ✅ **Adversarial Bypass Resistance:** `sbi-phishing.ac.in.evil.com` ➔ **Blocked**
- ✅ **ATM Smishing Alert:** Unsolicited SBI ATM debit alert ➔ **85% (High Risk Flag)**
- ✅ **Genuine Bank Alert:** Official bank transaction notice ➔ **20% (Low Risk)**

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI workflow (auto-test on push)
├── tests/
│   └── trustnetra.test.js    # 16-test automated evaluation suite
├── index.html                # VeriQ-inspired clean editorial user interface
├── styles.css                # Pure modern CSS design system with Dark/Light theme
├── app.js                    # Modular threat scanning & Indic NLP engine
├── vercel.json               # HTTP Security Headers (CSP, HSTS, X-Frame-Options)
└── README.md                 # Project documentation & benchmark overview
```

---

## 🛡️ HTTP Security & Defense Headers

Deployed with production-grade headers configured in `vercel.json`:
- **Content-Security-Policy (CSP):** Restricts script execution to legitimate self-origins.
- **Strict-Transport-Security (HSTS):** Enforces HTTPS encryption for 2 years with preload.
- **X-Frame-Options: DENY:** Protects against iframe clickjacking attacks.
- **X-Content-Type-Options: nosniff:** Prevents MIME-type confusion exploits.

---

## 👥 HackMatrix Submission
Built with pride for the **HackMatrix Web Threat Defense Challenge**.
