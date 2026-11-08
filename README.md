# 👁️ TrustNetra AI — Web Threat Detection & Digital Trust Intelligence

> **AI-Powered Web Threat Detection, Cryptographic Certificate Auditor & Web3 Collaborative Trust Platform**  
> Built for the **HackMatrix (Technovax) Hackathon** across **Artificial Intelligence · Cybersecurity · Web3**.

---

## 📌 Problem Statement Alignment (Full HackMatrix Brief Coverage)

TrustNetra AI is architected from the ground up to address all 6 core modules specified in the official HackMatrix challenge brief:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          TRUSTNETRA AI ARCHITECTURE                    │
├────────────────────────────────┬───────────────────────────────────────┤
│ Module 1: URL Threat Analysis   │ Levenshtein Typosquatting & Entropy   │
│ Module 2: TLS & Web Trust      │ CT Log Audit & eMudhra Rogue CA Check │
│ Module 3: AI Message Scanner   │ NLP Social Engineering & SMS/Email    │
│ Module 4: Campaign Correlation │ Multi-Report Infrastructure Graph     │
│ Module 5: Web Security Posture │ Non-intrusive HSTS/CSP/Form Audits    │
│ Module 6: Web3 Threat Intel    │ Tamper-Evident SHA-256 Merkle Ledger  │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 🚀 Key Modules & Capabilities

### 1. Module 1: URL Threat & Typosquatting Engine
- **Levenshtein Distance Analysis:** Real-time distance scoring against Indian banking, government, and recruitment portals (`onlinesbi.sbi`, `irctc.co.in`, etc.).
- **Homoglyph & Punycode Deception:** Detects lookalike Cyrillic/Greek character substitution.
- **Shannon Entropy Scoring:** Detects algorithmically generated domain names (DGA) and risky TLDs (`.xyz`, `.top`, `.online`).

### 2. Module 2: TLS Certificate & CT Log Auditor (The eMudhra Defense)
- **Certificate Transparency (CT) Verification:** Cross-references Google Argon and Cloudflare Nimbus logs to detect unlogged certificates (RFC 6962 compliance).
- **eMudhra Vulnerability Defense:** Specifically identifies certificates linked to compromised or distrusted CAs with weak/duplicate RSA key generation anomalies.
- **Padlock Deception Counter:** Never treats a valid SSL certificate as proof that the website itself is safe.

### 3. Module 3: AI Scam Message & Social Engineering Inspector
- **Multi-Channel Text Ingestion:** Paste suspicious **SMS, WhatsApp messages, emails, or job offer notifications**.
- **Social Engineering Metric (0–100%):** Flags urgency-based manipulation ("Account suspended tonight", "24-hour deadline", "Refundable deposit").
- **Automated Threat Extraction:** Extracts embedded URLs, phone numbers, and UPI drop IDs (`sbiauth@ybl`), with 1-click handoff into the 4-Pillar deep radar scanner.

### 4. Module 4: Intelligent Threat Campaign Correlation Clusters
- **Campaign Graph #IND-402:** Groups isolated reports into coordinated fraud rings.
- Correlates shared hosting infrastructure (Panama VPS, AS49505), common TLS certificate issuers, and reused payment gateways across multiple victims.

### 5. Module 5: Safe Website Security Assessment
- **Non-Intrusive Passive Inspection:** Evaluates HTTP Strict Transport Security (HSTS with preloading), Content Security Policy (CSP frame-ancestors & script-src), and Form Action Hijacking.
- Assigns clear Security Grades (A+ to F) with remediation advice.

### 6. Module 6: Decentralized Web3 Threat Intelligence Ledger
- **Tamper-Evident Provenance:** Records cryptographic commitments (SHA-256 state hashes) anchored to the decentralized ledger (Polygon PoS / Sepolia).
- **Privacy-Preserving Architecture:** As mandated by the brief, raw URLs, PII, and credentials strictly remain **off-chain**; only cryptographic proofs are placed on-chain.
- **Live In-Browser Verification:** Re-verifies report integrity in real time using the W3C WebCrypto API.

---

## 📋 HackMatrix 48-Hour Mandatory MVP Checklist & Evaluation Scorecard

| Category (Weight) | HackMatrix PS Requirement | TrustNetra AI Implementation | Status |
| :--- | :--- | :--- | :---: |
| **Cybersecurity (30%)** | URL Analysis, Phishing Detection, TLS & eMudhra Rogue CA Audit | Levenshtein typosquatting, RFC 6962 CT log proof, BadSSL benchmark suite | **100% Complete** |
| **AI Implementation (20%)** | Scam Detection, NLP Social Engineering, Entity Extraction | AI SMS/message inspector, urgency scoring, auto UPI/phone extraction | **100% Complete** |
| **Web3 Integration (20%)** | On-Chain Threat Registry, Independent Verification, Privacy | Off-chain data storage, SHA-256 cryptographic commitments on Polygon PoS | **100% Complete** |
| **Technical Impl. (20%)** | Working architecture, 3 Benign + 3 Suspicious test benchmarks | 3 Benign (`google.com`, `onlinesbi.sbi`, `github.com`) + 3 Suspicious (`sbi-kyc`, `emudhra`, `internship`) | **100% Complete** |
| **Innovation & UX (10%)** | Browser extension, clean usability, Campaign Correlation | Manifest V3 in-browser shield + Threat Campaign Ring #IND-402 | **100% Complete** |

### 🎯 Standardized Risk Classifications (Section 6)
TrustNetra AI strictly implements the five mandated risk classifications:
- **`Confirmed Malicious`**: Supported by authoritative threat intelligence feeds (PhishTank/URLhaus).
- **`High Risk`**: Substantial security threats (e.g. Rogue CA / weak key generation anomalies matching eMudhra incidents).
- **`Suspicious`**: Indicators requiring caution (e.g. newly registered .xyz domains, deceptive recruitment fees).
- **`Low Risk`**: Legitimate, verified domains passing all TLS, CT log, and identity checks.
- **`Inconclusive`**: Non-resolvable or private intranet environments.

---

## 🛠️ Project Structure

```text
trustnetra-ai/
├── index.html          # Web Intelligence Platform (Single-file, zero setup)
├── README.md           # Documentation & HackMatrix 6-Module Alignment
└── extension/          # Manifest V3 Chrome Extension
    ├── manifest.json   # Name: "TrustNetra AI — Web Threat Shield"
    ├── popup.html      # Cyber Eye HUD popup (Dynamic trust scoring)
    ├── popup.js        # Tab analysis & BadSSL/CT log validation
    └── content.js      # In-page credential harvesting & password shield
```

---

## 🏃 How to Test Locally

### 1. Open the Web Platform:
- Open `trustnetra-ai/index.html` in Chrome or Edge.
- Switch between **Tab 1: Website Scanner** and **Tab 2: SMS/WhatsApp Scanner**.
- Test the 4 pre-loaded SMS scams (SBI KYC SMS, Govt Internship, Power Cut, PhonePe).
- Click **"⛓️ Web3 Immutable Ledger"** to see live SHA-256 cryptographic verification.

### 2. Load the Chrome Extension:
- In Chrome, open `chrome://extensions/`.
- Toggle on **Developer mode**.
- Click **Load unpacked** and select `trustnetra-ai/extension`.
- Test on live mock sites like `https://demo.applitools.com/?portal=onlinesbi-update` to see the real-time credential harvesting shield!
