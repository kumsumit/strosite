'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('#navigation');
function closeMenu(restoreFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  mainNavigation.classList.remove('open');
  if (restoreFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  mainNavigation.classList.toggle('open', opening);
  if (opening) mainNavigation.querySelector('a')?.focus();
});
mainNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav') && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
});
window.matchMedia('(min-width: 941px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelectorAll('#year').forEach(year => { year.textContent = new Date().getFullYear(); });
// A sentinel toggles the sticky header without a continuous scroll handler.
if ('IntersectionObserver' in window) {
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:20px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(entries => {
    document.querySelector('.header')?.classList.toggle('scrolled', !entries[0].isIntersecting);
  }).observe(sentinel);
}
