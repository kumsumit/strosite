'use strict';
// Informational notices only: no registration, submission, or simulated product actions.
const dialog = document.querySelector('#info-dialog');
const notices = {
  access: ['An operating foundation taking shape.', 'Stromule is in development. Registration is not open. Pricing, launch timing, supported countries and languages have not been announced. This site does not collect sign-ups or payments. Check stromule.com for future availability updates.'],
  contact: ['Contact information', 'Stromule is a product of Kumpali Private Limited. A verified public contact channel has not yet been supplied for this website. Contact details will be added when confirmed. This site does not collect contact requests.']
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
// All content is visible without JavaScript. Native FAQ disclosures need no script.
if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('#navigation a')];
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -55% 0px' });
  links.forEach(link => { const section = document.getElementById(link.hash.slice(1)); if (section) observer.observe(section); });
}
