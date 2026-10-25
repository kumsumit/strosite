'use strict';
const recordDescriptions = {
  products: ['Product details, easier to find.', 'A name, a category, and a note give the next conversation a clearer starting point.'],
  orders: ['Keep the details with the order.', 'A useful record helps you see what was requested and what still needs following up.'],
  stock: ['A record is a starting point, not a guess.', 'Someone still needs to check and maintain stock information. A clear place to keep it can help.'],
  requests: ['Give the question a next step.', 'Keeping a request and its notes together helps the right person understand what needs attention.']
};
const workspace = document.querySelector('#workspace');
const viewButtons = [...document.querySelectorAll('[data-view]')];
const recordButtons = [...document.querySelectorAll('[data-record]')];
let workspaceView = 'organised';
let selectedRecord = 'products';
function renderWorkspaceCaption() {
  const [heading, detail] = workspaceView === 'scattered'
    ? ['The same information, harder to follow.', 'Separate records can still be useful. Bringing related details together is the idea behind Stromule. This is not an automatic import demonstration.']
    : recordDescriptions[selectedRecord];
  const caption = document.querySelector('#workspace-caption');
  const strong = document.createElement('strong');
  strong.textContent = heading;
  caption.replaceChildren(strong, document.createTextNode(` ${detail}`));
}
viewButtons.forEach(button => button.addEventListener('click', () => {
  workspaceView = button.dataset.view;
  workspace.classList.toggle('is-scattered', workspaceView === 'scattered');
  viewButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderWorkspaceCaption();
}));
recordButtons.forEach(button => button.addEventListener('click', () => {
  selectedRecord = button.dataset.record;
  recordButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderWorkspaceCaption();
}));

const merchantButtons = [...document.querySelectorAll('[data-merchant]')];
const journeyTabs = [...document.querySelectorAll('[data-step]')];
let selectedMerchant = 'retail';
let selectedStep = 0;
function setJourneyStep(index, focus = false) {
  selectedStep = index;
  const journey = merchantJourneys[selectedMerchant];
  journeyTabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  document.querySelector('#journey-panel').setAttribute('aria-labelledby', `journey-tab-${index}`);
  document.querySelector('#journey-record').textContent = journey.records[index];
  document.querySelector('#journey-description').textContent = journey.descriptions[index];
  document.querySelector('#journey-count').textContent = `Step ${index + 1} of 3`;
  document.querySelector('#journey-next').firstChild.textContent = index === 2 ? 'Start again ' : 'Next step ';
  if (focus) journeyTabs[index].focus();
}
function selectMerchant(key, moveToExample = false) {
  selectedMerchant = key;
  const journey = merchantJourneys[key];
  merchantButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.merchant === key)));
  document.querySelector('#journey-heading').textContent = journey.title;
  document.querySelector('#journey-benefit').textContent = journey.benefit;
  journeyTabs.forEach((tab, index) => { tab.querySelector('span').textContent = journey.steps[index]; });
  setJourneyStep(0);
  document.querySelector('#journey-selection').textContent = `Exploring: ${journey.name}`;
  if (moveToExample) {
    // Focus also brings the example into view, including with reduced motion.
    document.querySelector('#journey-panel').focus({ preventScroll: true });
    document.querySelector('#merchant-journey').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }
}
merchantButtons.forEach(button => button.addEventListener('click', () => selectMerchant(button.dataset.merchant, true)));
journeyTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setJourneyStep(index));
  tab.addEventListener('keydown', event => {
    const keys = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 };
    if (Object.hasOwn(keys, event.key)) { event.preventDefault(); setJourneyStep(keys[event.key], true); }
  });
});
document.querySelector('#journey-next').addEventListener('click', () => setJourneyStep((selectedStep + 1) % 3));
selectMerchant('retail');

const dialog = document.querySelector('#info-dialog');
const notices = {
  access: ['A more organised way to work is taking shape.', 'Stromule is in development. Registration, pricing, and launch timing have not been announced. This page does not collect sign-ups. Check stromule.com for updates about how to try the product.'],
  contact: ['Contact information', 'Stromule is a product of Kumpali Private Limited. A verified public contact channel has not yet been supplied for this website. Contact details will be added here when available.']
};
document.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', () => {
  const [heading, copy] = notices[button.dataset.info];
  document.querySelector('#dialog-title').textContent = heading;
  document.querySelector('#dialog-copy').textContent = copy;
  dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});

if ('IntersectionObserver' in window) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('pending');
    entry.target.classList.add('is-visible');
    reveal.unobserve(entry.target);
  }), { threshold: 0.08 });
  document.querySelectorAll('.section-heading,.challenges article,.merchant-card,.day-timeline,.ecosystem,.closing,.lifecycle-flow li').forEach(item => {
    // Only small blocks use movement; long sections always remain readable.
    if (!reduced.matches && item.matches('.section-heading,.challenges article,.merchant-card,.lifecycle-flow li')) item.classList.add('js-reveal', 'pending');
    reveal.observe(item);
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) document.querySelectorAll('.pending').forEach(item => item.classList.remove('pending'));
  });
  const navigationObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('#navigation a').forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('#navigation a').forEach(link => { const section = document.querySelector(link.hash); if (section) navigationObserver.observe(section); });
}
