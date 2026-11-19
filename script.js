'use strict';
// Informational notices, plus the Contact Us form which submits to Forminit.
const dialog = document.querySelector('#info-dialog');
const notices = {
  access: ['An operating foundation taking shape.', 'Stromule is in development. Registration is not open. Pricing, launch timing, supported countries and languages have not been announced. This site does not collect sign-ups or payments. Check stromule.com for future availability updates.']
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

// Contact Us form (Forminit)
// Forminit form ID
const FORM_ID = 'yadflvn617u';
const contactDialog = document.querySelector('#contact-dialog');
const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');
document.querySelectorAll('[data-contact]').forEach(b => b.addEventListener('click', () => contactDialog.showModal()));
contactDialog.querySelector('.dialog-close').addEventListener('click', () => contactDialog.close());
contactDialog.addEventListener('click', event => { if (event.target === contactDialog) contactDialog.close(); });
let contactSending = false;
contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (contactSending) return;
  const form = event.currentTarget;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const fd = new FormData(form); // build before disabling anything
  if (!String(fd.get('fi-sender-phone') || '').trim()) fd.delete('fi-sender-phone');
  const name = String(fd.get('fi-sender-fullName') || '').replace(/[\u2018\u2019]/g, "'").trim();
  fd.set('fi-sender-fullName', name);
  const submit = form.querySelector('[type=submit]');
  contactSending = true; submit.disabled = true; contactStatus.textContent = 'Sending…';
  try {
    const { data, error } = await new Forminit().submit(FORM_ID, fd);
    if (!error && typeof data?.hashId === 'string') { form.reset(); contactStatus.textContent = 'Thank you! Your message has been sent.'; }
    else { console.error(error); contactStatus.textContent = 'Sorry, something went wrong. Please check your details and try again.'; }
  } catch (err) { console.error(err); contactStatus.textContent = 'Network error. Please try again.'; }
  finally { contactSending = false; submit.disabled = false; }
});
