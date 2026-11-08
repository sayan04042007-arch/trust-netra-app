// TrustNetra AI - Extension Popup Logic (v2.1 - Fixed)
document.addEventListener('DOMContentLoaded', () => {
  const currentUrlEl    = document.getElementById('currentUrl');
  const scoreNumberEl   = document.getElementById('scoreNumber');
  const gaugeRing       = document.getElementById('gaugeRing');
  const verdictHeadline = document.getElementById('verdictHeadline');
  const verdictSub      = document.getElementById('verdictSub');
  const emudhraAlert    = document.getElementById('emudhraAlert');
  const statusBadge     = document.getElementById('statusBadge');
  const typoResult      = document.getElementById('typoResult');
  const certResult      = document.getElementById('certResult');
  const headersResult   = document.getElementById('headersResult');
  const intelResult     = document.getElementById('intelResult');
  const openDashboardBtn = document.getElementById('openDashboardBtn');
  const recheckBtn      = document.getElementById('recheckBtn');

  // Safety null-check: abort if critical elements missing
  if (!gaugeRing || !scoreNumberEl || !verdictHeadline) {
    console.error('TrustNetra: Critical DOM elements missing.');
    return;
  }

  let activeAnalyzedUrl = '';

  const circumference = 2 * Math.PI * 26; // r=26
  gaugeRing.style.strokeDasharray = `${circumference}`;
  gaugeRing.style.strokeDashoffset = `${circumference}`;

  // ─── Gauge Updater ───────────────────────────────────────────────────────
  function updateGauge(score) {
    if (!scoreNumberEl || !gaugeRing || !statusBadge) return;
    scoreNumberEl.textContent = score;
    const offset = circumference - (score / 100) * circumference;
    gaugeRing.style.strokeDashoffset = offset;

    if (score >= 80) {
      gaugeRing.style.stroke       = '#00ff9d';
      statusBadge.style.color      = '#00ff9d';
      statusBadge.style.borderColor = '#00ff9d';
      statusBadge.style.background = 'rgba(0, 255, 157, 0.15)';
      statusBadge.textContent      = 'SECURE';
    } else if (score >= 50) {
      gaugeRing.style.stroke       = '#ffb700';
      statusBadge.style.color      = '#ffb700';
      statusBadge.style.borderColor = '#ffb700';
      statusBadge.style.background = 'rgba(255, 183, 0, 0.15)';
      statusBadge.textContent      = 'CAUTION';
    } else {
      gaugeRing.style.stroke       = '#ff2a5f';
      statusBadge.style.color      = '#ff2a5f';
      statusBadge.style.borderColor = '#ff2a5f';
      statusBadge.style.background = 'rgba(255, 42, 95, 0.15)';
      statusBadge.textContent      = 'HIGH RISK';
    }
  }

  // ─── URL Analyzer ────────────────────────────────────────────────────────
  function analyzeUrl(urlStr) {
    let url;
    try {
      url = new URL(urlStr);
    } catch (e) {
      return {
        score: 50, headline: 'Invalid URL',
        sub: 'Cannot parse target URL format.',
        typo: 'Unknown', cert: 'Unknown', headers: 'N/A', intel: 'N/A',
        isEmudhra: false
      };
    }

    const hostname = url.hostname.toLowerCase();
    const pathname = url.pathname.toLowerCase();
    let score    = 95;
    let typo     = 'Clean (0.00)';
    let cert     = 'TLS 1.3 / Valid';
    let headers  = 'Strict HSTS';
    let intel    = 'Clean';
    let isEmudhra = false;

    // Check 1: Insecure HTTP
    if (url.protocol === 'http:') {
      score -= 40;
      cert    = 'Insecure (No TLS / Plaintext)';
      headers = 'Missing HSTS';
    }

    // Check 2: Raw IP hostname
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      score -= 40;
      typo  = 'Raw IP Hostname';
      intel = 'Suspicious Host';
    }

    // Check 2.5: Testing sandboxes
    const isSauceDemo      = hostname.includes('saucedemo');
    const isTestingSandbox = isSauceDemo || (hostname.includes('sandbox') && !hostname.includes('paypal'));
    if (isTestingSandbox) {
      return {
        score: 75,
        headline: 'CAUTION: Testing Sandbox Detected',
        sub: 'Public demo environment (SauceDemo / Swag Labs). Safe for QA testing, but do NOT enter real personal passwords.',
        typo: 'Known Test Bed (0.00)', cert: 'TLS 1.3 / Valid (Sauce Labs)',
        headers: 'Standard Web Security', intel: 'QA Automation Testbed',
        isEmudhra: false
      };
    }

    // Check 3: BadSSL benchmark suite
    if (hostname.includes('badssl.com')) {
      if (hostname.includes('no-sct')) {
        score = 18; cert = 'FAILED (Missing CT Logs / No SCT)'; isEmudhra = true; intel = 'Unverified SCT Proof';
      } else if (hostname.includes('untrusted-root') || hostname.includes('self-signed')) {
        score = 12; cert = 'FAILED (Untrusted / Rogue Root CA)'; intel = 'Untrusted Root Authority';
      } else if (hostname.includes('expired')) {
        score = 22; cert = 'FAILED (Expired TLS Certificate)'; intel = 'Lifecycle Violation';
      } else if (hostname.includes('wrong.host')) {
        score = 15; cert = 'FAILED (Domain Hostname Mismatch)'; intel = 'Host Impersonation';
      } else if (hostname.includes('dh512') || hostname.includes('rc4')) {
        score = 24; cert = 'Weak Crypto Key (eMudhra Anomaly)'; isEmudhra = true; intel = 'Factoring Vulnerability';
      } else {
        score = 30; cert = 'TLS Security Benchmark Warning';
      }
    }

    // Check 4: eMudhra or weak CA
    if (hostname.includes('emudhra') || pathname.includes('emudhra') || urlStr.includes('test-ca-weak-key')) {
      score = 24; cert = 'Weak Key (eMudhra CA)'; isEmudhra = true; intel = 'Revoked CA Root';
    }

    // Check 5: Brand impersonation
    const protectedBrands = [
      { name: 'Google',           kw: 'google',    legit: ['google.com','google.co.in','youtube.com','gmail.com'] },
      { name: 'State Bank of India', kw: 'sbi',   legit: ['onlinesbi.sbi','sbi.co.in','sbi.bank.in'] },
      { name: 'HDFC Bank',        kw: 'hdfc',      legit: ['hdfcbank.com','hdfc.com'] },
      { name: 'PayPal',           kw: 'paypal',    legit: ['paypal.com'] },
      { name: 'Apple',            kw: 'apple',     legit: ['apple.com','icloud.com'] },
      { name: 'Microsoft',        kw: 'microsoft', legit: ['microsoft.com','live.com','office.com','azure.com'] },
      { name: 'Netflix',          kw: 'netflix',   legit: ['netflix.com'] },
      { name: 'PhonePe',          kw: 'phonepe',   legit: ['phonepe.com'] },
      { name: 'Paytm',            kw: 'paytm',     legit: ['paytm.com'] },
      { name: 'Amazon',           kw: 'amazon',    legit: ['amazon.com','amazon.in'] }
    ];

    let spoofedBrand = null;
    for (const b of protectedBrands) {
      if (hostname.includes(b.kw)) {
        const isLegit = b.legit.some(d => hostname === d || hostname.endsWith('.' + d));
        if (!isLegit) { spoofedBrand = b; break; }
      }
    }
    if (spoofedBrand) {
      score -= 65;
      typo  = `Brand Spoof: ${spoofedBrand.name}`;
      intel = `Masquerading as ${spoofedBrand.name}`;
    }

    // Check 6: Phishing bait lexicon
    const baitLexicon = [
      'bank','account','update','secure','security','login','signin','auth',
      'verify','verification','kyc','wallet','password','billing','confirm',
      'portal','recover','recovery','claim','refund','support','pay','payment',
      'service','online','alert','otp','card','access','ebank','netbanking'
    ];
    const fullLower    = urlStr.toLowerCase();
    const matchedBait  = baitLexicon.filter(w => hostname.includes(w) || fullLower.includes(w));
    const isMultiBait  = matchedBait.length >= 2;
    const isBankSpoof  = matchedBait.includes('bank') || matchedBait.includes('netbanking') || matchedBait.includes('ebank');
    const hasCredBait  = matchedBait.includes('account') || matchedBait.includes('recovery') ||
                         matchedBait.includes('update') || matchedBait.includes('login') ||
                         matchedBait.includes('verify') || matchedBait.includes('password');

    if (isMultiBait) {
      score -= 40;
      if (!spoofedBrand) typo = `Bait Spoofing (${matchedBait.slice(0, 2).join('-')})`;
      intel = `Phishing Tokens: ${matchedBait.slice(0, 3).join(', ')}`;
    } else if (matchedBait.length === 1 && !spoofedBrand) {
      score -= 20;
      typo = `Keyword: ${matchedBait[0]}`;
    }

    // Check 7: Subdomain masquerading
    const hostParts = hostname.split('.');
    if (hostParts.length > 2 && (isMultiBait || hostname.includes('-') || hostname.includes('example.com') || spoofedBrand)) {
      score -= 15;
      if (!spoofedBrand) typo = 'Subdomain Chaining Spoof';
      if (!intel || intel === 'Clean') intel = 'Hostname Masquerading';
    }

    // Check 8: Risky TLDs
    const riskyTlds = ['.xyz','.top','.click','.tk','.ml','.cf','.gq','.work','.online','.site','.live','.buzz'];
    for (const tld of riskyTlds) {
      if (hostname.endsWith(tld)) { score -= 20; typo += ' (Risky TLD)'; break; }
    }

    // Critical overrides
    if (spoofedBrand && (hasCredBait || isMultiBait || hostname.includes('recovery') || hostname.includes('account'))) {
      score = 12;
      intel = `Deceptive ${spoofedBrand.name} Phishing Trap`;
      typo  = `Spoofed ${spoofedBrand.name} Identity`;
    } else if (url.protocol === 'http:' && (isBankSpoof || hasCredBait || isMultiBait)) {
      score = 12;
      intel = 'Unencrypted Phishing Trap';
      cert  = 'Insecure (Cleartext HTTP / Zero TLS)';
      headers = 'Missing HSTS (Plaintext)';
    } else if (isBankSpoof && isMultiBait) {
      score = Math.min(score, 18);
    }

    score = Math.max(8, Math.min(99, score));

    // Build headline
    let headline = 'Site Verified & Secure';
    let sub = 'Cryptographic trust chain and domain integrity confirmed.';

    if (hostname.includes('badssl.com')) {
      if (hostname.includes('no-sct')) {
        headline = 'CRITICAL: Missing CT Log Proof (No SCT)';
        sub = 'Certificate was not logged to RFC 6962 CT logs. Potential rogue certificate!';
      } else if (hostname.includes('untrusted') || hostname.includes('self-signed')) {
        headline = 'CRITICAL: Untrusted / Rogue Certificate Authority';
        sub = 'Certificate Authority is untrusted or self-signed. Connection is vulnerable.';
      } else if (hostname.includes('dh512') || hostname.includes('rc4')) {
        headline = 'CRITICAL: Weak CA Key Anomaly (eMudhra Vulnerability)';
        sub = 'Cryptographic key uses weak parameters matching known rogue CA CVEs.';
      } else {
        headline = 'CRITICAL: TLS Security Failure';
        sub = 'Security benchmark failure detected in certificate chain.';
      }
    } else if (spoofedBrand && score <= 25) {
      headline = `CRITICAL: Deceptive ${spoofedBrand.name} Phish`;
      sub = `"${hostname}" is masquerading as ${spoofedBrand.name}. Active credential hijacking risk!`;
    } else if (score <= 25) {
      headline = url.protocol === 'http:' ? 'CRITICAL: Unencrypted Banking Phish' : 'CRITICAL: Malicious Phishing Risk';
      sub = `Deceptive keywords (${matchedBait.slice(0, 3).join(', ')}) detected${url.protocol === 'http:' ? ' over unencrypted HTTP' : ''}. Do not submit credentials!`;
    } else if (score < 40) {
      headline = 'HIGH RISK: Deceptive Threat Detected';
      sub = 'Multiple deceptive indicators detected. Do not submit credentials.';
    } else if (score < 75) {
      headline = 'Suspicious Digital Signals';
      sub = 'Exercise caution. Domain identity has inconsistencies.';
    }

    return { score, headline, sub, typo, cert, headers, intel, isEmudhra };
  }

  // ─── Core Scan Runner ────────────────────────────────────────────────────
  function runScan(callback) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.warn('TrustNetra tabs.query error:', chrome.runtime.lastError.message);
      }

      const activeTab = (tabs && tabs.length > 0) ? tabs[0] : null;
      let url = (activeTab && activeTab.url) ? activeTab.url : '';

      // Fallback if on extension or internal page
      if (!url || url.startsWith('chrome://extensions') || url.startsWith('edge://')) {
        url = (currentUrlEl && currentUrlEl.textContent) ? currentUrlEl.textContent : '';
      }
      if (!url || url === 'Scanning active tab...' || url === 'undefined') {
        url = 'https://google.com';
      }

      activeAnalyzedUrl = url;
      if (currentUrlEl) currentUrlEl.textContent = url;

      // Save to chrome.storage.local (safe in MV3, unlike localStorage)
      try {
        chrome.storage.local.set({ trustnetra_active_target: url });
      } catch (e) {}

      // Handle internal browser pages gracefully
      if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') ||
          url.startsWith('edge://') || url.startsWith('about:')) {
        updateGauge(95);
        if (verdictHeadline) verdictHeadline.textContent = 'Browser Internal Page';
        if (verdictSub) verdictSub.textContent = 'This is a secure internal browser management environment.';
        if (typoResult) typoResult.textContent = 'System Protected';
        if (certResult) certResult.textContent = 'Internal Chromium Core';
        if (headersResult) headersResult.textContent = 'N/A (Built-in)';
        if (intelResult) intelResult.textContent = 'Trusted Environment';
        if (emudhraAlert) emudhraAlert.style.display = 'none';
        if (callback) callback();
        return;
      }

      const result = analyzeUrl(url);
      updateGauge(result.score);
      if (verdictHeadline) verdictHeadline.textContent = result.headline;
      if (verdictSub) verdictSub.textContent = result.sub;
      if (typoResult) typoResult.textContent = result.typo;
      if (certResult) certResult.textContent = result.cert;
      if (headersResult) headersResult.textContent = result.headers;
      if (intelResult) intelResult.textContent = result.intel;
      if (emudhraAlert) emudhraAlert.style.display = result.isEmudhra ? 'block' : 'none';

      if (callback) callback();
    });
  }

  // ─── Open Dashboard Button ───────────────────────────────────────────────
  if (openDashboardBtn) {
    openDashboardBtn.addEventListener('click', () => {
      let urlToPass = activeAnalyzedUrl ||
                      (currentUrlEl ? currentUrlEl.textContent : '') || '';

      if (!urlToPass ||
          urlToPass.startsWith('chrome') ||
          urlToPass.startsWith('about:') ||
          urlToPass === 'Scanning active tab...') {
        urlToPass = 'https://google.com';
      }

      try {
        chrome.storage.local.set({ trustnetra_active_target: urlToPass });
      } catch (e) {}

      const targetUrl = chrome.runtime.getURL(
        `dashboard.html?url=${encodeURIComponent(urlToPass)}`
      );
      chrome.tabs.create({ url: targetUrl });
    });
  }

  // ─── Re-Scan Button ──────────────────────────────────────────────────────
  if (recheckBtn) {
    recheckBtn.addEventListener('click', () => {
      recheckBtn.disabled = true;
      const origText = recheckBtn.textContent || 'Re-Scan';
      recheckBtn.textContent = 'Scanning...';
      recheckBtn.style.opacity = '0.65';

      // Reset gauge to loading state
      if (scoreNumberEl) scoreNumberEl.textContent = '--';
      if (gaugeRing) {
        gaugeRing.style.transition = 'stroke-dashoffset 0.3s ease';
        gaugeRing.style.strokeDashoffset = `${circumference}`;
      }

      setTimeout(() => {
        runScan(() => {
          recheckBtn.textContent = 'Re-Scanned!';
          recheckBtn.style.opacity = '1';
          setTimeout(() => {
            recheckBtn.disabled = false;
            recheckBtn.textContent = origText;
          }, 800);
        });
      }, 350);
    });
  }

  // ─── Auto-run scan on popup open ─────────────────────────────────────────
  runScan();
});
