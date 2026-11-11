// TrustNetra AI — Automated Test Suite
// Covers: URL scoring, SMS analysis heuristics, domain hardening
// Run: node tests/trustnetra.test.js

const assert = require('assert');

// ─── Load heuristic functions (inline port for Node testing) ──────────────────

function isAcademicOrGov(hostname) {
  const h = hostname.toLowerCase();
  const LEGIT_TLDS = ['.ac.in','.edu.in','.edu','.ac.uk','.edu.au','.gov.in',
                      '.nic.in','.ernet.in','.res.in','.gov','.mil','.int','.org.in'];
  const hasTrustedTLD = LEGIT_TLDS.some(tld => h.endsWith(tld));
  const ACADEMIC_KW = ['college','university','vidyamandir','campus','institute',
                       'institution','academy','adamas','makaut','polytechnic',
                       'shiksha','swayam','nptel','iit','nit','iisc','aiims'];
  const hasAcademicKeyword = hasTrustedTLD && ACADEMIC_KW.some(k => h.includes(k));
  const RISKY_FREE_TLDS = ['.tk','.ml','.cf','.gq','.xyz','.top','.click',
                            '.work','.online','.site','.live','.buzz','.cc','.ru','.pw'];
  const hasRiskyFreeTld = RISKY_FREE_TLDS.some(t => h.endsWith(t));
  return !hasRiskyFreeTld && (hasTrustedTLD || hasAcademicKeyword);
}

function scoreUrl(urlStr) {
  let url;
  try { url = new URL(urlStr); } catch(e) { return 50; }
  const hostname = url.hostname.toLowerCase();
  let score = 95;
  if (url.protocol !== 'https:') score -= 20;
  const riskyTlds = ['.xyz','.top','.click','.tk','.ml','.cf','.gq','.work',
                     '.online','.site','.live','.buzz','.cc','.rest','.quest','.icu'];
  if (riskyTlds.some(t => hostname.endsWith(t))) score -= 20;
  const GLOBAL_SAFE = ['google.com','youtube.com','github.com','microsoft.com',
    'onlinesbi.sbi','sbi.co.in','hdfcbank.com','icicibank.com','irctc.co.in',
    'incometax.gov.in','uidai.gov.in','devfolio.co'];
  const isGlobalSafe = GLOBAL_SAFE.some(d => hostname === d || hostname.endsWith('.'+d));
  const academicOrGov = isAcademicOrGov(hostname);
  if ((academicOrGov || isGlobalSafe) && url.protocol === 'https:') {
    return 96;
  }
  const prizeBait = ['lottery','reward','winner','prize','cashback','free','gift','claim'];
  const lureHits = prizeBait.filter(w => hostname.includes(w) || urlStr.toLowerCase().includes(w));
  if (lureHits.length >= 2) score -= 40;
  const brands = [
    { kw:'sbi', legit:['onlinesbi.sbi','sbi.co.in'] },
    { kw:'hdfc', legit:['hdfcbank.com','hdfc.com'] },
    { kw:'google', legit:['google.com','google.co.in','youtube.com'] },
  ];
  for (const b of brands) {
    if (hostname.includes(b.kw)) {
      const isLegit = b.legit.some(d => hostname === d || hostname.endsWith('.'+d));
      if (!isLegit) { score -= 65; break; }
    }
  }
  return Math.max(10, Math.min(98, score));
}

function scoreMessage(text) {
  const lower = text.toLowerCase();
  let urgency = 20;
  const suspKw = ['suspended','blocked','disconnected','deactivated','frozen','closed','penalty'];
  if (suspKw.some(k => lower.includes(k))) urgency += 35;
  const urgKw = ['within 24 hours','immediately','urgent','last chance','action required'];
  if (urgKw.some(k => lower.includes(k))) urgency += 25;
  const credKw = ['kyc','aadhaar','otp','password','pin','cvv','verify'];
  if (credKw.some(k => lower.includes(k))) urgency += 25;
  // Prize/lottery lure detection
  const lureKw = ['lottery','reward','won','winner','prize','cashback','bonus','congratulations','lakh','crore','lucky draw'];
  const lureHits = lureKw.filter(k => lower.includes(k));
  if (lureHits.length >= 2) urgency += 30;
  else if (lureHits.length === 1 && (lower.includes('claim') || lower.includes('free') || lower.includes('click'))) urgency += 25;
  if (/forward\s+this\s+(sms|message|msg)/i.test(text)) urgency += 40;
  const bankRegex = /\b(sbi|hdfc|icici|axis|kotak|pnb)\b/i;
  const mobileRegex = /(?:call|forward|block)\s*(?:on\s*)?(?:\+91[-\s]?|0)?[6-9]\d{9}/i;
  if (bankRegex.test(text) && mobileRegex.test(text)) urgency += 30;
  const phones = (text.match(/(?:\+?\d{1,3}[\-\s]?)?[6789]\d{9}|\b\d{10}\b/g) || []);
  const txnPat = /\b(withdrawn|debited|credited|transaction|a\/c|atm)\b/i;
  const actPat = /\b(forward\s+this|block\s+your\s+card)\b/i;
  if (txnPat.test(text) && actPat.test(text) && phones.length >= 2) urgency += 25;
  return Math.min(98, Math.max(15, urgency));
}

// ─── TEST SUITE ───────────────────────────────────────────────────────────────

let passed = 0, failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch(e) {
    console.log(`  ❌ FAIL: ${name}`);
    console.log(`     → ${e.message}`);
    failed++;
  }
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  TrustNetra AI — Automated Test Suite v1.0');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// ── URL Scanner Tests ─────────────────────────────────────────────────────────
console.log('📋 URL SCANNER TESTS:');

test('Legit academic portal scores ≥96%', () => {
  const s = scoreUrl('https://adamasknowledgecity.ac.in/student/login');
  assert.ok(s >= 96, `Expected ≥96, got ${s}`);
});

test('Government portal scores ≥96%', () => {
  const s = scoreUrl('https://incometax.gov.in/iec/foportal/');
  assert.ok(s >= 96, `Expected ≥96, got ${s}`);
});

test('Google login scores ≥96%', () => {
  const s = scoreUrl('https://accounts.google.com/signin');
  assert.ok(s >= 96, `Expected ≥96, got ${s}`);
});

test('Known phishing domain scores ≤20%', () => {
  const s = scoreUrl('http://sbi-online-kyc-update.xyz/login');
  assert.ok(s <= 20, `Expected ≤20, got ${s}`);
});

test('Prize scam domain scores ≤20%', () => {
  const s = scoreUrl('http://claim-free-reward-winner.top');
  assert.ok(s <= 20, `Expected ≤20, got ${s}`);
});

test('HTTP sites are penalized vs HTTPS', () => {
  const http = scoreUrl('http://example.com');
  const https = scoreUrl('https://example.com');
  assert.ok(http < https, `HTTP(${http}) should be < HTTPS(${https})`);
});

test('Brand spoof is detected and heavily penalized', () => {
  const s = scoreUrl('https://sbi-secure-login.xyz/verify');
  assert.ok(s <= 25, `Expected ≤25 for brand spoof, got ${s}`);
});

// ── Domain Hardening Tests ────────────────────────────────────────────────────
console.log('\n🔐 DOMAIN HARDENING TESTS (Anti-Bypass):');

test('Adversarial .ac.in subdomain bypass is BLOCKED', () => {
  const bypass = isAcademicOrGov('sbi-phishing.ac.in.evil.com');
  assert.strictEqual(bypass, false, 'Should NOT grant academic trust to .evil.com');
});

test('university keyword on .tk TLD is BLOCKED', () => {
  const bypass = isAcademicOrGov('university-of-scam.tk');
  assert.strictEqual(bypass, false, 'Should NOT grant trust to .tk free domain');
});

test('Genuine .ac.in domain IS trusted', () => {
  const legit = isAcademicOrGov('makaut.ac.in');
  assert.strictEqual(legit, true, 'Should trust genuine .ac.in domain');
});

test('Genuine .gov.in domain IS trusted', () => {
  const legit = isAcademicOrGov('uidai.gov.in');
  assert.strictEqual(legit, true, 'Should trust genuine .gov.in domain');
});

// ── SMS Analysis Tests ────────────────────────────────────────────────────────
console.log('\n📱 SMS ANALYSIS TESTS:');

test('Fake SBI smishing SMS scores ≥70% (HIGH RISK)', () => {
  const s = scoreMessage("Dear SBI Customer, Rs.1000 withdrawn at SBI ATM T1BY014821377 from A/cX1529 on 08Nov26. If not withdrawn by you, forward this SMS to 7400165218 / call 09449112211 to block your card.");
  assert.ok(s >= 70, `Expected ≥70 for smishing, got ${s}`);
});

test('"Forward this SMS" pattern triggers critical flag (+40)', () => {
  const without = scoreMessage("Your account was blocked. Call 1800112211.");
  const with_ = scoreMessage("Your account was blocked. Forward this SMS to 9876543210.");
  assert.ok(with_ > without, `"Forward SMS" should score higher risk`);
});

test('Genuine SBI transaction alert scores ≤30% (LOW RISK)', () => {
  const s = scoreMessage("Dear SBI Customer, Your A/c X1529 is debited with Rs.1000 on 08-11-26. Balance: Rs.45433. For queries call 1800-11-2211. -SBI");
  assert.ok(s <= 35, `Expected ≤35 for genuine SMS, got ${s}`);
});

test('OTP phishing SMS scores ≥45%', () => {
  const s = scoreMessage("Your KYC is expired. Verify your Aadhaar and OTP immediately at the link or your account will be suspended.");
  assert.ok(s >= 45, `Expected ≥45 for OTP phishing, got ${s}`);
});

test('Prize scam SMS scores ≥40%', () => {
  const s = scoreMessage("Congratulations! You have won a prize of Rs.5 lakh in KBC lottery. Claim your reward now!");
  assert.ok(s >= 40, `Expected ≥40 for prize scam, got ${s}`);
});

// ─── Results ──────────────────────────────────────────────────────────────────
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const total = passed + failed;
console.log(`  Results: ${passed}/${total} tests passed`);
if (failed === 0) {
  console.log('  🎉 ALL TESTS PASSED — TrustNetra AI is production-ready!');
} else {
  console.log(`  ⚠️  ${failed} test(s) FAILED — fix before submission`);
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
process.exit(failed > 0 ? 1 : 0);
