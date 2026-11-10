// TrustNetra AI - Real-time In-Page Shield Banner (v2.1 Fixed)
(() => {
  const currentUrl = window.location.href.toLowerCase();
  const hostname   = window.location.hostname.toLowerCase();

  const dangerousKeywords = [
    'sbi-kyc', 'onlinesbi-update', 'paypa1', 'goog1e', 'apple-verify',
    'netflix-billing', 'free-internship', 'crypto-airdrop', 'bank-login',
    'emudhra-test', 'duplicate-key-ca', 'badssl', 'no-sct', 'untrusted-root',
    'self-signed', 'wrong.host', 'expired.badssl', 'secure-bank', 'bank-account',
    'account-update', 'bank', 'google-account', 'recovery'
  ];

  const hasPasswordField = !!document.querySelector('input[type="password"]');
  const isSauceDemo      = hostname.includes('saucedemo') || currentUrl.includes('saucedemo');
  const isDemoOrSandbox  = isSauceDemo || (hasPasswordField && (hostname.includes('sandbox') || hostname.includes('testlab')));

  const isAcademicOrGov = 
    hostname.endsWith('.ac.in') || 
    hostname.endsWith('.edu.in') || 
    hostname.endsWith('.edu') || 
    hostname.endsWith('.gov.in') || 
    hostname.endsWith('.nic.in') || 
    hostname.endsWith('.ernet.in') || 
    hostname.endsWith('.res.in') || 
    hostname.includes('college') || 
    hostname.includes('university') || 
    hostname.includes('institute') || 
    hostname.includes('campus') || 
    hostname.includes('adamas');

  const GLOBAL_SAFE = [
    'google.com', 'google.co.in', 'youtube.com', 'github.com', 'microsoft.com',
    'apple.com', 'amazon.com', 'amazon.in', 'linkedin.com', 'twitter.com', 'x.com',
    'facebook.com', 'instagram.com', 'wikipedia.org', 'reddit.com', 'netflix.com',
    'irctc.co.in', 'incometax.gov.in', 'uidai.gov.in', 'onlinesbi.sbi', 'sbi.co.in'
  ];
  const isGlobalSafe = GLOBAL_SAFE.some(d => hostname === d || hostname.endsWith('.' + d));

  // If verified institutional academic or global safe domain, do NOT pop false warning banners!
  if ((isAcademicOrGov || isGlobalSafe) && window.location.protocol === 'https:') {
    return;
  }

  const matchesKeyword   = dangerousKeywords.some(kw => currentUrl.includes(kw));
  const isSuspiciousLogin = hasPasswordField && (
    matchesKeyword ||
    (currentUrl.includes('test') && !isSauceDemo) ||
    currentUrl.includes('verify') ||
    (currentUrl.includes('demo') && !isSauceDemo) ||
    currentUrl.includes('herokuapp')
  );

  const isInsecure = (window.location.protocol === 'http:' &&
                      !hostname.includes('localhost') &&
                      !hostname.includes('127.0.0.1'));

  if (matchesKeyword || isSuspiciousLogin || isInsecure || isDemoOrSandbox) {
    // Avoid duplicate banners
    if (document.getElementById('trustnetra-floating-shield')) return;

    const banner = document.createElement('div');
    banner.id = 'trustnetra-floating-shield';

    const isSandboxWarning = isDemoOrSandbox && !matchesKeyword && !isInsecure;

    const borderColor = isSandboxWarning ? '#ffb700' : '#ff2a5f';
    const glowColor   = isSandboxWarning ? 'rgba(255, 183, 0, 0.45)' : 'rgba(255, 42, 95, 0.45)';
    const iconBg      = isSandboxWarning ? 'rgba(255, 183, 0, 0.2)' : 'rgba(255, 42, 95, 0.2)';
    const iconSymbol  = isSandboxWarning ? '\u26A0\uFE0F' : '\uD83D\uDC41\uFE0F';

    banner.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 99999999;
      background: rgba(10, 16, 32, 0.96);
      color: #ffffff;
      border: 1px solid ${borderColor};
      box-shadow: 0 8px 32px ${glowColor};
      border-radius: 12px;
      padding: 14px 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 14px;
      backdrop-filter: blur(12px);
      animation: tnSlideIn 0.4s ease;
      max-width: 440px;
    `;

    let alertHeadline = '\uD83D\uDC41\uFE0F TrustNetra AI Threat Intercept';
    let alertDetail   = 'Potential Phishing / Rogue TLS Certificate signature detected!';

    if (isSandboxWarning) {
      alertHeadline = '\u26A0\uFE0F TEST SANDBOX LOGIN DETECTED';
      alertDetail   = 'Public testing sandbox (SauceDemo / Swag Labs). Safe for QA testing, but do NOT enter real personal passwords!';
    } else if (hasPasswordField) {
      alertHeadline = '\uD83D\uDD12 CREDENTIAL HARVESTING WARNING';
      alertDetail   = 'Password field detected on an unverified domain! Do not submit credentials.';
    }

    banner.innerHTML = `
      <style>
        @keyframes tnSlideIn {
          from { transform: translateX(120px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      </style>
      <div style="width: 36px; height: 36px; background: ${iconBg}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
        ${iconSymbol}
      </div>
      <div style="flex: 1;">
        <div style="font-weight: 800; color: ${borderColor}; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">
          ${alertHeadline}
        </div>
        <div style="font-weight: 600; color: #fff; font-size: 12.5px; line-height: 1.4; margin-top: 2px;">
          ${alertDetail}
        </div>
      </div>
      <button id="tn-close-btn" style="background: transparent; border: none; color: #8b9bb4; font-size: 20px; cursor: pointer; padding: 0 4px; line-height: 1;">&times;</button>
    `;

    document.body.appendChild(banner);
    document.getElementById('tn-close-btn').addEventListener('click', () => {
      banner.remove();
    });
  }
})();
