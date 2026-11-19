'use strict';
// Stromule — all page behaviour. Content is fully readable without this script.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = matchMedia('(min-width: 981px)');
const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN');

document.body.classList.remove('no-js');
document.documentElement.classList.add('js');
$$('#year').forEach(y => { y.textContent = new Date().getFullYear(); });

/* ---------- header, progress, mobile menu ---------- */
const header = $('.header');
const bar = $('.progress i');
let ticking = false;
function onScroll() {
  ticking = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  header?.classList.toggle('scrolled', scrollY > 16);
  updateStory();
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

const toggle = $('.menu-toggle'), nav = $('#navigation');
if (toggle && nav) {
  const close = (focus = false) => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); if (focus) toggle.focus(); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => close()));
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) close(true); });
  document.addEventListener('click', e => { if (!e.target.closest('.nav')) close(); });
  desktop.addEventListener('change', e => e.matches && close());
}

/* ---------- reveal on scroll, split headings ---------- */
$$('.words').forEach(el => {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute('aria-label', el.textContent.trim());
  el.innerHTML = words.map((w, i) => `<span aria-hidden="true" style="--i:${i}">${w}</span>`).join(' ');
});
const seen = new IntersectionObserver((entries, o) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); o.unobserve(e.target);
  if (e.target.matches('.tile strong, [data-count]')) countUp(e.target);
}), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
$$('.reveal, .words, .eyebrow, .chat').forEach(el => seen.observe(el));

/* ---------- number tween ---------- */
function tween(el, to, format, ms = 900) {
  const from = parseFloat(el.dataset.cur ?? to);
  el.dataset.cur = to;
  if (reduced || from === to) { el.textContent = format(to); return; }
  const t0 = performance.now();
  cancelAnimationFrame(el._raf);
  const step = now => {
    const p = Math.min((now - t0) / ms, 1), eased = 1 - Math.pow(1 - p, 4);
    el.textContent = format(from + (to - from) * eased);
    if (p < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}
function countUp(el) {
  if (!el.dataset.count || reduced) return;
  const { prefix = '', suffix = '' } = el.dataset, to = +el.dataset.count;
  el.dataset.cur = 0; el.textContent = prefix + '0' + suffix;
  tween(el, to, v => prefix + Math.round(v).toLocaleString('en-IN') + suffix, 1600);
}
$$('[data-count]').forEach(el => { el.dataset.cur = el.dataset.count; });
// Hero counters run once on load.
setTimeout(() => $$('.hero [data-count]').forEach(countUp), 700);

/* ---------- hero: tilt that follows the pointer ---------- */
const device = $('.device');
if (device && !reduced && matchMedia('(hover: hover)').matches) {
  const hero = $('.hero');
  let hp = null, hraf = 0;
  hero.addEventListener('pointermove', e => { hp = e; hraf ||= requestAnimationFrame(() => { hraf = 0; tilt(hp); }); }, { passive: true });
  const tilt = e => {
    const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
    device.style.transform = `perspective(1400px) rotateY(${-7 + x * 8}deg) rotateX(${3 - y * 8}deg)`;
    $$('.hero .blob').forEach((b, i) => { b.style.translate = `${x * (i ? -40 : 50)}px ${y * (i ? -30 : 40)}px`; });
  };
  hero.addEventListener('pointerleave', () => { device.style.transform = ''; });
}

/* ---------- cards: pointer spotlight ---------- */
$$('.card').forEach(c => {
  let ev = null, raf = 0;
  c.addEventListener('pointermove', e => {
    ev = e; raf ||= requestAnimationFrame(() => {
      raf = 0; const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${ev.clientX - r.left}px`); c.style.setProperty('--my', `${ev.clientY - r.top}px`);
    });
  }, { passive: true });
});

/* ---------- the sale story ---------- */
const story = $('#story');
const sSteps = $$('.steps li', story || document);
const nodes = { bill: $('.n-bill'), stock: $('.n-stock'), acct: $('.n-acct'), rep: $('.n-rep') };
const wires = Object.fromEntries($$('.wire').map(w => [w.dataset.w, w]));
const val = k => $(`[data-v="${k}"]`);
// Which node is highlighted, which wires are live, and the numbers shown at each step.
const states = [
  { hot: 'bill', wires: [], stock: 42, acct: 14200, rep: 24850 },
  { hot: 'bill', wires: ['stock', 'acct'], stock: 42, acct: 14200, rep: 24850 },
  { hot: 'stock', wires: ['stock', 'rep'], stock: 40, acct: 14200, rep: 24850 },
  { hot: 'acct', wires: ['acct', 'rep2'], stock: 40, acct: 15380, rep: 24850 },
  { hot: 'rep', wires: ['rep', 'rep2'], stock: 40, acct: 15380, rep: 26030 },
];
let cur = -1;
function setStep(i) {
  if (i === cur || !story) return;
  cur = i;
  const s = states[i];
  sSteps.forEach((li, n) => { li.classList.toggle('on', n === i); li.classList.toggle('done', n < i); });
  Object.entries(nodes).forEach(([k, n]) => n.classList.toggle('hot', k === s.hot));
  Object.entries(wires).forEach(([k, w]) => w.classList.toggle('live', s.wires.includes(k)));
  tween(val('stock'), s.stock, v => Math.round(v), 700);
  tween(val('acct'), s.acct, fmt);
  tween(val('rep'), s.rep, fmt);
  val('bar').style.setProperty('--w', (s.stock / 50 * 100) + '%');
}
['stock', 'acct', 'rep'].forEach(k => { const e = val(k); if (e) e.dataset.cur = states[0][k]; });
let auto = null;
function updateStory() {
  if (!story || !desktop.matches || reduced) return;
  const r = story.getBoundingClientRect();
  const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), .999);
  setStep(Math.floor(p * states.length));
}
if (story) {
  // When the scene isn't pinned (phones, reduced motion) play it as a looping sequence while visible.
  new IntersectionObserver(([e]) => {
    clearInterval(auto);
    if (e.isIntersecting && (!desktop.matches || reduced)) {
      let i = 0; setStep(0);
      auto = setInterval(() => { i = (i + 1) % states.length; setStep(i); }, reduced ? 3500 : 2400);
    }
  }, { threshold: .35 }).observe(story);
  setStep(0); updateStory();
}

/* ---------- copilot conversation ---------- */
const chat = $('#chat');
if (chat) {
  const typing = $('.typing-row', chat);
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    if (reduced) { chat.classList.add('in', 'show', 'done'); return; }
    setTimeout(() => { chat.classList.add('typing-on'); typing.style.display = ''; }, 900);
    setTimeout(() => { typing.style.display = 'none'; chat.classList.add('show'); requestAnimationFrame(() => requestAnimationFrame(() => chat.classList.add('done'))); }, 2400);
  }, { threshold: .5 }).observe(chat);
}

/* ---------- offline switch ---------- */
const sw = $('.switch');
if (sw) {
  const panel = sw.closest('.panel'), line = $('.status-line', panel);
  sw.addEventListener('click', () => {
    const on = sw.getAttribute('aria-pressed') !== 'true';
    sw.setAttribute('aria-pressed', String(on));
    sw.lastElementChild.textContent = on ? 'Connected' : 'Offline';
    panel.dataset.state = on ? 'online' : 'offline';
    line.innerHTML = on
      ? '<b>Connection available</b><span>Local work and synchronization can stay connected.</span>'
      : '<b>No connection</b><span>Essential work continues on the device; activity waits to synchronize when the connection returns.</span>';
  });
}

/* ---------- sector tabs ---------- */
const tabs = $$('[role=tab]');
function selectTab(t) {
  tabs.forEach(b => {
    const on = b === t;
    b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
    const p = document.getElementById(b.getAttribute('aria-controls'));
    p.hidden = !on;
    p.classList.remove('enter');
    if (on && !reduced) { void p.offsetWidth; p.classList.add('enter'); }
  });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return;
    const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); selectTab(n); e.preventDefault();
  });
});

/* ---------- active nav link ---------- */
if (nav && $('#story')) {
  const links = $$('a', nav);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => l.hash === `#${e.target.id}` ? l.setAttribute('aria-current', 'location') : l.removeAttribute('aria-current'));
  }), { rootMargin: '-30% 0px -60% 0px' });
  links.forEach(l => { const s = l.hash && document.getElementById(l.hash.slice(1)); if (s) io.observe(s); });
}

/* ---------- legal pages: highlight current section in the table of contents ---------- */
const toc = $$('.legal-toc a');
if (toc.length) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) toc.forEach(a => a.classList.toggle('on', a.hash === `#${e.target.id}`));
  }), { rootMargin: '-20% 0px -70% 0px' });
  toc.forEach(a => { const s = document.getElementById(a.hash.slice(1)); if (s) io.observe(s); });
}

/* ---------- dialogs ---------- */
const info = $('#info-dialog');
const notices = { access: ['An operating foundation taking shape.', 'Stromule is in development. Registration is not open. Stromule launches on 14 December 2026. Pricing, supported countries and languages have not been announced. This site does not collect sign-ups or payments. Check stromule.com for future availability updates.'] };
const backdropClose = d => d.addEventListener('click', e => {
  if (e.target !== d) return;
  const b = d.getBoundingClientRect();
  if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) d.close();
});
$$('dialog').forEach(d => { backdropClose(d); $$('.dialog-close,.dialog-done', d).forEach(b => b.addEventListener('click', () => d.close())); });
$$('[data-info]').forEach(b => b.addEventListener('click', () => {
  const [h, c] = notices[b.dataset.info];
  $('#dialog-title').textContent = h; $('#dialog-copy').textContent = c; info.showModal();
}));

/* ---------- Contact Us form (Forminit) ---------- */
const FORM_ID = 'yadflvn617u';
const contactDialog = $('#contact-dialog'), contactForm = $('#contact-form'), contactStatus = $('#contact-status');
// Third-party form SDK loads only when needed, keeping it off the main thread at page load (INP).
let sdk;
const loadSdk = () => sdk ||= new Promise((res, rej) => {
  if (window.Forminit) return res();
  const s = document.createElement('script'); s.src = 'https://forminit.com/sdk/v1/forminit.js';
  s.onload = res; s.onerror = rej; document.head.append(s);
});
$$('[data-contact]').forEach(b => b.addEventListener('click', () => { loadSdk().catch(() => { sdk = null; }); contactDialog?.showModal(); }));
let sending = false;
contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  const form = event.currentTarget;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const fd = new FormData(form);
  if (!String(fd.get('fi-sender-phone') || '').trim()) fd.delete('fi-sender-phone');
  fd.set('fi-sender-fullName', String(fd.get('fi-sender-fullName') || '').replace(/[‘’]/g, "'").trim());
  const submit = $('[type=submit]', form);
  sending = true; submit.disabled = true; contactStatus.textContent = 'Sending…';
  try {
    await loadSdk();
    const { data, error } = await new Forminit().submit(FORM_ID, fd);
    if (!error && typeof data?.hashId === 'string') { form.reset(); contactStatus.textContent = 'Thank you! Your message has been sent.'; }
    else { console.error(error); contactStatus.textContent = 'Sorry, something went wrong. Please check your details and try again.'; }
  } catch (err) { sdk = null; console.error(err); contactStatus.textContent = 'Network error. Please try again.'; }
  finally { sending = false; submit.disabled = false; }
});

onScroll();
