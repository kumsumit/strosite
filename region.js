'use strict';
// Regional terminology. The HTML ships the Indian default (what search engines index);
// visitors elsewhere see their own everyday terms. Region comes from the browser's own
// time zone and language: no network request, nothing stored.
(() => {
  const TERMS = {
    IN: { shops: 'kirana stores', khata: ' (khata)', acct: 'Tally', tax: 'GST' },
    GB: { shops: 'corner shops', khata: '', acct: 'Sage', tax: 'VAT' },
    US: { shops: 'convenience stores', khata: '', acct: 'QuickBooks', tax: 'sales tax' },
    CA: { shops: 'convenience stores', khata: '', acct: 'QuickBooks', tax: 'GST/HST' },
    AU: { shops: 'corner stores', khata: '', acct: 'Xero', tax: 'GST' },
    AE: { shops: 'grocery stores', khata: '', acct: 'Zoho Books', tax: 'VAT' },
    SG: { shops: 'provision shops', khata: '', acct: 'Xero', tax: 'GST' },
    GLOBAL: { shops: 'local shops', khata: '', acct: 'QuickBooks or Xero', tax: 'sales tax or VAT' },
  };
  const ZONES = {
    'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Europe/London': 'GB', 'Europe/Belfast': 'GB',
    'Asia/Dubai': 'AE', 'Asia/Singapore': 'SG',
  };
  const NAMES = { IN: 'India', GB: 'the United Kingdom', US: 'the United States', CA: 'Canada', AU: 'Australia', AE: 'the UAE', SG: 'Singapore' };

  // Crawlers keep the default copy so one consistent version is indexed.
  if (/bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent)) return;

  function detect() {
    let zone = '';
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { /* very old browsers */ }
    if (ZONES[zone]) return ZONES[zone];
    if (zone.startsWith('Australia/')) return 'AU';
    if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Montreal)/.test(zone)) return 'CA';
    if (/^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Indiana)|Pacific\/Honolulu)/.test(zone)) return 'US';
    const lang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    const country = (lang.split('-')[1] || '').toUpperCase();
    if (TERMS[country]) return country;
    return 'GLOBAL';
  }

  const region = detect();
  document.documentElement.dataset.region = region;
  if (region !== 'IN') { // The HTML already carries the Indian terms.
    const terms = TERMS[region];
    document.querySelectorAll('[data-term]').forEach(element => {
      const value = terms[element.dataset.term];
      if (typeof value === 'string') element.textContent = value;
    });
  }

  // Blog lists: posts written for the visitor's country (and general posts) come first.
  document.querySelectorAll('[data-region-list]').forEach(list => {
    const items = [...list.children];
    const rank = item => {
      const target = item.dataset.region || 'global';
      return target === region ? 0 : target === 'global' ? 1 : 2;
    };
    items.map((item, index) => ({ item, index, rank: rank(item) }))
      .sort((a, b) => a.rank - b.rank || a.index - b.index)
      .forEach(({ item }) => list.append(item));
  });
  document.querySelectorAll('[data-region-note]').forEach(note => {
    if (NAMES[region]) { note.textContent = `Showing guides for ${NAMES[region]} first.`; note.hidden = false; }
  });
})();
