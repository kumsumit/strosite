'use strict';
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = false;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const machine = document.querySelector('.business-machine');
  if (!machine) return;

  // Real controls first; no registration or transactions are performed by these illustrations.
  const descriptions = [
    'A customer arrives for two bags of rice. Follow the people, items and records behind one sale.',
    'The shopkeeper brings the basket to the counter. Two bags of rice become a bill for ₹1,180.',
    'The bill connects to the customer record. Two bags leave the shelf: 42 becomes 40.',
    'The supplier delivers eight bags. Receiving stock brings the shelf from 40 to 48, ready for the next customer.'
  ];
  function showShopStep(step) {
    const index = Number(step);
    machine.dataset.flow = String(index);
    document.querySelectorAll('[data-flow-step]').forEach(item => item.setAttribute('aria-pressed', String(Number(item.dataset.flowStep) === index)));
    document.querySelector('.flow-description').textContent = descriptions[index];
    const stock = document.querySelector('.node-team strong');
    if (stock) stock.textContent = `${[42, 42, 40, 48][index]} bags on shelf`;
    const next = document.querySelector('.scene-pulse');
    if (next) next.firstChild.textContent = ['Serve customer ', 'Create the bill ', 'Receive delivery ', 'Meet the next customer '][index];
  }
  document.querySelectorAll('[data-flow-step]').forEach(button => button.addEventListener('click', () => showShopStep(button.dataset.flowStep)));
  document.querySelector('.scene-pulse')?.addEventListener('click', () => showShopStep((Number(machine.dataset.flow) + 1) % 4));
  document.querySelector('.scene-fold')?.addEventListener('click', () => showShopStep(0));
  const connection = document.querySelector('.connection-switch');
  connection?.addEventListener('click', () => {
    const online = connection.getAttribute('aria-checked') !== 'true';
    connection.setAttribute('aria-checked', String(online));
    document.querySelector('.sync-diagram').dataset.connection = online ? 'online' : 'offline';
    document.querySelector('.connection-label').textContent = online ? 'Connected' : 'Offline';
    document.querySelector('.connection-state-title').textContent = online ? 'Connection available' : 'Internet unavailable. Local work continues.';
    document.querySelector('.connection-state-copy').textContent = online ? 'Local work and synchronization can stay connected.' : 'The intended flow keeps essential records on device. Cloud synchronization waits for reconnection.';
  });
  const conversation = document.querySelector('.conversation');
  document.querySelectorAll('button[data-prompt]').forEach(button => button.addEventListener('click', () => {
    const dues = button.dataset.prompt === 'dues';
    conversation.dataset.prompt = button.dataset.prompt;
    document.querySelectorAll('button[data-prompt]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#copilot-prompt').textContent = dues ? '“Which customer balances should I review before following up?”' : '“What are my fast-moving items, and which customers have overdue balances?”';
    document.querySelector('#copilot-response-title').textContent = dues ? 'Start with the account, then review the next step.' : 'Here’s where you could focus next.';
  }));

  const stage = document.querySelector('.story-display');
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const states = [
    ['01 / STOCK', '42 → 40', 'Two bags sold. Available stock changes with the transaction.'],
    ['02 / THE LEDGER', 'One account.', 'The customer and their transaction history stay in the same story.'],
    ['03 / THE PEOPLE', 'A shared view.', 'Responsibilities follow the people doing the work.'],
    ['04 / THE NEXT STEP', 'See. Decide. Act.', 'Records become context for a recommendation you can review.']
  ];
  let currentChapter = -1;
  function selectChapter(index) {
    if (currentChapter === index) return;
    currentChapter = index;
    stage.dataset.storyStage = String(index);
    stage.querySelector('.story-display-label').textContent = states[index][0];
    stage.querySelector('.story-display-value').textContent = states[index][1];
    stage.querySelector('.story-display-copy').textContent = states[index][2];
    stage.querySelectorAll('.story-markers i').forEach((marker, i) => marker.classList.toggle('active', i === index));
    chapters.forEach((chapter, i) => chapter.classList.toggle('is-current', i === index));
  }
  selectChapter(0);

  // One scheduled frame per scroll burst. No idle animation loop, no scroll interception.
  let frame = 0;
  const progress = document.querySelector('.reading-progress i');
  const story = document.querySelector('.transaction-story');
  let storyVisible = false;
  function updateScroll() {
    frame = 0;
    if (document.hidden) return;
    const extent = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${extent > 0 ? Math.min(1, Math.max(0, scrollY / extent)) : 0})`;
    if (storyVisible && innerWidth > 800) {
      let nearest = 0;
      let distance = Infinity;
      chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const nextDistance = Math.abs(rect.top + rect.height / 2 - innerHeight * .52);
        if (nextDistance < distance) { nearest = index; distance = nextDistance; }
      });
      selectChapter(nearest);
    }
  }
  function scheduleScroll() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(updateScroll);
  }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });

  const scene = document.querySelector('[data-motion-scene]');
  let tiltFrame = 0;
  function resetTilt() {
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    machine.style.removeProperty('--tilt-x');
    machine.style.removeProperty('--tilt-y');
  }
  const motionToggle = document.querySelector('.motion-toggle');
  motionToggle?.addEventListener('click', () => {
    motionPaused = !motionPaused;
    root.classList.toggle('motion-paused', motionPaused);
    motionToggle.setAttribute('aria-pressed', String(motionPaused));
    motionToggle.textContent = motionPaused ? 'Resume motion' : 'Pause motion';
    resetTilt();
  });
  scene.addEventListener('pointermove', event => {
    if (motionPaused || reduced.matches || !finePointer.matches || !scene.classList.contains('scene-visible') || document.hidden) return;
    const rect = scene.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 5;
    const y = ((event.clientY - rect.top) / rect.height - .5) * -5;
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    tiltFrame = requestAnimationFrame(() => {
      machine.style.setProperty('--tilt-x', `${y.toFixed(2)}deg`);
      machine.style.setProperty('--tilt-y', `${x.toFixed(2)}deg`);
      tiltFrame = 0;
    });
  });
  scene.addEventListener('pointerleave', resetTilt);
  scene.addEventListener('focusin', resetTilt);

  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.target === scene) {
        scene.classList.toggle('scene-visible', entry.isIntersecting);
        if (!entry.isIntersecting) resetTilt();
      } else if (entry.target === story) {
        storyVisible = entry.isIntersecting;
        scheduleScroll();
      } else entry.target.classList.toggle('is-in-view', entry.isIntersecting);
    }), { threshold: 0 });
    visibility.observe(scene);
    visibility.observe(story);
    document.querySelectorAll('.section').forEach(section => visibility.observe(section));

    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      reveal.unobserve(entry.target);
    }), { threshold: .08 });
    document.querySelectorAll('.section-intro,.feature,.sector,.conversation,.sync-diagram,.ecosystem-diagram,.access-banner,.dashboard').forEach(element => {
      element.dataset.reveal = '';
      reveal.observe(element);
    });
    // Enable progressive motion only after observers are ready; without JS all content remains visible.
    root.classList.add('experience-ready');
  }
  function visibilityChanged() {
    root.classList.toggle('page-hidden', document.hidden);
    if (document.hidden) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      resetTilt();
    } else scheduleScroll();
  }
  document.addEventListener('visibilitychange', visibilityChanged);
  reduced.addEventListener('change', () => {
    resetTilt();
    if (reduced.matches) document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('is-revealed'));
  });
  visibilityChanged();
})();
