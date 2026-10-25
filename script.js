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
  work: ['Workflows, with their context.', 'See how a task relates to the people and information around it.'],
  information: ['Information that belongs somewhere.', 'A decision, a document, a detail: the vision is to keep each one close to the work it informs.'],
  people: ['People behind every handoff.', 'Work crosses responsibilities. A shared foundation should help those relationships stay clear.'],
  operations: ['The everyday, seen together.', 'Requests, responsibilities, and next steps are parts of the same business. Their connections matter.'],
  tools: ['Tools as part of the picture.', 'Our direction is a coherent place for tools and processes. Specific integrations are not being announced here.']
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
    ? ['Same business. Separate pieces.', 'The relationships fade. Select “Connected business” to bring the context back into view.']
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

const storySteps = [
  ['BUSINESS ACTIVITIES', 'It starts with a piece of work.', "A customer asks for an update. It's a small request, but answering it may involve more than one part of the business."],
  ['CONNECTED WORKFLOWS', 'The details give it meaning.', 'A previous decision. A note from the team. The information behind the request helps explain what needs to happen next.'],
  ['A UNIFIED OPERATING LAYER', 'The handoff keeps its context.', 'Someone takes responsibility. The idea is to keep the request, its supporting details, and its next step connected as work changes hands.'],
  ['BETTER OPERATIONAL CLARITY', 'Now the pieces tell a story.', 'A request, its context, and the people involved can be understood together. That is the more coordinated way of working Stromule is building toward.']
];
const tabs = [...document.querySelectorAll('[data-step]')];
let storyStep = 0;
function setStoryStep(index, focus = false) {
  storyStep = index;
  tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
  document.querySelector('#story-panel').setAttribute('aria-labelledby', `tab-${index}`);
  document.querySelector('.story-illustration').dataset.stage = String(index);
  const [label, title, copy] = storySteps[index];
  document.querySelector('#story-label').textContent = label;
  document.querySelector('#story-title').textContent = title;
  document.querySelector('#story-copy').textContent = copy;
  const next = document.querySelector('#next-step');
  next.firstChild.textContent = index === 3 ? 'Back to the beginning ' : 'Follow the thread ';
  if (focus) tabs[index].focus();
}
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

const dialog = document.querySelector('#info-dialog');
const messages = {
  access: ["We're bringing the pieces together.", "Stromule is in development. Early-access registration isn't open yet. This site doesn't collect sign-ups; return to stromule.com for future availability."],
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
