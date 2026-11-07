'use strict';
(() => {
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

})();
