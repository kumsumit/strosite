'use strict';
// Keep actual connection endpoints aligned with the buttons at every viewport size.
const map = document.querySelector('#system-map');
const mapCore = map.querySelector('.map-core');
const nodes = [...map.querySelectorAll('.map-node')];
const pathGroup = map.querySelector('#connection-paths');
const caption = document.querySelector('#map-caption');
let mode = 'connected';
let selectedNode = 'work';
const nodeCopy = {
  work: ['Know what needs doing.', 'A task makes more sense when its details and the person doing it are close by.'],
  information: ['Find the details you need.', 'Which items? What date? Keep the useful information close to the job it belongs to.'],
  people: ['Know who is doing the work.', 'Whether you work alone or with a team, it should be clear who is taking the next step.'],
  operations: ['See what happens next.', 'Preparing, checking, delivering: every job has a next step. The idea is to make it easier to follow.'],
  tools: ['Keep the right documents nearby.', 'A note, an order, or a list is easier to use when you know which job it belongs to.']
};
const paths = nodes.map(node => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.dataset.node = node.dataset.node;
  pathGroup.append(path);
  return path;
});
function drawConnections() {
  const bounds = map.getBoundingClientRect();
  const core = mapCore.getBoundingClientRect();
  const center = { x: core.left + core.width / 2 - bounds.left, y: core.top + core.height / 2 - bounds.top };
  nodes.forEach((node, index) => {
    const box = node.getBoundingClientRect();
    const x = box.left + box.width / 2 - bounds.left;
    const y = box.top + box.height / 2 - bounds.top;
    const midX = (x + center.x) / 2;
    paths[index].setAttribute('d', `M ${center.x} ${center.y} C ${midX} ${center.y}, ${midX} ${y}, ${x} ${y}`);
  });
}
function updateMapCaption() {
  const [title, copy] = mode === 'scattered'
    ? ['The same work, harder to follow.', 'The tasks and details are still there, but their connections are missing. Choose “Brought together” to see the difference.']
    : nodeCopy[selectedNode];
  caption.replaceChildren();
  const strong = document.createElement('strong'); strong.textContent = title;
  caption.append(strong, document.createTextNode(` ${copy}`));
}
function selectNode(node) {
  selectedNode = node.dataset.node;
  nodes.forEach(item => item.setAttribute('aria-pressed', String(item === node)));
  paths.forEach(path => path.classList.toggle('active', path.dataset.node === selectedNode));
  updateMapCaption();
}
nodes.forEach(node => node.addEventListener('click', () => selectNode(node)));
let transitionFrame;
function setMode(nextMode) {
  mode = nextMode;
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  map.classList.toggle('is-scattered', mode === 'scattered');
  updateMapCaption();
  // Recompute curves while nodes move so a line never separates from its endpoint.
  cancelAnimationFrame(transitionFrame);
  const start = performance.now();
  function update(now) { drawConnections(); if (now - start < 750) transitionFrame = requestAnimationFrame(update); }
  transitionFrame = requestAnimationFrame(update);
}
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
new ResizeObserver(drawConnections).observe(map);
if (document.fonts) document.fonts.ready.then(drawConnections);
selectNode(nodes[0]);
drawConnections();

// Scenarios are illustrations of the idea, not live or promised product features.
const scenarios = {
  shop: {
    name: 'a shop order',
    cards: ['A customer order', 'Two items, for collection', 'The order details', 'Items & collection date', 'The person preparing it', 'Knows what to get ready', 'Ready for collection.'],
    steps: [
      ['THE WORK', 'A customer places an order.', 'A customer orders two items for collection. You need to remember what they want and when they will collect it.'],
      ['THE DETAILS', 'Keep the order details with it.', 'The items, quantities, and collection date belong with the order. Finding them together would make the job easier to understand.'],
      ['THE PERSON', 'Make it clear who prepares it.', 'You or a team member gets the order ready. That person needs the same details the customer shared, without having to ask again.'],
      ['THE NEXT STEP', 'Know what to tell the customer.', 'When the order and its progress are kept together, it is easier to know what needs checking before collection. That is the kind of clearer working day we are building toward.']
    ]
  },
  service: {
    name: 'a service booking',
    cards: ['A service booking', 'A customer needs a visit', 'The visit details', 'Time, place & job notes', 'The person visiting', 'Knows what to bring', 'Ready for the visit.'],
    steps: [
      ['THE WORK', 'A customer books a visit.', 'A customer asks you to visit and carry out a service. You need to agree on the job and when it will happen.'],
      ['THE DETAILS', 'Keep the visit details together.', 'The address, agreed time, and notes about the job all matter. The idea is to keep them with the booking rather than spread across messages.'],
      ['THE PERSON', 'Help the right person get ready.', 'The person going to the job needs to know where to go and what to bring. The booking details should be easy for them to find.'],
      ['THE NEXT STEP', 'See what still needs checking.', 'Does the customer need a confirmation? Is everything ready for the visit? Connecting the booking, its details, and the person doing it is the idea behind Stromule.']
    ]
  },
  team: {
    name: 'a team job',
    cards: ['A job for the team', 'A customer needs a quote', 'The job details', 'What is needed & by when', 'The person doing it', 'Has the notes they need', 'Ready for a review.'],
    steps: [
      ['THE WORK', 'A customer asks for a quote.', 'Your team needs to prepare a quote. Before anyone starts, they need to understand what the customer is asking for.'],
      ['THE DETAILS', 'Keep the request and notes together.', 'The customer’s requirements and agreed deadline give the job its meaning. Keeping them together helps the team work from the same information.'],
      ['THE PERSON', 'Give the job a clear person.', 'Someone prepares the quote and someone may check it. A clear responsibility helps each person understand their part.'],
      ['THE NEXT STEP', 'Make the next action easy to see.', 'The quote may need checking before it goes to the customer. The aim is to show the job, its details, and the next action together, so less is left to memory.']
    ]
  }
};
const tabs = [...document.querySelectorAll('[data-step]')];
const scenarioButtons = [...document.querySelectorAll('[data-scenario]')];
let currentScenario = 'shop';
let storyStep = 0;
function setStoryStep(index, focus = false) {
  storyStep = index;
  tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
  document.querySelector('#story-panel').setAttribute('aria-labelledby', `tab-${index}`);
  document.querySelector('.story-illustration').dataset.stage = String(index);
  const [label, title, copy] = scenarios[currentScenario].steps[index];
  document.querySelector('#story-label').textContent = label;
  document.querySelector('#story-title').textContent = title;
  document.querySelector('#story-copy').textContent = copy;
  const next = document.querySelector('#next-step');
  next.firstChild.textContent = ['See the details ', 'See who does it ', 'See the next step ', 'Try it again '][index];
  document.querySelector('#previous-step').disabled = index === 0;
  document.querySelector('#step-count').textContent = `Step ${index + 1} of 4`;
  document.querySelector('#story-progress').value = index + 1;
  document.querySelector('#story-progress').textContent = `${index + 1} of 4`;
  if (focus) tabs[index].focus();
}
function setScenario(key) {
  currentScenario = key;
  scenarioButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === key)));
  const fields = ['example-work', 'example-work-detail', 'example-detail', 'example-detail-note', 'example-person', 'example-person-note', 'example-result'];
  fields.forEach((id, i) => { document.getElementById(id).textContent = scenarios[key].cards[i]; });
  setStoryStep(0);
  document.querySelector('#example-status').textContent = `Showing: ${scenarios[key].name}. Choose a step below.`;
}
scenarioButtons.forEach(button => button.addEventListener('click', () => setScenario(button.dataset.scenario)));
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setStoryStep(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); setStoryStep(next, true); }
  });
});
document.querySelector('#next-step').addEventListener('click', () => setStoryStep((storyStep + 1) % tabs.length));
document.querySelector('#previous-step').addEventListener('click', () => { if (storyStep > 0) setStoryStep(storyStep - 1); });
setScenario(currentScenario);

const dialog = document.querySelector('#info-dialog');
const messages = {
  access: ["We're bringing the pieces together.", "Stromule is in development. Early-access registration isn't open yet. This site doesn't collect sign-ups; Check stromule.com for updates about when you can try it."],
  contact: ['A way to stay in touch.', 'Our official contact channel will be published here when it is available. For now, this website is the place to follow the Stromule vision.'],
};
function showInfo(key) {
  const [title, copy] = messages[key];
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-copy').textContent = copy;
  dialog.showModal();
}
document.querySelector('#access-button').addEventListener('click', () => showInfo('access'));
document.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', () => showInfo(button.dataset.info)));
document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});


// Content is visible by default; reveal effects are only enabled when supported.
if ('IntersectionObserver' in window) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('pending'); reveal.unobserve(entry.target); }
  }), { threshold: 0.08 });
  if (!reduced.matches) document.querySelectorAll('.section-heading, .problem-layout, .vision-statement, .audience-list article').forEach(item => {
    item.classList.add('js-reveal', 'pending'); reveal.observe(item);
  });
  reduced.addEventListener('change', () => { if (reduced.matches) document.querySelectorAll('.pending').forEach(item => item.classList.remove('pending')); });
  const sections = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelector('#navigation').querySelectorAll('a').forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -55% 0px' });
  document.querySelector('#navigation').querySelectorAll('a').forEach(link => { const section = document.querySelector(link.hash); if (section) sections.observe(section); });
}
